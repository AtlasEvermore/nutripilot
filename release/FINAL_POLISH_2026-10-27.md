# NutriPilot — final usability hardening

This iteration preserves the consolidated Atlas/NEXUS/local-command/scenario/PULSE implementation and the existing feature set, data formats, backend, products and native version.

- Long ordinary sheets keep their heading and close control visible while scrolling. Modal and menu keyboard focus stays within the open overlay; Escape closes it and explicit close/browser Back restore focus to the original control when that control still exists. Sheet refreshes preserve focus on the servings or method control. The command palette retains its independent inert/focus lifecycle. A meal command returns focus to its opener before opening the standard manual-entry dialog.
- Paused provider areas now explain availability before action. Existing generator forms remain as disabled previews while the service is explicitly paused, with working links to local recipes and navigation. When enabled, their original forms are unchanged. The coach preserves its draft/history and offers local alternatives while send/prompts are disabled. Its greeting respects the personal-data toggle. A stale guest allowance cannot advertise available analyses while the provider is paused.
- Discovery cards identify paused analysis independently from ownership. No prices or offers were added outside Plans. The new availability sentence uses all fourteen existing languages.
- No service plan, provider credit, production patch, data volume or store release was changed. Publication remains subject to AGENTS.md and the unchanged release gate.

Validation is recorded after the final candidate completes browser acceptance and visual inspection. Screenshots use a synthetic account and fictitious records and must not be presented as production or real-purchase evidence.

## Final candidate and acceptance evidence

PR [#36](https://github.com/AtlasEvermore/nutripilot/pull/36) is merged as `8f5286abdad36e08766c5a12d7c77e732959bf9e`. Application tree: `78ee5e8b3e18acadc6c35b3f2a73127fce970cdf`; version 18.1.0. Native tree remains `39d0f6ebdde9f52a715c46fc9b9de67c7538e24c`. The PR head `afbed1bdd3a6c93e6b96d6a8c50990cb9c6e26f8` has the same application tree, checked locally after fetching both refs.

PR run [40451471240](https://github.com/AtlasEvermore/nutripilot/actions/runs/40451471240) and merged-main run [40495854814](https://github.com/AtlasEvermore/nutripilot/actions/runs/40495854814) both passed 215 checks: 98 application/PostgreSQL, eight release-gate, three native configuration, ten signing-script and 96 clean-browser tests. The main workflow also built and smoke-tested the container (18.1.0, empty issues) and pushed the SHA tag successfully at 2026-10-27T11:28:58Z.

Prepared immutable server image:

`ghcr.io/atlasevermore/nutripilot@sha256:ca9c550b1355bdb68ede36b5a8d151f4a4721f8ef87e8c0fc37a921f49468bfd`

This is the registry manifest digest in the successful push log, distinct from the Docker configuration digest. A registry artifact is not a Railway deployment or App Store publication. No new build was necessary after verifying this existing image.

## Exact cause of the post-merge production-gate failure

Run [40495854901](https://github.com/AtlasEvermore/nutripilot/actions/runs/40495854901), job `122160987450`, executed `prepare` at 2026-10-27T11:24:08Z and exited 1 with eight blockers:

1. `readiness.json` still named the preceding application tree `d3e4834862a43529d6ed8466541e857c70e8b41d`.
2. Hosting/billing-continuity evidence exceeded its 24-hour validity.
3. The independent real-data backup exceeded its 8-hour validity.
4. Intelligence-provider billing/model/spending controls were pending.
5. Real access-email delivery for the candidate was pending.
6. Operational legal configuration was pending.
7. App Store commercial/account/product configuration was pending.
8. Signed IPA evidence exceeded its 24-hour validity.

This is the intended fail-closed policy, not a regression-test failure. The tree binding is now corrected only after checking CI, captures and an exact-tree restore. No gate requirement was removed or relaxed. Expired evidence dates were preserved rather than renewed without a new check.

## Repeated isolated recovery drill

At `2026-10-27T11:35:22.834Z`, the final merged application's current backup implementation decrypted and verified the existing encrypted snapshot, restored all five original files into a newly created private directory, and checked their hashes. The application ran with file persistence, a loopback-only test URL, no provider credentials and intelligence services disabled. Standard smoke reported 18.1.0 and no issues. After graceful shutdown all five original files remained byte-identical. No production data or service was accessed or modified by the drill.

Local restore/start/smoke/shutdown elapsed time was 0.296 seconds; this excludes retrieving backup material and is not a production recovery-time promise. Sanitized results are in [FINAL_POLISH_RESTORE_2026-10-27.json](FINAL_POLISH_RESTORE_2026-10-27.json).

The snapshot's actual creation time remains **2026-10-26T02:18:56.327Z**. This exercise renews restore compatibility evidence only, not the independent-backup freshness requirement. The previous V12 rollback exercise remains historical; no new production snapshot or V12 run is claimed.

## Real capture provenance and visual review

The [PR capture artifact](https://github.com/AtlasEvermore/nutripilot/actions/runs/40451471240/artifacts/12709739540) is unexpired, with expiry 2026-11-03T04:50:20Z. Its downloaded ZIP SHA-256 is `934d83ea6276d07eeaf74a67538bc7d0f581de5bb06bb851700071339f9d3612`, independently recomputed locally. All 40 extracted PNGs byte-match entries in that ZIP.

Reviewed desktop Chromium and mobile WebKit captures include Atlas, NEXUS, local confirmation, portion scenarios, PULSE, navigation, Plans and the existing modules. The recipe capture shows its heading/close control retained while scrolled; the paused-coach capture shows the explanatory state, preserved synthetic draft and local alternatives. Panels are compositions of these real, unmodified browser captures, with labels outside the screenshots. Individual original PNGs are included for full-size inspection. No mockup or generated application image is used.

The browser account, permissions/identity responses and records are synthetic. Screenshots demonstrate the candidate UI, not a real purchase, live provider, production account, native-device execution or App Store acceptance. No private production recovery data or legal address is included.

## Historical infrastructure recheck (superseded by the account and current completion records)

Read-only Railway queries on 2026-10-27 still show the last successful production deployment `2705400c-590b-4c47-bd81-4cd1759ab31b`, revision `fd3d9d8927f85adfe83fc31975f3878de73c580b` (V12). Later failed attempts are historical (2026-10-21), with no candidate deployment in the returned inventory. Live config retains one replica and the existing `/data` volume. No production branch is configured. `source.checkSuites: true` is still only in the STAGED patch, which has 18 changes; it is not confirmed active.

This read does not prove current billing continuity. Legal variable names remain staged and do not prove operational legal-page acceptance. Previous address authorization is preserved; no further address approval is requested. The unchanged native tree does not extend the time-limited IPA verification. iOS remains the only selected channel; Android is deferred and Apple banking remains with the owner.

External release evidence still required: current hosting/billing continuity, a fresh independently retained production backup, provider model/spending validation within an explicitly authorized budget, candidate access-email delivery, completed operational legal checks, iOS commercial setup and current IPA evidence. Post-deployment provider cutover/revocation, persistence/login, alert delivery, external scheduled backup and real store purchase/release acceptance remain pending. No credits were purchased, unbounded billing enabled, staged patch applied, volume changed, production deployment triggered or store publication performed.

## Earlier local gate recheck (superseded below)

After correcting the evidence binding, `node ops/release-gate.mjs prepare` still exits 1 with seven operational blockers: expired hosting continuity, expired independent backup, pending provider controls, candidate email delivery, operational legal configuration, iOS commercial configuration and expired IPA evidence. The obsolete-application-tree blocker is resolved. All eight release-gate tests passed again locally and `git diff --check` passed. Application/native source trees were not changed during this evidence-only completion.

## Current completion — resizable iPhone preparation and delivered email

The owner authorized the monthly US$29.99 sale price and the scoped email test. Monthly product `np_complete_monthly` now has a saved initial US price of $29.99; Apple-calculated examples observed were Brazil R$199.90 and France €34.99. No subscription was sold or app published. A proposed availability selection across 175 countries was **not applied**: automatic approval review rejected that broad commercial scope as requiring specific authorization; the dialog was cancelled. Annual product np_complete_annual subsequently saved the exact existing US$299.00 reference using Apple additional price points; examples observed were Brazil R$1,999.90 and France €349.00. Both initial price schedules persisted after confirmation. Final availability remains incomplete.

The native configuration previously forced portrait-only iPhone use. It now supports portrait and both landscape orientations, adds missing orientation configuration, sets UIRequiresFullScreen=false, preserves existing iPad orientation declarations and detects later regressions in check mode. Native tree is now `be0680febad4748045991bbcee2238dc8525824e`; the historical signed IPA no longer matches and was explicitly returned to pending. The signing workflow retains its exact-revision and protected-environment requirements. Both native workflows explicitly select Xcode 27.1/iOS SDK 27.1 on the documented standard xcode-27 runner.

Revision `2715779e17423befb27468f5823b2be6305a3fd8` passed 220 checks in [40549524029](https://github.com/AtlasEvermore/nutripilot/actions/runs/40549524029): 98 application/PostgreSQL, eight release-gate, four native-configuration, ten signing-script and 100 browser checks. The live-resize check preserves a coach draft and open recipe, verifies reachable close controls and restores keyboard focus after Escape across compact, wide and short landscape windows. [Native compilation 40549523956](https://github.com/AtlasEvermore/nutripilot/actions/runs/40549523956) succeeded with Xcode 27.1 build 27A9275 and SDK 27.1; Duo simulator availability was listed. This proves compilation, not full native fold/unfold acceptance. A subsequent CI-only bundled candidate fixture was added for a real Duo simulator capture; its visual result must be inspected before any Duo badge or store screenshot claim. It is not used by the signing workflow.

The isolated production-mode candidate sent a single real Portuguese signup access email to the previously authorized owner. HTTP 200/mailed=true was independently corroborated by the authenticated Resend list showing the new subject and Delivered. The OTP body was not opened. Earlier attempts failed because the isolated child lacked this environment's proxy/CA settings; inheriting only the required network settings resolved that test-harness failure. No application code change or production deployment was needed. See CANDIDATE_EMAIL_CHECK_2026-10-27.json.

A repeated isolated restoration passed at 2026-10-27T17:19:40.750Z: five original file hashes preserved and version 18.1.0 smoke with no issues. The source snapshot remains the real backup created at 2026-10-27T11:55:12.942Z; the repeat does not make the backup newer. Source hash and creation time remain unchanged.

The current prepare gate reports three pending groups: intelligence-provider funded access/model/spending controls, App Store commercial/product validation, and a new matching signed IPA. Hosting, independent backup, restoration, legal preparation and real candidate email have supporting evidence. Production remains V12; no Railway patch or store submission occurred. No credits, paid plans or unlimited recharge were activated.

### Duo simulator capture diagnosis

Native run 40552404121 built both the normal wrapper and the bundled candidate successfully. The actual Duo simulator booted and launched com.atlasevermore.nutripilot (PID recorded). Capture failed with NSPOSIXErrorDomain code 22 because the simulator has two displays: display 3 (2007x2853 inner) and display 1 (1398x2034 outer). No image was produced or claimed from that attempt. The capture command now explicitly selects each observed display. The fixture rebuild reuses the same derived-data directory after archiving the original normal wrapper, and quiet compiler output keeps diagnostic logs readable. The boot/capture step has a ten-minute timeout. No application/native source, production configuration or signing safeguard was changed by this capture fix.
