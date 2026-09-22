import React, { useState } from 'react'

const navLinks = [
  { label: 'Home', href: '#home' },
  { label: 'Products', href: '#products' },
  { label: 'Payment', href: '#payment' },
  { label: 'Contact', href: '#contact' },
]

const Nav = () => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <header className="w-full border-b border-gray-200 bg-white sticky top-0 z-50">
      {/* Top announcement strip - matches Zellbury's thin black bar */}
      <div className="bg-black text-white text-center text-[11px] sm:text-xs tracking-wide py-1.5 px-4">
        Free Delivery on Orders Over Rs. 3,000
      </div>

      <nav className="max-w-7xl mx-auto flex items-center justify-between px-5 sm:px-8 py-4">
        {/* Logo */}
        <a href="#home" className="flex items-center gap-2 shrink-0">
          <span className="flex items-center justify-center w-9 h-9 rounded-full border border-black">
            <svg
              viewBox="0 0 24 24"
              className="w-4 h-4"
              fill="none"
              stroke="black"
              strokeWidth="1.5"
            >
              <path d="M9 3h6l1 3-2 2 2 1-2 12H8L6 9l2-1-2-2 3-3z" />
            </svg>
          </span>
          <span className="font-serif text-xl sm:text-2xl tracking-wide text-black leading-none">
            Ladies Dresser
          </span>
        </a>

        {/* Desktop links */}
        <ul className="hidden md:flex items-center gap-10">
          {navLinks.map((link) => (
            <li key={link.label}>
              <a
                href={link.href}
                className="text-sm tracking-wide text-gray-800 hover:text-black relative
                           after:content-[''] after:absolute after:left-0 after:-bottom-1
                           after:w-0 after:h-[1.5px] after:bg-black after:transition-all
                           hover:after:w-full"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        {/* Right icons */}
        <div className="hidden md:flex items-center gap-5">
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

        {/* Mobile menu button */}
        <button
          className="md:hidden text-black"
          aria-label="Toggle menu"
          onClick={() => setIsOpen(!isOpen)}
        >
          <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.7">
            {isOpen ? (
              <path d="M6 6l12 12M18 6l-12 12" />
            ) : (
              <path d="M4 7h16M4 12h16M4 17h16" />
            )}
          </svg>
        </button>
      </nav>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden border-t border-gray-200 bg-white px-5 py-4">
          <ul className="flex flex-col gap-4">
            {navLinks.map((link) => (
              <li key={link.label}>
                <a
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="block text-sm tracking-wide text-gray-800 hover:text-black"
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