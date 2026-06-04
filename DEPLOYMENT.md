# SlopCourt Deployment

SlopCourt is designed to deploy for free as static files. The recommended target is GitHub Pages because it also gives us issue intake, pull requests, and Actions in the same place.

## Recommended: GitHub Pages

1. Create a GitHub repository.
2. Push this folder to the repository's `main` branch.
3. In GitHub, open `Settings -> Pages`.
4. Set `Build and deployment -> Source` to `GitHub Actions`.
5. Push to `main` or run the `Deploy static SlopCourt` workflow manually.

The workflow runs `npm run build`, uploads the static site, and deploys it to Pages.

## Optional Social Preview URLs

Case pages use generated `card.svg` files for social previews. Relative URLs work in browsers, but some social scrapers prefer absolute URLs.

For `evilbotnet/slopcourt`, the expected GitHub Pages URL is:

```text
https://evilbotnet.github.io/slopcourt
```

The included workflow uses that URL by default. If you later add a custom domain:

1. Open repository `Settings -> Secrets and variables -> Actions -> Variables`.
2. Add `SLOPCOURT_SITE_URL` with the deployed site URL.
3. Rerun the Pages workflow.

## Manual Free Static Hosting

Any static host works:

```bash
npm run build
```

Upload these files and directories:

- `index.html`
- `404.html`
- `.nojekyll`
- `styles.css`
- `app.js`
- `slopcore.js`
- `docket.json`
- `case/`
- `cases/`

## AWS S3 Static Website

S3 can be very cheap, but it is not guaranteed to be free forever. Use GitHub Pages first if the goal is zero recurring cost.

If you use S3:

1. Run `npm run build`.
2. Upload the static files.
3. Set `index.html` as the index document.
4. Set `404.html` as the error document.
5. Make the required public assets readable.

## Release Checklist

- [ ] `npm run check` passes.
- [ ] `docket.json` includes the expected cases.
- [ ] Generated `case/<id>/index.html` pages exist.
- [ ] Generated `case/<id>/card.svg` files exist.
- [ ] GitHub Pages workflow completed successfully.
- [ ] Case page social preview metadata points to the expected card URL.
