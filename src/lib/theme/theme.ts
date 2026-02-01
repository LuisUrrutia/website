import { THEME_KEY, type Theme, type ThemeMode } from "./constants";

// Cache MediaQueryList to avoid creating it repeatedly
let mediaQuery: MediaQueryList | null = null;
let listenerInitialized = false;

function getMediaQuery(): MediaQueryList {
	if (!mediaQuery) {
		mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
	}
	return mediaQuery;
}

function getSystemTheme(): Theme {
	return getMediaQuery().matches ? "dark" : "light";
}

export function getStoredMode(): ThemeMode {
	const stored = localStorage.getItem(THEME_KEY);
	if (stored === "light" || stored === "dark") {
		return stored;
	}
	return "auto";
}

export function getActiveTheme(mode: ThemeMode): Theme {
	return mode === "auto" ? getSystemTheme() : mode;
}

export function applyTheme(theme: Theme): void {
	document.documentElement.dataset.theme = theme;
}

export function setMode(mode: ThemeMode): void {
	if (mode === "auto") {
		localStorage.removeItem(THEME_KEY);
	} else {
		localStorage.setItem(THEME_KEY, mode);
	}
	applyTheme(getActiveTheme(mode));
}

export function cycleMode(currentMode?: ThemeMode): ThemeMode {
	const current = currentMode ?? getStoredMode();
	// Inline cycle: auto -> light -> dark -> auto
	const next: ThemeMode = current === "auto" ? "light" : current === "light" ? "dark" : "auto";
	setMode(next);
	return next;
}

export function initThemeListener(): void {
	// Prevent duplicate listeners
	if (listenerInitialized) return;
	listenerInitialized = true;

	getMediaQuery().addEventListener("change", () => {
		if (getStoredMode() === "auto") {
			applyTheme(getSystemTheme());
		}
	});
}
