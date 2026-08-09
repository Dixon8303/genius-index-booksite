// The Genius Index assessment now lives inside this app. BASE_URL keeps the
// GitHub Pages subpath working in production and "/" in dev.
export const ASSESSMENT_URL = `${import.meta.env.BASE_URL}assessment`;
export const PROFILE_URL = `${import.meta.env.BASE_URL}profile`;
export const DOMAINS_URL = `${import.meta.env.BASE_URL}domains`;
export const PROTOCOL_URL = `${import.meta.env.BASE_URL}protocol`;

// Rest of the E.A.T. Media / Genius Index ecosystem (separate sites/repos).
// WHAT_HISTORY_BURIED_URL points at the official site (built + deployed from
// ImaginariumOzone's site/ folder to /book/), not the tinyurl -- a direct URL
// whose correctness is verifiable, rather than an external redirect.
export const WHAT_HISTORY_BURIED_URL = "https://dixon8303.github.io/ImaginariumOzone/book/";
export const BLACK_GENIUS_FILES_URL = "https://dixon8303.github.io/black-genius-files/";
// The parent company site, live at eatmediatv.com.
export const EAT_MEDIA_URL = "https://eatmediatv.com/";
