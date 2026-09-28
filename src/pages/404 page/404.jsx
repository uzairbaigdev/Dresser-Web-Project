import { useCallback, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";

/* -------------------------------------------------------------------------- */
/*  Scene styles                                                              */
/*  Kept in one place so the 3D behaviour is easy to tune. All classes are    */
/*  prefixed with `nf-` to avoid clashing with the rest of the website.       */
/* -------------------------------------------------------------------------- */

const SCENE_STYLES = `
  .nf-vignette {
    background: radial-gradient(ellipse at top, rgba(23, 23, 23, 0.07), transparent 60%);
  }

  /* Perspective floor grid */
  .nf-floor { perspective: 500px; }
  .nf-grid {
    transform: rotateX(62deg);
    transform-origin: top center;
    background-image:
      linear-gradient(rgba(23, 23, 23, 0.14) 1px, transparent 1px),
      linear-gradient(90deg, rgba(23, 23, 23, 0.14) 1px, transparent 1px);
    background-size: 64px 64px;
    -webkit-mask-image: linear-gradient(to bottom, transparent 0%, #000 55%);
            mask-image: linear-gradient(to bottom, transparent 0%, #000 55%);
    animation: nf-grid-scroll 3s linear infinite;
  }

  /* 404 title: mouse-driven tilt + extruded depth layers */
  .nf-stage { perspective: 1100px; }
  .nf-bob { animation: nf-bob 6s ease-in-out infinite; }
  .nf-tilt {
    position: relative;
    display: inline-block;
    transform-style: preserve-3d;
    transform: rotateX(calc(var(--my) * -14deg)) rotateY(calc(var(--mx) * 18deg));
    transition: transform 0.2s ease-out;
    will-change: transform;
  }

  /* Floating cubes */
  .nf-float { perspective: 600px; animation: nf-float 7s ease-in-out infinite; }
  .nf-cube {
    position: relative;
    width: var(--s);
    height: var(--s);
    transform-style: preserve-3d;
    animation: nf-spin 20s linear infinite;
  }
  .nf-face {
    position: absolute;
    inset: 0;
    border: 1px solid rgba(23, 23, 23, 0.25);
    background: linear-gradient(135deg, rgba(23, 23, 23, 0.1), rgba(23, 23, 23, 0.02));
    box-shadow: inset 0 0 18px rgba(23, 23, 23, 0.06);
  }
  .nf-face--front  { transform: translateZ(calc(var(--s) / 2)); }
  .nf-face--back   { transform: rotateY(180deg) translateZ(calc(var(--s) / 2)); }
  .nf-face--right  { transform: rotateY(90deg) translateZ(calc(var(--s) / 2)); }
  .nf-face--left   { transform: rotateY(-90deg) translateZ(calc(var(--s) / 2)); }
  .nf-face--top    { transform: rotateX(90deg) translateZ(calc(var(--s) / 2)); }
  .nf-face--bottom { transform: rotateX(-90deg) translateZ(calc(var(--s) / 2)); }

  /* Entrance */
  .nf-rise { animation: nf-rise 0.8s cubic-bezier(0.22, 1, 0.36, 1) both; }

  @keyframes nf-grid-scroll { to { background-position: 0 64px; } }
  @keyframes nf-bob   { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-14px); } }
  @keyframes nf-float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-22px); } }
  @keyframes nf-spin  {
    from { transform: rotateX(0deg) rotateY(0deg) rotateZ(0deg); }
    to   { transform: rotateX(360deg) rotateY(360deg) rotateZ(180deg); }
  }
  @keyframes nf-rise {
    from { opacity: 0; transform: translateY(24px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  @media (prefers-reduced-motion: reduce) {
    .nf-grid, .nf-bob, .nf-float, .nf-cube, .nf-rise { animation: none; }
    .nf-tilt { transform: none; transition: none; }
  }
`;

/* -------------------------------------------------------------------------- */
/*  Static configuration                                                      */
/* -------------------------------------------------------------------------- */

const CUBE_FACES = ["front", "back", "right", "left", "top", "bottom"];

// `depth` controls how far a cube shifts with the pointer (parallax).
const CUBES = [
  { size: 64, position: "top-[12%] left-[8%]", depth: 40, duration: 22, delay: 0 },
  { size: 40, position: "top-[22%] right-[10%]", depth: 26, duration: 18, delay: -4 },
  { size: 88, position: "bottom-[26%] left-[14%] hidden sm:block", depth: 60, duration: 28, delay: -8 },
  { size: 48, position: "bottom-[30%] right-[12%]", depth: 34, duration: 20, delay: -2 },
  { size: 28, position: "top-[46%] left-[30%] hidden md:block", depth: 16, duration: 16, delay: -6 },
  { size: 34, position: "top-[10%] right-[32%] hidden md:block", depth: 20, duration: 24, delay: -10 },
];

const TITLE = "404";
const DEPTH_LAYERS = 10; // number of stacked layers that create the 3D extrusion
const LAYER_GAP = 5; // px between extrusion layers

/* -------------------------------------------------------------------------- */
/*  Small presentational pieces                                               */
/* -------------------------------------------------------------------------- */

const Cube = ({ size, position, depth, duration, delay }) => (
  <div
    aria-hidden="true"
    className={`absolute ${position}`}
    style={{
      transform: `translate3d(calc(var(--mx) * ${depth}px), calc(var(--my) * ${depth}px), 0)`,
      transition: "transform 0.3s ease-out",
    }}
  >
    <div className="nf-float" style={{ animationDelay: `${delay}s` }}>
      <div
        className="nf-cube"
        style={{ "--s": `${size}px`, animationDuration: `${duration}s` }}
      >
        {CUBE_FACES.map((face) => (
          <span key={face} className={`nf-face nf-face--${face}`} />
        ))}
      </div>
    </div>
  </div>
);

const HomeIcon = () => (
  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M3 11.5 12 4l9 7.5" />
    <path d="M5 10v9a1 1 0 0 0 1 1h4v-6h4v6h4a1 1 0 0 0 1-1v-9" />
  </svg>
);

const ArrowLeftIcon = () => (
  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M19 12H5" />
    <path d="m11 18-6-6 6-6" />
  </svg>
);

/** The extruded 3D "404" – a tilting stack of identical text layers. */
const Title3D = () => (
  <div className="nf-stage">
    <div className="nf-bob">
      <h1 className="nf-tilt select-none text-[120px] font-black leading-none sm:text-[200px]" aria-label="404">
        {/* Depth layers (decorative) */}
        {Array.from({ length: DEPTH_LAYERS }, (_, i) => (
          <span
            key={i}
            aria-hidden="true"
            className="absolute inset-0"
            style={{
              color: `hsl(0 0% ${30 + i * 5}%)`,
              transform: `translateZ(${-(i + 1) * LAYER_GAP}px)`,
            }}
          >
            {TITLE}
          </span>
        ))}

        {/* Front face */}
        <span
          className="relative block bg-gradient-to-b from-neutral-900 to-neutral-700 bg-clip-text text-transparent"
          style={{ transform: "translateZ(12px)" }}
        >
          {TITLE}
        </span>
      </h1>
    </div>
  </div>
);

/* -------------------------------------------------------------------------- */
/*  Page                                                                      */
/* -------------------------------------------------------------------------- */

const NotFound = () => {
  const navigate = useNavigate();
  const sceneRef = useRef(null);
  const frameRef = useRef(0);

  // Writes pointer position to CSS variables (-1 … 1). Using variables instead
  // of React state avoids re-rendering the page on every mouse move.
  const handlePointerMove = useCallback((event) => {
    if (frameRef.current) return;
    const { clientX, clientY } = event;

    frameRef.current = requestAnimationFrame(() => {
      frameRef.current = 0;
      const scene = sceneRef.current;
      if (!scene) return;
      scene.style.setProperty("--mx", ((clientX / window.innerWidth) * 2 - 1).toFixed(3));
      scene.style.setProperty("--my", ((clientY / window.innerHeight) * 2 - 1).toFixed(3));
    });
  }, []);

  const handlePointerLeave = useCallback(() => {
    const scene = sceneRef.current;
    if (!scene) return;
    scene.style.setProperty("--mx", "0");
    scene.style.setProperty("--my", "0");
  }, []);

  useEffect(() => () => cancelAnimationFrame(frameRef.current), []);

  return (
    <div
      ref={sceneRef}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      style={{ "--mx": 0, "--my": 0 }}
      className="relative flex min-h-screen items-center justify-center overflow-hidden bg-white px-6"
    >
      <style>{SCENE_STYLES}</style>

      {/* ---------------------------- Background ---------------------------- */}
      <div aria-hidden="true" className="nf-vignette pointer-events-none absolute inset-0" />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-24 top-1/4 h-72 w-72 rounded-full bg-neutral-300/40 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-24 bottom-1/4 h-80 w-80 rounded-full bg-neutral-200/70 blur-3xl"
      />

      <div aria-hidden="true" className="nf-floor pointer-events-none absolute inset-x-0 bottom-0 h-1/2 overflow-hidden">
        <div className="nf-grid absolute inset-x-[-50%] top-0 h-[200%]" />
      </div>

      <div className="pointer-events-none absolute inset-0">
        {CUBES.map((cube) => (
          <Cube key={`${cube.position}-${cube.size}`} {...cube} />
        ))}
      </div>

      {/* ----------------------------- Content ------------------------------ */}
      <main className="relative z-10 text-center">
        <p
          className="nf-rise mb-4 inline-flex items-center gap-2 rounded-full border border-neutral-300 bg-neutral-100 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.3em] text-neutral-700 backdrop-blur"
        >
          <span className="h-2 w-2 animate-pulse rounded-full bg-neutral-900" />
          Error 404
        </p>

        <div className="nf-rise" style={{ animationDelay: "0.1s" }}>
          <Title3D />
        </div>

        <h2 className="nf-rise mt-4 text-2xl font-bold text-neutral-900 sm:text-4xl" style={{ animationDelay: "0.2s" }}>
          Page Not Found
        </h2>

        <p
          className="nf-rise mx-auto mt-4 max-w-md leading-7 text-neutral-600"
          style={{ animationDelay: "0.3s" }}
        >
          The page you're looking for doesn't exist or may have been moved.
        </p>

        <div
          className="nf-rise mt-8 flex flex-col justify-center gap-4 sm:flex-row"
          style={{ animationDelay: "0.4s" }}
        >
          <Link
            to="/"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-neutral-900 px-6 py-3 font-semibold text-white shadow-lg shadow-neutral-900/20 transition duration-300 hover:-translate-y-1 hover:bg-neutral-700 hover:shadow-xl hover:shadow-neutral-900/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2 focus-visible:ring-offset-white active:translate-y-0"
          >
            <HomeIcon />
            Go Home
          </Link>

          <button
            type="button"
            onClick={() => navigate(-1)}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-neutral-300 bg-white/60 px-6 py-3 font-semibold text-neutral-700 backdrop-blur transition duration-300 hover:-translate-y-1 hover:border-neutral-900 hover:bg-neutral-100 hover:text-neutral-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2 focus-visible:ring-offset-white active:translate-y-0"
          >
            <ArrowLeftIcon />
            Go Back
          </button>
        </div>
      </main>
    </div>
  );
};

export default NotFound;