from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from strawberry.fastapi import GraphQLRouter
import strawberry
from app.core.config import settings
from app.api.graphql.queries import Query
from app.api.graphql.mutations import Mutation
from app.core.dependencies import get_current_active_user
import os

# GraphQL 스키마 생성
schema = strawberry.Schema(query=Query, mutation=Mutation)

# GraphQL 라우터 생성 (인증 의존성 추가)
graphql_app = GraphQLRouter(
    schema,
    dependencies=[Depends(get_current_active_user)] if os.getenv("REQUIRE_AUTH", "true") == "true" else []
)

# FastAPI 앱 생성
app = FastAPI(
    title="PMS API",
    description="Project Management System API",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS 설정
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.BACKEND_CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# GraphQL 라우터 추가
app.include_router(graphql_app, prefix="/graphql")

# 정적 파일 서빙 (업로드된 파일용)
if not os.path.exists(settings.UPLOAD_DIR):
    os.makedirs(settings.UPLOAD_DIR)

app.mount("/uploads", StaticFiles(directory=settings.UPLOAD_DIR), name="uploads")

@app.get("/")
async def root():
    return {"message": "PMS API is running", "graphql": "/graphql", "docs": "/docs"}

@app.get("/health")
async def health_check():
    return {"status": "healthy"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)