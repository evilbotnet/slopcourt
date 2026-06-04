# SlopCourt

SlopCourt is a meme-native quality court for AI output. Users paste a launch post, agent demo, startup pitch, or generated content and get a verdict, receipts, fixes, a shareable PNG card, and a permalinkable case file.

The silly surface is the distribution loop. The serious product is a quality benchmark for teams publishing AI-generated content and agent demos.

## Concept Scope

**Wedge:** public frustration with generic AI content creates a strong social hook. SlopCourt lets people call out slop without writing a thread, while giving builders useful fixes.

**Target users:**

- AI founders testing launch copy and demo claims.
- Creators turning AI discourse into shareable posts.
- Marketing and growth teams reviewing AI-assisted content before publishing.
- Developer relations teams reviewing agent demos for proof, logs, and specificity.

**Core loop:**

1. Paste content.
2. Get a verdict and scores.
3. File it to the public docket.
4. Export the verdict card or copy a permalink.
5. Invite others to put their content on trial.

**Why it can become more than a joke:** the verdict card creates a public language for quality. The private version becomes a pre-publish gate for teams that do not want generic AI output reaching customers.

## MVP Build

The current build is intentionally dependency-free at runtime:

- `index.html` - product UI, analyzer, scope, and deployment notes.
- `styles.css` - responsive, high-contrast app surface.
- `app.js` - deterministic scoring engine, verdict generation, docket state, permalinks, canvas charts, PNG export.
- `slopcore.js` - shared scoring engine used by both the app and the static page generator.
- `cases/*.json` - public case files committed to the repo.
- `docket.json` - static public docket index, including generated verdict metadata for leaderboard sorting.
- `case/<id>/index.html` - generated static case pages with durable URLs.
- `case/<id>/card.svg` - generated social preview card for each public case.
- `tools/build-docket.mjs` - no-dependency Node script that rebuilds `docket.json` and static case pages.
- `vercel.json` - static deploy config for Vercel.
- `netlify.toml` - static deploy config for Netlify.

The scoring engine checks for:

- AI buzzword density.
- Proof signals such as numbers, users, revenue, benchmarks, and shipped work.
- Human specificity signals.
- Sentence bloat and launch-post overheating.
- Mode-specific requirements for pitches, agent demos, posts, and memes.

The current docket is static-first and free-hostable:

- Public cases live as JSON files in `cases/`.
- `docket.json` is fetched by the app when served from a static host and powers leaderboard sorting.
- `case/<id>/index.html` pages are generated from the same JSON case files.
- `case/<id>/card.svg` images are generated from the same verdict data and used by case pages.
- Seed cases remain as an in-app fallback if `docket.json` cannot be fetched.
- Locally filed cases are stored in `localStorage`.
- Permalinks encode the case file in the URL hash, so the MVP works without a backend.
- The "Download case JSON" button creates a case file that can be committed to the repo.

## Community Intake

Case submission does not require a database or hosted form:

1. A submitter opens a GitHub issue with the "Submit a SlopCourt case" template.
2. Maintainers review for safety, quality, and public suitability.
3. Accepted cases are promoted into `cases/*.json`.
4. `npm run build` regenerates `docket.json`, static case pages, and share cards.
5. `npm run check` validates the app, generator, and case output.

The PR template includes the promotion checklist, and `cases/README.md` documents the JSON schema.

## Local Run

```bash
python3 -m http.server 4173
```

Then open:

```text
http://127.0.0.1:4173
```

Because this is a static app, you can also open `index.html` directly in a browser.

To rebuild the public docket index and static case pages after adding files to `cases/`:

```bash
npm run build
```

The script uses only Node built-ins and installs no dependencies.

If you know the final deployed domain, set `SLOPCOURT_SITE_URL` during the build to emit absolute social image URLs:

```bash
SLOPCOURT_SITE_URL=https://example.github.io/slopcourt npm run build
```

## Deployment

The default deployment target is free static hosting. No paid app server, database, queue, or model endpoint is required.

See `DEPLOYMENT.md` for the full zero-cost deployment runbook.

### GitHub Pages

1. Push the repo to GitHub.
2. Enable Pages for the repo.
3. Use the included GitHub Actions workflow, or deploy from the main branch root.
4. The workflow rebuilds `docket.json` and publishes the static site.
5. Optionally set the `SLOPCOURT_SITE_URL` repository variable so generated social preview metadata uses absolute URLs.

### AWS S3

1. Run `npm run build`.
2. Upload the repo files to a public static website bucket.
3. Set `index.html` as the index document.
4. Keep `docket.json`, `app.js`, `styles.css`, and `cases/` public.

### Plain Git Repository

The app also works as source-only code. Public cases can be reviewed as JSON pull requests, and the docket can be rebuilt before any static publish.

### Optional Static Hosts

Vercel and Netlify still work as static hosts, but they are not required. If used, publish the project root and leave the build command empty or run `npm run build`.

## Monetization Model

**Free:** public trials, verdict cards, permalinks, weekly leaderboard, remix prompts.

**Creator Pro:** branded cards, saved case history, private trials, scheduled exports.

**Team Pro:** shared rubric, Slack dropbox, approval workflows, private dataset, team templates.

**API:** pre-publish score for CMS, marketing automation, docs, and agent-demo pipelines.

**Enterprise:** custom rubrics, SSO, audit logs, compliance retention, model/provider controls.

## Next Build Phase

1. Add a browser extension that works entirely client-side.
2. Add optional LLM scoring only when a free or user-supplied endpoint is available.
3. Use collected cases to tune a public Slop Index rubric.
