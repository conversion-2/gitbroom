# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

GitBroom은 GitLab 브랜치를 자동 분석하여 삭제 후보를 분류하고 담당자 확인까지 돕는 웹 관리 도구입니다.  
Claude Code가 이 저장소를 이해하고 작업할 수 있도록 프로젝트 구조와 핵심 로직을 설명합니다.

---

# Commands

```bash
npm run dev      # 개발 서버 (http://localhost:3000)
npm run build    # 프로덕션 빌드
npm run lint     # ESLint 검사
```

빌드 시 Google Fonts TLS 오류가 발생할 경우

```bash
NEXT_TURBOPACK_EXPERIMENTAL_USE_SYSTEM_TLS_CERTS=1 npm run build
```

`next.config.ts`에서 다음 옵션이 설정되어 있습니다.

```
turbopackUseSystemTlsCerts: true
```

dev 서버에서는 자동 적용됩니다.

---

# Project Overview

GitBroom은 GitLab 프로젝트의 브랜치를 분석하여 다음 정보를 제공합니다.

- 삭제 권장 브랜치
- 확인 필요 브랜치
- 안전 브랜치
- 브랜치 담당자 추정

프로젝트는 **Next.js + TypeScript 기반 웹 애플리케이션**입니다.

데이터는 두 가지 방식으로 제공됩니다.

1. Mock 데이터 (데모용)
2. GitLab API (실제 프로젝트 분석)

---

# Architecture

GitBroom은 다음 모듈 구조로 동작합니다.

```
Frontend (Next.js UI)
        ↓
API Route (/api/branches)
        ↓
Branch Classifier
        ↓
Owner Estimator
        ↓
GitLab Client / Mock Data
```

---

# Data Flow

브랜치 데이터를 조회하는 흐름은 다음과 같습니다.

```
useBranches (hook)
      ↓
GET /api/branches
      ↓
classifier
      ↓
owner-estimator
      ↓
JSON response
```

데이터 소스

```
mock-data
or
gitlab-client
```

---

# Mock / Live Mode

GitBroom은 자동으로 Mock 모드와 Live 모드를 전환합니다.

위치

```
src/lib/gitlab-client.ts
```

`isLiveMode()` 함수가 다음 환경 변수 존재 여부를 검사합니다.

```
GITLAB_TOKEN
GITLAB_PROJECT_ID
```

환경 변수가 존재하면

```
Live Mode
```

GitLab API 호출.

환경 변수가 없으면

```
Mock Mode
```

다음 파일의 샘플 데이터 사용

```
src/lib/mock-data.ts
```

Mock 데이터에는 24개의 샘플 브랜치가 포함되어 있습니다.

---

# Branch Classification

브랜치 분류는 다음 파일에서 수행됩니다.

```
src/lib/classifier.ts
```

브랜치 하나에 대해 다음 순서로 규칙이 적용됩니다.

```
default / protected
merged + stale
merged
tempPattern + stale
tempPattern
stale
safe
```

분류 설정은 다음 객체로 관리됩니다.

```
ClassificationConfig
```

설정 값

- staleDays
- reviewDays
- patterns

이 값들은 **클라이언트 UI에서 조정 가능**하며  
API query parameter로 전달됩니다.

---

# Owner Estimation

브랜치 담당자는 다음 파일에서 추정합니다.

```
src/lib/owner-estimator.ts
```

우선순위

```
1. MR author (95%)
2. branch name pattern (70%)
3. commit author (60%)
```

Mock 데이터에서는 MR author를 다음 맵으로 시뮬레이션합니다.

```
MOCK_MR_AUTHORS
```

---

# UI Components

UI는 다음 기술을 사용합니다.

- Tailwind CSS
- shadcn/ui
- Next.js App Router

주의 사항

이 프로젝트는 **Radix 기반 shadcn이 아닌 Base UI 기반 shadcn을 사용합니다.**

Select 컴포넌트 시그니처

```
onValueChange(value: string | null, eventDetails)
```

value는 null이 될 수 있으므로  
null 처리 로직이 필요합니다.

---

# Environment Variables

```env
GITLAB_URL=https://gitlab.example.com       # 기본값: https://gitlab.com
GITLAB_TOKEN=glpat-xxxx                     # 없으면 Mock 모드
GITLAB_PROJECT_ID=12345678                  # 또는 group%2Fproject 형식
```

설정 후 서버 재시작 시 Live 모드로 동작합니다.

---

# Development Notes

개발 시 다음 원칙을 유지합니다.

- API 로직은 `src/lib`에 위치
- UI 로직은 `src/components`에 위치
- 상태 관리는 React Hook 사용
- 브랜치 분류 로직은 classifier에서만 처리

Claude Code가 코드 수정 시

- 기존 분류 규칙 유지
- Owner estimation 로직 유지
- Mock 모드 동작 유지

해야 합니다.