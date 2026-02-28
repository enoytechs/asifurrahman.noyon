import { useState, useEffect, useRef, useCallback } from "react";

/* ============================================================
GLOBAL STYLES injected into <head>
============================================================ */
const GlobalStyle = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;1,9..40,300&display=swap');

    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    :root {
      --em: #10b981;
      --em-light: #34d399;
      --em-dark: #059669;
      --em-bg: #ecfdf5;
      --black: #0a0a0a;
      --gray-900: #111827;
      --gray-800: #1f2937;
      --gray-600: #4b5563;
      --gray-400: #9ca3af;
      --gray-100: #f3f4f6;
      --gray-50: #f9fafb;
      --white: #ffffff;
    }

    html { scroll-behavior: smooth; }

    body {
      font-family: 'DM Sans', sans-serif;
      background: var(--white);
      color: var(--black);
      overflow-x: hidden;
      cursor: none;
    }

    h1,h2,h3,h4,h5 { font-family: 'Syne', sans-serif; }

    /* ---- Scrollbar ---- */
    ::-webkit-scrollbar { width: 5px; }
    ::-webkit-scrollbar-track { background: #f1f1f1; }
    ::-webkit-scrollbar-thumb { background: var(--em); border-radius: 10px; }

    /* ---- Custom Cursor ---- */
    .cursor-dot {
      width: 8px; height: 8px;
      background: var(--em);
      border-radius: 50%;
      position: fixed;
      pointer-events: none;
      z-index: 9999;
      transition: transform 0.1s ease;
      mix-blend-mode: normal;
    }
    .cursor-ring {
      width: 36px; height: 36px;
      border: 1.5px solid var(--em);
      border-radius: 50%;
      position: fixed;
      pointer-events: none;
      z-index: 9998;
      transition: transform 0.2s ease, border-color 0.2s ease, width 0.2s ease, height 0.2s ease;
    }
    .cursor-ring.hovering {
      width: 56px; height: 56px;
      border-color: var(--em-light);
      background: rgba(16,185,129,0.06);
    }
    @media (max-width: 768px) {
      .cursor-dot, .cursor-ring { display: none; }
      body { cursor: auto; }
    }

    /* ---- Reveal animation ---- */
    .reveal {
      opacity: 0;
      transform: translateY(32px);
      transition: opacity 0.7s cubic-bezier(0.16,1,0.3,1), transform 0.7s cubic-bezier(0.16,1,0.3,1);
    }
    .reveal.visible { opacity: 1; transform: translateY(0); }
    .reveal-left { opacity: 0; transform: translateX(-32px); transition: opacity 0.7s cubic-bezier(0.16,1,0.3,1), transform 0.7s cubic-bezier(0.16,1,0.3,1); }
    .reveal-left.visible { opacity: 1; transform: translateX(0); }
    .reveal-right { opacity: 0; transform: translateX(32px); transition: opacity 0.7s cubic-bezier(0.16,1,0.3,1), transform 0.7s cubic-bezier(0.16,1,0.3,1); }
    .reveal-right.visible { opacity: 1; transform: translateX(0); }
    .d1 { transition-delay: 0.1s; }
    .d2 { transition-delay: 0.2s; }
    .d3 { transition-delay: 0.3s; }
    .d4 { transition-delay: 0.4s; }
    .d5 { transition-delay: 0.5s; }
    .d6 { transition-delay: 0.6s; }

    /* ---- Floating animation ---- */
    @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-14px)} }
    @keyframes float2 { 0%,100%{transform:translateY(0) rotate(0deg)} 50%{transform:translateY(-10px) rotate(3deg)} }
    @keyframes spin-slow { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
    @keyframes spin-reverse { from{transform:rotate(360deg)} to{transform:rotate(0deg)} }
    @keyframes pulse-green { 0%,100%{box-shadow:0 0 0 0 rgba(16,185,129,0.45)} 50%{box-shadow:0 0 0 16px rgba(16,185,129,0)} }
    @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }
    @keyframes shimmer { 0%{background-position:-200% 0} 100%{background-position:200% 0} }
    @keyframes gradient-shift { 0%{background-position:0% 50%} 50%{background-position:100% 50%} 100%{background-position:0% 50%} }
    @keyframes ripple { 0%{transform:scale(0.8);opacity:1} 100%{transform:scale(2.4);opacity:0} }
    @keyframes slide-in-up { 0%{opacity:0;transform:translateY(20px)} 100%{opacity:1;transform:translateY(0)} }
    @keyframes bounce-x { 0%,100%{transform:translateX(0)} 50%{transform:translateX(5px)} }
    @keyframes glow-pulse { 0%,100%{filter:drop-shadow(0 0 8px rgba(16,185,129,0.3))} 50%{filter:drop-shadow(0 0 20px rgba(16,185,129,0.6))} }
    @keyframes count-up { from{opacity:0;transform:scale(0.5)} to{opacity:1;transform:scale(1)} }
    @keyframes noise {
      0%,100%{clip-path: inset(0 0 98% 0)}
      10%{clip-path: inset(20% 0 60% 0)}
      20%{clip-path: inset(50% 0 30% 0)}
      30%{clip-path: inset(10% 0 85% 0)}
      40%{clip-path: inset(70% 0 5% 0)}
      50%{clip-path: inset(40% 0 45% 0)}
      60%{clip-path: inset(80% 0 10% 0)}
      70%{clip-path: inset(15% 0 75% 0)}
      80%{clip-path: inset(55% 0 25% 0)}
      90%{clip-path: inset(5% 0 90% 0)}
    }

    .float-1 { animation: float 6s ease-in-out infinite; }
    .float-2 { animation: float 8s ease-in-out infinite 1s; }
    .float-3 { animation: float2 7s ease-in-out infinite 0.5s; }
    .spin-slow { animation: spin-slow 25s linear infinite; }
    .spin-reverse { animation: spin-reverse 18s linear infinite; }
    .blink-cursor { animation: blink 0.8s step-end infinite; }
    .bounce-x { animation: bounce-x 1.5s ease-in-out infinite; }
    .glow-pulse { animation: glow-pulse 2.5s ease-in-out infinite; }
    .wa-pulse { animation: pulse-green 2s ease-in-out infinite; }

    /* ---- Gradient text ---- */
    .grad-text {
      background: linear-gradient(135deg, var(--em-dark) 0%, var(--em-light) 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }
    .grad-text-dark {
      background: linear-gradient(135deg, #0a0a0a 0%, #374151 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }
    .animated-gradient {
      background: linear-gradient(270deg, var(--em), var(--em-light), #0ea5e9, var(--em));
      background-size: 400% 400%;
      animation: gradient-shift 4s ease infinite;
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    /* ---- Nav link underline ---- */
    .nav-link { position: relative; }
    .nav-link::after {
      content: '';
      position: absolute;
      bottom: -3px; left: 0;
      width: 0; height: 2px;
      background: var(--em);
      transition: width 0.3s ease;
      border-radius: 2px;
    }
    .nav-link:hover::after, .nav-link.active::after { width: 100%; }

    /* ---- Card hover lift ---- */
    .card-lift {
      transition: transform 0.35s cubic-bezier(0.16,1,0.3,1), box-shadow 0.35s cubic-bezier(0.16,1,0.3,1);
    }
    .card-lift:hover { transform: translateY(-8px); box-shadow: 0 24px 64px rgba(0,0,0,0.12); }

    /* ---- Service card border ---- */
    .svc-card { position: relative; overflow: hidden; }
    .svc-card::before {
      content: '';
      position: absolute; top: 0; left: 0; right: 0;
      height: 3px;
      background: linear-gradient(90deg, var(--em), var(--em-light));
      transform: scaleX(0); transform-origin: left;
      transition: transform 0.4s cubic-bezier(0.16,1,0.3,1);
      z-index: 1;
    }
    .svc-card:hover::before { transform: scaleX(1); }

    /* ---- Portfolio overlay ---- */
    .port-card .port-overlay {
      transition: opacity 0.35s ease;
      opacity: 0;
    }
    .port-card:hover .port-overlay { opacity: 1; }

    /* ---- Shimmer button ---- */
    .btn-shimmer {
      position: relative;
      overflow: hidden;
    }
    .btn-shimmer::after {
      content: '';
      position: absolute;
      top: -50%; left: -60%;
      width: 40%; height: 200%;
      background: rgba(255,255,255,0.18);
      transform: skewX(-20deg);
      transition: left 0.6s ease;
    }
    .btn-shimmer:hover::after { left: 130%; }

    /* ---- WhatsApp button ---- */
    .wa-btn {
      position: fixed;
      bottom: 28px; right: 28px;
      z-index: 1000;
      display: flex; align-items: center; gap: 10px;
      background: #25D366;
      color: white;
      border-radius: 50px;
      padding: 14px 20px 14px 16px;
      font-family: 'DM Sans', sans-serif;
      font-weight: 500;
      font-size: 14px;
      text-decoration: none;
      box-shadow: 0 8px 32px rgba(37,211,102,0.4);
      transition: transform 0.3s cubic-bezier(0.16,1,0.3,1), box-shadow 0.3s ease, padding 0.3s ease;
      cursor: pointer;
      border: none;
      overflow: hidden;
      white-space: nowrap;
      max-width: 60px;
    }
    .wa-btn:hover {
      transform: translateY(-4px) scale(1.04);
      box-shadow: 0 16px 48px rgba(37,211,102,0.5);
      max-width: 260px;
      padding: 14px 20px 14px 16px;
    }
    .wa-btn .wa-label {
      opacity: 0;
      max-width: 0;
      overflow: hidden;
      transition: opacity 0.3s ease 0.1s, max-width 0.3s ease;
      white-space: nowrap;
    }
    .wa-btn:hover .wa-label {
      opacity: 1;
      max-width: 200px;
    }
    .wa-ripple {
      position: absolute;
      width: 100%; height: 100%;
      border-radius: 50%;
      background: rgba(255,255,255,0.3);
      animation: ripple 2s ease-out infinite;
      top: 0; left: 0;
    }

    /* ---- Code line reveal ---- */
    .code-line {
      display: block;
      opacity: 0;
      transform: translateX(-10px);
      transition: opacity 0.3s ease, transform 0.3s ease;
    }
    .code-line.show { opacity: 1; transform: translateX(0); }

    /* ---- Stat number ---- */
    .stat-box { animation: count-up 0.6s cubic-bezier(0.16,1,0.3,1) both; }

    /* ---- Step line connector ---- */
    .step-connector::after {
      content: '';
      position: absolute;
      top: 22px; left: calc(50% + 28px);
      width: calc(100% - 56px);
      height: 1px;
      background: linear-gradient(90deg, var(--em), transparent);
    }

    /* ---- Glitch effect on hero name ---- */
    .glitch {
      position: relative;
    }
    .glitch::before, .glitch::after {
      content: attr(data-text);
      position: absolute;
      top: 0; left: 0;
      width: 100%; height: 100%;
      font-family: inherit;
      font-size: inherit;
      font-weight: inherit;
      background: inherit;
      -webkit-background-clip: text;
      background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    .glitch::before {
      animation: noise 4s infinite linear alternate-reverse;
      clip-path: inset(0 0 100% 0);
      color: var(--em-light);
      -webkit-text-fill-color: var(--em-light);
      background: none;
      left: 2px;
    }
    .glitch::after {
      animation: noise 3s 0.5s infinite linear alternate;
      clip-path: inset(0 0 100% 0);
      color: #0ea5e9;
      -webkit-text-fill-color: #0ea5e9;
      background: none;
      left: -2px;
    }

    /* ---- Noise texture overlay ---- */
    .noise-overlay {
      position: fixed; inset: 0;
      background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E");
      pointer-events: none; z-index: 9997;
    }

    /* ---- Progress bar ---- */
    .skill-bar-fill {
      height: 100%;
      background: linear-gradient(90deg, var(--em-dark), var(--em-light));
      border-radius: inherit;
      transition: width 1.2s cubic-bezier(0.16,1,0.3,1);
      width: 0;
    }
    .skill-bar-fill.animate { width: var(--target-width); }

    /* ---- Testimonial card ---- */
    .testi-card { border-left: 4px solid var(--em); }

    /* ---- Mobile menu ---- */
    .mobile-menu-overlay {
      position: fixed; inset: 0;
      background: rgba(0,0,0,0.4);
      backdrop-filter: blur(4px);
      z-index: 48;
      opacity: 0; pointer-events: none;
      transition: opacity 0.3s ease;
    }
    .mobile-menu-overlay.open { opacity: 1; pointer-events: all; }
    .mobile-menu-panel {
      position: fixed; top: 0; right: 0;
      width: 80%; max-width: 320px;
      height: 100%;
      background: var(--black);
      z-index: 49;
      transform: translateX(100%);
      transition: transform 0.4s cubic-bezier(0.16,1,0.3,1);
      display: flex; flex-direction: column;
      padding: 2rem;
    }
    .mobile-menu-panel.open { transform: translateX(0); }

    /* ---- Form inputs ---- */
    .form-input {
      width: 100%;
      background: #f9fafb;
      border: 1.5px solid #e5e7eb;
      border-radius: 12px;
      padding: 12px 16px;
      font-family: 'DM Sans', sans-serif;
      font-size: 14px;
      color: var(--black);
      transition: border-color 0.2s, box-shadow 0.2s, background 0.2s;
      outline: none;
    }
    .form-input:focus {
      border-color: var(--em);
      box-shadow: 0 0 0 3px rgba(16,185,129,0.1);
      background: white;
    }
    .form-input::placeholder { color: #9ca3af; }

    /* ---- Section divider ---- */
    .section-tag {
      display: inline-flex; align-items: center; gap: 8px;
      background: #ecfdf5; border: 1px solid #d1fae5;
      border-radius: 100px; padding: 5px 14px;
      font-size: 12px; font-weight: 500;
      color: #047857; font-family: 'DM Sans', sans-serif;
      margin-bottom: 16px;
    }

    /* ---- Hero mesh ---- */
    .hero-mesh {
      background:
        radial-gradient(ellipse at 75% 40%, rgba(16,185,129,0.07) 0%, transparent 55%),
        radial-gradient(ellipse at 25% 80%, rgba(5,150,105,0.05) 0%, transparent 50%),
        white;
    }

    /* ---- Stripe bg ---- */
    .stripe-bg {
      background-image: repeating-linear-gradient(
        -45deg, transparent, transparent 12px,
        rgba(16,185,129,0.025) 12px, rgba(16,185,129,0.025) 24px
      );
    }

    /* ---- Marquee (skills ticker) ---- */
    @keyframes marquee { from{transform:translateX(0)} to{transform:translateX(-50%)} }
    .marquee-track { animation: marquee 20s linear infinite; display: flex; width: max-content; }
    .marquee-track:hover { animation-play-state: paused; }

    /* ---- Portfolio filter ---- */
    .filter-btn { transition: all 0.2s ease; }
    .filter-btn.active {
      background: var(--black);
      color: white;
    }

    /* ---- Contact glow ---- */
    .wa-contact-btn { animation: pulse-green 2.5s ease-in-out infinite; }

    @media (prefers-reduced-motion: reduce) {
      *, *::before, *::after { animation-duration: 0.01ms !important; transition-duration: 0.01ms !important; }
    }
  `}</style>
);

/* ============================================================
JSON-LD STRUCTURED DATA — Google Knowledge Panel SEO
============================================================ */
const StructuredData = () => (
  <>
    {/* Person schema with sameAs — tells Google who you are across the web */}
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Person",
          name: "Asifurrahman Noyon",
          alternateName: ["Asifur Rahman Noyon", "Noyon"],
          description:
            "Web Developer, Android App Developer, SEO Strategist, and Branding & Packaging Designer based in Dubai, UAE — working with clients worldwide.",
          url: "https://asifurrahmannoyon.com",
          email: "asifurrahman.noyon@gmail.com",
          telephone: "+971545261933",
          jobTitle: "Web Developer & Brand Specialist",
          knowsAbout: [
            "Web Development",
            "React",
            "WordPress",
            "E-Commerce",
            "Android App Development",
            "SEO Strategy",
            "Local SEO",
            "Google Business Profile",
            "Branding Design",
            "Packaging Design",
            "UI/UX Design",
            "Digital Marketing",
          ],
          address: {
            "@type": "PostalAddress",
            addressLocality: "Dubai",
            addressCountry: "AE",
          },
          areaServed: [
            "Worldwide",
            "UAE",
            "Dubai",
            "Saudi Arabia",
            "United Kingdom",
            "United States",
          ],
          image: "https://asifurrahmannoyon.com/photo.jpg",
          sameAs: [
            "https://www.linkedin.com/in/asifurrahman-noyon-9a9baa37a",
            "https://www.instagram.com/asifurrahman_noyon/",
            "https://www.facebook.com/share/1C8h7vCvHz/",
            "https://wa.me/971545261933",
            "mailto:asifurrahman.noyon@gmail.com",
          ],
        }),
      }}
    />

    {/* WebSite schema — enables Google Sitelinks search */}
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebSite",
          name: "Asifurrahman Noyon — Portfolio",
          url: "https://asifurrahmannoyon.com",
          author: { "@type": "Person", name: "Asifurrahman Noyon" },
        }),
      }}
    />

    {/* ProfessionalService schema — helps Google show your services */}
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "ProfessionalService",
          name: "Asifurrahman Noyon — Web & Brand Services",
          description:
            "Professional web development, branding, packaging design, SEO and Android app development for businesses worldwide.",
          url: "https://asifurrahmannoyon.com",
          email: "asifurrahman.noyon@gmail.com",
          telephone: "+971545261933",
          founder: { "@type": "Person", name: "Asifurrahman Noyon" },
          address: {
            "@type": "PostalAddress",
            addressLocality: "Dubai",
            addressCountry: "AE",
          },
          areaServed: "Worldwide",
          serviceType: [
            "Web Development",
            "Branding",
            "Packaging Design",
            "SEO",
            "Android App Development",
          ],
          priceRange: "$49 - $399",
        }),
      }}
    />

    {/* rel=me links for social verification — Google uses these to connect profiles */}
    <link
      rel="me"
      href="https://www.linkedin.com/in/asifurrahman-noyon-9a9baa37a"
    />
    <link rel="me" href="https://www.instagram.com/asifurrahman_noyon/" />
    <link rel="me" href="https://www.facebook.com/share/1C8h7vCvHz/" />
    <link rel="me" href="mailto:asifurrahman.noyon@gmail.com" />

    {/* Canonical + Open Graph meta for Google to index correctly */}
    <meta
      property="og:title"
      content="Asifurrahman Noyon | Web Developer, SEO Expert & Brand Designer"
    />
    <meta
      property="og:description"
      content="Web Developer, SEO Strategist & Brand Designer based in Dubai, UAE — working with clients worldwide. Book a free consultation."
    />
    <meta property="og:type" content="profile" />
    <meta property="og:url" content="https://asifurrahmannoyon.com" />
    <meta property="profile:first_name" content="Asifurrahman" />
    <meta property="profile:last_name" content="Noyon" />
    <meta property="profile:username" content="asifurrahman_noyon" />
    <meta name="author" content="Asifurrahman Noyon" />
    <meta
      name="description"
      content="Asifurrahman Noyon — Web Developer, SEO Strategist, and Brand Designer in Dubai, UAE. Specializing in web development, branding, packaging design, SEO, and Android apps for clients worldwide."
    />
    <title>
      Asifurrahman Noyon | Web Developer · SEO Expert · Brand Designer — Dubai,
      UAE
    </title>
  </>
);

function useReveal() {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add("visible");
          obs.disconnect();
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return ref;
}

function useTyping(words, speed = 110, deleteSpeed = 60, pause = 2000) {
  const [display, setDisplay] = useState("");
  const [wordIdx, setWordIdx] = useState(0);
  const [charIdx, setCharIdx] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const word = words[wordIdx];
    let timeout;
    if (!deleting) {
      if (charIdx < word.length) {
        timeout = setTimeout(() => setCharIdx((c) => c + 1), speed);
      } else {
        timeout = setTimeout(() => setDeleting(true), pause);
      }
    } else {
      if (charIdx > 0) {
        timeout = setTimeout(() => setCharIdx((c) => c - 1), deleteSpeed);
      } else {
        setDeleting(false);
        setWordIdx((i) => (i + 1) % words.length);
      }
    }
    setDisplay(word.slice(0, charIdx));
    return () => clearTimeout(timeout);
  }, [charIdx, deleting, wordIdx, words, speed, deleteSpeed, pause]);

  return display;
}

function useCounter(target, duration = 1500) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          let start = 0;
          const step = target / (duration / 16);
          const timer = setInterval(() => {
            start += step;
            if (start >= target) {
              setCount(target);
              clearInterval(timer);
            } else setCount(Math.floor(start));
          }, 16);
          obs.disconnect();
        }
      },
      { threshold: 0.5 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [target, duration]);
  return [count, ref];
}

/* ============================================================
COMPONENTS
============================================================ */

// Custom Cursor
function Cursor() {
  const dotRef = useRef(null);
  const ringRef = useRef(null);
  const mouse = useRef({ x: 0, y: 0 });
  const ring = useRef({ x: 0, y: 0 });
  const rafRef = useRef(null);

  useEffect(() => {
    const onMove = (e) => {
      mouse.current = { x: e.clientX, y: e.clientY };
      if (dotRef.current) {
        dotRef.current.style.left = e.clientX - 4 + "px";
        dotRef.current.style.top = e.clientY - 4 + "px";
      }
    };
    const animate = () => {
      ring.current.x += (mouse.current.x - ring.current.x - 18) * 0.13;
      ring.current.y += (mouse.current.y - ring.current.y - 18) * 0.13;
      if (ringRef.current) {
        ringRef.current.style.left = ring.current.x + "px";
        ringRef.current.style.top = ring.current.y + "px";
      }
      rafRef.current = requestAnimationFrame(animate);
    };
    const onEnter = () => ringRef.current?.classList.add("hovering");
    const onLeave = () => ringRef.current?.classList.remove("hovering");
    document.addEventListener("mousemove", onMove);
    rafRef.current = requestAnimationFrame(animate);
    document
      .querySelectorAll("a,button,.card-lift,.port-card")
      .forEach((el) => {
        el.addEventListener("mouseenter", onEnter);
        el.addEventListener("mouseleave", onLeave);
      });
    return () => {
      document.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <>
      <div ref={dotRef} className="cursor-dot" />
      <div ref={ringRef} className="cursor-ring" />
    </>
  );
}

// WhatsApp Floating Button
function WhatsAppFloat() {
  const phone = "971545261933";
  const msg = encodeURIComponent(
    "Hi Noyon! I found your portfolio and I’d like to discuss my project."
  );
  return (
    <a
      href={`https://wa.me/${phone}?text=${msg}`}
      target="_blank"
      rel="noopener noreferrer"
      className="wa-btn wa-pulse"
      aria-label="Chat on WhatsApp"
    >
      <svg
        width="26"
        height="26"
        viewBox="0 0 24 24"
        fill="white"
        style={{ flexShrink: 0 }}
      >
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
      </svg>
      <span className="wa-label">+971 54 526 1933</span>
    </a>
  );
}

// Navbar
function Navbar({ active }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
  }, [menuOpen]);

  const links = [
    "About",
    "Services",
    "Portfolio",
    "Pricing",
    "Testimonials",
    "Contact",
  ];

  const scrollTo = (id) => {
    const el = document.getElementById(id.toLowerCase());
    if (el) el.scrollIntoView({ behavior: "smooth" });
    setMenuOpen(false);
  };

  return (
    <>
      <header
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 50,
          background: scrolled ? "rgba(255,255,255,0.92)" : "transparent",
          backdropFilter: scrolled ? "blur(16px)" : "none",
          borderBottom: scrolled ? "1px solid #f3f4f6" : "none",
          transition: "all 0.3s ease",
          boxShadow: scrolled ? "0 1px 20px rgba(0,0,0,0.06)" : "none",
        }}
      >
        <nav
          style={{
            maxWidth: 1280,
            margin: "0 auto",
            padding: "0 24px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            height: 68,
          }}
        >
          {/* Logo */}
          <a
            href="#home"
            onClick={(e) => {
              e.preventDefault();
              scrollTo("home");
            }}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              textDecoration: "none",
              color: "inherit",
            }}
          >
            <div
              style={{
                width: 36,
                height: 36,
                background: "var(–black)",
                borderRadius: 10,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "background 0.3s ease",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.background = "var(–em)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.background = "var(–black)")
              }
            >
              <span
                style={{
                  color: "white",
                  fontFamily: "Syne",
                  fontWeight: 800,
                  fontSize: 16,
                }}
              >
                N
              </span>
            </div>
            <div>
              <div
                style={{
                  fontFamily: "Syne",
                  fontWeight: 700,
                  fontSize: 15,
                  lineHeight: 1.1,
                }}
              >
                Asifurrahman
              </div>
              <div
                style={{
                  fontSize: 11,
                  color: "var(–gray-400)",
                  lineHeight: 1,
                  fontFamily: "DM Sans",
                }}
              >
                Noyon · Worldwide
              </div>
            </div>
          </a>

          {/* Desktop links */}
          <div
            style={{ display: "flex", alignItems: "center", gap: 32 }}
            className="desktop-nav"
          >
            {links.map((l) => (
              <button
                key={l}
                onClick={() => scrollTo(l.toLowerCase())}
                className={`nav-link ${
                  active === l.toLowerCase() ? "active" : ""
                }`}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  fontFamily: "DM Sans",
                  fontSize: 14,
                  color: "var(--gray-600)",
                  padding: "4px 0",
                  transition: "color 0.2s",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.color = "var(--black)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.color =
                    active === l.toLowerCase()
                      ? "var(--black)"
                      : "var(--gray-600)")
                }
              >
                {l}
              </button>
            ))}
            <button
              onClick={() => scrollTo("contact")}
              className="btn-shimmer"
              style={{
                background: "var(--em)",
                color: "white",
                border: "none",
                padding: "10px 20px",
                borderRadius: 10,
                fontFamily: "DM Sans",
                fontWeight: 500,
                fontSize: 14,
                cursor: "pointer",
                transition: "background 0.2s,box-shadow 0.2s",
                boxShadow: "0 4px 14px rgba(16,185,129,0.3)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "var(--em-dark)";
                e.currentTarget.style.boxShadow =
                  "0 8px 24px rgba(16,185,129,0.4)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "var(--em)";
                e.currentTarget.style.boxShadow =
                  "0 4px 14px rgba(16,185,129,0.3)";
              }}
            >
              Book Consultation
            </button>
          </div>

          {/* Hamburger */}
          <button
            onClick={() => setMenuOpen((o) => !o)}
            style={{
              display: "none",
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: 8,
              borderRadius: 8,
            }}
            className="hamburger"
            aria-label="Menu"
          >
            <div
              style={{
                width: 22,
                display: "flex",
                flexDirection: "column",
                gap: 5,
              }}
            >
              <span
                style={{
                  height: 2,
                  background: "var(--black)",
                  borderRadius: 2,
                  display: "block",
                  transform: menuOpen
                    ? "rotate(45deg) translate(5px,5px)"
                    : "none",
                  transition: "transform 0.3s",
                }}
              />
              <span
                style={{
                  height: 2,
                  background: "var(--black)",
                  borderRadius: 2,
                  display: "block",
                  opacity: menuOpen ? 0 : 1,
                  transition: "opacity 0.3s",
                }}
              />
              <span
                style={{
                  height: 2,
                  background: "var(--black)",
                  borderRadius: 2,
                  display: "block",
                  transform: menuOpen
                    ? "rotate(-45deg) translate(5px,-5px)"
                    : "none",
                  transition: "transform 0.3s",
                }}
              />
            </div>
          </button>
        </nav>
      </header>

      {/* Mobile drawer */}
      <div
        className={`mobile-menu-overlay ${menuOpen ? "open" : ""}`}
        onClick={() => setMenuOpen(false)}
      />
      <div className={`mobile-menu-panel ${menuOpen ? "open" : ""}`}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 40,
          }}
        >
          <span
            style={{
              fontFamily: "Syne",
              fontWeight: 800,
              color: "white",
              fontSize: 18,
            }}
          >
            Menu
          </span>
          <button
            onClick={() => setMenuOpen(false)}
            style={{
              background: "rgba(255,255,255,0.1)",
              border: "none",
              borderRadius: 8,
              width: 36,
              height: 36,
              cursor: "pointer",
              color: "white",
              fontSize: 18,
            }}
          >
            ✕
          </button>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {links.map((l, i) => (
            <button
              key={l}
              onClick={() => scrollTo(l.toLowerCase())}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                fontFamily: "Syne",
                fontWeight: 600,
                fontSize: 22,
                color: "rgba(255,255,255,0.7)",
                textAlign: "left",
                padding: "10px 0",
                borderBottom: "1px solid rgba(255,255,255,0.08)",
                transition: "color 0.2s",
                animationDelay: `${i * 0.05}s`,
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.color = "var(--em-light)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.color = "rgba(255,255,255,0.7)")
              }
            >
              {l}
            </button>
          ))}
        </div>
        <div
          style={{
            marginTop: "auto",
            paddingTop: 32,
            display: "flex",
            flexDirection: "column",
            gap: 10,
          }}
        >
          <a
            href="https://wa.me/971545261933"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              color: "#25D366",
              textDecoration: "none",
              fontFamily: "DM Sans",
              fontSize: 13,
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="#25D366">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
            +971 54 526 1933
          </a>
          <a
            href="mailto:asifurrahman.noyon@gmail.com"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              color: "var(--em-light)",
              textDecoration: "none",
              fontFamily: "DM Sans",
              fontSize: 13,
            }}
          >
            <svg
              width="16"
              height="16"
              fill="none"
              stroke="var(--em-light)"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
            asifurrahman.noyon@gmail.com
          </a>
        </div>
      </div>

      <style>{`
    @media (max-width: 768px) {
      .desktop-nav { display: none !important; }
      .hamburger { display: flex !important; }
    }
  `}</style>
    </>
  );
}

// Hero Section
function Hero() {
  const typed = useTyping(
    ["Brand.", "Website.", "App.", "SEO.", "Brand."],
    100,
    55,
    1800
  );
  const [showRest, setShowRest] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setShowRest(true), 1200);
    return () => clearTimeout(t);
  }, []);

  const r1 = useReveal(),
    r2 = useReveal(),
    r3 = useReveal(),
    r4 = useReveal(),
    r5 = useReveal();

  return (
    <section
      id="home"
      className="hero-mesh"
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        paddingTop: 80,
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Decorative blobs */}
      <div
        style={{
          position: "absolute",
          top: 80,
          right: -40,
          width: 480,
          height: 480,
          borderRadius: "50%",
          background:
            "radial-gradient(circle,rgba(16,185,129,0.08),transparent 70%)",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: -60,
          width: 360,
          height: 360,
          borderRadius: "50%",
          background:
            "radial-gradient(circle,rgba(5,150,105,0.05),transparent 70%)",
          pointerEvents: "none",
        }}
      />
      {/* Floating dots */}
      <div
        className="float-1"
        style={{
          position: "absolute",
          top: "35%",
          left: "12%",
          width: 8,
          height: 8,
          borderRadius: "50%",
          background: "var(–em)",
          opacity: 0.4,
        }}
      />
      <div
        className="float-2"
        style={{
          position: "absolute",
          top: "20%",
          right: "18%",
          width: 12,
          height: 12,
          borderRadius: "50%",
          border: "2px solid var(–em)",
          opacity: 0.3,
        }}
      />
      <div
        className="float-3"
        style={{
          position: "absolute",
          bottom: "25%",
          left: "30%",
          width: 6,
          height: 6,
          borderRadius: "50%",
          background: "var(–em-light)",
          opacity: 0.5,
        }}
      />

      <div
        style={{
          maxWidth: 1280,
          margin: "0 auto",
          padding: "80px 24px",
          width: "100%",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 64,
            alignItems: "center",
          }}
          className="hero-grid"
        >
          {/* Left */}
          <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
            <div
              ref={r1}
              className="reveal"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                background: "var(--em-bg)",
                border: "1px solid #d1fae5",
                borderRadius: 100,
                padding: "6px 16px",
                width: "fit-content",
              }}
            >
              <span
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  background: "var(--em)",
                  display: "inline-block",
                  animation: "pulse-green 1.8s ease-in-out infinite",
                }}
              />
              <span
                style={{
                  fontSize: 12,
                  fontWeight: 500,
                  color: "#047857",
                  fontFamily: "DM Sans",
                }}
              >
                Available for Projects · Worldwide
              </span>
            </div>

            <div ref={r2} className="reveal d1">
              <h1
                style={{
                  fontFamily: "Syne",
                  fontWeight: 800,
                  fontSize: "clamp(42px,6vw,72px)",
                  lineHeight: 1.02,
                  letterSpacing: "-0.02em",
                  marginBottom: 4,
                }}
              >
                Launch Your
                <br />
                <span
                  className="animated-gradient glitch"
                  data-text={typed || "Brand."}
                >
                  {typed || "\u00a0"}
                </span>
                <span
                  className="blink-cursor"
                  style={{ color: "var(--em)", fontWeight: 300 }}
                >
                  {" "}
                  |
                </span>
                <br />
                <span
                  style={{
                    opacity: showRest ? 1 : 0,
                    transition: "opacity 0.6s ease 0.3s",
                  }}
                >
                  Your Business.
                </span>
              </h1>
            </div>

            <p
              ref={r3}
              className="reveal d2"
              style={{
                fontSize: 17,
                color: "var(--gray-600)",
                fontFamily: "DM Sans",
                fontWeight: 300,
                lineHeight: 1.7,
                maxWidth: 480,
              }}
            >
              I'm{" "}
              <strong style={{ color: "var(--black)", fontWeight: 600 }}>
                Asifurrahman Noyon
              </strong>{" "}
              — Web Developer, SEO Strategist &amp; Brand Designer helping
              businesses worldwide build powerful brands, beautiful websites,
              and dominant search presence.
            </p>

            {/* Skill pills */}
            <div
              ref={r4}
              className="reveal d3"
              style={{ display: "flex", flexWrap: "wrap", gap: 8 }}
            >
              {[
                "Web Development",
                "Branding & Packaging",
                "SEO & GBP",
                "Android Apps",
              ].map((s) => (
                <span
                  key={s}
                  style={{
                    padding: "6px 14px",
                    background: "var(--black)",
                    color: "white",
                    borderRadius: 100,
                    fontSize: 12,
                    fontFamily: "DM Sans",
                    fontWeight: 500,
                  }}
                >
                  {s}
                </span>
              ))}
            </div>

            {/* CTAs */}
            <div
              ref={r5}
              className="reveal d4"
              style={{ display: "flex", gap: 14, flexWrap: "wrap" }}
            >
              <button
                onClick={() =>
                  document
                    .getElementById("portfolio")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
                className="btn-shimmer"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  background: "var(--black)",
                  color: "white",
                  border: "none",
                  padding: "14px 24px",
                  borderRadius: 12,
                  fontFamily: "DM Sans",
                  fontWeight: 500,
                  fontSize: 15,
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                  boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-2px)";
                  e.currentTarget.style.boxShadow =
                    "0 16px 40px rgba(0,0,0,0.2)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "";
                  e.currentTarget.style.boxShadow =
                    "0 8px 24px rgba(0,0,0,0.15)";
                }}
              >
                View My Work
                <svg
                  width="16"
                  height="16"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  className="bounce-x"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M17 8l4 4m0 0l-4 4m4-4H3"
                  />
                </svg>
              </button>
              <button
                onClick={() =>
                  document
                    .getElementById("contact")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
                className="btn-shimmer"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  background: "var(--em)",
                  color: "white",
                  border: "none",
                  padding: "14px 24px",
                  borderRadius: 12,
                  fontFamily: "DM Sans",
                  fontWeight: 500,
                  fontSize: 15,
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                  boxShadow: "0 8px 24px rgba(16,185,129,0.3)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-2px)";
                  e.currentTarget.style.boxShadow =
                    "0 16px 40px rgba(16,185,129,0.4)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "";
                  e.currentTarget.style.boxShadow =
                    "0 8px 24px rgba(16,185,129,0.3)";
                }}
              >
                <svg
                  width="16"
                  height="16"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                Book Free Consultation
              </button>
            </div>

            {/* Stats */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3,1fr)",
                gap: 24,
                paddingTop: 24,
                borderTop: "1px solid var(--gray-100)",
              }}
            >
              {[
                ["50+", "Projects Delivered"],
                ["3+", "Years Experience"],
                ["100%", "Client Satisfaction"],
              ].map(([n, l], i) => {
                const [c, ref] = useCounter(parseInt(n) || 100, 1200);
                return (
                  <div key={i} ref={ref} className="stat-box">
                    <div
                      style={{
                        fontFamily: "Syne",
                        fontWeight: 800,
                        fontSize: 32,
                        lineHeight: 1,
                      }}
                    >
                      {typeof parseInt(n) === "number" && !isNaN(parseInt(n))
                        ? n.includes("%")
                          ? c + "%"
                          : c + "+"
                        : n}
                    </div>
                    <div
                      style={{
                        fontSize: 12,
                        color: "var(--gray-400)",
                        fontFamily: "DM Sans",
                        marginTop: 4,
                      }}
                    >
                      {l}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right – Profile visual */}
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              position: "relative",
            }}
          >
            <div
              style={{ position: "relative", width: 380, height: 380 }}
              className="float-1"
            >
              {/* Outer ring spinning */}
              <div
                className="spin-slow"
                style={{
                  position: "absolute",
                  inset: 0,
                  borderRadius: "50%",
                  border: "2px dashed rgba(16,185,129,0.3)",
                }}
              />
              <div
                className="spin-reverse"
                style={{
                  position: "absolute",
                  inset: 14,
                  borderRadius: "50%",
                  border: "1px dashed rgba(16,185,129,0.15)",
                }}
              />
              {/* Bg gradient circle */}
              <div
                style={{
                  position: "absolute",
                  inset: 8,
                  borderRadius: "50%",
                  background: "linear-gradient(135deg,#ecfdf5,#d1fae5)",
                }}
              />
              {/* Photo */}
              <div
                id="heroImgWrap"
                style={{
                  position: "absolute",
                  inset: 28,
                  borderRadius: "50%",
                  overflow: "hidden",
                  boxShadow: "0 24px 64px rgba(0,0,0,0.18)",
                }}
              >
                <div
                  style={{
                    width: "100%",
                    height: "100%",
                    background: "linear-gradient(135deg,#1f2937,#0a0a0a)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <div style={{ textAlign: "center" }}>
                    <div
                      style={{
                        fontFamily: "Syne",
                        fontWeight: 800,
                        fontSize: 56,
                        color: "var(--em-light)",
                        lineHeight: 1,
                      }}
                    >
                      AN
                    </div>
                    <div
                      style={{
                        fontSize: 11,
                        color: "var(--gray-400)",
                        fontFamily: "DM Sans",
                        marginTop: 4,
                      }}
                    >
                      Noyon
                    </div>
                  </div>
                </div>
                {/* ↓ Replace with your actual photo */}
                {/* <img src="your-photo.jpg" alt="Asifurrahman Noyon" style={{width:"100%",height:"100%",objectFit:"cover",objectPosition:"top"}} /> */}
              </div>

              {/* Floating card – Brand */}
              <div
                className="card-lift float-2"
                style={{
                  position: "absolute",
                  left: -40,
                  top: "22%",
                  background: "white",
                  borderRadius: 16,
                  padding: "10px 14px",
                  boxShadow: "0 12px 40px rgba(0,0,0,0.1)",
                  border: "1px solid var(--gray-100)",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div
                    style={{
                      width: 34,
                      height: 34,
                      background: "var(--em-bg)",
                      borderRadius: 10,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <svg
                      width="16"
                      height="16"
                      fill="none"
                      stroke="var(--em-dark)"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <div>
                    <div
                      style={{
                        fontFamily: "Syne",
                        fontWeight: 700,
                        fontSize: 12,
                      }}
                    >
                      Brand Launch
                    </div>
                    <div style={{ fontSize: 11, color: "var(--gray-400)" }}>
                      Complete Solution
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating card – SEO */}
              <div
                className="card-lift float-3"
                style={{
                  position: "absolute",
                  right: -44,
                  bottom: "22%",
                  background: "var(--black)",
                  borderRadius: 16,
                  padding: "10px 14px",
                  boxShadow: "0 12px 40px rgba(0,0,0,0.25)",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div
                    style={{
                      width: 34,
                      height: 34,
                      background: "rgba(16,185,129,0.2)",
                      borderRadius: 10,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <svg
                      width="16"
                      height="16"
                      fill="none"
                      stroke="var(--em-light)"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                      />
                    </svg>
                  </div>
                  <div>
                    <div
                      style={{
                        fontFamily: "Syne",
                        fontWeight: 700,
                        fontSize: 12,
                        color: "white",
                      }}
                    >
                      SEO Growth
                    </div>
                    <div style={{ fontSize: 11, color: "var(--gray-400)" }}>
                      Ranked Globally
                    </div>
                  </div>
                </div>
              </div>

              {/* Location badge */}
              <div
                style={{
                  position: "absolute",
                  bottom: -20,
                  left: "50%",
                  transform: "translateX(-50%)",
                  background: "var(--em)",
                  color: "white",
                  borderRadius: 100,
                  padding: "7px 16px",
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  fontSize: 12,
                  fontFamily: "DM Sans",
                  whiteSpace: "nowrap",
                  boxShadow: "0 8px 24px rgba(16,185,129,0.4)",
                }}
              >
                <svg
                  width="12"
                  height="12"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                    clipRule="evenodd"
                  />
                </svg>
                Dubai, UAE 🌍
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div
        style={{
          position: "absolute",
          bottom: 28,
          left: "50%",
          transform: "translateX(-50%)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 8,
          opacity: 0.5,
        }}
      >
        <span
          style={{
            fontSize: 11,
            fontFamily: "DM Sans",
            color: "var(--gray-400)",
          }}
        >
          Scroll
        </span>
        <div
          style={{
            width: 1,
            height: 40,
            background:
              "linear-gradient(to bottom,var(--gray-400),transparent)",
            animation: "pulse-green 1.8s ease-in-out infinite",
          }}
        />
      </div>

      <style>{`
    @media (max-width: 900px) {
      .hero-grid { grid-template-columns: 1fr !important; text-align: center; }
      .hero-grid > div:last-child { display: none; }
    }
  `}</style>
    </section>
  );
}

// Skills Marquee
function SkillsMarquee() {
  const skills = [
    "Web Development",
    "Branding",
    "Packaging Design",
    "Local SEO",
    "Google Business Profile",
    "Android Apps",
    "UI/UX Design",
    "E-Commerce",
    "Label Design",
    "React.js",
    "WordPress",
    "Print Production",
  ];
  return (
    <div
      style={{
        background: "var(–black)",
        padding: "18px 0",
        overflow: "hidden",
        borderTop: "1px solid #1f2937",
        borderBottom: "1px solid #1f2937",
      }}
    >
      <div className="marquee-track">
        {[skills, skills].map((s, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 16,
              paddingRight: 48,
              flexShrink: 0,
            }}
          >
            <span
              style={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                background: "var(–em)",
                display: "inline-block",
              }}
            />
            <span
              style={{
                fontFamily: "Syne",
                fontWeight: 600,
                fontSize: 14,
                color: "white",
                whiteSpace: "nowrap",
              }}
            >
              {s}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// About Section
function About() {
  const leftRef = useReveal();
  const rightRef = useReveal();
  const codeRef = useRef(null);
  const [codeVisible, setCodeVisible] = useState(false);

  useEffect(() => {
    const el = codeRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setCodeVisible(true);
          obs.disconnect();
        }
      },
      { threshold: 0.2 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const codeLines = [
    [`<span style="color:#10b981">{</span>`, 0],
    [
      `  <span style="color:#93c5fd">"name"</span>: <span style="color:#fde68a">"Asifurrahman Noyon"</span>,`,
      1,
    ],
    [
      `  <span style="color:#93c5fd">"title"</span>: <span style="color:#fde68a">"Web & Brand Specialist"</span>,`,
      2,
    ],
    [
      `  <span style="color:#93c5fd">"location"</span>: <span style="color:#fde68a">"Dubai, UAE (Remote Worldwide)"</span>,`,
      3,
    ],
    [`  <span style="color:#93c5fd">"skills"</span>: [`, 4],
    [`    <span style="color:#10b981">"Web Development"</span>,`, 5],
    [`    <span style="color:#10b981">"Android Apps"</span>,`, 6],
    [`    <span style="color:#10b981">"SEO Strategy"</span>,`, 7],
    [`    <span style="color:#10b981">"Branding Design"</span>,`, 8],
    [`    <span style="color:#10b981">"Packaging Design"</span>`, 9],
    [`  ],`, 10],
    [
      `  <span style="color:#93c5fd">"focus"</span>: <span style="color:#fde68a">"Global & UAE Business Growth"</span>,`,
      11,
    ],
    [
      `  <span style="color:#93c5fd">"available"</span>: <span style="color:#4ade80">true</span>`,
      12,
    ],
    [`<span style="color:#10b981">}</span>`, 13],
  ];

  const skills = [
    { label: "Web Development", pct: 95 },
    { label: "Branding & Design", pct: 90 },
    { label: "SEO Strategy", pct: 88 },
    { label: "Android Development", pct: 80 },
    { label: "Packaging Design", pct: 92 },
  ];

  return (
    <section
      id="about"
      style={{
        padding: "100px 0",
        background: "var(–black)",
        color: "white",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 0,
          right: 0,
          width: 300,
          height: 300,
          borderRadius: "50%",
          background:
            "radial-gradient(circle,rgba(16,185,129,0.08),transparent 70%)",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          width: 200,
          height: 200,
          borderRadius: "50%",
          background:
            "radial-gradient(circle,rgba(16,185,129,0.05),transparent 70%)",
        }}
      />

      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 24px" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 64,
            alignItems: "start",
          }}
          className="about-grid"
        >
          {/* Left – code card */}
          <div ref={leftRef} className="reveal-left">
            <div
              ref={codeRef}
              style={{
                background: "#0f1117",
                borderRadius: 24,
                padding: 32,
                border: "1px solid #1f2937",
                position: "relative",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  height: 1,
                  background:
                    "linear-gradient(90deg,transparent,var(--em),transparent)",
                }}
              />
              {/* Traffic lights */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  marginBottom: 24,
                }}
              >
                <div
                  style={{
                    width: 12,
                    height: 12,
                    borderRadius: "50%",
                    background: "#ef4444",
                  }}
                />
                <div
                  style={{
                    width: 12,
                    height: 12,
                    borderRadius: "50%",
                    background: "#f59e0b",
                  }}
                />
                <div
                  style={{
                    width: 12,
                    height: 12,
                    borderRadius: "50%",
                    background: "#22c55e",
                  }}
                />
                <span
                  style={{
                    fontSize: 12,
                    color: "#4b5563",
                    fontFamily: "DM Sans",
                    marginLeft: 8,
                  }}
                >
                  profile.json
                </span>
                <span
                  style={{
                    marginLeft: "auto",
                    fontSize: 10,
                    color: "var(--em)",
                    fontFamily: "DM Sans",
                    background: "rgba(16,185,129,0.1)",
                    padding: "2px 8px",
                    borderRadius: 100,
                  }}
                >
                  ● LIVE
                </span>
              </div>
              <pre
                style={{
                  fontSize: 13,
                  fontFamily: "'Fira Code','Courier New',monospace",
                  lineHeight: 1.8,
                  overflow: "auto",
                  margin: 0,
                }}
              >
                {codeLines.map(([line, idx]) => (
                  <span
                    key={idx}
                    className={`code-line ${codeVisible ? "show" : ""}`}
                    style={{
                      transitionDelay: codeVisible ? `${idx * 80}ms` : "0ms",
                    }}
                    dangerouslySetInnerHTML={{ __html: line + "\n" }}
                  />
                ))}
              </pre>
            </div>

            {/* Mini stats */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 12,
                marginTop: 12,
              }}
            >
              {[
                ["50+", "Projects Done"],
                ["Global", "Remote & Dubai"],
              ].map(([n, l]) => (
                <div
                  key={n}
                  style={{
                    background: "#111827",
                    border: "1px solid #1f2937",
                    borderRadius: 16,
                    padding: 16,
                    textAlign: "center",
                    transition: "border-color 0.2s",
                    cursor: "default",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.borderColor = "var(--em)")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.borderColor = "#1f2937")
                  }
                >
                  <div
                    style={{
                      fontFamily: "Syne",
                      fontWeight: 800,
                      fontSize: 24,
                      color: "var(--em-light)",
                    }}
                  >
                    {n}
                  </div>
                  <div
                    style={{
                      fontSize: 12,
                      color: "var(--gray-400)",
                      fontFamily: "DM Sans",
                      marginTop: 4,
                    }}
                  >
                    {l}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right – bio + skills */}
          <div
            ref={rightRef}
            className="reveal-right"
            style={{ display: "flex", flexDirection: "column", gap: 24 }}
          >
            <div className="section-tag">
              <span
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: "50%",
                  background: "var(--em)",
                  display: "inline-block",
                }}
              />
              About Me
            </div>

            <h2
              style={{
                fontFamily: "Syne",
                fontWeight: 800,
                fontSize: "clamp(32px,4vw,48px)",
                lineHeight: 1.1,
                letterSpacing: "-0.02em",
              }}
            >
              The Rare Combo:
              <br />
              <span className="grad-text">Tech + Design + SEO</span>
            </h2>

            <p
              style={{
                color: "#9ca3af",
                fontFamily: "DM Sans",
                fontWeight: 300,
                lineHeight: 1.8,
                fontSize: 15,
              }}
            >
              I'm{" "}
              <span style={{ color: "white", fontWeight: 500 }}>
                Asifurrahman Noyon
              </span>{" "}
              — a multi-disciplinary digital specialist based in Dubai, UAE,
              working with clients globally. With expertise across web
              development, Android apps, SEO strategy, and branding &amp;
              packaging design, I give businesses what agencies can't: a single
              expert who masters your entire digital footprint.
            </p>

            <p
              style={{
                color: "#9ca3af",
                fontFamily: "DM Sans",
                fontWeight: 300,
                lineHeight: 1.8,
                fontSize: 15,
              }}
            >
              I work with startups and growing businesses across the UAE, GCC,
              and worldwide — helping them rank on Google, build stunning
              brands, and convert visitors into loyal customers.
              Remote-friendly, results-driven.
            </p>

            {/* Skill bars */}
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {skills.map(({ label, pct }) => (
                <SkillBar
                  key={label}
                  label={label}
                  pct={pct}
                  visible={codeVisible}
                />
              ))}
            </div>

            {/* ── Social Bio – for Google Knowledge Panel verification ── */}
            <div
              style={{
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: 16,
                padding: 20,
              }}
            >
              <div
                style={{
                  fontSize: 11,
                  color: "#4b5563",
                  fontFamily: "DM Sans",
                  fontWeight: 500,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  marginBottom: 14,
                }}
              >
                Find Me Online
              </div>
              <div
                style={{ display: "flex", flexDirection: "column", gap: 10 }}
              >
                {[
                  {
                    icon: "in",
                    label: "LinkedIn",
                    handle: "asifurrahman-noyon",
                    href: "https://www.linkedin.com/in/asifurrahman-noyon-9a9baa37a",
                    color: "#0a66c2",
                  },
                  {
                    icon: "ig",
                    label: "Instagram",
                    handle: "@asifurrahman_noyon",
                    href: "https://www.instagram.com/asifurrahman_noyon/",
                    color: "#e1306c",
                  },
                  {
                    icon: "fb",
                    label: "Facebook",
                    handle: "Asifurrahman Noyon",
                    href: "https://www.facebook.com/share/1C8h7vCvHz/",
                    color: "#1877f2",
                  },
                  {
                    icon: "wa",
                    label: "WhatsApp",
                    handle: "+971 54 526 1933",
                    href: "https://wa.me/971545261933",
                    color: "#25d366",
                  },
                  {
                    icon: "em",
                    label: "Email",
                    handle: "asifurrahman.noyon@gmail.com",
                    href: "mailto:asifurrahman.noyon@gmail.com",
                    color: "var(--em-light)",
                  },
                ].map(({ icon, label, handle, href, color }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer me"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 12,
                      padding: "8px 12px",
                      borderRadius: 10,
                      background: "rgba(255,255,255,0.03)",
                      border: "1px solid rgba(255,255,255,0.06)",
                      textDecoration: "none",
                      transition: "all 0.2s",
                      cursor: "pointer",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background =
                        "rgba(16,185,129,0.08)";
                      e.currentTarget.style.borderColor =
                        "rgba(16,185,129,0.2)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background =
                        "rgba(255,255,255,0.03)";
                      e.currentTarget.style.borderColor =
                        "rgba(255,255,255,0.06)";
                    }}
                  >
                    <div
                      style={{
                        width: 28,
                        height: 28,
                        borderRadius: 8,
                        background: `${color}22`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                      }}
                    >
                      <span
                        style={{
                          fontSize: 11,
                          fontFamily: "Syne",
                          fontWeight: 800,
                          color,
                        }}
                      >
                        {icon.toUpperCase()}
                      </span>
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div
                        style={{
                          fontSize: 12,
                          fontFamily: "Syne",
                          fontWeight: 700,
                          color: "#d1d5db",
                          lineHeight: 1.2,
                        }}
                      >
                        {label}
                      </div>
                      <div
                        style={{
                          fontSize: 11,
                          fontFamily: "DM Sans",
                          color: "#4b5563",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {handle}
                      </div>
                    </div>
                    <svg
                      width="12"
                      height="12"
                      fill="none"
                      stroke="#4b5563"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                      />
                    </svg>
                  </a>
                ))}
              </div>
            </div>

            <div style={{ display: "flex", gap: 12, paddingTop: 8 }}>
              <button
                onClick={() =>
                  document
                    .getElementById("contact")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
                className="btn-shimmer"
                style={{
                  background: "var(--em)",
                  color: "white",
                  border: "none",
                  padding: "12px 24px",
                  borderRadius: 10,
                  fontFamily: "DM Sans",
                  fontWeight: 500,
                  fontSize: 14,
                  cursor: "pointer",
                  transition: "all 0.3s",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.background = "var(--em-dark)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.background = "var(--em)")
                }
              >
                Work With Me
              </button>
              <button
                onClick={() =>
                  document
                    .getElementById("services")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
                style={{
                  background: "transparent",
                  color: "#9ca3af",
                  border: "1px solid #374151",
                  padding: "12px 24px",
                  borderRadius: 10,
                  fontFamily: "DM Sans",
                  fontWeight: 500,
                  fontSize: 14,
                  cursor: "pointer",
                  transition: "all 0.3s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "var(--em)";
                  e.currentTarget.style.color = "white";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "#374151";
                  e.currentTarget.style.color = "#9ca3af";
                }}
              >
                My Services
              </button>
            </div>
          </div>
        </div>
      </div>

      <style>{`
    @media (max-width: 900px) {
      .about-grid { grid-template-columns: 1fr !important; }
    }
  `}</style>
    </section>
  );
}

function SkillBar({ label, pct, visible }) {
  const [animate, setAnimate] = useState(false);
  useEffect(() => {
    if (visible) {
      const t = setTimeout(() => setAnimate(true), 400);
      return () => clearTimeout(t);
    }
  }, [visible]);
  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: 6,
        }}
      >
        <span style={{ fontSize: 13, fontFamily: "DM Sans", color: "#d1d5db" }}>
          {label}
        </span>
        <span
          style={{
            fontSize: 12,
            fontFamily: "Syne",
            fontWeight: 700,
            color: "var(–em-light)",
          }}
        >
          {pct}%
        </span>
      </div>
      <div
        style={{
          height: 5,
          background: "#1f2937",
          borderRadius: 100,
          overflow: "hidden",
        }}
      >
        <div
          className={`skill-bar-fill ${animate ? "animate" : ""}`}
          style={{ "–target-width": `${pct}%` }}
        />
      </div>
    </div>
  );
}

// Services Section
function Services() {
  const h = useReveal();
  const services = [
    {
      icon: (
        <svg
          width="28"
          height="28"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"
          />
        </svg>
      ),
      title: "Branding & Packaging",
      desc: "Create a brand that commands attention — on shelves, online, and everywhere in between.",
      items: [
        "Product packaging design",
        "Label & sticker design",
        "Print-ready production files",
        "Manufacturer guidance",
      ],
      dark: false,
      badge: null,
    },
    {
      icon: (
        <svg
          width="28"
          height="28"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
          />
        </svg>
      ),
      title: "Web & App Development",
      desc: "Fast, modern, conversion-optimized websites and Android apps that generate real leads.",
      items: [
        "Business & corporate websites",
        "Landing pages & lead funnels",
        "E-commerce stores",
        "Android mobile applications",
      ],
      dark: true,
      badge: "Most Popular",
    },
    {
      icon: (
        <svg
          width="28"
          height="28"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      ),
      title: "SEO & Google Business",
      desc: "Get found by local customers when they search. Rank higher. Get more calls and walk-ins.",
      items: [
        "Google Business Profile setup",
        "Local SEO & keyword ranking",
        "Competitive strategy & audits",
        "Monthly optimization reports",
      ],
      dark: false,
      badge: null,
    },
  ];

  return (
    <section
      id="services"
      style={{ padding: "100px 0", background: "white", position: "relative" }}
      className="stripe-bg"
    >
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 24px" }}>
        <div
          ref={h}
          className="reveal"
          style={{ textAlign: "center", marginBottom: 64 }}
        >
          <div className="section-tag">What I Offer</div>
          <h2
            style={{
              fontFamily: "Syne",
              fontWeight: 800,
              fontSize: "clamp(32px,4.5vw,52px)",
              letterSpacing: "-0.02em",
              lineHeight: 1.1,
              marginBottom: 16,
            }}
          >
            Three Pillars of
            <br />
            <span className="grad-text">Business Growth</span>
          </h2>
          <p
            style={{
              color: "var(–gray-600)",
              fontFamily: "DM Sans",
              fontWeight: 300,
              maxWidth: 520,
              margin: "0 auto",
              lineHeight: 1.7,
            }}
          >
            End-to-end solutions for businesses worldwide — launch, compete, and
            dominate your market.
          </p>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3,1fr)",
            gap: 24,
          }}
          className="services-grid"
        >
          {services.map((s, i) => (
            <ServiceCard key={i} {...s} delay={i * 0.1} />
          ))}
        </div>
      </div>

      <style>{`
    @media (max-width: 900px) {
      .services-grid { grid-template-columns: 1fr !important; }
    }
  `}</style>
    </section>
  );
}

function ServiceCard({ icon, title, desc, items, dark, badge, delay }) {
  const ref = useReveal();
  return (
    <div
      ref={ref}
      className={`reveal svc-card card-lift d${Math.round(delay * 10 + 1)}`}
      style={{
        background: dark ? "var(–black)" : "white",
        color: dark ? "white" : "inherit",
        border: dark ? "1px solid #1f2937" : "1px solid var(–gray-100)",
        borderRadius: 24,
        padding: 32,
        boxShadow: dark
          ? "0 24px 64px rgba(0,0,0,0.2)"
          : "0 2px 16px rgba(0,0,0,0.04)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {dark && (
        <div
          style={{
            position: "absolute",
            top: 0,
            right: 0,
            width: 120,
            height: 120,
            borderRadius: "50%",
            background: "rgba(16,185,129,0.1)",
            filter: "blur(40px)",
          }}
        />
      )}
      {badge && (
        <div
          style={{
            position: "absolute",
            top: 20,
            right: 20,
            background: "rgba(16,185,129,0.2)",
            color: "var(–em-light)",
            fontSize: 11,
            fontFamily: "DM Sans",
            padding: "4px 10px",
            borderRadius: 100,
            fontWeight: 500,
          }}
        >
          {badge}
        </div>
      )}

      <div
        style={{
          width: 52,
          height: 52,
          background: dark ? "rgba(16,185,129,0.15)" : "var(--em-bg)",
          borderRadius: 14,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: 20,
          color: dark ? "var(--em-light)" : "var(--em-dark)",
        }}
      >
        {icon}
      </div>

      <h3
        style={{
          fontFamily: "Syne",
          fontWeight: 700,
          fontSize: 20,
          marginBottom: 12,
        }}
      >
        {title}
      </h3>
      <p
        style={{
          color: dark ? "#9ca3af" : "var(--gray-600)",
          fontFamily: "DM Sans",
          fontWeight: 300,
          fontSize: 14,
          lineHeight: 1.7,
          marginBottom: 20,
        }}
      >
        {desc}
      </p>

      <ul
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 10,
          marginBottom: 24,
        }}
      >
        {items.map((item) => (
          <li
            key={item}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              fontSize: 13,
              fontFamily: "DM Sans",
              color: dark ? "#d1d5db" : "var(--gray-600)",
            }}
          >
            <span
              style={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                background: "var(--em)",
                flexShrink: 0,
                display: "inline-block",
              }}
            />
            {item}
          </li>
        ))}
      </ul>

      <button
        onClick={() =>
          document
            .getElementById("contact")
            ?.scrollIntoView({ behavior: "smooth" })
        }
        style={{
          display: "flex",
          alignItems: "center",
          gap: 6,
          background: dark ? "var(--em)" : "transparent",
          color: dark ? "white" : "var(--em-dark)",
          border: dark ? "none" : "none",
          padding: dark ? "10px 20px" : "0",
          borderRadius: dark ? 10 : 0,
          fontFamily: "DM Sans",
          fontWeight: 500,
          fontSize: 14,
          cursor: "pointer",
          transition: "all 0.3s",
        }}
        className="btn-shimmer"
        onMouseEnter={(e) => {
          if (dark) {
            e.currentTarget.style.background = "var(--em-dark)";
          } else {
            e.currentTarget.style.color = "var(--em)";
          }
        }}
        onMouseLeave={(e) => {
          if (dark) {
            e.currentTarget.style.background = "var(--em)";
          } else {
            e.currentTarget.style.color = "var(--em-dark)";
          }
        }}
      >
        Get Started
        <svg
          width="14"
          height="14"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
          className="bounce-x"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M17 8l4 4m0 0l-4 4m4-4H3"
          />
        </svg>
      </button>
    </div>
  );
}

// Portfolio Section
function Portfolio() {
  const hRef = useReveal();
  const [filter, setFilter] = useState("All");
  const filters = ["All", "Branding", "Web Dev", "SEO", "Android App"];

  const projects = [
    {
      title: "FreshBox – Organic Food Brand",
      cat: "Branding",
      desc: "Complete brand identity & packaging for UAE organic food startup. Launch-ready in 3 weeks.",
      gradient: "from-emerald-400 to-teal-600",
      color: "#10b981",
    },
    {
      title: "TechPro – IT Services Dubai",
      cat: "Web Dev",
      desc: "Corporate website with lead generation. 3x enquiry increase in first month.",
      gradient: "from-slate-700 to-black",
      color: "#6b7280",
    },
    {
      title: "SpiceHub – Restaurant Sharjah",
      cat: "SEO",
      desc: "Google Business Profile optimization. Ranked #1 for ‘Indian restaurant Sharjah’ in 6 weeks.",
      gradient: "from-orange-400 to-rose-600",
      color: "#f97316",
    },
    {
      title: "Glowify – Beauty Booking App",
      cat: "Android App",
      desc: "Android booking app for UAE salon chain. 500+ downloads in first month.",
      gradient: "from-violet-500 to-purple-800",
      color: "#8b5cf6",
    },
    {
      title: "CleanPro – Cleaning Services UAE",
      cat: "Web Dev",
      desc: "Brand + website + local SEO. From zero to 50+ monthly leads in 60 days.",
      gradient: "from-sky-400 to-blue-700",
      color: "#0ea5e9",
    },
    {
      title: "GoldCraft – Luxury Jewelry UAE",
      cat: "Branding",
      desc: "Premium packaging & brand identity for high-end jewelry retailer in Dubai Gold Souk.",
      gradient: "from-amber-400 to-orange-600",
      color: "#f59e0b",
    },
  ];

  const filtered =
    filter === "All" ? projects : projects.filter((p) => p.cat === filter);

  return (
    <section
      id="portfolio"
      style={{ padding: "100px 0", background: "#f9fafb" }}
    >
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 24px" }}>
        <div ref={hRef} className="reveal" style={{ marginBottom: 48 }}>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "space-between",
              alignItems: "flex-end",
              gap: 16,
              marginBottom: 24,
            }}
          >
            <div>
              <div className="section-tag">Selected Work</div>
              <h2
                style={{
                  fontFamily: "Syne",
                  fontWeight: 800,
                  fontSize: "clamp(32px,4.5vw,52px)",
                  letterSpacing: "-0.02em",
                  lineHeight: 1.1,
                }}
              >
                Real Projects,
                <br />
                <span className="grad-text">Real Results</span>
              </h2>
            </div>
            <p
              style={{
                color: "var(–gray-600)",
                fontFamily: "DM Sans",
                fontWeight: 300,
                maxWidth: 280,
                fontSize: 14,
                lineHeight: 1.7,
              }}
            >
              Brands and businesses I’ve helped launch and grow — UAE &
              worldwide.
            </p>
          </div>

          {/* Filters */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {filters.map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`filter-btn ${filter === f ? "active" : ""}`}
                style={{
                  padding: "8px 18px",
                  borderRadius: 100,
                  border: "1.5px solid",
                  borderColor:
                    filter === f ? "var(--black)" : "var(--gray-100)",
                  fontFamily: "DM Sans",
                  fontSize: 13,
                  fontWeight: 500,
                  cursor: "pointer",
                  transition: "all 0.2s",
                  background: filter === f ? "var(--black)" : "white",
                  color: filter === f ? "white" : "var(--gray-600)",
                }}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3,1fr)",
            gap: 20,
            transition: "all 0.3s",
          }}
          className="portfolio-grid"
        >
          {filtered.map((p, i) => (
            <PortfolioCard key={p.title} {...p} delay={i * 0.08} />
          ))}
        </div>

        <div style={{ textAlign: "center", marginTop: 48 }}>
          <button
            onClick={() =>
              document
                .getElementById("contact")
                ?.scrollIntoView({ behavior: "smooth" })
            }
            className="btn-shimmer"
            style={{
              background: "var(--black)",
              color: "white",
              border: "none",
              padding: "14px 28px",
              borderRadius: 12,
              fontFamily: "DM Sans",
              fontWeight: 500,
              fontSize: 15,
              cursor: "pointer",
              transition: "all 0.3s",
              boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.boxShadow = "0 16px 40px rgba(0,0,0,0.2)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "";
              e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.15)";
            }}
          >
            Discuss Your Project →
          </button>
        </div>
      </div>

      <style>{`
    @media (max-width: 900px) { .portfolio-grid { grid-template-columns: 1fr 1fr !important; } }
    @media (max-width: 600px) { .portfolio-grid { grid-template-columns: 1fr !important; } }
  `}</style>
    </section>
  );
}

function PortfolioCard({ title, cat, desc, gradient, color, delay }) {
  const ref = useReveal();
  const catColors = {
    Branding: "var(–em-bg)",
    "Web Dev": "#f0f9ff",
    SEO: "#fefce8",
    "Android App": "#faf5ff",
  };
  const catText = {
    Branding: "var(–em-dark)",
    "Web Dev": "#0369a1",
    SEO: "#92400e",
    "Android App": "#6d28d9",
  };
  return (
    <div
      ref={ref}
      className={`reveal port-card card-lift`}
      style={{
        transitionDelay: `${delay}s`,
        background: "white",
        borderRadius: 20,
        overflow: "hidden",
        border: "1px solid var(–gray-100)",
      }}
    >
      {/* Thumbnail */}
      <div
        style={{
          height: 180,
          background: `linear-gradient(135deg,${color}22,${color}66)`,
          position: "relative",
          overflow: "hidden",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <div
            style={{
              fontFamily: "Syne",
              fontWeight: 800,
              fontSize: 28,
              color: color,
            }}
          >
            {title.split("–")[0].trim()}
          </div>
          <div
            style={{
              fontSize: 12,
              color: `${color}88`,
              fontFamily: "DM Sans",
              marginTop: 4,
            }}
          >
            {cat}
          </div>
        </div>
        <div
          className="port-overlay"
          style={{
            position: "absolute",
            inset: 0,
            background: "rgba(0,0,0,0.6)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <button
            onClick={() =>
              document
                .getElementById("contact")
                ?.scrollIntoView({ behavior: "smooth" })
            }
            style={{
              background: "var(–em)",
              color: "white",
              border: "none",
              padding: "10px 20px",
              borderRadius: 100,
              fontFamily: "DM Sans",
              fontWeight: 500,
              fontSize: 13,
              cursor: "pointer",
            }}
          >
            View Details
          </button>
        </div>
      </div>

      <div style={{ padding: 20 }}>
        <span
          style={{
            fontSize: 11,
            background: catColors[cat] || "var(--em-bg)",
            color: catText[cat] || "var(--em-dark)",
            padding: "4px 10px",
            borderRadius: 100,
            fontFamily: "DM Sans",
            fontWeight: 500,
          }}
        >
          {cat}
        </span>
        <h3
          style={{
            fontFamily: "Syne",
            fontWeight: 700,
            fontSize: 15,
            marginTop: 10,
            marginBottom: 6,
            lineHeight: 1.3,
          }}
        >
          {title}
        </h3>
        <p
          style={{
            color: "var(--gray-600)",
            fontSize: 13,
            fontFamily: "DM Sans",
            fontWeight: 300,
            lineHeight: 1.6,
          }}
        >
          {desc}
        </p>
      </div>
    </div>
  );
}

// Process Section
function Process() {
  const hRef = useReveal();
  const steps = [
    {
      n: "01",
      title: "Consultation",
      desc: "Free 30-min discovery call to understand your business, goals, and challenges.",
      icon: "💬",
    },
    {
      n: "02",
      title: "Research",
      desc: "Deep competitor analysis, keyword research, and market study for your industry.",
      icon: "🔍",
    },
    {
      n: "03",
      title: "Strategy",
      desc: "Custom growth plan with clear milestones, timelines, and measurable KPIs.",
      icon: "🎯",
    },
    {
      n: "04",
      title: "Design & Build",
      desc: "Crafting your brand assets, website, or app with feedback loops built in.",
      icon: "⚡",
    },
    {
      n: "05",
      title: "Launch",
      desc: "Smooth deployment with testing, QA, and go-live support for a flawless launch.",
      icon: "🚀",
    },
    {
      n: "06",
      title: "Growth & Optimize",
      desc: "Ongoing monitoring, reporting, and refinement to continuously improve results.",
      icon: "📈",
    },
  ];

  return (
    <section
      id="process"
      style={{
        padding: "100px 0",
        background: "var(–black)",
        color: "white",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Grid lines */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "radial-gradient(rgba(16,185,129,0.05) 1px,transparent 1px)",
          backgroundSize: "40px 40px",
          pointerEvents: "none",
        }}
      />

      <div
        style={{
          maxWidth: 1280,
          margin: "0 auto",
          padding: "0 24px",
          position: "relative",
        }}
      >
        <div
          ref={hRef}
          className="reveal"
          style={{ textAlign: "center", marginBottom: 64 }}
        >
          <div className="section-tag">How It Works</div>
          <h2
            style={{
              fontFamily: "Syne",
              fontWeight: 800,
              fontSize: "clamp(32px,4.5vw,52px)",
              letterSpacing: "-0.02em",
              lineHeight: 1.1,
              marginBottom: 16,
            }}
          >
            My <span className="grad-text">6-Step</span>
            <br />
            Professional Process
          </h2>
          <p
            style={{
              color: "#6b7280",
              fontFamily: "DM Sans",
              fontWeight: 300,
              maxWidth: 480,
              margin: "0 auto",
              lineHeight: 1.7,
            }}
          >
            Every project follows a proven workflow ensuring quality, on-time
            delivery, and measurable results.
          </p>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3,1fr)",
            gap: 20,
          }}
          className="process-grid"
        >
          {steps.map((s, i) => (
            <ProcessStep
              key={i}
              {...s}
              delay={i * 0.1}
              first={i === 0}
              last={i === 5}
            />
          ))}
        </div>
      </div>

      <style>{`
    @media (max-width: 900px) { .process-grid { grid-template-columns: 1fr 1fr !important; } }
    @media (max-width: 600px) { .process-grid { grid-template-columns: 1fr !important; } }
  `}</style>
    </section>
  );
}

function ProcessStep({ n, title, desc, icon, delay, first, last }) {
  const ref = useReveal();
  const isAccent = n === "01" || n === "06";
  return (
    <div
      ref={ref}
      className={`reveal d${Math.round(delay * 10 + 1)}`}
      style={{
        background: isAccent
          ? "linear-gradient(135deg,var(–em-dark),var(–em))"
          : "#111827",
        border: isAccent ? "none" : "1px solid #1f2937",
        borderRadius: 20,
        padding: 28,
        transition: "border-color 0.2s, transform 0.3s",
        cursor: "default",
        transitionDelay: `${delay}s`,
      }}
      onMouseEnter={(e) => {
        if (!isAccent) e.currentTarget.style.borderColor = "var(–em)";
        e.currentTarget.style.transform = "translateY(-4px)";
      }}
      onMouseLeave={(e) => {
        if (!isAccent) e.currentTarget.style.borderColor = "#1f2937";
        e.currentTarget.style.transform = "";
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 14,
          marginBottom: 14,
        }}
      >
        <div
          style={{
            width: 46,
            height: 46,
            background: isAccent
              ? "rgba(255,255,255,0.2)"
              : "rgba(16,185,129,0.1)",
            borderRadius: 12,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: "Syne",
            fontWeight: 800,
            fontSize: 18,
            color: isAccent ? "white" : "var(–em-light)",
            flexShrink: 0,
          }}
        >
          {n}
        </div>
        <div style={{ fontSize: 22 }}>{icon}</div>
      </div>
      <h3
        style={{
          fontFamily: "Syne",
          fontWeight: 700,
          fontSize: 17,
          color: "white",
          marginBottom: 8,
        }}
      >
        {title}
      </h3>
      <p
        style={{
          color: isAccent ? "rgba(255,255,255,0.7)" : "#6b7280",
          fontFamily: "DM Sans",
          fontWeight: 300,
          fontSize: 13,
          lineHeight: 1.7,
        }}
      >
        {desc}
      </p>
    </div>
  );
}

// Pricing Section
function Pricing() {
  const hRef = useReveal();
  const [billing, setBilling] = useState("usd");
  const [activeTab, setActiveTab] = useState("all");

  const tabs = ["all", "branding", "website", "full"];

  const plans = [
    // ── BRANDING & PACKAGING ──────────────────────────────────
    {
      id: "brand-starter",
      category: "branding",
      badge: null,
      name: "Brand Starter",
      tagline: "Logo + Basic Brand Kit",
      price: 49,
      priceNote: "one-time",
      dark: false,
      features: [
        { text: "Logo design (3 concepts)", yes: true },
        { text: "Brand color palette", yes: true },
        { text: "Typography selection", yes: true },
        { text: "Business card design", yes: true },
        { text: "Social media kit", yes: false },
        { text: "Packaging design", yes: false },
        { text: "Print-ready files", yes: false },
      ],
      cta: "Get Started",
    },
    {
      id: "brand-pro",
      category: "branding",
      badge: "Popular",
      name: "Brand Pro",
      tagline: "Full Branding + Packaging",
      price: 149,
      priceNote: "one-time",
      dark: false,
      features: [
        { text: "Logo design (5 concepts)", yes: true },
        { text: "Complete brand guidelines", yes: true },
        { text: "Color & typography system", yes: true },
        { text: "Business card + stationery", yes: true },
        { text: "Social media kit", yes: true },
        { text: "Product packaging design", yes: true },
        { text: "Print-ready production files", yes: true },
      ],
      cta: "Get Started",
    },

    // ── WEBSITE ───────────────────────────────────────────────
    {
      id: "web-basic",
      category: "website",
      badge: null,
      name: "Web Starter",
      tagline: "Simple Business Website",
      price: 99,
      priceNote: "one-time",
      dark: false,
      features: [
        { text: "Up to 5 pages", yes: true },
        { text: "Mobile responsive design", yes: true },
        { text: "Contact form", yes: true },
        { text: "Google Maps integration", yes: true },
        { text: "Basic on-page SEO", yes: true },
        { text: "Google Business setup", yes: false },
        { text: "1-month support", yes: false },
      ],
      cta: "Get Started",
    },
    {
      id: "web-seo",
      category: "website",
      badge: "Best Value",
      name: "Web + SEO",
      tagline: "Website with Local SEO",
      price: 249,
      priceNote: "one-time + $49/mo SEO",
      dark: true,
      features: [
        { text: "Up to 10 pages", yes: true },
        { text: "Mobile responsive design", yes: true },
        { text: "Contact form + WhatsApp", yes: true },
        { text: "Google Business Profile setup", yes: true },
        { text: "Full local SEO optimization", yes: true },
        { text: "Monthly SEO reporting", yes: true },
        { text: "3-month priority support", yes: true },
      ],
      cta: "Get This Deal",
    },

    // ── FULL SOLUTION ─────────────────────────────────────────
    {
      id: "full-launch",
      category: "full",
      badge: "🔥 Best Package",
      name: "Full Business Launch",
      tagline: "Brand + Web + SEO — Everything",
      price: 399,
      priceNote: "one-time + $49/mo SEO",
      dark: false,
      features: [
        { text: "Full branding & brand guidelines", yes: true },
        { text: "Product packaging design", yes: true },
        { text: "Up to 10-page website", yes: true },
        { text: "E-commerce ready (optional)", yes: true },
        { text: "Google Business Profile setup", yes: true },
        { text: "Local SEO + monthly reports", yes: true },
        { text: "6-month priority support", yes: true },
      ],
      cta: "Launch My Business",
      highlight: true,
    },
  ];

  const filtered =
    activeTab === "all" ? plans : plans.filter((p) => p.category === activeTab);

  return (
    <section
      id="pricing"
      style={{
        padding: "100px 0",
        background: "var(–black)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Grid dot bg */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "radial-gradient(rgba(16,185,129,0.06) 1px,transparent 1px)",
          backgroundSize: "36px 36px",
          pointerEvents: "none",
        }}
      />
      {/* Glow blobs */}
      <div
        style={{
          position: "absolute",
          top: "-80px",
          left: "50%",
          transform: "translateX(-50%)",
          width: 600,
          height: 300,
          borderRadius: "50%",
          background:
            "radial-gradient(ellipse,rgba(16,185,129,0.08),transparent 70%)",
          pointerEvents: "none",
        }}
      />

      <div
        style={{
          maxWidth: 1280,
          margin: "0 auto",
          padding: "0 24px",
          position: "relative",
        }}
      >
        {/* Header */}
        <div
          ref={hRef}
          className="reveal"
          style={{ textAlign: "center", marginBottom: 56 }}
        >
          <div
            className="section-tag"
            style={{
              background: "rgba(16,185,129,0.1)",
              border: "1px solid rgba(16,185,129,0.2)",
              color: "var(--em-light)",
            }}
          >
            <span
              style={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                background: "var(--em)",
                display: "inline-block",
              }}
            />
            Transparent Pricing
          </div>
          <h2
            style={{
              fontFamily: "Syne",
              fontWeight: 800,
              fontSize: "clamp(32px,4.5vw,56px)",
              letterSpacing: "-0.02em",
              lineHeight: 1.05,
              color: "white",
              marginBottom: 16,
            }}
          >
            Simple, Honest
            <br />
            <span className="grad-text">Pricing Plans</span>
          </h2>
          <p
            style={{
              color: "#6b7280",
              fontFamily: "DM Sans",
              fontWeight: 300,
              maxWidth: 520,
              margin: "0 auto",
              lineHeight: 1.75,
              fontSize: 15,
            }}
          >
            No hidden fees. No agency markup. Just real value for businesses
            everywhere — starting low so you can grow without risk.
          </p>

          {/* Tab filters */}
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: 8,
              marginTop: 32,
              flexWrap: "wrap",
            }}
          >
            {[
              { id: "all", label: "All Plans" },
              { id: "branding", label: "🎨 Branding" },
              { id: "website", label: "🌐 Website" },
              { id: "full", label: "🚀 Full Solution" },
            ].map((t) => (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id)}
                style={{
                  padding: "9px 20px",
                  borderRadius: 100,
                  border: "1.5px solid",
                  borderColor:
                    activeTab === t.id ? "var(--em)" : "rgba(255,255,255,0.1)",
                  background: activeTab === t.id ? "var(--em)" : "transparent",
                  color: activeTab === t.id ? "white" : "#9ca3af",
                  fontFamily: "DM Sans",
                  fontWeight: 500,
                  fontSize: 13,
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                }}
                onMouseEnter={(e) => {
                  if (activeTab !== t.id) {
                    e.currentTarget.style.borderColor = "rgba(16,185,129,0.4)";
                    e.currentTarget.style.color = "white";
                  }
                }}
                onMouseLeave={(e) => {
                  if (activeTab !== t.id) {
                    e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)";
                    e.currentTarget.style.color = "#9ca3af";
                  }
                }}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Plans grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              filtered.length === 1
                ? "minmax(0,420px)"
                : filtered.length === 2
                ? "repeat(2,1fr)"
                : "repeat(auto-fit,minmax(260px,1fr))",
            gap: 20,
            justifyContent: "center",
            transition: "all 0.4s ease",
          }}
          className="pricing-grid"
        >
          {filtered.map((plan, i) => (
            <PricingCard key={plan.id} {...plan} delay={i * 0.08} />
          ))}
        </div>

        {/* Bottom note */}
        <div className="reveal" style={{ textAlign: "center", marginTop: 52 }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 10,
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: 100,
              padding: "10px 24px",
            }}
          >
            <svg
              width="16"
              height="16"
              fill="none"
              stroke="var(--em-light)"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
              />
            </svg>
            <span
              style={{ fontFamily: "DM Sans", fontSize: 13, color: "#9ca3af" }}
            >
              All plans include free consultation · Prices in USD · Custom
              quotes available
            </span>
          </div>
          <div style={{ marginTop: 20 }}>
            <button
              onClick={() =>
                document
                  .getElementById("contact")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
              className="btn-shimmer"
              style={{
                background: "var(--em)",
                color: "white",
                border: "none",
                padding: "14px 32px",
                borderRadius: 12,
                fontFamily: "DM Sans",
                fontWeight: 500,
                fontSize: 15,
                cursor: "pointer",
                boxShadow: "0 8px 32px rgba(16,185,129,0.3)",
                transition: "all 0.3s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "var(--em-dark)";
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow =
                  "0 16px 48px rgba(16,185,129,0.4)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "var(--em)";
                e.currentTarget.style.transform = "";
                e.currentTarget.style.boxShadow =
                  "0 8px 32px rgba(16,185,129,0.3)";
              }}
            >
              Need a Custom Quote? Let's Talk →
            </button>
          </div>
        </div>
      </div>

      <style>{`
    @media (max-width: 900px) { .pricing-grid { grid-template-columns: 1fr 1fr !important; } }
    @media (max-width: 600px) { .pricing-grid { grid-template-columns: 1fr !important; } }
  `}</style>
    </section>
  );
}

function PricingCard({
  name,
  tagline,
  price,
  priceNote,
  features,
  cta,
  dark,
  badge,
  highlight,
  delay,
}) {
  const ref = useReveal();
  const [hovered, setHovered] = useState(false);

  return (
    <div
      ref={ref}
      className="reveal"
      style={{ transitionDelay: `${delay}s` }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div
        style={{
          background: highlight
            ? "linear-gradient(145deg,#0f2818,#0a1f13)"
            : dark
            ? "#0d0d0d"
            : "#111827",
          border: `1.5px solid ${
            highlight
              ? "var(--em)"
              : hovered
              ? "rgba(16,185,129,0.35)"
              : "rgba(255,255,255,0.07)"
          }`,
          borderRadius: 24,
          padding: "28px 24px",
          position: "relative",
          overflow: "hidden",
          transition:
            "border-color 0.3s, transform 0.35s cubic-bezier(0.16,1,0.3,1), box-shadow 0.35s ease",
          transform: hovered ? "translateY(-8px)" : "none",
          boxShadow: highlight
            ? hovered
              ? "0 32px 80px rgba(16,185,129,0.3)"
              : "0 16px 48px rgba(16,185,129,0.15)"
            : hovered
            ? "0 24px 64px rgba(0,0,0,0.5)"
            : "none",
          height: "100%",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Glow top line */}
        {highlight && (
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: 2,
              background:
                "linear-gradient(90deg,transparent,var(–em),transparent)",
            }}
          />
        )}

        {/* Ambient glow */}
        {highlight && (
          <div
            style={{
              position: "absolute",
              top: -40,
              right: -40,
              width: 160,
              height: 160,
              borderRadius: "50%",
              background: "rgba(16,185,129,0.08)",
              filter: "blur(40px)",
              pointerEvents: "none",
            }}
          />
        )}

        {/* Badge */}
        {badge && (
          <div
            style={{
              position: "absolute",
              top: 16,
              right: 16,
              background: highlight ? "var(--em)" : "rgba(16,185,129,0.15)",
              color: highlight ? "white" : "var(--em-light)",
              fontSize: 11,
              fontFamily: "DM Sans",
              fontWeight: 600,
              padding: "4px 10px",
              borderRadius: 100,
              boxShadow: highlight ? "0 4px 12px rgba(16,185,129,0.4)" : "none",
            }}
          >
            {badge}
          </div>
        )}

        {/* Name + tagline */}
        <div style={{ marginBottom: 20 }}>
          <h3
            style={{
              fontFamily: "Syne",
              fontWeight: 800,
              fontSize: 20,
              color: "white",
              marginBottom: 5,
            }}
          >
            {name}
          </h3>
          <p
            style={{
              fontFamily: "DM Sans",
              fontWeight: 300,
              fontSize: 13,
              color: "#6b7280",
              lineHeight: 1.5,
            }}
          >
            {tagline}
          </p>
        </div>

        {/* Price */}
        <div
          style={{
            marginBottom: 24,
            paddingBottom: 24,
            borderBottom: "1px solid rgba(255,255,255,0.07)",
          }}
        >
          <div style={{ display: "flex", alignItems: "flex-end", gap: 4 }}>
            <span
              style={{
                fontFamily: "Syne",
                fontWeight: 400,
                fontSize: 22,
                color: "var(--em-light)",
                lineHeight: 1,
                marginBottom: 4,
              }}
            >
              $
            </span>
            <span
              style={{
                fontFamily: "Syne",
                fontWeight: 800,
                fontSize: 52,
                color: "white",
                lineHeight: 1,
              }}
            >
              {price}
            </span>
          </div>
          <span
            style={{
              fontFamily: "DM Sans",
              fontSize: 12,
              color: "#4b5563",
              marginTop: 4,
              display: "block",
            }}
          >
            {priceNote}
          </span>
        </div>

        {/* Features */}
        <ul
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 11,
            flex: 1,
            marginBottom: 24,
          }}
        >
          {features.map(({ text, yes }) => (
            <li
              key={text}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                opacity: yes ? 1 : 0.35,
              }}
            >
              <span
                style={{
                  width: 20,
                  height: 20,
                  borderRadius: "50%",
                  flexShrink: 0,
                  background: yes
                    ? "rgba(16,185,129,0.15)"
                    : "rgba(255,255,255,0.05)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {yes ? (
                  <svg
                    width="11"
                    height="11"
                    fill="none"
                    stroke="var(--em-light)"
                    strokeWidth="2.5"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                ) : (
                  <svg
                    width="11"
                    height="11"
                    fill="none"
                    stroke="#4b5563"
                    strokeWidth="2.5"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                )}
              </span>
              <span
                style={{
                  fontFamily: "DM Sans",
                  fontSize: 13,
                  color: yes ? "#d1d5db" : "#4b5563",
                  fontWeight: 300,
                }}
              >
                {text}
              </span>
            </li>
          ))}
        </ul>

        {/* CTA button */}
        <button
          onClick={() =>
            document
              .getElementById("contact")
              ?.scrollIntoView({ behavior: "smooth" })
          }
          className="btn-shimmer"
          style={{
            width: "100%",
            background: highlight ? "var(--em)" : "rgba(255,255,255,0.06)",
            color: "white",
            border: highlight ? "none" : "1px solid rgba(255,255,255,0.1)",
            padding: "13px",
            borderRadius: 12,
            fontFamily: "DM Sans",
            fontWeight: 600,
            fontSize: 14,
            cursor: "pointer",
            transition: "all 0.25s ease",
            boxShadow: highlight ? "0 8px 24px rgba(16,185,129,0.3)" : "none",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = highlight
              ? "var(--em-dark)"
              : "rgba(16,185,129,0.15)";
            e.currentTarget.style.borderColor = "var(--em)";
            if (highlight)
              e.currentTarget.style.boxShadow =
                "0 12px 32px rgba(16,185,129,0.4)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = highlight
              ? "var(--em)"
              : "rgba(255,255,255,0.06)";
            e.currentTarget.style.borderColor = highlight
              ? "none"
              : "rgba(255,255,255,0.1)";
            if (highlight)
              e.currentTarget.style.boxShadow =
                "0 8px 24px rgba(16,185,129,0.3)";
          }}
        >
          {cta}
        </button>
      </div>
    </div>
  );
}

// Why Choose Me
function WhyMe() {
  const leftRef = useReveal();
  const rightRef = useReveal();
  const reasons = [
    {
      title: "Real Production Knowledge",
      desc: "I don’t just design concepts — I understand print specs, code performance, and SEO algorithms from hands-on experience.",
      icon: "💡",
    },
    {
      title: "Tech + Design Combo",
      desc: "Most designers can’t code. Most developers can’t design. I do both, saving you time, money, and communication overhead.",
      icon: "⚡",
    },
    {
      title: "International + UAE Experience",
      desc: "Based in Dubai, UAE — I work with clients globally. I understand both international markets and local GCC business culture, giving your brand a competitive edge wherever you are.",
      icon: "🌍",
    },
    {
      title: "Result-Oriented Strategy",
      desc: "Every decision ties to measurable outcomes — more leads, better rankings, higher conversions. No vanity metrics.",
      icon: "📈",
    },
  ];

  const stats = [
    { n: 50, suffix: "+", label: "Projects Delivered" },
    { n: 3, suffix: "+", label: "Years Experience" },
    { n: 5, suffix: "★", label: "Avg Client Rating", noCount: true },
    { n: 24, suffix: "h", label: "Response Time" },
  ];

  return (
    <section style={{ padding: "100px 0", background: "white" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 24px" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 64,
            alignItems: "center",
          }}
          className="why-grid"
        >
          <div
            ref={leftRef}
            className="reveal-left"
            style={{ display: "flex", flexDirection: "column", gap: 24 }}
          >
            <div>
              <div className="section-tag">Why Choose Me</div>
              <h2
                style={{
                  fontFamily: "Syne",
                  fontWeight: 800,
                  fontSize: "clamp(32px,4vw,48px)",
                  letterSpacing: "-0.02em",
                  lineHeight: 1.1,
                }}
              >
                Not Just Another
                <br />
                <span className="grad-text">Agency.</span>
              </h2>
            </div>
            <p
              style={{
                color: "var(--gray-600)",
                fontFamily: "DM Sans",
                fontWeight: 300,
                lineHeight: 1.7,
                fontSize: 15,
                maxWidth: 480,
              }}
            >
              When you work with me, you get a single strategic partner who
              understands design, code, and marketing — and how they work
              together to grow your business.
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {reasons.map(({ title, desc, icon }) => (
                <div
                  key={title}
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: 16,
                    padding: 20,
                    background: "var(--gray-50)",
                    borderRadius: 16,
                    border: "1px solid transparent",
                    transition: "all 0.3s",
                    cursor: "default",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "var(--em-bg)";
                    e.currentTarget.style.borderColor = "#d1fae5";
                    e.currentTarget.style.transform = "translateX(4px)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "var(--gray-50)";
                    e.currentTarget.style.borderColor = "transparent";
                    e.currentTarget.style.transform = "";
                  }}
                >
                  <div
                    style={{
                      width: 44,
                      height: 44,
                      background: "var(--black)",
                      borderRadius: 12,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 20,
                      flexShrink: 0,
                    }}
                  >
                    {icon}
                  </div>
                  <div>
                    <h4
                      style={{
                        fontFamily: "Syne",
                        fontWeight: 700,
                        fontSize: 14,
                        marginBottom: 4,
                      }}
                    >
                      {title}
                    </h4>
                    <p
                      style={{
                        color: "var(--gray-600)",
                        fontSize: 13,
                        fontFamily: "DM Sans",
                        fontWeight: 300,
                        lineHeight: 1.6,
                      }}
                    >
                      {desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div
            ref={rightRef}
            className="reveal-right"
            style={{ display: "flex", flexDirection: "column", gap: 12 }}
          >
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 12,
              }}
            >
              {stats.map(({ n, suffix, label, noCount }, i) => {
                const [c, ref] = useCounter(n, 1200);
                return (
                  <div
                    key={i}
                    ref={ref}
                    style={{
                      background:
                        i === 0 || i === 3
                          ? "var(--black)"
                          : i === 1
                          ? "var(--em)"
                          : "var(--gray-50)",
                      borderRadius: 20,
                      padding: 28,
                      textAlign: "center",
                      transition: "transform 0.3s",
                      cursor: "default",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.transform = "translateY(-4px)")
                    }
                    onMouseLeave={(e) => (e.currentTarget.style.transform = "")}
                  >
                    <div
                      style={{
                        fontFamily: "Syne",
                        fontWeight: 800,
                        fontSize: 40,
                        lineHeight: 1,
                        color:
                          i === 0 || i === 3
                            ? "var(--em-light)"
                            : i === 1
                            ? "white"
                            : "var(--black)",
                      }}
                    >
                      {noCount ? suffix : c + suffix}
                    </div>
                    <div
                      style={{
                        fontSize: 12,
                        fontFamily: "DM Sans",
                        marginTop: 6,
                        color:
                          i === 0 || i === 3
                            ? "#6b7280"
                            : i === 1
                            ? "rgba(255,255,255,0.8)"
                            : "var(--gray-600)",
                      }}
                    >
                      {label}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Available badge */}
            <div
              style={{
                background: "linear-gradient(135deg,var(--em-bg),white)",
                border: "1px solid #d1fae5",
                borderRadius: 20,
                padding: 24,
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  marginBottom: 10,
                }}
              >
                <span
                  style={{
                    width: 10,
                    height: 10,
                    borderRadius: "50%",
                    background: "var(--em)",
                    display: "inline-block",
                    animation: "pulse-green 2s ease-in-out infinite",
                  }}
                />
                <span
                  style={{
                    fontFamily: "DM Sans",
                    fontWeight: 500,
                    fontSize: 14,
                    color: "var(--gray-800)",
                  }}
                >
                  Currently accepting new projects
                </span>
              </div>
              <p
                style={{
                  fontSize: 13,
                  color: "var(--gray-600)",
                  fontFamily: "DM Sans",
                  fontWeight: 300,
                  marginBottom: 16,
                  lineHeight: 1.6,
                }}
              >
                Limited consultation slots available. Book yours before they
                fill up.
              </p>
              <button
                onClick={() =>
                  document
                    .getElementById("contact")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
                className="btn-shimmer"
                style={{
                  width: "100%",
                  background: "var(--em)",
                  color: "white",
                  border: "none",
                  padding: "12px",
                  borderRadius: 10,
                  fontFamily: "DM Sans",
                  fontWeight: 500,
                  fontSize: 14,
                  cursor: "pointer",
                  transition: "background 0.2s",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.background = "var(--em-dark)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.background = "var(--em)")
                }
              >
                Check Availability
              </button>
            </div>
          </div>
        </div>
      </div>

      <style>{`
    @media (max-width: 900px) { .why-grid { grid-template-columns: 1fr !important; } }
  `}</style>
    </section>
  );
}

// Testimonials
function Testimonials() {
  const hRef = useReveal();
  const testimonials = [
    {
      name: "Ahmed Mohammed",
      role: "CEO, FreshBite Foods – Sharjah",
      initials: "AM",
      color: "#10b981",
      text: "Noyon transformed our food business from zero online presence to ranking on Google’s first page. Our packaging looks stunning and the website converts brilliantly. Best investment we made.",
    },
    {
      name: "Sara Khalid",
      role: "Founder, PureClean Services – Dubai",
      initials: "SK",
      color: "#0ea5e9",
      dark: true,
      text: "We needed a complete brand overhaul and app. Noyon delivered everything on time, on budget, and beyond expectations. Our bookings doubled in the first two months. Absolutely incredible work.",
    },
    {
      name: "James Al-Rashidi",
      role: "Director, GoldCraft Jewels – Dubai",
      initials: "JA",
      color: "#f59e0b",
      text: "The combination of SEO expertise and packaging design knowledge is rare. Noyon executed our luxury brand flawlessly. Online inquiries went up by 400% in 3 months.",
    },
  ];

  return (
    <section
      id="testimonials"
      style={{ padding: "100px 0", background: "#f9fafb" }}
    >
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 24px" }}>
        <div
          ref={hRef}
          className="reveal"
          style={{ textAlign: "center", marginBottom: 64 }}
        >
          <div className="section-tag">Client Feedback</div>
          <h2
            style={{
              fontFamily: "Syne",
              fontWeight: 800,
              fontSize: "clamp(32px,4.5vw,52px)",
              letterSpacing: "-0.02em",
              lineHeight: 1.1,
            }}
          >
            What Clients
            <br />
            <span className="grad-text">Say About Me</span>
          </h2>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3,1fr)",
            gap: 24,
          }}
          className="testi-grid"
        >
          {testimonials.map((t, i) => (
            <TestiCard key={i} {...t} delay={i * 0.1} />
          ))}
        </div>
      </div>

      <style>{`
    @media (max-width: 900px) { .testi-grid { grid-template-columns: 1fr !important; } }
  `}</style>
    </section>
  );
}

function TestiCard({ name, role, initials, color, text, dark, delay }) {
  const ref = useReveal();
  return (
    <div
      ref={ref}
      className={`reveal card-lift testi-card d${Math.round(delay * 10 + 1)}`}
      style={{
        background: dark ? "var(–black)" : "white",
        borderRadius: 20,
        padding: 28,
        boxShadow: dark
          ? "0 24px 64px rgba(0,0,0,0.15)"
          : "0 2px 16px rgba(0,0,0,0.04)",
        transitionDelay: `${delay}s`,
      }}
    >
      <div style={{ display: "flex", gap: 4, marginBottom: 16 }}>
        {[1, 2, 3, 4, 5].map((s) => (
          <span key={s} style={{ color: "#f59e0b", fontSize: 16 }}>
            ★
          </span>
        ))}
      </div>
      <p
        style={{
          color: dark ? "#9ca3af" : "var(–gray-600)",
          fontFamily: "DM Sans",
          fontWeight: 300,
          fontSize: 14,
          lineHeight: 1.8,
          marginBottom: 20,
          fontStyle: "italic",
        }}
      >
        "{text}"
      </p>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <div
          style={{
            width: 40,
            height: 40,
            borderRadius: "50%",
            background: `linear-gradient(135deg,${color}88,${color})`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: "Syne",
            fontWeight: 700,
            fontSize: 14,
            color: "white",
            flexShrink: 0,
          }}
        >
          {initials}
        </div>
        <div>
          <div
            style={{
              fontFamily: "Syne",
              fontWeight: 700,
              fontSize: 14,
              color: dark ? "white" : "var(–black)",
            }}
          >
            {name}
          </div>
          <div
            style={{
              fontSize: 12,
              color: "var(–gray-400)",
              fontFamily: "DM Sans",
            }}
          >
            {role}
          </div>
        </div>
      </div>
    </div>
  );
}

// Contact Section
function Contact() {
  const hRef = useReveal();
  const leftRef = useReveal();
  const rightRef = useReveal();
  const [form, setForm] = useState({
    name: "",
    email: "",
    service: "",
    message: "",
  });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSending(true);
    setError(false);
    try {
      // Formspree — free tier: 50 submissions/month, no backend needed
      // Sign up at formspree.io, create a form, replace YOUR_FORM_ID below
      // Until then, falls back to mailto: link so nothing is ever lost
      const FORMSPREE_ID = "YOUR_FORM_ID"; // ← replace with your Formspree form ID
      if (FORMSPREE_ID !== "YOUR_FORM_ID") {
        const res = await fetch(`https://formspree.io/f/${FORMSPREE_ID}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            name: form.name,
            email: form.email,
            service: form.service,
            message: form.message,
            _replyto: form.email,
            _subject: `New enquiry from ${form.name} — Portfolio Contact`,
          }),
        });
        if (!res.ok) throw new Error("Formspree error");
      } else {
        // Fallback: open mailto so the message is never lost
        const body = encodeURIComponent(
          `Name: ${form.name}\nEmail: ${form.email}\nService: ${form.service}\n\n${form.message}`
        );
        window.open(
          `mailto:asifurrahman.noyon@gmail.com?subject=New Project Enquiry from ${encodeURIComponent(
            form.name
          )}&body=${body}`,
          "_blank"
        );
        // Small delay so mailto has time to open
        await new Promise((r) => setTimeout(r, 600));
      }
      setSending(false);
      setSent(true);
      setForm({ name: "", email: "", service: "", message: "" });
    } catch {
      setSending(false);
      setError(true);
    }
  };

  const phone = "971545261933";
  const waMsg = encodeURIComponent(
    "Hi Noyon! I found your portfolio and I’d like to discuss my project."
  );

  return (
    <section
      id="contact"
      style={{
        padding: "100px 0",
        background: "white",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 0,
          right: 0,
          width: 400,
          height: 400,
          borderRadius: "50%",
          background:
            "radial-gradient(circle,rgba(16,185,129,0.05),transparent 70%)",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          width: 300,
          height: 300,
          borderRadius: "50%",
          background:
            "radial-gradient(circle,rgba(16,185,129,0.04),transparent 70%)",
          pointerEvents: "none",
        }}
      />

      <div
        style={{
          maxWidth: 1280,
          margin: "0 auto",
          padding: "0 24px",
          position: "relative",
        }}
      >
        <div
          ref={hRef}
          className="reveal"
          style={{ textAlign: "center", marginBottom: 64 }}
        >
          <div className="section-tag">Let's Talk</div>
          <h2
            style={{
              fontFamily: "Syne",
              fontWeight: 800,
              fontSize: "clamp(32px,4.5vw,52px)",
              letterSpacing: "-0.02em",
              lineHeight: 1.1,
              marginBottom: 16,
            }}
          >
            Ready to Launch
            <br />
            <span className="grad-text">Your Brand?</span>
          </h2>
          <p
            style={{
              color: "var(--gray-600)",
              fontFamily: "DM Sans",
              fontWeight: 300,
              maxWidth: 480,
              margin: "0 auto",
              lineHeight: 1.7,
            }}
          >
            Book a free 30-minute consultation. No pressure, no obligation —
            just a real conversation about your goals.
          </p>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 48,
            alignItems: "start",
          }}
          className="contact-grid"
        >
          {/* Form */}
          <div ref={leftRef} className="reveal-left">
            <form
              onSubmit={handleSubmit}
              style={{ display: "flex", flexDirection: "column", gap: 16 }}
            >
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 14,
                }}
              >
                <div>
                  <label
                    style={{
                      display: "block",
                      fontSize: 12,
                      fontWeight: 500,
                      fontFamily: "DM Sans",
                      color: "var(--gray-800)",
                      marginBottom: 6,
                    }}
                  >
                    Your Name *
                  </label>
                  <input
                    className="form-input"
                    required
                    value={form.name}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, name: e.target.value }))
                    }
                    placeholder="Ahmed Mohammed"
                  />
                </div>
                <div>
                  <label
                    style={{
                      display: "block",
                      fontSize: 12,
                      fontWeight: 500,
                      fontFamily: "DM Sans",
                      color: "var(--gray-800)",
                      marginBottom: 6,
                    }}
                  >
                    Email *
                  </label>
                  <input
                    className="form-input"
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, email: e.target.value }))
                    }
                    placeholder="you@example.com"
                  />
                </div>
              </div>
              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: 12,
                    fontWeight: 500,
                    fontFamily: "DM Sans",
                    color: "var(--gray-800)",
                    marginBottom: 6,
                  }}
                >
                  What do you need?
                </label>
                <select
                  className="form-input"
                  value={form.service}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, service: e.target.value }))
                  }
                >
                  <option value="">Select a service...</option>
                  <option>Branding & Packaging Design</option>
                  <option>Website Development</option>
                  <option>Android App Development</option>
                  <option>SEO & Google Business Profile</option>
                  <option>Full Package (Brand + Web + SEO)</option>
                  <option>Other / Not Sure</option>
                </select>
              </div>
              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: 12,
                    fontWeight: 500,
                    fontFamily: "DM Sans",
                    color: "var(--gray-800)",
                    marginBottom: 6,
                  }}
                >
                  Tell me about your project *
                </label>
                <textarea
                  className="form-input"
                  required
                  rows={5}
                  value={form.message}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, message: e.target.value }))
                  }
                  placeholder="Describe your business and goals..."
                  style={{ resize: "none" }}
                />
              </div>

              {sent ? (
                <div
                  style={{
                    background: "var(--em-bg)",
                    border: "1px solid #d1fae5",
                    borderRadius: 12,
                    padding: "16px 20px",
                    textAlign: "center",
                    animation: "slide-in-up 0.4s ease",
                  }}
                >
                  <div style={{ fontSize: 22, marginBottom: 6 }}>🎉</div>
                  <div
                    style={{
                      color: "var(--em-dark)",
                      fontFamily: "DM Sans",
                      fontWeight: 600,
                      fontSize: 15,
                      marginBottom: 4,
                    }}
                  >
                    Message received!
                  </div>
                  <div
                    style={{
                      color: "var(--em-dark)",
                      fontFamily: "DM Sans",
                      fontWeight: 300,
                      fontSize: 13,
                    }}
                  >
                    I'll reply to your email within 24 hours. You can also
                    WhatsApp me for a faster response.
                  </div>
                </div>
              ) : error ? (
                <div
                  style={{ display: "flex", flexDirection: "column", gap: 10 }}
                >
                  <div
                    style={{
                      background: "#fef2f2",
                      border: "1px solid #fecaca",
                      borderRadius: 12,
                      padding: "14px 20px",
                      color: "#dc2626",
                      fontFamily: "DM Sans",
                      fontWeight: 500,
                      fontSize: 13,
                      textAlign: "center",
                    }}
                  >
                    ⚠️ Couldn't send automatically. Please email me directly:
                  </div>
                  <a
                    href={`mailto:asifurrahman.noyon@gmail.com?subject=New Project Enquiry from ${encodeURIComponent(
                      form.name
                    )}&body=${encodeURIComponent(
                      "Name: " +
                        form.name +
                        "\nEmail: " +
                        form.email +
                        "\nService: " +
                        form.service +
                        "\n\n" +
                        form.message
                    )}`}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 8,
                      background: "var(--black)",
                      color: "white",
                      padding: "14px",
                      borderRadius: 12,
                      fontFamily: "DM Sans",
                      fontWeight: 500,
                      fontSize: 14,
                      textDecoration: "none",
                      transition: "all 0.2s",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.background = "var(--em-dark)")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.background = "var(--black)")
                    }
                  >
                    <svg
                      width="16"
                      height="16"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                    Open Email App →
                  </a>
                </div>
              ) : (
                <button
                  type="submit"
                  disabled={sending}
                  className="btn-shimmer"
                  style={{
                    background: "var(--black)",
                    color: "white",
                    border: "none",
                    padding: "14px",
                    borderRadius: 12,
                    fontFamily: "DM Sans",
                    fontWeight: 500,
                    fontSize: 15,
                    cursor: sending ? "wait" : "pointer",
                    transition: "all 0.3s",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 10,
                    boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
                    opacity: sending ? 0.7 : 1,
                  }}
                  onMouseEnter={(e) => {
                    if (!sending) {
                      e.currentTarget.style.transform = "translateY(-2px)";
                      e.currentTarget.style.boxShadow =
                        "0 16px 40px rgba(0,0,0,0.2)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "";
                    e.currentTarget.style.boxShadow =
                      "0 8px 24px rgba(0,0,0,0.15)";
                  }}
                >
                  {sending ? (
                    <>
                      <svg
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        style={{ animation: "spin-slow 0.8s linear infinite" }}
                      >
                        <circle cx="12" cy="12" r="10" strokeOpacity="0.25" />
                        <path d="M12 2a10 10 0 0110 10" strokeLinecap="round" />
                      </svg>
                      Sending...
                    </>
                  ) : (
                    <>
                      Send Message{" "}
                      <svg
                        width="16"
                        height="16"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M14 5l7 7m0 0l-7 7m7-7H3"
                        />
                      </svg>
                    </>
                  )}
                </button>
              )}
            </form>
          </div>

          {/* Contact info */}
          <div
            ref={rightRef}
            className="reveal-right"
            style={{ display: "flex", flexDirection: "column", gap: 16 }}
          >
            {/* WhatsApp card */}
            <a
              href={`https://wa.me/${phone}?text=${waMsg}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "block",
                background: "linear-gradient(135deg,#22c55e,#16a34a)",
                borderRadius: 20,
                padding: 24,
                textDecoration: "none",
                color: "white",
                transition: "transform 0.3s,box-shadow 0.3s",
                boxShadow: "0 12px 40px rgba(34,197,94,0.3)",
              }}
              className="wa-contact-btn"
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-4px)";
                e.currentTarget.style.boxShadow =
                  "0 20px 60px rgba(34,197,94,0.4)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "";
                e.currentTarget.style.boxShadow =
                  "0 12px 40px rgba(34,197,94,0.3)";
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 14,
                  marginBottom: 16,
                }}
              >
                <div
                  style={{
                    width: 48,
                    height: 48,
                    background: "rgba(255,255,255,0.2)",
                    borderRadius: 14,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <svg width="26" height="26" viewBox="0 0 24 24" fill="white">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                </div>
                <div>
                  <div
                    style={{
                      fontFamily: "Syne",
                      fontWeight: 700,
                      fontSize: 16,
                    }}
                  >
                    Chat on WhatsApp
                  </div>
                  <div
                    style={{
                      fontSize: 12,
                      opacity: 0.8,
                      fontFamily: "DM Sans",
                    }}
                  >
                    Fastest response guaranteed
                  </div>
                </div>
              </div>
              <div
                style={{
                  background: "rgba(255,255,255,0.15)",
                  backdropFilter: "blur(8px)",
                  borderRadius: 10,
                  padding: "12px 16px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <span
                  style={{
                    fontFamily: "DM Sans",
                    fontWeight: 600,
                    fontSize: 15,
                  }}
                >
                  +971 54 526 1933
                </span>
                <svg
                  width="16"
                  height="16"
                  fill="none"
                  stroke="white"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                  />
                </svg>
              </div>
            </a>

            {/* Info cards */}
            {[
              {
                icon: (
                  <svg
                    width="18"
                    height="18"
                    fill="none"
                    stroke="var(--em-light)"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                ),
                label: "Email",
                value: "asifurrahman.noyon@gmail.com",
                link: "mailto:asifurrahman.noyon@gmail.com",
              },
              {
                icon: (
                  <svg
                    width="18"
                    height="18"
                    fill="none"
                    stroke="var(--em-light)"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M17.657 16.657L13.414 20.9a2 2 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                ),
                label: "Location",
                value: "Dubai, UAE — Available Worldwide",
              },
              {
                icon: (
                  <svg
                    width="18"
                    height="18"
                    fill="none"
                    stroke="var(--em-light)"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                ),
                label: "Response Time",
                value: "Within 24 hours · Mon–Sat",
              },
            ].map(({ icon, label, value, link }) => (
              <div
                key={label}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 16,
                  padding: 16,
                  background: "var(--gray-50)",
                  borderRadius: 14,
                  border: "1px solid transparent",
                  transition: "all 0.2s",
                  cursor: link ? "pointer" : "default",
                }}
                onClick={() => link && window.open(link)}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "var(--em-bg)";
                  e.currentTarget.style.borderColor = "#d1fae5";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "var(--gray-50)";
                  e.currentTarget.style.borderColor = "transparent";
                }}
              >
                <div
                  style={{
                    width: 42,
                    height: 42,
                    background: "var(--black)",
                    borderRadius: 12,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  {icon}
                </div>
                <div>
                  <div
                    style={{
                      fontSize: 11,
                      color: "var(--gray-400)",
                      fontFamily: "DM Sans",
                      marginBottom: 2,
                    }}
                  >
                    {label}
                  </div>
                  <div
                    style={{
                      fontSize: 14,
                      fontFamily: "DM Sans",
                      fontWeight: 500,
                      color: link ? "var(--em-dark)" : "var(--black)",
                    }}
                  >
                    {value}
                  </div>
                </div>
              </div>
            ))}

            {/* Serving areas */}
            <div
              style={{
                padding: 16,
                border: "1px solid var(--gray-100)",
                borderRadius: 14,
              }}
            >
              <div
                style={{
                  fontSize: 11,
                  color: "var(--gray-400)",
                  fontFamily: "DM Sans",
                  marginBottom: 10,
                }}
              >
                Serving clients in
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {[
                  "🌍 Worldwide",
                  "🇦🇪 UAE",
                  "🇸🇦 Saudi Arabia",
                  "🇬🇧 UK",
                  "🇺🇸 USA",
                  "+ More",
                ].map((city) => (
                  <span
                    key={city}
                    style={{
                      padding: "5px 12px",
                      background:
                        city === "+ More" ? "var(--gray-100)" : "var(--em-bg)",
                      color:
                        city === "+ More"
                          ? "var(--gray-600)"
                          : "var(--em-dark)",
                      borderRadius: 100,
                      fontSize: 12,
                      fontFamily: "DM Sans",
                      fontWeight: 500,
                    }}
                  >
                    {city}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
    @media (max-width: 900px) { .contact-grid { grid-template-columns: 1fr !important; } }
  `}</style>
    </section>
  );
}

// Footer
function Footer() {
  const links = [
    "About",
    "Services",
    "Portfolio",
    "Pricing",
    "Testimonials",
    "Contact",
  ];
  const services = [
    "Packaging Design",
    "Web Development",
    "Android Apps",
    "SEO Strategy",
    "Google Business",
  ];
  const scrollTo = (id) =>
    document
      .getElementById(id.toLowerCase())
      ?.scrollIntoView({ behavior: "smooth" });
  const phone = "971545261933";
  const waMsg = encodeURIComponent("Hi Noyon!");

  return (
    <footer
      style={{
        background: "var(–black)",
        color: "white",
        padding: "64px 0 32px",
      }}
    >
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 24px" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "2fr 1fr 1fr",
            gap: 48,
            marginBottom: 48,
          }}
          className="footer-grid"
        >
          {/* Brand */}
          <div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                marginBottom: 16,
              }}
            >
              <div
                style={{
                  width: 36,
                  height: 36,
                  background: "var(--em)",
                  borderRadius: 10,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <span
                  style={{
                    fontFamily: "Syne",
                    fontWeight: 800,
                    fontSize: 16,
                    color: "white",
                  }}
                >
                  N
                </span>
              </div>
              <div>
                <div
                  style={{ fontFamily: "Syne", fontWeight: 700, fontSize: 16 }}
                >
                  Asifurrahman Noyon
                </div>
                <div
                  style={{
                    fontSize: 11,
                    color: "var(--gray-400)",
                    fontFamily: "DM Sans",
                  }}
                >
                  Web Developer & Brand Specialist · Worldwide
                </div>
              </div>
            </div>
            <p
              style={{
                color: "#6b7280",
                fontSize: 13,
                fontFamily: "DM Sans",
                fontWeight: 300,
                lineHeight: 1.8,
                maxWidth: 300,
                marginBottom: 20,
              }}
            >
              Helping businesses worldwide build powerful digital presence
              through branding, web development, SEO, and app development. Based
              in Dubai, UAE — working globally.
            </p>
            {/* Socials */}
            <div style={{ display: "flex", gap: 10 }}>
              {[
                {
                  label: "Instagram",
                  href: "https://www.instagram.com/asifurrahman_noyon/",
                  path: "M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z",
                },
                {
                  label: "LinkedIn",
                  href: "https://www.linkedin.com/in/asifurrahman-noyon-9a9baa37a",
                  path: "M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z",
                },
                {
                  label: "Facebook",
                  href: "https://www.facebook.com/share/1C8h7vCvHz/",
                  path: "M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z",
                },
                {
                  label: "WhatsApp",
                  href: `https://wa.me/${phone}?text=${waMsg}`,
                  path: "M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z",
                },
              ].map(({ label, href, path }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  style={{
                    width: 36,
                    height: 36,
                    background: "#1f2937",
                    borderRadius: 10,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    transition: "background 0.2s",
                    textDecoration: "none",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.background = "var(--em)")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.background = "#1f2937")
                  }
                >
                  <svg width="16" height="16" fill="white" viewBox="0 0 24 24">
                    <path d={path} />
                  </svg>
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          <div>
            <h4
              style={{
                fontFamily: "Syne",
                fontWeight: 700,
                fontSize: 14,
                marginBottom: 16,
              }}
            >
              Quick Links
            </h4>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {links.map((l) => (
                <button
                  key={l}
                  onClick={() => scrollTo(l)}
                  style={{
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    fontFamily: "DM Sans",
                    fontSize: 13,
                    color: "#6b7280",
                    textAlign: "left",
                    padding: 0,
                    transition: "color 0.2s",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.color = "var(--em-light)")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.color = "#6b7280")
                  }
                >
                  {l}
                </button>
              ))}
            </div>
          </div>

          {/* Services */}
          <div>
            <h4
              style={{
                fontFamily: "Syne",
                fontWeight: 700,
                fontSize: 14,
                marginBottom: 16,
              }}
            >
              Services
            </h4>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {services.map((s) => (
                <button
                  key={s}
                  onClick={() => scrollTo("services")}
                  style={{
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    fontFamily: "DM Sans",
                    fontSize: 13,
                    color: "#6b7280",
                    textAlign: "left",
                    padding: 0,
                    transition: "color 0.2s",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.color = "var(--em-light)")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.color = "#6b7280")
                  }
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div
          style={{
            borderTop: "1px solid #1f2937",
            paddingTop: 24,
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 12,
          }}
        >
          <p style={{ fontSize: 12, color: "#4b5563", fontFamily: "DM Sans" }}>
            © 2025{" "}
            <span style={{ color: "var(--em-light)" }}>Asifurrahman Noyon</span>
            . All rights reserved.
          </p>
          <p style={{ fontSize: 12, color: "#374151", fontFamily: "DM Sans" }}>
            Dubai, UAE · Web Developer · SEO Expert · Brand Designer · Available
            Worldwide
          </p>
        </div>
      </div>

      <style>{`
    @media (max-width: 768px) { .footer-grid { grid-template-columns: 1fr !important; } }
  `}</style>
    </footer>
  );
}

/* ============================================================
ACTIVE SECTION TRACKING
============================================================ */
function useActiveSection() {
  const [active, setActive] = useState("home");
  useEffect(() => {
    const sections = [
      "home",
      "about",
      "services",
      "portfolio",
      "pricing",
      "process",
      "testimonials",
      "contact",
    ];
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id);
        });
      },
      { threshold: 0.4 }
    );
    sections.forEach((id) => {
      const el = document.getElementById(id);
      if (el) obs.observe(el);
    });
    return () => obs.disconnect();
  }, []);
  return active;
}

/* ============================================================
BACK TO TOP
============================================================ */
function BackToTop() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 400);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return show ? (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      style={{
        position: "fixed",
        bottom: 100,
        right: 28,
        width: 44,
        height: 44,
        background: "var(–black)",
        color: "white",
        border: "none",
        borderRadius: 12,
        cursor: "pointer",
        zIndex: 999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        boxShadow: "0 8px 24px rgba(0,0,0,0.2)",
        transition: "transform 0.3s,background 0.2s",
        animation: "slide-in-up 0.3s ease",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = "var(–em)";
        e.currentTarget.style.transform = "translateY(-2px)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = "var(–black)";
        e.currentTarget.style.transform = "";
      }}
      aria-label="Back to top"
    >
      <svg
        width="16"
        height="16"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        viewBox="0 0 24 24"
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
      </svg>
    </button>
  ) : null;
}

/* ============================================================
APP ROOT
============================================================ */
export default function App() {
  const active = useActiveSection();

  return (
    <>
      <GlobalStyle />
      <StructuredData />
      <div className="noise-overlay" />
      <Cursor />
      <Navbar active={active} />
      <main>
        <Hero />
        <SkillsMarquee />
        <About />
        <Services />
        <Portfolio />
        <Pricing />
        <Process />
        <WhyMe />
        <Testimonials />
        <Contact />
      </main>
      <Footer />
      <WhatsAppFloat />
      <BackToTop />
    </>
  );
}
