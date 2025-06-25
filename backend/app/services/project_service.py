from typing import Optional, List
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from app.models.project import Project, ProjectMember, ProjectComment
from app.models.user import User

class ProjectService:
    @staticmethod
    async def get_project_by_id(db: AsyncSession, project_id: int) -> Optional[Project]:
        result = await db.execute(select(Project).where(Project.id == project_id))
        return result.scalar_one_or_none()
    
    @staticmethod
    async def get_projects_by_user(db: AsyncSession, user_id: int) -> List[Project]:
        # 사용자가 생성했거나 멤버로 참여하는 프로젝트
        query = select(Project).join(
            ProjectMember, Project.id == ProjectMember.project_id
        ).where(
            (Project.creator_id == user_id) | (ProjectMember.user_id == user_id)
        ).distinct()
        
        result = await db.execute(query)
        return result.scalars().all()
    
    @staticmethod
    async def create_project(
        db: AsyncSession,
        name: str,
        creator_id: int,
        description: Optional[str] = None,
        status: str = "planning",
        priority: str = "medium"
    ) -> Project:
        project = Project(
            name=name,
            description=description,
            status=status,
            priority=priority,
            creator_id=creator_id
        )
        db.add(project)
        await db.commit()
        await db.refresh(project)
        
        # 프로젝트 생성자를 멤버로 추가
        member = ProjectMember(
            project_id=project.id,
            user_id=creator_id,
            role="lead"
        )
        db.add(member)
        await db.commit()
        
        return project
    
    @staticmethod
    async def add_project_member(
        db: AsyncSession,
        project_id: int,
        user_id: int,
        role: str = "member"
    ) -> ProjectMember:
        member = ProjectMember(
            project_id=project_id,
            user_id=user_id,
            role=role
        )
        db.add(member)
        await db.commit()
        await db.refresh(member)
        return member
    
    @staticmethod
    async def get_project_members(db: AsyncSession, project_id: int) -> List[User]:
        result = await db.execute(
            select(User).join(
                ProjectMember, User.id == ProjectMember.user_id
            ).where(ProjectMember.project_id == project_id)
        )
        return result.scalars().all()