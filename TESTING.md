# TESTING.md

# GitBroom Testing Strategy

이 문서는 GitBroom 프로젝트의 테스트 전략과 현재 구현된 테스트 범위를 설명합니다.

GitBroom은 GitLab 브랜치를 자동 분석하여 분류하고 담당자를 추정하는 도구이므로,
핵심 로직의 정확성과 안정성을 보장하는 것이 중요합니다.

---

# 1. Testing Goals

테스트의 주요 목적은 다음과 같습니다.

- 브랜치 분류 알고리즘의 정확성 검증
- 담당자 추정 로직 검증
- Mock / Live 모드 판별 로직 검증
- 추후 API 및 UI 테스트 확장 기반 마련

---

# 2. Current Implemented Tests

현재 저장소에는 다음 테스트가 구현되어 있습니다.

- `src/lib/classifier.test.ts`
- `src/lib/owner-estimator.test.ts`
- `src/lib/gitlab-client.test.ts`

이 테스트들은 GitBroom의 핵심 도메인 로직을 우선적으로 검증합니다.

---

# 3. Unit Tests

## 3.1 Branch Classification

테스트 대상

```text
src/lib/classifier.ts
```

검증 항목

- default / protected branch → safe
- merged + reviewDays 초과 → delete-recommended
- temp pattern + staleDays 초과 → delete-recommended

---

## 3.2 Owner Estimation

테스트 대상

```text
src/lib/owner-estimator.ts
```

검증 항목

- MR author가 있으면 최우선 사용
- branch name pattern 기반 추정 동작
- fallback으로 commit author 사용

---

## 3.3 Mock / Live Mode

테스트 대상

```text
src/lib/gitlab-client.ts
```

검증 항목

- `GITLAB_TOKEN` + `GITLAB_PROJECT_ID` 존재 시 Live Mode
- 환경 변수가 없으면 Mock Mode

---

# 4. Planned Next Tests

다음 테스트는 추후 추가 예정입니다.

## API Tests

대상

```text
/api/branches
```

검증 예정 항목

- 정상 응답 반환
- 브랜치 데이터 포함
- 분류 결과 포함
- 담당자 정보 포함

---

## UI Tests

대상

- branch list rendering
- 검색 / 필터 / 정렬
- 알림 메시지 생성 및 복사

---

## Integration Tests

전체 흐름

```text
Mock data / GitLab API
        ↓
classifier
        ↓
owner-estimator
        ↓
API response
        ↓
UI rendering
```

---

# 5. Test Commands

로컬에서 다음 명령으로 테스트를 실행할 수 있습니다.

```bash
npm run test
npm run test:watch
npm run coverage
```

---

# 6. CI/CD Integration

GitHub Actions를 통해 다음 검증을 자동 수행합니다.

```text
Install Dependencies
        ↓
Type Check
        ↓
Lint
        ↓
Test
        ↓
Build
```

워크플로 파일

```text
.github/workflows/ci.yml
```

---

# 7. Coverage Status

GitBroom은 핵심 도메인 로직 중심의 테스트 전략을 사용합니다.

Vitest coverage 기능을 사용하여 테스트 범위를 측정하고 있습니다.

현재 커버리지 요약

```
Statements: 7.81%
Branches:   73.91%
Functions:  72.22%
```

## 커버리지 해석

GitBroom은 **핵심 도메인 로직(classifier / owner-estimator / mode detection)**을
우선적으로 테스트하는 전략을 사용합니다.

따라서 다음 영역은 높은 커버리지를 확보하고 있습니다.

- branch classification logic
- owner estimation logic
- Mock / Live mode detection
- API route logic

UI 컴포넌트(`src/components/*`)는 현재 snapshot / rendering 테스트를
점진적으로 추가할 예정이며, 현재는 핵심 로직 안정성을 우선 검증하고 있습니다.

## 주요 테스트 대상

현재 테스트가 적용된 주요 영역

- `classifier.ts`
- `owner-estimator.ts`
- `gitlab-client.ts`
- `/api/branches` API route
- `page.tsx` UI rendering

## 향후 목표

```
Core logic coverage: 80%+
Overall project coverage: 60%+
```

테스트 범위는 다음 순서로 확장할 예정입니다.

1. UI component rendering tests
2. API integration tests
3. GitLab API mock tests
4. end-to-end scenario tests

# 8. Summary

현재 GitBroom은 문서 기반 테스트 계획만 있는 상태를 넘어서,
핵심 도메인 로직에 대한 실제 테스트 파일과 CI 파이프라인을 갖춘 구조로 확장되었습니다.

다음 단계는 API / UI / Integration 테스트를 추가하여
품질 검증 범위를 점진적으로 넓히는 것입니다.