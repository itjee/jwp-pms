export interface Role {
  id: number;
  name: string;
  description?: string;
  isActive: boolean;
  permissions: Permission[];
}

export interface Permission {
  id: number;
  name: string;
  resource: string;
  action: string;
  description?: string;
}

export interface UserRole {
  id: number;
  userId: number;
  roleId: number;
  projectId?: number;
  role: Role;
}
