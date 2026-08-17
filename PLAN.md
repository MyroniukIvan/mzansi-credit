# MzansiCredit — навчальний фінтех-проект (МФО в Південній Африці)

## Ідея

Платформа мікрокредитування (payday / installment loans) для ПАР — по суті те, що будує компанія з вакансії. Три частини:

1. **Клієнтський портал** — реєстрація, заявка на кредит, завантаження документів (KYC), перегляд графіка платежів, оплата.
2. **Бек-офіс (underwriting)** — черга заявок, скоринг, ручний розгляд, керування кредитами, аудит-лог.
3. **Автоматизація** — нарахування відсотків, нагадування про платежі, обробка прострочень, вебхуки платіжки.

Домен спеціально «фінтеховий»: стани заявки (state machine), графік амортизації, ідемпотентність платежів, аудит — саме те, про що питають на співбесідах.

## Стек (що і навіщо)

| Шар           | Технологія                                         | Коментар                                                                       |
| ------------- | -------------------------------------------------- | ------------------------------------------------------------------------------ |
| Монорепо      | **Turborepo + pnpm workspaces**                    | `apps/web`, `apps/api`, `packages/db`, `packages/shared`                       |
| Frontend      | **Next.js (App Router) + TailwindCSS + shadcn/ui** | RSC + client components, layouts, route groups                                 |
| Data-fetching | **TanStack Query**                                 | кеш, інвалідація, optimistic updates                                           |
| Таблиці       | **TanStack Table**                                 | бек-офіс: пагінація/сортування/фільтри на сервері                              |
| Форми         | **React Hook Form + Zod**                          | zod-схеми в `packages/shared` — спільні для фронта й бека                      |
| Backend       | **NestJS на Fastify-адаптері**                     | закриває обидва пункти вакансії одночасно; модулі, guards, pipes, interceptors |
| ORM / БД      | **Prisma + PostgreSQL**                            | міграції, транзакції, `$transaction` для грошових операцій                     |
| Кеш / черги   | **Valkey (Redis) + BullMQ**                        | сесії/rate-limit + фонові джоби                                                |
| Файли         | **S3 (MinIO локально)**                            | presigned URLs для KYC-документів                                              |
| Auth          | **better-auth + Google OAuth**                     | сесії, ролі: `client`, `underwriter`, `admin`                                  |
| Платежі       | **Stripe (test mode)**                             | PaymentIntents, webhooks, ідемпотентність                                      |
| Realtime      | **socket.io**                                      | статус заявки, нотифікації в бек-офісі                                         |
| Тести         | **Vitest + Playwright**                            | unit на доменну логіку, e2e на happy path                                      |
| Observability | **Sentry + OTEL + Grafana**                        | traces api→db, дашборд, алерти                                                 |
| Інфра         | **Docker Compose**                                 | postgres, valkey, minio, grafana, clickhouse                                   |
| Stretch       | **Temporal, ClickHouse, tRPC**                     | див. Епік 12                                                                   |

## Епіки

[//]: #
[//]: # '### Епік 0 — Bootstrap'
[//]: #
[//]: # '- Turborepo: `apps/web` (Next.js), `apps/api` (NestJS+Fastify), `packages/db` (Prisma), `packages/shared` (zod-схеми, типи).'
[//]: # '- `docker-compose.yml`: postgres, valkey, minio.'
[//]: # '- ESLint + Prettier + tsconfig base; `turbo run lint typecheck build`.'
[//]: # '- GitHub Actions: lint + typecheck на PR.'
[//]: # '- **Вивчити:** turborepo pipeline, pnpm workspaces, docker compose networking.'
[//]: #
[//]: # '### Епік 1 — Auth і ролі'
[//]: #
[//]: # '- better-auth: email+password і Google OAuth, сесії у Valkey.'
[//]: # '- Ролі `client` / `underwriter` / `admin`; NestJS guard по ролі; middleware у Next.js для захищених роутів.'
[//]: # '- Сторінки login/register на shadcn/ui + RHF + Zod.'
[//]: # '- **Вивчити:** better-auth, OIDC-флоу, NestJS guards.'

### Епік 2 — Доменне ядро (Prisma-схема)

- Моделі: `User`, `LoanProduct` (сума min/max, строк, ставка, fee), `LoanApplication`, `Loan`, `Installment`, `Payment`, `Document`, `AuditLog`.
- State machine заявки: `DRAFT → SUBMITTED → SCORING → MANUAL_REVIEW → APPROVED/REJECTED → DISBURSED → ACTIVE → CLOSED/DEFAULTED`. Переходи — тільки через доменний сервіс, кожен перехід пише в `AuditLog`.
- Гроші — **завжди integer у центах**, ніяких float.
- Seed-скрипт з тестовими продуктами.
- **Вивчити:** Prisma migrations/relations, патерн state machine, чому decimal/int для грошей.

### Епік 3 — Заявка на кредит (клієнтський флоу)

- Мультистеп-форма: сума+строк (слайдер з live-розрахунком переплати) → персональні дані → дохід/витрати → підтвердження.
- RHF + Zod по кроках, чернетка зберігається (`DRAFT`).
- Список «мої заявки» і «мої кредити» на TanStack Query.
- **Вивчити:** мультистеп-форми на RHF, zod `refine`/`superRefine`, серверні actions vs REST.

### Епік 4 — KYC і документи (S3)

- Upload ID-документа та payslip через presigned URL напряму в MinIO.
- Статуси документів: `PENDING → VERIFIED / REJECTED` (перевіряє underwriter).
- Валідація типу/розміру, приватний bucket, скачування теж через presigned URL.
- **Вивчити:** S3 API, presigned URLs, чому файли не ганяють через бекенд.

### Епік 5 — Скоринг і андеррайтинг

- Rules engine: affordability-розрахунок (дохід − витрати vs платіж), ліміти по продукту, вік, дублікати активних кредитів.
- Результат: auto-approve / auto-reject / manual review (сірий сегмент).
- Скоринг як BullMQ-джоб (перша черга в проекті) — заявка йде в `SCORING` асинхронно.
- **Вивчити:** BullMQ basics, дизайн rules engine без оверінжинірингу.

### Епік 6 — Графік платежів (серце домену)

- Генерація amortization schedule: аннуїтет або flat rate + initiation fee (у ПАР — правила NCA, можна взяти як референс для лімітів ставок).
- `Installment`: principal + interest + fee, due date, статус.
- Юніт-тести на розрахунки — **перший кандидат на Vitest**, табличні тести.
- **Вивчити:** формула аннуїтету, robust-робота з датами (date-fns), rounding-стратегії.

### Епік 7 — Платежі (Stripe test mode)

- Disbursement — мокаємо (запис + перехід у `ACTIVE`), бо реальні виплати Stripe-ом складні.
- Погашення: PaymentIntent на installment, Stripe Checkout або Elements.
- **Webhook-ендпоінт**: верифікація підпису, ідемпотентність (unique key по event id), оновлення installment/loan у транзакції.
- Early repayment: перерахунок залишку.
- **Вивчити:** Stripe PaymentIntents, webhook signature, idempotency keys — топ-тема співбесід.

### Епік 8 — Фонові процеси (BullMQ)

- Repeatable jobs (cron): щоденна перевірка прострочень (`OVERDUE` + late fee), нагадування за 3 дні до due date.
- Email-нотифікації (Mailhog локально або Resend).
- Retries, backoff, dead-letter обробка; Bull Board для дашборда черг.
- **Вивчити:** repeatable jobs, ідемпотентність джобів, graceful shutdown воркерів.

### Епік 9 — Бек-офіс

- Черга заявок: TanStack Table з server-side пагінацією/сортуванням/фільтрами.
- Картка заявки: дані, документи (preview), скоринг-результат, кнопки approve/reject з коментарем.
- Дашборд: видано/прострочено/portfolio at risk.
- Audit log по кожному кредиту.
- **Вивчити:** TanStack Table (column defs, manual pagination), патерни admin UI на shadcn/ui.

### Епік 10 — Realtime (socket.io)

- Нотифікація underwriter'ам про нову заявку в manual review.
- Клієнту — live-оновлення статусу заявки без рефреша.
- Auth на сокетах (сесія), rooms по ролях, socket.io + Redis adapter.
- **Вивчити:** socket.io rooms/namespaces, авторизація WS.

### Епік 11 — Тести та observability

- Vitest: доменна логіка (schedule, скоринг, state machine) + інтеграційні на API (testcontainers або окрема test-БД).
- Playwright: e2e happy path — реєстрація → заявка → approve → оплата installment.
- Sentry (web + api), OTEL auto-instrumentation NestJS → Grafana Tempo, дашборд у Grafana (latency, error rate, черги).
- **Вивчити:** testcontainers, OTEL SDK, Grafana provisioning через compose.

### Епік 12 — Stretch goals (окремо, після MVP)

- **Temporal**: переписати lifecycle кредиту (disbursement → schedule → reminders → closure) як durable workflow.
- **ClickHouse**: event stream (application_events, payment_events) + аналітичний дашборд (конверсія воронки, default rate по когортах).
- **tRPC**: винести internal API бек-офісу на tRPC, порівняти DX з REST.
- **k6 / rate limiting**: навантажувальний тест + rate limit через Valkey.

## Порядок і майлстоуни

- **M1 (MVP каркас):** Епіки 0–3 — можна залогінитись і подати заявку.
- **M2 (кредитний цикл):** Епіки 4–7 — повний флоу від заявки до оплати. Це ядро для портфоліо.
- **M3 (production-grade):** Епіки 8–11 — черги, бек-офіс, realtime, тести, моніторинг.
- **M4:** Епік 12 — по одному stretch-у за раз.

Правило: кожен епік мержиться в `main` через PR самому собі — тренуй нормальні коміти й опис PR англійською (B1+ 😉).
