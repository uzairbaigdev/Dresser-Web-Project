import React from 'react'

/* -------------------------------------------------------------------------
 * Icons
 * Small, dependency-free line icons so this component doesn't need an icon
 * package installed. Swap for lucide-react / heroicons etc. if your project
 * already ships one.
 * ---------------------------------------------------------------------- */

const IconProps = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.6, strokeLinecap: 'round', strokeLinejoin: 'round' }

const IconExchange = (props) => (
  <svg viewBox="0 0 24 24" width="20" height="20" {...IconProps} {...props}>
    <rect x="3" y="3" width="18" height="18" rx="4" />
    <path d="M7 12.5l3 3 7-7" />
  </svg>
)

const IconLock = (props) => (
  <svg viewBox="0 0 24 24" width="20" height="20" {...IconProps} {...props}>
    <rect x="5" y="10" width="14" height="10" rx="2" />
    <path d="M8 10V7a4 4 0 0 1 8 0v3" />
  </svg>
)

const IconTruck = (props) => (
  <svg viewBox="0 0 24 24" width="20" height="20" {...IconProps} {...props}>
    <path d="M3 7h11v8H3z" />
    <path d="M14 10h4l3 3v2h-7z" />
    <circle cx="7.5" cy="18" r="1.6" />
    <circle cx="17.5" cy="18" r="1.6" />
  </svg>
)

const IconTag = (props) => (
  <svg viewBox="0 0 24 24" width="20" height="20" {...IconProps} {...props}>
    <path d="M3 11.3V4a1 1 0 0 1 1-1h7.3L21 11.7 12.7 20 3 11.3z" />
    <circle cx="7.2" cy="7.2" r="1.1" fill="currentColor" stroke="none" />
  </svg>
)

/* -------------------------------------------------------------------------
 * Static content
 * ---------------------------------------------------------------------- */

const STATS = [
  { value: '3.2M+', label: 'customers served', sublabel: 'across Pakistan & beyond' },
  { value: '94%', label: 'satisfaction rate', sublabel: 'based on post-purchase reviews' },
  { value: '200+', label: 'new styles weekly', sublabel: 'from basics to designers' },
]

const TRUST_BADGES = [
  { icon: IconExchange, label: 'Easy 30-day exchange' },
  { icon: IconLock, label: 'Secure checkout' },
  { icon: IconTruck, label: 'Ships across Pakistan' },
  { icon: IconTag, label: 'Cash on delivery available' },
]

/* -------------------------------------------------------------------------
 * Component
 *
 * heroImageUrl: pass the real background photo (e.g. `require('./assets/
 * hero-texture.jpg')` or a CDN URL) to match the source design pixel for
 * pixel. Leave it unset and a CSS-generated texture is used instead, so the
 * component still looks intentional with no image at all.
 * ---------------------------------------------------------------------- */

const FourthSection = ({ heroImageUrl }) => {
  const heroBandStyle = heroImageUrl ? { '--zb-hero-photo': `url(${heroImageUrl})` } : undefined

  return (
    <footer className="zb-footer">
      {/* ---------------- Stats + trust strip ---------------- */}
      <section className="zb-hero-band" style={heroBandStyle} aria-label="Why shop with us">
        <div className="zb-stat-card">
          {STATS.map((stat) => (
            <div className="zb-stat" key={stat.label}>
              <span className="zb-stat__value">{stat.value}</span>
              <span className="zb-stat__label">{stat.label}</span>
              <span className="zb-stat__sublabel">{stat.sublabel}</span>
            </div>
          ))}
        </div>

        <div className="zb-badges">
          {TRUST_BADGES.map(({ icon: Icon, label }) => (
            <div className="zb-badge" key={label}>
              <Icon className="zb-badge__icon" />
              <span>{label}</span>
            </div>
          ))}
        </div>

        <p className="zb-note">Buy 3 items and get free delivery</p>
      </section>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

        .zb-footer {
          --zb-navy: #123a76;
          --zb-navy-deep: #0d2c5c;
          --zb-ink: #201c16;
          --zb-ink-soft: #6d6659;
          --zb-card-bg: #fbf9f5;
          --zb-band-bg-1: #e7ded0;
          --zb-band-bg-2: #cabfa8;
          --zb-cream-text: #f2f0ea;
          --zb-hero-photo: url('https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=2200&q=88');

          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
          color: var(--zb-ink);
        }

        .zb-footer * { box-sizing: border-box; }

        .zb-footer button:focus-visible {
          outline: 2px solid var(--zb-navy);
          outline-offset: 2px;
        }

        /* ---------- Hero band ----------
           Layer order (top to bottom): real photo (optional, via
           --zb-hero-photo) -> a generated woven texture (SVG noise run
           through an SVG diffuse-lighting filter, multiplied onto the base
           so it catches light like real fabric) -> a soft top-left highlight
           and bottom-right shadow for depth -> the base warm gradient.
           The ::before wash on top keeps the card/badges readable no
           matter which combination of layers is active. */
        .zb-hero-band {
          position: relative;
          padding: 64px 24px 44px;
          text-align: center;
          overflow: hidden;
          background-image:
            linear-gradient(115deg, rgba(20, 28, 43, 0.44), rgba(20, 28, 43, 0.08) 58%, rgba(7, 12, 21, 0.4)),
            var(--zb-hero-photo),
            url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='240' height='240'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' seed='7' result='noise'/%3E%3CfeDiffuseLighting in='noise' lighting-color='%23ffffff' surfaceScale='2.4' result='light'%3E%3CfeDistantLight azimuth='235' elevation='55'/%3E%3C/feDiffuseLighting%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E"),
            radial-gradient(ellipse at 18% 12%, rgba(255,255,255,0.45), transparent 55%),
            radial-gradient(ellipse at 82% 92%, rgba(40,32,18,0.22), transparent 60%),
            linear-gradient(160deg, var(--zb-band-bg-1), var(--zb-band-bg-2));
          background-blend-mode: normal, normal, multiply, normal, normal, normal;
          background-size: cover, cover, 240px 240px, auto, auto, auto;
          background-position: center, center, center, center, center, center;
          background-repeat: no-repeat, no-repeat, repeat, no-repeat, no-repeat, no-repeat;
        }

        .zb-hero-band::before {
          content: '';
          position: absolute;
          inset: 0;
          background:
            radial-gradient(ellipse at 50% 0%, rgba(255, 255, 255, 0.42), transparent 44%),
            linear-gradient(180deg, rgba(247, 243, 235, 0.5), rgba(219, 209, 189, 0.58));
          pointer-events: none;
        }

        .zb-hero-band > * { position: relative; z-index: 1; }

        /* Card is a floating, "3D" surface: layered shadow + soft inner highlight */
        .zb-stat-card {
          position: relative;
          max-width: 760px;
          margin: 0 auto;
          background: var(--zb-card-bg);
          border-radius: 22px;
          padding: 40px 32px;
          display: flex;
          justify-content: space-between;
          gap: 24px;
          box-shadow:
            0 2px 0 rgba(255, 255, 255, 0.6) inset,
            0 26px 50px -22px rgba(30, 22, 10, 0.35),
            0 10px 20px -12px rgba(30, 22, 10, 0.22);
        }

        .zb-stat {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 6px;
        }

        .zb-stat__value {
          font-size: clamp(2.1rem, 4.4vw, 2.75rem);
          font-weight: 800;
          letter-spacing: -0.01em;
          line-height: 1;
        }

        .zb-stat__label { font-size: 0.95rem; font-weight: 500; }

        .zb-stat__sublabel { font-size: 0.8rem; color: var(--zb-ink-soft); }

        .zb-badges {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 28px;
          margin-top: 40px;
        }

        .zb-badge {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 0.88rem;
          color: var(--zb-ink);
        }

        .zb-badge__icon { flex-shrink: 0; }

        .zb-note {
          margin: 22px 0 0;
          font-size: 0.85rem;
          color: var(--zb-ink-soft);
        }

        /* ---------- Notification / coupon bar ---------- */
        .zb-promo-bar {
          position: relative;
          overflow: hidden;
          background: linear-gradient(180deg, var(--zb-navy), var(--zb-navy-deep));
          color: var(--zb-cream-text);
          padding: 18px 28px;
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
        }

        .zb-promo-bar::after {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(115deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 28%);
          pointer-events: none;
        }

        .zb-promo-bar__text {
          position: relative;
          z-index: 1;
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .zb-promo-bar__icon {
          width: 38px;
          height: 38px;
          flex-shrink: 0;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          background: var(--zb-cream-text);
          color: var(--zb-navy);
          font-weight: 800;
          font-size: 1rem;
          border-radius: 10px;
          box-shadow: 0 6px 14px -6px rgba(0, 0, 0, 0.45);
        }

        .zb-promo-bar__text p {
          margin: 0;
          font-size: 0.95rem;
          font-weight: 500;
        }

        .zb-promo-bar__actions {
          position: relative;
          z-index: 1;
          display: flex;
          align-items: center;
          gap: 22px;
        }

        .zb-btn-allow {
          background: linear-gradient(180deg, #ffffff, #edf1f8);
          color: var(--zb-navy);
          border: none;
          border-radius: 8px;
          padding: 10px 20px;
          font-weight: 700;
          font-size: 0.88rem;
          cursor: pointer;
          box-shadow:
            0 1px 0 rgba(255, 255, 255, 0.8) inset,
            0 10px 18px -8px rgba(0, 0, 0, 0.5);
          transition: transform 0.15s ease, box-shadow 0.15s ease;
        }

        .zb-btn-allow:hover {
          transform: translateY(-1px);
          box-shadow:
            0 1px 0 rgba(255, 255, 255, 0.8) inset,
            0 14px 22px -8px rgba(0, 0, 0, 0.55);
        }

        .zb-btn-allow:active { transform: translateY(0); }

        .zb-btn-decline {
          background: none;
          border: none;
          color: #cbd6ec;
          font-size: 0.88rem;
          font-weight: 600;
          cursor: pointer;
          padding: 4px;
        }

        .zb-btn-decline:hover { color: var(--zb-cream-text); }

        /* ---------- Responsive ---------- */
        @media (max-width: 640px) {
          .zb-stat-card { flex-direction: column; padding: 32px 24px; }
          .zb-promo-bar { flex-direction: column; align-items: flex-start; }
          .zb-promo-bar__actions { width: 100%; justify-content: space-between; }
        }

        @media (prefers-reduced-motion: reduce) {
          .zb-footer * { transition: none !important; }
        }
      `}</style>
    </footer>
  )
}

export default FourthSection