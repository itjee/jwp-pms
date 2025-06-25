# PMS (Project Management System)

현대적인 마이크로서비스 아키텍처 기반의 프로젝트 관리 시스템입니다. Python FastAPI와 React TypeScript를 사용하여 구축되었습니다.

## 🚀 주요 기능

### 👥 사용자 관리

- 회원가입/로그인 (JWT 인증)
- OAuth2 기반 인증 준비
- 역할 기반 접근 제어 (RBAC)
- 사용자 프로필 관리
- 활동 로그 추적

### 📁 프로젝트 관리

- 프로젝트 생성, 수정, 삭제
- 프로젝트 상태 및 우선순위 관리
- 프로젝트 멤버 관리
- 프로젝트 코멘트 시스템
- 파일 첨부 기능

### ✅ 작업 관리

- 작업 생성, 할당, 추적
- 작업 상태 관리 (칸반 보드)
- 작업 우선순위 및 태그
- 작업 코멘트 및 첨부파일
- 시간 추적 (예상/실제 시간)

### 📅 일정 관리

- 캘린더 뷰 (월/주/일)
- 이벤트 생성 및 관리
- 프로젝트/작업 연동
- 일정 알림

### 📊 대시보드

- 프로젝트 및 작업 현황 요약
- 진행률 시각화
- 최근 활동 내역
- 팀 성과 분석

## 🛠 기술 스택

### Backend

- **프레임워크**: FastAPI (Python 3.11+)
- **데이터베이스**: PostgreSQL
- **ORM**: SQLAlchemy 2.0 (비동기)
- **API**: GraphQL (Strawberry)
- **인증**: JWT + OAuth2
- **캐싱**: Redis
- **마이그레이션**: Alembic
- **로깅**: Structlog

### Frontend

- **프레임워크**: React 18 + TypeScript
- **스타일링**: Tailwind CSS
- **상태관리**: Apollo Client (GraphQL)
- **라우팅**: React Router v6
- **폼 관리**: React Hook Form + Yup
- **UI 컴포넌트**: Headless UI + Lucide Icons

### DevOps

- **컨테이너화**: Docker + Docker Compose
- **웹서버**: Nginx (프로덕션)
- **개발환경**: Hot Reload 지원

## 📋 사전 요구사항

- Docker & Docker Compose
- Git
- Node.js 18+ (로컬 개발시)
- Python 3.11+ (로컬 개발시)

## 🚀 빠른 시작

### 1. 저장소 클론

```bash
git clone <repository-url>
cd pms-project
```

### 2. 환경 변수 설정

```bash
# Backend 환경변수
cd backend
cp .env.example .env
# .env 파일을 편집하여 필요한 설정을 구성하세요

# Frontend 환경변수
cd ../frontend
cp .env.example .env
# .env 파일을 편집하여 필요한 설정을 구성하세요
```

### 3. Docker Compose로 실행

```bash
# 개발 환경
docker-compose -f docker-compose.dev.yml up --build

# 프로덕션 환경
docker-compose up --build
```

### 4. 데이터베이스 마이그레이션

```bash
# Backend 컨테이너 접속
docker exec -it pms_backend_dev bash

# 마이그레이션 실행
alembic upgrade head

# 초기 데이터 삽입 (선택사항)
python -c "
import asyncio
from app.core.database import async_session_maker
from app.models.user import User, UserRole
from app.core.security import get_password_hash

async def create_admin():
    async with async_session_maker() as session:
        admin = User(
            email='admin@pms.com',
            username='admin',
            full_name='System Administrator',
            hashed_password=get_password_hash('admin123'),
            role=UserRole.ADMIN,
            is_active=True,
            is_verified=True
        )
        session.add(admin)
        await session.commit()
        print('Admin user created: admin@pms.com / admin123')

asyncio.run(create_admin())
"
```

### 5. 접속 확인

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8001
- **GraphQL Playground**: http://localhost:8001/graphql
- **API 문서**: http://localhost:8001/docs

### 6. 로그인

초기 관리자 계정:
- **이메일**: jongho.woo@computer.co.kr
- **비밀번호**: admin123

## 🏗 프로젝트 구조

``` bash
pms-project/
├── backend/                    # FastAPI 백엔드
│   ├── app/
│   │   ├── api/               # GraphQL API
│   │   │   └── graphql/
│   │   │       ├── queries.py
│   │   │       ├── mutations.py
│   │   │       └── types.py
│   │   ├── core/              # 핵심 설정
│   │   │   ├── config.py
│   │   │   ├── database.py
│   │   │   ├── security.py
│   │   │   └── dependencies.py
│   │   ├── models/            # SQLAlchemy 모델
│   │   │   ├── user.py
│   │   │   ├── project.py
│   │   │   ├── task.py
│   │   │   ├── calendar.py
│   │   │   └── permission.py
│   │   ├── services/          # 비즈니스 로직
│   │   │   ├── auth_service.py
│   │   │   ├── user_service.py
│   │   │   ├── project_service.py
│   │   │   └── task_service.py
│   │   ├── utils/             # 유틸리티
│   │   │   └── logger.py
│   │   └── main.py           # FastAPI 앱
│   ├── alembic/              # 데이터베이스 마이그레이션
│   │   ├── versions/
│   │   ├── env.py
│   │   └── script.py.mako
│   ├── requirements.txt
│   ├── Dockerfile
│   └── .env
├── frontend/                  # React 프론트엔드
│   ├── src/
│   │   ├── components/       # React 컴포넌트
│   │   │   ├── common/       # 공통 컴포넌트
│   │   │   ├── projects/     # 프로젝트 관련
│   │   │   └── tasks/        # 작업 관련
│   │   ├── pages/            # 페이지 컴포넌트
│   │   │   ├── auth/
│   │   │   ├── projects/
│   │   │   └── tasks/
│   │   ├── context/          # React Context
│   │   │   ├── AuthContext.tsx
│   │   │   ├── ThemeContext.tsx
│   │   │   └── ToastContext.tsx
│   │   ├── graphql/          # GraphQL 관련
│   │   │   ├── client.ts
│   │   │   ├── queries/
│   │   │   └── mutations/
│   │   ├── types/            # TypeScript 타입
│   │   ├── hooks/            # 커스텀 훅
│   │   ├── utils/            # 유틸리티
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   └── index.css
│   ├── public/
│   ├── package.json
│   ├── Dockerfile
│   ├── tailwind.config.js
│   ├── vite.config.ts
│   └── .env
├── docker-compose.yml        # 프로덕션
├── docker-compose.dev.yml    # 개발환경
├── init.sql                  # 초기 DB 스크립트
└── README.md
```

## 🔧 개발 환경 설정

### Backend 로컬 개발

```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt

# 환경변수 설정
export DATABASE_URL="postgresql+asyncpg://postgres:password@localhost:5432/pms_db"
export SECRET_KEY="your-secret-key"

# 개발 서버 실행
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### Frontend 로컬 개발

```bash
cd frontend
npm install

# 개발 서버 실행
npm run dev
```

### 데이터베이스 관리

```bash
# 새 마이그레이션 생성
alembic revision --autogenerate -m "migration message"

# 마이그레이션 적용
alembic upgrade head

# 마이그레이션 롤백
alembic downgrade -1

# 마이그레이션 히스토리 확인
alembic history
```

## 📝 API 사용법

### GraphQL 쿼리 예시

#### 사용자 정보 조회

```graphql
query GetMe {
  me {
    id
    email
    username
    fullName
    role
    department
    position
  }
}
```

#### 프로젝트 목록 조회

```graphql
query GetProjects {
  projects {
    id
    name
    description
    status
    priority
    progress
    startDate
    endDate
    creator {
      username
      fullName
    }
    members {
      id
      username
      fullName
    }
  }
}
```

#### 프로젝트 생성

```graphql
mutation CreateProject($projectInput: ProjectInput!) {
  createProject(projectInput: $projectInput) {
    id
    name
    description
    status
    priority
    progress
  }
}
```

### 인증 헤더

```http
Authorization: Bearer <your-jwt-token>
```

## 🎨 UI/UX 특징

- **다크/라이트 모드**: 시스템 설정 자동 감지 및 수동 전환
- **반응형 디자인**: 모바일, 태블릿, 데스크톱 지원
- **토스트 알림**: 사용자 액션 피드백
- **로딩 상태**: 비동기 작업 시각적 피드백
- **접근성**: 키보드 네비게이션 및 스크린 리더 지원
- **칸반 보드**: 드래그 앤 드롭 작업 관리

## 🔒 보안

- **JWT 토큰**: 액세스 토큰 + 리프레시 토큰
- **비밀번호 암호화**: bcrypt 해싱
- **CORS 설정**: 허용된 도메인만 접근
- **SQL 인젝션 방지**: SQLAlchemy ORM 사용
- **XSS 방지**: React의 기본 XSS 보호
- **RBAC**: 역할 기반 접근 제어

## 🧪 테스트

### Backend 테스트

```bash
cd backend
pytest

# 커버리지와 함께 실행
pytest --cov=app --cov-report=html
```

### Frontend 테스트

```bash
cd frontend
npm test

# 커버리지와 함께 실행
npm run test:coverage
```

## 📊 모니터링

- **구조화된 로깅**: structlog 사용
- **사용자 활동 추적**: 데이터베이스 로그
- **성능 모니터링**: FastAPI 기본 메트릭
- **에러 트래킹**: 로그 기반 에러 추적

## 🔄 배포

### 프로덕션 배포

```bash
# 환경 변수 설정
export DATABASE_URL="your-production-db-url"
export SECRET_KEY="your-production-secret"
export REDIS_URL="your-redis-url"

# Docker Compose 실행
docker-compose up -d

# 헬스 체크
curl http://your-domain/health
```

### 환경별 설정

- **개발**: `docker-compose.dev.yml`
- **프로덕션**: `docker-compose.yml`
- **환경 변수**: `.env` 파일로 관리

## 📋 주요 GraphQL Operations

### Queries

```graphql
# 대시보드 통계
query GetDashboardStats {
  dashboardStats {
    totalProjects
    activeProjects
    completedProjects
    totalTasks
    completedTasks
    overdueTasks
  }
}

# 작업 목록
query GetTasks($projectId: Int) {
  tasks(projectId: $projectId) {
    id
    title
    status
    priority
    dueDate
    assignees {
      id
      username
      fullName
    }
  }
}
```

### Mutations

```graphql
# 로그인
mutation Login($usernameOrEmail: String!, $password: String!) {
  login(usernameOrEmail: $usernameOrEmail, password: $password) {
    user {
      id
      username
      fullName
      role
    }
    accessToken
  }
}

# 작업 생성
mutation CreateTask($taskInput: TaskInput!) {
  createTask(taskInput: $taskInput) {
    id
    title
    status
    project {
      name
    }
  }
}

# 작업 할당
mutation AssignTask($taskId: Int!, $userId: Int!) {
  assignTask(taskId: $taskId, userId: $userId)
}
```

## 🔧 트러블슈팅

### 일반적인 문제

1. **데이터베이스 연결 실패**

   ```bash
   # PostgreSQL 컨테이너 상태 확인
   docker ps | grep postgres
   
   # 로그 확인
   docker logs pms_postgres_dev
   
   # 데이터베이스 접속 테스트
   docker exec -it pms_postgres_dev psql -U postgres -d pms_db
   ```

2. **포트 충돌**

   ```bash
   # 사용 중인 포트 확인
   lsof -i :8000  # Backend
   lsof -i :3000  # Frontend
   lsof -i :5432  # PostgreSQL
   lsof -i :6379  # Redis
   ```

3. **권한 오류**

   ```bash
   # Docker 권한 확인
   sudo usermod -aG docker $USER
   newgrp docker
   ```

4. **마이그레이션 오류**

   ```bash
   # 마이그레이션 상태 확인
   alembic current
   
   # 마이그레이션 히스토리
   alembic history
   
   # 강제 마이그레이션 (주의!)
   alembic stamp head
   ```

### 로그 확인

```bash
# 전체 서비스 로그
docker-compose logs -f

# 특정 서비스 로그
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f postgres

# 실시간 로그 추적
docker-compose logs -f --tail=100 backend
```

### 개발 팁

1. **GraphQL Playground 사용**

   - http://localhost:8001/graphql 접속
   - 좌측에서 쿼리 작성, 우측에서 결과 확인
   - Docs 탭에서 스키마 확인

2. **Hot Reload 활성화**

   ```bash
   # Backend
   uvicorn app.main:app --reload
   
   # Frontend
   npm run dev
   ```

3. **디버깅**

   ```python
   # Backend 디버깅
   import logging
   logging.basicConfig(level=logging.DEBUG)
   
   # 또는 breakpoint 사용
   breakpoint()
   ```

## 🚀 향후 개발 계획

### v1.1.0

- [ ] 실시간 알림 시스템 (WebSocket)
- [ ] 파일 업로드 및 첨부파일 관리
- [ ] 간트 차트 구현
- [ ] 이메일 알림

### v1.2.0

- [ ] OAuth2 소셜 로그인 (Google, GitHub)
- [ ] 고급 권한 관리
- [ ] API Rate Limiting
- [ ] 데이터 백업/복원

### v1.3.0

- [ ] 모바일 앱 (React Native)
- [ ] 고급 분석 및 리포팅
- [ ] 통합 시간 추적
- [ ] 프로젝트 템플릿

## 🤝 기여 가이드

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

### 코드 스타일

- **Backend**: PEP 8, Black formatter 사용
- **Frontend**: ESLint + Prettier 설정 준수
- **커밋 메시지**: Conventional Commits 규칙 따르기

### 테스트 작성

- 새로운 기능에는 반드시 테스트 코드 작성
- 최소 80% 이상의 코드 커버리지 유지
- E2E 테스트는 중요한 사용자 플로우에 대해서만 작성

## 📄 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다. 자세한 내용은 [LICENSE](LICENSE) 파일을 참조하세요.

## 📞 지원 및 문의

- **이슈 리포팅**: [GitHub Issues](https://github.com/your-repo/pms/issues)
- **기능 요청**: [GitHub Discussions](https://github.com/your-repo/pms/discussions)
- **보안 문제**: security@yourcompany.com
- **일반 문의**: support@yourcompany.com

## 🙏 감사의 말

이 프로젝트는 다음 오픈소스 프로젝트들의 도움을 받아 개발되었습니다:

- [FastAPI](https://fastapi.tiangolo.com/) - 현대적이고 빠른 웹 프레임워크
- [React](https://reactjs.org/) - 사용자 인터페이스 구축을 위한 라이브러리
- [Tailwind CSS](https://tailwindcss.com/) - 유틸리티 우선 CSS 프레임워크
- [SQLAlchemy](https://www.sqlalchemy.org/) - Python SQL 툴킷
- [Apollo Client](https://www.apollographql.com/docs/react/) - GraphQL 클라이언트

---

**PMS 프로젝트에 기여해주셔서 감사합니다!** 🎉

더 나은 프로젝트 관리 도구를 만들기 위해 여러분의 피드백과 기여를 기다리고 있습니다.