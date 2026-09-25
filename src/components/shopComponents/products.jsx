import { useState, useMemo } from 'react'
import ProductsTypes, { DRESS_TYPES } from './productsTypes'

/* -------------------------------------------------------------------------
 * Product catalog generator
 *
 * Rather than hand-typing hundreds of near-identical rows, each category
 * gets its own base noun (e.g. "Party Wear" -> "Party Dress") and a shared
 * list of style adjectives. Combining the two gives 30 distinct-sounding
 * products per category — swap `ADJECTIVES`, `CATEGORY_NOUNS`, or the price
 * ranges below to reshape the catalog, or drop this generator entirely and
 * point `PRODUCTS` at a real API/CMS response.
 * ---------------------------------------------------------------------- */

const ADJECTIVES = [
  'Sunwashed', 'Classic', 'Elegant', 'Breezy', 'Chic', 'Minimal', 'Vintage',
  'Modern', 'Relaxed', 'Tailored', 'Printed', 'Solid', 'Embroidered',
  'Textured', 'Draped', 'Fitted', 'Flowy', 'Structured', 'Everyday',
  'Refined', 'Bold', 'Soft', 'Luxe', 'Weekend', 'Statement', 'Effortless',
  'Polished', 'Timeless', 'Playful', 'Sleek',
]

// Cycled across products to vary the little badge shown on each card.
const BADGES = ['New', 'Best Seller', 'Trending', 'Popular', 'Limited', 'Featured']

// The noun each category's products are built from, plus a base price
// (in PKR) that the adjective index nudges up or down slightly.
const CATEGORY_NOUNS = {
  'Casual Dresses': { noun: 'Casual Dress', basePrice: 2200 },
  'Party Wear': { noun: 'Party Dress', basePrice: 5200 },
  'Maxi Dresses': { noun: 'Maxi Dress', basePrice: 3800 },
  'Bodycon': { noun: 'Bodycon Dress', basePrice: 2600 },
  'A-Line': { noun: 'A-Line Dress', basePrice: 2900 },
  'Wrap Dresses': { noun: 'Wrap Dress', basePrice: 3200 },
  'Shirt Dresses': { noun: 'Shirt Dress', basePrice: 2700 },
  'Co-ord Sets': { noun: 'Co-ord Set', basePrice: 3900 },
  'Ethnic Wear': { noun: 'Ethnic Suit', basePrice: 5600 },
  'Jumpsuits': { noun: 'Jumpsuit', basePrice: 3300 },
  'Formal Gowns': { noun: 'Formal Gown', basePrice: 7200 },
}

// Turns "Party Wear" into a URL-safe slug, e.g. "party-wear".
const slugify = (text) => text.toLowerCase().replace(/[^a-z0-9]+/g, '-')

const buildProducts = () => {
  let id = 1
  const products = []

  DRESS_TYPES.forEach((category) => {
    const { noun, basePrice } = CATEGORY_NOUNS[category]
    const categorySlug = slugify(category)

    ADJECTIVES.forEach((adjective, index) => {
      products.push({
        id: id++,
        name: `${adjective} ${noun}`,
        category,
        price: basePrice + index * 45,
        badge: BADGES[index % BADGES.length],
        // Two seeds per product: the primary photo and the one it swaps
        // to on hover/focus, mirroring how most fashion sites show a
        // second angle of the same piece.
        image: `${categorySlug}-${index + 1}a`,
        imageHover: `${categorySlug}-${index + 1}b`,
        href: '#',
      })
    })
  })

  return products
}

const PRODUCTS = buildProducts()

/* -------------------------------------------------------------------------
 * Helpers
 * ---------------------------------------------------------------------- */

const formatPrice = (price) =>
  new Intl.NumberFormat('en-PK', {
    style: 'currency',
    currency: 'PKR',
    maximumFractionDigits: 0,
  }).format(price)

// Seeded placeholder photo — deterministic per product, so it never
// changes between renders. Replace with your real product image URLs.
const imageUrlFor = (seed) => `https://picsum.photos/seed/${seed}/600/800`

/* -------------------------------------------------------------------------
 * Product card
 *
 * Hovering (or focusing, for keyboard users) crossfades to the product's
 * second photo, reveals a "View Product" quick-view strip, and slightly
 * zooms the image — all driven by Tailwind's `group` utilities, no extra
 * JS state needed.
 * ---------------------------------------------------------------------- */

const ProductCard = ({ product }) => (
  <article className="group overflow-hidden rounded-2xl border border-stone-200 bg-white transition-shadow hover:shadow-lg">
    <a href={product.href} className="block">
      <div className="relative aspect-[3/4] overflow-hidden bg-stone-100">
        <img
          src={imageUrlFor(product.image)}
          alt={product.name}
          loading="lazy"
          className="absolute inset-0 h-full w-full object-cover opacity-100 transition-opacity duration-500 ease-in-out group-hover:opacity-0"
        />
        <img
          src={imageUrlFor(product.imageHover)}
          alt=""
          aria-hidden="true"
          loading="lazy"
          className="absolute inset-0 h-full w-full scale-105 object-cover opacity-0 transition-opacity duration-500 ease-in-out group-hover:opacity-100"
        />

        {product.badge && (
          <span className="absolute left-3 top-3 z-10 rounded-full bg-white/95 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.08em] text-stone-900">
            {product.badge}
          </span>
        )}

        <span className="absolute inset-x-3 bottom-3 translate-y-2 rounded-full bg-white/95 py-2.5 text-center text-[11px] font-semibold uppercase tracking-[0.08em] text-stone-900 opacity-0 transition-all duration-200 ease-out group-hover:translate-y-0 group-hover:opacity-100">
          View Product
        </span>
      </div>

      <div className="p-4">
        <span className="block text-[10px] font-semibold uppercase tracking-[0.14em] text-stone-400">
          {product.category}
        </span>
        <h3 className="mt-1 text-sm font-medium leading-snug text-stone-900">
          {product.name}
        </h3>
        <span className="mt-1.5 block text-sm font-semibold text-stone-900">
          {formatPrice(product.price)}
        </span>
      </div>
    </a>
  </article>
)

/* -------------------------------------------------------------------------
 * Products
 *
 * Renders the category pill row and a responsive grid of product cards.
 * Only the products belonging to the selected category are shown — there
 * is no "All" view, so the grid always reflects exactly one type.
 * ---------------------------------------------------------------------- */

const Products = () => {
  const [activeType, setActiveType] = useState(DRESS_TYPES[0])

  const filteredProducts = useMemo(
    () => PRODUCTS.filter((product) => product.category === activeType),
    [activeType]
  )

  return (
    <div className="bg-[#fbfaf7]">
      <ProductsTypes
        types={DRESS_TYPES}
        activeType={activeType}
        onSelect={setActiveType}
      />

      <section className="mx-auto max-w-[1440px] px-5 py-10 sm:px-8 lg:px-12">
        <div className="mb-6 flex items-baseline justify-between">
          <h2 className="text-lg font-semibold text-stone-900">{activeType}</h2>
          <span className="text-xs font-medium uppercase tracking-[0.1em] text-stone-400">
            {filteredProducts.length} items
          </span>
        </div>

        <div className="grid grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
    </div>
  )
}

export default Products