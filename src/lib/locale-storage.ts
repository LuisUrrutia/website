/**
 * Locale preference storage utility.
 * Uses localStorage with cookie as fallback for users with localStorage disabled.
 */

const STORAGE_KEY = "preferred-locale";
const COOKIE_NAME = "preferred-locale";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 365; // 1 year

/**
 * Get a cookie value by name.
 */
function getCookie(name: string): string | null {
	const match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
	return match ? match[2] : null;
}

/**
 * Set a cookie with the given name and value.
 */
function setCookie(name: string, value: string, maxAge: number): void {
	document.cookie = `${name}=${value};path=/;max-age=${maxAge};SameSite=Lax`;
}

/**
 * Get the stored locale preference.
 * Tries localStorage first, falls back to cookie.
 */
export function getStoredLocale(): string | null {
	try {
		const stored = localStorage.getItem(STORAGE_KEY);
		if (stored) return stored;
	} catch {
		// localStorage not available
	}
	return getCookie(COOKIE_NAME);
}

/**
 * Set the locale preference.
 * Stores in both localStorage and cookie for redundancy.
 */
export function setStoredLocale(locale: string): void {
	try {
		localStorage.setItem(STORAGE_KEY, locale);
	} catch {
		// localStorage not available
	}
	setCookie(COOKIE_NAME, locale, COOKIE_MAX_AGE);
}
