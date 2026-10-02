import { useEffect, useMemo, useState } from 'react'
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom'
import Nav from '../../components/nav/nav.jsx'
import Footer from '../../components/homeComponets/footer.jsx'
import { productCatalog, getProductById, getSuggestedProducts } from '../../data/products.js'
import { useCart } from '../../context/CartContext.jsx'

const PAY = ['Visa', 'Mastercard', 'PayPal', 'Apple Pay', 'UPI', 'Bank transfer']

const Icon = ({ d, className = 'h-5 w-5' }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
    <path d={d} />
  </svg>
)

const Stars = ({ value, size = 'h-4 w-4' }) => (
  <span className="inline-flex" role="img" aria-label={`${value} out of 5 stars`}>
    {[1, 2, 3, 4, 5].map((star) => (
      <svg
        key={star}
        viewBox="0 0 20 20"
        className={`${size} ${star <= Math.round(value) ? 'text-[var(--brand-copper)]' : 'text-stone-300'}`}
        fill="currentColor"
        aria-hidden="true"
      >
        <path d="M10 1.5l2.6 5.5 6 .8-4.4 4.2 1.1 6-5.3-2.9-5.3 2.9 1.1-6L1.4 7.8l6-.8z" />
      </svg>
    ))}
  </span>
)

const btn = 'rounded-full px-6 py-3.5 text-sm font-medium transition duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--brand-forest)] active:scale-[.98]'

const resolveProductByRoute = (productId) => {
  if (!productId) return productCatalog[0]

  const directMatch = productCatalog.find(
    (product) => product.id === productId || product.slug === productId
  )

  if (directMatch) return directMatch

  const normalized = String(productId).toLowerCase().replace(/^(shop|search)-/i, '')
  const slugMatch = productCatalog.find((product) => product.id === normalized || product.slug === normalized)

  if (slugMatch) return slugMatch

  const numericMatch = normalized.match(/\d+/)
  if (numericMatch) {
    const numericId = Number(numericMatch[0])
    if (Number.isFinite(numericId) && numericId > 0) {
      return productCatalog[numericId - 1] || productCatalog[0]
    }
  }

  return getProductById(productId)
}

function ProductPage() {
  const { productId } = useParams()
  const location = useLocation()
  const navigate = useNavigate()
  const { addItem } = useCart()

  const product = location.state?.product || resolveProductByRoute(productId)
  const suggestedProducts = useMemo(() => getSuggestedProducts(product), [product])

  const [selectedImage, setSelectedImage] = useState(0)
  const [selectedColor, setSelectedColor] = useState(0)
  const [selectedMaterial, setSelectedMaterial] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [videoOpen, setVideoOpen] = useState(false)
  const [saved, setSaved] = useState(false)

  const imageList = product.gallery || [{ image: product.image, alt: product.name }]
  const materialOptions = product.materials || ['Premium cotton', 'Soft finish']
  const originalPrice = product.oldPrice || product.price + 800
  const discount = Math.round(((originalPrice - product.price) / originalPrice) * 100)
  const specList = product.specs || [['Material', product.materials?.join(', ') || product.categoryLabel]]

  useEffect(() => {
    setSelectedImage(0)
    setSelectedColor(0)
    setSelectedMaterial(0)
    setQuantity(1)
  }, [productId])

  const addCurrentProductToCart = () => {
    addItem(
      {
        ...product,
        id: product.id,
        image: imageList[0]?.image || product.image,
      },
      quantity
    )
  }

  const handleBuyNow = () => {
    addCurrentProductToCart()
    navigate('/checkout')
  }

  return (
    <div className="min-h-screen bg-[var(--brand-paper)] font-sans text-stone-800 antialiased">
      <style>{`.font-serif{font-family:var(--font-serif);letter-spacing:0} @media (prefers-reduced-motion:reduce){*{transition:none!important;animation:none!important}}`}</style>

      <Nav forceSolid />

      <main className="pt-24">
        <div className="mx-auto grid max-w-7xl gap-10 px-5 py-8 md:px-8 lg:grid-cols-[1.15fr_1fr] lg:gap-16 lg:py-12">
          <div className="flex flex-col gap-4">
            <div className="group relative aspect-[4/5] overflow-hidden rounded-3xl bg-stone-200">
              <img
                src={imageList[selectedImage]?.image || product.image}
                alt={imageList[selectedImage]?.alt || product.name}
                loading="eager"
                className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
              />
              <span className="absolute left-4 top-4 rounded-full bg-[var(--brand-forest)] px-3 py-1 text-xs font-medium text-white">
                Save {discount}%
              </span>
              <button
                type="button"
                onClick={() => setVideoOpen(true)}
                className={`${btn} absolute bottom-4 left-4 flex items-center gap-2 bg-white/90 py-2.5 text-stone-900 backdrop-blur hover:bg-white`}
              >
                <Icon d="M8 5v14l11-7z" className="h-4 w-4" />
                Watch the film
              </button>
            </div>

            <div className="flex gap-3 overflow-x-auto pb-1 lg:gap-2" role="tablist" aria-label="Product images">
              {imageList.map((item, index) => (
                <button
                  key={`${product.id}-${index}`}
                  type="button"
                  role="tab"
                  aria-selected={selectedImage === index}
                  onClick={() => setSelectedImage(index)}
                  className={`aspect-square w-20 shrink-0 overflow-hidden rounded-xl border-2 bg-stone-200 transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--brand-forest)] ${selectedImage === index ? 'border-[var(--brand-forest)]' : 'border-transparent opacity-80 hover:opacity-100'}`}
                >
                  <img src={item.image} alt={item.alt || product.name} loading="lazy" className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          <div className="lg:sticky lg:top-6 lg:self-start">
            <div className="flex flex-col gap-6">
              <div>
                <p className="text-sm text-stone-500">{product.brand || 'Dresser'} • {product.categoryLabel || product.category}</p>
                <h1 className="mt-2 font-serif text-4xl leading-tight text-stone-900 md:text-5xl">{product.name}</h1>
                <div className="mt-3 flex items-center gap-2 text-sm text-stone-600">
                  <Stars value={product.rating || 4.8} />
                  <a href="#reviews" className="underline-offset-4 hover:underline">{product.rating || 4.8} • {product.reviews || 128} reviews</a>
                </div>
                <p className="mt-4 max-w-md text-stone-600">{product.short}</p>
              </div>

              <div>
                <div className="flex items-baseline gap-3">
                  <span className="font-serif text-4xl text-stone-900">Rs. {product.price.toLocaleString('en-PK')}</span>
                  <span className="text-lg text-stone-400 line-through">Rs. {originalPrice.toLocaleString('en-PK')}</span>
                  <span className="rounded-full bg-[var(--brand-copper)]/15 px-2.5 py-1 text-xs font-medium text-[var(--brand-copper-deep)]">{discount}% off</span>
                </div>
                <p className="mt-1 text-sm text-stone-500">or 4 interest-free payments of Rs. {Math.round(product.price / 4).toLocaleString('en-PK')}</p>
              </div>

              <fieldset>
                <legend className="mb-3 text-sm font-medium text-stone-900">
                  Colour: <span className="font-normal text-stone-500">{product.colors?.[selectedColor]?.name || 'Default'}</span>
                </legend>
                <div className="flex flex-wrap gap-3">
                  {(product.colors || [{ name: 'Default', hex: '#d6cfc4' }]).map((color, index) => (
                    <button
                      key={color.name}
                      type="button"
                      onClick={() => setSelectedColor(index)}
                      aria-label={color.name}
                      aria-pressed={selectedColor === index}
                      className={`relative h-10 w-10 rounded-full border-2 transition ${selectedColor === index ? 'border-stone-900' : 'border-stone-200 hover:border-stone-400'}`}
                      style={{ backgroundColor: color.hex }}
                    >
                      <span className="sr-only">{color.name}</span>
                    </button>
                  ))}
                </div>
              </fieldset>

              <fieldset>
                <legend className="mb-3 text-sm font-medium text-stone-900">
                  Material: <span className="font-normal text-stone-500">{materialOptions[selectedMaterial] || materialOptions[0]}</span>
                </legend>
                <div className="flex flex-wrap gap-2">
                  {materialOptions.map((material, index) => (
                    <button
                      key={material}
                      type="button"
                      onClick={() => setSelectedMaterial(index)}
                      aria-pressed={selectedMaterial === index}
                      className={`rounded-full border px-3 py-2 text-xs font-medium transition ${selectedMaterial === index ? 'border-[var(--brand-forest)] bg-[var(--brand-forest)] text-white' : 'border-stone-200 bg-white text-stone-700 hover:border-stone-300'}`}
                    >
                      {material}
                    </button>
                  ))}
                </div>
              </fieldset>

              <div className="flex items-center gap-3 rounded-2xl border border-stone-200 bg-white p-2">
                <button
                  type="button"
                  aria-label="Decrease quantity"
                  onClick={() => setQuantity((value) => Math.max(1, value - 1))}
                  className="grid h-10 w-10 place-items-center rounded-full text-lg text-stone-700 hover:bg-stone-100"
                >
                  −
                </button>
                <span className="min-w-10 text-center text-base font-medium text-stone-900">{quantity}</span>
                <button
                  type="button"
                  aria-label="Increase quantity"
                  onClick={() => setQuantity((value) => value + 1)}
                  className="grid h-10 w-10 place-items-center rounded-full text-lg text-stone-700 hover:bg-stone-100"
                >
                  +
                </button>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <button
                  type="button"
                  onClick={addCurrentProductToCart}
                  className={`${btn} flex-1 bg-[var(--brand-forest)] text-white hover:bg-[var(--brand-forest-deep)]`}
                >
                  Add to cart
                </button>
                <button
                  type="button"
                  onClick={handleBuyNow}
                  className={`${btn} flex-1 border border-stone-300 bg-white text-stone-900 hover:bg-stone-100`}
                >
                  Buy now
                </button>
              </div>

              <div className="flex items-center justify-between rounded-2xl border border-stone-200 bg-white px-4 py-3 text-sm text-stone-700">
                <span>In stock</span>
                <button
                  type="button"
                  onClick={() => setSaved((value) => !value)}
                  className="inline-flex items-center gap-2 font-medium text-stone-900"
                >
                  <Icon d={saved ? 'M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z' : 'M6 3h12a2 2 0 0 1 2 2v18l-8-5-8 5V5a2 2 0 0 1 2-2z'} className="h-4 w-4" />
                  {saved ? 'Saved' : 'Save'}
                </button>
              </div>

              <div className="rounded-3xl border border-stone-200 bg-white p-5">
                <h2 className="text-sm font-semibold uppercase tracking-[0.12em] text-stone-500">Details</h2>
                <dl className="mt-4 space-y-3 text-sm text-stone-700">
                  {specList.map(([label, value]) => (
                    <div key={label} className="flex justify-between gap-4 border-b border-stone-100 pb-2 last:border-b-0 last:pb-0">
                      <dt className="text-stone-500">{label}</dt>
                      <dd className="text-right font-medium text-stone-900">{value}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            </div>
          </div>
        </div>

        <section className="mx-auto max-w-7xl px-5 pb-16 md:px-8">
          <div className="rounded-3xl border border-stone-200 bg-white p-6 md:p-8">
            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-stone-500">Shipping & care</p>
                <h2 className="mt-2 font-serif text-3xl text-stone-900">Made for effortless everyday wear</h2>
              </div>
              <div className="flex flex-wrap gap-2">
                {PAY.map((method) => (
                  <span key={method} className="rounded-full border border-stone-200 bg-[var(--brand-paper)] px-3 py-2 text-xs font-medium uppercase tracking-[0.12em] text-stone-600">
                    {method}
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-8 grid gap-4 md:grid-cols-3">
              <div className="rounded-2xl bg-[var(--brand-paper)] p-5">
                <p className="text-sm font-semibold text-stone-900">Free delivery</p>
                <p className="mt-2 text-sm text-stone-600">On orders over Rs. 6,000 with express updates from dispatch to delivery.</p>
              </div>
              <div className="rounded-2xl bg-[var(--brand-paper)] p-5">
                <p className="text-sm font-semibold text-stone-900">Easy returns</p>
                <p className="mt-2 text-sm text-stone-600">30-day easy return window for unworn items with original packaging.</p>
              </div>
              <div className="rounded-2xl bg-[var(--brand-paper)] p-5">
                <p className="text-sm font-semibold text-stone-900">Secure checkout</p>
                <p className="mt-2 text-sm text-stone-600">Protected payments with real-time confirmation and order tracking.</p>
              </div>
            </div>
          </div>
        </section>

        <section id="reviews" className="mx-auto max-w-7xl px-5 pb-18 md:px-8">
          <div className="rounded-3xl border border-stone-200 bg-white p-6 md:p-8">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-stone-500">Customer love</p>
                <h2 className="mt-2 font-serif text-3xl text-stone-900">Rated {product.rating || 4.8} out of 5</h2>
              </div>
              <div className="inline-flex items-center gap-3 rounded-full border border-stone-200 bg-[var(--brand-paper)] px-4 py-2">
                <Stars value={product.rating || 4.8} size="h-5 w-5" />
                <span className="text-sm font-medium text-stone-700">{product.reviews || 128} verified reviews</span>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-5 pb-20 md:px-8">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-stone-500">You may also like</p>
              <h2 className="mt-2 font-serif text-3xl text-stone-900">More favorites</h2>
            </div>
            <Link to="/shop" className="text-sm font-medium text-[var(--brand-forest)] hover:underline">
              Browse all
            </Link>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {suggestedProducts.map((item) => (
              <Link
                key={item.id}
                to={`/product/${item.id}`}
                state={{ product: item }}
                className="group overflow-hidden rounded-3xl border border-stone-200 bg-white text-left transition-shadow hover:shadow-lg"
              >
                <div className="relative aspect-[4/5] overflow-hidden bg-stone-100">
                  <img src={item.image} alt={item.name} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
                </div>
                <div className="p-4">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-stone-400">{item.categoryLabel || item.category}</p>
                  <h3 className="mt-1 text-sm font-medium text-stone-900">{item.name}</h3>
                  <div className="mt-2 flex items-center justify-between">
                    <span className="text-sm font-semibold text-stone-900">Rs. {item.price.toLocaleString('en-PK')}</span>
                    <span className="rounded-full bg-[var(--brand-paper)] px-2 py-1 text-[10px] uppercase tracking-[0.08em] text-stone-600">{item.badge || 'Featured'}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </main>

      {videoOpen && (
        <div className="fixed inset-0 z-[80] grid place-items-center bg-black/70 p-4" onClick={() => setVideoOpen(false)}>
          <div className="w-full max-w-3xl overflow-hidden rounded-3xl border border-stone-700 bg-stone-950 text-white" onClick={(event) => event.stopPropagation()}>
            <div className="flex items-center justify-between border-b border-stone-800 px-4 py-3">
              <p className="text-sm font-medium">Product film</p>
              <button type="button" onClick={() => setVideoOpen(false)} className="rounded-full border border-stone-700 p-2 text-sm">
                Close
              </button>
            </div>
            <div className="aspect-video bg-[radial-gradient(circle_at_top,#d9d5d0,#1b1b1b_60%)] p-6">
              <div className="flex h-full items-center justify-center rounded-2xl border border-stone-700 bg-black/30">
                <button type="button" onClick={() => setVideoOpen(false)} className="flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-medium text-stone-900">
                  <Icon d="M8 5v14l11-7z" className="h-4 w-4" />
                  Play preview
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  )
}

export default ProductPage
