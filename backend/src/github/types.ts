/**
 * GitHub API TypeScript definitions and types
 */

export interface GitHubUser {
  login: string;
  id: number;
  avatar_url: string;
  url: string;
  html_url: string;
  followers: number;
  following: number;
  created_at: string;
  updated_at: string;
  public_repos: number;
  type: 'User' | 'Organization';
}

export interface GitHubRepository {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  url: string;
  html_url: string;
  created_at: string;
  updated_at: string;
  pushed_at: string | null;
  homepage: string | null;
  size: number;
  language: string | null;
  fork: boolean;
  forks_count: number;
  stargazers_count: number;
  watchers_count: number;
  open_issues_count: number;
  topics: string[];
}

export interface GitHubCommit {
  sha: string;
  url: string;
  html_url: string;
  commit: {
    author: {
      name: string;
      email: string;
      date: string;
    };
    message: string;
  };
  author: {
    login: string;
  } | null;
}

export interface GitHubPullRequest {
  id: number;
  number: number;
  title: string;
  state: 'open' | 'closed';
  created_at: string;
  updated_at: string;
  closed_at: string | null;
  user: {
    login: string;
  };
}

export interface GitHubIssue {
  id: number;
  number: number;
  title: string;
  state: 'open' | 'closed';
  created_at: string;
  updated_at: string;
  closed_at: string | null;
  user: {
    login: string;
  };
}

export interface GitHubFileContent {
  name: string;
  path: string;
  sha: string;
  size: number;
  type: 'file' | 'dir';
  content?: string;
  encoding?: string;
}

export interface GitHubTreeItem {
  path: string;
  mode: string;
  type: 'blob' | 'tree';
  sha: string;
  size?: number;
  url: string;
}

export interface GitHubLanguages {
  [language: string]: number;
}

/**
 * GraphQL response types
 */
export interface GraphQLResponse<T> {
  data: T;
  errors?: Array<{ message: string }>;
}

export interface UserRepositoriesData {
  user: {
    repositories: {
      nodes: Array<{
        name: string;
        description: string | null;
        url: string;
        createdAt: string;
        pushedAt: string | null;
        isFork: boolean;
        forkCount: number;
        stargazerCount: number;
        issues: {
          totalCount: number;
        };
        pullRequests: {
          totalCount: number;
        };
        defaultBranchRef: {
          target: {
            history: {
              totalCount: number;
              edges: Array<{
                node: {
                  committedDate: string;
                };
              }>;
            };
          };
        };
        languages: {
          nodes: Array<{
            name: string;
            size: number;
          }>;
        };
        readme: {
          text: string | null;
        } | null;
      }>;
      pageInfo: {
        hasNextPage: boolean;
        endCursor: string | null;
      };
      totalCount: number;
    };
  };
}

export interface CommitHistoryData {
  repository: {
    defaultBranchRef: {
      target: {
        history: {
          edges: Array<{
            node: {
              committedDate: string;
              author: {
                name: string;
              };
            };
          }>;
          pageInfo: {
            hasNextPage: boolean;
            endCursor: string | null;
          };
          totalCount: number;
        };
      };
    };
  };
}
