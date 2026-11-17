import {
  CalendarDays,
  CalendarPlus,
  Clock3,
  MapPin,
  Music2,
  Pause,
  SkipForward,
  X,
} from "lucide-react";
import { useEffect, useRef, useState, type ReactNode } from "react";

import maulaMeryMp3 from "./assets/Maulamery.mp3";
import palaceImage from "./assets/rose-palace-courtyard.jpg";
import { createGoogleCalendarUrl, createNikahCalendarFile, nikahEvent } from "./lib/calendar";

const weddingData = {
  groom: "Huzaifa",
  bride: "Bismah",
  fullGroom: "Muhammad Huzaifa Alam",
  fullBride: "Bisma Ajmal Khan",
  date: nikahEvent.dateLabel,
  day: nikahEvent.dayLabel,
  time: nikahEvent.timeLabel,
  venue: "To Be Announced",
  music: maulaMeryMp3,
};

function Ornament() {
  return (
    <div className="ornament" aria-hidden="true">
      <span />
      <i>✦</i>
      <span />
    </div>
  );
}

function Reveal({ children, className = "" }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          node.classList.add("is-visible");
          observer.disconnect();
        }
      },
      { threshold: 0.16 },
    );
    observer.observe(node);

    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className={`reveal ${className}`}>
      {children}
    </div>
  );
}

function Countdown() {
  const [now, setNow] = useState<number | null>(null);

  useEffect(() => {
    const update = () => setNow(Date.now());
    update();
    const timer = window.setInterval(update, 1000);
    return () => window.clearInterval(timer);
  }, []);

  const remaining = now === null ? null : Math.max(0, nikahEvent.utcStartTimestamp - now);
  const complete = remaining === 0;
  const units =
    remaining === null
      ? null
      : [
          { label: "Days", value: Math.floor(remaining / 86_400_000) },
          { label: "Hours", value: Math.floor((remaining / 3_600_000) % 24) },
          { label: "Minutes", value: Math.floor((remaining / 60_000) % 60) },
          { label: "Seconds", value: Math.floor((remaining / 1_000) % 60) },
        ];

  return (
    <section className="countdown-section">
      <Reveal className="countdown-card">
        <p className="eyebrow">Until our new beginning</p>
        <h2>{complete ? "Today, our forever begins" : "Counting down to the Nikah"}</h2>
        {complete ? (
          <p className="countdown-complete">
            The blessed day has arrived. Please join us in your duas.
          </p>
        ) : (
          <div
            className="countdown-grid"
            aria-live="off"
            aria-label="Time remaining until the Nikah"
          >
            {units?.map(({ label, value }) => (
              <div className="countdown-unit" key={label}>
                <strong key={value} className="countdown-value">
                  {String(value).padStart(2, "0")}
                </strong>
                <span>{label}</span>
              </div>
            ))}
          </div>
        )}
        <p className="countdown-date">
          {weddingData.day}, {weddingData.date} · {weddingData.time}
        </p>
      </Reveal>
    </section>
  );
}

export default function App() {
  const [opened, setOpened] = useState(false);
  const [musicOn, setMusicOn] = useState(false);
  const [showSkip, setShowSkip] = useState(false);
  const [skipped, setSkipped] = useState(false);
  const [openingComplete, setOpeningComplete] = useState(false);
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);
  const calendarButtonRef = useRef<HTMLButtonElement>(null);
  const calendarDialogRef = useRef<HTMLDivElement>(null);
  const openingTimerRef = useRef<number | null>(null);

  useEffect(
    () => () => {
      if (openingTimerRef.current !== null) window.clearTimeout(openingTimerRef.current);
    },
    [],
  );

  useEffect(() => {
    if (!calendarOpen) return;

    const dialog = calendarDialogRef.current;
    const firstAction = dialog?.querySelector<HTMLElement>("button:not([disabled]), a[href]");
    firstAction?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setCalendarOpen(false);
        calendarButtonRef.current?.focus();
        return;
      }

      if (event.key !== "Tab" || !dialog) return;
      const actions = dialog.querySelectorAll<HTMLElement>("button:not([disabled]), a[href]");
      const first = actions[0];
      const last = actions[actions.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last?.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first?.focus();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [calendarOpen]);

  useEffect(() => {
    const update = () => {
      const maximum = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(maximum > 0 ? (window.scrollY / maximum) * 100 : 0);
    };
    window.addEventListener("scroll", update, { passive: true });
    update();
    return () => window.removeEventListener("scroll", update);
  }, []);

  const openInvitation = async () => {
    if (opened) return;
    setOpened(true);
    setShowSkip(true);
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    openingTimerRef.current = window.setTimeout(
      () => {
        setShowSkip(false);
        setOpeningComplete(true);
        openingTimerRef.current = null;
      },
      reducedMotion ? 0 : 2800,
    );

    const audio = audioRef.current;
    if (audio) {
      audio.currentTime = 0;
      try {
        await audio.play();
        setMusicOn(true);
      } catch {
        setMusicOn(false);
      }
    }
  };

  const skipOpening = () => {
    if (openingTimerRef.current !== null) window.clearTimeout(openingTimerRef.current);
    openingTimerRef.current = null;
    setSkipped(true);
    setOpeningComplete(true);
    setShowSkip(false);
  };

  const toggleMusic = async () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (musicOn) {
      audio.pause();
      setMusicOn(false);
      return;
    }
    try {
      await audio.play();
      setMusicOn(true);
    } catch {
      setMusicOn(false);
    }
  };

  const downloadCalendarFile = () => {
    const calendarBlob = new Blob([createNikahCalendarFile()], {
      type: "text/calendar;charset=utf-8",
    });
    const downloadUrl = URL.createObjectURL(calendarBlob);
    const link = document.createElement("a");
    link.href = downloadUrl;
    link.download = "nikah-ceremony-2026-12-13.ics";
    document.body.append(link);
    link.click();
    link.remove();
    window.setTimeout(() => URL.revokeObjectURL(downloadUrl), 1000);
    setCalendarOpen(false);
    calendarButtonRef.current?.focus();
  };

  const closeCalendar = () => {
    setCalendarOpen(false);
    calendarButtonRef.current?.focus();
  };

  return (
    <main
      className={`invitation${opened ? " is-open" : ""}${skipped ? " is-skipping" : ""}${openingComplete ? " is-revealed" : ""}`}
    >
      <div
        className="scroll-progress"
        style={{ transform: `scaleX(${progress / 100})` }}
        aria-hidden="true"
      />

      <section className="envelope-stage" aria-label="Wedding invitation envelope">
        <img src={palaceImage} alt="" className="palace-backdrop" width={1920} height={1088} />
        <div className="palace-wash" />
        <div className="envelope-shell">
          <div className="envelope-grain" />
          <div className="envelope-border" />
          <div className="islamic-corner corner-one" aria-hidden="true">
            ✦
          </div>
          <div className="islamic-corner corner-two" aria-hidden="true">
            ✦
          </div>
          <div className="flap-top">
            <div className="flap-pattern" />
          </div>
          <div className="fold fold-left" />
          <div className="fold fold-right" />
          <div className="fold fold-bottom" />
          <div className="invitation-card" aria-hidden={!opened}>
            <p>Bismillah-ir-Rahman-ir-Raheem</p>
            <span>
              {weddingData.groom} <i>&</i> {weddingData.bride}
            </span>
          </div>
          <div className="seal-wrap">
            <button
              className="wax-seal"
              type="button"
              onClick={openInvitation}
              aria-label="Open Huzaifa and Bismah's invitation"
            >
              <span>
                H <i>&</i> B
              </span>
            </button>
            <h1>
              {weddingData.groom} <i>&</i> {weddingData.bride}
            </h1>
            <button className="tap-open" type="button" onClick={openInvitation}>
              Open your invitation
            </button>
          </div>
          <div className="gold-particles" aria-hidden="true">
            {Array.from({ length: 12 }, (_, index) => (
              <i key={index} />
            ))}
          </div>
          <div className="envelope-petals" aria-hidden="true">
            {Array.from({ length: 5 }, (_, index) => (
              <i key={index} />
            ))}
          </div>
        </div>
      </section>

      {showSkip && (
        <button className="skip-opening" type="button" onClick={skipOpening}>
          <SkipForward aria-hidden="true" />
          Skip animation
        </button>
      )}

      <nav className="site-nav" aria-label="Invitation sections">
        <a href="#dua">Dua</a>
        <span aria-hidden="true">✦</span>
        <a href="#details">Date &amp; venue</a>
      </nav>

      <div className="invitation-pages">
        <section id="welcome" className="palace-hero chapter">
          <img src={palaceImage} alt="" width={1920} height={1088} fetchPriority="high" />
          <div className="hero-overlay" />
          <Reveal className="hero-copy">
            <p className="bismillah arabic-bismillah" lang="ar" dir="rtl">
              بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
            </p>
            <Ornament />
            <p className="hero-blessing">With the blessings of Allah</p>
            <p className="eyebrow">Together with our families</p>
            <p className="request-line">Request the honour of your presence</p>
            <h3 className="hero-event-title">The Nikah Ceremony</h3>
            <h2>
              <span>{weddingData.fullGroom}</span>
              <i>&amp;</i>
              <span>{weddingData.fullBride}</span>
            </h2>
            <a className="hero-link" href="#details">
              View celebration details <span aria-hidden="true">↓</span>
            </a>
          </Reveal>
          <div className="scroll-cue" aria-hidden="true">
            <span>A day made brighter by your duas</span>
            <i />
          </div>
        </section>

        <section id="dua" className="chapter dua-section pattern-section">
          <Reveal className="dua-card">
            <div className="prayer-medallion" aria-hidden="true">
              ☾
            </div>
            <p className="eyebrow">A prayer for our new beginning</p>
            <h2>A heartfelt Dua</h2>
            <Ornament />
            <p className="dua-copy">
              May Allah bless our union with love, mercy, understanding, and everlasting barakah.
              May He fill our home with faith, peace, and happiness.
            </p>
            <strong className="ameen">Ameen</strong>
            <p className="dua-thanks">
              Your duas and presence will make this blessed beginning even more special.
            </p>
          </Reveal>
        </section>

        <section id="details" className="chapter details-section pattern-section">
          <Reveal className="event-card">
            <p className="eyebrow">Request the honour of your presence</p>
            <h2>The Nikah Ceremony</h2>
            <Ornament />
            <div className="event-details">
              <div className="event-detail">
                <CalendarDays aria-hidden="true" />
                <div>
                  <span>Date</span>
                  <strong>{weddingData.date}</strong>
                </div>
              </div>
              <div className="event-detail">
                <CalendarDays aria-hidden="true" />
                <div>
                  <span>Day</span>
                  <strong>{weddingData.day}</strong>
                </div>
              </div>
              <div className="event-detail">
                <Clock3 aria-hidden="true" />
                <div>
                  <span>Time</span>
                  <strong>{weddingData.time}</strong>
                </div>
              </div>
              <div className="event-detail">
                <MapPin aria-hidden="true" />
                <div>
                  <span>Venue</span>
                  <strong>{weddingData.venue}</strong>
                </div>
              </div>
            </div>
            <p className="event-note">We look forward to celebrating with you.</p>
            <a className="back-to-top" href="#welcome">
              {weddingData.fullGroom} &amp; {weddingData.fullBride}
              <span aria-hidden="true">↑</span>
            </a>
          </Reveal>
        </section>
        <Countdown />
      </div>

      <div className="calendar-cta">
        <button
          ref={calendarButtonRef}
          className="add-calendar-button"
          type="button"
          aria-haspopup="dialog"
          aria-expanded={calendarOpen}
          onClick={() => setCalendarOpen(true)}
        >
          <CalendarPlus aria-hidden="true" />
          Add to Calendar
        </button>
      </div>

      {calendarOpen && (
        <div
          className="calendar-dialog-backdrop"
          onClick={(event) => {
            if (event.target === event.currentTarget) closeCalendar();
          }}
        >
          <div
            ref={calendarDialogRef}
            className="calendar-dialog"
            role="dialog"
            aria-modal="true"
            aria-labelledby="calendar-dialog-title"
          >
            <button
              className="calendar-dialog-close"
              type="button"
              onClick={closeCalendar}
              aria-label="Close calendar options"
            >
              <X aria-hidden="true" />
            </button>
            <p className="eyebrow">Save the date</p>
            <h2 id="calendar-dialog-title">Add to Calendar</h2>
            <p className="calendar-event-summary">
              Nikah Ceremony
              <span>
                {weddingData.date} · {weddingData.time}
              </span>
            </p>
            <div className="calendar-options">
              <a
                className="calendar-option"
                href={createGoogleCalendarUrl()}
                target="_blank"
                rel="noreferrer"
                onClick={() => setCalendarOpen(false)}
              >
                <CalendarDays aria-hidden="true" />
                <span>Google Calendar</span>
                <span className="calendar-option-hint">Open</span>
              </a>
              <button className="calendar-option" type="button" onClick={downloadCalendarFile}>
                <CalendarDays aria-hidden="true" />
                <span>Apple Calendar</span>
                <span className="calendar-option-hint">.ics</span>
              </button>
              <button className="calendar-option" type="button" onClick={downloadCalendarFile}>
                <CalendarDays aria-hidden="true" />
                <span>Outlook Calendar</span>
                <span className="calendar-option-hint">.ics</span>
              </button>
              <button className="calendar-option" type="button" onClick={downloadCalendarFile}>
                <CalendarPlus aria-hidden="true" />
                <span>Download Calendar File</span>
                <span className="calendar-option-hint">.ics</span>
              </button>
            </div>
            <p className="calendar-fallback">
              Calendar files use a stable event ID to help prevent duplicates. If the file doesn’t
              open automatically, open it to import the event.
            </p>
          </div>
        </div>
      )}

      <footer className="invitation-footer">
        <p className="footer-message">
          Your presence and prayers will make our special day even more memorable.
        </p>
        <p className="eyebrow">With love and gratitude</p>
        <p className="footer-names">
          {weddingData.fullGroom} <i>&amp;</i> {weddingData.fullBride}
        </p>
        <Ornament />
        <span>With love, duas, and gratitude.</span>
        <a href="#welcome">Back to the invitation ↑</a>
      </footer>

      {opened && (
        <button
          type="button"
          className="music-control"
          onClick={toggleMusic}
          aria-label={musicOn ? "Pause music" : "Play music"}
        >
          {musicOn ? <Pause /> : <Music2 />}
        </button>
      )}
      <audio ref={audioRef} src={weddingData.music} loop preload="none" />
    </main>
  );
}
