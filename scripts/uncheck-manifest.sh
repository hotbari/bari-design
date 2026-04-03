#!/usr/bin/env bash
# PostToolUse hook: 시나리오 파일이 수정되면 MANIFEST.md에서 해당 도메인 [x]를 [ ]로 변경
#
# 입력: CLAUDE_TOOL_USE_FILE_PATH 환경변수 (Edit/Write 도구가 수정한 파일 경로)
# hook은 stdin으로 JSON을 받음: {"tool_name":"Edit","tool_input":{"file_path":"...",...}}

set -euo pipefail

MANIFEST="docs/scenarios/MANIFEST.md"
SCENARIOS_DIR="docs/scenarios"

# stdin에서 수정된 파일 경로 추출
INPUT=$(cat)
FILE_PATH=$(echo "$INPUT" | python3 -c "import sys,json; d=json.load(sys.stdin); print(d.get('tool_input',{}).get('file_path',''))" 2>/dev/null || echo "")

# 파일 경로가 비어있으면 종료
[ -z "$FILE_PATH" ] && exit 0

# 절대경로를 상대경로로 변환
REPO_ROOT=$(git rev-parse --show-toplevel 2>/dev/null || pwd)
REL_PATH="${FILE_PATH#"$REPO_ROOT"/}"

# docs/scenarios/*.md 파일인지 확인 (MANIFEST.md 제외)
case "$REL_PATH" in
  "$SCENARIOS_DIR"/*.md)
    BASENAME=$(basename "$REL_PATH")
    [ "$BASENAME" = "MANIFEST.md" ] && exit 0
    ;;
  *)
    exit 0
    ;;
esac

# MANIFEST.md에서 해당 파일명이 포함된 줄의 [x]를 [ ]로 변경
if [ -f "$REPO_ROOT/$MANIFEST" ]; then
  if grep -q "\[x\].*$BASENAME" "$REPO_ROOT/$MANIFEST"; then
    sed -i '' "s/\[x\]\(.*$BASENAME\)/[ ]\1/" "$REPO_ROOT/$MANIFEST"
    echo "MANIFEST.md: $(basename "$BASENAME" .md) 도메인 검증 해제됨"
  fi
fi
