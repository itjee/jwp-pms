import { gql } from '@apollo/client';

export const GET_PROJECTS = gql`
  query GetProjects {
    projects {
      id
      name
      description
      status
      priority
      startDate
      endDate
      progress
      budget
      createdAt
      updatedAt
      creator {
        id
        username
        fullName
        avatarUrl
      }
      members {
        id
        username
        fullName
        avatarUrl
      }
    }
  }
`;

export const GET_PROJECT = gql`
  query GetProject($projectId: Int!) {
    project(projectId: $projectId) {
      id
      name
      description
      status
      priority
      startDate
      endDate
      progress
      budget
      createdAt
      updatedAt
      creator {
        id
        username
        fullName
        avatarUrl
      }
      members {
        id
        username
        fullName
        avatarUrl
        role
      }
    }
  }
`;