# Error Log

## [ERR-20260705-001] safe-d1-migrate-bunx-windows

**Logged**: 2026-07-05T23:31:00+08:00
**Priority**: medium
**Status**: resolved
**Area**: infra

### Summary
`bun db:migrate:local` failed on Windows because the migration script spawned `bunx`, which was not available as a standalone command in the current shell environment.

### Error
```text
null is not an object (evaluating 'result.stdout.trim')
```

### Context
- Command attempted: `bun run db:migrate:local`
- Project: `flare-stack-blog-main`
- Root cause: `scripts/safe-d1-migrate/main.ts` used `spawnSync("bunx", ...)`; `Get-Command bunx` returned no command in PowerShell.

### Suggested Fix
Prefer the project-local Wrangler executable from `node_modules/.bin`; only fall back to `bun x wrangler` when the local executable is unavailable. Defensively handle nullable stdout/stderr from `spawnSync`.

### Metadata
- Reproducible: yes
- Related Files: `scripts/safe-d1-migrate/main.ts`

### Resolution
- **Resolved**: 2026-07-05T23:39:00+08:00
- **Notes**: Updated the migration script to prefer `node_modules/.bin/wrangler.exe` on Windows, with a `bun x wrangler` fallback and nullable output handling.

---
