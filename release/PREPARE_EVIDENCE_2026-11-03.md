# Prepare evidence — 2026-11-03 (candidate PR #46)

Candidate: branch `feat/food-search-complete`, application tree `615f507c4b43d38475ae32d366cd67755572ebe2`, native tree `680daea35d58e1c9c751846bc26c530dcd45e7e8` (unchanged since build 401).
Change scope versus production (f3e6113, PR #45): `app.js`, `styles.css`, `sw.js` (cache name), `i18n.js`, `i18n/<lang>.js`, tests. `server.mjs`, `auth.mjs`, `legal.mjs`, `ops/` and `native/` are byte-identical to the deployed and previously verified tree. No storage format or migration change.
Owner authorization for this round (chat, 2026-11-03 08:16 BRT): "autorizo tudo, railway e email etc".

## Verified by the development agent
- **Hosting (11:4xZ):** Railway GraphQL (authenticated owner session) shows workspace plan HOBBY, customer state ACTIVE. Latest deployment a7ff1353 SUCCESS on commit f3e6113 (PR #45). `/api/health` HTTP 200, version 18.1.0, persistence `files` writable on `/data`. `ready:false` only because the public store URLs are not set before launch.
- **AI billing (11:4xZ):** OpenAI billing overview: prepaid credit balance US$5.00, auto-reload OFF (requests stop at zero). Railway variables (non-secret values read): OPENAI_MODEL=gpt-5-mini, AI_ENABLED=true, AI_ALLOW_GUESTS=false, AI_USER_DAILY_LIMIT=10, AI_GLOBAL_DAILY_LIMIT=300, AI_GLOBAL_MONTHLY_LIMIT=5000.
- **Credentials stored (11:4xZ):** Railway service variable names present: OPENAI_API_KEY, RESEND_API_KEY, RESEND_FROM, REVENUECAT_IOS_KEY, REVENUECAT_READ_KEY, REVENUECAT_WEBHOOK_AUTH, ACCESS_TOKEN_SECRET (values not read). Resend delivered a real e-mail (below) and OpenAI billing is active, so the stored keys are live. No secret recorded here.
- **iOS artifact (11:4xZ):** App Store Connect version 18.1.0 has build 401 attached; processingState VALID, not expired, min iOS 15.0. Native tree is unchanged since that build (release/IOS_ARTIFACT_2026-10-30.json, IPA SHA-256 2eb24f18…), so the signed artifact still corresponds to the candidate.
- **Independent backup (11:30:07Z):** in the Railway service console, `ops/backup-cli.mjs keygen` + `create /data` + `verify` → `{"createdAt":"2026-11-03T11:30:07.607Z","files":5}`, 6035 encrypted bytes, SHA-256 `9ead86e12847a29f83bf0fb34597489ea712bd3f7e702eedc5f0819903e2fa43`. Copied out of Railway to the owner computer (Downloads\nutripilot-backup-20261103T113007Z.npbak); the hash of the owner copy matched. The recovery key was not displayed to the agent; the owner saves it as a separate file.
- **E-mail (11:36:45Z):** POST /api/access/request to the owner address (authorized): HTTP 200 `{"ok":true,"mailed":true}`. Owner confirmed receipt in the inbox at 2026-11-03 08:44 BRT (11:44Z); code never recorded.

## App Review (Guideline 2.1, Information Needed, 2026-10-31)
- Reviewer notes rewritten with the six requested items (purpose and audience, access steps, external services, regional behaviour, regulated/third-party material, recording statement). Saved 2026-11-03 via App Store Connect (HTTP 200).
- Subscriptions np_complete_monthly and np_complete_annual are complete (localizations en-US/pt-BR, 175 territory prices, review screenshots, review notes) but were not attached to the first submission; they will be added with the resubmission.
- Pending owner: screen recording on a physical iPhone.

## PR #47 (same day)
Candidate application tree `7ffd35d483ecc80d9f8355a7f45932c214baf3f7`: side-menu stats no longer clipped, neon movement figures on the space theme, live animated demo reel in the Training preview. Only app.js, styles.css, sw.js, i18n.js, i18n/<lang>.js and tests changed; backend, ops and native unchanged, so the 11:30Z backup, 11:53Z restore/rollback drill, hosting, AI, credentials, e-mail and iOS artifact checks above still apply to this tree.
