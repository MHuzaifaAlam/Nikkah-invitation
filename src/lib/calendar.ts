export const nikahEvent = {
  title: "Nikah Ceremony — Muhammad Huzaifa Alam & Bisma Ajmal Khan",
  description:
    "You are warmly invited to join us for the Nikah ceremony of Muhammad Huzaifa Alam and Bisma Ajmal Khan.",
  timeZone: "Asia/Karachi",
  dateLabel: "13 December 2026",
  dayLabel: "Sunday",
  timeLabel: "1:00 PM PKT",
  localStart: "20261213T130000",
  utcStartTimestamp: Date.UTC(2026, 11, 13, 8),
};

function escapeCalendarText(value: string) {
  return value
    .replace(/\\/g, "\\\\")
    .replace(/\n/g, "\\n")
    .replace(/,/g, "\\,")
    .replace(/;/g, "\\;");
}

function foldCalendarLine(line: string) {
  const encoder = new TextEncoder();
  const folded: string[] = [];
  let current = "";
  let byteLength = 0;

  for (const character of line) {
    const characterLength = encoder.encode(character).length;
    if (byteLength + characterLength > 75) {
      folded.push(current);
      current = ` ${character}`;
      byteLength = 1 + characterLength;
    } else {
      current += character;
      byteLength += characterLength;
    }
  }

  folded.push(current);
  return folded.join("\r\n");
}

export function createNikahCalendarFile(now = new Date()) {
  const timestamp = now
    .toISOString()
    .replace(/[-:]/g, "")
    .replace(/\.\d{3}/, "");
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Huzaifa and Bismah//Nikah Invitation//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VTIMEZONE",
    `TZID:${nikahEvent.timeZone}`,
    `X-LIC-LOCATION:${nikahEvent.timeZone}`,
    "BEGIN:STANDARD",
    "DTSTART:19700101T000000",
    "TZOFFSETFROM:+0500",
    "TZOFFSETTO:+0500",
    "TZNAME:PKT",
    "END:STANDARD",
    "END:VTIMEZONE",
    "BEGIN:VEVENT",
    "UID:nikah-ceremony-20261213-130000@huzaifa-bismah.invitation",
    `DTSTAMP:${timestamp}`,
    "SEQUENCE:0",
    `DTSTART;TZID=${nikahEvent.timeZone}:${nikahEvent.localStart}`,
    `SUMMARY:${escapeCalendarText(nikahEvent.title)}`,
    `DESCRIPTION:${escapeCalendarText(nikahEvent.description)}`,
    "LOCATION:",
    "STATUS:CONFIRMED",
    "END:VEVENT",
    "END:VCALENDAR",
  ];

  return `${lines.map(foldCalendarLine).join("\r\n")}\r\n`;
}

export function createGoogleCalendarUrl() {
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: nikahEvent.title,
    // The template requires an end; matching it to the start avoids inventing a duration.
    dates: `${nikahEvent.localStart}/${nikahEvent.localStart}`,
    ctz: nikahEvent.timeZone,
    details: nikahEvent.description,
  });

  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}
