# TESTING.md

# GitBroom Testing Strategy

이 문서는 GitBroom 프로젝트의 테스트 전략과 코드 품질 검증 방식을 설명합니다.

GitBroom은 브랜치 분석 로직의 정확성과 안정성을 보장하기 위해  
다양한 테스트 전략을 적용할 수 있도록 설계되었습니다.

---

# 1. Testing Goals

테스트의 주요 목적은 다음과 같습니다.

- 브랜치 분류 알고리즘의 정확성 검증
- 담당자 추정 로직 검증
- API 응답 안정성 확인
- UI 기능 정상 동작 확인

---

# 2. Test Scope

GitBroom에서 테스트 대상은 다음과 같습니다.

| 영역 | 테스트 대상 |
|-----|-------------|
| Domain Logic | branch classifier |
| Domain Logic | owner estimator |
| API | /api/branches |
| UI | branch list rendering |
| Integration | 전체 데이터 흐름 |

---

# 3. Unit Tests

Unit Test는 핵심 로직을 검증합니다.

테스트 대상

```
src/lib/classifier.ts
src/lib/owner-estimator.ts
```

검증 항목

### Branch Classification

다음 조건에서 올바른 분류가 이루어지는지 확인합니다.

예

```
merged + reviewDays 초과 → delete-recommended
temp branch + staleDays 초과 → delete-recommended
staleDays 초과 → review-needed
```

---

### Owner Estimation

담당자 추정 로직 검증

우선순위

```
MR author
branch name pattern
commit author
```

테스트 예

```
MR author 존재 → 해당 author 반환
MR 없음 + branch pattern → 패턴 기반 owner 반환
둘 다 없음 → commit author 반환
```

---

# 4. API Tests

API 테스트는 `/api/branches` 엔드포인트를 검증합니다.

테스트 항목

- 정상 응답 반환
- 브랜치 데이터 포함
- 분류 결과 포함
- 담당자 정보 포함

응답 예

```json
{
  "branches": [
    {
      "name": "feature/login",
      "classification": "review-needed",
      "owner": "alice"
    }
  ]
}
```

---

# 5. Integration Tests

Integration Test는 전체 데이터 흐름을 검증합니다.

테스트 흐름

```
GitLab API / Mock Data
        ↓
Branch Classifier
        ↓
Owner Estimator
        ↓
API Response
```

검증 항목

- 전체 파이프라인 정상 동작
- 브랜치 데이터 누락 없음
- 분류 로직 정상 적용

---

# 6. UI Testing

UI 테스트는 사용자 인터페이스 동작을 검증합니다.

검증 대상

- 브랜치 목록 표시
- 검색 기능
- 필터 기능
- 알림 메시지 생성
- 클립보드 복사 기능

---

# 7. Mock Mode Testing

GitBroom은 Mock 모드를 지원합니다.

Mock Mode에서는 다음을 검증합니다.

- Mock 데이터 정상 로드
- 분류 로직 정상 동작
- UI 렌더링 정상

Mock 데이터 위치

```
src/lib/mock-data.ts
```

---

# 8. Live Mode Testing

GitLab API를 사용하는 경우 다음을 검증합니다.

- API 인증 정상 동작
- 브랜치 목록 정상 조회
- API 오류 처리

필요 환경 변수

```
GITLAB_URL
GITLAB_TOKEN
GITLAB_PROJECT_ID
```

---

# 9. CI/CD Integration

GitBroom은 CI/CD 파이프라인에서 다음 검증을 수행할 수 있습니다.

```
Install Dependencies
        ↓
Lint Check
        ↓
Build
        ↓
Test Execution
```

예시 GitHub Actions Workflow

```
name: CI

on:
  push:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v3

      - name: install dependencies
        run: npm install

      - name: lint
        run: npm run lint

      - name: build
        run: npm run build
```

---

# 10. Test Coverage

권장 테스트 커버리지

```
80% 이상
```

특히 다음 영역은 높은 커버리지가 필요합니다.

- classifier logic
- owner estimator
- API route

---

# 11. Future Testing Improvements

향후 다음 테스트를 추가할 수 있습니다.

### E2E Testing

도구

```
Playwright
Cypress
```

---

### Performance Testing

대규모 브랜치 환경 테스트

---

### GitLab API Mock Testing

외부 API 의존성 제거

---

# 12. Summary

GitBroom 테스트 전략 핵심

- 핵심 로직 Unit Test
- API 테스트
- Integration 테스트
- UI 기능 검증
- CI/CD 자동 검사