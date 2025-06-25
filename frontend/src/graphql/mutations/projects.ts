import { gql } from '@apollo/client';

export const CREATE_PROJECT = gql`
  mutation CreateProject($projectInput: ProjectInput!) {
    createProject(projectInput: $projectInput) {
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

export const UPDATE_PROJECT = gql`
  mutation UpdateProject($projectId: Int!, $projectInput: ProjectInput!) {
    updateProject(projectId: $projectId, projectInput: $projectInput) {
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

export const DELETE_PROJECT = gql`
  mutation DeleteProject($projectId: Int!) {
    deleteProject(projectId: $projectId)
  }
`;
