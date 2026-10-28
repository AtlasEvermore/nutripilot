# NutriPilot — final usability hardening

## Estado final consolidado — revisão com correção de foco

Candidata 18.1.0, aplicação `c1b99fd4fcd170dbff27d73b3af216002a36f1c5`, nativo `be0680febad4748045991bbcee2238dc8525824e`. Fonte da PR: `484f36500192c06a4add8358314b38dee434dd4e`; fonte da imagem: `fe8ef9ef4ec8316d98380bc54bcf1657ced404e8`. A única diferença entre elas é o gatilho temporário da branch de construção; o Dockerfile copia somente a árvore da aplicação. Produção permanece V12. Não houve deploy, aplicação de patch Railway, reconexão automática ou submissão de binário à Apple.

[40604028724](https://github.com/AtlasEvermore/nutripilot/actions/runs/40604028724) e [40604040289](https://github.com/AtlasEvermore/nutripilot/actions/runs/40604040289) passaram: 98 verificações de aplicação/PostgreSQL, oito da trava, quatro nativas, dez de assinatura e 104 de navegadores (224 em cada execução). O artefato browser final 12780251947 foi baixado e conferido: SHA256 `103c748165424b874c66b356e77fb35d4de51db4060eccee6f6a1d54bb05cb26`, 104 esperados, zero inesperados/flaky/ignorados. Os painéis foram reconstruídos das 40 capturas reais desta árvore, inspecionados visualmente e confirmam o preço anual US$299,00. Imagens anteriores incorretas não são entregues como finais.

Imagem final pronta e testada: `ghcr.io/atlasevermore/nutripilot@sha256:f277d0593238aeba8ae01e7bf9e13baa144685ee64dda03e39faabfcdb6bdd3f`. O teste do contêiner retornou 18.1.0 sem problemas e o push do manifesto terminou em 2026-10-27T23:48:54Z. O gatilho temporário foi removido depois do sucesso, no commit e452acf9c7d47d6c183840b6054c028e6b416668; sua árvore raiz voltou a ser exatamente a mesma fonte revisada. Nenhuma permissão de produção foi ampliada.

A restauração isolada e a verificação legal da árvore c1b99fd4 passaram em 23:43:19Z. Os cinco hashes originais foram preservados. A cópia real continua sendo a criada em 11:55:12Z, com validade para preparo vencida às 19:55:12Z. O ensaio não renova a data de criação. O e-mail comprovado continua sendo a única entrega real anterior, aplicável pelo backend/auth sem alterações. Endereço legal autorizado preservado em sigilo.

A execução nativa final 40606946022 passou integralmente, com capturas reais da mesma árvore c1b99fd4 em iPhone, iPad e Duo externo. O artefato combinado 12782680411 foi baixado com SHA256 1f2d480cdd5a444a409854a4f9bcaef91b1fb1da9de383614e05d51bf8cdac3b, conferido e inspecionado visualmente. O pacote final contém 43 PNGs reais e dois painéis. As capturas anteriores foram substituídas. O display interno preto/inativo foi excluído; não há comprovação de dobra/desdobra nem IPA assinado atual.

`prepare` continua falhando por quatro grupos: backup recente, acesso/modelo/orçamento/limites do provedor, configuração comercial iOS e IPA correspondente. As tarefas concretas e links estão em [PENDENCIAS_DEPLOY_2026-10-27.md](PENDENCIAS_DEPLOY_2026-10-27.md). O navegador deixou de responder; o envio das capturas ao rascunho Apple não pôde ser confirmado. Não foram comprados créditos, habilitadas recargas ilimitadas ou ativadas vendas globais. A declaração legal final de privacidade não foi aceita sem confirmação no momento da ação.

As seções seguintes preservam a investigação e os checkpoints históricos, sem substituir este estado consolidado.


## Historical checkpoint — pricing correction before WebKit focus investigation

Candidate 18.1.0 application tree `46bbe2916a8339660083fa780b2a975428647ba2`, native tree `be0680febad4748045991bbcee2238dc8525824e`; source revision `dbfe995e17e2bb5c730f923906624e8aed0f4040` in PR #37. Production remains V12. No Railway patch, automatic source reconnection, deployment or App Store submission was applied.

Actual final visual review caught a second annual renderer that still multiplied $29.99 by ten even after fixing the catalog. That renderer now respects the independent $299.00 complete annual reference. The browser acceptance test explicitly asserts the visible $299.00 before taking the Plans screenshot. [40572937894](https://github.com/AtlasEvermore/nutripilot/actions/runs/40572937894) succeeded: 98 application/PostgreSQL, eight release-gate, four native-configuration, ten signing-safeguard and 104 clean-browser checks (224 total). Browser artifact 12765688953 is valid and independently downloaded with SHA256 `5ef0398d0439c49e48334a88062cfab7c64c43690cf9df3927999b815a5ccf0c`; report has 104 expected and zero unexpected/flaky/skipped. Forty actual final browser PNGs and readable mobile/desktop panels were extracted and visually reviewed; the incorrect $299.90 image was rejected and excluded from delivery.

[Native run 40560182653](https://github.com/AtlasEvermore/nutripilot/actions/runs/40560182653) completed successfully using Xcode/iOS SDK 27.1. Its real simulator artifact 12761153179 has ZIP SHA256 `e82f13b8dd7eebd31fd44d202b01f8b5ea9bdbd637dd9f433b065d2de6835cd0`. Actual iPhone 1206×2622, iPad 2064×2752 and Duo outer 1398×2034 app screens were visually reviewed. Duo controls now avoid the vertical system region. Inactive inner display was black and is excluded; full native fold/unfold acceptance remains pending. These native layout captures use preceding application tree 183fd2c, with identical native/CSS; the only subsequent app change is the annual-price renderer. They are not proof of the final native pricing screen or store acceptance. Exact-final-source native run 40572937892 subsequently completed all captures successfully; artifact 12767278848 ZIP SHA256 3213300021009c8456d362136515939241f4d8d260f58e510efdfba91867c59b was downloaded, verified and visually inspected. Final delivery replaces the preceding native frames with these exact-final-tree captures. Full fold/unfold acceptance remains pending.

A real registry image was prepared in [40560327761](https://github.com/AtlasEvermore/nutripilot/actions/runs/40560327761), digest `sha256:fe0c96a888d33f61cda7a0399fb2db99d8e7c70b82e4ae285a14e7cadbd4b25d`, for preceding application tree 183fd2c. It is superseded by the final visual-price correction. Final PR validation skips image publication by design; no final-tree image or deploy is claimed. Browser control subsequently timed out twice, so a further manual registry-only dispatch and Apple gallery upload could not be confirmed. Do not retry or claim an ambiguous upload as saved without inspecting the gallery.

Exact-tree isolated restoration passed at 19:52:01Z, preserving all five original hashes with smoke 18.1.0 and empty issues. Isolated legal pages passed at 19:57:19Z. The source backup is still the actual 11:55:12Z snapshot; its eight-hour freshness expired at 19:55:12Z. No replacement snapshot or newer source time is invented. Latest prepare gate returns four operational groups: expired real backup, funded/model/spending intelligence controls, iOS commercial/product setup, and a current matching signed IPA. Hosting/legal/email preparation has evidence; email delivery remains the original single actual delivery with unchanged backend/auth blobs.

Apple monthly $29.99 and annual $299.00 reference prices were saved. Tax forms and age/medical-device questionnaire preparation were completed; privacy disclosures remain draft. Remaining iOS setup includes paid agreement/bank information, sale territories, privacy final declaration, review contact/demo access, complete product/validation configuration, valid exact-revision signed IPA and real store purchase/restoration/review acceptance. No sale or global availability was activated. Broad 175-country availability was rejected by automatic approval review and cancelled; a second email transmission was also blocked before sending. No charges, provider credits or unlimited billing were activated. Owner-approved legal address was preserved privately.

Concrete owner actions: complete Apple banking/paid agreement in App Store Connect Business, specify an intelligence operating budget and initial sale countries, and confirm the final privacy legal declaration. Protected signing approval remains required; no safeguard was weakened. Further execution then requires a fresh real backup, final immutable image and all prepare evidence before any deployment, followed by real launch acceptance and the launch gate.

Earlier sections below are dated history, superseded where this current result differs.


This iteration preserves the consolidated Atlas/NEXUS/local-command/scenario/PULSE implementation and the existing feature set, data formats, backend, products and native version.

- Long ordinary sheets keep their heading and close control visible while scrolling. Modal and menu keyboard focus stays within the open overlay; Escape closes it and explicit close/browser Back restore focus to the original control when that control still exists. Sheet refreshes preserve focus on the servings or method control. The command palette retains its independent inert/focus lifecycle. A meal command returns focus to its opener before opening the standard manual-entry dialog.
- Paused provider areas now explain availability before action. Existing generator forms remain as disabled previews while the service is explicitly paused, with working links to local recipes and navigation. When enabled, their original forms are unchanged. The coach preserves its draft/history and offers local alternatives while send/prompts are disabled. Its greeting respects the personal-data toggle. A stale guest allowance cannot advertise available analyses while the provider is paused.
- Discovery cards identify paused analysis independently from ownership. No prices or offers were added outside Plans. The new availability sentence uses all fourteen existing languages.
- No service plan, provider credit, production patch, data volume or store release was changed. Publication remains subject to AGENTS.md and the unchanged release gate.

Validation is recorded after the final candidate completes browser acceptance and visual inspection. Screenshots use a synthetic account and fictitious records and must not be presented as production or real-purchase evidence.

## Final candidate and acceptance evidence

PR [#36](https://github.com/AtlasEvermore/nutripilot/pull/36) is merged as `8f5286abdad36e08766c5a12d7c77e732959bf9e`. Application tree: `78ee5e8b3e18acadc6c35b3f2a73127fce970cdf`; version 18.1.0. Native tree remains `39d0f6ebdde9f52a715c46fc9b9de67c7538e24c`. The PR head `afbed1bdd3a6c93e6b96d6a8c50990cb9c6e26f8` has the same application tree, checked locally after fetching both refs.

PR run [40451471240](https://github.com/AtlasEvermore/nutripilot/actions/runs/40451471240) and merged-main run [40495854814](https://github.com/AtlasEvermore/nutripilot/actions/runs/40495854814) both passed 215 checks: 98 application/PostgreSQL, eight release-gate, three native configuration, ten signing-script and 96 clean-browser tests. The main workflow also built and smoke-tested the container (18.1.0, empty issues) and pushed the SHA tag successfully at 2026-10-27T11:28:58Z.

Historical immutable server image for the preceding application tree (not the final safe-area candidate):

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

## Earlier completion — before actual Duo visual review

The owner authorized the monthly US$29.99 sale price and the scoped email test. Monthly product `np_complete_monthly` now has a saved initial US price of $29.99; Apple-calculated examples observed were Brazil R$199.90 and France €34.99. No subscription was sold or app published. A proposed availability selection across 175 countries was **not applied**: automatic approval review rejected that broad commercial scope as requiring specific authorization; the dialog was cancelled. Annual product np_complete_annual subsequently saved the exact existing US$299.00 reference using Apple additional price points; examples observed were Brazil R$1,999.90 and France €349.00. Both initial price schedules persisted after confirmation. Final availability remains incomplete.

The native configuration previously forced portrait-only iPhone use. It now supports portrait and both landscape orientations, adds missing orientation configuration, sets UIRequiresFullScreen=false, preserves existing iPad orientation declarations and detects later regressions in check mode. Native tree is now `be0680febad4748045991bbcee2238dc8525824e`; the historical signed IPA no longer matches and was explicitly returned to pending. The signing workflow retains its exact-revision and protected-environment requirements. Both native workflows explicitly select Xcode 27.1/iOS SDK 27.1 on the documented standard xcode-27 runner.

Revision `2715779e17423befb27468f5823b2be6305a3fd8` passed 220 checks in [40549524029](https://github.com/AtlasEvermore/nutripilot/actions/runs/40549524029): 98 application/PostgreSQL, eight release-gate, four native-configuration, ten signing-script and 100 browser checks. The live-resize check preserves a coach draft and open recipe, verifies reachable close controls and restores keyboard focus after Escape across compact, wide and short landscape windows. [Native compilation 40549523956](https://github.com/AtlasEvermore/nutripilot/actions/runs/40549523956) succeeded with Xcode 27.1 build 27A9275 and SDK 27.1; Duo simulator availability was listed. This proves compilation, not full native fold/unfold acceptance. A subsequent CI-only bundled candidate fixture was added for a real Duo simulator capture; its visual result must be inspected before any Duo badge or store screenshot claim. It is not used by the signing workflow.

The isolated production-mode candidate sent a single real Portuguese signup access email to the previously authorized owner. HTTP 200/mailed=true was independently corroborated by the authenticated Resend list showing the new subject and Delivered. The OTP body was not opened. Earlier attempts failed because the isolated child lacked this environment's proxy/CA settings; inheriting only the required network settings resolved that test-harness failure. No application code change or production deployment was needed. See CANDIDATE_EMAIL_CHECK_2026-10-27.json.

A repeated isolated restoration passed at 2026-10-27T17:19:40.750Z: five original file hashes preserved and version 18.1.0 smoke with no issues. The source snapshot remains the real backup created at 2026-10-27T11:55:12.942Z; the repeat does not make the backup newer. Source hash and creation time remain unchanged.

The current prepare gate reports three pending groups: intelligence-provider funded access/model/spending controls, App Store commercial/product validation, and a new matching signed IPA. Hosting, independent backup, restoration, legal preparation and real candidate email have supporting evidence. Production remains V12; no Railway patch or store submission occurred. No credits, paid plans or unlimited recharge were activated.

### Duo simulator capture diagnosis

Native run 40552404121 built both the normal wrapper and the bundled candidate successfully. The actual Duo simulator booted and launched com.atlasevermore.nutripilot (PID recorded). Capture failed with NSPOSIXErrorDomain code 22 because the simulator has two displays: display 3 (2007x2853 inner) and display 1 (1398x2034 outer). No image was produced or claimed from that attempt. The capture command now explicitly selects each observed display. The fixture rebuild reuses the same derived-data directory after archiving the original normal wrapper, and quiet compiler output keeps diagnostic logs readable. The boot/capture step has a ten-minute timeout. No application/native source, production configuration or signing safeguard was changed by this capture fix.

## Safe-area candidate, before annual-reference correction

The actual Duo capture exposed controls under the vertical system region on the active outer display; the inactive inner display was black. This was not accepted as visual sign-off or uploaded as a ready store asset. Web CSS now honors asymmetric native/CSS safe-area insets in the page, sticky header, floating bottom navigation, long sheets and drawers, and updates on window changes. The web monthly reference was aligned to the owner-approved $29.99; the annual reference remains $299.00. No backend, authentication, data format, premium entitlement or provider implementation changed.

Application tree is now `c89c144a556501035eaba14210d9d538d798b392`, native tree `be0680febad4748045991bbcee2238dc8525824e`. Revision `1305af6e2266cf90dd95b663c3a722aa2d96de81` passed 224 checks in run [40556857030](https://github.com/AtlasEvermore/nutripilot/actions/runs/40556857030): 98 application/PostgreSQL, eight release-gate, four native-configuration, ten signing safeguards and 104 browsers. The new asymmetric-inset check passed in all four browsers. The browser report has 104 expected, zero unexpected/flaky/skipped; its ZIP SHA256 matches the artifact digest `44abdf9d00aa89ed9e7b18120df400fc4bbd005f9dd9d451ca4affa646338e63`. Forty final-tree raw captures were extracted and new readable mobile/desktop panels assembled from those actual pixels.

An isolated final-tree restore passed at 18:06:29Z using the unchanged real 11:55Z source backup; all five original hashes were preserved, smoke had no issues, and no new backup timestamp is claimed. Isolated legal checks passed again at 18:10:26Z without exposing approved operator details.

Automatic approval review blocked a second email transmission because only one test was authorized. No second mail was sent. The actual earlier delivery remains the evidence, at its original time. Final-tree applicability is independently grounded in unchanged server/auth blobs and a complete application diff containing only the frontend monthly constant and CSS. No new delivery is fabricated or timestamp renewed.

Read-only live health verification returned HTTP 200, version 12.0.0, ready=false. This is the existing production state, not the candidate. The historical registry image for tree 78ee5e8 is not a final-tree image. A new immutable image for c89c144 still requires a verified build; no production launch is claimed.

## Frozen pricing and safe-area candidate

Visual review of the c89c144 browser panel revealed that the generic ten-month annual formula had changed the complete annual reference to $299.90 after changing the monthly price. The annual complete reference is now explicitly independent at the owner-approved $299.00; monthly remains $29.99. The c89c144 Plans image showing $299.90 was rejected for final delivery. No module/combo pricing rule or actual store charge was altered by the annual correction.

Final application tree is `183fd2c2bf3f628353c0004f663df170f48b2b11`; native tree remains `be0680febad4748045991bbcee2238dc8525824e`. The native workflow now publishes Duo captures before beginning the additional required iPhone/iPad formats, so a slow secondary simulator cannot hide the Duo visual evidence. This changes diagnostic artifact ordering, not acceptance or release controls. The final pricing revision requires its own CI and screenshot confirmation; no prior incorrect price image is presented as its final result.

Restoration and legal checks passed again at 18:23:51Z for this exact tree. The real source snapshot is still the 11:55:12Z copy. Independent-backup freshness is now anchored directly to that source creation timestamp, rather than the later verification timestamp. Email evidence retains the original delivery and its unchanged executable backend hashes; no second email was sent.

## Registry-only preparation continuation

With browser dispatch unavailable, isolated branch ops/final-image-20261027 at 4753070403b59020c9476a32b2ed8bdec47d0075 enables the existing image workflow only for that named preparation branch. Its only difference from validated source dbfe995 is the branch trigger; application/native trees are identical. All regression/browser dependencies remain mandatory; no deployment command or production connection was added. Run 40602981157 is in progress. This workflow-only temporary branch is not proposed for merge in PR #37.

At 2026-10-27T23:36:15Z a read-only production health check returned HTTP 200, version 12.0.0 and ready=false. Railway config independently confirmed no source branch, one replica, the original /data volume, and the unchanged STAGED patch with 18 changes and checkSuites:true not applied. No staged variables or secrets were read or printed by this final configuration check.

## WebKit failure investigation and focus correction

Registry-only run 40602981157 was blocked by its browser prerequisite: 102 passed, two mobile-WebKit failures, and image job correctly skipped. One Mission test exhausted 30 seconds while the trace showed successful intermediate assertions and slow captures/actions; another asymmetric-safe-area test failed to restore the recipe opener focus after its second resize. Artifact 12779049355 was downloaded with matching ZIP SHA256 8ef0301a574e51a0cc4fc7ddbddc4f21e6f47acae540cf7402ff227e67d76c3f; trace and failure screenshot inspected. No failed run is represented as passed.

Recipe activation now explicitly supplies the originating control to renderModal, instead of depending on Safari's activeElement after pointer activation. Close restores focus synchronously before retaining the animation-frame fallback, avoiding reliance on a deferred rendering opportunity. The existing resize test first focuses the search control, then clicks the recipe and requires return to that recipe; all focus assertions remain. Mobile WebKit is limited to one rendering worker per project to reduce shared-runner contention. Test count, 30-second per-test budget, eight-second assertions and zero retries are unchanged. No release gate or assertion was removed.

Application tree after correction is c1b99fd4fcd170dbff27d73b3af216002a36f1c5; native tree remains be0680febad4748045991bbcee2238dc8525824e. PR source 484f36500192c06a4add8358314b38dee434dd4e and isolated image source fe8ef9ef4ec8316d98380bc54bcf1657ced404e8 differ only in the temporary image-branch trigger. New isolated restore and legal checks passed at 23:43:19Z; original production files and backup creation time are preserved. Full runs 40604028724 (PR) and 40604040289 (registry-only) are the validation references for this correction.

## Native capture timeout — infrastructure diagnostic, no production effect

Native run 40604029188 compiled the exact final iOS wrapper successfully and published the real final Duo artifact 12780656385 (ZIP SHA256 b4a54e997a2356df99d0f52e96f5fe3f5f26fc334628117a3b60bc25a281e749). The standard iPhone capture was written at 23:58:11Z, but the iPad launched only at 00:06:38Z and was still writing its screenshot when the combined 15-minute step timed out at 2026-10-28T00:07:19Z. The final combined upload was therefore skipped. This run is failed, not accepted as full native success, and the inaccessible iPhone/iPad output is not claimed as delivered.

The diagnostic workflow now gives each device its own bounded twelve-minute step and uploads each completed capture immediately, including after another diagnostic step fails. Failed steps still make the job fail; no continue-on-error or release-gate change is introduced. The overall 35-minute job limit, compiler, signing requirements and all application/native trees remain unchanged. Partial artifacts require individual visual review and are not automatically accepted as complete store evidence. This addresses the observed combined capture budget and loss of a completed iPhone capture; it does not change production code or certify fold/unfold.

Official Apple guidance independently checked: https://developer.apple.com/videos/play/tech-talks/111461/ describes Xcode 27.1, independent asymmetric safe areas and open/close/rotate/fold testing through Device Hub. https://developer.apple.com/documentation/xcode-release-notes/xcode-27_1-release-notes documents that initial simulator launch can take several minutes. This is supporting platform context, not proof that the observed timeout has a specific Apple defect number. Native pose acceptance remains pending; no black frame is accepted as an app screen.

## Final native result and delivery

Run 40606946022 completed successfully after separating the bounded capture steps. Exact-final-tree iPhone 1206×2622, iPad 2064×2752 and Duo outer 1398×2034 screenshots were independently downloaded, checked against the combined artifact SHA256 and visually inspected. The per-device source revision is c89fad4352b10c31de4858ac0795971a5962112d, with unchanged app c1b99fd4 / native be0680fe trees. No failed run was relabeled. All preceding native frames are excluded from final delivery. The resulting 47-entry ZIP contains 40 browser PNGs, three accepted native PNGs, two readable JPEG panels, a Portuguese README and a SHA256 manifest. FINAL_VISUAL_EVIDENCE_2026-10-27.json records source hashes and the package digest. No production data, credentials, actual personal contacts or private legal-field values appear in these delivered files or release reports. The inactive inner display is not delivered or counted as acceptance.
