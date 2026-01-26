import { Octokit } from '@octokit/rest';
import { graphql as octokitGraphql } from '@octokit/graphql';
import { getEnv } from '../utils/env.js';
import { createChildLogger } from '../utils/logger.js';
import {
  GitHubUser,
  GitHubRepository,
  GitHubCommit,
  UserRepositoriesData,
  CommitHistoryData,
  GraphQLResponse,
} from './types.js';
import {
  USER_REPOSITORIES_QUERY,
  COMMIT_HISTORY_QUERY,
  PULL_REQUESTS_QUERY,
  ISSUES_QUERY,
} from './queries.js';

const logger = createChildLogger({ module: 'GitHub Client' });

/**
 * GitHub API Client
 * Handles REST and GraphQL requests to GitHub API with rate limiting
 */
export class GitHubClient {
  private rest: Octokit;
  private graphqlClient: typeof octokitGraphql;
  private env: ReturnType<typeof getEnv>;

  constructor() {
    this.env = getEnv();
    this.rest = new Octokit({
      auth: this.env.GITHUB_TOKEN,
    });
    this.graphqlClient = octokitGraphql.defaults({
      headers: {
        authorization: `token ${this.env.GITHUB_TOKEN}`,
      },
    });
  }

  /**
   * Fetch user profile information
   */
  async getUser(username: string): Promise<GitHubUser> {
    try {
      const response = await this.rest.users.getByUsername({
        username,
      });
      logger.debug({ username }, 'Fetched user profile');
      const data = response.data as unknown as GitHubUser;
      return data;
    } catch (error) {
      logger.error({ username, error }, 'Failed to fetch user');
      throw new Error(`Failed to fetch user: ${username}`);
    }
  }

  /**
   * Fetch all repositories for a user using GraphQL
   * Handles pagination automatically
   */
  async getUserRepositories(username: string): Promise<GitHubRepository[]> {
    const repositories: GitHubRepository[] = [];
    let hasNextPage = true;
    let endCursor: string | null = null;

    while (hasNextPage) {
      try {
        const response = (await this.graphqlClient(USER_REPOSITORIES_QUERY, {
          login: username,
          after: endCursor,
        })) as unknown as GraphQLResponse<UserRepositoriesData>;

        if (response.errors) {
          throw new Error(response.errors[0]?.message);
        }

        const repos = response.data.user.repositories;
        const { nodes, pageInfo, totalCount } = repos;

        logger.debug(
          { username, count: nodes.length, total: totalCount },
          'Fetched repositories page'
        );

        // Transform GraphQL response to REST format
        repositories.push(
          ...nodes.map((repo) => ({
            id: 0, // GraphQL doesn't return ID
            name: repo.name,
            full_name: `${username}/${repo.name}`,
            description: repo.description,
            url: repo.url,
            html_url: `https://github.com/${username}/${repo.name}`,
            created_at: repo.createdAt,
            updated_at: repo.pushedAt || repo.createdAt,
            pushed_at: repo.pushedAt,
            homepage: null,
            size: 0,
            language: null, // Will be set separately
            fork: repo.isFork,
            forks_count: repo.forkCount,
            stargazers_count: repo.stargazerCount,
            watchers_count: repo.stargazerCount,
            open_issues_count: repo.issues.totalCount,
            topics: [],
          }))
        );

        hasNextPage = pageInfo.hasNextPage;
        endCursor = pageInfo.endCursor;
      } catch (error) {
        logger.error({ username, error }, 'Failed to fetch repositories page');
        throw new Error(`Failed to fetch repositories for ${username}`);
      }
    }

    return repositories;
  }

  /**
   * Fetch commit history for a specific repository
   * Used to analyze commit patterns
   */
  async getCommitHistory(
    owner: string,
    repo: string
  ): Promise<{ commits: GitHubCommit[]; totalCount: number }> {
    const commits: GitHubCommit[] = [];
    let hasNextPage = true;
    let endCursor: string | null = null;
    let totalCount = 0;

    while (hasNextPage) {
      try {
        const response = (await this.graphqlClient(COMMIT_HISTORY_QUERY, {
          owner,
          name: repo,
          after: endCursor,
        })) as unknown as GraphQLResponse<CommitHistoryData>;

        if (response.errors) {
          throw new Error(response.errors[0]?.message);
        }

        const history = response.data.repository.defaultBranchRef?.target?.history;
        if (!history) {
          logger.warn({ owner, repo }, 'No commit history found');
          return { commits, totalCount };
        }

        totalCount = history.totalCount;
        logger.debug(
          { owner, repo, count: history.edges.length, total: totalCount },
          'Fetched commit history page'
        );

        commits.push(
          ...history.edges.map((edge: unknown) => {
            const edgeData = edge as {
              node: {
                committedDate: string;
                author: { name: string };
              };
            };
            return {
              sha: '', // GraphQL doesn't return SHA in this query
              url: '',
              html_url: '',
              commit: {
                author: {
                  name: edgeData.node.author.name,
                  email: '',
                  date: edgeData.node.committedDate,
                },
                message: '',
              },
              author: null,
            };
          })
        );

        hasNextPage = history.pageInfo.hasNextPage;
        endCursor = history.pageInfo.endCursor;
      } catch (error) {
        logger.error({ owner, repo, error }, 'Failed to fetch commit history');
        // Don't throw, return what we have
        break;
      }
    }

    return { commits, totalCount };
  }

  /**
   * Get file content from a repository
   */
  async getFileContent(owner: string, repo: string, path: string): Promise<string | null> {
    try {
      const response = await this.rest.repos.getContent({
        owner,
        repo,
        path,
      });

      if (Array.isArray(response.data)) {
        return null;
      }

      const data = response.data as unknown as {
        type?: string;
        content?: string;
      };

      if (data.type !== 'file' || !data.content) {
        return null;
      }

      return Buffer.from(data.content, 'base64').toString('utf-8');
    } catch (error) {
      logger.debug({ owner, repo, path }, 'File not found or inaccessible');
      return null;
    }
  }

  /**
   * Get README content
   */
  async getReadme(owner: string, repo: string): Promise<string | null> {
    return this.getFileContent(owner, repo, 'README.md');
  }

  /**
   * Get language breakdown for repository
   */
  async getLanguages(owner: string, repo: string): Promise<Record<string, number>> {
    try {
      const response = await this.rest.repos.listLanguages({
        owner,
        repo,
      });
      logger.debug({ owner, repo }, 'Fetched language breakdown');
      return response.data;
    } catch (error) {
      logger.debug({ owner, repo, error }, 'Failed to fetch languages');
      return {};
    }
  }

  /**
   * Check rate limit status
   */
  async getRateLimit(): Promise<{
    remaining: number;
    limit: number;
    reset: number;
  }> {
    try {
      const response = await this.rest.rateLimit.get();
      return {
        remaining: response.data.resources.core.remaining,
        limit: response.data.resources.core.limit,
        reset: response.data.resources.core.reset,
      };
    } catch (error) {
      logger.error({ error }, 'Failed to fetch rate limit');
      return { remaining: 0, limit: 0, reset: 0 };
    }
  }
}

// Singleton instance
let clientInstance: GitHubClient | null = null;

export function getGitHubClient(): GitHubClient {
  if (!clientInstance) {
    clientInstance = new GitHubClient();
  }
  return clientInstance;
}
