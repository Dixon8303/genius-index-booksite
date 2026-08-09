/* Every localStorage key and schema version in one place. All payloads carry
   a `v` field; readers switch on it and, on parse failure, return empty while
   preserving the raw string under `<key>.corrupt` instead of throwing. */

export const RUN_KEY = "gi.run.v1";
export const HISTORY_KEY = "gi.history.v1";
export const PROTOCOL_KEY = "gi.protocol.v1";

/* Legacy keys from the original assessment (same origin, still readable —
   and still read by the old site, so never delete them). */
export const LEGACY_COMPLETED_KEY = "gi_completed_v1";
export const LEGACY_BASELINE_KEY = "gi_baseline_v1";

export function readJson<T>(key: string): T | null {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    return JSON.parse(raw) as T;
  } catch {
    try {
      const raw = localStorage.getItem(key);
      if (raw) localStorage.setItem(`${key}.corrupt`, raw);
      localStorage.removeItem(key);
    } catch {
      /* storage unavailable — nothing to preserve */
    }
    return null;
  }
}

export function writeJson(key: string, value: unknown): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* quota/unavailable — the app stays usable without persistence */
  }
}

export function removeKey(key: string): void {
  try {
    localStorage.removeItem(key);
  } catch {
    /* ignore */
  }
}
