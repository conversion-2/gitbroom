# 🧹 GitBroom - GitLab Branch Manager

![CI](https://github.com/conversion-2/gitbroom/actions/workflows/ci.yml/badge.svg)

GitLab 저장소의 브랜치를 자동 분석하여  
**삭제 후보 / 검토 필요 / 안전 브랜치**를 분류하고  
**담당자 추정까지 제공하는 웹 기반 관리 도구**입니다.

해커톤 MVP 프로젝트로 **Mock 데이터 기반 즉시 실행**이 가능하며  
GitLab API 연동 시 실제 저장소 분석도 지원합니다.

---

# 📌 문제 정의

GitLab 저장소에서 브랜치가 지속적으로 증가하면 다음 문제가 발생합니다.

- 오래된 브랜치 관리 어려움
- 이미 병합된 브랜치 방치
- 누가 만든 브랜치인지 파악 어려움
- 정리 작업의 수작업 의존

GitBroom은 이러한 문제를 해결하기 위해

- 브랜치 상태 자동 분석
- 삭제 후보 자동 분류
- 담당자 자동 추정
- 정리 알림 메시지 생성

기능을 제공합니다.

---

# ✨ 주요 기능

| 기능 | 설명 |
|-----|-----|
| 브랜치 자동 분류 | stale / merged / temp 패턴 기반 분석 |
| 담당자 추정 | MR author → 브랜치 패턴 → 커밋 author |
| 검색 / 필터 / 정렬 | 브랜치 이름, 담당자 기준 탐색 |
| 규칙 설정 | staleDays / reviewDays UI 변경 |
| 알림 메시지 생성 | 담당자에게 보낼 메시지 자동 생성 |
| Mock / Live 모드 | GitLab API 없이도 즉시 실행 |

---

# 🧠 분류 알고리즘

```
default/protected branch → safe

merged + reviewDays 초과 → delete-recommended
merged + 최근 → review

temp pattern + staleDays 초과 → delete-recommended
temp pattern + 최근 → review

staleDays 초과 → review
그 외 → safe
```

기본값

```
staleDays = 90
reviewDays = 30
```

---

# 🏗 아키텍처

GitBroom은 **4계층 구조**로 설계되었습니다.

```
Presentation Layer
    ↓
API Layer
    ↓
Domain Logic Layer
    ↓
Data Source Layer
```

### Presentation

```
Next.js App Router
React UI
Tailwind CSS
shadcn/ui
```

### API Layer

```
/api/branches
```

브랜치 데이터 수집 및 필터/정렬 처리

### Domain Logic

```
classifier.ts
owner-estimator.ts
gitlab-client.ts
```

핵심 비즈니스 로직

### Data Source

```
Mock Data
GitLab REST API
```

환경 변수 존재 여부에 따라 **Mock / Live 자동 전환**

---

# 🔁 데이터 흐름

```
GitLab API / Mock Data
        ↓
classifier
        ↓
owner-estimator
        ↓
API response
        ↓
React UI
```

---

# 🧪 테스트 전략

GitBroom은 **핵심 로직 중심 테스트 전략**을 사용합니다.

### 테스트 대상

```
classifier.ts
owner-estimator.ts
gitlab-client.ts
/api/branches API
page.tsx UI
```

### 테스트 실행

```
npm run test
```

watch 모드

```
npm run test:watch
```

coverage 측정

```
npm run coverage
```

### 현재 커버리지

```
Statements: 7.81%
Branches:   73.91%
Functions:  72.22%
```

UI 컴포넌트는 현재 렌더링 테스트만 적용되었으며  
핵심 도메인 로직 안정성을 우선 검증하고 있습니다.

---

# ⚙️ CI / 자동 검증

GitHub Actions를 통해 다음 검증이 자동 수행됩니다.

```
Install dependencies
Type Check
Lint
Test
Build
```

워크플로 파일

```
.github/workflows/ci.yml
```

모든 Pull Request 및 main push 시 자동 실행됩니다.

---

# 🛠 기술 스택

| 영역 | 기술 |
|-----|-----|
| Framework | Next.js 14 |
| Language | TypeScript |
| UI | React 19 |
| Styling | Tailwind CSS |
| UI Library | shadcn/ui |
| Icons | lucide-react |
| Testing | Vitest |
| CI | GitHub Actions |

---

# 🚀 실행 방법

### 설치

```
npm install
```

### 개발 서버 실행

```
npm run dev
```

접속

```
http://localhost:3000
```

---

# 🔗 GitLab 연동

`.env.local`

```
GITLAB_URL=https://gitlab.example.com
GITLAB_TOKEN=glpat-xxxx
GITLAB_PROJECT_ID=123456
```

환경 변수 없으면 **Mock 모드 자동 실행**

---

# 📂 프로젝트 구조

```
src
 ├ components
 │   └ dashboard
 ├ lib
 │   ├ classifier.ts
 │   ├ owner-estimator.ts
 │   ├ gitlab-client.ts
 │   └ config.ts
 ├ app
 │   ├ page.tsx
 │   └ api/branches
 │        └ route.ts
```

---

# 📈 향후 계획

- GitLab 브랜치 직접 삭제 기능
- Slack / Teams 알림
- 브랜치 정리 자동 스케줄링
- UI 테스트 확대
- GitLab API Mock 테스트 강화

---

# 📄 License

MIT