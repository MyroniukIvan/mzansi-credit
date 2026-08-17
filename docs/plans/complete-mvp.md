# Complete MVP — Epics 4–9 + partial 8/11

Goal: a working end-to-end lending cycle: apply → scoring (queue) → approve/manual review → disbursement → schedule → mock repayment → closed loan; KYC documents via MinIO; live back-office. Realtime (E10), observability (E11-obs), real Stripe, Playwright — OUT OF SCOPE for this run.

## Requirements

- R1 (E5): submitted application is scored asynchronously via BullMQ; affordability rule (net = income − expenses; monthly installment must be ≤ 40% of net), product limits check; outcomes: approved / rejected / manual_review; every transition audited in audit_log.
- R2 (E6): approval triggers disbursement (mock): Loan created with installment schedule — flat monthly interest (product monthlyInterestBps), initiation fee (initiationFeeBps, added to first installment), monthly service fee on each installment; money in int cents, deterministic rounding (largest remainder on last installment).
- R3 (E7): client can pay an installment (mock provider): Payment row (idempotent via providerPaymentId unique), installment → paid, loan → closed when all paid.
- R4 (E4): client uploads KYC docs to MinIO via presigned PUT; confirm creates Document row; client lists own docs with statuses; underwriter verifies/rejects.
- R5 (E9): office endpoints: review queue (manual_review + scoring/submitted), application detail (with docs + affordability numbers), approve/reject decision with comment; role-gated (underwriter/admin).
- R6 (E3 leftover): products seeded (2 products); application create validates amount/term against chosen product (first active for now).
- R7 (web): documents page, loans card + loan detail page with schedule and Pay button, applications detail/status, office queue + detail wired to real data; office layout server-side role gate.
- R8 (E8 partial): repeatable BullMQ job marks overdue installments daily.
- R9 (E11 partial): vitest unit tests for loan-math (schedule invariants: sum of principal = loan principal, no negative cents) and scoring rules.

## Conventions (binding for every task)

- Money: Int cents; rates: Int bps. No floats in money paths.
- Statuses: reuse enums from `db` (Prisma) and const unions from `shared` — never redeclare.
- API responses: explicit Prisma `select`/mapping to shared types; never leak raw entities.
- Nest: thin controllers, logic in services, `@Inject(PRISMA)` from core/prisma, `ZodValidationPipe` + shared zod schemas for input, `@CurrentUser()`, `@Roles()` for office.
- Web: TanStack Query feature hooks in `features/<domain>/use-*.ts` (pattern: features/applications), Routes constants, no inline JSX handlers, one component per file, no comments.
- Prettier no-semi single-quote; every task ends green on its verify commands.
- DO NOT: edit app.module.ts (integrator wires it), start dev servers, touch .env, commit, install deps outside your task's list.

## Tasks

### Wave 1 (parallel)

T1 — Seed + products API [R6]

- Owns: packages/db/prisma/seed.ts, packages/db/package.json (seed script + tsx devDep), packages/db/prisma.config.ts (migrations.seed), apps/api/src/products/*
- Seed: upsert 2 products (Payday: R500–R4,000, 1–3mo, 600bps, init 1000bps, service R60; Standard: keep existing prod_standard id R500–R15,000 1–6mo 500bps/1000bps/R60). GET /products (public list of active products, mapped DTO). ApplicationsService: validate input.amount/term against product limits (422 on violation) — owns applications.service.ts edit for validation only.
- Verify: pnpm --filter db build && pnpm --filter api check-types && pnpm --filter api lint

T2 — Queue infra + scoring [R1]

- Owns: apps/api/src/core/queue/_, apps/api/src/scoring/_, apps/api/package.json (add bullmq)
- core/queue: BullMQ connection from REDIS_URL (separate ioredis options maxRetriesPerRequest null), queue names const. scoring: producer service (enqueue applicationId), worker (Nest lifecycle: start on module init, graceful shutdown), rules in scoring.utils.ts (pure): productLimits, affordability (installment estimate via flat interest ≤ 40% net), duplicateActiveLoan → decision {approved|rejected|manual_review, reason, score 0–100}. Transition in $transaction + audit_log rows (scoring → decision). Export ScoringService.enqueue for applications module (wired by integrator).
- Verify: pnpm --filter api check-types && pnpm --filter api lint

T3 — Documents backend [R4]

- Owns: apps/api/src/documents/_, apps/api/src/config/s3.client.ts, apps/api/package.json (add @aws-sdk/client-s3 @aws-sdk/s3-request-presigner), .env.example (S3__ keys), packages/shared/src/schemas.ts APPEND-ONLY (documentUploadSchema)
- Endpoints: POST /documents/upload-url {type, mimeType, sizeBytes} → {uploadUrl, s3Key} (presigned PUT, bucket "documents", key userId/type/uuid, validate mime pdf/jpeg/png, ≤10MB); POST /documents/confirm {s3Key, type, mimeType, sizeBytes} → Document row (pending); GET /documents (mine, with presigned GET url); office review is T6's.
- Verify: pnpm --filter shared build && pnpm --filter api check-types && pnpm --filter api lint

### Wave 2 (after Wave 1 integration; parallel)

T4 — Loan math + disbursement + loans API [R2]

- Owns: packages/shared/src/loan-math.ts, packages/shared/src/index.ts (append export), packages/shared/package.json (vitest devDep + test script), packages/shared/vitest.config.ts, packages/shared/src/loan-math.test.ts, apps/api/src/loans/*
- shared loan-math: buildSchedule({principalCents, termMonths, monthlyInterestBps, initiationFeeBps, monthlyServiceFeeCents}) → installments[{sequence, principalCents, interestCents, feeCents}], invariants tested [R9 part]. api loans: LoansService.disburse(applicationId) ($transaction: Loan + installments + status disbursed→active + audit), called by scoring worker on approve (integrator wires); GET /loans (mine, summary + next due), GET /loans/:id (with installments).
- Verify: pnpm --filter shared build && pnpm --filter shared test && pnpm --filter api check-types && pnpm --filter api lint

T5 — Office backend [R5]

- Owns: apps/api/src/office/*
- GET /office/applications?status= (queue, default manual_review, ApplicationSummary + docs count), GET /office/applications/:id (full: applicant, numbers, documents with presigned GET, score/reason), POST /office/applications/:id/decision {decision: approved|rejected, comment} (only from manual_review; transition + audit; approve → LoansService.disburse), POST /office/documents/:id/review {status: verified|rejected, reason?}. All @Roles('underwriter','admin').
- Verify: pnpm --filter api check-types && pnpm --filter api lint

T6 — Web: documents + applications detail [R7 part]

- Owns: apps/web/features/documents/_, apps/web/components/dashboard/document-_.tsx, required-documents-list.tsx, apps/web/app/dashboard/documents/page.tsx, apps/web/features/applications/use-applications.ts (append detail hook), apps/web/app/dashboard/applications/[id]/page.tsx, apps/web/components/dashboard/application-detail.tsx, application-card.tsx (link to detail)
- Documents: hooks (list/upload: get url → PUT file → confirm → invalidate), dropzone wired with real upload + progress states, list shows real statuses. Applications: detail page (status, amounts, timeline placeholder from status, docs prompt when manual_review).
- Verify: pnpm --filter web check-types && pnpm --filter web lint && pnpm --filter web build

### Wave 3 (after Wave 2 integration; parallel)

T7 — Payments + web loans [R3, R7 part]

- Owns: apps/api/src/payments/_, apps/web/features/loans/_, apps/web/app/dashboard/loans/[id]/page.tsx, apps/web/components/dashboard/loan-*.tsx, loans-card.tsx
- api: POST /payments {loanId, sequence} mock: Payment(succeeded, providerPaymentId `mock_<loanId>_<seq>` unique → repeat = 409/no-op), installment paid + paidAt, loan closed when all paid, audit. web: loans hooks, loans-card live (active loan, next installment), loan detail page (schedule table, Pay buttons, paid states).
- Verify: pnpm --filter api check-types && pnpm --filter api lint && pnpm --filter web check-types && pnpm --filter web build

T8 — Web office wiring [R7 part]

- Owns: apps/web/features/office/_, apps/web/app/office/\**, apps/web/components/office/_
- Office layout: server-side role gate (fetch get-session with forwarded cookie; not client/underwriter → redirect Routes.HOME). Queue table on real data (status filter tabs), detail page: real applicant/docs (preview links), decision panel wired (approve/reject + comment → invalidate), document verify/reject buttons.
- Verify: pnpm --filter web check-types && pnpm --filter web lint && pnpm --filter web build

T9 — Overdue cron + scoring tests [R8, R9 part]

- Owns: apps/api/src/scoring/scoring.utils.spec? NO — vitest in api: apps/api/vitest.config.ts, apps/api/package.json (vitest devDep + test script), apps/api/src/scoring/scoring.utils.test.ts, apps/api/src/core/queue/overdue.worker.ts (+ repeatable job registration file in core/queue)
- Overdue: daily repeatable job (also run on boot) marks pending installments with dueDate < today as overdue + audit. Tests: scoring rules table-driven.
- Verify: pnpm --filter api test && pnpm --filter api check-types && pnpm --filter api lint

### Integration (me, after each wave)

Wire app.module imports, cross-module DI (scoring→loans disburse, applications→scoring enqueue), .env S3 vars, migrate if needed, full turbo run, live curl/browser E2E, commit per wave.

### Final gate

riptide:plan-verifier (coverage vs R1–R9) → riptide:reviewer (structural) → fix findings → my full E2E in browser → final commit/push.

## Post-review follow-ups (deferred by reviewer triage)

- Move loans/office/documents response DTOs into packages/shared (like ApplicationSummary) so api and web share one compiler-checked contract.
- Provide the S3 client through a Nest DI token (S3Module) instead of a module-level singleton, mirroring the PRISMA pattern.
- Extract a logAudit(tx, ...) helper once a third status-transition module appears.
- Narrow office decision/review zod enums from the shared unions via Extract instead of inline literals.
