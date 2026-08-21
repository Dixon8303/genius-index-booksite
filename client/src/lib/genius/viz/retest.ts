/* Retest reminder: a downloadable .ics calendar event ~90 days out, so
   "come back and see what's changed" is a real invitation instead of a line
   of text — works with no account and no backend, in any calendar app.
   Ported verbatim; only the URL now points at this app. */

import type { Interpretation } from "../engine/interpret";
import { triggerBlobDownload } from "./shareCard";

const RETEST_DAYS = 90;
const APP_URL = "https://dixon8303.github.io/genius-index-booksite/assessment";

const pad2 = (n: number) => String(n).padStart(2, "0");
const icsLocalDate = (d: Date) =>
  `${d.getFullYear()}${pad2(d.getMonth() + 1)}${pad2(d.getDate())}`;
const icsUtcStamp = (d: Date) =>
  `${d.getUTCFullYear()}${pad2(d.getUTCMonth() + 1)}${pad2(d.getUTCDate())}T${pad2(d.getUTCHours())}${pad2(d.getUTCMinutes())}${pad2(d.getUTCSeconds())}Z`;
const icsEscape = (s: string) =>
  String(s)
    .replace(/\\/g, "\\\\")
    .replace(/,/g, "\\,")
    .replace(/;/g, "\\;")
    .replace(/\n/g, "\\n");

export function retestDate(): Date {
  return new Date(Date.now() + RETEST_DAYS * 86400000);
}

function buildRetestICS(m: Interpretation): string {
  const when = retestDate();
  const braidName = m.primary ? m.primary.name : "your braid";
  const desc = `You took The Genius Index and came out ${braidName}. Come back and retake it to see whether that still holds -- or what's shifted since. ${APP_URL}`;
  const dt = icsLocalDate(when);
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//The Genius Index//EN",
    "CALSCALE:GREGORIAN",
    "BEGIN:VEVENT",
    `UID:gi-retest-${Date.now()}@geniusindex`,
    `DTSTAMP:${icsUtcStamp(new Date())}`,
    `DTSTART;VALUE=DATE:${dt}`,
    `DTEND;VALUE=DATE:${dt}`,
    `SUMMARY:${icsEscape("Retake the Genius Index — see what's changed")}`,
    `DESCRIPTION:${icsEscape(desc)}`,
    `URL:${APP_URL}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ];
  return lines.join("\r\n");
}

export function downloadRetestReminder(m: Interpretation): void {
  const ics = buildRetestICS(m);
  const blob = new Blob([ics], { type: "text/calendar;charset=utf-8" });
  triggerBlobDownload(blob, "genius-index-retest-reminder.ics");
}
