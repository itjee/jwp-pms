from typing import Optional

import strawberry
from app.api.graphql.types import (
    Comment,
    CommentInput,
    Event,
    EventInput,
    Project,
    ProjectInput,
    Task,
    TaskInput,
    User,
    UserInput,
)
from app.core.dependencies import get_current_active_user, get_db
from app.core.security import create_access_token, get_password_hash, verify_password
from app.models import calendar as calendar_models
from app.models import project as project_models
from app.models import task as task_models
from app.models import user as user_models
from fastapi import Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

# from app.utils.logger import log_user_activity
try:
    from app.utils.logger import log_user_activity
except ImportError:

    def log_user_activity(*args, **kwargs):
        pass  # Dummy logger for development if import fails


@strawberry.type
class AuthResponse:
    user: User
    access_token: str
    token_type: str = "bearer"


@strawberry.type
class Mutation:
    @strawberry.field
    async def register(
        self, info, user_input: UserInput, db: AsyncSession = Depends(get_db)
    ) -> AuthResponse:
        # 이메일 중복 확인
        existing_user = await db.execute(
            select(user_models.User).where(user_models.User.email == user_input.email)
        )
        if existing_user.scalar_one_or_none():
            raise HTTPException(status_code=400, detail="Email already registered")

        # 사용자명 중복 확인
        existing_username = await db.execute(
            select(user_models.User).where(
                user_models.User.username == user_input.username
            )
        )
        if existing_username.scalar_one_or_none():
            raise HTTPException(status_code=400, detail="Username already taken")

        # 새 사용자 생성
        hashed_password = get_password_hash(user_input.password)
        new_user = user_models.User(
            email=user_input.email,
            username=user_input.username,
            full_name=user_input.full_name,
            hashed_password=hashed_password,
            role=user_input.role,
            phone=user_input.phone,
            department=user_input.department,
            position=user_input.position,
        )

        db.add(new_user)
        await db.commit()
        await db.refresh(new_user)

        # JWT 토큰 생성
        access_token = create_access_token(subject=new_user.id)

        # 활동 로그
        log_user_activity(
            user_id=new_user.id,
            action="user_registered",
            description="User registered successfully",
        )

        return AuthResponse(
            user=User(
                id=new_user.id,
                email=new_user.email,
                username=new_user.username,
                full_name=new_user.full_name,
                role=new_user.role,
                avatar_url=new_user.avatar_url,
                phone=new_user.phone,
                department=new_user.department,
                position=new_user.position,
                is_active=new_user.is_active,
                created_at=new_user.created_at,
                updated_at=new_user.updated_at,
            ),
            access_token=access_token,
        )

    @strawberry.field
    async def login(
        self,
        info,
        username_or_email: str,
        password: str,
        db: AsyncSession = Depends(get_db),
    ) -> AuthResponse:
        # 사용자 찾기 (이메일 또는 사용자명으로)
        user_result = await db.execute(
            select(user_models.User).where(
                (user_models.User.email == username_or_email)
                | (user_models.User.username == username_or_email)
            )
        )
        user = user_result.scalar_one_or_none()

        if not user or not verify_password(password, user.hashed_password):
            raise HTTPException(
                status_code=400, detail="Incorrect email/username or password"
            )

        if not user.is_active:
            raise HTTPException(status_code=400, detail="Inactive user")

        # JWT 토큰 생성
        access_token = create_access_token(subject=user.id)

        # 마지막 로그인 시간 업데이트
        user.last_login = func.now()
        await db.commit()

        # 활동 로그
        log_user_activity(
            user_id=user.id,
            action="user_login",
            description="User logged in successfully",
        )

        return AuthResponse(
            user=User(
                id=user.id,
                email=user.email,
                username=user.username,
                full_name=user.full_name,
                role=user.role,
                avatar_url=user.avatar_url,
                phone=user.phone,
                department=user.department,
                position=user.position,
                is_active=user.is_active,
                created_at=user.created_at,
                updated_at=user.updated_at,
            ),
            access_token=access_token,
        )

    @strawberry.field
    async def create_project(
        self,
        info,
        project_input: ProjectInput,
        db: AsyncSession = Depends(get_db),
        current_user: user_models.User = Depends(get_current_active_user),
    ) -> Project:
        new_project = project_models.Project(
            name=project_input.name,
            description=project_input.description,
            status=project_input.status,
            priority=project_input.priority,
            start_date=project_input.start_date,
            end_date=project_input.end_date,
            budget=project_input.budget,
            creator_id=current_user.id,
        )

        db.add(new_project)
        await db.commit()
        await db.refresh(new_project)

        # 프로젝트 생성자를 멤버로 추가
        project_member = project_models.ProjectMember(
            project_id=new_project.id, user_id=current_user.id, role="lead"
        )
        db.add(project_member)
        await db.commit()

        # 활동 로그
        log_user_activity(
            user_id=current_user.id,
            action="project_created",
            resource_type="project",
            resource_id=new_project.id,
            description=f"Created project: {new_project.name}",
        )

        return Project(
            id=new_project.id,
            name=new_project.name,
            description=new_project.description,
            status=new_project.status,
            priority=new_project.priority,
            start_date=new_project.start_date,
            end_date=new_project.end_date,
            progress=new_project.progress,
            budget=new_project.budget,
            created_at=new_project.created_at,
            updated_at=new_project.updated_at,
            creator=User(
                id=current_user.id,
                email=current_user.email,
                username=current_user.username,
                full_name=current_user.full_name,
                role=current_user.role,
                avatar_url=current_user.avatar_url,
                phone=current_user.phone,
                department=current_user.department,
                position=current_user.position,
                is_active=current_user.is_active,
                created_at=current_user.created_at,
                updated_at=current_user.updated_at,
            ),
            members=[
                User(
                    id=current_user.id,
                    email=current_user.email,
                    username=current_user.username,
                    full_name=current_user.full_name,
                    role=current_user.role,
                    avatar_url=current_user.avatar_url,
                    phone=current_user.phone,
                    department=current_user.department,
                    position=current_user.position,
                    is_active=current_user.is_active,
                    created_at=current_user.created_at,
                    updated_at=current_user.updated_at,
                )
            ],
        )

    @strawberry.field
    async def update_project(
        self,
        info,
        project_id: int,
        project_input: ProjectInput,
        db: AsyncSession = Depends(get_db),
        current_user: user_models.User = Depends(get_current_active_user),
    ) -> Optional[Project]:
        project_result = await db.execute(
            select(project_models.Project).where(
                project_models.Project.id == project_id
            )
        )
        project = project_result.scalar_one_or_none()

        if not project:
            raise HTTPException(status_code=404, detail="Project not found")

        # 권한 확인 (프로젝트 생성자 또는 멤버인지)
        # 권한 로직 구현 필요...

        # 프로젝트 업데이트
        if project_input.name:
            project.name = project_input.name
        if project_input.description is not None:
            project.description = project_input.description
        if project_input.status:
            project.status = project_input.status
        if project_input.priority:
            project.priority = project_input.priority
        if project_input.start_date:
            project.start_date = project_input.start_date
        if project_input.end_date:
            project.end_date = project_input.end_date
        if project_input.budget is not None:
            project.budget = project_input.budget

        await db.commit()
        await db.refresh(project)

        # 활동 로그
        log_user_activity(
            user_id=current_user.id,
            action="project_updated",
            resource_type="project",
            resource_id=project.id,
            description=f"Updated project: {project.name}",
        )

        # Creator와 Members 로드하여 반환 (구현 필요)
        # ...

        return None  # 임시 반환

    @strawberry.field
    async def delete_project(
        self,
        info,
        project_id: int,
        db: AsyncSession = Depends(get_db),
        current_user: user_models.User = Depends(get_current_active_user),
    ) -> bool:
        project_result = await db.execute(
            select(project_models.Project).where(
                project_models.Project.id == project_id
            )
        )
        project = project_result.scalar_one_or_none()

        if not project:
            raise HTTPException(status_code=404, detail="Project not found")

        # 권한 확인 (프로젝트 생성자만 삭제 가능)
        if project.creator_id != current_user.id:
            raise HTTPException(status_code=403, detail="Not enough permissions")

        await db.delete(project)
        await db.commit()

        # 활동 로그
        log_user_activity(
            user_id=current_user.id,
            action="project_deleted",
            resource_type="project",
            resource_id=project_id,
            description=f"Deleted project: {project.name}",
        )

        return True

    @strawberry.field
    async def create_task(
        self,
        info,
        task_input: TaskInput,
        db: AsyncSession = Depends(get_db),
        current_user: user_models.User = Depends(get_current_active_user),
    ) -> Task:
        # 프로젝트 존재 확인
        project_result = await db.execute(
            select(project_models.Project).where(
                project_models.Project.id == task_input.project_id
            )
        )
        project = project_result.scalar_one_or_none()

        if not project:
            raise HTTPException(status_code=404, detail="Project not found")

        new_task = task_models.Task(
            title=task_input.title,
            description=task_input.description,
            status=task_input.status,
            priority=task_input.priority,
            project_id=task_input.project_id,
            estimated_hours=task_input.estimated_hours,
            start_date=task_input.start_date,
            due_date=task_input.due_date,
            created_by=current_user.id,
        )

        db.add(new_task)
        await db.commit()
        await db.refresh(new_task)

        # 활동 로그
        log_user_activity(
            user_id=current_user.id,
            action="task_created",
            resource_type="task",
            resource_id=new_task.id,
            description=f"Created task: {new_task.title}",
        )

        # Task 반환 (Project, Assignees 포함) - 구현 필요
        # ...

        return None  # 임시 반환

    @strawberry.field
    async def assign_task(
        self,
        info,
        task_id: int,
        user_id: int,
        db: AsyncSession = Depends(get_db),
        current_user: user_models.User = Depends(get_current_active_user),
    ) -> bool:
        # Task 존재 확인
        task_result = await db.execute(
            select(task_models.Task).where(task_models.Task.id == task_id)
        )
        task = task_result.scalar_one_or_none()

        if not task:
            raise HTTPException(status_code=404, detail="Task not found")

        # 사용자 존재 확인
        user_result = await db.execute(
            select(user_models.User).where(user_models.User.id == user_id)
        )
        user = user_result.scalar_one_or_none()

        if not user:
            raise HTTPException(status_code=404, detail="User not found")

        # 이미 할당되어 있는지 확인
        existing_assignment = await db.execute(
            select(task_models.TaskAssignment).where(
                (task_models.TaskAssignment.task_id == task_id)
                & (task_models.TaskAssignment.user_id == user_id)
            )
        )

        if existing_assignment.scalar_one_or_none():
            raise HTTPException(
                status_code=400, detail="Task already assigned to this user"
            )

        # 할당 생성
        assignment = task_models.TaskAssignment(
            task_id=task_id, user_id=user_id, assigned_by=current_user.id
        )

        db.add(assignment)
        await db.commit()

        # 활동 로그
        log_user_activity(
            user_id=current_user.id,
            action="task_assigned",
            resource_type="task",
            resource_id=task_id,
            description=f"Assigned task to {user.username}",
        )

        return True
