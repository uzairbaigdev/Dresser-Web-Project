import { useEffect, useId, useRef, useState } from "react";
import { Link } from "react-router-dom";
import Nav from '../../components/nav/nav.jsx';
import FourthSection from '../../components/homeComponets/FourthSection.jsx';
import Footer from '../../components/homeComponets/footer.jsx';

/* -------------------------------------------------------------------------- */
/*  Dresser — Contact page                                                    */
/*  Requires: react, react-router-dom, Tailwind CSS v3+ (no plugins needed).  */
/*  Props:                                                                    */
/*    shopPath  – route for the collection CTA (default "/shop")              */
/*    onSubmit  – optional async (values) => void, called with the form data. */
/*                Without it, submission is simulated so the page is demo-    */
/*                ready. Throw inside it to surface an error to the visitor.  */
/* -------------------------------------------------------------------------- */

/* ------------------------------ Global styles ----------------------------- */

const PAGE_STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Playfair+Display:wght@500;600;700&display=swap');

  .dr-display { font-family: 'Playfair Display', Georgia, 'Times New Roman', serif; }
  .dr-body    { font-family: 'Inter', ui-sans-serif, system-ui, -apple-system, 'Segoe UI', sans-serif; }

  .dr-reveal { opacity: 0; transform: translateY(24px); transition: opacity 0.8s ease, transform 0.8s ease; }
  .dr-reveal--in { opacity: 1; transform: none; }

  .dr-ping { transform-box: fill-box; transform-origin: center; animation: dr-ping 2.2s ease-out infinite; }
  @keyframes dr-ping { 0% { transform: scale(0.6); opacity: 0.7; } 100% { transform: scale(2.4); opacity: 0; } }

  @media (prefers-reduced-motion: reduce) {
    .dr-reveal { opacity: 1; transform: none; transition: none; }
    .dr-ping { animation: none; opacity: 0; }
  }
`;

/* --------------------------------- Business -------------------------------- */

const BUSINESS = {
  email: "customer.care@dresser.com",
  supportEmail: "support@dresser.com",
  phone: "+92-21-38402072",
  phoneHref: "tel:+922138402072",
  addressLines: ["Dresser Studio", "18 Clifton Road", "Karachi, Pakistan"],
  hours: "Mon–Sun: 9:00 AM – 9:00 PM",
  mapsUrl: "https://www.google.com/maps/search/?api=1&query=Dresser+Studio+18+Clifton+Road+Karachi+Pakistan",
};

/* --------------------------------- Images --------------------------------- */

const photoUrl = (id, width = 1200) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${width}&q=80`;

const PHOTOS = {
  hero: "1628592102751-ba83b0314276",
  showroom: "1502672260266-1c1ef2d93688",
  showroomAccent: "1522708323590-d24dbb6b0267",
  cta: "1665249934445-1de680641f50",
};

/* ---------------------------------- Icons --------------------------------- */

const ICONS = {
  arrow: ["M5 12h14", "m12 5 7 7-7 7"],
  check: ["M20 6 9 17l-5-5"],
  chevron: ["m6 9 6 6 6-6"],
  send: ["m22 2-7 20-4-9-9-4Z", "M22 2 11 13"],
  mail: ["M4 4h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z", "m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"],
  phone: [
    "M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z",
  ],
  pin: ["M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z", "M12 7a3 3 0 1 0 0 6 3 3 0 1 0 0-6"],
  clock: ["M12 2a10 10 0 1 0 0 20 10 10 0 1 0 0-20", "M12 6v6l4 2"],
  chat: ["M7.9 20A9 9 0 1 0 4 16.1L2 22Z"],
  calendar: ["M8 2v4", "M16 2v4", "M3 10h18", "M5 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z"],
  shield: [
    "M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z",
    "m9 12 2 2 4-4",
  ],
  sofa: [
    "M20 9V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v3",
    "M2 11v5a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-5a2 2 0 0 0-4 0v2H6v-2a2 2 0 0 0-4 0Z",
    "M4 18v2",
    "M20 18v2",
  ],
  swatch: ["M4 4h6v16a2 2 0 0 1-4 0V4z", "M10 8.5 14 5l4 4-8 8", "M14 20h6v-4"],
  car: [
    "M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2",
    "M9 17h6",
    "M7 14a2 2 0 1 0 0 4 2 2 0 1 0 0-4",
    "M17 14a2 2 0 1 0 0 4 2 2 0 1 0 0-4",
  ],
  coffee: ["M10 2v2", "M14 2v2", "M6 2v2", "M16 8a1 1 0 0 1 1 1v8a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V9a1 1 0 0 1 1-1h14a4 4 0 1 1 0 8h-1"],
};

const Icon = ({ name, className = "h-6 w-6" }) => (
  <svg
    viewBox="0 0 24 24"
    aria-hidden="true"
    className={className}
    fill="none"
    stroke="currentColor"
    strokeWidth="1.6"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    {ICONS[name].map((d) => (
      <path key={d} d={d} />
    ))}
  </svg>
);

/* --------------------------------- Content -------------------------------- */

const CHANNELS = [
  {
    icon: "mail",
    title: "Email us",
    text: "Questions about pieces, orders or projects? Our care team replies within four business hours.",
    action: BUSINESS.email,
    href: `mailto:${BUSINESS.email}`,
  },
  {
    icon: "phone",
    title: "Call us",
    text: "Speak with a furniture specialist every day between 9:00 AM and 9:00 PM, Pakistan time.",
    action: BUSINESS.phone,
    href: BUSINESS.phoneHref,
  },
  {
    icon: "pin",
    title: "Visit the studio",
    text: "Sit on the sofas, touch the fabrics and meet our designers, by appointment or walk-in.",
    action: "18 Clifton Road, Karachi",
    href: BUSINESS.mapsUrl,
    external: true,
  },
  {
    icon: "chat",
    title: "Order support",
    text: "Delivery tracking, warranty claims and after-care, handled by a dedicated support team.",
    action: BUSINESS.supportEmail,
    href: `mailto:${BUSINESS.supportEmail}`,
  },
];

const FORM_PROMISES = [
  { icon: "clock", title: "A reply within one business day", text: "A real person from our team, never an automated response." },
  { icon: "sofa", title: "Complimentary, no-obligation advice", text: "Consultations and quotations are always free of charge." },
  { icon: "shield", title: "Your details stay private", text: "We never share your information with third parties." },
];

const INQUIRY_TYPES = [
  { value: "styling", label: "Styling consultation" },
  { value: "custom", label: "Custom furniture" },
  { value: "wholesale", label: "Wholesale" },
  { value: "support", label: "Support" },
  { value: "delivery", label: "Delivery" },
];

const AMENITIES = [
  { icon: "sofa", label: "Six fully styled room settings" },
  { icon: "swatch", label: "Fabric & finish library" },
  { icon: "coffee", label: "Complimentary refreshments" },
  { icon: "car", label: "Free on-site parking" },
];

const FAQS = [
  {
    q: "How long does delivery take?",
    a: "In-stock pieces are delivered within 3–5 working days in Karachi and 5–8 working days nationwide. Made-to-order and custom pieces are crafted in 6–8 weeks, and we confirm your delivery window in writing before production begins.",
  },
  {
    q: "Can I customise dimensions, fabrics and finishes?",
    a: "Yes. Most sofas, beds, tables and storage pieces can be made to measure. Choose from over 120 fabrics and 18 wood finishes, and our design team will prepare a dimensioned drawing for your approval.",
  },
  {
    q: "Do you offer complimentary styling consultations?",
    a: "Every customer is entitled to a free 45-minute consultation, in the studio or over video. Bring your floor plan, photos and inspiration, and we will suggest layouts, palettes and proportions.",
  },
  {
    q: "What is your return and warranty policy?",
    a: "In-stock items can be returned within 14 days in original condition. Every Dresser frame carries a 10-year structural warranty, and upholstery and finishes are covered for 2 years. Custom orders are non-returnable but fully covered by warranty.",
  },
  {
    q: "Which payment options are available?",
    a: "We accept major credit and debit cards, bank transfer, and cash on delivery within Karachi. Custom orders require a 50% deposit, with the balance due before delivery. Selected cards offer 0% instalment plans on orders above PKR 150,000.",
  },
  {
    q: "Do you supply trade and wholesale clients?",
    a: "Yes. Interior designers, developers and hospitality clients receive dedicated account management, trade pricing and priority production slots. Select “Wholesale” in the form above and our trade team will contact you within one business day.",
  },
];

/* ------------------------------- Form logic ------------------------------- */

const INITIAL_VALUES = { fullName: "", email: "", phone: "", inquiryType: "styling", message: "" };
const MESSAGE_LIMIT = 600;

const VALIDATORS = {
  fullName: (v) => (v.trim().length >= 2 ? "" : "Please enter your full name."),
  email: (v) => (/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()) ? "" : "Please enter a valid email address."),
  phone: (v) => (/^\+?[0-9\s\-()]{7,20}$/.test(v.trim()) ? "" : "Please enter a valid phone number."),
  message: (v) => (v.trim().length >= 10 ? "" : "Please share a little more detail (at least 10 characters)."),
};

const validate = (values) =>
  Object.keys(VALIDATORS).reduce((errors, key) => {
    const message = VALIDATORS[key](values[key]);
    return message ? { ...errors, [key]: message } : errors;
  }, {});

const simulateRequest = () => new Promise((resolve) => setTimeout(resolve, 900));

/* ---------------------------- Layout primitives --------------------------- */

const CONTAINER = "mx-auto w-full max-w-7xl px-5 sm:px-8 lg:px-10";
const SECTION = "py-20 sm:py-28";

const BUTTON_VARIANTS = {
  primary:
    "bg-[#1f1d1b] text-[#faf7f2] shadow-lg shadow-black/10 hover:-translate-y-0.5 hover:bg-[#9a7640] hover:shadow-xl focus-visible:ring-offset-[#faf7f2]",
  outline:
    "border border-[#1f1d1b]/25 text-[#1f1d1b] hover:-translate-y-0.5 hover:border-[#1f1d1b] hover:bg-[#1f1d1b] hover:text-[#faf7f2] focus-visible:ring-offset-[#faf7f2]",
  gold:
    "bg-[#c9a469] text-[#1f1d1b] shadow-lg shadow-black/20 hover:-translate-y-0.5 hover:bg-[#e2c48f] hover:shadow-xl focus-visible:ring-offset-[#1f1d1b]",
  ghost:
    "border border-white/40 text-white backdrop-blur-sm hover:-translate-y-0.5 hover:border-white hover:bg-white hover:text-[#1f1d1b] focus-visible:ring-offset-[#1f1d1b]",
};

/** Polymorphic button: renders a router Link, an anchor, or a <button>. */
const Button = ({ as: Tag = "button", variant = "primary", arrow = true, icon, className = "", children, ...props }) => (
  <Tag
    className={`group inline-flex items-center justify-center gap-2 rounded-full px-7 py-3.5 text-sm font-semibold tracking-wide transition duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c9a469] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:translate-y-0 ${BUTTON_VARIANTS[variant]} ${className}`}
    {...props}
  >
    {icon && <Icon name={icon} className="h-4 w-4" />}
    {children}
    {arrow && <Icon name="arrow" className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />}
  </Tag>
);

const HEADING_TONES = {
  light: { eyebrow: "text-[#9a7640]", title: "text-[#1f1d1b]", text: "text-stone-600" },
  dark: { eyebrow: "text-[#d4b483]", title: "text-[#faf7f2]", text: "text-stone-300" },
};

const SectionHeading = ({ id, eyebrow, title, description, tone = "light", align = "center" }) => {
  const t = HEADING_TONES[tone];
  return (
    <div className={`max-w-2xl ${align === "center" ? "mx-auto text-center" : ""}`}>
      <p className={`text-xs font-semibold uppercase tracking-[0.28em] ${t.eyebrow}`}>{eyebrow}</p>
      <h2 id={id} className={`dr-display mt-4 text-4xl font-semibold leading-tight sm:text-5xl ${t.title}`}>
        {title}
      </h2>
      {description && <p className={`mt-5 text-base leading-7 sm:text-lg sm:leading-8 ${t.text}`}>{description}</p>}
    </div>
  );
};

/** Image that quietly disappears on error, revealing the container's fallback colour. */
const Photo = ({ id, alt, width = 1200, className = "" }) => (
  <img
    src={photoUrl(id, width)}
    alt={alt}
    loading="lazy"
    decoding="async"
    onError={(event) => {
      event.currentTarget.style.display = "none";
    }}
    className={`h-full w-full object-cover ${className}`}
  />
);

const Reveal = ({ children, delay = 0, className = "" }) => {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return undefined;
    if (typeof IntersectionObserver === "undefined") {
      setVisible(true);
      return undefined;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.12 }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      className={`dr-reveal ${visible ? "dr-reveal--in" : ""} ${className}`}
    >
      {children}
    </div>
  );
};

const scrollToId = (id) => (event) => {
  event.preventDefault();
  const reduceMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
  document.getElementById(id)?.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
};

/* ------------------------------ Small widgets ----------------------------- */

const isShowroomOpen = () => {
  try {
    const hour = parseInt(
      new Intl.DateTimeFormat("en-GB", { timeZone: "Asia/Karachi", hour: "numeric", hourCycle: "h23" }).format(new Date()),
      10
    );
    return hour >= 9 && hour < 21;
  } catch {
    return true;
  }
};

const OpenStatus = ({ className = "" }) => {
  const [open, setOpen] = useState(isShowroomOpen);

  useEffect(() => {
    const timer = setInterval(() => setOpen(isShowroomOpen()), 60000);
    return () => clearInterval(timer);
  }, []);

  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-xs font-semibold ${
        open ? "bg-emerald-50 text-emerald-800" : "bg-stone-200 text-stone-700"
      } ${className}`}
    >
      <span className={`h-2 w-2 rounded-full ${open ? "bg-emerald-500" : "bg-stone-500"}`} />
      {open ? "Open now · until 9:00 PM" : "Closed · opens 9:00 AM"}
    </span>
  );
};

const Spinner = () => (
  <svg viewBox="0 0 24 24" className="h-4 w-4 animate-spin" fill="none" aria-hidden="true">
    <circle cx="12" cy="12" r="9" stroke="currentColor" strokeOpacity="0.25" strokeWidth="3" />
    <path d="M21 12a9 9 0 0 0-9-9" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
  </svg>
);

/* --------------------------------- Sections ------------------------------- */

const DETAIL_ROWS = [
  { icon: "mail", label: "Email", value: BUSINESS.email, href: `mailto:${BUSINESS.email}` },
  { icon: "phone", label: "Phone", value: BUSINESS.phone, href: BUSINESS.phoneHref },
  { icon: "pin", label: "Address", value: BUSINESS.addressLines.join(", "), href: BUSINESS.mapsUrl, external: true },
  { icon: "clock", label: "Hours", value: BUSINESS.hours },
];

const Hero = () => (
  <section aria-labelledby="contact-hero-title" className="relative isolate overflow-hidden bg-[#1f1d1b]">
    <div className="absolute inset-0 -z-10" aria-hidden="true">
      <Photo id={PHOTOS.hero} alt="" width={2000} />
      <div className="absolute inset-0 bg-gradient-to-r from-[#1f1d1b]/95 via-[#1f1d1b]/75 to-[#1f1d1b]/40" />
    </div>

    <div className={`${CONTAINER} grid items-center gap-12 py-24 sm:py-32 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16`}>
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.32em] text-[#d4b483]">Contact Dresser</p>
        <h1
          id="contact-hero-title"
          className="dr-display mt-6 text-5xl font-semibold leading-[1.05] text-[#faf7f2] sm:text-6xl lg:text-7xl"
        >
          Let’s create a home you’ll love coming back to.
        </h1>
        <p className="mt-6 max-w-xl text-base leading-8 text-stone-300 sm:text-lg">
          Whether you are furnishing a single room or an entire residence, our designers and care team are here to
          guide you, from the first idea to the final delivery.
        </p>

        <div className="mt-10 flex flex-col gap-4 sm:flex-row">
          <Button as="a" href="#contact-form" onClick={scrollToId("contact-form")} variant="gold">
            Send Us a Message
          </Button>
          <Button as="a" href={BUSINESS.phoneHref} variant="ghost" arrow={false} icon="phone">
            {BUSINESS.phone}
          </Button>
        </div>

        <ul className="mt-12 flex flex-col gap-3 text-sm text-stone-200 sm:flex-row sm:flex-wrap sm:gap-x-8">
          {["Replies within one business day", "Free design consultations", "Showroom open 7 days"].map((item) => (
            <li key={item} className="flex items-center gap-2">
              <Icon name="check" className="h-4 w-4 text-[#d4b483]" />
              {item}
            </li>
          ))}
        </ul>
      </div>

      <div className="rounded-3xl bg-[#faf7f2] p-6 shadow-2xl shadow-black/30 sm:p-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="dr-display text-3xl font-semibold text-[#1f1d1b]">Contact details</h2>
          <OpenStatus />
        </div>

        <ul className="mt-6 divide-y divide-stone-200">
          {DETAIL_ROWS.map((row) => {
            const content = (
              <>
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#f0e8db] text-[#9a7640] transition duration-300 group-hover:bg-[#1f1d1b] group-hover:text-[#d4b483]">
                  <Icon name={row.icon} className="h-5 w-5" />
                </span>
                <span className="min-w-0">
                  <span className="block text-xs font-semibold uppercase tracking-[0.18em] text-stone-500">
                    {row.label}
                  </span>
                  <span className="mt-0.5 block break-words text-[15px] font-medium text-[#1f1d1b]">{row.value}</span>
                </span>
              </>
            );
            return (
              <li key={row.label}>
                {row.href ? (
                  <a
                    href={row.href}
                    {...(row.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                    className="group flex items-center gap-4 py-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c9a469]"
                  >
                    {content}
                  </a>
                ) : (
                  <div className="flex items-center gap-4 py-4">{content}</div>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  </section>
);

const Channels = () => (
  <section aria-labelledby="channels-title" className={`${SECTION} bg-[#faf7f2]`}>
    <div className={CONTAINER}>
      <Reveal>
        <SectionHeading
          id="channels-title"
          eyebrow="Get in Touch"
          title="However you prefer to reach us"
          description="Choose the channel that suits you. Every enquiry is answered by a real member of the Dresser team."
        />
      </Reveal>

      <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {CHANNELS.map((channel, index) => (
          <Reveal key={channel.title} delay={index * 100}>
            <a
              href={channel.href}
              {...(channel.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
              className="group flex h-full flex-col rounded-3xl border border-stone-200/80 bg-white p-7 shadow-sm transition duration-300 hover:-translate-y-1.5 hover:border-[#c9a469]/60 hover:shadow-xl hover:shadow-stone-900/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c9a469]"
            >
              <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#f4efe6] text-[#9a7640] transition duration-300 group-hover:bg-[#1f1d1b] group-hover:text-[#d4b483]">
                <Icon name={channel.icon} className="h-7 w-7" />
              </span>
              <h3 className="dr-display mt-6 text-2xl font-semibold text-[#1f1d1b]">{channel.title}</h3>
              <p className="mt-3 flex-1 text-[15px] leading-7 text-stone-600">{channel.text}</p>
              <span className="mt-6 flex items-center gap-2 break-all text-sm font-semibold text-[#9a7640]">
                {channel.action}
                <Icon name="arrow" className="h-4 w-4 shrink-0 transition-transform duration-300 group-hover:translate-x-1" />
              </span>
            </a>
          </Reveal>
        ))}
      </div>
    </div>
  </section>
);

/* ------------------------------- Contact form ------------------------------ */

const INPUT_BASE =
  "w-full rounded-xl border bg-white px-4 py-3.5 text-[15px] text-[#1f1d1b] placeholder:text-stone-400 transition duration-200 focus:outline-none focus:ring-2";
const inputState = (hasError) =>
  hasError
    ? "border-red-400 focus:border-red-500 focus:ring-red-200"
    : "border-stone-300 hover:border-stone-400 focus:border-[#9a7640] focus:ring-[#c9a469]/30";

const Field = ({ id, label, error, children }) => (
  <div>
    <label htmlFor={id} className="mb-2 block text-sm font-medium text-[#1f1d1b]">
      {label}
    </label>
    {children}
    {error && (
      <p id={`${id}-error`} role="alert" className="mt-2 text-sm text-red-600">
        {error}
      </p>
    )}
  </div>
);

const ContactForm = ({ onSubmit }) => {
  const [values, setValues] = useState(INITIAL_VALUES);
  const [touched, setTouched] = useState({});
  const [status, setStatus] = useState("idle"); // idle | submitting | success | error
  const [reference, setReference] = useState("");

  const errors = validate(values);
  const showError = (name) => (touched[name] ? errors[name] : "");

  const handleChange = (event) => {
    const { name, value } = event.target;
    setValues((current) => ({ ...current, [name]: value }));
  };

  const handleBlur = (event) => {
    const { name } = event.target;
    setTouched((current) => ({ ...current, [name]: true }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (status === "submitting") return;

    const firstInvalid = Object.keys(errors)[0];
    if (firstInvalid) {
      setTouched({ fullName: true, email: true, phone: true, message: true });
      document.getElementById(firstInvalid)?.focus();
      return;
    }

    setStatus("submitting");
    try {
      await (onSubmit ? onSubmit(values) : simulateRequest());
      setReference(`DR-${Date.now().toString(36).toUpperCase().slice(-6)}`);
      setStatus("success");
    } catch {
      setStatus("error");
    }
  };

  const reset = () => {
    setValues(INITIAL_VALUES);
    setTouched({});
    setStatus("idle");
  };

  if (status === "success") {
    return (
      <div role="status" className="flex h-full flex-col items-center justify-center rounded-3xl bg-white p-10 text-center shadow-xl shadow-stone-900/5 sm:p-14">
        <span className="flex h-16 w-16 items-center justify-center rounded-full bg-[#1f1d1b] text-[#d4b483]">
          <Icon name="check" className="h-8 w-8" />
        </span>
        <h3 className="dr-display mt-6 text-3xl font-semibold text-[#1f1d1b]">
          Thank you, {values.fullName.trim().split(" ")[0]}.
        </h3>
        <p className="mt-4 max-w-sm text-[15px] leading-7 text-stone-600">
          Your message has been received. A member of the Dresser team will reply to {values.email.trim()} within one
          business day.
        </p>
        <p className="mt-6 rounded-full bg-[#f4efe6] px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#9a7640]">
          Reference {reference}
        </p>
        <Button type="button" variant="outline" arrow={false} onClick={reset} className="mt-8">
          Send another message
        </Button>
      </div>
    );
  }

  const describe = (name) => (showError(name) ? `${name}-error` : undefined);

  return (
    <form
      noValidate
      onSubmit={handleSubmit}
      aria-label="Contact Dresser"
      className="rounded-3xl bg-white p-6 shadow-xl shadow-stone-900/5 sm:p-10"
    >
      <div className="grid gap-6 sm:grid-cols-2">
        <Field id="fullName" label="Full name" error={showError("fullName")}>
          <input
            id="fullName"
            name="fullName"
            type="text"
            autoComplete="name"
            placeholder="e.g. Ayesha Khan"
            value={values.fullName}
            onChange={handleChange}
            onBlur={handleBlur}
            aria-invalid={Boolean(showError("fullName"))}
            aria-describedby={describe("fullName")}
            className={`${INPUT_BASE} ${inputState(showError("fullName"))}`}
          />
        </Field>

        <Field id="phone" label="Phone number" error={showError("phone")}>
          <input
            id="phone"
            name="phone"
            type="tel"
            autoComplete="tel"
            placeholder="+92 300 1234567"
            value={values.phone}
            onChange={handleChange}
            onBlur={handleBlur}
            aria-invalid={Boolean(showError("phone"))}
            aria-describedby={describe("phone")}
            className={`${INPUT_BASE} ${inputState(showError("phone"))}`}
          />
        </Field>
      </div>

      <div className="mt-6">
        <Field id="email" label="Email address" error={showError("email")}>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            value={values.email}
            onChange={handleChange}
            onBlur={handleBlur}
            aria-invalid={Boolean(showError("email"))}
            aria-describedby={describe("email")}
            className={`${INPUT_BASE} ${inputState(showError("email"))}`}
          />
        </Field>
      </div>

      <fieldset className="mt-6">
        <legend className="mb-3 text-sm font-medium text-[#1f1d1b]">What can we help you with?</legend>
        <div className="flex flex-wrap gap-2.5">
          {INQUIRY_TYPES.map((type) => (
            <label key={type.value} className="cursor-pointer">
              <input
                type="radio"
                name="inquiryType"
                value={type.value}
                checked={values.inquiryType === type.value}
                onChange={handleChange}
                className="peer sr-only"
              />
              <span className="inline-flex rounded-full border border-stone-300 bg-white px-4 py-2 text-sm font-medium text-stone-700 transition duration-200 hover:border-[#9a7640] hover:text-[#1f1d1b] peer-checked:border-[#1f1d1b] peer-checked:bg-[#1f1d1b] peer-checked:text-[#faf7f2] peer-focus-visible:ring-2 peer-focus-visible:ring-[#c9a469] peer-focus-visible:ring-offset-2">
                {type.label}
              </span>
            </label>
          ))}
        </div>
      </fieldset>

      <div className="mt-6">
        <Field id="message" label="Your message" error={showError("message")}>
          <textarea
            id="message"
            name="message"
            rows={5}
            maxLength={MESSAGE_LIMIT}
            placeholder="Tell us about your space, the pieces you are considering, or how we can help."
            value={values.message}
            onChange={handleChange}
            onBlur={handleBlur}
            aria-invalid={Boolean(showError("message"))}
            aria-describedby={describe("message")}
            className={`${INPUT_BASE} resize-y ${inputState(showError("message"))}`}
          />
        </Field>
        <p className="mt-2 text-right text-xs text-stone-500" aria-live="polite">
          {values.message.length} / {MESSAGE_LIMIT}
        </p>
      </div>

      {status === "error" && (
        <p role="alert" className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
          Something went wrong while sending your message. Please try again, or email us at {BUSINESS.email}.
        </p>
      )}

      <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <Button type="submit" disabled={status === "submitting"} arrow={status !== "submitting"} className="w-full sm:w-auto">
          {status === "submitting" ? (
            <>
              <Spinner />
              Sending…
            </>
          ) : (
            "Send Message"
          )}
        </Button>
        <p className="text-xs leading-5 text-stone-500 sm:max-w-[16rem]">
          By sending this form you agree to be contacted about your enquiry.
        </p>
      </div>
    </form>
  );
};

const FormSection = ({ onSubmit }) => (
  <section id="contact-form" aria-labelledby="form-title" className={`${SECTION} scroll-mt-4 bg-[#f4efe6]`}>
    <div className={`${CONTAINER} grid gap-14 lg:grid-cols-[0.85fr_1.15fr] lg:gap-20`}>
      <Reveal>
        <SectionHeading
          id="form-title"
          align="left"
          eyebrow="Send a Message"
          title="Tell us about your space"
          description="Share a few details and the right specialist will get back to you with thoughtful, personal advice."
        />

        <ul className="mt-10 space-y-6">
          {FORM_PROMISES.map((promise) => (
            <li key={promise.title} className="flex items-start gap-4">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white text-[#9a7640] shadow-sm">
                <Icon name={promise.icon} className="h-6 w-6" />
              </span>
              <span>
                <span className="block font-semibold text-[#1f1d1b]">{promise.title}</span>
                <span className="mt-1 block text-[15px] leading-7 text-stone-600">{promise.text}</span>
              </span>
            </li>
          ))}
        </ul>

        <div className="mt-10 rounded-2xl border border-[#c9a469]/40 bg-white/60 p-6">
          <p className="dr-display text-2xl font-semibold text-[#1f1d1b]">Prefer to talk it through?</p>
          <p className="mt-2 text-[15px] leading-7 text-stone-600">
            Call our studio any day between 9:00 AM and 9:00 PM.
          </p>
          <a
            href={BUSINESS.phoneHref}
            className="mt-3 inline-flex items-center gap-2 text-lg font-semibold text-[#9a7640] transition hover:text-[#1f1d1b] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c9a469]"
          >
            <Icon name="phone" className="h-5 w-5" />
            {BUSINESS.phone}
          </a>
        </div>
      </Reveal>

      <Reveal delay={120}>
        <ContactForm onSubmit={onSubmit} />
      </Reveal>
    </div>
  </section>
);

/* --------------------------- Showroom + map block -------------------------- */

const MapIllustration = () => (
  <svg
    viewBox="0 0 800 420"
    preserveAspectRatio="xMidYMid slice"
    role="img"
    aria-label="Illustrated map showing Dresser Studio on Clifton Road, Karachi"
    className="h-full w-full"
  >
    <rect width="800" height="420" fill="#efe8dc" />
    <path d="M0 322 C120 300 230 350 350 338 C480 325 610 372 800 340 L800 420 L0 420 Z" fill="#d9e2df" />
    <rect x="70" y="50" width="150" height="90" rx="16" fill="#e3e6d3" />
    <rect x="500" y="40" width="190" height="100" rx="16" fill="#e3e6d3" />
    <rect x="560" y="200" width="150" height="80" rx="16" fill="#e8dfcf" />
    <g fill="none" strokeLinecap="round" stroke="#fbf8f2">
      <path d="M-20 200 C200 190 420 215 820 190" strokeWidth="22" />
      <path d="M300 -10 C310 120 290 300 320 430" strokeWidth="16" />
      <path d="M560 -10 C550 100 570 240 540 430" strokeWidth="12" />
      <path d="M-20 120 H820" strokeWidth="7" />
      <path d="M-20 285 H820" strokeWidth="7" />
      <path d="M150 -10 V430" strokeWidth="7" />
      <path d="M700 -10 V430" strokeWidth="7" />
    </g>
    <text x="90" y="186" fontSize="14" fontWeight="600" letterSpacing="3" fill="#9a8f80">
      CLIFTON ROAD
    </text>
    <text x="330" y="395" fontSize="13" fontWeight="600" letterSpacing="4" fill="#8aa09a">
      ARABIAN SEA
    </text>
    <g transform="translate(380 190)">
      <circle className="dr-ping" r="16" fill="#9a7640" />
      <path d="M0 -34c-13 0-23 10-23 23 0 17 23 40 23 40s23-23 23-40c0-13-10-23-23-23z" fill="#1f1d1b" />
      <circle cy="-11" r="8" fill="#d4b483" />
    </g>
  </svg>
);

const Showroom = () => (
  <section aria-labelledby="showroom-title" className={`${SECTION} overflow-hidden bg-[#faf7f2]`}>
    <div className={CONTAINER}>
      <div className="grid items-center gap-14 lg:grid-cols-2 lg:gap-20">
        <Reveal>
          <div className="relative pb-10 pr-6 sm:pr-10">
            <div className="aspect-[4/5] overflow-hidden rounded-3xl bg-stone-200 shadow-2xl shadow-stone-900/10">
              <Photo id={PHOTOS.showroom} alt="Styled seating area inside the Dresser Studio showroom" width={1100} />
            </div>
            <div className="absolute bottom-0 right-0 aspect-square w-2/5 overflow-hidden rounded-2xl border-[6px] border-[#faf7f2] bg-stone-300 shadow-xl">
              <Photo id={PHOTOS.showroomAccent} alt="Furniture display at Dresser Studio" width={600} />
            </div>
            <OpenStatus className="absolute left-5 top-5 shadow-md backdrop-blur" />
          </div>
        </Reveal>

        <Reveal delay={120}>
          <SectionHeading
            id="showroom-title"
            align="left"
            eyebrow="The Showroom"
            title="Visit Dresser Studio"
            description="Our Clifton showroom brings every collection to life in styled room settings, so you can feel the craftsmanship before you commit."
          />

          <address className="mt-8 not-italic">
            <p className="dr-display text-2xl font-semibold text-[#1f1d1b]">{BUSINESS.addressLines[0]}</p>
            <p className="mt-1 text-base leading-7 text-stone-600">
              {BUSINESS.addressLines[1]}, {BUSINESS.addressLines[2]}
            </p>
          </address>

          <dl className="mt-6 divide-y divide-stone-200 rounded-2xl border border-stone-200 bg-white">
            <div className="flex flex-wrap justify-between gap-2 px-5 py-4 text-[15px]">
              <dt className="font-medium text-[#1f1d1b]">Monday – Sunday</dt>
              <dd className="text-stone-600">9:00 AM – 9:00 PM</dd>
            </div>
            <div className="flex flex-wrap justify-between gap-2 px-5 py-4 text-[15px]">
              <dt className="font-medium text-[#1f1d1b]">Private consultations</dt>
              <dd className="text-stone-600">By appointment, from 8:00 AM</dd>
            </div>
          </dl>

          <ul className="mt-8 grid gap-4 sm:grid-cols-2">
            {AMENITIES.map((item) => (
              <li key={item.label} className="flex items-center gap-3 text-[15px] text-stone-700">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#f0e8db] text-[#9a7640]">
                  <Icon name={item.icon} className="h-5 w-5" />
                </span>
                {item.label}
              </li>
            ))}
          </ul>
        </Reveal>
      </div>

      <Reveal className="mt-16">
        <div className="relative h-[380px] overflow-hidden rounded-3xl border border-stone-200 bg-[#efe8dc] shadow-xl shadow-stone-900/5 sm:h-[440px]">
          <MapIllustration />
          <div className="absolute inset-x-4 bottom-4 rounded-2xl bg-white/95 p-5 shadow-xl backdrop-blur sm:inset-x-auto sm:bottom-6 sm:left-6 sm:max-w-sm sm:p-6">
            <p className="dr-display text-2xl font-semibold text-[#1f1d1b]">Find us on Clifton Road</p>
            <p className="mt-1 text-sm leading-6 text-stone-600">
              Ten minutes from Boat Basin, with free parking directly outside the studio.
            </p>
            <Button
              as="a"
              href={BUSINESS.mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 w-full sm:w-auto"
            >
              Get Directions
            </Button>
          </div>
        </div>
      </Reveal>
    </div>
  </section>
);

/* ----------------------------------- FAQ ---------------------------------- */

const FaqItem = ({ item, open, onToggle }) => {
  const uid = useId();
  const buttonId = `${uid}-button`;
  const panelId = `${uid}-panel`;

  return (
    <div
      className={`rounded-2xl border bg-white transition duration-300 ${
        open ? "border-[#c9a469]/60 shadow-lg shadow-stone-900/5" : "border-stone-200 hover:border-stone-300"
      }`}
    >
      <h3>
        <button
          type="button"
          id={buttonId}
          aria-expanded={open}
          aria-controls={panelId}
          onClick={onToggle}
          className="flex w-full items-center justify-between gap-4 rounded-2xl px-6 py-5 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c9a469]"
        >
          <span className="dr-display text-xl font-semibold text-[#1f1d1b] sm:text-2xl">{item.q}</span>
          <span
            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full transition duration-300 ${
              open ? "rotate-180 bg-[#1f1d1b] text-[#d4b483]" : "bg-[#f4efe6] text-[#9a7640]"
            }`}
          >
            <Icon name="chevron" className="h-5 w-5" />
          </span>
        </button>
      </h3>
      <div
        id={panelId}
        role="region"
        aria-labelledby={buttonId}
        className={`grid transition-[grid-template-rows] duration-300 ease-out ${open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}
      >
        <div className="overflow-hidden">
          <p className="px-6 pb-6 text-[15px] leading-7 text-stone-600">{item.a}</p>
        </div>
      </div>
    </div>
  );
};

const Faq = () => {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <section aria-labelledby="faq-title" className={`${SECTION} bg-[#f4efe6]`}>
      <div className={`${CONTAINER} grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20`}>
        <Reveal>
          <SectionHeading
            id="faq-title"
            align="left"
            eyebrow="Help Centre"
            title="Answers to common questions"
            description="Can’t find what you are looking for? Our care team is happy to help."
          />
          <div className="mt-8 flex flex-col gap-3 sm:flex-row lg:flex-col xl:flex-row">
            <Button as="a" href={`mailto:${BUSINESS.email}`} variant="outline" arrow={false} icon="mail">
              Email care team
            </Button>
            <Button as="a" href={BUSINESS.phoneHref} variant="outline" arrow={false} icon="phone">
              Call the studio
            </Button>
          </div>
        </Reveal>

        <Reveal delay={120}>
          <div className="space-y-4">
            {FAQS.map((item, index) => (
              <FaqItem
                key={item.q}
                item={item}
                open={openIndex === index}
                onToggle={() => setOpenIndex(openIndex === index ? -1 : index)}
              />
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
};

/* ------------------------------ Final CTA + news --------------------------- */

const Newsletter = () => {
  const [email, setEmail] = useState("");
  const [state, setState] = useState("idle"); // idle | invalid | done

  const handleSubmit = (event) => {
    event.preventDefault();
    if (VALIDATORS.email(email)) {
      setState("invalid");
      return;
    }
    setState("done");
  };

  if (state === "done") {
    return (
      <div role="status" className="rounded-2xl border border-white/15 bg-white/10 p-6 backdrop-blur">
        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#c9a469] text-[#1f1d1b]">
          <Icon name="check" className="h-5 w-5" />
        </span>
        <p className="dr-display mt-4 text-2xl font-semibold text-[#faf7f2]">Welcome to the Journal.</p>
        <p className="mt-1 text-sm leading-6 text-stone-300">Your first issue will arrive in your inbox shortly.</p>
      </div>
    );
  }

  return (
    <form noValidate onSubmit={handleSubmit} className="rounded-2xl border border-white/15 bg-white/10 p-6 backdrop-blur">
      <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#d4b483]">The Dresser Journal</p>
      <p className="dr-display mt-3 text-2xl font-semibold text-[#faf7f2]">Design notes & private previews</p>
      <p className="mt-2 text-sm leading-6 text-stone-300">
        New arrivals, styling ideas and invitations to private sales, twice a month. Unsubscribe anytime.
      </p>

      <label htmlFor="newsletter-email" className="sr-only">
        Email address
      </label>
      <div className="mt-5 flex flex-col gap-3 sm:flex-row">
        <input
          id="newsletter-email"
          type="email"
          autoComplete="email"
          placeholder="Your email address"
          value={email}
          onChange={(event) => {
            setEmail(event.target.value);
            if (state === "invalid") setState("idle");
          }}
          aria-invalid={state === "invalid"}
          aria-describedby={state === "invalid" ? "newsletter-error" : undefined}
          className="min-w-0 flex-1 rounded-full border border-white/25 bg-white/10 px-5 py-3.5 text-sm text-white placeholder:text-stone-400 focus:border-[#d4b483] focus:outline-none focus:ring-2 focus:ring-[#c9a469]/40"
        />
        <Button type="submit" variant="gold" arrow={false}>
          Subscribe
        </Button>
      </div>
      {state === "invalid" && (
        <p id="newsletter-error" role="alert" className="mt-3 text-sm text-red-300">
          Please enter a valid email address.
        </p>
      )}
    </form>
  );
};

const FinalCta = ({ shopPath }) => (
  <section aria-labelledby="cta-title" className="bg-[#faf7f2] px-5 pb-20 sm:px-8 sm:pb-28 lg:px-10">
    <Reveal>
      <div className="relative isolate mx-auto max-w-7xl overflow-hidden rounded-[2rem] bg-[#1f1d1b]">
        <div className="absolute inset-0 -z-10" aria-hidden="true">
          <Photo id={PHOTOS.cta} alt="" width={1800} />
          <div className="absolute inset-0 bg-[#1f1d1b]/80" />
        </div>

        <div className="grid items-center gap-12 px-6 py-16 sm:px-12 sm:py-24 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.32em] text-[#d4b483]">Begin your project</p>
            <h2 id="cta-title" className="dr-display mt-5 text-4xl font-semibold leading-tight text-[#faf7f2] sm:text-6xl">
              Book a consultation and start your project.
            </h2>
            <p className="mt-6 max-w-xl text-base leading-8 text-stone-300 sm:text-lg">
              Sit down with a Dresser designer for a complimentary 45-minute session. No obligation, just thoughtful
              ideas for the space you have in mind.
            </p>

            <div className="mt-9 flex flex-col gap-4 sm:flex-row">
              <Button as="a" href="#contact-form" onClick={scrollToId("contact-form")} variant="gold" icon="calendar" arrow={false}>
                Book a Consultation
              </Button>
              <Button as={Link} to={shopPath} variant="ghost">
                Browse the Collection
              </Button>
            </div>

            <p className="mt-8 text-xs text-stone-400">
              Free fabric &amp; finish samples · 10-year warranty · Nationwide delivery
            </p>
          </div>

          <Newsletter />
        </div>
      </div>
    </Reveal>
  </section>
);

/* ---------------------------------- Page ---------------------------------- */

const Contact = ({ shopPath = "/shop", onSubmit }) => (
  <>
    <Nav forceSolid />
    <main className="dr-body overflow-x-hidden bg-[#faf7f2] text-stone-700 antialiased">
      <style>{PAGE_STYLES}</style>

      <Hero />
      <Channels />
      <FormSection onSubmit={onSubmit} />
      <Showroom />
      <Faq />
      <FinalCta shopPath={shopPath} />
    </main>
    <FourthSection />
    <Footer />
  </>
);

export default Contact;