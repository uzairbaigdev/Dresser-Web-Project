import { useState } from 'react'

/* -------------------------------------------------------------------------
 * Dress types
 * Swap or extend this list freely — the row lays out and scrolls however
 * many entries you give it.
 * ---------------------------------------------------------------------- */

export const DRESS_TYPES = [
  'Casual Dresses',
  'Party Wear',
  'Maxi Dresses',
  'Bodycon',
  'A-Line',
  'Wrap Dresses',
  'Shirt Dresses',
  'Co-ord Sets',
  'Ethnic Wear',
  'Jumpsuits',
  'Formal Gowns',
]

/* -------------------------------------------------------------------------
 * Component
 *
 * A single horizontal, snap-scrolling row of category pills, styled to
 * match the rest of the site (cream background, stone-900 text, the same
 * uppercase/tracked-out label style used in the nav). Fade masks on each
 * edge hint that the row scrolls; the active pill is filled solid.
 *
 * Works two ways:
 *  - Standalone: just drop it in, it tracks its own active pill.
 *  - Controlled: pass `activeType` + `onSelect` from a parent (e.g. the
 *    Products grid) so the pill row and the product list stay in sync.
 * ---------------------------------------------------------------------- */

const ProductsTypes = ({ types = DRESS_TYPES, activeType, onSelect }) => {
  const [internalType, setInternalType] = useState(types[0])

  const isControlled = activeType !== undefined
  const currentType = isControlled ? activeType : internalType

  const handleSelect = (type) => {
    if (!isControlled) setInternalType(type)
    onSelect?.(type)
  }

  return (
    <section className="mt-[88px] border-b border-stone-200 bg-[#fbfaf7] py-6">
      <div className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-12">
        <h2 className="mb-4 text-[11px] font-semibold uppercase tracking-[0.14em] text-stone-500">
          Shop by Category
        </h2>

        <div className="relative">
          {/* Edge fades hint that the row scrolls */}
          <div className="pointer-events-none absolute inset-y-0 left-0 w-8 bg-gradient-to-r from-[#fbfaf7] to-transparent" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-[#fbfaf7] to-transparent" />

          <div className="no-scrollbar flex snap-x gap-3 overflow-x-auto scroll-smooth">
            {types.map((type) => {
              const isActive = type === currentType

              return (
                <button
                  key={type}
                  type="button"
                  onClick={() => handleSelect(type)}
                  aria-pressed={isActive}
                  className={`shrink-0 snap-start rounded-full border px-5 py-2 text-xs font-semibold uppercase tracking-[0.14em] transition-colors ${
                    isActive
                      ? 'border-stone-900 bg-stone-900 text-white'
                      : 'border-stone-300 text-stone-600 hover:border-stone-900 hover:text-stone-900'
                  }`}
                >
                  {type}
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* Hide the scrollbar for a cleaner look while keeping the row scrollable. */}
      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </section>
  )
}

export default ProductsTypes