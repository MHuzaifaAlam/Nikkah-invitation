export const nikahEvent = {
  title: "Nikah Ceremony — Muhammad Huzaifa Alam & Bisma Ajmal Khan",
  description:
    "You are warmly invited to join us for the Nikah ceremony of Muhammad Huzaifa Alam and Bisma Ajmal Khan.",
  timeZone: "Asia/Karachi",
  dateLabel: "13 December 2026",
  dayLabel: "Sunday",
  timeLabel: "12:00 PM – 4:00 PM PKT",
  venue:
    "Blessings Marriage Hall, Punj Peer Darbar, Main Canal Road Bridge, Tajpura, Lahore, Pakistan",
  mapsUrl:
    "https://www.google.com/maps/place/Blessings+Marriage+Hall/@31.5651422,74.3969203,17z/data=!4m6!3m5!1s0x39190500485d6b23:0xe578f69b5d7aa20f!8m2!3d31.5651422!4d74.3969203!16s%2Fg%2F11y5_59m03?entry=ttu&g_ep=EgoyMDI2MTExOC4xIKXMDSoASAFQAw%3D%3D",
  localStart: "20261213T120000",
  localEnd: "20261213T160000",
  utcStartTimestamp: Date.UTC(2026, 11, 13, 7),
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
    `DTEND;TZID=${nikahEvent.timeZone}:${nikahEvent.localEnd}`,
    `SUMMARY:${escapeCalendarText(nikahEvent.title)}`,
    `DESCRIPTION:${escapeCalendarText(nikahEvent.description)}`,
    `LOCATION:${escapeCalendarText(nikahEvent.venue)}`,
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
    dates: `${nikahEvent.localStart}/${nikahEvent.localEnd}`,
    ctz: nikahEvent.timeZone,
    details: nikahEvent.description,
    location: nikahEvent.venue,
  });

  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}
