# Public Case Files

Public docket entries live as JSON files in this directory. Each accepted case becomes:

- An entry in `docket.json`.
- A static case page at `case/<id>/index.html`.
- A static share card at `case/<id>/card.svg`.

Run this after adding or editing a case:

```bash
npm run build
npm run check
```

## Schema

```json
{
  "id": "case-0000-short-slug",
  "title": "Short public title",
  "source": "Public",
  "text": "Exact case text to judge.",
  "mode": "agent",
  "chaos": 6,
  "serious": true,
  "friendly": false
}
```

Allowed `mode` values:

- `pitch`
- `agent`
- `post`
- `meme`

Keep IDs lowercase, unique, and URL-safe. Do not commit private data, credentials, confidential customer content, or non-public business information.
