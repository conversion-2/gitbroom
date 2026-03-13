# PRD.md

# GitBroom - Product Requirement Document

GitBroom은 GitLab 저장소에서 증가하는 브랜치를 자동 분석하여  
정리 대상 브랜치를 식별하고 담당자 확인까지 지원하는 관리 도구이다.

---

# 1. Problem

GitLab 프로젝트에서는 시간이 지날수록 다음 문제가 발생한다.

### 1. 브랜치 누적 문제

개발 과정에서 생성된 feature 브랜치가 계속 남아 저장소가 복잡해진다.

예

- feature/login
- fix/payment-error
- temp/debug

이 브랜치들이 정리되지 않으면 레포지토리 관리가 어려워진다.

---

### 2. 병합된 브랜치 방치

Merge Request가 완료된 이후에도 브랜치가 삭제되지 않는 경우가 많다.

이 경우

- Git UI가 복잡해짐
- 브랜치 목록 탐색 어려움
- 실제 작업 브랜치 식별 어려움

---

### 3. 담당자 확인 문제

오래된 브랜치는 다음과 같은 문제가 발생한다.

- 누가 만든 브랜치인지 모름
- 팀원이 이미 떠났을 가능성
- 삭제 여부 판단 어려움

---

### 4. 관리 자동화 부족

GitLab 자체 기능만으로는

- 오래된 브랜치 분석
- 담당자 추정
- 삭제 후보 식별

이러한 관리 작업을 자동화하기 어렵다.

---

# 2. Goal

GitBroom의 목표는 다음과 같다.

### 핵심 목표

1. GitLab 브랜치 자동 분석
2. 삭제 후보 브랜치 식별
3. 담당자 추정
4. 브랜치 관리 효율 개선

---

### 성공 기준

다음 기준을 만족하면 성공으로 정의한다.

- 브랜치 상태 자동 분류 가능
- 삭제 후보 브랜치 식별 가능
- 담당자 추정 제공
- UI에서 브랜치 관리 지원

---

# 3. Target Users

GitBroom의 주요 사용자는 다음과 같다.

### 개발자

- 자신의 오래된 브랜치 확인
- 브랜치 정리

### DevOps 엔지니어

- 저장소 관리
- 브랜치 정책 관리

### 프로젝트 관리자

- 팀 브랜치 상태 파악
- 정리 대상 브랜치 확인

---

# 4. Core Features

## 4.1 브랜치 데이터 수집

GitLab REST API를 사용하여 다음 데이터를 수집한다.

수집 데이터

- branch name
- commit date
- commit author
- merge status
- protected 여부

---

## 4.2 브랜치 자동 분류

브랜치는 다음 상태로 분류된다.

- safe
- review-needed
- delete-recommended

---

### 분류 알고리즘

```
기본/보호 브랜치           → 안전
병합됨 + reviewDays 초과  → 삭제 권장
병합됨 + 최근              → 확인 필요
임시패턴 + staleDays 초과 → 삭제 권장
임시패턴 + 최근            → 확인 필요
staleDays 초과             → 확인 필요
그 외                      → 안전
```

기본 설정

```
staleDays = 90
reviewDays = 30
```

---

## 4.3 담당자 추정

브랜치 담당자는 다음 우선순위로 추정한다.

```
1. Merge Request Author
2. 브랜치명 패턴
3. 마지막 커밋 작성자
```

---

## 4.4 브랜치 검색 및 필터

사용자는 다음 기능을 사용할 수 있다.

- 브랜치명 검색
- 담당자 검색
- 분류별 필터
- 정렬

---

## 4.5 알림 메시지 생성

브랜치 담당자에게 보낼 메시지를 자동 생성한다.

예

```
안녕하세요.
branch feature/login 이 오래되어 정리가 필요합니다.
확인 부탁드립니다.
```

클립보드 복사 기능 제공.

---

# 5. Non Goals

현재 MVP에서는 다음 기능을 제공하지 않는다.

- 브랜치 자동 삭제
- GitLab webhook
- 사용자 권한 관리
- 팀원 목록 자동 연동

---

# 6. System Architecture

GitBroom은 다음 구조로 동작한다.

```
GitLab API
   ↓
branch data collector
   ↓
branch classifier
   ↓
owner estimator
   ↓
API response
   ↓
Frontend UI
```

---

# 7. Data Source

GitBroom은 두 가지 모드를 지원한다.

### Mock Mode

개발 및 데모를 위해 샘플 데이터를 제공한다.

```
src/lib/mock-data.ts
```

24개의 브랜치 데이터 포함.

---

### Live Mode

GitLab API를 사용하여 실제 프로젝트 데이터를 분석한다.

```
src/lib/gitlab-client.ts
```

필요 환경 변수

```
GITLAB_URL
GITLAB_TOKEN
GITLAB_PROJECT_ID
```

---

# 8. UX Requirements

UI는 다음 기준을 만족해야 한다.

- 직관적인 브랜치 상태 표시
- 삭제 권장 브랜치 강조
- 검색 및 필터 제공
- 메시지 복사 기능 제공

---

# 9. Future Improvements

향후 추가 예정 기능

### 브랜치 자동 삭제

GitLab API를 통해 직접 삭제

---

### Slack / Teams 알림

브랜치 정리 알림 자동 발송

---

### 정기 분석 리포트

스케줄 기반 브랜치 상태 분석

---

### 브랜치 보존 정책

화이트리스트 관리

---

# 10. Success Metrics

GitBroom의 성공은 다음 기준으로 측정한다.

- 삭제 대상 브랜치 식별 시간 감소
- 브랜치 관리 효율 증가
- 저장소 브랜치 수 감소