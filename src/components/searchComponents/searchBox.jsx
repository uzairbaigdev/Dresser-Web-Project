import { useState, useEffect, useRef, useMemo, useId } from 'react'
import { Link } from 'react-router-dom'
import { DRESS_TYPES } from '../shopComponents/productsTypes.jsx'

// ---------------------------------------------------------------------------
// Icons — thin-stroke outlines, sized via className. `filled` is only used
// for the wishlist heart, to show a real on/off state rather than decoration.
// ---------------------------------------------------------------------------

const SearchIcon = ({ className = 'w-4 h-4' }) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
        <circle cx="11" cy="11" r="7" />
        <line x1="20" y1="20" x2="16.65" y2="16.65" />
    </svg>
)

const XIcon = ({ className = 'w-4 h-4' }) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
        <line x1="18" y1="6" x2="6" y2="18" />
        <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
)

const LoaderIcon = ({ className = 'w-4 h-4' }) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" className={className} aria-hidden="true">
        <path d="M12 3a9 9 0 1 0 9 9" />
    </svg>
)

const HeartIcon = ({ className = 'w-4 h-4', filled = false }) => (
    <svg viewBox="0 0 24 24" fill={filled ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
        <path d="M12 20.3s-7.4-4.5-9.9-9C.6 7.7 2.7 4.5 6 4.5c2 0 3.5 1 6 3.3 2.5-2.3 4-3.3 6-3.3 3.3 0 5.4 3.2 3.9 6.8-2.5 4.5-9.9 9-9.9 9Z" />
    </svg>
)

const ChevronIcon = ({ className = 'w-4 h-4', direction = 'right' }) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" className={`${className} ${direction === 'left' ? 'rotate-180' : ''}`} aria-hidden="true">
        <path d="M9 6l6 6-6 6" />
    </svg>
)

const ChevronDownIcon = ({ className = 'w-4 h-4' }) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
        <path d="M6 9l6 6 6-6" />
    </svg>
)

const CheckIcon = ({ className = 'w-4 h-4' }) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
        <path d="M20 6 9 17l-5-5" />
    </svg>
)

// Brand mark for the DRESSER wordmark — a simple hanger glyph, thin-stroke
// to match the rest of the icon set. Used in the category panel header.
const Logo = ({ className = 'w-5 h-5' }) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
        <path d="M12 4.5a1.4 1.4 0 1 1-1.4 1.4" />
        <path d="M12 5.9v2.1" />
        <path d="M12 8 3.2 14.2c-.8.5-.4 1.8.6 1.8h16.4c1 0 1.4-1.3.6-1.8L12 8Z" />
        <line x1="6.5" y1="18.5" x2="17.5" y2="18.5" />
    </svg>
)

// ---------------------------------------------------------------------------
// Demo data — ~2 products per category so the component works standalone.
// `image` is left out on purpose: getProductImage() below fills in a
// deterministic placeholder photo per product name. Pass your own
// `products` prop (optionally with a real `image` field) for production use.
// ---------------------------------------------------------------------------

const DEMO_PRODUCTS = DRESS_TYPES.flatMap((category, categoryIndex) =>
    Array.from({ length: 30 }, (_, index) => ({
        name: `${category} ${index + 1}`,
        category,
        price: `$${(categoryIndex + 1) * 18 + (index + 1) * 4}`,
        isNew: index % 5 === 0,
    }))
)

const DEFAULT_CATEGORIES = [...DRESS_TYPES]

// Deterministic placeholder photo per product, keyed by name so the same
// product always renders the same image across re-renders. Swap this for
// real product photography — just pass `image` on each product object and
// it will be used instead.
function getProductImage(product) {
    if (product.image) return product.image
    const seed = encodeURIComponent(product.name.toLowerCase().replace(/\s+/g, '-'))
    return `https://picsum.photos/seed/${seed}/500/650`
}

const HERO_IMAGE = 'https://picsum.photos/seed/dresser-editorial/1600/800'

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

// ---------------------------------------------------------------------------
// ProductCard — used by the results rail below the search bar
// ---------------------------------------------------------------------------

const ProductCard = ({ product }) => {
    const image = getProductImage(product)
    const imageHover = getProductImage({ ...product, name: `${product.name} alternate` })
    const parsePrice = (value) => Number(String(value).replace(/[^0-9.]/g, '')) || 0
    const detailProduct = {
        ...product,
        id: product.id ?? product.name,
        categoryLabel: product.categoryLabel ?? product.category,
        price: parsePrice(product.salePrice ?? product.price),
        oldPrice: product.salePrice ? parsePrice(product.price) : product.oldPrice,
        image,
        imageHover,
        gallery: [
            { image, alt: `${product.name} front view` },
            { image: imageHover, alt: `${product.name} alternate view` },
        ],
        short: product.short ?? `${product.name} from our ${product.category} collection.`,
        stock: product.stock ?? 'In stock, ships in 24 hours',
    }
    const productSlug = String(product.id ?? product.name)
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')

    return (
    <article className="group overflow-hidden rounded-2xl border border-stone-200 bg-white transition-shadow hover:shadow-lg">
        <Link to={`/product/search-${productSlug}`} state={{ product: detailProduct }} className="block">
            <div className="relative aspect-[3/4] overflow-hidden bg-stone-100">
                <img
                    src={image}
                    alt={product.name}
                    loading="lazy"
                    onError={(e) => {
                        e.currentTarget.style.visibility = 'hidden'
                    }}
                    className="absolute inset-0 h-full w-full object-cover opacity-100 transition-opacity duration-500 ease-in-out group-hover:opacity-0"
                />
                <img
                    src={imageHover}
                    alt=""
                    aria-hidden="true"
                    loading="lazy"
                    className="absolute inset-0 h-full w-full scale-105 object-cover opacity-0 transition-opacity duration-500 ease-in-out group-hover:opacity-100"
                />

                {product.isNew && (
                    <span className="absolute left-3 top-3 z-10 rounded-full bg-white/95 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.08em] text-stone-900">
                        New
                    </span>
                )}

                <span className="absolute inset-x-3 bottom-3 translate-y-2 rounded-full bg-white/95 py-2.5 text-center text-[11px] font-semibold uppercase tracking-[0.08em] text-stone-900 opacity-0 transition-all duration-200 ease-out group-hover:translate-y-0 group-hover:opacity-100">
                    View Product
                </span>
            </div>

            <div className="p-4">
                <span className="block text-[10px] font-semibold uppercase tracking-[0.14em] text-stone-400">{product.category}</span>
                <h3 className="mt-1 text-sm font-medium leading-snug text-stone-900">{product.name}</h3>
                <span className="mt-1.5 block text-sm font-semibold text-stone-900">{product.price}</span>
            </div>
        </Link>
    </article>
    )
}

// ---------------------------------------------------------------------------
// SearchBox
// ---------------------------------------------------------------------------

const SearchBox = ({
    onSearch = () => {},
    placeholder = 'Search products...',
    categories = DEFAULT_CATEGORIES,
    products = DEMO_PRODUCTS,
    debounceMs = 300,
}) => {
    const [category, setCategory] = useState(categories[0] ?? DRESS_TYPES[0])
    const [query, setQuery] = useState('')
    const [debouncedQuery, setDebouncedQuery] = useState('')
    const [isOpen, setIsOpen] = useState(false)
    const [highlightedIndex, setHighlightedIndex] = useState(-1)
    const [wishlist, setWishlist] = useState(() => new Set())
    const [scrollState, setScrollState] = useState({ canLeft: false, canRight: false })
    const [isCategoryOpen, setIsCategoryOpen] = useState(false)
    const [categoryHighlight, setCategoryHighlight] = useState(-1)

    const inputRef = useRef(null)
    const debounceTimerRef = useRef(null)
    const hasMountedRef = useRef(false)
    const railRef = useRef(null)
    const categoryButtonRef = useRef(null)

    const comboboxId = useId()
    const listboxId = `${comboboxId}-listbox`
    const categoryListId = `${comboboxId}-category-listbox`

    const normalizedQuery = query.trim()
    const isSearching = normalizedQuery !== debouncedQuery && normalizedQuery.length > 0

    // Debounce: settle the committed query for the dropdown and external callback,
    // but keep the results grid responsive to the current input as the user types.
    useEffect(() => {
        debounceTimerRef.current = setTimeout(() => {
            setDebouncedQuery(normalizedQuery)
        }, debounceMs)
        return () => clearTimeout(debounceTimerRef.current)
    }, [normalizedQuery, debounceMs])

    // Fire onSearch exactly once per settled query/category change, never on mount.
    useEffect(() => {
        if (!hasMountedRef.current) {
            hasMountedRef.current = true
            return
        }
        onSearch(debouncedQuery, category)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [debouncedQuery, category])

    // Combobox suggestions — capped at 6, category + substring match.
    const suggestions = useMemo(() => {
        if (!normalizedQuery) return []
        const q = normalizedQuery.toLowerCase()
        return products
            .filter((p) => p.category === category && p.name.toLowerCase().includes(q))
            .slice(0, 6)
    }, [normalizedQuery, category, products])

    // Results rail — match the current input immediately while typing, without
    // requiring a manual search submit. When the field is empty, show the full
    // selected category exactly as the shop page does.
    const railProducts = useMemo(() => {
        let list = products.filter((p) => p.category === category)
        if (normalizedQuery) {
            const q = normalizedQuery.toLowerCase()
            list = list.filter((p) => p.name.toLowerCase().includes(q))
        }
        return list
    }, [products, category, normalizedQuery])

    // Global "/" shortcut focuses the input, unless the user is already typing somewhere.
    useEffect(() => {
        const handleGlobalKeyDown = (e) => {
            if (e.key !== '/' || e.metaKey || e.ctrlKey || e.altKey) return
            const target = e.target
            const isTyping =
                target?.tagName === 'INPUT' || target?.tagName === 'TEXTAREA' || target?.isContentEditable
            if (isTyping) return
            e.preventDefault()
            inputRef.current?.focus()
        }
        window.addEventListener('keydown', handleGlobalKeyDown)
        return () => window.removeEventListener('keydown', handleGlobalKeyDown)
    }, [])

    // Bypass the pending debounce and settle `value` immediately — the single
    // path (debouncedQuery change) that triggers onSearch, so there's no
    // duplicate firing between debounce and manual submit/select.
    const commitSearch = (value) => {
        clearTimeout(debounceTimerRef.current)
        setQuery(value)
        setDebouncedQuery(value)
        setIsOpen(false)
        setHighlightedIndex(-1)
    }

    const selectSuggestion = (name) => {
        commitSearch(name)
        inputRef.current?.focus()
    }

    const handleChange = (e) => {
        const value = e.target.value
        setQuery(value)
        setIsOpen(true)
        setHighlightedIndex(-1)
    }

    const handleKeyDown = (e) => {
        if (e.key === 'ArrowDown') {
            e.preventDefault()
            if (suggestions.length === 0) return
            setIsOpen(true)
            setHighlightedIndex((i) => (i + 1) % suggestions.length)
        } else if (e.key === 'ArrowUp') {
            e.preventDefault()
            if (suggestions.length === 0) return
            setIsOpen(true)
            setHighlightedIndex((i) => (i - 1 + suggestions.length) % suggestions.length)
        } else if (e.key === 'Escape') {
            setIsOpen(false)
            setHighlightedIndex(-1)
        }
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        if (isOpen && highlightedIndex >= 0 && suggestions[highlightedIndex]) {
            selectSuggestion(suggestions[highlightedIndex].name)
        } else {
            commitSearch(query)
        }
    }

    // Container-level blur: close the dropdown only when focus leaves the
    // whole widget (click-outside / tab-away), not when it moves between
    // the select, input, clear button, suggestions, etc.
    const handleContainerBlur = (e) => {
        if (!e.currentTarget.contains(e.relatedTarget)) {
            setIsOpen(false)
            setHighlightedIndex(-1)
        }
    }

    // Category popover — button + listbox panel (WAI-ARIA "collapsible
    // dropdown listbox" pattern). Focus stays on the trigger button; the
    // highlighted option is tracked in state and exposed via
    // aria-activedescendant, same approach as the search combobox above.
    const openCategoryPanel = () => {
        setIsCategoryOpen(true)
        setCategoryHighlight(categories.indexOf(category))
    }

    const chooseCategory = (value) => {
        setCategory(value)
        setIsCategoryOpen(false)
        categoryButtonRef.current?.focus()
    }

    const handleCategoryButtonKeyDown = (e) => {
        if (!isCategoryOpen) {
            if (e.key === 'ArrowDown' || e.key === 'ArrowUp' || e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                openCategoryPanel()
            }
            return
        }
        if (e.key === 'ArrowDown') {
            e.preventDefault()
            setCategoryHighlight((i) => (i + 1) % categories.length)
        } else if (e.key === 'ArrowUp') {
            e.preventDefault()
            setCategoryHighlight((i) => (i - 1 + categories.length) % categories.length)
        } else if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            if (categoryHighlight >= 0) chooseCategory(categories[categoryHighlight])
        } else if (e.key === 'Escape') {
            e.preventDefault()
            setIsCategoryOpen(false)
        } else if (e.key === 'Tab') {
            setIsCategoryOpen(false)
        }
    }

    // Same click-outside/tab-away trick as handleContainerBlur, scoped to
    // just the category control so it doesn't interfere with the search
    // suggestions dropdown.
    const handleCategoryBlur = (e) => {
        if (!e.currentTarget.contains(e.relatedTarget)) {
            setIsCategoryOpen(false)
        }
    }

    const toggleWishlist = (name) => {
        setWishlist((prev) => {
            const next = new Set(prev)
            if (next.has(name)) next.delete(name)
            else next.add(name)
            return next
        })
    }

    const showDropdown = isOpen && query.length > 0
    const activeOptionId =
        highlightedIndex >= 0 && suggestions[highlightedIndex] ? `${comboboxId}-option-${highlightedIndex}` : undefined
    const categoryActiveOptionId = categoryHighlight >= 0 ? `${categoryListId}-option-${categoryHighlight}` : undefined

    const railTitle = normalizedQuery ? `Results for “${normalizedQuery}”` : category

    return (
        <div className="w-full">
            {/* Hero ------------------------------------------------------ */}
            <section className="relative w-full overflow-hidden rounded-[2rem] bg-neutral-900">
                <img
                    src={HERO_IMAGE}
                    alt=""
                    aria-hidden="true"
                    onError={(e) => {
                        e.currentTarget.style.display = 'none'
                    }}
                    className="absolute inset-0 w-full h-full object-cover opacity-90"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-black/10" />
                <div className="relative px-6 sm:px-12 pt-16 sm:pt-20 pb-24 sm:pb-28 text-center">
                    <h1 className="text-3xl sm:text-5xl font-medium tracking-tight text-white">
                        Dresses for every kind of day
                    </h1>
                    <p className="mt-3 text-white/80 max-w-md mx-auto text-sm sm:text-base">
                        Search the full collection, or browse by category below.
                    </p>
                </div>
            </section>

            {/* Search bar — floats over the hero's bottom edge ----------- */}
            <div className="relative z-10 -mt-9 sm:-mt-8 px-4 sm:px-10">
                <div className="relative max-w-2xl mx-auto" onBlur={handleContainerBlur}>
                    <form
                        role="search"
                        onSubmit={handleSubmit}
                        className="flex items-center bg-[var(--brand-paper)] border border-neutral-300 rounded-full pl-2 pr-1.5 py-1.5 shadow-[0_10px_30px_rgba(0,0,0,0.18)] transition-[box-shadow,transform] duration-200 ease-out focus-within:shadow-[0_14px_36px_rgba(0,0,0,0.22)] focus-within:-translate-y-px"
                    >
                        <div className="relative flex-shrink-0" onBlur={handleCategoryBlur}>
                            <button
                                type="button"
                                ref={categoryButtonRef}
                                onClick={() => (isCategoryOpen ? setIsCategoryOpen(false) : openCategoryPanel())}
                                onKeyDown={handleCategoryButtonKeyDown}
                                aria-haspopup="listbox"
                                aria-expanded={isCategoryOpen}
                                aria-controls={categoryListId}
                                aria-activedescendant={categoryActiveOptionId}
                                className="flex items-center gap-1.5 bg-transparent text-sm text-neutral-700 pl-3 pr-2 py-1.5 rounded-full hover:bg-neutral-900/5 focus:outline-none focus:bg-neutral-900/5 transition-colors duration-150"
                            >
                                <span className="max-w-[8rem] truncate">{category}</span>
                                <ChevronDownIcon
                                    className={`w-3.5 h-3.5 text-neutral-400 flex-shrink-0 transition-transform duration-150 ${
                                        isCategoryOpen ? 'rotate-180' : ''
                                    }`}
                                />
                            </button>

                            {isCategoryOpen && (
                                <div
                                    id={categoryListId}
                                    role="listbox"
                                    aria-label="Category"
                                    tabIndex={-1}
                                    className="absolute left-0 top-full mt-2 w-64 bg-white border border-neutral-200 rounded-2xl shadow-xl overflow-hidden z-40"
                                >
                                    <div className="flex items-center gap-2 px-4 py-3 border-b border-neutral-100">
                                        <span className="flex items-center justify-center w-7 h-7 rounded-full bg-neutral-900 text-white flex-shrink-0">
                                            <Logo className="w-4 h-4" />
                                        </span>
                                        <div className="min-w-0">
                                            <p className="text-sm text-neutral-900 tracking-tight leading-tight">DRESSER</p>
                                            <p className="text-[11px] text-neutral-400 leading-tight">Shop by category</p>
                                        </div>
                                    </div>

                                    <ul className="max-h-72 overflow-y-auto py-1">
                                        {categories.map((c, i) => (
                                            <li key={c} role="presentation">
                                                <button
                                                    type="button"
                                                    id={`${categoryListId}-option-${i}`}
                                                    role="option"
                                                    aria-selected={c === category}
                                                    onMouseDown={(e) => e.preventDefault()}
                                                    onClick={() => chooseCategory(c)}
                                                    onMouseEnter={() => setCategoryHighlight(i)}
                                                    className={`w-full flex items-center justify-between gap-2 px-4 py-2 text-left text-sm transition-colors duration-100 ${
                                                        i === categoryHighlight ? 'bg-neutral-100' : ''
                                                    } ${c === category ? 'text-neutral-900' : 'text-neutral-600'}`}
                                                >
                                                    <span className="truncate">{c}</span>
                                                    {c === category && <CheckIcon className="w-4 h-4 text-neutral-900 flex-shrink-0" />}
                                                </button>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>

                        <div className="w-px h-5 bg-neutral-300 mx-1 flex-shrink-0" aria-hidden="true" />

                        <span className="flex items-center justify-center w-8 h-8 text-neutral-500 flex-shrink-0">
                            {isSearching ? <LoaderIcon className="w-4 h-4 animate-spin" /> : <SearchIcon />}
                        </span>

                        <input
                            ref={inputRef}
                            type="text"
                            role="combobox"
                            aria-autocomplete="list"
                            aria-expanded={showDropdown}
                            aria-controls={listboxId}
                            aria-activedescendant={activeOptionId}
                            value={query}
                            onChange={handleChange}
                            onKeyDown={handleKeyDown}
                            onFocus={() => query && setIsOpen(true)}
                            placeholder={placeholder}
                            className="flex-1 min-w-0 bg-transparent text-[15px] text-neutral-900 placeholder-neutral-400 focus:outline-none py-1.5"
                        />

                        {query === '' && (
                            <kbd className="hidden sm:inline-flex items-center justify-center w-5 h-5 mr-1 rounded-md border border-neutral-300 text-xs text-neutral-400 flex-shrink-0">
                                /
                            </kbd>
                        )}

                        <button
                            type="button"
                            onClick={() => commitSearch('')}
                            aria-label="Clear search"
                            tabIndex={query ? 0 : -1}
                            className={`flex items-center justify-center w-7 h-7 mr-1 rounded-full text-neutral-400 hover:text-neutral-700 hover:bg-neutral-200/60 flex-shrink-0 transition-all duration-150 ${
                                query ? 'opacity-100 scale-100' : 'opacity-0 scale-75 pointer-events-none'
                            }`}
                        >
                            <XIcon />
                        </button>

                        <button
                            type="submit"
                            className="flex items-center gap-1.5 flex-shrink-0 whitespace-nowrap bg-neutral-900 text-white text-sm rounded-full pl-4 pr-4 py-2 hover:bg-neutral-800 transition-colors duration-150"
                        >
                            <SearchIcon className="w-3.5 h-3.5" />
                            Search
                        </button>
                    </form>

                    {showDropdown && (
                        <ul
                            id={listboxId}
                            role="listbox"
                            className="absolute left-0 right-0 mt-2 bg-white border border-neutral-200 rounded-2xl shadow-lg py-1 z-30 overflow-hidden"
                        >
                            {isSearching ? (
                                <li role="presentation" className="px-4 py-3 text-sm text-neutral-400">
                                    Searching…
                                </li>
                            ) : suggestions.length === 0 ? (
                                <li role="presentation" className="px-4 py-3 text-sm text-neutral-400">
                                    No results found for “{debouncedQuery}”
                                </li>
                            ) : (
                                suggestions.map((p, i) => (
                                    <li key={p.name} role="presentation">
                                        <button
                                            type="button"
                                            id={`${comboboxId}-option-${i}`}
                                            role="option"
                                            aria-selected={i === highlightedIndex}
                                            onMouseDown={(e) => e.preventDefault()}
                                            onClick={() => selectSuggestion(p.name)}
                                            onMouseEnter={() => setHighlightedIndex(i)}
                                            className={`w-full flex items-center justify-between gap-3 px-4 py-2 text-left text-sm transition-colors duration-100 ${
                                                i === highlightedIndex ? 'bg-neutral-100' : ''
                                            }`}
                                        >
                                            <span className="text-neutral-800 truncate">{highlightMatch(p.name, debouncedQuery)}</span>
                                            <span className="text-xs text-neutral-400 flex-shrink-0">{p.category}</span>
                                        </button>
                                    </li>
                                ))
                            )}
                        </ul>
                    )}
                </div>
            </div>

            <section className="mt-10 sm:mt-14" aria-label="Product results">
                <div className="mb-4 px-4 sm:px-10">
                    <h2 className="text-lg font-medium text-neutral-900 sm:text-xl">{railTitle}</h2>
                </div>

                {railProducts.length === 0 ? (
                    <p className="px-4 text-sm text-neutral-400 sm:px-10">No products match your search.</p>
                ) : (
                    <div className="mx-auto max-w-[1440px] px-4 pb-2 sm:px-8 lg:px-12">
                        <div className="mb-6">
                            <h2 className="text-lg font-semibold text-stone-900">{railTitle}</h2>
                        </div>

                        <div className="grid grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                            {railProducts.map((product) => (
                                <ProductCard key={product.name} product={product} />
                            ))}
                        </div>
                    </div>
                )}
            </section>
        </div>
    )
}

export default SearchBox