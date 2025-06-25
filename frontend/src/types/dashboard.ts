export interface DashboardStats {
  totalProjects: number;
  activeProjects: number;
  completedProjects: number;
  totalTasks: number;
  completedTasks: number;
  overdueTasks: number;
  tasksByStatus: TaskStatusCount[];
}

export interface TaskStatusCount {
  status: TaskStatus;
  count: number;
}

export interface ProjectProgress {
  projectId: number;
  projectName: string;
  progress: number;
  totalTasks: number;
  completedTasks: number;
}

export interface RecentActivity {
  id: number;
  userId: number;
  action: string;
  resourceType: string;
  resourceId?: number;
  description: string;
  createdAt: string;
  user: User;
}