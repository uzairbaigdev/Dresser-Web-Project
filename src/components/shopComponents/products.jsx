import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import ProductsTypes, { DRESS_TYPES } from './productsTypes'

const ADJECTIVES = [
  'Sunwashed', 'Classic', 'Elegant', 'Breezy', 'Chic', 'Minimal', 'Vintage',
  'Modern', 'Relaxed', 'Tailored', 'Printed', 'Solid', 'Embroidered',
  'Textured', 'Draped', 'Fitted', 'Flowy', 'Structured', 'Everyday',
  'Refined', 'Bold', 'Soft', 'Luxe', 'Weekend', 'Statement', 'Effortless',
  'Polished', 'Timeless', 'Playful', 'Sleek',
]

const BADGES = ['New', 'Best Seller', 'Trending', 'Popular', 'Limited', 'Featured']

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
        image: `${categorySlug}-${index + 1}a`,
        imageHover: `${categorySlug}-${index + 1}b`,
      })
    })
  })

  return products
}

const PRODUCTS = buildProducts()

const formatPrice = (price) =>
  new Intl.NumberFormat('en-PK', {
    style: 'currency',
    currency: 'PKR',
    maximumFractionDigits: 0,
  }).format(price)

const imageUrlFor = (seed) => `https://picsum.photos/seed/${seed}/600/800`

const ProductCard = ({ product }) => {
  const image = imageUrlFor(product.image)
  const imageHover = imageUrlFor(product.imageHover)
  const detailProduct = {
    ...product,
    categoryLabel: product.category,
    image,
    imageHover,
    gallery: [
      { image, alt: `${product.name} front view` },
      { image: imageHover, alt: `${product.name} alternate view` },
    ],
    short: `${product.name} from our ${product.category} collection.`,
    stock: 'In stock, ships in 24 hours',
  }

  return (
    <article className="group overflow-hidden rounded-2xl border border-stone-200 bg-white transition-shadow hover:shadow-lg">
      <Link to={`/product/${product.id}`} state={{ product: detailProduct }} className="block">
        <div className="relative aspect-[3/4] overflow-hidden bg-stone-100">
          <img
            src={image}
            alt={product.name}
            loading="lazy"
            className="absolute inset-0 h-full w-full object-cover opacity-100 transition-opacity duration-500 ease-in-out group-hover:opacity-0"
          />
          <img
            src={imageHover}
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
      </Link>
    </article>
  )
}

const Products = () => {
  const [activeType, setActiveType] = useState(DRESS_TYPES[0])
  const [searchQuery, setSearchQuery] = useState('')

  const normalizedQuery = searchQuery.trim().toLowerCase()

  const filteredProducts = useMemo(
    () =>
      PRODUCTS.filter((product) => {
        const matchesType = product.category === activeType
        const matchesSearch =
          normalizedQuery.length === 0 ||
          product.name.toLowerCase().includes(normalizedQuery) ||
          product.category.toLowerCase().includes(normalizedQuery)

        return matchesType && matchesSearch
      }),
    [activeType, normalizedQuery]
  )

  return (
    <div className="bg-[var(--brand-paper)]">
      <ProductsTypes
        types={DRESS_TYPES}
        activeType={activeType}
        onSelect={setActiveType}
      />

      <section className="mx-auto max-w-[1440px] px-5 py-10 sm:px-8 lg:px-12">
        <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-stone-900">{activeType}</h2>
            <p className="mt-1 text-xs uppercase tracking-[0.12em] text-stone-400">
              {filteredProducts.length} items
            </p>
          </div>

          <label className="flex w-full max-w-md items-center gap-3 rounded-full border border-stone-300 bg-white px-4 py-3 shadow-sm md:ml-auto">
            <svg viewBox="0 0 24 24" className="h-4 w-4 text-stone-500" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
              <circle cx="11" cy="11" r="7" />
              <path d="M21 21l-4.35-4.35" />
            </svg>
            <input
              type="search"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Search in this category"
              className="w-full border-0 bg-transparent text-sm text-stone-800 placeholder:text-stone-400 focus:outline-none"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="text-xs font-medium uppercase tracking-[0.12em] text-stone-500 transition hover:text-stone-900"
              >
                Clear
              </button>
            )}
          </label>
        </div>

        {filteredProducts.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-stone-300 bg-white px-6 py-14 text-center">
            <p className="text-lg font-medium text-stone-900">No items match your search.</p>
            <p className="mt-2 text-sm text-stone-600">Try another keyword or switch to a different category.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>
    </div>
  )
}

export default Products
