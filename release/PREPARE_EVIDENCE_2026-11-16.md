# Prepare evidence — 2026-11-16 (candidate PR #50, App Store 5.1.1(v))

Candidate: branch `fix/apple-5-1-1`, application tree `5ab6caadff064ac0e17cf377efc4abd382177b7d`, native tree `680daea35d58e1c9c751846bc26c530dcd45e7e8` (unchanged since build 401).
Change: purchase and restore in the native apps no longer require an account; `/api/iap/verify` accepts a store anonymous ID (`$RCAnonymousID:` + 32 hex) without a session and stores it under a private device identity (`device-<hash>@device.nutripilot.invalid`, never e-mailed, login codes refused). E-mail derived store IDs still require their verified account. No storage format change: entitlements keep the same shape.
Owner authorization (chat, 2026-11-15 20:58 BRT): "autorizo o terminal do Railway para um backup novo hoje e o e-mail de teste para rafabalves@gmail.com".

- **Hosting (2026-11-15T23:51Z):** Railway workspace HOBBY, customer ACTIVE; latest deployment dd92aeb4 SUCCESS on b7c1f0f (PR #48); /api/health 200, 18.1.0, e-mail configured, persistence writable.
- **AI billing (2026-11-16T00:03Z):** OpenAI prepaid balance US$5.00, auto-reload OFF.
- **iOS artifact (2026-11-15T23:50Z):** ASC version 18.1.0 build 401 VALID, not expired; native tree unchanged.
- **Independent backup (2026-11-16T00:00:41Z):** Railway console keygen + create /data + verify → 6 files, 3290 encrypted bytes, SHA-256 `c38e748a…943e`; copied to the owner computer outside Railway, hash matched; owner saved the recovery key as a separate file.
- **Restore and rollback drill (00:11Z):** release/RESTORE_DRILL_2026-11-16.json — key opened the backup; candidate and current production commit both booted on the restored copy with empty smoke issues; originals preserved; restored data deleted.
- **E-mail (00:01:51Z):** POST /api/access/request to the owner address → 200 mailed=true; owner confirmed receipt at 21:09 BRT; code not recorded.
- **CI:** PR #50 head f90534c passes regression (new anonymous-purchase test) and Clean browser acceptance.

## App Review
Rejection 2026-11-13, Guideline 5.1.1(v): registration required before purchasing non-account-based IAP. Fixed by this candidate; sign-in is optional and explained on Plans and in the account sheet.
- **Legal (00:12Z):** production /terms, /privacy, /delete-account HTTP 200.
- **App Store Connect (00:12Z):** 34 territories, 17 localizations, review contact and notes (recording attached), build 401 VALID; both subscriptions in submission ad3c5516.
