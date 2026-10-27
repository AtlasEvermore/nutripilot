# NutriPilot — functional and structural technology evolution

Implemented in PR #35, merged as `513d5835e9d38a4e44ef9678d22b1acdfec99d2c`. Application tree: `d3e4834862a43529d6ed8466541e857c70e8b41d`. Version 18.1.0; native tree unchanged (`39d0f6ebdde9f52a715c46fc9b9de67c7538e24c`). This is a development candidate, not a production or store release.

## Five working additions

| Feature | Implemented behavior | Data and safety boundary |
|---|---|---|
| Atlas | Interactive spatial map of all nine real modules, live destination description and next action; touch, keyboard arrows/Home/End and RTL navigation. The searchable/filterable module library remains. | Selection never alters profile, route or entitlement; opening a destination uses the existing access checks. |
| NEXUS | Four selectable daily signals derive next navigation actions from logged meals, water, training plan/completion and entered sleep times. Each action explains its source. | Pure local task ordering, not clinical urgency or a wellness score. Missing records remain missing; module visibility follows entitlements. |
| Local commands | Recognizes bounded explicit text phrases for water recording, manual meal entry, contextual recipe search, training and sleep. Water uses a separate confirmation and conditional undo. | No general-purpose language understanding, microphone or model call. Unknown text is never executed. A water confirmation checks amount, date and identity, refuses overflow and cannot be repeated. Undo cannot overwrite a later edit. |
| Portion scenarios | A recipe slider recalculates ingredients/macros and compares logged totals before/after the chosen portion. An explicit separate action logs that portion through the existing recipe flow. | Sliding does not save. Calorie comparison uses `profile.dailyKcal`; malformed values remain bounded. This is arithmetic, not a physiological forecast. The original one-portion logging action remains. |
| PULSE | Interactive seven-day record matrix, dated detail and adjacent seven-day coverage comparisons. | Describes the user's own records, not activity compliance or health outcomes. A real recorded zero remains distinct from absent data. No causal/predictive health claim. |

## Shared interface

Workspaces and dialogs now share a material/control system: cyan/ice actions, lime main/commercial actions, module colors, visible focus, responsive controls, composed cards and coordinated transitions. Reduced-motion support, background-tab animation suspension and the existing modest-device behavior remain. No new framework, external font/image request or generated image was added.

New copy is translated through the existing fourteen-language system. Prices/offers remain in Plans and the existing purchase-confirmation flow. Existing modules, plan products, authentication and stored records remain in place. When analysis is paused, the visitor scanner presentation uses available barcode/manual methods rather than displaying a photo-analysis result as available.

## Structural audit and fixes

- First-read synchronous level-9 gzip was a concrete request-loop bottleneck. Static delivery now uses asynchronous shared gzip/Brotli work, lazy variants and a bounded cache (32 MiB / 128 entries).
- Encoding quality/refusal rules, Vary and weak validators are tested across equivalent representations. Concurrent asset loads/compression share work; changed assets invalidate the cache. Personal APIs retain authorization and `no-store`.
- Sleep duration validation rejects malformed, impossible or equal times instead of fabricating a full-night duration. Existing overnight durations still work.
- Existing PostgreSQL, account sync, budget limits and purchase-validation architecture were retained and regression-tested. No database replacement or migration was needed for these improvements. Horizontal expansion still requires a shared persistent backend; no additional production replica was enabled.

Local transfer measurements before the final small wording correction:

| Asset | Raw | Gzip | Brotli |
|---|---:|---:|---:|
| app.js | 793,485 B | 245,745 B | 216,629 B |
| styles.css | 394,798 B | 80,823 B | 76,410 B |
| Portuguese base dictionary | 365,946 B | 125,637 B | 114,493 B |

These are byte counts, not a measured production startup-time improvement. Implementation references: [Node.js zlib](https://nodejs.org/api/zlib.html#threadpool-usage-and-performance-considerations) and [RFC 9110](https://www.rfc-editor.org/rfc/rfc9110.html#section-12.5.3).

## Verification

Final PR run [40444536409](https://github.com/AtlasEvermore/nutripilot/actions/runs/40444536409), head `8c2ec5960d006e259a55e739b147915d724879be`: 204 checks passed — 95 application/real-PostgreSQL, eight release-gate, three native configuration, ten signing-script and 88 clean-browser tests. Dependency audit: zero reported vulnerabilities.

Browser projects: Chromium desktop 1440×1000, Chromium phone 360×800, Firefox desktop and iPhone 13 WebKit. Coverage includes the original 18 main routes in four languages, all 37 advertised module subtabs, narrow layouts down to 320px, RTL, reduced motion and the five new feature flows. These are bounded render/navigation/regression checks, not a claim that every possible input or store integration was validated.

[Capture artifact 12707579792](https://github.com/AtlasEvermore/nutripilot/actions/runs/40444536409/artifacts/12707579792), SHA-256 `976ae4c144ef4d7501d791c2489ce550f86b3cdd2613c3aed30a052315b038a7`. Real app captures use synthetic accounts, simulated identity responses and fictitious records; they do not prove a real subscription purchase. Visual inspection caught and corrected a wrong calorie-target field, and the final scenario capture shows the configured target.

Exact-candidate restore: `2026-10-27T03:34:08.925Z`. A new isolated directory was restored from the existing real encrypted snapshot; version-18.1.0 smoke passed with an empty issues list, and all five original files remained byte-identical after graceful shutdown. The original snapshot date (`2026-10-26T02:18:56.327Z`) was not renewed. Recovery material and health data remain private.

## Infrastructure and remaining boundaries

Read-only Railway inspection confirms one running replica and the existing /data volume. The active settled deployment is SUCCESS; the newest failed attempt in inventory is historical. Eighteen configuration changes remain STAGED. No patch was accepted, branch reconnected, volume altered or infrastructure purchased. Online status alone does not renew billing-continuity or independent-backup evidence.

Paid generative/photo/conversational services remain paused under the existing zero-spend policy. No autonomous health-data agent, unrestricted natural-language model, new voice-recognition pipeline or validated predictive health model was activated. Such work still needs appropriate provider availability, explicit spending limits and, for predictive health claims, separate development and validation.

Production publication remains controlled by the unchanged release gate. Fresh independent backup, hosting continuity, real access email delivery, operational legal configuration, provider spending verification and iOS commercial/signature evidence remain separate requirements. Owner authorization for the existing legal address is already recorded; no repeat address approval is requested. No store purchase, bank connection, IPA signing, production deployment or store publication was performed in this iteration.


## Consolidated image evidence

Main run [40445156036](https://github.com/AtlasEvermore/nutripilot/actions/runs/40445156036), revision `513d5835e9d38a4e44ef9678d22b1acdfec99d2c`, repeated the 204 checks successfully and built/pushed the immutable image:

`ghcr.io/atlasevermore/nutripilot@sha256:fe03b72c989ae544e0cba9689c3137b3d19529f3b206450c309d0aced0bedb2b`

Container smoke reports version 18.1.0 and an empty issues list. The image is a prepared artifact; the production site was not changed. The updated readiness record binds CI/image/restore evidence to the exact application tree while retaining the unresolved operational gates.
