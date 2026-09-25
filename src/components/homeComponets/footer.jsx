import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

/* -------------------------------------------------------------------------
 * Icons
 * Small, dependency-free line icons so this component doesn't need an icon
 * package installed. Swap for lucide-react / heroicons etc. if your project
 * already ships one.
 * ---------------------------------------------------------------------- */

const IconProps = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.6, strokeLinecap: 'round', strokeLinejoin: 'round' }

const IconArrowUp = (props) => (
  <svg viewBox="0 0 24 24" width="20" height="20" {...IconProps} {...props}>
    <path d="M12 19V5M6 11l6-6 6 6" />
  </svg>
)

const IconMail = (props) => (
  <svg viewBox="0 0 24 24" width="16" height="16" {...IconProps} {...props}>
    <rect x="3" y="5" width="18" height="14" rx="2" />
    <path d="M4 7l8 6 8-6" />
  </svg>
)

const IconPhone = (props) => (
  <svg viewBox="0 0 24 24" width="16" height="16" {...IconProps} {...props}>
    <path d="M5 4h3l2 5-2.5 1.5a11 11 0 0 0 5 5L14 13l5 2v3a2 2 0 0 1-2 2A15 15 0 0 1 3 6a2 2 0 0 1 2-2z" />
  </svg>
)

const IconClock = (props) => (
  <svg viewBox="0 0 24 24" width="16" height="16" {...IconProps} {...props}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7v5l3.5 2" />
  </svg>
)

const IconFacebook = (props) => (
  <svg viewBox="0 0 24 24" width="18" height="18" {...IconProps} {...props}>
    <path d="M14.5 9.2H17V6.4h-2.5c-2.2 0-3.8 1.5-3.8 3.7v2H8.5v2.8H10.7V21h2.8v-6.1h2.3l.4-2.8h-2.7V10c0-.5.3-.8 1-.8z" fill="currentColor" stroke="none" />
  </svg>
)

const IconInstagram = (props) => (
  <svg viewBox="0 0 24 24" width="18" height="18" {...IconProps} {...props}>
    <rect x="3" y="3" width="18" height="18" rx="5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17.3" cy="6.7" r="1" fill="currentColor" stroke="none" />
  </svg>
)

const IconTikTok = (props) => (
  <svg viewBox="0 0 24 24" width="18" height="18" {...IconProps} {...props}>
    <path d="M14 4v10.6a3.6 3.6 0 1 1-3.6-3.6c.3 0 .6 0 .9.1" />
    <path d="M14 4a5.6 5.6 0 0 0 5.4 5.6" />
  </svg>
)

const IconYoutube = (props) => (
  <svg viewBox="0 0 24 24" width="18" height="18" {...IconProps} {...props}>
    <rect x="2" y="5" width="20" height="14" rx="4" />
    <path d="M10 9.3l5 2.7-5 2.7z" />
  </svg>
)

/* -------------------------------------------------------------------------
 * Static content
 * Defines Dresser's footer sections (Help / About Dresser /
 * contact details / payment methods / legal links).
 * ---------------------------------------------------------------------- */

const FOOTER_COLUMNS = [
  { heading: 'Help', links: ["FAQ's", 'How to buy', 'Payment', 'BaadMay', 'Shipping & deliveries', 'Exchange & returns'] },
  { heading: 'About Dresser', links: ['About us', 'Contact us', 'Work with us', 'Retail store'] },
]

const SOCIAL_LINKS = [
  { icon: IconFacebook, label: 'Facebook', href: '#' },
  { icon: IconInstagram, label: 'Instagram', href: '#' },
  { icon: IconTikTok, label: 'TikTok', href: '#' },
  { icon: IconYoutube, label: 'YouTube', href: '#' },
]

const PAYMENT_METHODS = ['Visa', 'Mastercard', 'PayFast', 'COD']

const LEGAL_LINKS = ["FAQ's", 'Terms and conditions', 'Privacy policy']

const BACK_TO_TOP_THRESHOLD = 480

/* -------------------------------------------------------------------------
 * Component
 * ---------------------------------------------------------------------- */

const Footer = ({ brandName = 'DRESSER' }) => {
  const [showBackToTop, setShowBackToTop] = useState(false)

  const currentYear = new Date().getFullYear()

  useEffect(() => {
    const handleScroll = () => setShowBackToTop(window.scrollY > BACK_TO_TOP_THRESHOLD)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <footer className="ft-footer">
      {/* ---------------- Main footer columns ---------------- */}
      <section className="ft-main">
        <div className="ft-main__shine" aria-hidden="true" />
        <div className="ft-main__grid">
          <div className="ft-main__brand">
            <span className="ft-brand-name">{brandName}</span>
            <p>Style that moves with you, priced for real life.</p>

            <div className="ft-socials">
              {SOCIAL_LINKS.map(({ icon: Icon, label, href }) => (
                <a href={href} key={label} aria-label={label}>
                  <Icon />
                </a>
              ))}
            </div>

            <div className="ft-contact">
              <p className="ft-contact__heading">Have questions?</p>
              <a href="mailto:customer.care@dresser.com" className="ft-contact__row">
                <IconMail /> customer.care@dresser.com
              </a>
              <a href="tel:+922138402072" className="ft-contact__row">
                <IconPhone /> UAN +92-21-38402072
              </a>
              <span className="ft-contact__row">
                <IconClock /> Mon–Sun, 9:00 AM – 1:00 AM PST
              </span>
            </div>
          </div>

          {FOOTER_COLUMNS.map((column) => (
            <nav className="ft-main__column" key={column.heading} aria-label={column.heading}>
              <h3>{column.heading}</h3>
              <ul>
                {column.links.map((link) => {
                  if (link === 'About us') {
                    return (
                      <li key={link}>
                        <Link to="/shop">{link}</Link>
                      </li>
                    )
                  }

                  return (
                    <li key={link}>
                      <a href="#">{link}</a>
                    </li>
                  )
                })}
              </ul>
            </nav>
          ))}

          <div className="ft-main__column">
            <h3>Payment method</h3>
            <div className="ft-payments">
              {PAYMENT_METHODS.map((method) => (
                <span key={method}>{method}</span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ---------------- Bottom bar ---------------- */}
      <section className="ft-bottom">
        <p>&copy; {currentYear} {brandName}</p>
        <div className="ft-bottom__links">
          {LEGAL_LINKS.map((link) => (
            <a href="#" key={link}>{link}</a>
          ))}
        </div>
      </section>

      {/* ---------------- Back to top ---------------- */}
      <button
        type="button"
        className="ft-back-to-top"
        data-visible={showBackToTop}
        onClick={scrollToTop}
        aria-label="Back to top"
        aria-hidden={!showBackToTop}
        tabIndex={showBackToTop ? 0 : -1}
      >
        <IconArrowUp />
      </button>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

        /* ---------- Design tokens ----------
           A single shining-black palette used by every section
           below, so the whole footer reads as one consistent surface. */
        .ft-footer {
          --ft-bg: #000000;
          --ft-bg-deep: #000000;
          --ft-border: rgba(255, 255, 255, 0.2);
          --ft-text: #ffffff;
          --ft-text-secondary: #ffffff;
          --ft-accent: #ffffff;

          position: relative;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
          color: var(--ft-text);
        }

        .ft-footer * { box-sizing: border-box; }

        .ft-footer a { color: inherit; text-decoration: none; }

        .ft-footer a:focus-visible,
        .ft-footer button:focus-visible {
          outline: 2px solid var(--ft-accent);
          outline-offset: 2px;
        }

        /* ---------- Main footer ---------- */
        .ft-main {
          position: relative;
          overflow: hidden;
          background: var(--ft-bg);
          color: var(--ft-text);
          padding: 56px 24px 48px;
          box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.1);
        }

        .ft-main::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(
            118deg,
            transparent 30%,
            rgba(255, 255, 255, 0.08) 48%,
            transparent 66%
          );
          background-size: 220% 100%;
          animation: ft-shine 12s ease-in-out infinite;
          pointer-events: none;
        }

        .ft-main::after {
          content: '';
          position: absolute;
          inset: 0;
          background: radial-gradient(
            ellipse at 50% -20%,
            rgba(255, 255, 255, 0.08),
            transparent 58%
          );
          opacity: 0.8;
          pointer-events: none;
        }

        .ft-main__shine {
          position: absolute;
          left: 8%;
          right: 8%;
          top: 0;
          height: 1px;
          background: rgba(255, 255, 255, 0.55);
          box-shadow: 0 0 18px rgba(255, 255, 255, 0.28);
          pointer-events: none;
        }

        @keyframes ft-shine {
          0%, 100% { background-position: 140% 0; }
          50% { background-position: -40% 0; }
        }

        .ft-main__grid {
          position: relative;
          z-index: 1;
          max-width: 1120px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: 1.5fr 1fr 1fr 0.9fr;
          gap: 32px;
        }

        .ft-brand-name { font-size: 1.3rem; font-weight: 800; letter-spacing: 0.02em; }

        .ft-main__brand p {
          margin: 10px 0 18px;
          font-size: 0.88rem;
          color: var(--ft-text-secondary);
          max-width: 260px;
        }

        .ft-socials { display: flex; gap: 14px; margin-bottom: 26px; }

        .ft-socials a {
          width: 34px;
          height: 34px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border: 1px solid var(--ft-border);
          border-radius: 50%;
          transition: border-color 0.15s ease, color 0.15s ease, transform 0.15s ease;
        }

        .ft-socials a:hover {
          border-color: var(--ft-accent);
          color: var(--ft-accent);
          transform: translateY(-2px);
        }

        .ft-contact {
          display: flex;
          flex-direction: column;
          gap: 8px;
          padding-top: 18px;
          border-top: 1px solid var(--ft-border);
        }

        .ft-contact__heading {
          margin: 0 0 4px;
          font-size: 0.8rem;
          font-weight: 700;
          color: var(--ft-text);
        }

        .ft-contact__row {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 0.82rem;
          color: var(--ft-text-secondary);
        }

        a.ft-contact__row:hover { color: var(--ft-text); }

        .ft-main__column h3 { margin: 0 0 14px; font-size: 0.9rem; font-weight: 700; }

        .ft-main__column ul {
          list-style: none;
          margin: 0;
          padding: 0;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .ft-main__column a {
          font-size: 0.88rem;
          color: var(--ft-text-secondary);
          transition: color 0.15s ease;
        }

        .ft-main__column a:hover { color: var(--ft-text); }

        .ft-payments {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }

        .ft-payments span {
          border: 1px solid var(--ft-border);
          background: #000000;
          border-radius: 6px;
          padding: 5px 10px;
          font-size: 0.76rem;
          font-weight: 600;
          letter-spacing: 0.02em;
          color: var(--ft-text);
        }

        /* ---------- Bottom bar ---------- */
        .ft-bottom {
          position: relative;
          z-index: 1;
          background: var(--ft-bg-deep);
          border-top: 1px solid var(--ft-border);
          padding: 20px 24px;
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          font-size: 0.8rem;
          color: var(--ft-text-secondary);
        }

        .ft-bottom__links { display: flex; flex-wrap: wrap; gap: 18px; }

        /* ---------- Back to top ---------- */
        .ft-back-to-top {
          position: fixed;
          right: 24px;
          bottom: 24px;
          width: 46px;
          height: 46px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          background: #000000;
          color: #ffffff;
          border: 1px solid #ffffff;
          border-radius: 50%;
          cursor: pointer;
          box-shadow: 0 14px 24px -8px rgba(0, 0, 0, 0.6);
          opacity: 0;
          transform: translateY(12px);
          pointer-events: none;
          transition: opacity 0.2s ease, transform 0.2s ease, box-shadow 0.15s ease;
          z-index: 40;
        }

        .ft-back-to-top[data-visible="true"] {
          opacity: 1;
          transform: translateY(0);
          pointer-events: auto;
        }

        .ft-back-to-top:hover {
          transform: translateY(-3px);
          box-shadow: 0 18px 28px -8px rgba(0, 0, 0, 0.65);
        }

        /* ---------- Responsive ---------- */
        @media (max-width: 900px) {
          .ft-main__grid { grid-template-columns: 1fr 1fr; }
          .ft-main__brand { grid-column: 1 / -1; }
        }

        @media (max-width: 640px) {
          .ft-main__grid { grid-template-columns: 1fr; }
          .ft-back-to-top { right: 16px; bottom: 16px; }
        }

        @media (prefers-reduced-motion: reduce) {
          .ft-footer * { transition: none !important; animation: none !important; }
        }
      `}</style>
    </footer>
  )
}

export default Footer 