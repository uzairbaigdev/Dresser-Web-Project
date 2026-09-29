import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import Nav from '../../components/nav/nav.jsx';
import FourthSection from '../../components/homeComponets/FourthSection.jsx';
import Footer from '../../components/homeComponets/footer.jsx';

/* -------------------------------------------------------------------------- */
/*  Dresser — About page                                                      */
/*  Requires: react, react-router-dom, Tailwind CSS v3+ (no plugins needed).  */
/*  Optional props let you point the CTAs at your real routes.                */
/* -------------------------------------------------------------------------- */

/* ------------------------------ Global styles ----------------------------- */

const PAGE_STYLES = `
  .dr-display { font-family: var(--font-serif); }
  .dr-body    { font-family: var(--font-sans); }

  .dr-reveal { opacity: 0; transform: translateY(24px); transition: opacity 0.8s ease, transform 0.8s ease; }
  .dr-reveal--in { opacity: 1; transform: none; }

  @media (prefers-reduced-motion: reduce) {
    .dr-reveal { opacity: 1; transform: none; transition: none; }
  }
`;

/* --------------------------------- Images --------------------------------- */

const photoUrl = (id, width = 1200) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${width}&q=80`;

const PHOTOS = {
  hero: "1618221469555-7f3ad97540d6",
  story: "1738168279272-c08d6dd22002",
  storyAccent: "1560448204-e02f11c3d0e2",
  materials: "1561297331-a9c00b9c2c44",
  joinery: "1631396326646-c06a935ff3a6",
  legacy: "1626081063434-79a2169791b1",
  cta: "1589834390005-5d4fb9bf3d32",
  elena: "1580489944761-15a19d654956",
  daniel: "1500648767791-00dcc994a43e",
  sofia: "1564805280186-5d7056d538ca",
};

/* ---------------------------------- Icons --------------------------------- */

const ICONS = {
  arrow: ["M5 12h14", "m12 5 7 7-7 7"],
  check: ["M20 6 9 17l-5-5"],
  star: ["M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"],
  leaf: [
    "M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z",
    "M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12",
  ],
  ruler: [
    "M21.3 15.3a2.4 2.4 0 0 1 0 3.4l-2.6 2.6a2.4 2.4 0 0 1-3.4 0L2.7 8.7a2.41 2.41 0 0 1 0-3.4l2.6-2.6a2.41 2.41 0 0 1 3.4 0Z",
    "m14.5 12.5 2-2",
    "m11.5 9.5 2-2",
    "m8.5 6.5 2-2",
    "m17.5 15.5 2-2",
  ],
  sofa: [
    "M20 9V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v3",
    "M2 11v5a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-5a2 2 0 0 0-4 0v2H6v-2a2 2 0 0 0-4 0Z",
    "M4 18v2",
    "M20 18v2",
  ],
  truck: [
    "M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2",
    "M15 18H9",
    "M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H14",
    "M17 16a2 2 0 1 0 0 4 2 2 0 1 0 0-4",
    "M7 16a2 2 0 1 0 0 4 2 2 0 1 0 0-4",
  ],
  shield: [
    "M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z",
    "m9 12 2 2 4-4",
  ],
  gem: ["M6 3h12l4 6-10 13L2 9Z", "M11 3 8 9l4 13 4-13-3-6", "M2 9h20"],
};

const Icon = ({ name, className = "h-6 w-6", filled = false }) => (
  <svg
    viewBox="0 0 24 24"
    aria-hidden="true"
    className={className}
    fill={filled ? "currentColor" : "none"}
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

const HERO_ASSURANCES = ["Handcrafted in small batches", "10-year structural warranty", "White-glove delivery"];

const STATS = [
  { end: 15, suffix: "+", label: "Years of craftsmanship", note: "Building furniture since 2011" },
  { end: 12500, suffix: "+", label: "Homes furnished", note: "Across Pakistan and abroad" },
  { end: 98, suffix: "%", label: "Customer satisfaction", note: "From post-delivery surveys" },
  { end: 900, suffix: "+", label: "Design projects", note: "Residential & hospitality" },
];

const BENEFITS = [
  {
    icon: "leaf",
    title: "Responsibly sourced materials",
    text: "Kiln-dried European oak, American walnut and full-grain leather from certified suppliers, with full traceability.",
  },
  {
    icon: "ruler",
    title: "Made-to-measure customization",
    text: "Choose dimensions, finishes and upholstery from 120+ fabrics and 18 wood tones, tailored to your room.",
  },
  {
    icon: "sofa",
    title: "Complimentary design consultation",
    text: "Plan layouts, palettes and proportions one-on-one with a Dresser interior designer before you commit.",
  },
  {
    icon: "truck",
    title: "White-glove delivery",
    text: "Scheduled delivery, careful assembly and packaging removal, handled by our own trained crews.",
  },
  {
    icon: "shield",
    title: "10-year structural warranty",
    text: "Every frame is guaranteed for a decade. If something isn’t right, we repair or replace it. No fine print.",
  },
  {
    icon: "gem",
    title: "Heirloom-grade finishing",
    text: "Hand-sanded and finished with low-VOC oils that age gracefully and can be refreshed for years to come.",
  },
];

const VALUES = [
  {
    photo: PHOTOS.materials,
    alt: "Craftsman sanding a solid wood surface in the Dresser workshop",
    eyebrow: "Craftsmanship 01",
    title: "Honest materials, nothing hidden",
    text: "We build with what lasts: solid hardwoods, natural fibres and leathers that grow more beautiful with use. If it can’t be repaired, refinished or reupholstered, it doesn’t leave our workshop.",
    points: ["Solid hardwoods, never veneered MDF", "Full-grain leather and natural-fibre textiles", "Water-based, low-VOC finishes"],
  },
  {
    photo: PHOTOS.joinery,
    alt: "Furniture maker assembling a chair by hand",
    eyebrow: "Craftsmanship 02",
    title: "Master joinery, made by hand",
    text: "Dovetails, mortise-and-tenon joints and hand-fitted details are the quiet difference between furniture that wobbles in five years and furniture that’s handed down in fifty.",
    points: ["Traditional joinery in every frame", "Each piece inspected and signed by its maker", "Finished by hand in small batches"],
  },
  {
    photo: PHOTOS.legacy,
    alt: "Artisan carrying a finished solid wood table",
    eyebrow: "Craftsmanship 03",
    title: "Designed for generations",
    text: "We favour timeless silhouettes over passing trends, and we stand behind them with repair, refinishing and take-back services, so your pieces stay in your home and out of landfill.",
    points: ["Timeless, proportion-led design", "Lifetime repair and refinishing service", "Take-back programme for pre-loved pieces"],
  },
];

const TEAM = [
  {
    photo: PHOTOS.elena,
    name: "Elena Marlowe",
    role: "Founder & Creative Director",
    bio: "A trained interior architect, Elena sets the design language of every collection and still sketches each new piece by hand.",
  },
  {
    photo: PHOTOS.daniel,
    name: "Daniel Whitmore",
    role: "Co-founder & Master Craftsman",
    bio: "Third-generation joiner and head of our workshop. Daniel has personally inspected more than 9,000 Dresser pieces.",
  },
  {
    photo: PHOTOS.sofia,
    name: "Sofia Reyes",
    role: "Head of Interior Design",
    bio: "Sofia leads our consultation studio, helping customers turn a floor plan and a feeling into a home that feels finished.",
  },
];

const PROCESS = [
  { step: "01", title: "Discover", text: "We learn how you live, your space, your style and your budget, in person or over video." },
  { step: "02", title: "Design", text: "Your designer prepares layouts, material samples and a clear, itemised proposal." },
  { step: "03", title: "Craft", text: "Our makers build your pieces to order in our Karachi workshop, typically in 6 to 8 weeks." },
  { step: "04", title: "Finish", text: "Hand-finishing, quality inspection and protective packing before anything leaves the studio." },
  { step: "05", title: "Deliver", text: "White-glove delivery and placement, plus a follow-up visit to make sure everything is perfect." },
];

const TESTIMONIALS = [
  {
    quote: "The Alder dining table has become the heart of our home. The joinery is flawless and the team guided us through every decision. It feels like it has always belonged here.",
    name: "Amelia Hartley",
    place: "Karachi, PK",
    product: "Alder Dining Table",
  },
  {
    quote: "We furnished our entire living space with Dresser. Delivery was seamless and the quality is a step above anything we have owned. Worth every penny.",
    name: "Marcus Chen",
    place: "Lahore, PK",
    product: "Living Room Collection",
  },
  {
    quote: "Our designer understood our style instantly. The custom sideboard fits the alcove perfectly and the finish is absolutely stunning.",
    name: "Priya Nair",
    place: "Dubai, UAE",
    product: "Custom Sideboard",
  },
];

/* ---------------------------- Layout primitives --------------------------- */

const CONTAINER = "mx-auto w-full max-w-7xl px-5 sm:px-8 lg:px-10";
const SECTION = "py-20 sm:py-28";

const BUTTON_VARIANTS = {
  primary:
    "bg-black text-white shadow-lg shadow-black/10 hover:-translate-y-0.5 hover:bg-neutral-800 hover:shadow-xl",
  outline:
    "border border-black/20 text-black hover:-translate-y-0.5 hover:border-black hover:bg-black hover:text-white",
  gold:
    "bg-black text-white shadow-lg shadow-black/15 hover:-translate-y-0.5 hover:bg-neutral-800 hover:shadow-xl",
  ghost:
    "border border-white/40 text-white backdrop-blur-sm hover:-translate-y-0.5 hover:border-white hover:bg-white hover:text-black",
};

const LinkButton = ({ to, variant = "primary", children }) => (
  <Link
    to={to}
    className={`group inline-flex items-center justify-center gap-2 rounded-full px-7 py-3.5 text-sm font-semibold tracking-wide transition duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2 focus-visible:ring-offset-white ${BUTTON_VARIANTS[variant]}`}
  >
    {children}
    <Icon name="arrow" className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
  </Link>
);

const HEADING_TONES = {
  light: { eyebrow: "text-black", title: "text-black", text: "text-stone-600" },
  dark: { eyebrow: "text-white/70", title: "text-white", text: "text-stone-300" },
};

const SectionHeading = ({ id, eyebrow, title, description, tone = "light", align = "center" }) => {
  const t = HEADING_TONES[tone];
  return (
    <div className={`max-w-2xl ${align === "center" ? "mx-auto text-center" : ""}`}>
      <p className={`text-xs font-semibold uppercase tracking-[0.28em] ${t.eyebrow}`}>{eyebrow}</p>
      <h2 id={id} className={`dr-display mt-4 text-4xl font-semibold leading-tight sm:text-5xl ${t.title}`}>
        {title}
      </h2>
      {description && (
        <p className={`mt-5 text-base leading-7 sm:text-lg sm:leading-8 ${t.text}`}>{description}</p>
      )}
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

/* ------------------------------ Motion helpers ---------------------------- */

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
      { threshold: 0.15 }
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

const CountUp = ({ end, suffix = "", duration = 1600 }) => {
  const ref = useRef(null);
  const [value, setValue] = useState(0);

  useEffect(() => {
    const node = ref.current;
    if (!node) return undefined;
    const reduceMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion || typeof IntersectionObserver === "undefined") {
      setValue(end);
      return undefined;
    }

    let frame = 0;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        const startedAt = performance.now();
        const tick = (now) => {
          const progress = Math.min((now - startedAt) / duration, 1);
          setValue(end * (1 - Math.pow(1 - progress, 3)));
          if (progress < 1) frame = requestAnimationFrame(tick);
        };
        frame = requestAnimationFrame(tick);
      },
      { threshold: 0.4 }
    );
    observer.observe(node);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [end, duration]);

  return (
    <span ref={ref}>
      {Math.round(value).toLocaleString("en-US")}
      {suffix}
    </span>
  );
};

const Stars = () => (
  <div className="flex gap-1 text-black" role="img" aria-label="Rated 5 out of 5 stars">
    {Array.from({ length: 5 }, (_, i) => (
      <Icon key={i} name="star" filled className="h-4 w-4" />
    ))}
  </div>
);

/* --------------------------------- Sections ------------------------------- */

const Hero = ({ shopPath, contactPath }) => (
  <section
    aria-labelledby="about-hero-title"
    className="relative isolate flex min-h-[92vh] items-center overflow-hidden bg-black"
  >
    <div className="absolute inset-0 -z-10" aria-hidden="true">
      <Photo id={PHOTOS.hero} alt="" width={2000} />
      <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/75 to-black/40" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
    </div>

    <div className={`${CONTAINER} py-28 sm:py-32`}>
      <div className="max-w-2xl">
        <p className="text-xs font-semibold uppercase tracking-[0.32em] text-white/70">About Dresser</p>

        <h1
          id="about-hero-title"
          className="dr-display mt-6 text-5xl font-semibold leading-[1.05] text-white sm:text-6xl lg:text-7xl"
        >
          Furniture designed to be lived in, and loved for generations.
        </h1>

        <p className="mt-6 text-xl font-medium text-white/90 dr-display sm:text-2xl">
          At Dresser, we believe every space deserves thoughtful design.
        </p>

        <p className="mt-5 max-w-xl text-base leading-8 text-stone-300 sm:text-lg">
          From concept to craftsmanship, we create furniture that brings comfort, elegance, and lasting value into
          everyday living.
        </p>

        <div className="mt-10 flex flex-col gap-4 sm:flex-row">
          <LinkButton to={shopPath} variant="gold">
            Shop the Collection
          </LinkButton>
          <LinkButton to={contactPath} variant="ghost">
            Book a Consultation
          </LinkButton>
        </div>

        <ul className="mt-14 flex flex-col gap-3 text-sm text-stone-200 sm:flex-row sm:flex-wrap sm:gap-x-8">
          {HERO_ASSURANCES.map((item) => (
            <li key={item} className="flex items-center gap-2">
              <Icon name="check" className="h-4 w-4 text-white" />
              {item}
            </li>
          ))}
        </ul>
      </div>
    </div>
  </section>
);

const Story = () => (
  <section id="story" aria-labelledby="story-title" className={`${SECTION} overflow-hidden bg-white`}>
    <div className={`${CONTAINER} grid items-center gap-16 lg:grid-cols-2 lg:gap-20`}>
      <Reveal>
        <div className="relative pb-10 pr-6 sm:pr-10">
          <div className="aspect-[4/5] overflow-hidden rounded-3xl bg-stone-200 shadow-2xl shadow-stone-900/10">
            <Photo id={PHOTOS.story} alt="A warm, layered living room furnished with Dresser pieces" width={1100} />
          </div>
          <div className="absolute bottom-0 right-0 aspect-square w-2/5 overflow-hidden rounded-2xl border-[6px] border-white bg-stone-300 shadow-xl">
            <Photo id={PHOTOS.storyAccent} alt="Beige sofa and armchair, detail view" width={600} />
          </div>
          <div className="absolute left-5 top-5 rounded-full bg-white/90 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-black backdrop-blur">
            Est. 2011 · Karachi
          </div>
        </div>
      </Reveal>

      <Reveal delay={120}>
        <SectionHeading
          id="story-title"
          align="left"
          eyebrow="Our Story"
          title="A workshop, a shared belief, and a promise to build better."
        />
        <div className="mt-8 space-y-5 text-base leading-8 text-stone-600">
          <p>
            Dresser began in 2011 in a 900-square-foot workshop in Karachi, Pakistan. Elena Marlowe, an interior
            designer frustrated by furniture that looked beautiful in showrooms but failed within a few years, joined
            forces with master joiner Daniel Whitmore to build the pieces they couldn’t find anywhere else.
          </p>
          <p>
            Fifteen years on, the belief is unchanged: every space deserves thoughtful design. Each piece is drawn,
            built and finished by people who care how it will be lived with, from the first sketch to the final coat
            of oil.
          </p>
          <p>
            Today our team of 46 designers, makers and upholsterers still works from the same Karachi studio,
            alongside a trusted network of family-run mills and FSC-certified forests. We’ve grown, but we have never
            outsourced the craft.
          </p>
        </div>

        <figure className="mt-10 border-l-2 border-black pl-6">
          <blockquote className="dr-display text-2xl leading-snug text-black sm:text-3xl">
            “Good furniture should quietly improve your days, and still look right decades from now.”
          </blockquote>
          <figcaption className="mt-4 text-sm font-medium text-stone-500">Elena Marlowe, Founder</figcaption>
        </figure>
      </Reveal>
    </div>
  </section>
);

const Stats = () => (
  <section aria-label="Dresser by the numbers" className="bg-black py-16 sm:py-20">
    <div className={`${CONTAINER} grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4`}>
      {STATS.map((stat, index) => (
        <Reveal key={stat.label} delay={index * 100}>
          <div className="h-full rounded-2xl border border-white/10 bg-white/5 p-6 text-center backdrop-blur-sm transition duration-300 hover:-translate-y-1 hover:border-white/30 hover:bg-white/10 sm:p-8">
            <p className="dr-display text-5xl font-semibold text-white sm:text-6xl">
              <CountUp end={stat.end} suffix={stat.suffix} />
            </p>
            <p className="mt-3 text-sm font-semibold text-white sm:text-base">{stat.label}</p>
            <p className="mt-1 text-xs text-stone-400 sm:text-sm">{stat.note}</p>
          </div>
        </Reveal>
      ))}
    </div>
  </section>
);

const WhyChooseUs = () => (
  <section aria-labelledby="why-title" className={`${SECTION} bg-white`}>
    <div className={CONTAINER}>
      <Reveal>
        <SectionHeading
          id="why-title"
          eyebrow="Why Choose Us"
          title="Everything a considered home deserves"
          description="Beautiful design is only the beginning. We look after the details that turn a purchase into a lasting relationship."
        />
      </Reveal>

      <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {BENEFITS.map((benefit, index) => (
          <Reveal key={benefit.title} delay={(index % 3) * 100}>
            <article className="group h-full rounded-3xl border border-stone-200/80 bg-white p-8 shadow-sm transition duration-300 hover:-translate-y-1.5 hover:border-black/20 hover:shadow-xl hover:shadow-stone-900/10">
              <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-stone-100 text-black transition duration-300 group-hover:bg-black group-hover:text-white">
                <Icon name={benefit.icon} className="h-7 w-7" />
              </span>
              <h3 className="dr-display mt-6 text-2xl font-semibold text-black">{benefit.title}</h3>
              <p className="mt-3 text-[15px] leading-7 text-stone-600">{benefit.text}</p>
            </article>
          </Reveal>
        ))}
      </div>
    </div>
  </section>
);

const Craftsmanship = () => (
  <section aria-labelledby="values-title" className={`${SECTION} bg-white`}>
    <div className={CONTAINER}>
      <Reveal>
        <SectionHeading
          id="values-title"
          eyebrow="Our Values"
          title="Craftsmanship you can feel"
          description="Three principles guide every table we join, every sofa we stuff and every finish we apply."
        />
      </Reveal>

      <div className="mt-16 space-y-20 sm:space-y-28">
        {VALUES.map((value, index) => {
          const reversed = index % 2 === 1;
          return (
            <Reveal key={value.title}>
              <article className="grid items-center gap-10 lg:grid-cols-2 lg:gap-20">
                <div className={reversed ? "lg:order-2" : ""}>
                  <div className="aspect-[5/4] overflow-hidden rounded-3xl bg-stone-200 shadow-2xl shadow-stone-900/10">
                    <Photo
                      id={value.photo}
                      alt={value.alt}
                      width={1100}
                      className="transition duration-700 hover:scale-105"
                    />
                  </div>
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.28em] text-black">{value.eyebrow}</p>
                  <h3 className="dr-display mt-4 text-3xl font-semibold leading-tight text-black sm:text-4xl">
                    {value.title}
                  </h3>
                  <p className="mt-5 text-base leading-8 text-stone-600">{value.text}</p>
                  <ul className="mt-7 space-y-3">
                    {value.points.map((point) => (
                      <li key={point} className="flex items-start gap-3 text-[15px] text-stone-700">
                        <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-black text-white">
                          <Icon name="check" className="h-3.5 w-3.5" />
                        </span>
                        {point}
                      </li>
                    ))}
                  </ul>
                </div>
              </article>
            </Reveal>
          );
        })}
      </div>
    </div>
  </section>
);

const Team = () => (
  <section aria-labelledby="team-title" className={`${SECTION} bg-stone-50`}>
    <div className={CONTAINER}>
      <Reveal>
        <SectionHeading
          id="team-title"
          eyebrow="Meet the Founders"
          title="The people behind every piece"
          description="A small, close-knit leadership team that still designs, builds and inspects alongside the makers."
        />
      </Reveal>

      <div className="mt-14 grid gap-8 md:grid-cols-3">
        {TEAM.map((member, index) => (
          <Reveal key={member.name} delay={index * 120}>
            <article className="group h-full rounded-3xl bg-white p-3 shadow-sm transition duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:shadow-stone-900/10">
              <div className="aspect-[4/5] overflow-hidden rounded-2xl bg-stone-200">
                <Photo
                  id={member.photo}
                  alt={`Portrait of ${member.name}, ${member.role}`}
                  width={700}
                  className="object-top transition duration-700 group-hover:scale-105"
                />
              </div>
              <div className="px-5 pb-6 pt-6">
                <h3 className="dr-display text-2xl font-semibold text-black">{member.name}</h3>
                <p className="mt-1 text-xs font-semibold uppercase tracking-[0.2em] text-black/70">{member.role}</p>
                <p className="mt-4 text-[15px] leading-7 text-stone-600">{member.bio}</p>
              </div>
            </article>
          </Reveal>
        ))}
      </div>
    </div>
  </section>
);

const Process = () => (
  <section aria-labelledby="process-title" className={`${SECTION} bg-black`}>
    <div className={CONTAINER}>
      <Reveal>
        <SectionHeading
          id="process-title"
          tone="dark"
          eyebrow="Our Process"
          title="From first conversation to finished room"
          description="A clear, collaborative journey, so you always know what happens next."
        />
      </Reveal>

      <div className="relative mt-16">
        <div aria-hidden="true" className="absolute left-[10%] right-[10%] top-7 hidden h-px bg-white/15 lg:block" />
        <ol className="relative grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
          {PROCESS.map((item, index) => (
            <li key={item.step}>
              <Reveal delay={index * 100} className="h-full">
                <div className="h-full rounded-2xl border border-white/10 bg-white/5 p-6 transition duration-300 hover:-translate-y-1 hover:border-white/30 hover:bg-white/10">
                  <span className="dr-display flex h-14 w-14 items-center justify-center rounded-full border border-white/30 bg-black text-xl font-semibold text-white">
                    {item.step}
                  </span>
                  <h3 className="dr-display mt-5 text-2xl font-semibold text-white">{item.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-stone-400">{item.text}</p>
                </div>
              </Reveal>
            </li>
          ))}
        </ol>
      </div>
    </div>
  </section>
);

const Testimonials = () => (
  <section aria-labelledby="testimonials-title" className={`${SECTION} bg-white`}>
    <div className={CONTAINER}>
      <Reveal>
        <SectionHeading
          id="testimonials-title"
          eyebrow="Customer Stories"
          title="Loved in homes around the world"
          description="4.9 out of 5 across more than 3,200 verified customer reviews."
        />
      </Reveal>

      <div className="mt-14 grid gap-6 lg:grid-cols-3">
        {TESTIMONIALS.map((item, index) => (
          <Reveal key={item.name} delay={index * 120}>
            <figure className="flex h-full flex-col rounded-3xl border border-stone-200 bg-white p-8 shadow-sm transition duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:shadow-stone-900/10">
              <Stars />
              <blockquote className="dr-display mt-6 flex-1 text-xl leading-relaxed text-black">
                “{item.quote}”
              </blockquote>
              <figcaption className="mt-8 flex items-center gap-4 border-t border-stone-200 pt-6">
                <span
                  aria-hidden="true"
                  className="flex h-12 w-12 items-center justify-center rounded-full bg-black text-sm font-semibold text-white"
                >
                  {item.name
                    .split(" ")
                    .map((part) => part[0])
                    .join("")}
                </span>
                <span>
                  <span className="block text-sm font-semibold text-black">{item.name}</span>
                  <span className="block text-xs text-stone-500">
                    {item.place} · {item.product}
                  </span>
                </span>
              </figcaption>
            </figure>
          </Reveal>
        ))}
      </div>
    </div>
  </section>
);

const FinalCta = ({ shopPath, contactPath }) => (
  <section aria-labelledby="cta-title" className="bg-white px-5 pb-20 sm:px-8 sm:pb-28 lg:px-10">
    <Reveal>
      <div className="relative isolate mx-auto max-w-7xl overflow-hidden rounded-[2rem] bg-black">
        <div className="absolute inset-0 -z-10" aria-hidden="true">
          <Photo id={PHOTOS.cta} alt="" width={1800} />
          <div className="absolute inset-0 bg-black/80" />
        </div>

        <div className="px-6 py-20 text-center sm:px-12 sm:py-28">
          <p className="text-xs font-semibold uppercase tracking-[0.32em] text-white/70">Begin your project</p>
          <h2
            id="cta-title"
            className="dr-display mx-auto mt-5 max-w-3xl text-4xl font-semibold leading-tight text-white sm:text-6xl"
          >
            Bring thoughtful design into your home.
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-base leading-8 text-stone-300 sm:text-lg">
            Explore the collection, or sit down with a Dresser designer and plan a space that feels unmistakably yours.
          </p>

          <div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row">
            <LinkButton to={shopPath} variant="gold">
              Explore the Collection
            </LinkButton>
            <LinkButton to={contactPath} variant="ghost">
              Book a Design Consultation
            </LinkButton>
          </div>

          <p className="mt-8 text-xs text-stone-400">
            Complimentary consultation · Free fabric &amp; finish samples · 10-year warranty
          </p>
        </div>
      </div>
    </Reveal>
  </section>
);

/* ---------------------------------- Page ---------------------------------- */

const About = ({ shopPath = "/shop", contactPath = "/contact" }) => (
  <>
    <Nav forceSolid />
    <main className="dr-body overflow-x-hidden bg-white text-stone-700 antialiased">
      <style>{PAGE_STYLES}</style>

      <Hero shopPath={shopPath} contactPath={contactPath} />
      <Story />
      <Stats />
      <WhyChooseUs />
      <Craftsmanship />
      <Team />
      <Process />
      <Testimonials />
      <FinalCta shopPath={shopPath} contactPath={contactPath} />
    </main>
    <FourthSection />
    <Footer />
  </>
);

export default About;