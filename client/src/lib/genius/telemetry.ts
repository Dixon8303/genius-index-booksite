/* Anonymized validation-study telemetry — the same Google Apps Script → Sheet
   pipeline the original assessment feeds, fire-and-forget over no-cors.
   Consent-gated: nothing is sent unless the taker left the consent box on. */

const SUBMIT_URL =
  "https://script.google.com/macros/s/AKfycbwIsDU2vvSmc6HRiRn9Lj6Cbi3HL_nhcLe2yPSvTOzutv35GJknxVh2wbqUXDDFcQ4/exec";

export function submitTelemetry(
  payload: Record<string, unknown>,
  consent: boolean,
): Promise<"sent" | "skipped" | "failed"> {
  if (!SUBMIT_URL || !consent) return Promise.resolve("skipped");
  return fetch(SUBMIT_URL, {
    method: "POST",
    mode: "no-cors",
    headers: { "Content-Type": "text/plain;charset=utf-8" },
    body: JSON.stringify(payload),
  })
    .then(() => "sent" as const)
    .catch(() => "failed" as const);
}

export function telemetryStart(code: string, consent: boolean): void {
  void submitTelemetry(
    { v: "GI-1.0", event: "start", code: code || null, ts: new Date().toISOString() },
    consent,
  );
}
