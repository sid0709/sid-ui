# sid-ui

React components, tokens, and theme for Joined products. Apps import this package instead of keeping a local copy of the design system.

## Install

```bash
bun add sid-ui react react-dom
```

`react` and `react-dom` must be 19 or newer. The package also installs `@astryxdesign/core`, `@astryxdesign/theme-neutral`, and `@stylexjs/stylex`.

## Use

```tsx
import { Button } from "sid-ui";
import { JoinedProvider } from "sid-ui/theme";

import "sid-ui/styles/joined.css";
```

```tsx
<JoinedProvider>
  <Button variant="primary" label="Save" onClick={onSave} />
</JoinedProvider>
```

Next.js apps add `sid-ui` to `transpilePackages`, because the package ships TypeScript source.

## Entry points

| Import | Contents |
| --- | --- |
| `sid-ui` | Components |
| `sid-ui/theme` | `JoinedProvider` and the theme object |
| `sid-ui/styles/joined.css` | Tokens and component styles. Import this once per app. |
| `sid-ui/places` | Place types and helpers |
| `sid-ui/geoapify` | Server helper for place search. Pass `process.env.GEOAPIFY_API_KEY`. |
| `sid-ui/brand-name` | Product name constant, without the component barrel |

## Theme source

Token values are generated from `src/theme/joined.theme.ts`.

```bash
bun run theme:build
```

## Publish

From this repo, after `bun pm whoami` shows your registry user:

```bash
bun publish
```
