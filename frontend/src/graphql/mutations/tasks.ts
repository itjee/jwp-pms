import { gql } from '@apollo/client';

export const CREATE_TASK = gql`
  mutation CreateTask($taskInput: TaskInput!) {
    createTask(taskInput: $taskInput) {
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

export const UPDATE_TASK = gql`
  mutation UpdateTask($taskId: Int!, $taskInput: TaskInput!) {
    updateTask(taskId: $taskId, taskInput: $taskInput) {
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

export const ASSIGN_TASK = gql`
  mutation AssignTask($taskId: Int!, $userId: Int!) {
    assignTask(taskId: $taskId, userId: $userId)
  }
`;

export const DELETE_TASK = gql`
  mutation DeleteTask($taskId: Int!) {
    deleteTask(taskId: $taskId)
  }
`;