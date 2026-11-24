# Prepare evidence — 2026-11-24 (candidate PR #51, launch polish + tap fix)

Candidate: branch `feat/launch-polish`, application tree `7c8616762449100c66c1c034c9e0c6c800bc8b89`, native tree `680daea35d58e1c9c751846bc26c530dcd45e7e8` (unchanged since build 401; the new native splash moved to branch `feat/native-18.2`, not part of this release).
Change: every lime button grew to ~811px on tap (ripple span forced to position:relative by `.aura .btn-lime > *`); ripple is now absolute. Trial wording removed (hello CTA, FAQ). Orbit brand mark, new language screen, share link `/get` with rich preview, og-share image.
Owner authorizations (chat, 2026-11-24): 09:06 BRT "autorizo o terminal do Railway para um backup novo hoje e o e-mail de teste para rafabalves@gmail.com"; 13:09 BRT "autorizo verificar a OpenAI e o App Store Connect e criar o lembrete da chave".

- **Hosting (16:06Z):** Railway workspace HOBBY, customer ACTIVE; deployment 246f45ec SUCCESS on 50d8671 (PR #50); /api/health 200, 18.1.0, e-mail configured, persistence writable.
- **Credentials (16:06Z):** 24 service variable names unchanged (values not read); OpenAI and Resend keys in use (billing active, mail delivered below).
- **AI billing (16:09Z):** OpenAI prepaid US$5.00, auto-reload OFF; Railway AI limits unchanged (gpt-5-mini, AI_ALLOW_GUESTS=false, 10/user/day, 300/day, 5000/month).
- **Independent backup (12:09:09Z):** Railway console keygen + create /data + verify → 6 files, SHA-256 `860e81e6…d8e1`; copied to the owner computer outside Railway; owner saved the 64-hex recovery key as a separate file (format checked, value never displayed).
- **Restore and rollback drill (16:54Z, re-run on the final tree):** release/RESTORE_DRILL_2026-11-24.json — key opened the backup; candidate and production commit 50d8671 both booted on the restored copy with empty smoke issues; originals preserved; restored data deleted.
- **Legal (16:05Z):** production /terms, /privacy, /delete-account HTTP 200 with NutriPilot content; legal.mjs unchanged.
- **App Store Connect (16:10Z):** version 18.1.0 READY_FOR_SALE, build 401 VALID, not expired; np_complete_monthly and np_complete_annual APPROVED with no introductory (trial) offers.
- **Expiry alert (16:10Z):** scheduled task trig_015jrfvMhoG32Nh62Ubnh8aX notifies the owner on 2027-01-14 09:00 BRT before the OpenAI key expires 2027-01-21.
- **Tap regression:** Playwright sweep (iPhone 13) tapped 429 buttons on 21 routes in 3 states: no size change; the same sweep on the previous code flagged 56→811px on every lime button. New regression test guards it.
- **E-mail (16:11:52Z):** POST /api/access/request (signup) to the owner address → 200 mailed=true; owner confirmed receipt at 13:13 BRT; code not recorded.
- **WebKit frame stall (found by CI, fixed):** on mobile WebKit the new language screen stopped producing animation frames (13 live backdrop blurs over the animated aurora); blur removed, CI diagnostic confirmed, acceptance green on head 280fea4.
- **CI (16:55Z):** PR #51 head 280fea4 passes regression and Clean browser acceptance (desktop chromium, mobile chromium, desktop firefox, mobile WebKit).
