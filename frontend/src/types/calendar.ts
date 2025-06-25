export interface Calendar {
  id: number;
  name: string;
  description?: string;
  color: string;
  isDefault: boolean;
  createdAt: string;
}

export interface Event {
  id: number;
  title: string;
  description?: string;
  startTime: string;
  endTime: string;
  isAllDay: boolean;
  location?: string;
  calendar: Calendar;
  project?: Project;
  task?: Task;
  createdAt: string;
  updatedAt?: string;
}

export interface EventInput {
  title: string;
  description?: string;
  startTime: string;
  endTime: string;
  isAllDay?: boolean;
  location?: string;
  calendarId: number;
  projectId?: number;
  taskId?: number;
}