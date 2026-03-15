# 🧹 GitBroom - GitLab Branch Manager

> GitLab 브랜치를 자동 분석하여 **삭제 후보를 분류하고 담당자 확인까지 돕는 웹 관리 도구**

GitBroom은 GitLab 프로젝트에서 증가하는 브랜치를 분석하여  
**정리 대상 브랜치를 빠르게 식별할 수 있도록 도와주는 관리 도구**입니다.

해커톤 MVP로 제작되었으며 **Mock 데이터로 즉시 시연 가능**하고  
환경 변수 설정 시 **GitLab API와 실제 연동**됩니다.

---

# 📌 Problem

GitLab 프로젝트에서는 시간이 지날수록 다음 문제가 발생합니다.

- 병합된 브랜치가 계속 누적됨
- 오래된 브랜치가 방치됨
- 담당자가 누구인지 알기 어려움
- 저장소 관리 비용 증가

특히 다음 상황에서 문제가 심각해집니다.

- 여러 명이 동시에 작업하는 팀
- 장기간 유지되는 서비스 레포지토리
- 기능 브랜치 전략을 사용하는 프로젝트

GitBroom은 이러한 문제를 해결하기 위해  
**브랜치 상태를 자동 분석하고 관리 가능한 형태로 정리합니다.**

---

# 🎯 Goal

GitBroom의 목표는 다음과 같습니다.

- 브랜치 상태를 자동 분석
- 정리 대상 브랜치 식별
- 담당자 추정
- 팀 브랜치 관리 효율 향상

---

# 🚀 빠른 시작

```bash
npm install
npm run dev
```

브라우저에서 접속

```
http://localhost:3000
```

GitLab 환경 변수 없이 실행하면  
**Mock 모드로 24개의 샘플 브랜치가 자동 생성됩니다.**

즉시 기능을 시연할 수 있습니다.

---

# 🔌 GitLab 연동 (선택)

실제 GitLab 프로젝트와 연동하려면 다음을 설정합니다.

```bash
cp .env.local.example .env.local
```

`.env.local` 편집

```env
GITLAB_URL=https://gitlab.example.com
GITLAB_TOKEN=glpat-xxxxxxxxxxxxxxxxxxxx
GITLAB_PROJECT_ID=12345678
```

설정 후 서버를 재시작하면

**LIVE 모드로 실제 브랜치 데이터를 분석합니다.**

---

# ✨ 주요 기능

| 기능 | 설명 |
|------|------|
| 자동 분류 | 병합 여부, 경과 시간, 브랜치 패턴 기반으로 안전/확인필요/삭제권장 분류 |
| 담당자 추정 | MR 작성자 → 브랜치명 패턴 → 커밋 작성자 순으로 추정 |
| 분류 규칙 조정 | UI에서 staleDays / reviewDays 규칙 즉시 변경 |
| 알림 메시지 생성 | 담당자에게 보낼 메시지 자동 생성 + 클립보드 복사 |
| 검색/필터/정렬 | 브랜치명/담당자 검색, 분류 필터, 다양한 정렬 |

---

# 🧠 분류 알고리즘

GitBroom은 다음 규칙으로 브랜치를 분류합니다.

```
기본/보호 브랜치           → 안전
병합됨 + reviewDays 초과  → 삭제 권장
병합됨 + 최근              → 확인 필요
임시패턴 + staleDays 초과 → 삭제 권장
임시패턴 + 최근            → 확인 필요
staleDays 초과             → 확인 필요
그 외                      → 안전
```

기본값

```
staleDays = 90
reviewDays = 30
```

---

# 🏗 Architecture

GitBroom은 다음 데이터 흐름을 사용합니다.

```
useBranches Hook
      ↓
API /api/branches
      ↓
Branch Classifier
      ↓
Owner Estimator
      ↓
UI Rendering
```

데이터 소스는 두 가지 모드를 지원합니다.

### Mock Mode

```
src/lib/mock-data.ts
```

24개의 샘플 브랜치 제공

---

### Live Mode

```
src/lib/gitlab-client.ts
```

GitLab REST API 호출

---

# 🗂 Project Structure

```
src
 ├ app
 ├ components
 ├ hooks
 ├ lib
 │   ├ classifier.ts
 │   ├ gitlab-client.ts
 │   ├ owner-estimator.ts
 │   └ mock-data.ts
 └ api
```

---

# ⚙️ 기술 스택

- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- shadcn/ui
- GitLab REST API

특징

- DB 없음
- API 기반 분석
- 빠른 MVP 개발 구조

---

# 📊 Demo Mode

GitLab 계정 없이도 다음 기능을 바로 체험할 수 있습니다.

- 브랜치 자동 분석
- 분류 규칙 변경
- 담당자 추정
- 알림 메시지 생성

---

# ⚠️ 한계점 및 향후 계획

## 현재 한계

- 브랜치 삭제 실행 기능 없음
- GitLab webhook 미지원
- 팀원 목록 연동 없음

---

## 향후 계획

- GitLab API로 브랜치 직접 삭제
- Slack / Teams 자동 알림
- 정기 브랜치 정리 리포트
- 브랜치 화이트리스트 관리

---

## 테스트

로컬에서 테스트를 실행하려면 다음 명령을 사용합니다.

```bash
npm run test
npm run test:watch
npm run coverage
```

CI 환경에서는 다음 검증이 자동 수행됩니다.

- type check
- lint
- unit test
- production build

# 📄 License

MIT