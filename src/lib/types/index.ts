// User Types
export interface User {
  id: string;
  email: string;
  name: string;
  avatarUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Workspace {
  id: string;
  name: string;
  description?: string;
  ownerId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface WorkspaceMember {
  id: string;
  workspaceId: string;
  userId: string;
  role: 'admin' | 'member';
  joinedAt: Date;
  user?: User;
}

export interface Board {
  id: string;
  workspaceId: string;
  name: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
  columns?: Column[];
}

export interface Column {
  id: string;
  boardId: string;
  name: string;
  position: number;
  tasks?: Task[];
}

export type TaskPriority = 'low' | 'medium' | 'high';

export interface Task {
  id: string;
  columnId: string;
  title: string;
  description?: string;
  assigneeId?: string;
  priority: TaskPriority;
  position: number;
  createdById: string;
  createdAt: Date;
  updatedAt: Date;
  assignee?: User;
}

export interface Comment {
  id: string;
  taskId: string;
  userId: string;
  content: string;
  createdAt: Date;
  user?: User;
}

export interface Notification {
  id: string;
  userId: string;
  type: 'assigned' | 'moved' | 'commented';
  taskId?: string;
  read: boolean;
  createdAt: Date;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}
