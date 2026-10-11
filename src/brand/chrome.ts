/**
 * The browser's own chrome color (`<meta name="theme-color">`), per color scheme.
 * It matches `--color-background-surface`, the top bar every app shell paints,
 * so the mobile address bar runs straight into the header. A meta tag cannot
 * read a CSS variable, so the values live here; a test keeps them equal to the theme.
 * Also exported alone as `sid-ui/browser-theme` for server layouts.
 */
export const BROWSER_THEME_COLOR = {
  light: "#fbfcff",
  dark: "#1a1b22",
} as const;
