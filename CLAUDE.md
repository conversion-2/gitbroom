# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # 개발 서버 (http://localhost:3000)
npm run build    # 프로덕션 빌드
npm run lint     # ESLint 검사
```

> 빌드 시 Google Fonts TLS 오류가 나면: `NEXT_TURBOPACK_EXPERIMENTAL_USE_SYSTEM_TLS_CERTS=1 npm run build`
> `next.config.ts`에 `turbopackUseSystemTlsCerts: true`가 설정되어 있어 dev 서버는 자동 적용됨.

## Architecture

**Mock/Live 모드 자동 전환**: `src/lib/gitlab-client.ts`의 `isLiveMode()`가 `GITLAB_TOKEN` + `GITLAB_PROJECT_ID` 환경변수 유무를 감지. 없으면 `src/lib/mock-data.ts`의 24개 샘플 브랜치를 사용.

**데이터 흐름**:
```
useBranches (hook) → GET /api/branches → classifier → owner-estimator → JSON response
                                            ↑
                              mock-data or gitlab-client
```

**분류 파이프라인** (`src/lib/classifier.ts`):
브랜치 1개에 대해 순서대로 규칙 적용: default/protected → merged+stale → merged → tempPattern+stale → tempPattern → stale → safe. `ClassificationConfig`(staleDays, reviewDays, patterns)는 클라이언트에서 조정 가능하며 API query param으로 전달됨.

**shadcn/ui 주의**: 이 프로젝트는 Radix가 아닌 **Base UI** 기반 shadcn을 사용함. `Select`의 `onValueChange`는 `(value: string | null, eventDetails) => void` 시그니처 — null 처리 필요.

**담당자 추정** (`src/lib/owner-estimator.ts`): MR author(95%) > 브랜치명 패턴(70%) > 커밋 author(60%) 순. `MOCK_MR_AUTHORS` 맵으로 Mock 데이터에서 MR author를 시뮬레이션.

## Environment Variables

```env
GITLAB_URL=https://gitlab.example.com       # 기본값: https://gitlab.com
GITLAB_TOKEN=glpat-xxxx                     # 없으면 Mock 모드
GITLAB_PROJECT_ID=12345678                  # 또는 group%2Fproject 형식
```
