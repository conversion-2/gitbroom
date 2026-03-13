# ARCHITECTURE.md

# GitBroom System Architecture

GitBroom은 GitLab 저장소의 브랜치를 분석하여  
삭제 후보를 식별하고 담당자를 추정하는 웹 기반 관리 도구입니다.

이 문서는 GitBroom의 전체 시스템 구조와 데이터 흐름을 설명합니다.

---

# 1. System Overview

GitBroom은 다음 구성 요소로 이루어져 있습니다.

```
Frontend (Next.js)
        ↓
API Route (/api/branches)
        ↓
Branch Classifier
        ↓
Owner Estimator
        ↓
Data Source
   ├ Mock Data
   └ GitLab API
```

각 계층은 서로 독립적으로 동작하도록 설계되어 있습니다.

---

# 2. Architecture Layers

GitBroom은 다음 4개의 계층으로 구성됩니다.

## 1. Presentation Layer

사용자 인터페이스를 담당합니다.

기술

- Next.js
- React
- Tailwind CSS
- shadcn/ui

역할

- 브랜치 리스트 표시
- 분류 상태 표시
- 검색 / 필터 기능
- 알림 메시지 생성

---

## 2. API Layer

브랜치 데이터를 처리하는 API 계층입니다.

위치

```
/api/branches
```

역할

- 브랜치 데이터 조회
- 분류 로직 실행
- 담당자 추정
- JSON 응답 반환

---

## 3. Domain Logic Layer

GitBroom의 핵심 비즈니스 로직을 담당합니다.

위치

```
src/lib
```

구성

```
classifier.ts
owner-estimator.ts
gitlab-client.ts
mock-data.ts
```

역할

- 브랜치 상태 분류
- 담당자 추정
- GitLab API 호출
- Mock 데이터 제공

---

## 4. Data Source Layer

브랜치 데이터를 제공하는 계층입니다.

GitBroom은 두 가지 데이터 소스를 지원합니다.

### Mock Mode

개발 및 데모용 데이터

위치

```
src/lib/mock-data.ts
```

특징

- 24개의 샘플 브랜치 제공
- GitLab 계정 없이 데모 가능

---

### Live Mode

GitLab API를 사용하여 실제 브랜치 데이터를 조회합니다.

위치

```
src/lib/gitlab-client.ts
```

사용 API

```
GitLab REST API
```

필요 환경 변수

```
GITLAB_URL
GITLAB_TOKEN
GITLAB_PROJECT_ID
```

---

# 3. Data Flow

브랜치 데이터 처리 흐름은 다음과 같습니다.

```
Frontend
   ↓
useBranches Hook
   ↓
GET /api/branches
   ↓
GitLab Client / Mock Data
   ↓
Branch Classifier
   ↓
Owner Estimator
   ↓
JSON Response
   ↓
UI Rendering
```

---

# 4. Branch Classification Logic

브랜치는 다음 규칙에 따라 분류됩니다.

```
기본/보호 브랜치           → safe
병합됨 + reviewDays 초과  → delete-recommended
병합됨 + 최근              → review-needed
임시패턴 + staleDays 초과 → delete-recommended
임시패턴 + 최근            → review-needed
staleDays 초과             → review-needed
그 외                      → safe
```

설정 값

```
staleDays
reviewDays
patterns
```

이 값들은 UI에서 조정 가능하며 API query parameter로 전달됩니다.

---

# 5. Owner Estimation Logic

브랜치 담당자는 다음 기준으로 추정됩니다.

우선순위

```
1. Merge Request Author
2. Branch Name Pattern
3. Commit Author
```

신뢰도

```
MR author        → 95%
Branch pattern   → 70%
Commit author    → 60%
```

Mock 데이터에서는 MR author를 다음 맵으로 시뮬레이션합니다.

```
MOCK_MR_AUTHORS
```

---

# 6. Project Structure

GitBroom 프로젝트 구조

```
src
 ├ app
 ├ components
 ├ hooks
 ├ lib
 │   ├ classifier.ts
 │   ├ owner-estimator.ts
 │   ├ gitlab-client.ts
 │   └ mock-data.ts
 └ api
```

---

# 7. Design Principles

GitBroom은 다음 설계 원칙을 따릅니다.

### Separation of Concerns

- UI
- API
- Domain Logic
- Data Source

각 계층을 분리합니다.

---

### Mock First Development

GitLab API 없이도 기능을 테스트할 수 있도록 설계되었습니다.

---

### Configurable Rules

브랜치 분류 규칙은 UI에서 조정 가능합니다.

---

# 8. Scalability

향후 다음 기능 확장이 가능합니다.

### 브랜치 자동 삭제

GitLab API 사용

---

### Slack / Teams 알림

브랜치 정리 요청 자동 발송

---

### 정기 분석 리포트

Cron 기반 브랜치 분석

---

### 브랜치 정책 관리

화이트리스트 / 보호 브랜치 관리

---

# 9. Future Architecture

향후 확장 시 구조

```
Frontend
   ↓
API
   ↓
Worker / Scheduler
   ↓
GitLab API
   ↓
Notification Service
   ↓
Slack / Teams
```

---

# 10. Summary

GitBroom은 다음 특징을 가진 시스템입니다.

- GitLab 브랜치 자동 분석
- 삭제 후보 식별
- 담당자 추정
- Mock 기반 데모 가능
- 확장 가능한 구조