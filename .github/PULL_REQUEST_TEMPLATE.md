## Summary

Describe the case or product change.

## Case Promotion Checklist

- [ ] New public cases are added under `cases/*.json`.
- [ ] Case IDs are unique and URL-safe.
- [ ] Case text does not include private data, credentials, or confidential customer information.
- [ ] `mode` is one of `pitch`, `agent`, `post`, or `meme`.
- [ ] `chaos` is a number from 1 to 10.
- [ ] `serious` and `friendly` are booleans.
- [ ] `npm run build` was run after changing `cases/*.json`.
- [ ] Generated `docket.json`, `case/<id>/index.html`, and `case/<id>/card.svg` are included when needed.
- [ ] `npm run check` passes.

## Notes

Link the originating issue if this promotes a community submission.
