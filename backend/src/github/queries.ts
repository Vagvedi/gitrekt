/**
 * GraphQL queries for GitHub API
 * These are optimized queries to fetch repository and commit data efficiently
 */

/**
 * Query to fetch user repositories with detailed metadata
 * Includes languages, issues, PRs, and commit history
 */
export const USER_REPOSITORIES_QUERY = `
  query GetUserRepositories($login: String!, $after: String) {
    user(login: $login) {
      repositories(first: 100, after: $after, affiliations: OWNER) {
        nodes {
          name
          description
          url
          createdAt
          pushedAt
          isFork
          forkCount
          stargazerCount
          isArchived
          diskUsage
          issues(states: [OPEN, CLOSED]) {
            totalCount
          }
          pullRequests(states: [OPEN, CLOSED]) {
            totalCount
          }
          defaultBranchRef {
            target {
              ... on Commit {
                history(first: 1) {
                  totalCount
                  edges {
                    node {
                      committedDate
                    }
                  }
                }
              }
            }
          }
          languages(first: 10) {
            nodes {
              name
              size
            }
          }
          readme: object(expression: "HEAD:README.md") {
            ... on Blob {
              text
            }
          }
        }
        pageInfo {
          hasNextPage
          endCursor
        }
        totalCount
      }
    }
  }
`;

/**
 * Query to fetch detailed commit history for a specific repository
 * Used to analyze commit patterns and gaps
 */
export const COMMIT_HISTORY_QUERY = `
  query GetCommitHistory($owner: String!, $name: String!, $after: String) {
    repository(owner: $owner, name: $name) {
      defaultBranchRef {
        target {
          ... on Commit {
            history(first: 100, after: $after) {
              edges {
                node {
                  committedDate
                  author {
                    name
                    email
                  }
                  message
                }
              }
              pageInfo {
                hasNextPage
                endCursor
              }
              totalCount
            }
          }
        }
      }
    }
  }
`;

/**
 * Query to fetch pull requests for collaboration analysis
 */
export const PULL_REQUESTS_QUERY = `
  query GetPullRequests($owner: String!, $name: String!, $after: String) {
    repository(owner: $owner, name: $name) {
      pullRequests(first: 100, after: $after, states: [OPEN, CLOSED]) {
        edges {
          node {
            createdAt
            closedAt
            state
            author {
              login
            }
          }
        }
        pageInfo {
          hasNextPage
          endCursor
        }
        totalCount
      }
    }
  }
`;

/**
 * Query to fetch issues for engagement analysis
 */
export const ISSUES_QUERY = `
  query GetIssues($owner: String!, $name: String!, $after: String) {
    repository(owner: $owner, name: $name) {
      issues(first: 100, after: $after, states: [OPEN, CLOSED]) {
        edges {
          node {
            createdAt
            closedAt
            state
          }
        }
        pageInfo {
          hasNextPage
          endCursor
        }
        totalCount
      }
    }
  }
`;
