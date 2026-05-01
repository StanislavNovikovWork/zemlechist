<!-- ======================================== -->

<!-- NEXT.JS RULES -->

<!-- ======================================== -->

<!-- BEGIN:nextjs-agent-rules -->

# Next.js Rules (Strict)

This is NOT the standard Next.js version.

* APIs, conventions, and structure may differ from training data
* You MUST read relevant docs from: node_modules/next/dist/docs/
* You MUST follow actual project version behavior
* You MUST respect deprecations and warnings

If unsure — do not assume, check documentation first.

<!-- END:nextjs-agent-rules -->

<!-- ======================================== -->

<!-- AGENT BEHAVIOR -->

<!-- ======================================== -->

<!-- BEGIN:agent-behavior-rules -->

# Agent Behavior Rules (Strict)

You MUST follow this workflow for EVERY task:

## Step 1 — Analysis

* Analyze the request
* Identify requirements and constraints
* Check AGENTS.md and CODESTANDARTS.md

## Step 2 — Plan (MANDATORY)

* Propose a clear step-by-step solution
* Do NOT write code
* Do NOT modify files
* Do NOT suggest ready-to-paste implementations yet

## Step 3 — Approval

* Ask the user for explicit approval
* Example: "Do you approve this plan?"

## Step 4 — Implementation (ONLY AFTER APPROVAL)

* Proceed ONLY if user clearly confirms (e.g. "approved", "go ahead")

## HARD RESTRICTIONS

You are NOT allowed to:

* Write code before approval
* Modify files before approval
* Run commands before approval
* Assume approval

If approval is unclear → treat it as NOT given

## REQUIRED RESPONSE FORMAT

You MUST always respond in this format before implementation:

Plan:

* step 1
* step 2
* step 3

Standards:

* which rules from CODESTANDARTS.md will be applied

Risks:

* potential issues (optional but recommended)

Ask:
"Do you approve this plan?"

WAIT for user response.

<!-- END:agent-behavior-rules -->

<!-- ======================================== -->

<!-- CODE STANDARDS ENFORCEMENT -->

<!-- ======================================== -->

<!-- BEGIN:code-standards-enforcement -->

# Code Standards Enforcement (Mandatory)

Before proposing ANY implementation:

1. You MUST read CODESTANDARTS.md
2. You MUST follow ALL rules строго (no exceptions)
3. You MUST validate your plan against these standards
4. You MUST mention relevant standards in your plan

If the plan violates standards:

* You MUST fix the plan BEFORE asking for approval

You are NOT allowed to generate code that violates CODESTANDARTS.md

<!-- END:code-standards-enforcement -->

<!-- ======================================== -->

<!-- IMPLEMENTATION RULES -->

<!-- ======================================== -->

<!-- BEGIN:implementation-rules -->

# Implementation Rules

After approval:

* Follow the approved plan exactly
* Do NOT introduce unrelated changes
* Do NOT refactor outside the scope unless explicitly approved

## Code Quality

* Keep code minimal and focused
* Avoid overengineering
* Prefer clarity over cleverness

## TypeScript

* Types must be explicit
* Avoid unnecessary complexity
* Follow project conventions

## Components

* Follow CODESTANDARTS.md strictly
* All props interfaces MUST:

  * be in the same file as the component
  * have JSDoc in Russian
  * document ALL properties

If any rule cannot be satisfied:

* STOP
* Explain the issue
* Ask for clarification

<!-- END:implementation-rules -->

<!-- ======================================== -->

<!-- FAILURE HANDLING -->

<!-- ======================================== -->

<!-- BEGIN:failure-handling -->

# Failure Handling

If something is unclear:

* Do NOT guess
* Do NOT implement
* Ask clarifying questions

If documentation conflicts with assumptions:

* Trust documentation over assumptions

If user request conflicts with standards:

* Explain conflict
* Propose compliant alternative

<!-- END:failure-handling -->
