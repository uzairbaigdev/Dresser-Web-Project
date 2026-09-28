import React, { useState, useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'

// ---------------------------------------------------------------------------
// Icons — thin-stroke outlines, consistent with the SearchBox icon set.
// ---------------------------------------------------------------------------

const HeartIcon = ({ className = 'w-4 h-4', filled = false }) => (
    <svg viewBox="0 0 24 24" fill={filled ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
        <path d="M12 20.3s-7.4-4.5-9.9-9C.6 7.7 2.7 4.5 6 4.5c2 0 3.5 1 6 3.3 2.5-2.3 4-3.3 6-3.3 3.3 0 5.4 3.2 3.9 6.8-2.5 4.5-9.9 9-9.9 9Z" />
    </svg>
)

const StarIcon = ({ className = 'w-3.5 h-3.5', filled = false }) => (
    <svg viewBox="0 0 24 24" fill={filled ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
        <path d="M12 3.5l2.6 5.3 5.9.9-4.3 4.1 1 5.8-5.2-2.7-5.2 2.7 1-5.8L3.5 9.7l5.9-.9L12 3.5Z" />
    </svg>
)

const EmptyIcon = ({ className = 'w-6 h-6' }) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
        <circle cx="11" cy="11" r="7" />
        <line x1="20" y1="20" x2="16.65" y2="16.65" />
        <line x1="8.3" y1="8.3" x2="13.7" y2="13.7" />
        <line x1="13.7" y1="8.3" x2="8.3" y2="13.7" />
    </svg>
)

// ---------------------------------------------------------------------------
// Deterministic pseudo-random helper — so the 100-item demo catalog (price,
// rating, review count, sale/new flags) renders identically on the server
// and the client. A plain Math.random() at module scope would produce a
// different catalog on each side and break hydration.
// ---------------------------------------------------------------------------

function seededRandom(seed) {
    let t = seed + 0x6d2b79f5
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
}

// ---------------------------------------------------------------------------
// Demo catalog — 100 products across the 11 DRESS_TYPES categories, so this
// component works standalone. Pass a real `products` prop (same shape) to
// use your own catalog instead: { id, name, category, price, salePrice,
// rating, reviews, isNew, image? }.
// ---------------------------------------------------------------------------

const CATALOG_NAMES = {
    'Casual Dresses': [
        'Sunday Cotton Sundress', 'Linen Day Dress', 'Chambray Shirt-Tail Dress', 'Relaxed T-Shirt Dress',
        'Tiered Cotton Midi', 'Everyday Jersey Dress', 'Gauze Wrap-Front Dress', 'Rib-Knit Tank Dress',
        'Brushed Flannel Dress', 'Washed Denim Dress',
    ],
    'Party Wear': [
        'Sequin Mini Dress', 'Metallic Slip Dress', 'Feather-Trim Mini', 'Beaded Halter Dress',
        'Satin Cowl-Neck Dress', 'Fringe Flapper Dress', 'Velvet Bardot Dress', 'Shimmer Wrap Dress',
        'Crystal-Strap Mini',
    ],
    'Maxi Dresses': [
        'Floral Maxi Dress', 'Tiered Boho Maxi', 'Halter Neck Maxi', 'Cutout Waist Maxi',
        'Button-Front Maxi', 'Smocked Bodice Maxi', 'Off-Shoulder Maxi', 'Chiffon Tiered Maxi',
        'Split-Hem Maxi',
    ],
    'Bodycon': [
        'Ribbed Bodycon Dress', 'Satin Bodycon Midi', 'Cut-Out Bodycon Dress', 'Ruched Bodycon Dress',
        'Long-Sleeve Bodycon', 'Mock-Neck Bodycon', 'Corset Bodycon Dress', 'Mesh-Panel Bodycon',
    ],
    'A-Line': [
        'Classic A-Line Dress', 'Pleated A-Line Midi', 'Collared A-Line Dress', 'Puff-Sleeve A-Line',
        'Fit-and-Flare Dress', 'Tweed A-Line Dress', 'Belted A-Line Dress', 'Textured A-Line Midi',
        'Swing A-Line Dress',
    ],
    'Wrap Dresses': [
        'Silk Wrap Dress', 'Jersey Wrap Midi', 'Faux-Wrap Shirt Dress', 'Printed Wrap Dress',
        'Ruffle-Sleeve Wrap Dress', 'Ribbed Wrap Dress', 'Linen Wrap Midi', 'Knot-Front Wrap Dress',
    ],
    'Shirt Dresses': [
        'Poplin Shirt Dress', 'Denim Shirt Dress', 'Belted Shirt Dress', 'Oversized Shirt Dress',
        'Striped Shirt Dress', 'Linen Shirt Dress', 'Utility Shirt Dress', 'Tie-Waist Shirt Dress',
    ],
    'Co-ord Sets': [
        'Linen Co-ord Set', 'Knit Two-Piece Set', 'Blazer & Skirt Set', 'Cropped Vest Co-ord',
        'Wide-Leg Co-ord Set', 'Ribbed Cami Co-ord', 'Tailored Trouser Set', 'Printed Shirt Co-ord',
        'Textured Knit Set',
    ],
    'Ethnic Wear': [
        'Embroidered Anarkali', 'Printed Kurta Set', 'Silk Saree Blouse Set', 'Banarasi Lehenga',
        'Chikankari Kurta', 'Mirror-Work Sharara', 'Zari Border Saree', 'Bandhani Kurta Set',
        'Gota-Patti Anarkali', 'Handloom Cotton Saree',
    ],
    'Jumpsuits': [
        'Wide-Leg Jumpsuit', 'Belted Utility Jumpsuit', 'Tailored Culotte Jumpsuit', 'Halter Jumpsuit',
        'Denim Jumpsuit', 'Sleeveless Linen Jumpsuit', 'Cropped Jumpsuit', 'Off-Shoulder Jumpsuit',
        'Satin Wide-Leg Jumpsuit',
    ],
    'Formal Gowns': [
        'Velvet Evening Gown', 'Chiffon Ball Gown', 'Sequin Column Gown', 'Off-Shoulder Satin Gown',
        'Mermaid Lace Gown', 'Draped Silk Gown', 'Embellished A-Line Gown', 'Tulle Ball Gown',
        'Beaded Sheath Gown', 'Cape-Sleeve Gown', 'Corset Ball Gown',
    ],
}

function buildCatalog() {
    const items = []
    let index = 0
    Object.entries(CATALOG_NAMES).forEach(([category, names]) => {
        names.forEach((name) => {
            const seed = index * 101
            const onSale = seededRandom(seed + 1) < 0.22
            const price = 45 + Math.round(seededRandom(seed + 2) * 180)
            items.push({
                id: `p-${index}`,
                name,
                category,
                price,
                salePrice: onSale ? Math.round(price * 0.75) : null,
                rating: Math.round((3.6 + seededRandom(seed + 3) * 1.4) * 10) / 10,
                reviews: 8 + Math.round(seededRandom(seed + 4) * 240),
                isNew: index % 9 === 0,
            })
            index += 1
        })
    })
    return items
}

const DEMO_PRODUCTS = buildCatalog()

// ---------------------------------------------------------------------------
// Curated product photography — real, professionally shot photos of men's
// formal dress-wear (suits, blazers, dress shirts, tuxedos), sourced from
// Unsplash under its free-to-use license. Pass a real `image` field on your
// own product objects to use your own photography instead; this pool only
// backs the 100-item demo catalog.
// ---------------------------------------------------------------------------

const FASHION_IMAGE_POOL = [
    'https://images.unsplash.com/photo-1618886614638-80e3c103d31a', // man in a black suit, full length
    'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7', // man in a black notched-lapel suit jacket
    'https://images.unsplash.com/photo-1617137984095-74e4e5e3613f', // man in a blue suit, standing portrait
    'https://images.unsplash.com/photo-1617127365659-c47fa864d8bc', // man in a black suit jacket
    'https://images.unsplash.com/photo-1623880840102-7df0a9f3545b', // man in a black suit jacket, leather bag
    'https://images.unsplash.com/photo-1548454782-15b189d129ab', // man in tailored menswear, outdoor portrait
    'https://images.unsplash.com/photo-1603394151492-5e9b974b090b', // man in a blue suit jacket, white dress shirt
    'https://images.unsplash.com/photo-1613181013804-1dcba09e6a9d', // man in a black suit jacket, studio
    'https://images.unsplash.com/photo-1622497170185-5d668f816a56', // man in a gray suit jacket
    'https://images.unsplash.com/photo-1491336477066-31156b5e4f35', // man in a black suit, wrist detail
    'https://images.unsplash.com/photo-1546572797-e8c933a75a1f', // man in a black tuxedo
    'https://images.unsplash.com/photo-1534030347209-467a5b0ad3e6', // man in a teal dress suit
    'https://images.unsplash.com/photo-1593030103066-0093718efeb9', // man in a blue suit, standing
]

// Requesting a crisp, correctly-cropped size keeps every card visually
// consistent regardless of the source photo's original dimensions.
const IMAGE_PARAMS = 'auto=format&fit=crop&w=600&h=800&q=80'

// Small, dependency-free string hash so a given product id always maps to
// the same pool image (stable across re-renders and page reloads) without
// requiring a numeric id.
function hashString(str) {
    let hash = 0
    for (let i = 0; i < str.length; i += 1) {
        hash = (hash * 31 + str.charCodeAt(i)) | 0
    }
    return Math.abs(hash)
}

// Deterministic photo per product id, drawn from the curated pool above.
// Pass a real `image` field on your own product objects to use real
// photography instead.
function getProductImage(product) {
    if (product.image) return product.image
    const base = FASHION_IMAGE_POOL[hashString(product.id) % FASHION_IMAGE_POOL.length]
    return `${base}?${IMAGE_PARAMS}`
}

// Used only if the primary photo fails to load, so a card never renders
// with an empty box.
function getFallbackImage(product) {
    return `https://picsum.photos/seed/${product.id}/600/800`
}

// Bold the substring of `name` that matches `query` (case-insensitive).
function highlightMatch(name, query) {
    if (!query) return name
    const start = name.toLowerCase().indexOf(query.toLowerCase())
    if (start === -1) return name
    const end = start + query.length
    return (
        <>
            {name.slice(0, start)}
            <strong className="font-semibold text-neutral-900">{name.slice(start, end)}</strong>
            {name.slice(end)}
        </>
    )
}

// Relevance score for "best match" ranking: name prefix > name substring >
// category substring > no match (-1, excluded from results).
function scoreMatch(product, query) {
    const q = query.toLowerCase()
    const name = product.name.toLowerCase()
    if (name.startsWith(q)) return 3
    if (name.includes(q)) return 2
    if (product.category.toLowerCase().includes(q)) return 1
    return -1
}

const PAGE_SIZE = 12

// ---------------------------------------------------------------------------
// ProductCard
// ---------------------------------------------------------------------------

const ProductCard = ({ product, query, isWishlisted, onToggleWishlist, onSelect }) => {
    const { name, category, price, salePrice, rating, reviews, isNew } = product

    return (
        <div className="group">
            <div className="relative">
                <Link to={`/product/${product.id}`} className="relative block w-full aspect-[3/4] overflow-hidden rounded-2xl bg-neutral-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2">
                    <img
                        src={getProductImage(product)}
                        alt={name}
                        loading="lazy"
                        onError={(e) => {
                            e.currentTarget.onerror = null
                            e.currentTarget.src = getFallbackImage(product)
                        }}
                        className="w-full h-full object-cover transition-transform duration-300 ease-out group-hover:scale-105"
                    />

                    <div className="absolute top-3 left-3 flex flex-col items-start gap-1.5">
                        {isNew && (
                            <span className="bg-white/95 text-neutral-900 text-xs px-2.5 py-1 rounded-full">New</span>
                        )}
                        {salePrice && (
                            <span className="bg-neutral-900 text-white text-xs px-2.5 py-1 rounded-full">Sale</span>
                        )}
                    </div>
                </Link>

                <button
                    type="button"
                    onClick={(e) => {
                        e.stopPropagation()
                        onToggleWishlist()
                    }}
                    aria-label={isWishlisted ? `Remove ${name} from wishlist` : `Add ${name} to wishlist`}
                    aria-pressed={isWishlisted}
                    className="absolute top-3 right-3 flex items-center justify-center w-8 h-8 rounded-full bg-white/95 text-neutral-700 hover:text-neutral-900 transition-transform duration-150 hover:scale-105"
                >
                    <HeartIcon filled={isWishlisted} />
                </button>
            </div>

            <div className="mt-2">
                <Link to={`/product/${product.id}`} onClick={() => onSelect(product)} className="text-left focus:outline-none">
                    <p className="text-sm text-neutral-900 leading-snug">{highlightMatch(name, query)}</p>
                </Link>
                <p className="text-xs text-neutral-400 mt-0.5">{category}</p>

                <div className="flex items-center gap-1 mt-1.5">
                    <StarIcon className="w-3.5 h-3.5 text-neutral-900" filled />
                    <span className="text-xs text-neutral-600">{rating.toFixed(1)}</span>
                    <span className="text-xs text-neutral-400">({reviews})</span>
                </div>

                <div className="flex items-center gap-2 mt-1.5">
                    {salePrice ? (
                        <>
                            <span className="text-sm text-neutral-900">${salePrice}</span>
                            <span className="text-xs text-neutral-400 line-through">${price}</span>
                        </>
                    ) : (
                        <span className="text-sm text-neutral-900">${price}</span>
                    )}
                </div>
            </div>
        </div>
    )
}

// ---------------------------------------------------------------------------
// Loading skeleton + empty state
// ---------------------------------------------------------------------------

const SkeletonGrid = () => (
    <div
        className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-x-4 gap-y-8"
        aria-hidden="true"
    >
        {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className="animate-pulse">
                <div className="aspect-[3/4] rounded-2xl bg-neutral-200" />
                <div className="mt-3 h-3.5 w-4/5 rounded-full bg-neutral-200" />
                <div className="mt-2 h-3 w-2/5 rounded-full bg-neutral-200" />
                <div className="mt-2 h-3 w-1/4 rounded-full bg-neutral-200" />
            </div>
        ))}
    </div>
)

const EmptyState = ({ query, category }) => (
    <div className="flex flex-col items-center justify-center text-center py-20 px-4">
        <div className="flex items-center justify-center w-12 h-12 rounded-full bg-neutral-100 text-neutral-400 mb-4">
            <EmptyIcon />
        </div>
        <p className="text-neutral-900 font-medium">No results found</p>
        <p className="text-sm text-neutral-500 mt-1 max-w-sm">
            {query
                ? `We couldn’t find anything matching “${query}”${category !== 'All' ? ` in ${category}` : ''}. Try a different search term or category.`
                : `There are no products in ${category} yet.`}
        </p>
    </div>
)

// ---------------------------------------------------------------------------
// SearchResult
// ---------------------------------------------------------------------------

const SearchResult = ({
    query = '',
    category = 'All',
    products = DEMO_PRODUCTS,
    isLoading = false,
    onSelectProduct = () => {},
}) => {
    const [wishlist, setWishlist] = useState(() => new Set())
    const [visibleCount, setVisibleCount] = useState(PAGE_SIZE)

    // Best-match filtering: restrict to the active category, then — if
    // there's a query — rank by relevance (name prefix > name substring >
    // category substring) and drop anything that doesn't match at all.
    const results = useMemo(() => {
        let list = category && category !== 'All' ? products.filter((p) => p.category === category) : products

        if (query) {
            list = list
                .map((product) => ({ product, score: scoreMatch(product, query) }))
                .filter((entry) => entry.score >= 0)
                .sort((a, b) => b.score - a.score || a.product.name.localeCompare(b.product.name))
                .map((entry) => entry.product)
        } else {
            list = [...list].sort((a, b) => a.name.localeCompare(b.name))
        }

        return list
    }, [products, category, query])

    // Reset pagination whenever the active filters change.
    useEffect(() => {
        setVisibleCount(PAGE_SIZE)
    }, [query, category])

    const toggleWishlist = (id) => {
        setWishlist((prev) => {
            const next = new Set(prev)
            if (next.has(id)) next.delete(id)
            else next.add(id)
            return next
        })
    }

    const heading = query ? `Results for “${query}”` : category === 'All' ? '' : category
    const visibleResults = results.slice(0, visibleCount)
    const hasMore = visibleCount < results.length

    return (
        <section className="w-full" aria-label="Search results">
            {heading && (
                <div className="mb-6">
                    <h2 className="text-lg sm:text-xl font-medium text-neutral-900">{heading}</h2>
                </div>
            )}

            {isLoading ? (
                <SkeletonGrid />
            ) : results.length === 0 ? (
                <EmptyState query={query} category={category} />
            ) : (
                <>
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-x-4 gap-y-8">
                        {visibleResults.map((product) => (
                            <ProductCard
                                key={product.id}
                                product={product}
                                query={query}
                                isWishlisted={wishlist.has(product.id)}
                                onToggleWishlist={() => toggleWishlist(product.id)}
                                onSelect={onSelectProduct}
                            />
                        ))}
                    </div>

                    {hasMore && (
                        <div className="flex justify-center mt-10">
                            <button
                                type="button"
                                onClick={() => setVisibleCount((v) => v + PAGE_SIZE)}
                                className="px-6 py-2.5 rounded-full border border-neutral-300 text-sm text-neutral-700 hover:border-neutral-900 hover:text-neutral-900 transition-colors duration-150"
                            >
                                Show more ({results.length - visibleCount} left)
                            </button>
                        </div>
                    )}
                </>
            )}
        </section>
    )
}

export default SearchResult