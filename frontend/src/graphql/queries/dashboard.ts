import { gql } from '@apollo/client';

export const GET_DASHBOARD_STATS = gql`
  query GetDashboardStats {
    dashboardStats {
      totalProjects
      activeProjects
      completedProjects
      totalTasks
      completedTasks
      overdueTasks
      tasksByStatus
    }
  }
`;

export const GET_RECENT_ACTIVITIES = gql`
  query GetRecentActivities($limit: Int = 10) {
    recentActivities(limit: $limit) {
      id
      action
      resourceType
      resourceId
      description
      createdAt
      user {
        id
        username
        fullName
        avatarUrl
      }
    }
  }
`;