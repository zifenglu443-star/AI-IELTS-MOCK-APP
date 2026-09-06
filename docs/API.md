# IELTS Mock Lab API contract

All endpoints are same-origin under `/api`. JSON-changing requests require the
`X-CSRF-Token` returned by login or `/api/auth/me`. Authentication uses the
Secure, HttpOnly `ieltsmock_session` cookie. IDs are opaque stable strings.

## Authentication and account

- `POST /api/auth/login`, `GET /api/auth/me`, `POST /api/auth/logout`
- `POST /api/auth/change-password`
- `GET /api/auth/sessions`, `DELETE /api/auth/sessions/:id`
- `DELETE /api/account/data` permanently clears the current user's learning data
  but retains their account and encrypted model settings.

## Administration

- `GET|POST /api/admin/users`
- `PATCH /api/admin/users/:id`
- `POST /api/admin/users/:id/reset-password`
- `POST /api/admin/revoke-sessions`
- `GET /api/admin/status`, `GET /api/admin/audit`

These routes require an administrator. Disabling or demoting the final active
administrator returns `409 LAST_ADMIN`.

## Learning data

- `GET|POST /api/library`, `DELETE /api/library/:id`
- `GET /api/attempts/active`, `GET /api/attempts/history`, `POST /api/attempts`
- `PATCH /api/attempts/:id`, `POST /api/attempts/:id/takeover`
- `POST /api/attempts/:id/submit`, `POST /api/attempts/:id/abandon`
- `PATCH /api/attempts/:id/result`
- `GET|PUT /api/user-data/:key`
- `GET|POST /api/reviews`

Attempt writes include `version` and `leaseToken`. Stale versions return
`409 VERSION_CONFLICT`; a non-owner or expired lease returns `409 LEASE_LOST`.
Submission is idempotent, and a server-held mock deadline determines whether the
result is `submitted` or `expired`.

## Files, AI, and backup

- `POST /api/files/uploads`, `PUT /api/files/uploads/:id/chunks/:index`,
  `POST /api/files/uploads/:id/complete`
- `GET|DELETE /api/files/:id`
- `GET|PUT /api/settings`, `POST /api/settings/test`
- `GET /api/ai-jobs`, `GET /api/ai-jobs/:id`,
  `POST /api/ai-jobs/:id/cancel`, `POST /api/ai-jobs/proxy`,
  `POST /api/ai-jobs/xfyun-ise`
- `GET /api/backup/export`, `POST /api/backup/import`,
  `POST /api/backup/import-legacy`

Protected files are never served from a static directory. Backup archives
contain learning data and attachments but deliberately exclude API keys.
