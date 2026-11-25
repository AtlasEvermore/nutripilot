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

## Second candidate (PR #53, Bio-Twin hello + Nexus home), application tree `f90c1f0c93340b8e57fe75fd98b1257dce5f060e`
- **Production before:** deployment 38f6b8c2 SUCCESS on 00f3e29 at 17:04Z (PR #51), live checks passed (tap fix, sw v58, og image, /get).
- **Restore and rollback drill (17:39Z):** same 12:09Z snapshot; candidate f90c1f0c then production 00f3e29 booted on the restored copy, smoke issues empty, originals preserved, restored data deleted.
- **i18n:** pt sweep of 30 routes in 3 states found no French source strings; exercise names and two labels now translated in 13 languages.
- **CI:** PR #53 head 6f50a26 green (regression + Clean browser acceptance incl. mobile WebKit).

## Third candidate (PR #55, Bio-Twin v2 + planet), application tree `e0c7439d47c7c68bf46a98cbe5fba7f5c7f69aa1`, native tree `a6a5e9a8…` (18.2.0 splash, merged in PR #52)
- **Owner authorizations (24/11 evening):** "você tem todas as autorizações"; owner set IOS_SIGNING_APPROVED_REVISION=54d29c9 and approved the ios-signing runs himself.
- **Native 18.2.0:** signed run 45524712579 success, IPA SHA256 180ea17c…f8ff; ASC upload run 45525587237 success. Native validation: compile passed; the simulator screenshot steps hang on the xcode-27 runner (bootstatus never returns; with polling, launch works and the screenshot command hangs) — infra issue, owner chose to proceed; build is in TestFlight for owner review before App Review.
- **Backup (01:37:44Z):** Railway console keygen + create + verify, 6 files, SHA256 98a2dbd4…fc94; copied to owner computer (hash matched); owner saved the new key separately (format checked; value never displayed).
- **Restore and rollback drill (01:46:54Z):** candidate e0c7439d then production 7d3b230 on the restored copy, smoke issues empty, originals preserved, restored data deleted.
- **CI:** PR #55 head 6b572aa green (regression + Clean browser acceptance incl. mobile WebKit).

## Fourth candidate (PR #56, WebGL hologram + Orbitron), application tree `d860792c512296b68014c87e88d979b9aa1abeb9`
- Production before: deployment e4779229 SUCCESS on 13b2f90 (PR #55).
- Restore and rollback drill (2026-11-25T02:31:05Z): same 01:37Z snapshot; candidate then 13b2f90 on the restored copy; smoke issues empty; originals preserved; restored data deleted.
- CI: PR #56 head 7c6663c green (regression + Clean browser acceptance incl. mobile WebKit). Orbitron font added (OFL) at /fonts/orbitron.woff2.
- Final tree after animation cycle (9351b439): drill re-run 2026-11-25T02:45:32Z, smoke issues empty; CI green on 5fe09ec.
- Final tree with orbit redesign (a6e123e5): drill re-run 2026-11-25T03:01:21Z against production 13b2f90, smoke issues empty; CI green on 560fb06.

## Fifth candidate (PR #57, selection lock + front-facing hologram), application tree `41da7fb1705493bbcf6e70eabbb00f0c4b70a95e`
- Owner request 25/11 13:39: remove copy/select on the app. Owner said "você tem todas as autorizações" (24/11) and saved the new backup key (COD3) on 25/11 13:56.
- Backup 20261125T164425Z: Railway console keygen + create + verify, 6 files, SHA256 7a7d6437…73df, copied to the owner computer (hash matched).
- Drill 16:57Z: candidate then production aed95cf on the restored copy, smoke issues empty, originals preserved, restored data deleted.
- AI billing 16:58Z: OpenAI US$5.00, auto-reload OFF; limits unchanged. Hosting: Railway HOBBY ACTIVE, 41a0fc20 SUCCESS on aed95cf.
- Tests: selection blocked (triple tap selects nothing, context menu prevented), inputs still typeable and selectable; tap sweep 429 buttons no size change; CI green on 0061e0a.

## PR #59 (real-life story hero), application tree `5e0a3f1ee11ab58cd5bce323d3976606c25815d7` — interface-only release (owner decision 25/11): changes since production 5792a0a are app.js, styles.css, sw.js, i18n only; data checks not required. CI green on 21d7dcb.

## PR #60 (hello copy option B, owner-approved 15:22/15:23), application tree `41168e6af8f7e0bd151d98da190895346118ca23` — interface-only (app.js, i18n, sw.js). CI green on 586e922.

## PR #62 (nine-program console, owner-approved 16:43), tree `75f2eb8513a5440c065e2a47636029cd7f9de0f4` — interface-only relative to production b89780e.
