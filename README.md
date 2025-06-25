
# PMS (Project Management System)

현대적인 마이크로서비스 아키텍처 기반의 프로젝트 관리 시스템입니다. Python FastAPI와 React TypeScript를 사용하여 구축되었습니다.

## 🚀 주요 기능

### 👥 사용자 관리

- 회원가입/로그인 (JWT 인증)
- OAuth2 기반 인증 (Google, GitHub 연동 준비)
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
- 간트 차트
- 진행률 시각화
- 최근 활동 내역

## 🛠 기술 스택

### Backend

- **프레임워크**: FastAPI (Python 3.11+)
- **데이터베이스**: PostgreSQL
- **ORM**: SQLAlchemy 2.0 (비동기)
- **API**: GraphQL (Strawberry)
- **인증**: JWT + OAuth2
- **캐싱**: Redis
- **마이그레이션**: Alembic

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
# Backend 환경변수 (.env)
cp pms-backend/.env.example pms-backend/.env

# Frontend 환경변수 (.env)
cp pms-frontend/.env.example pms-frontend/.env
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
```

### 5. 접속 확인

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **GraphQL Playground**: http://localhost:8000/graphql
- **API 문서**: http://localhost:8000/docs


## 🏗 프로젝트 구조

```bash
pms-project/
├── pms-backend/
│   ├── app/
│   │   ├── core/          # 핵심 설정 (DB, 보안, 설정)
│   │   ├── models/        # SQLAlchemy 모델
│   │   ├── schemas/       # Pydantic 스키마
│   │   ├── api/           # GraphQL API
│   │   ├── services/      # 비즈니스 로직
│   │   └── utils/         # 유틸리티
│   ├── alembic/           # 데이터베이스 마이그레이션
│   ├── requirements.txt
│   └── Dockerfile
├── pms-frontend/
│   ├── src/
│   │   ├── components/    # React 컴포넌트
│   │   ├── pages/         # 페이지 컴포넌트
│   │   ├── hooks/         # 커스텀 훅
│   │   ├── context/       # React Context
│   │   ├── graphql/       # GraphQL 쿼리/뮤테이션
│   │   ├── types/         # TypeScript 타입
│   │   └── utils/         # 유틸리티
│   ├── package.json
│   └── Dockerfile
├── docker-compose.yml
├── docker-compose.dev.yml
└── README.md
```

## 🔧 개발 환경 설정

### Backend 로컬 개발

```bash
cd pms-backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

### Frontend 로컬 개발

```bash
cd pms-frontend
npm install
npm run dev
```

### 데이터베이스 마이그레이션

```bash
# 새 마이그레이션 생성
alembic revision --autogenerate -m "migration message"

# 마이그레이션 적용
alembic upgrade head

# 마이그레이션 롤백
alembic downgrade -1
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
    progress
    creator {
      username
    }
    members {
      username
    }
  }
}
```

#### 프로젝트 생성

```graphql
mutation CreateProject($input: ProjectInput!) {
  createProject(projectInput: $input) {
    id
    name
    description
    status
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

## 🔒 보안

- **JWT 토큰**: 액세스 토큰 + 리프레시 토큰
- **비밀번호 암호화**: bcrypt 해싱
- **CORS 설정**: 허용된 도메인만 접근
- **SQL 인젝션 방지**: SQLAlchemy ORM 사용
- **XSS 방지**: React의 기본 XSS 보호

## 🧪 테스트

### Backend 테스트

```bash
cd pms-backend
pytest
```

### Frontend 테스트

```bash
cd pms-frontend
npm test
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

# Docker Compose 실행
docker-compose up -d

# 헬스 체크
curl http://your-domain/health
```

### 환경별 설정

- **개발**: `docker-compose.dev.yml`
- **프로덕션**: `docker-compose.yml`
- **환경 변수**: `.env` 파일로 관리

## 🤝 기여 가이드

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📄 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다.

## 🆘 문제 해결

### 일반적인 문제

1. **데이터베이스 연결 실패**

   ```bash
   # PostgreSQL 컨테이너 상태 확인
   docker ps | grep postgres
   
   # 로그 확인
   docker logs pms_postgres
   ```

2. **포트 충돌**

   ```bash
   # 사용 중인 포트 확인
   lsof -i :8000  # Backend
   lsof -i :3000  # Frontend
   lsof -i :5432  # PostgreSQL
   ```

3. **권한 오류**

   ```bash
   # Docker 권한 확인
   sudo usermod -aG docker $USER
   newgrp docker
   ```

### 로그 확인

```bash
# 전체 서비스 로그
docker-compose logs -f

# 특정 서비스 로그
docker-compose logs -f backend
docker-compose logs -f frontend
```

## 📞 지원

- **이슈 리포팅**: GitHub Issues
- **문서**: 프로젝트 Wiki
- **이메일**: jongho.woo@computer.co.kr

---

**PMS 프로젝트에 기여해주셔서 감사합니다!** 🎉
>>>>>>> 1ac6012 (feat: add Sidebar component for navigation)
