from typing import Optional, List
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.models.task import Task, TaskAssignment, TaskComment
from app.models.user import User

class TaskService:
    @staticmethod
    async def get_task_by_id(db: AsyncSession, task_id: int) -> Optional[Task]:
        result = await db.execute(select(Task).where(Task.id == task_id))
        return result.scalar_one_or_none()
    
    @staticmethod
    async def get_tasks_by_project(db: AsyncSession, project_id: int) -> List[Task]:
        result = await db.execute(select(Task).where(Task.project_id == project_id))
        return result.scalars().all()
    
    @staticmethod
    async def get_tasks_by_user(db: AsyncSession, user_id: int) -> List[Task]:
        result = await db.execute(
            select(Task).join(
                TaskAssignment, Task.id == TaskAssignment.task_id
            ).where(TaskAssignment.user_id == user_id)
        )
        return result.scalars().all()
    
    @staticmethod
    async def create_task(
        db: AsyncSession,
        title: str,
        project_id: int,
        created_by: int,
        description: Optional[str] = None,
        status: str = "todo",
        priority: str = "medium"
    ) -> Task:
        task = Task(
            title=title,
            description=description,
            status=status,
            priority=priority,
            project_id=project_id,
            created_by=created_by
        )
        db.add(task)
        await db.commit()
        await db.refresh(task)
        return task
    
    @staticmethod
    async def assign_task(
        db: AsyncSession,
        task_id: int,
        user_id: int,
        assigned_by: int
    ) -> TaskAssignment:
        assignment = TaskAssignment(
            task_id=task_id,
            user_id=user_id,
            assigned_by=assigned_by
        )
        db.add(assignment)
        await db.commit()
        await db.refresh(assignment)
        return assignment
    
    @staticmethod
    async def get_task_assignees(db: AsyncSession, task_id: int) -> List[User]:
        result = await db.execute(
            select(User).join(
                TaskAssignment, User.id == TaskAssignment.user_id
            ).where(TaskAssignment.task_id == task_id)
        )
        return result.scalars().all()