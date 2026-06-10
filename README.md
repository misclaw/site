# misclaw/site

The landing page at **https://misclaw.app**. Static HTML/CSS/JS — no build step.

It reads `projects.json` and renders one card per project. With an empty
registry it shows the "No projects yet" state.

## Registry format

`projects.json` is the single source of truth for what appears on the page:

```json
{
  "projects": [
    {
      "name": "Research Program",
      "slug": "research",
      "url": "https://research.misclaw.app",
      "repo": "https://github.com/misclaw/research",
      "description": "One-line summary shown on the card.",
      "status": "live"
    }
  ]
}
```

| Field         | Required | Notes                                              |
| ------------- | -------- | -------------------------------------------------- |
| `name`        | yes      | Display name on the card.                          |
| `slug`        | yes      | Subdomain segment → `<slug>.misclaw.app`.          |
| `url`         | yes      | Live URL the card links to.                        |
| `repo`        | no       | GitHub repo URL.                                   |
| `description` | no       | One-line summary.                                  |
| `status`      | no       | `live` or `building` → renders a badge.            |

## Local preview

```sh
npx serve .        # or: python3 -m http.server
```

## Deploy

Connected to Cloudflare Pages via Git integration — every push to `main`
deploys automatically. See `../CLAUDE.md` for the full workflow.
