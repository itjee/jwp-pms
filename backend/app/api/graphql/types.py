import strawberry
from typing import List, Optional
from datetime import datetime
from enum import Enum

@strawberry.enum
class UserRoleEnum(Enum):
    ADMIN = "admin"
    MANAGER = "manager"
    DEVELOPER = "developer"
    VIEWER = "viewer"

@strawberry.enum
class ProjectStatusEnum(Enum):
    PLANNING = "planning"
    IN_PROGRESS = "in_progress"
    ON_HOLD = "on_hold"
    COMPLETED = "completed"
    CANCELLED = "cancelled"

@strawberry.enum
class TaskStatusEnum(Enum):
    TODO = "todo"
    IN_PROGRESS = "in_progress"
    IN_REVIEW = "in_review"
    DONE = "done"
    BLOCKED = "blocked"

@strawberry.type
class User:
    id: int
    email: str
    username: str
    full_name: Optional[str] = None
    role: UserRoleEnum
    avatar_url: Optional[str] = None
    phone: Optional[str] = None
    department: Optional[str] = None
    position: Optional[str] = None
    is_active: bool
    created_at: datetime
    updated_at: Optional[datetime] = None

@strawberry.type
class Project:
    id: int
    name: str
    description: Optional[str] = None
    status: ProjectStatusEnum
    priority: str
    start_date: Optional[datetime] = None
    end_date: Optional[datetime] = None
    progress: int
    budget: Optional[int] = None
    created_at: datetime
    updated_at: Optional[datetime] = None
    creator: User
    members: List[User]

@strawberry.type
class Task:
    id: int
    title: str
    description: Optional[str] = None
    status: TaskStatusEnum
    priority: str
    project: Project
    estimated_hours: Optional[int] = None
    actual_hours: Optional[int] = None
    start_date: Optional[datetime] = None
    due_date: Optional[datetime] = None
    completed_at: Optional[datetime] = None
    created_at: datetime
    updated_at: Optional[datetime] = None
    assignees: List[User]

@strawberry.type
class Comment:
    id: int
    content: str
    author: User
    created_at: datetime
    updated_at: Optional[datetime] = None

@strawberry.type
class Calendar:
    id: int
    name: str
    description: Optional[str] = None
    color: str
    is_default: bool
    created_at: datetime

@strawberry.type
class Event:
    id: int
    title: str
    description: Optional[str] = None
    start_time: datetime
    end_time: datetime
    is_all_day: bool
    location: Optional[str] = None
    calendar: Calendar
    project: Optional[Project] = None
    task: Optional[Task] = None

@strawberry.type
class DashboardStats:
    total_projects: int
    active_projects: int
    completed_projects: int
    total_tasks: int
    completed_tasks: int
    overdue_tasks: int
    tasks_by_status: List[str]

@strawberry.input
class UserInput:
    email: str
    username: str
    full_name: Optional[str] = None
    password: str
    role: Optional[UserRoleEnum] = UserRoleEnum.DEVELOPER
    phone: Optional[str] = None
    department: Optional[str] = None
    position: Optional[str] = None

@strawberry.input
class ProjectInput:
    name: str
    description: Optional[str] = None
    status: Optional[ProjectStatusEnum] = ProjectStatusEnum.PLANNING
    priority: Optional[str] = "medium"
    start_date: Optional[datetime] = None
    end_date: Optional[datetime] = None
    budget: Optional[int] = None

@strawberry.input
class TaskInput:
    title: str
    description: Optional[str] = None
    status: Optional[TaskStatusEnum] = TaskStatusEnum.TODO
    priority: Optional[str] = "medium"
    project_id: int
    estimated_hours: Optional[int] = None
    start_date: Optional[datetime] = None
    due_date: Optional[datetime] = None

@strawberry.input
class CommentInput:
    content: str
    parent_id: Optional[int] = None

@strawberry.input
class EventInput:
    title: str
    description: Optional[str] = None
    start_time: datetime
    end_time: datetime
    is_all_day: Optional[bool] = False
    location: Optional[str] = None
    calendar_id: int
    project_id: Optional[int] = None
    task_id: Optional[int] = None