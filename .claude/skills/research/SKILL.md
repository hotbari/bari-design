---
name: research
description: "Run user research workflows — persona creation, empathy mapping, journey mapping, interview simulation, and synthesis. Use when the user wants to understand users, validate assumptions, or gather qualitative insights."
user-invocable: true
---

# Research

UX 리서치 스킬 허브. 하위 커맨드와 스킬을 조합하여 리서치 사이클을 실행합니다.

## Available Commands

| Command | Description |
|---------|-------------|
| `/discover` | 페르소나 → 공감지도 → 여정지도 풀사이클 |
| `/synthesize` | 정성 데이터를 어피니티 다이어그램 + JTBD로 구조화 |
| `/interview` | 인터뷰 스크립트 생성 + 페르소나 시뮬레이션 |
| `/scenario-test-plan` | 유저빌리티 테스트 플랜 설계 |
| `/handoff` | 리서치 결과물을 UX 전략 단계 인풋으로 변환 |

## Usage

인자 없이 `/research` 실행 시, 위 커맨드 목록을 보여주고 사용자에게 어떤 리서치 활동을 원하는지 질문합니다.

인자가 있으면 맥락에 맞는 커맨드를 추천합니다:
- 제품/기능 이름 → `/discover` 추천
- 인터뷰 데이터/노트 → `/synthesize` 추천
- 페르소나 파일 → `/interview` 추천
