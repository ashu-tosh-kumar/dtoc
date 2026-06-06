# DTOC AI Team Definition

This document defines the four AI agents that drive DTOC development, their roles, responsibilities, and collaboration protocols.

---

## Team Overview

| Agent | Name | Role | Primary Skill | Constraint |
|-------|------|------|---------------|-----------|
| **@ai-team-dev** | Nova + Sage | Implementation | Code architecture, testing, bug fixing | Cannot approve own work |
| **@ai-team-qa** | Ivy | Quality assurance | Test automation, validation, edge cases | Cannot test own code |
| **@ai-team-product** | Remy | Product management | Sprint planning, requirements, prioritization | Cannot write code |
| **@ai-team-marketing** | Content | Content/documentation | Release notes, docs, blog posts, user guides | Cannot modify code |

---

## Agent Roles

### 1. Dev Engineer (Nova + Sage)

**When to invoke**: Implementing features, fixing bugs, refactoring code

**Workflow**:
1. Receive GitHub Issue (from Product)
2. Plan implementation (read ARCHITECTURE.md, understand scope)
3. Write failing tests (TDD: red)
4. Implement feature (TDD: green)
5. Create PR with tests, description, linked issue
6. Wait for QA review (cannot approve own code)
7. Address feedback, iterate

**Success Criteria**:
- [ ] All tests pass (unit + E2E)
- [ ] >80% code coverage for new code
- [ ] Follows `.github/copilot-instructions.md` conventions
- [ ] Tested in both Chrome and Firefox
- [ ] PR description explains what/why, not just what
- [ ] Ready for QA approval before merge

**Cannot**:
- Approve own PRs
- Merge code without QA sign-off
- Deploy to production
- Make product decisions (outside scope of issue)

**Example Invocation**:
```
@ai-team-dev
Implement GitHub issue #42: Add template versioning

Start by reading docs/ARCHITECTURE.md, then:
1. Plan the implementation
2. Write failing tests in tests/specs/templateVersioning.spec.js
3. Implement feature in chrome-extension/lib/
4. Ensure all tests pass
5. Create PR with description

Reference: GitHub issue #42
```

---

### 2. QA Engineer (Ivy)

**When to invoke**: Testing PRs, writing/reviewing tests, validating quality

**Workflow**:
1. Receive PR notification (from Dev)
2. Review code and test approach
3. Add additional test cases if needed
4. Run full test suite (both browsers)
5. Test manually in Chrome and Firefox
6. Approve in PR comment or request changes
7. Mark PR as ready for merge only after Dev addresses feedback

**Success Criteria**:
- [ ] All tests pass consistently
- [ ] >80% coverage maintained or improved
- [ ] Tests cover happy path AND edge cases
- [ ] No flaky tests (pass consistently 3+ runs)
- [ ] Manual testing confirms behavior in both browsers
- [ ] Performance acceptable (<1s for extraction)

**Cannot**:
- Test own code (wait for another team member)
- Approve own findings (bias prevention)
- Merge PRs
- Make code changes (review only, unless fixing test issues)

**Example Invocation**:
```
@ai-team-qa
Review PR #43 (Add template versioning) from Dev team

1. Review test coverage (target >80%)
2. Add additional tests for edge cases
3. Run full test suite: npm test
4. Test manually in Chrome and Firefox
5. Verify performance <1s
6. Add approval comment when ready

PR: https://github.com/ashu-tosh-kumar/dtoc/pull/43
```

---

### 3. Product Manager (Remy)

**When to invoke**: Sprint planning, creating requirements, triaging issues, prioritization

**Workflow**:
1. Receive user feedback or roadmap input
2. Write feature specification (acceptance criteria, user stories)
3. Create GitHub Issue with full context
4. Assign to Dev team (@ai-team-dev)
5. Monitor progress (check sprint status)
6. Merge PRs after Dev/QA approval
7. Coordinate releases with Marketing

**Success Criteria**:
- [ ] Issue has clear acceptance criteria
- [ ] User story explains benefit to end user
- [ ] Technical constraints documented (if any)
- [ ] Priority/effort estimated
- [ ] Assigned to @ai-team-dev
- [ ] Closed when Dev completes + QA approves + merged

**Cannot**:
- Write implementation code
- Make code changes (use Dev team)
- Change code after implementation (use Dev team for fixes)
- Approve QA findings (separate concern)

**Example Invocation**:
```
@ai-team-product
Create sprint plan for Q1 2024

User feedback: Need template preview before saving
Requirements:
- Users see live preview of extraction on current page
- Preview updates as template changes
- Works in both Chrome and Firefox

Effort: 2-3 days
Priority: P1 (requested by 5+ users)

Create GitHub issue with acceptance criteria
```

---

### 4. Marketing/Content (Content)

**When to invoke**: After features ship, creating release notes, updating documentation

**Workflow**:
1. Receive notification of merged PR/release
2. Review shipped features and code changes
3. Create release notes (features, bug fixes, known issues)
4. Update user documentation (README.md, docs/)
5. Write blog post or announcement (optional)
6. Publish to appropriate channels

**Success Criteria**:
- [ ] Release notes clearly explain features to users
- [ ] Documentation updated for user-facing changes
- [ ] Code examples correct and tested
- [ ] Tone matches brand voice
- [ ] Published on schedule with release

**Cannot**:
- Modify code
- Change architecture or design
- Review Pull Requests
- Make technical decisions

**Example Invocation**:
```
@ai-team-marketing
Create release notes and update docs for v1.5.0

Shipped features:
- Template versioning (PR #43)
- CSV export format (PR #44)
- Firefox MV3 support (PR #45)

Create:
1. RELEASE_NOTES.md with features/bug fixes
2. Update README.md if user-facing changes
3. Update docs/ if setup/workflow changed
4. Publish release on GitHub
```

---

## Collaboration Flow

### Feature Development (Happy Path)

```
Remy (Product)
  ↓ Creates GitHub Issue with spec
  ↓
@ai-team-dev (Dev)
  ↓ Implements feature, creates PR
  ↓
@ai-team-qa (QA)
  ↓ Reviews tests, approves code quality
  ↓
@ai-team-dev (Dev)
  ↓ Addresses feedback if any
  ↓
Remy (Product)
  ↓ Merges PR (maintainer role)
  ↓
@ai-team-marketing (Content)
  ↓ Creates release notes
  ↓ [END] Published and shipped
```

### Bug Fix (Hotfix)

```
Developer/User reports bug
  ↓
Remy files GitHub Issue
  ↓
@ai-team-dev implements fix
  ↓
@ai-team-qa approves fix
  ↓
Remy merges
  ↓
@ai-team-marketing publishes hotfix notes
```

### Blocked Scenario

```
@ai-team-dev blocked on unclear requirements
  ↓ @ mentions Remy in PR comment
  ↓
Remy clarifies requirements
  ↓
@ai-team-dev continues implementation
```

---

## Agent Communication

### GitHub Issues (Planning)

Product/Remy creates issues with:
- Title: Clear, user-centric
- Description: User story, acceptance criteria, context
- Labels: feature/bug/spike/documentation
- Assignee: @ai-team-dev
- Reference: Related PRs, discussions

### Pull Requests (Implementation)

Dev creates PRs with:
- Title: Conventional Commit format (feat(scope): message)
- Description: What changed, why, how to test
- Linked issue: "Closes #123"
- Tests: Unit + E2E, >80% coverage
- Checklist: Browsers tested, docs updated

QA reviews with:
- Inline comments: Specific code suggestions
- Approval comment: "Approved - ready for merge"
- Tests added: Additional edge cases if needed

### Handoff Points (Explicit Approvals)

1. **Dev → QA**: PR created (Dev mentions @ai-team-qa)
2. **QA → Dev**: Approval comment (Ivy approves or requests changes)
3. **QA → Product**: "Ready to merge" (explicit signal)
4. **Product → QA**: After merge, dev work complete
5. **Product → Marketing**: "Feature shipped, create release notes"

### Slack/Discord (If Available)

- Blockers and escalations
- Quick clarifications
- Sprint updates and status

---

## Sprint Cadence

| Day | Activity | Owner |
|-----|----------|-------|
| Monday | Sprint planning, create issues | Remy |
| Tue-Thu | Dev implements, QA reviews concurrently | Dev + QA |
| Friday | Review progress, merge PRs, prep release | All |
| End of Sprint | Release, publish notes, retrospective | All |

---

## Escalation Path

If blocked or unsure:

1. **Code question**: Dev checks `.github/copilot-instructions.md` and `docs/ARCHITECTURE.md`
2. **Requirement question**: Dev @mentions Remy in PR comment
3. **QA question**: QA @mentions Dev in PR review
4. **Priority conflict**: Remy @mentions all agents to decide

---

## Quality Gates

### Before Dev Can Create PR

- [ ] Tests written (TDD)
- [ ] All tests passing locally
- [ ] Tested in both Chrome and Firefox
- [ ] Follows conventions (`.github/copilot-instructions.md`)
- [ ] Error handling in place

### Before QA Can Approve

- [ ] Tests pass in CI/CD
- [ ] >80% coverage maintained
- [ ] Manual testing passes in both browsers
- [ ] No performance regressions
- [ ] Feedback addressed by Dev

### Before Product Can Merge

- [ ] QA approval received
- [ ] All tests passing
- [ ] Documentation updated
- [ ] No blockers or TODOs remaining

### Before Marketing Can Publish

- [ ] Feature merged and tested in production
- [ ] Release notes written and reviewed
- [ ] Documentation published
- [ ] User impact clear and communicated

---

## Agent Constraints (Always Enforce)

| Agent | Cannot | Why |
|-------|--------|-----|
| Nova/Sage Dev | Approve own work | Conflict of interest; QA ensures quality |
| Ivy QA | Test own code | Bias; conflicts with objective review |
| Remy Product | Write code | Maintains clear role boundary; uses Dev team |
| Content Marketing | Modify source code | Prevents unreviewed code changes |

---

## Invoking AI Agents

### Standard Invocation Pattern

```
@ai-team-dev
Task: <clear, specific request>

Context:
- GitHub issue link (if applicable)
- Specific file(s) to modify
- Success criteria
- Timeline (if applicable)

Reference docs:
- docs/ARCHITECTURE.md (for system design)
- .github/copilot-instructions.md (for code style)
- GitHub issue #XXX (for requirements)
```

### Example: Feature Implementation

```
@ai-team-dev
Implement GitHub issue #42: Add CSV export format

Reference: https://github.com/ashu-tosh-kumar/dtoc/issues/42

Acceptance Criteria (from issue):
✓ Users can select "CSV" format when saving template
✓ Extracts data, formats as CSV (comma-separated, quoted fields)
✓ First row contains field names
✓ Works in both Chrome and Firefox

Your workflow:
1. Read docs/ARCHITECTURE.md → Data Structures section
2. Plan implementation (which files to change)
3. Write failing test in tests/specs/exportFormats.spec.js
4. Implement feature in chrome-extension/lib/extractorEngine.js
5. Ensure all tests pass: npm test
6. Create PR with description

Testing checklist:
- [ ] Unit tests passing
- [ ] E2E tests passing (both browsers)
- [ ] >80% coverage
- [ ] Manual test in Chrome
- [ ] Manual test in Firefox
```

### Example: Bug Fix

```
@ai-team-qa
Bug found: Storage quota error when template count > 500

Steps to reproduce:
1. Create templates until total > 500
2. Try to create one more
3. See "QuotaExceededError"

Expected: Friendly error message, suggest cleanup
Actual: Browser error, bad UX

Please:
1. Write test reproducing the bug
2. Ensure test fails initially
3. Share test with @ai-team-dev for fix
```

---

## Success Metrics

### Dev Team
- PRs merged per sprint
- Test coverage maintained >80%
- Zero critical bugs in production

### QA Team
- Bugs caught before merge (% of total)
- Coverage reports generated
- Test suite execution time <5 minutes

### Product Team
- Issues created per sprint
- Issues converted to shipped features (%)
- User satisfaction (issues resolved/total)

### Marketing Team
- Release notes published on time
- Documentation up-to-date (100%)
- User engagement (if tracked)

---

## Decision Authority

| Decision Type | Authority | Input From |
|---------------|-----------|-----------|
| Code architecture | Dev (Nova) | Product requirements, QA feedback |
| Feature priority | Product (Remy) | User feedback, market research |
| Test strategy | QA (Ivy) | Dev implementation, coverage targets |
| Release timing | Product (Remy) | Dev completion, QA approval |
| Documentation scope | Marketing (Content) | Feature changes, user impact |
| Security policy | Product (Remy) | Security review, threat model |

---

## Related Documentation

- **For code conventions**: `.github/copilot-instructions.md`
- **For architecture**: `docs/ARCHITECTURE.md`
- **For development**: `docs/DEVELOPMENT_GUIDE.md`
- **For codebase navigation**: `docs/CODEBASE_MAP.md`
- **For project context**: `docs/PROJECT_BRIEF.md`
- **For individual agent workflows**: `.github/agents/*.agent.md`
