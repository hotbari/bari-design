# Color Taste — Visual Companion Guide

색상 프리뷰를 브라우저에서 보여줄 때의 규칙. brainstorming 스킬의 서버 인프라를 재사용한다.

## 서버 시작

brainstorming 스킬 서버를 사용한다:

```bash
# Windows (run_in_background: true 필수)
bash .claude/skills/brainstorming/scripts/start-server.sh --project-dir "D:/path/to/project"
```

서버 시작 후 반환된 JSON에서 `url`과 `screen_dir`을 저장해 둔다.

## URL 규칙

**반드시 루트만 사용한다: `http://localhost:{port}`**

- 서버는 `/`에서 `screen_dir` 내 가장 최근 `.html` 파일을 자동 서빙한다
- `/color-preview-v2.html` 같은 파일명 포함 경로 → 404 Not Found
- 특정 파일 직접 접근이 필요하면 `/files/<filename>` 형식 사용

사용자에게 URL을 알려줄 때는 항상 포트 번호까지만 (`http://localhost:54390`).
파일명을 붙여서 알려주는 것은 잘못된 URL이다.

## 프리뷰 HTML 작성

### 품질 기준

프리뷰는 **실제 프로덕트처럼** 보여야 한다. 컴포넌트가 조잡하면 사용자의 시선이 색이 아니라 UI 품질로 쏠린다. 색상 판단을 방해하는 "구린" UI는 색상 검토를 무력화한다.

- 타이포그래피: 적절한 폰트 크기, 자간, 행간 사용
- 간격: 충분한 padding/margin, 비어 보이는 영역 없음
- 실제 콘텐츠: placeholder 텍스트 대신 프로젝트 맥락에 맞는 실제 문구 사용
- 상태 표현: hover, active, disabled 상태 구분 명확히

### 필수 구성 요소

1. **색상 스와치**: 각 토큰의 색상 블록 + OKLCH/Hex 표기
2. **UI 컴포넌트 데모**: 프로젝트 맥락에 맞는 실제 UI 예시
   - 카드 (정상 상태 vs 에러 상태 대비)
   - 알림/배너 (Error / Warning / Info 구분)
   - 입력 폼 (포커스 시 Primary 테두리)
   - 버튼 시스템 (size variants, disabled 상태)
   - 파괴적 액션 확인 모달 (Error 강조)
   - 네비게이션 (활성/비활성 대비)
3. **CSS 변수**: `:root`에 OKLCH 변수로 정의하여 토큰 구조 확인 가능

### 파일 작성

```bash
# screen_dir에 파일 저장
# Write 툴 사용 (cat/heredoc 금지)
# 파일명은 의미 있게: color-preview.html, color-preview-v2.html
# 파일명 재사용 금지 — 새 버전은 항상 새 파일
```

brainstorming 서버는 full document (`<!DOCTYPE html>`로 시작)를 그대로 서빙한다.
색상 프리뷰는 자체 CSS를 포함하는 full document로 작성한다.

## 피드백 반영 시

수정 요청이 오면 새 파일로 작성 (`color-preview-v2.html`). 서버가 자동으로 최신 파일을 서빙한다.
사용자에게 URL은 동일하게 안내 — 새로고침하면 업데이트된 버전이 보인다.
