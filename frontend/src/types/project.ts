export interface Project {
  id: number;
  name: string;
  description?: string;
  status: ProjectStatus;
  priority: Priority;
  startDate?: string;
  endDate?: string;
  progress: number;
  budget?: number;
  createdAt: string;
  updatedAt?: string;
  creator: User;
  members: User[];
}

export type ProjectStatus = 'planning' | 'in_progress' | 'on_hold' | 'completed' | 'cancelled';

export interface ProjectInput {
  name: string;
  description?: string;
  status?: ProjectStatus;
  priority?: Priority;
  startDate?: string;
  endDate?: string;
  budget?: number;
}

export interface ProjectMember {
  id: number;
  projectId: number;
  userId: number;
  role: string;
  joinedAt: string;
  user: User;
}

export interface ProjectComment {
  id: number;
  projectId: number;
  author: User;
  content: string;
  parentId?: number;
  createdAt: string;
  updatedAt?: string;
  replies?: ProjectComment[];
}

export interface ProjectAttachment {
  id: number;
  projectId: number;
  filename: string;
  filePath: string;
  fileSize: number;
  mimeType: string;
  uploadedBy: number;
  uploadedAt: string;
}
