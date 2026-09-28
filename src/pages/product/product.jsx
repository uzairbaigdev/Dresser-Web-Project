import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import Nav from '../../components/nav/nav.jsx'
import { productCatalog, getProductById } from '../../data/products.js'

const PAY = ['Visa', 'Mastercard', 'PayPal', 'Apple Pay', 'UPI', 'Bank transfer']
const Icon = ({ d, className = 'h-5 w-5' }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true"><path d={d} /></svg>
)
const Stars = ({ value, size = 'h-4 w-4' }) => (
  <span className="inline-flex" role="img" aria-label={`${value} out of 5 stars`}>
    {[1, 2, 3, 4, 5].map((i) => (
      <svg key={i} viewBox="0 0 20 20" className={`${size} ${i <= Math.round(value) ? 'text-[#8a6a3f]' : 'text-stone-300'}`} fill="currentColor" aria-hidden="true">
        <path d="M10 1.5l2.6 5.5 6 .8-4.4 4.2 1.1 6-5.3-2.9-5.3 2.9 1.1-6L1.4 7.8l6-.8z" />
      </svg>
    ))}
  </span>
)
const btn = 'rounded-full px-6 py-3.5 text-sm font-medium transition duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#4b5236] active:scale-[.98]'

function ProductPage() {
  const { productId } = useParams()
  const product = getProductById(productId) || productCatalog[0]
  const [selectedImage, setSelectedImage] = useState(0)
  const [selectedColor, setSelectedColor] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [videoOpen, setVideoOpen] = useState(false)
  const [cartCount, setCartCount] = useState(0)
  const [saved, setSaved] = useState(false)

  const imageList = product.gallery || [{ image: product.image, alt: product.name }]
  const originalPrice = product.oldPrice || product.price + 800
  const discount = Math.round(((originalPrice - product.price) / originalPrice) * 100)
  const specList = product.specs || [['Material', product.materials?.join(', ') || product.categoryLabel]]

  useEffect(() => {
    setSelectedImage(0)
    setSelectedColor(0)
    setQuantity(1)
  }, [productId])

  return (
    <div className="min-h-screen bg-[#f6f2ea] font-sans text-stone-800 antialiased">
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Newsreader:opsz,wght@6..72,400;6..72,500&family=Instrument+Sans:wght@400;500;600&display=swap'); .font-serif{font-family:'Newsreader',Georgia,serif;letter-spacing:-.01em} @media (prefers-reduced-motion:reduce){*{transition:none!important;animation:none!important}}`}</style>

      <Nav forceSolid cartCount={cartCount} />

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
              <span className="absolute left-4 top-4 rounded-full bg-[#4b5236] px-3 py-1 text-xs font-medium text-white">Save {discount}%</span>
              <button onClick={() => setVideoOpen(true)} className={`${btn} absolute bottom-4 left-4 flex items-center gap-2 bg-white/90 py-2.5 text-stone-900 backdrop-blur hover:bg-white`}>
                <Icon d="M8 5v14l11-7z" className="h-4 w-4" /> Watch the film
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
                  className={`aspect-square w-20 shrink-0 overflow-hidden rounded-xl border-2 bg-stone-200 transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#4b5236] ${selectedImage === index ? 'border-[#4b5236]' : 'border-transparent opacity-80 hover:opacity-100'}`}
                >
                  <img src={item.image} alt={item.alt || product.name} loading="lazy" className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          <div className="lg:sticky lg:top-6 lg:self-start">
            <div className="flex flex-col gap-6">
              <div>
                <p className="text-sm text-stone-500">{product.brand || 'Dresser'} · {product.categoryLabel || product.category}</p>
                <h1 className="mt-2 font-serif text-4xl leading-tight text-stone-900 md:text-5xl">{product.name}</h1>
                <div className="mt-3 flex items-center gap-2 text-sm text-stone-600">
                  <Stars value={product.rating || 4.8} />
                  <a href="#reviews" className="underline-offset-4 hover:underline">{product.rating || 4.8} · {product.reviews || 128} reviews</a>
                </div>
                <p className="mt-4 max-w-md text-stone-600">{product.short}</p>
              </div>

              <div>
                <div className="flex items-baseline gap-3">
                  <span className="font-serif text-4xl text-stone-900">Rs. {product.price.toLocaleString('en-PK')}</span>
                  <span className="text-lg text-stone-400 line-through">Rs. {originalPrice.toLocaleString('en-PK')}</span>
                  <span className="rounded-full bg-[#8a6a3f]/15 px-2.5 py-1 text-xs font-medium text-[#6b4f28]">{discount}% off</span>
                </div>
                <p className="mt-1 text-sm text-stone-500">or 4 interest-free payments of Rs. {Math.round(product.price / 4).toLocaleString('en-PK')}</p>
              </div>

              <fieldset>
                <legend className="mb-3 text-sm font-medium text-stone-900">Colour: <span className="font-normal text-stone-500">{product.colors?.[selectedColor]?.name || 'Default'}</span></legend>
                <div className="flex gap-3">
                  {(product.colors || [{ name: 'Default', hex: '#d6cfc4' }]).map((color, index) => (
                    <button
                      key={color.name}
                      type="button"
                      onClick={() => setSelectedColor(index)}
                      aria-label={color.name}
                      aria-pressed={selectedColor === index}
                      className={`h-10 w-10 rounded-full ring-offset-2 ring-offset-[#f6f2ea] transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#4b5236] ${selectedColor === index ? 'ring-2 ring-[#4b5236]' : 'ring-1 ring-stone-300 hover:ring-stone-500'}`}
                      style={{ background: color.hex }}
                    />
                  ))}
                </div>
              </fieldset>

              <fieldset>
                <legend className="mb-3 text-sm font-medium text-stone-900">Material</legend>
                <div className="flex flex-wrap gap-2">
                  {(product.materials || ['Premium cotton', 'Soft finish']).map((item, index) => (
                    <button
                      key={item}
                      type="button"
                      className={`${btn} border py-2.5 ${index === 0 ? 'border-[#4b5236] bg-[#4b5236] text-white' : 'border-stone-300 bg-white/60 text-stone-700 hover:border-stone-500'}`}
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </fieldset>

              <div className="flex items-center gap-3">
                <div className="flex items-center rounded-full border border-stone-300 bg-white/60" role="group" aria-label="Quantity">
                  <button type="button" aria-label="Decrease quantity" onClick={() => setQuantity((v) => Math.max(1, v - 1))} className="h-12 w-12 rounded-full text-xl hover:bg-stone-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#4b5236]">−</button>
                  <output className="w-8 text-center font-medium" aria-live="polite">{quantity}</output>
                  <button type="button" aria-label="Increase quantity" onClick={() => setQuantity((v) => Math.min(9, v + 1))} className="h-12 w-12 rounded-full text-xl hover:bg-stone-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#4b5236]">+</button>
                </div>
                <button type="button" onClick={() => setCartCount((c) => c + quantity)} className={`${btn} flex-1 bg-[#4b5236] text-white hover:bg-[#3b4129]`}>Add to cart · Rs. {(product.price * quantity).toLocaleString('en-PK')}</button>
                <button type="button" onClick={() => setSaved((v) => !v)} aria-pressed={saved} aria-label="Save to wishlist" className={`grid h-12 w-12 place-items-center rounded-full border transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#4b5236] ${saved ? 'border-[#8a6a3f] bg-[#8a6a3f] text-white' : 'border-stone-300 bg-white/60 text-stone-700 hover:border-stone-500'}`}>
                  <svg viewBox="0 0 24 24" className="h-5 w-5" fill={saved ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.6" aria-hidden="true"><path d="M12 20s-7-4.4-7-10a4 4 0 017-2.6A4 4 0 0119 10c0 5.6-7 10-7 10z" /></svg>
                </button>
              </div>

              <button type="button" className={`${btn} border border-stone-900 text-stone-900 hover:bg-stone-900 hover:text-white`}>Buy now with express checkout</button>

              <div className="rounded-2xl border border-stone-200 bg-white/70 p-5">
                <div className="flex items-center justify-between">
                  <p className="flex items-center gap-2 text-sm font-medium text-stone-900"><Icon d="M12 3l8 4v5c0 5-3.5 8-8 9-4.5-1-8-4-8-9V7z" className="h-4 w-4 text-[#4b5236]" /> Guaranteed safe checkout</p>
                  <span className="text-xs text-[#4b5236]">● {product.stock}</span>
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {PAY.map((item) => <span key={item} className="rounded-md border border-stone-200 bg-white px-2.5 py-1 text-xs font-medium text-stone-700">{item}</span>)}
                </div>
                <ul className="mt-4 grid gap-2 text-sm text-stone-600 sm:grid-cols-2">
                  <li>Free express shipping over Rs. 6000</li>
                  <li>Arrives in 2–4 working days</li>
                  <li>30-day free returns</li>
                  <li>3-year warranty, premium support</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <section className="mx-auto max-w-7xl px-5 py-16 md:px-8 md:py-24">
          <div className="grid gap-12 lg:grid-cols-2">
            <div>
              <p className="max-w-prose font-serif text-lg leading-8 text-stone-700">
                Crafted for all-day ease and elevated styling, this piece combines premium comfort with a confident silhouette and a polished finish that works from day to evening.
              </p>
              <div className="mt-10 grid gap-6 sm:grid-cols-2">
                {[
                  ['M12 3v18M8 7v10M4 10v4M16 6v12M20 9v6', 'Premium comfort', 'Designed to feel light and easy from first wear to final event.'],
                  ['M5 12a7 7 0 0114 0v4a2 2 0 01-2 2h-1v-6h3M5 12v4a2 2 0 002 2h1v-6H5', 'Thoughtful fit', 'A tailored silhouette that moves naturally with your body.'],
                  ['M4 7h14v10H4zM20 10v4', 'Made to last', 'Quality details and durable finishing for repeated wear.'],
                  ['M12 3l8 4v5c0 5-3.5 8-8 9-4.5-1-8-4-8-9V7z', 'Quality promise', 'Built with care and backed by a reliable customer experience.'],
                ].map(([d, title, description]) => (
                  <div key={title}>
                    <span className="grid h-11 w-11 place-items-center rounded-full bg-[#4b5236]/10 text-[#4b5236]"><Icon d={d} /></span>
                    <h3 className="mt-3 font-medium text-stone-900">{title}</h3>
                    <p className="mt-1 text-sm leading-6 text-stone-600">{description}</p>
                  </div>
                ))}
              </div>
            </div>

            <dl className="divide-y divide-stone-200 rounded-3xl border border-stone-200 bg-white/70 px-6">
              {specList.map(([key, value]) => (
                <div key={key} className="grid grid-cols-3 gap-4 py-4 text-sm"><dt className="text-stone-500">{key}</dt><dd className="col-span-2 text-stone-900">{value}</dd></div>
              ))}
            </dl>
          </div>
        </section>

        <section className="bg-[#2b2a28] text-stone-100">
          <div className="mx-auto grid max-w-7xl gap-10 px-5 py-16 md:px-8 md:py-24 lg:grid-cols-12">
            <button type="button" onClick={() => setVideoOpen(true)} aria-label="Play brand film" className="group relative aspect-video overflow-hidden rounded-3xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#c9a56b] lg:col-span-7">
              <img src={product.gallery?.[0]?.image || product.image} alt="Product detail preview" className="h-full w-full object-cover transition duration-700 group-hover:scale-105" />
              <span className="absolute inset-0 grid place-items-center bg-black/30"><span className="grid h-20 w-20 place-items-center rounded-full bg-white/90 text-stone-900 transition group-hover:scale-110"><Icon d="M8 5v14l11-7z" className="h-7 w-7" /></span></span>
            </button>
            <div className="flex flex-col justify-between gap-8 lg:col-span-5">
              <div>
                <h2 className="font-serif text-3xl md:text-4xl">Style that feels refined and effortless</h2>
                <p className="mt-4 leading-7 text-stone-300">This product is designed to look elevated in motion, with premium finishes and styling details that make it an easy favorite across versatile occasions.</p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="aspect-square overflow-hidden rounded-2xl"><img src={product.gallery?.[1]?.image || product.image} alt="Detail shot" className="h-full w-full object-cover" /></div>
                <div className="aspect-square overflow-hidden rounded-2xl"><img src={product.gallery?.[2]?.image || product.image} alt="Close-up shot" className="h-full w-full object-cover" /></div>
              </div>
            </div>
          </div>
        </section>

        <section id="reviews" className="mx-auto max-w-7xl px-5 py-16 md:px-8 md:py-24">
          <div className="grid gap-10 lg:grid-cols-12">
            <div className="lg:col-span-4">
              <p className="font-serif text-6xl text-stone-900">{product.rating || 4.8}</p>
              <Stars value={product.rating || 4.8} size="h-5 w-5" />
              <p className="mt-2 text-sm text-stone-500">Based on {product.reviews || 128} verified reviews</p>
              <div className="mt-6 space-y-2">
                {[5, 4, 3, 2, 1].map((star) => (
                  <div key={star} className="flex items-center gap-3 text-sm text-stone-600">
                    <span className="w-4">{star}</span>
                    <div className="h-2 flex-1 overflow-hidden rounded-full bg-stone-200"><div className="h-full bg-[#8a6a3f]" style={{ width: `${star === 5 ? 82 : star === 4 ? 13 : 3}%` }} /></div>
                    <span className="w-9 text-right">{star === 5 ? 82 : star === 4 ? 13 : 3}%</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="grid gap-5 lg:col-span-8 md:grid-cols-2">
              {[
                { name: 'Amira K.', rating: 5, title: 'Beautiful finish and premium comfort', blurb: 'The fabric feels luxe and the fit sits perfectly with minimal effort. It looks polished without being too formal.' },
                { name: 'Sana R.', rating: 5, title: 'Worth every rupee', blurb: 'The design is sharp and the quality stands out. It feels special enough for festive dressing and comfortable enough for everyday wear.' },
                { name: 'Hiba N.', rating: 4, title: 'Very elegant after styling', blurb: 'The drape is excellent and the details make it feel premium. I would definitely buy again in another color.' },
              ].map((review) => (
                <article key={review.name} className="rounded-3xl border border-stone-200 bg-white/70 p-6 md:first:col-span-2">
                  <div className="flex items-center justify-between"><Stars value={review.rating} /> <span className="rounded-full bg-[#4b5236]/10 px-2.5 py-1 text-xs text-[#4b5236]">Verified buyer</span></div>
                  <h3 className="mt-3 font-medium text-stone-900">{review.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-stone-600">{review.blurb}</p>
                  <div className="mt-4 flex items-center gap-3"><div className="h-12 w-12 overflow-hidden rounded-xl"><img src={product.gallery?.[0]?.image || product.image} alt={review.name} className="h-full w-full object-cover" /></div><span className="text-sm text-stone-500">{review.name}</span></div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-4xl px-5 py-10 md:px-8">
          <div className="divide-y divide-stone-200 border-y border-stone-200">
            {[
              ['How long does delivery take?', 'Orders placed before 2 pm ship the same day. Standard delivery takes 2 to 4 working days; express takes 1 to 2. Tracking is sent by email.'],
              ['What is your returns policy?', 'Return within 30 days for a full refund, even after use. Return labels are free and pickup can be arranged from your door.'],
              ['What does the warranty cover?', 'The product is supported with reliable customer care and quality assurance so you can shop with confidence.'],
              ['Can I exchange the colour or size?', 'Yes. Exchanges are free within 30 days and we help quickly with size or colour adjustments.'],
            ].map(([question, answer], index) => (
              <div key={question}>
                <h3><button type="button" aria-expanded={index === 0} className="flex w-full items-center justify-between py-5 text-left font-medium text-stone-900 hover:text-[#4b5236] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#4b5236]">{question}<span className="text-xl" aria-hidden="true">+</span></button></h3>
                <div className="pb-5 pr-8 leading-7 text-stone-600">{answer}</div>
              </div>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-5 py-16 md:px-8 md:py-20">
          <h2 className="mb-10 font-serif text-3xl text-stone-900 md:text-4xl">Pairs well with</h2>
          <ul className="grid grid-cols-2 gap-5 lg:grid-cols-4">
            {productCatalog.slice(0, 4).map((item) => (
              <li key={item.id} className="group">
                <div className="aspect-[4/5] overflow-hidden rounded-2xl bg-stone-200"><img src={item.image} alt={item.name} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" /></div>
                <h3 className="mt-3 text-sm font-medium text-stone-900">{item.name}</h3>
                <p className="mt-1 flex items-center gap-2 text-sm text-stone-600"><Stars value={item.rating || 4.7} size="h-3.5 w-3.5" /> Rs. {item.price.toLocaleString('en-PK')}</p>
                <button type="button" className={`${btn} mt-3 w-full border border-stone-300 py-2.5 text-stone-800 hover:bg-stone-900 hover:text-white`}>Add to cart</button>
              </li>
            ))}
          </ul>
        </section>
      </main>

      <footer className="border-t border-stone-200 px-5 py-8 text-center text-sm text-stone-500">© 2026 Dresser. Payments processed securely with 256-bit encryption.</footer>

      {videoOpen && (
        <div role="dialog" aria-modal="true" aria-label="Product film" onClick={() => setVideoOpen(false)} className="fixed inset-0 z-50 grid place-items-center bg-black/80 p-5">
          <div onClick={(event) => event.stopPropagation()} className="relative aspect-video w-full max-w-4xl overflow-hidden rounded-2xl bg-black">
            <video controls autoPlay playsInline poster={product.gallery?.[0]?.image || product.image} className="h-full w-full">
              <source src="/media/aria-film.mp4" type="video/mp4" />
            </video>
            <button autoFocus onClick={() => setVideoOpen(false)} aria-label="Close video" className="absolute right-3 top-3 grid h-10 w-10 place-items-center rounded-full bg-white/90 text-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#4b5236]">×</button>
          </div>
        </div>
      )}
    </div>
  )
}

export default ProductPage