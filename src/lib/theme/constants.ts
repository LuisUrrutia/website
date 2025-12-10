export const THEME_KEY = "theme";
export const THEMES = ["light", "dark"] as const;
export const THEME_MODES = ["auto", "light", "dark"] as const;

export type Theme = (typeof THEMES)[number];
export type ThemeMode = (typeof THEME_MODES)[number];
