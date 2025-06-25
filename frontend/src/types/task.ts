export interface Task {
  id: number;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: Priority;
  project: Project;
  parentTaskId?: number;
  estimatedHours?: number;
  actualHours?: number;
  startDate?: string;
  dueDate?: string;
  completedAt?: string;
  createdAt: string;
  updatedAt?: string;
  assignees: User[];
  tags: Tag[];
}

export type TaskStatus = 'todo' | 'in_progress' | 'in_review' | 'done' | 'blocked';

export interface TaskInput {
  title: string;
  description?: string;
  status?: TaskStatus;
  priority?: Priority;
  projectId: number;
  parentTaskId?: number;
  estimatedHours?: number;
  startDate?: string;
  dueDate?: string;
}

export interface TaskAssignment {
  id: number;
  taskId: number;
  userId: number;
  assignedBy: number;
  assignedAt: string;
  user: User;
}

export interface TaskComment {
  id: number;
  taskId: number;
  author: User;
  content: string;
  parentId?: number;
  createdAt: string;
  updatedAt?: string;
  replies?: TaskComment[];
}

export interface Tag {
  id: number;
  name: string;
  color: string;
  createdAt: string;
}

export interface TaskAttachment {
  id: number;
  taskId: number;
  filename: string;
  filePath: string;
  fileSize: number;
  mimeType: string;
  uploadedBy: number;
  uploadedAt: string;
}