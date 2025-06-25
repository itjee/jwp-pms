from typing import Optional
from sqlalchemy.ext.asyncio import AsyncSession
from fastapi import HTTPException, status
from app.models.user import User
from app.core.security import verify_password, create_access_token
from app.services.user_service import UserService

class AuthService:
    @staticmethod
    async def authenticate_user(
        db: AsyncSession,
        username_or_email: str,
        password: str
    ) -> Optional[User]:
        # 이메일로 먼저 시도
        user = await UserService.get_user_by_email(db, username_or_email)
        if not user:
            # 사용자명으로 시도
            user = await UserService.get_user_by_username(db, username_or_email)
        
        if not user or not verify_password(password, user.hashed_password):
            return None
        
        return user
    
    @staticmethod
    async def login(
        db: AsyncSession,
        username_or_email: str,
        password: str
    ) -> dict:
        user = await AuthService.authenticate_user(db, username_or_email, password)
        
        if not user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Incorrect email/username or password"
            )
        
        if not user.is_active:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Inactive user"
            )
        
        access_token = create_access_token(subject=user.id)
        
        return {
            "access_token": access_token,
            "token_type": "bearer",
            "user": user
        }