import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { ArrowUp, CalendarDays, Clock3, MapPin, Music2, Pause, Sparkles } from "lucide-react";

import palaceImage from "../assets/rose-palace-courtyard.jpg";
import { Button } from "../components/ui/button";

const weddingData = {
  groom: "Huzaifa",
  bride: "Bismah",
  date: "To be announced",
  time: "To be announced",
  venue: "To be announced",
  address: "To be announced",
  mapsLink: "",
  rsvpLink: "",
  groomImage: "/images/groom.jpg",
  brideImage: "/images/bride.jpg",
  music: "/music/wedding.mp3",
};

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Huzaifa & Bismah — Nikkah Invitation" },
      { name: "description", content: "With love and gratitude, Huzaifa and Bismah invite you to celebrate their Nikkah." },
      { property: "og:title", content: "Huzaifa & Bismah — Nikkah Invitation" },
      { property: "og:description", content: "A cinematic Nikkah invitation filled with love, prayers, and blessings." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Ornament({ className = "" }: { className?: string }) {
  return <div className={`ornament ${className}`} aria-hidden="true"><span /><i>✦</i><span /></div>;
}

function Reveal({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        node.classList.add("is-visible");
        observer.disconnect();
      }
    }, { threshold: 0.16 });
    observer.observe(node);
    return () => observer.disconnect();
  }, []);
  return <div ref={ref} className={`reveal ${className}`} style={{ transitionDelay: `${delay}ms` }}>{children}</div>;
}

function ChapterTitle({ eyebrow, title }: { eyebrow?: string; title: string }) {
  return <Reveal className="chapter-heading">{eyebrow && <p className="eyebrow">{eyebrow}</p>}<h2>{title}</h2><Ornament /></Reveal>;
}

function Index() {
  const [opened, setOpened] = useState(false);
  const [musicOn, setMusicOn] = useState(false);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const update = () => {
      const maximum = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(maximum > 0 ? (window.scrollY / maximum) * 100 : 0);
    };
    window.addEventListener("scroll", update, { passive: true });
    update();
    return () => window.removeEventListener("scroll", update);
  }, []);

  const openInvitation = () => {
    if (opened) return;
    setOpened(true);
    window.setTimeout(() => document.getElementById("welcome")?.scrollIntoView({ behavior: "smooth" }), 1700);
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

  const details = [
    { label: "Date", value: weddingData.date, icon: CalendarDays },
    { label: "Time", value: weddingData.time, icon: Clock3 },
    { label: "Venue", value: weddingData.venue, icon: Sparkles },
    { label: "Location", value: weddingData.address, icon: MapPin },
  ];

  return (
    <main className={opened ? "invitation is-open" : "invitation"}>
      <div className="scroll-progress" style={{ transform: `scaleX(${progress / 100})` }} aria-hidden="true" />
      <section className="envelope-stage" aria-label="Wedding invitation envelope">
        <img src={palaceImage} alt="Ivory palace courtyard with a marble fountain at blush sunset" className="palace-backdrop" width={1920} height={1088} />
        <div className="palace-wash" />
        <div className="envelope-shell">
          <div className="envelope-grain" />
          <div className="envelope-border" />
          <div className="islamic-corner corner-one">✦</div>
          <div className="islamic-corner corner-two">✦</div>
          <div className="flap-top"><div className="flap-pattern" /></div>
          <div className="fold fold-left" />
          <div className="fold fold-right" />
          <div className="fold fold-bottom" />
          <div className="invitation-card" aria-hidden={!opened}>
            <p>Bismillah-ir-Rahman-ir-Raheem</p>
            <span>Huzaifa <i>&</i> Bismah</span>
          </div>
          <div className="seal-wrap">
            <button className="wax-seal" type="button" onClick={openInvitation} aria-label="Open Huzaifa and Bismah's invitation">
              <span>H <i>&</i> B</span>
            </button>
            <h1>Huzaifa <i>&</i> Bismah</h1>
            <button className="tap-open" type="button" onClick={openInvitation}>Tap to Open</button>
          </div>
          <div className="gold-particles" aria-hidden="true">{Array.from({ length: 12 }, (_, index) => <i key={index} />)}</div>
        </div>
      </section>

      <div className="invitation-pages">
        <section id="welcome" className="palace-hero chapter">
          <img src={palaceImage} alt="Royal ivory palace and fountain illuminated at dusk" width={1920} height={1088} />
          <div className="hero-overlay" />
          <Reveal className="hero-copy">
            <p className="bismillah">Bismillah-ir-Rahman-ir-Raheem</p>
            <Ornament />
            <blockquote>“And We created you in pairs.”</blockquote>
            <h2><span>{weddingData.groom}</span><i>&</i><span>{weddingData.bride}</span></h2>
            <p className="invite-line">Together with their families, invite you to celebrate their Nikkah.</p>
          </Reveal>
          <div className="scroll-cue" aria-hidden="true"><span>Discover our story</span><i /></div>
        </section>

        <section className="chapter gratitude-section petal-field">
          <div className="arch-frame arch-frame-wide">
            <ChapterTitle eyebrow="A new chapter" title="With Love & Gratitude" />
            <Reveal className="prose-block">
              <p>With the blessings of Allah and the love of our families, we begin a beautiful new chapter together.</p>
              <p>Your presence, prayers, and blessings would mean the world to us.</p>
            </Reveal>
          </div>
          {Array.from({ length: 8 }, (_, index) => <i className={`petal petal-${index + 1}`} key={index} />)}
        </section>

        <section className="chapter couple-section">
          <ChapterTitle eyebrow="Two souls, one promise" title="The Couple" />
          <div className="couple-grid">
            <Reveal className="portrait-card groom-card">
              <div className="portrait-placeholder" role="img" aria-label="Decorative placeholder for Huzaifa's portrait"><span className="portrait-initial">H</span><span className="portrait-flower flower-left">❀</span></div>
              <h3>{weddingData.groom}</h3><p>The Groom</p>
            </Reveal>
            <Reveal className="couple-ampersand" delay={120}><span>&</span></Reveal>
            <Reveal className="portrait-card bride-card" delay={220}>
              <div className="portrait-placeholder" role="img" aria-label="Decorative placeholder for Bismah's portrait"><span className="portrait-initial">B</span><span className="portrait-flower flower-right">❀</span></div>
              <h3>{weddingData.bride}</h3><p>The Bride</p>
            </Reveal>
          </div>
        </section>

        <section className="chapter journey-section">
          <ChapterTitle eyebrow="Written with grace" title="Our Journey" />
          <div className="timeline">
            <div className="timeline-line" />
            {[
              ["A Beautiful Beginning", "A journey that brought two hearts closer."],
              ["A Promise", "Two families, two hearts, one beautiful future."],
              ["The Nikkah", "A new chapter begins with the blessings of Allah."],
            ].map(([title, text], index) => (
              <Reveal className={`timeline-item item-${index + 1}`} key={title} delay={index * 100}>
                <div className="timeline-dot">✦</div><div className="timeline-copy"><span>0{index + 1}</span><h3>{title}</h3><p>{text}</p></div>
              </Reveal>
            ))}
          </div>
        </section>

        <section className="chapter details-section pattern-section">
          <ChapterTitle eyebrow="Save the moment" title="The Nikkah" />
          <div className="details-grid">
            {details.map(({ label, value, icon: Icon }, index) => <Reveal className="detail-card" key={label} delay={index * 80}><Icon /><span>{label}</span><strong>{value}</strong></Reveal>)}
          </div>
        </section>

        <section className="chapter countdown-section">
          <div className="countdown-inner">
            <ChapterTitle eyebrow="Awaiting the blessed day" title="Counting Down to Our Special Day" />
            {weddingData.date === "To be announced" ? (
              <Reveal className="date-pending"><CalendarDays /><p>Date to be announced</p></Reveal>
            ) : (
              <div className="countdown-grid">{["Days", "Hours", "Minutes", "Seconds"].map((unit) => <div key={unit}><strong>00</strong><span>{unit}</span></div>)}</div>
            )}
          </div>
        </section>

        <section className="chapter quotes-section">
          <ChapterTitle eyebrow="Words for the heart" title="Blessings Along The Way" />
          <div className="quotes-stack">
            {[
              "May Allah place love, mercy and barakah in their journey together.",
              "Two hearts, one beautiful journey, written by Allah.",
              "May their home always be filled with faith, love, peace and barakah.",
            ].map((quote, index) => <Reveal className="quote-card" key={quote} delay={index * 100}><span>“</span><p>{quote}</p></Reveal>)}
          </div>
        </section>

        <section className="chapter dua-section pattern-section">
          <div className="prayer-medallion">✦</div>
          <ChapterTitle eyebrow="With faithful hearts" title="A Dua For Our Journey" />
          <Reveal className="dua-copy"><p>May Allah bless this union with love, mercy, happiness and endless barakah.</p><strong>Ameen.</strong></Reveal>
        </section>

        <section className="chapter venue-section">
          <div className="venue-visual"><img src={palaceImage} alt="Palace courtyard prepared for a Nikkah celebration" loading="lazy" width={1920} height={1088} /></div>
          <div className="venue-content">
            <ChapterTitle eyebrow="Celebrate with us" title="Join Us" />
            <div className="venue-list">{details.map(({ label, value }) => <div key={label}><span>{label}</span><strong>{value}</strong></div>)}</div>
            <Button variant="invitationOutline" size="lg" disabled={!weddingData.mapsLink} onClick={() => weddingData.mapsLink && window.open(weddingData.mapsLink, "_blank")}><MapPin />View Location</Button>
          </div>
        </section>

        <section className="chapter rsvp-section">
          <Reveal className="rsvp-content">
            <p className="eyebrow">Your blessings are our gift</p>
            <h2>We Would Be Honored<br />By Your Presence</h2>
            <Ornament />
            <p>Your presence and prayers would make our special day even more meaningful.</p>
            <Button variant="invitation" size="lg" disabled={!weddingData.rsvpLink} onClick={() => weddingData.rsvpLink && window.open(weddingData.rsvpLink, "_blank")}>RSVP</Button>
            {!weddingData.rsvpLink && <small>RSVP details will be shared soon</small>}
          </Reveal>
        </section>

        <section className="chapter final-love-section petal-field">
          <Reveal className="final-love-copy"><p>Two hearts, one promise,<br />a lifetime together.</p><Ornament /><h2>{weddingData.groom} <i>&</i> {weddingData.bride}</h2></Reveal>
          {Array.from({ length: 6 }, (_, index) => <i className={`petal petal-${index + 1}`} key={index} />)}
        </section>

        <section className="chapter final-dua-section pattern-section">
          <Reveal className="final-dua-copy"><div className="crescent">☾</div><p>May Allah bless their marriage with endless love, understanding, happiness and barakah.</p><h2>Ameen</h2></Reveal>
        </section>

        <section className="chapter thank-you-section">
          <Reveal className="thank-you-copy"><p className="eyebrow">With love & duas</p><h2>Thank You</h2><Ornament /><p>Thank you for being a part of our special day.</p><h3>{weddingData.groom} <i>&</i> {weddingData.bride}</h3><Button variant="invitationOutline" size="icon" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} aria-label="Back to top"><ArrowUp /></Button></Reveal>
        </section>

        <footer><p>{weddingData.groom} <i>&</i> {weddingData.bride}</p><Ornament /><span>Our Nikkah • Our Beginning • Our Forever</span></footer>
      </div>

      {opened && <Button variant="invitationOutline" size="icon" className="music-control" onClick={toggleMusic} aria-label={musicOn ? "Pause music" : "Play music"}>{musicOn ? <Pause /> : <Music2 />}</Button>}
      <audio ref={audioRef} src={weddingData.music} loop preload="none" />
    </main>
  );
}
