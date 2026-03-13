# 🧹 GitBroom - GitLab Branch Manager

> GitLab 브랜치를 자동 분석하여 삭제 후보를 분류하고 담당자 확인까지 돕는 웹 관리 도구

해커톤 MVP - Mock 데이터로 즉시 시연 가능하며, GitLab API 연동도 지원합니다.

---

## 빠른 시작

```bash
npm install
npm run dev
# → http://localhost:3000
```

GitLab 환경 변수 없이 실행하면 **Mock 모드**로 24개 샘플 브랜치가 표시됩니다.

---

## GitLab 연동 (선택)

```bash
cp .env.local.example .env.local
# .env.local 편집
```

```env
GITLAB_URL=https://gitlab.example.com
GITLAB_TOKEN=glpat-xxxxxxxxxxxxxxxxxxxx
GITLAB_PROJECT_ID=12345678
```

환경 변수 설정 후 재시작 시 **LIVE 모드**로 실제 저장소의 브랜치를 분석합니다.

---

## 주요 기능

| 기능 | 설명 |
|------|------|
| 자동 분류 | 병합 여부, 경과 시간, 브랜치 패턴 기반으로 안전/확인필요/삭제권장 분류 |
| 담당자 추정 | MR 작성자 > 브랜치명 패턴 > 커밋 작성자 순으로 추정 |
| 분류 규칙 조정 | UI에서 staleDays/reviewDays 등 규칙 즉시 변경 가능 |
| 알림 메시지 생성 | 담당자에게 보낼 메시지 자동 생성 + 클립보드 복사 |
| 검색/필터/정렬 | 브랜치명/담당자 검색, 분류별 필터, 다양한 정렬 |

---

## 분류 알고리즘

```
기본/보호 브랜치           → 안전
병합됨 + reviewDays 초과  → 삭제 권장
병합됨 + 최근              → 확인 필요
임시패턴 + staleDays 초과 → 삭제 권장
임시패턴 + 최근            → 확인 필요
staleDays 초과             → 확인 필요
그 외                      → 안전
```

기본값: `staleDays=90`, `reviewDays=30`

---

## 기술 스택

- **Next.js 14** (App Router) + TypeScript
- **Tailwind CSS** + shadcn/ui
- **GitLab REST API** (또는 Mock 모드)
- DB 없음 - 메모리/API 기반

---

## 한계점 및 향후 계획

**현재 한계:**
- 삭제 실행 기능 없음 (링크 제공만)
- GitLab webhook 미지원 (수동 새로고침)
- 팀원 목록 연동 없음 (담당자 추정에 의존)

**향후 계획:**
- GitLab API로 브랜치 직접 삭제
- Slack/Teams 알림 자동 발송
- 정기 스케줄 분석 리포트
- 브랜치 보존 화이트리스트 관리
