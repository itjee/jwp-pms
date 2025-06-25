import strawberry
from typing import List, Optional
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from fastapi import Depends
from app.core.dependencies import get_current_active_user, get_db
from app.models import user as user_models
from app.models import project as project_models
from app.models import task as task_models
from app.models import calendar as calendar_models
from app.api.graphql.types import User, Project, Task, Comment, Event, DashboardStats

@strawberry.type
class Query:
    @strawberry.field
    async def me(
        self,
        info,
        current_user: user_models.User = Depends(get_current_active_user)
    ) -> User:
        return User(
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
            updated_at=current_user.updated_at
        )
    
    @strawberry.field
    async def users(
        self,
        info,
        db: AsyncSession = Depends(get_db),
        current_user: user_models.User = Depends(get_current_active_user)
    ) -> List[User]:
        result = await db.execute(select(user_models.User))
        users = result.scalars().all()
        return [
            User(
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
                updated_at=user.updated_at
            ) for user in users
        ]
    
    @strawberry.field
    async def projects(
        self,
        info,
        db: AsyncSession = Depends(get_db),
        current_user: user_models.User = Depends(get_current_active_user)
    ) -> List[Project]:
        # 사용자가 생성했거나 멤버로 참여하는 프로젝트만 조회
        query = select(project_models.Project).join(
            project_models.ProjectMember,
            project_models.Project.id == project_models.ProjectMember.project_id
        ).where(
            (project_models.Project.creator_id == current_user.id) |
            (project_models.ProjectMember.user_id == current_user.id)
        ).distinct()
        
        result = await db.execute(query)
        projects = result.scalars().all()
        
        project_list = []
        for project in projects:
            # Creator 정보 로드
            creator_result = await db.execute(
                select(user_models.User).where(user_models.User.id == project.creator_id)
            )
            creator = creator_result.scalar_one()
            
            # Members 정보 로드
            members_result = await db.execute(
                select(user_models.User).join(
                    project_models.ProjectMember,
                    user_models.User.id == project_models.ProjectMember.user_id
                ).where(project_models.ProjectMember.project_id == project.id)
            )
            members = members_result.scalars().all()
            
            project_list.append(Project(
                id=project.id,
                name=project.name,
                description=project.description,
                status=project.status,
                priority=project.priority,
                start_date=project.start_date,
                end_date=project.end_date,
                progress=project.progress,
                budget=project.budget,
                created_at=project.created_at,
                updated_at=project.updated_at,
                creator=User(
                    id=creator.id,
                    email=creator.email,
                    username=creator.username,
                    full_name=creator.full_name,
                    role=creator.role,
                    avatar_url=creator.avatar_url,
                    phone=creator.phone,
                    department=creator.department,
                    position=creator.position,
                    is_active=creator.is_active,
                    created_at=creator.created_at,
                    updated_at=creator.updated_at
                ),
                members=[
                    User(
                        id=member.id,
                        email=member.email,
                        username=member.username,
                        full_name=member.full_name,
                        role=member.role,
                        avatar_url=member.avatar_url,
                        phone=member.phone,
                        department=member.department,
                        position=member.position,
                        is_active=member.is_active,
                        created_at=member.created_at,
                        updated_at=member.updated_at
                    ) for member in members
                ]
            ))
        
        return project_list
    
    @strawberry.field
    async def project(
        self,
        info,
        project_id: int,
        db: AsyncSession = Depends(get_db),
        current_user: user_models.User = Depends(get_current_active_user)
    ) -> Optional[Project]:
        result = await db.execute(
            select(project_models.Project).where(project_models.Project.id == project_id)
        )
        project = result.scalar_one_or_none()
        
        if not project:
            return None
        
        # Creator와 Members 로드 (이전과 동일)
        # ... (생략, 위 코드와 동일)
        
        return project
    
    @strawberry.field
    async def tasks(
        self,
        info,
        project_id: Optional[int] = None,
        db: AsyncSession = Depends(get_db),
        current_user: user_models.User = Depends(get_current_active_user)
    ) -> List[Task]:
        query = select(task_models.Task)
        
        if project_id:
            query = query.where(task_models.Task.project_id == project_id)
        
        result = await db.execute(query)
        tasks = result.scalars().all()
        
        # Task 변환 로직 (Project, Assignees 포함)
        # ... (구현 필요)
        
        return []  # 임시 반환
    
    @strawberry.field
    async def dashboard_stats(
        self,
        info,
        db: AsyncSession = Depends(get_db),
        current_user: user_models.User = Depends(get_current_active_user)
    ) -> DashboardStats:
        # 프로젝트 통계
        total_projects_result = await db.execute(
            select(func.count(project_models.Project.id))
        )
        total_projects = total_projects_result.scalar()
        
        active_projects_result = await db.execute(
            select(func.count(project_models.Project.id)).where(
                project_models.Project.status == project_models.ProjectStatus.IN_PROGRESS
            )
        )
        active_projects = active_projects_result.scalar()
        
        # Task 통계 등 추가 구현...
        
        return DashboardStats(
            total_projects=total_projects,
            active_projects=active_projects,
            completed_projects=0,  # 구현 필요
            total_tasks=0,  # 구현 필요
            completed_tasks=0,  # 구현 필요
            overdue_tasks=0,  # 구현 필요
            tasks_by_status=[]  # 구현 필요
        )