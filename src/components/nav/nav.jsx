import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

/* -------------------------------------------------------------------------
 * Icons — small, dependency-free line icons.
 * ---------------------------------------------------------------------- */

const IconProps = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.7 }

const IconSearch = (props) => (
  <svg viewBox="0 0 24 24" className="h-5 w-5" {...IconProps} {...props}>
    <circle cx="11" cy="11" r="7" />
    <path d="M21 21l-4.35-4.35" />
  </svg>
)

const IconAccount = (props) => (
  <svg viewBox="0 0 24 24" className="h-5 w-5" {...IconProps} {...props}>
    <circle cx="12" cy="8" r="4" />
    <path d="M4 20c0-4 4-6 8-6s8 2 8 6" />
  </svg>
)

const IconCart = (props) => (
  <svg viewBox="0 0 24 24" className="h-5 w-5" {...IconProps} {...props}>
    <path d="M6 6h15l-1.5 9h-12z" />
    <path d="M6 6L5 3H2" />
    <circle cx="9" cy="20" r="1" />
    <circle cx="18" cy="20" r="1" />
  </svg>
)

const IconMenu = (props) => (
  <svg viewBox="0 0 24 24" className="h-6 w-6" {...IconProps} {...props}>
    <path d="M4 7h16M4 12h16M4 17h16" />
  </svg>
)

const IconClose = (props) => (
  <svg viewBox="0 0 24 24" className="h-4 w-4" {...IconProps} {...props}>
    <path d="M6 6l12 12M18 6l-12 12" />
  </svg>
)

const IconChevronRight = (props) => (
  <svg viewBox="0 0 24 24" className="h-4 w-4" {...IconProps} {...props}>
    <path d="M9 6l6 6-6 6" />
  </svg>
)

/* Minimal monogram mark shown next to the wordmark. Swap for a real logo
 * <img> whenever one is available — it inherits `currentColor` so it
 * matches the header's white/charcoal text automatically. */
const LogoMark = (props) => (
  <svg viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="1.5" {...props}>
    <circle cx="20" cy="20" r="18" />
    <path d="M14 12h7a8 8 0 0 1 0 16h-7z" strokeLinejoin="round" />
  </svg>
)

/* Row icons for the drawer list. */
const IconHome = (props) => (
  <svg viewBox="0 0 24 24" className="h-5 w-5" {...IconProps} {...props}>
    <path d="M4 11l8-7 8 7" />
    <path d="M6 9.5V20h12V9.5" />
  </svg>
)

const IconAbout = (props) => (
  <svg viewBox="0 0 24 24" className="h-5 w-5" {...IconProps} {...props}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 11v6M12 7.5h.01" strokeLinecap="round" />
  </svg>
)

const IconProduct = (props) => (
  <svg viewBox="0 0 24 24" className="h-5 w-5" {...IconProps} {...props}>
    <path d="M20.5 12.3 12.7 4.5a2 2 0 0 0-1.4-.6H5a1 1 0 0 0-1 1v6.3c0 .5.2 1 .6 1.4l7.8 7.8a2 2 0 0 0 2.8 0l5.3-5.3a2 2 0 0 0 0-2.8z" />
    <path d="M8 8h.01" strokeLinecap="round" />
  </svg>
)

const IconContact = (props) => (
  <svg viewBox="0 0 24 24" className="h-5 w-5" {...IconProps} {...props}>
    <rect x="3" y="5" width="18" height="14" rx="2" />
    <path d="M4 7l8 6 8-6" />
  </svg>
)

/* -------------------------------------------------------------------------
 * Drawer content
 * ---------------------------------------------------------------------- */

// Dummy photos from Lorem Picsum — a free, keyless placeholder-image
// service (https://picsum.photos). A fixed seed per slide means the same
// photo loads every time instead of a random one. Replace `image` with
// your own product photography URL whenever it's ready.
const SLIDES = [
  { title: 'New Arrivals', subtitle: 'Fresh styles, just landed', image: 'https://picsum.photos/seed/dresser-new/800/600' },
  { title: 'Best Sellers', subtitle: "This season's most-loved picks", image: 'https://picsum.photos/seed/dresser-best/800/600' },
  { title: 'Limited Edition', subtitle: 'Only a few pieces left', image: 'https://picsum.photos/seed/dresser-limited/800/600' },
]

const NAV_LINKS = [
  { label: 'Home', to: '/', icon: IconHome },
  { label: 'Shop', to: '/shop', icon: IconAbout },
  { label: 'Search', to: '/product', icon: IconProduct },
  { label: 'Contact', to: '/contact', icon: IconContact },
]

/* -------------------------------------------------------------------------
 * Component
 *
 * Header: fixed, transparent over the hero (white text/icons), fading to
 * a solid off-white bar once the page scrolls.
 * Menu: clicking the left icon opens an off-canvas drawer — a frosted,
 * translucent panel with an auto-advancing picture slider on top and the
 * Home / About / Product / Contact list, each with its own icon, below.
 * ---------------------------------------------------------------------- */

const Nav = ({ brandName = 'Dresser', cartCount = 0, forceSolid = false }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [slideIndex, setSlideIndex] = useState(0)

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 40)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === 'Escape') setIsMenuOpen(false)
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [])

  // Lock page scroll while the drawer is open.
  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [isMenuOpen])

  // Auto-advance the slider only while the drawer is actually open.
  useEffect(() => {
    if (!isMenuOpen) return undefined
    setSlideIndex(0)
    const id = setInterval(() => {
      setSlideIndex((i) => (i + 1) % SLIDES.length)
    }, 3500)
    return () => clearInterval(id)
  }, [isMenuOpen])

  const openMenu = () => setIsMenuOpen(true)
  const closeMenu = () => setIsMenuOpen(false)

  const solid = forceSolid || isScrolled

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 w-full transition-colors duration-300 ${
          solid
            ? 'border-b border-stone-200 bg-[#fbfaf7] text-stone-900 shadow-sm'
            : 'border-b border-transparent bg-transparent text-white'
        }`}
      >
        <div className="relative mx-auto flex max-w-[1440px] items-center justify-between px-5 py-5 sm:px-8 lg:px-12">
          <button
            type="button"
            aria-label="Open menu"
            aria-haspopup="true"
            aria-expanded={isMenuOpen}
            onClick={openMenu}
            onMouseEnter={openMenu}
            onFocus={openMenu}
            className="group relative flex h-10 w-10 items-center justify-center transition-all duration-200"
          >
            <span className="absolute inset-y-2 left-0 w-[2px] rounded-full bg-white opacity-0 transition-opacity duration-200 group-hover:opacity-100" />
            <IconMenu />
          </button>

          {/* Brand mark — logo + wordmark, always centered */}
          <Link to="/" onClick={closeMenu} className="absolute left-1/2 flex -translate-x-1/2 items-center gap-2">
            <LogoMark className="h-7 w-7 shrink-0" />
            <span className="text-xl font-bold uppercase tracking-[0.22em] sm:text-2xl">{brandName}</span>
          </Link>

          <div className="flex items-center gap-5">
            <button aria-label="Search" className="group relative flex h-10 w-10 items-center justify-center transition-all duration-200">
              <span className="absolute inset-y-2 left-0 w-[2px] rounded-full bg-white opacity-0 transition-opacity duration-200 group-hover:opacity-100" />
              <IconSearch />
            </button>
            <button aria-label="Account" className="group relative flex h-10 w-10 items-center justify-center transition-all duration-200">
              <span className="absolute inset-y-2 left-0 w-[2px] rounded-full bg-white opacity-0 transition-opacity duration-200 group-hover:opacity-100" />
              <IconAccount />
            </button>
            <button aria-label="Cart" className="group relative flex h-10 w-10 items-center justify-center transition-all duration-200">
              <span className="absolute inset-y-2 left-0 w-[2px] rounded-full bg-white opacity-0 transition-opacity duration-200 group-hover:opacity-100" />
              <IconCart />
              <span className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-stone-900 text-[10px] text-white">
                {cartCount}
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* ---------------- Off-canvas drawer ---------------- */}
      <div
        aria-hidden={!isMenuOpen}
        onClick={closeMenu}
        className={`fixed inset-0 z-[60] bg-black/60 backdrop-blur-[2px] transition-opacity duration-300 ${
          isMenuOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
      />

      <aside
        aria-label="Primary"
        className={`fixed inset-y-0 left-0 z-[70] flex w-[85vw] max-w-sm flex-col overflow-hidden border-r border-white/10 bg-stone-900/70 text-white shadow-2xl backdrop-blur-xl transition-transform duration-300 ease-out ${
          isMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Picture slider */}
        <div className="relative h-48 w-full shrink-0 overflow-hidden bg-stone-800">
          {SLIDES.map((slide, i) => (
            <div
              key={slide.title}
              className={`absolute inset-0 transition-opacity duration-700 ${i === slideIndex ? 'opacity-100' : 'opacity-0'}`}
            >
              <img src={slide.image} alt={slide.title} className="h-full w-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />
              <div className="absolute inset-0 flex flex-col justify-end p-5">
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-white/70">{slide.subtitle}</p>
                <p className="text-2xl font-bold text-white">{slide.title}</p>
              </div>
            </div>
          ))}

          <button
            type="button"
            aria-label="Close menu"
            onClick={closeMenu}
            className="absolute right-3 top-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-sm transition hover:bg-black/60"
          >
            <IconClose />
          </button>

          <div className="absolute bottom-3 right-3 z-10 flex gap-1.5">
            {SLIDES.map((slide, i) => (
              <button
                key={slide.title}
                type="button"
                aria-label={`Show slide ${i + 1}`}
                onClick={() => setSlideIndex(i)}
                className={`h-1.5 rounded-full transition-all ${i === slideIndex ? 'w-5 bg-white' : 'w-1.5 bg-white/40'}`}
              />
            ))}
          </div>
        </div>

        {/* Link list */}
        <nav className="flex flex-col divide-y divide-white/10 border-t border-white/10">
          {NAV_LINKS.map(({ label, to, icon: Icon }) => (
            <Link
              key={label}
              to={to}
              onClick={closeMenu}
              className="group relative flex items-center justify-between px-4 py-3 text-[11px] font-medium uppercase tracking-[0.14em] text-white/90 transition hover:text-white"
            >
              <span className="absolute inset-y-2 left-0 w-[2px] rounded-full bg-white opacity-0 transition-opacity duration-200 group-hover:opacity-100" />
              <span className="flex items-center gap-2.5">
                <Icon className="h-4 w-4 text-white/60" />
                {label}
              </span>
              <IconChevronRight className="h-3.5 w-3.5 text-white/40" />
            </Link>
          ))}
        </nav>
      </aside>
    </>
  )
}

export default Nav