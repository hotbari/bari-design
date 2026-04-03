---
name: verify-prototype
description: Use when verifying the DOOH CMS HTML prototype works correctly for each persona role — checks menu access, link integrity, and click-through flows using Playwright MCP
argument-hint: "[role: admin|media|ops|sales] (omit for all roles)"
user-invocable: true
---

# Verify Prototype

Playwright MCP로 DOOH CMS HTML 프로토타입의 페르소나별 검증을 수행한다.

## Usage

```
/verify-prototype              → 4개 역할 전부 병렬 검증
/verify-prototype sales        → 특정 역할만 검증
/verify-prototype admin,sales  → 복수 역할 검증
```

## Execution

### 1. Determine Roles

Parse the argument:
- No argument → roles = `["admin", "media", "ops", "sales"]`
- Single role (e.g. `sales`) → roles = `["sales"]`
- Comma-separated (e.g. `admin,sales`) → roles = `["admin", "sales"]`

Validate each role is one of: `admin`, `media`, `ops`, `sales`. Reject unknown roles.

### 2. Determine Base Path

The prototype lives at `{project_root}/prototype/`. Use the current working directory as project root.

### 3. Dispatch Agents

For each role, dispatch a `prototype-verifier` agent using the Agent tool:

```
Agent(
  subagent_type: "prototype-verifier",
  prompt: "role: {role}\nbasePath: {project_root}",
  description: "Verify prototype as {role}"
)
```

**Critical:** If multiple roles, dispatch ALL agents in a SINGLE message (parallel execution). Do NOT dispatch sequentially.

### 4. Collect Results

Each agent returns a structured verification report. Collect all results.

### 5. Output Summary

Print a combined summary:

```markdown
# 프로토타입 검증 결과

| 역할 | 메뉴 접근 | 링크 무결 | 핵심 플로우 | 특수 검증 | 종합 |
|------|:---------:|:---------:|:-----------:|:---------:|:----:|
| admin (박진수) | ✅ | ✅ | ✅ | ✅ | ✅ PASS |
| media (김서영) | ✅ | ✅ | ✅ | — | ✅ PASS |
| ops (이준혁) | ✅ | ✅ | ✅ | — | ✅ PASS |
| sales (최유진) | ✅ | ✅ | ✅ | ✅ | ✅ PASS |

[각 에이전트의 상세 리포트는 접어서 표시]
```

If any role has FAILs, list the specific failures below the table.
