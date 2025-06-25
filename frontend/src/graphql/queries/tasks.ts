import { gql } from '@apollo/client';

export const GET_TASKS = gql`
  query GetTasks($projectId: Int) {
    tasks(projectId: $projectId) {
      id
      title
      description
      status
      priority
      estimatedHours
      actualHours
      startDate
      dueDate
      completedAt
      createdAt
      updatedAt
      project {
        id
        name
      }
      assignees {
        id
        username
        fullName
        avatarUrl
      }
    }
  }
`;

export const GET_TASK = gql`
  query GetTask($taskId: Int!) {
    task(taskId: $taskId) {
      id
      title
      description
      status
      priority
      estimatedHours
      actualHours
      startDate
      dueDate
      completedAt
      createdAt
      updatedAt
      project {
        id
        name
      }
      assignees {
        id
        username
        fullName
        avatarUrl
      }
    }
  }
`;