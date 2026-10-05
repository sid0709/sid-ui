# sid-ui-theme

Static catalog for the `sid-ui` package. GitHub Pages serves the export at `https://sid0709.github.io/sid-ui/`.

```bash
bun run dev:theme
bun run build:theme
```

`build:theme` writes `theme/out`. The Pages workflow sets `NEXT_PUBLIC_BASE_PATH=/sid-ui` so asset URLs match the project site. Local dev leaves that unset.
