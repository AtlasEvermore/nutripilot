# NutriPilot 18.0.1 — regression fixes and release status

## Observed production state

On 2026-10-23, `https://app.atlasevermore.com/api/health` reported version
`12.0.0`, despite main already containing version 18.0.0. A single synthetic
meal-text request returned HTTP 502 with a generic error. The photo screenshot
shows the same error, but the provider-side cause cannot be established from
that message. Updating repository code does not prove the live provider works.
The public health report also indicated missing store-billing and legal setup;
this release does not configure those accounts or their credentials.

The existing GitHub workflow builds and publishes a container to GHCR. It has
no step that updates the hosting service. No new service, subscription or
hosting migration is introduced here. The live server still needs to run the
new image through its existing deployment integration. The image now records
its Git commit in `/api/health` as `revision`, so an actual rollout is verifiable.

## Changes

- Serve the bundled barcode JavaScript and WebAssembly reader; previously both
  were excluded from the server's static-file allowlist.
- Reject invalid JSON request shapes, empty meal requests, empty AI meal
  results, and photo analysis without an AI provider, instead of producing
  server exceptions or a fabricated generic meal.
- Refund failed free scans to both device and network counters. Count each
  request once against the optional global AI ceiling.
- Bound the photo request time, reject failed canvas conversion, and keep
  asynchronous photo results from overwriting a closed or replaced sheet.
- Keep a new coach draft when the preceding answer arrives. Prevent duplicate
  sends while waiting and ignore replies after conversation deletion.
- Respect the coach's data-sharing opt-out for all personal fields, rather
  than sending goals, allergies, weight and meal history outside `context`.
- Translate the generic production failure shown in the screenshot.
- Never use cached HTML as an offline fallback for a missing script/module.
- Run syntax/i18n checks and regression tests before publishing the image.

## Verification

`npm run check` and `npm test` pass. The 12 regression scenarios cover public
assets, blocked private files, malformed requests, access control, state
persistence, photo payloads, language forwarding, computed meal totals, free
limits, quota refunds, provider failure and retry, missing meal output, coach
history and failure, global limits, modal races, coach privacy and drafts,
conversation deletion, canvas failure and offline script responses.

Tests use isolated temporary data and a local fake provider. They never use
production users, paid purchases, or real provider credentials. These checks
verify application behavior; they do not verify real photo recognition,
Safari camera permissions, real store purchases, or production AI credentials.
Those end-to-end checks remain necessary before declaring the app launch-ready.

## Reproduce

Node 22+; no test packages to install:

```sh
cd nutripilot-france-hotmart-final-v4
npm run check
npm test
```
