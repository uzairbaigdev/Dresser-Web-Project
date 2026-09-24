import { useState } from 'react'

const navLinks = [
  { label: 'Women', href: '#women' },
  { label: 'Men', href: '#men' },
  { label: 'Kids', href: '#kids' },
  { label: 'Unstitched', href: '#unstitched' },
  { label: 'New In', href: '#new-in' },
  { label: 'Sale', href: '#sale' },
]

const Nav = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [activeLink, setActiveLink] = useState('Home')

  return (
    <header className="w-full border-b border-stone-200 bg-[#fbfaf7] sticky top-0 z-50 text-stone-900">
      <div className="bg-stone-900 px-4 py-2 text-center text-[10px] font-medium uppercase tracking-[0.2em] text-white sm:text-[11px]">
        Free delivery on orders over Rs. 3,000
      </div>

      <nav className="mx-auto flex max-w-[1440px] items-center justify-between px-5 py-5 sm:px-8 lg:px-12">
        <button
          className="md:hidden"
          aria-label="Toggle menu"
          onClick={() => setIsOpen(!isOpen)}
        >
          <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.5">
            {isOpen ? <path d="M6 6l12 12M18 6l-12 12" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
          </svg>
        </button>

        <a href="#home" className="flex items-center gap-2 md:absolute md:left-1/2 md:-translate-x-1/2">
          <span className="flex h-8 w-8 items-center justify-center rounded-full border border-stone-900">
            <svg
              viewBox="0 0 24 24"
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <path d="M9 3h6l1 3-2 2 2 1-2 12H8L6 9l2-1-2-2 3-3z" />
            </svg>
          </span>
          <span className="font-serif text-xl tracking-[0.18em] text-stone-900 sm:text-2xl">
            Dresser
          </span>
        </a>

        <div className="ml-auto flex items-center gap-5">
          <button aria-label="Search" className="text-black hover:opacity-60 transition">
            <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.7">
              <circle cx="11" cy="11" r="7" />
              <path d="M21 21l-4.35-4.35" />
            </svg>
          </button>
          <button aria-label="Account" className="text-black hover:opacity-60 transition">
            <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.7">
              <circle cx="12" cy="8" r="4" />
              <path d="M4 20c0-4 4-6 8-6s8 2 8 6" />
            </svg>
          </button>
          <button aria-label="Cart" className="relative text-black hover:opacity-60 transition">
            <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.7">
              <path d="M6 6h15l-1.5 9h-12z" />
              <path d="M6 6L5 3H2" />
              <circle cx="9" cy="20" r="1" />
              <circle cx="18" cy="20" r="1" />
            </svg>
            <span className="absolute -top-2 -right-2 bg-black text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center">
              0
            </span>
          </button>
        </div>
      </nav>

      <div className="hidden border-t border-stone-200 md:block">
        <ul className="mx-auto flex max-w-[1000px] items-center justify-center gap-8 px-6 py-3 lg:gap-12">
          {navLinks.map((link) => (
            <li key={link.label}>
              <a
                href={link.href}
                onClick={() => setActiveLink(link.label)}
                className={`relative text-[11px] font-medium uppercase tracking-[0.16em] after:absolute after:-bottom-2 after:left-0 after:h-px after:bg-stone-900 after:transition-all hover:after:w-full ${
                  activeLink === link.label ? 'text-stone-900 after:w-full' : 'text-stone-600 after:w-0'
                }`}
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden border-t border-stone-200 bg-[#fbfaf7] px-5 py-5">
          <ul className="flex flex-col gap-4">
            {navLinks.map((link) => (
              <li key={link.label}>
                <a
                  href={link.href}
                  onClick={() => {
                    setActiveLink(link.label)
                    setIsOpen(false)
                  }}
                  className={`block text-sm tracking-wide hover:text-black ${
                    activeLink === link.label
                      ? 'text-black font-medium'
                      : 'text-gray-800'
                  }`}
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
          <div className="flex items-center gap-6 mt-5 pt-4 border-t border-gray-100">
            <button aria-label="Search" className="text-black">
              <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.7">
                <circle cx="11" cy="11" r="7" />
                <path d="M21 21l-4.35-4.35" />
              </svg>
            </button>
            <button aria-label="Account" className="text-black">
              <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.7">
                <circle cx="12" cy="8" r="4" />
                <path d="M4 20c0-4 4-6 8-6s8 2 8 6" />
              </svg>
            </button>
            <button aria-label="Cart" className="text-black">
              <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.7">
                <path d="M6 6h15l-1.5 9h-12z" />
                <path d="M6 6L5 3H2" />
                <circle cx="9" cy="20" r="1" />
                <circle cx="18" cy="20" r="1" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </header>
  )
}

export default Nav