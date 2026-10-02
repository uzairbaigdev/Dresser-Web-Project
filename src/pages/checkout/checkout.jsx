import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import Nav from '../../components/nav/nav.jsx'
import Footer from '../../components/homeComponets/footer.jsx'
import { useCart } from '../../context/CartContext.jsx'

const formatPrice = (price) =>
  new Intl.NumberFormat('en-PK', {
    style: 'currency',
    currency: 'PKR',
    maximumFractionDigits: 0,
  }).format(Number(price) || 0)

const Checkout = () => {
  const { items, cartCount, subtotal } = useCart()
  const [isSubmitted, setIsSubmitted] = useState(false)

  const shipping = useMemo(() => (subtotal > 6000 ? 0 : 350), [subtotal])
  const total = subtotal + shipping

  const handleSubmit = (event) => {
    event.preventDefault()
    setIsSubmitted(true)
  }

  if (!items.length && !isSubmitted) {
    return (
      <>
        <Nav forceSolid />
        <main className="mx-auto flex min-h-[60vh] max-w-5xl flex-col items-center justify-center px-5 py-24 text-center">
          <p className="text-sm font-medium uppercase tracking-[0.18em] text-stone-500">Your cart is empty</p>
          <h1 className="mt-4 font-serif text-4xl text-stone-900">Start with a few favorite picks</h1>
          <Link
            to="/shop"
            className="mt-8 inline-flex items-center justify-center rounded-full bg-[var(--brand-forest)] px-6 py-3 text-sm font-medium text-white transition hover:bg-[var(--brand-forest-deep)]"
          >
            Continue shopping
          </Link>
        </main>
        <Footer />
      </>
    )
  }

  return (
    <>
      <Nav forceSolid />
      <main className="mx-auto max-w-6xl px-5 pb-20 pt-28 sm:px-8 lg:px-12">
        <div className="mb-8 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-stone-500">Checkout</p>
            <h1 className="mt-2 font-serif text-4xl text-stone-900">Complete your order</h1>
          </div>
          <p className="text-sm text-stone-600">{cartCount} item{cartCount === 1 ? '' : 's'} in cart</p>
        </div>

        {!isSubmitted ? (
          <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="rounded-3xl border border-stone-200 bg-white p-6">
                <h2 className="text-lg font-semibold text-stone-900">Contact information</h2>
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  <label className="text-sm text-stone-600">
                    <span className="mb-1.5 block">First name</span>
                    <input defaultValue="Ayesha" className="w-full rounded-xl border border-stone-300 bg-[var(--brand-paper)] px-3 py-2.5 text-stone-900 outline-none ring-0 transition focus:border-[var(--brand-forest)]" />
                  </label>
                  <label className="text-sm text-stone-600">
                    <span className="mb-1.5 block">Last name</span>
                    <input defaultValue="Khan" className="w-full rounded-xl border border-stone-300 bg-[var(--brand-paper)] px-3 py-2.5 text-stone-900 outline-none ring-0 transition focus:border-[var(--brand-forest)]" />
                  </label>
                  <label className="sm:col-span-2 text-sm text-stone-600">
                    <span className="mb-1.5 block">Email</span>
                    <input type="email" defaultValue="hello@example.com" className="w-full rounded-xl border border-stone-300 bg-[var(--brand-paper)] px-3 py-2.5 text-stone-900 outline-none ring-0 transition focus:border-[var(--brand-forest)]" />
                  </label>
                  <label className="sm:col-span-2 text-sm text-stone-600">
                    <span className="mb-1.5 block">Shipping address</span>
                    <textarea defaultValue="House 16, Gulshan Avenue, Karachi" rows="3" className="w-full rounded-xl border border-stone-300 bg-[var(--brand-paper)] px-3 py-2.5 text-stone-900 outline-none ring-0 transition focus:border-[var(--brand-forest)]" />
                  </label>
                </div>
              </div>

              <div className="rounded-3xl border border-stone-200 bg-white p-6">
                <h2 className="text-lg font-semibold text-stone-900">Delivery method</h2>
                <div className="mt-4 grid gap-3">
                  {[
                    ['Standard shipping', '2-4 working days', 'Free'],
                    ['Express delivery', '1-2 working days', 'Rs. 950'],
                    ['Store pickup', 'Collect in 24 hours', 'Free'],
                  ].map(([label, detail, price]) => (
                    <label key={label} className="flex items-center justify-between rounded-2xl border border-stone-200 bg-[var(--brand-paper)] p-4 text-sm text-stone-700">
                      <span className="flex items-center gap-3">
                        <input type="radio" name="shipping" defaultChecked={label === 'Standard shipping'} className="h-4 w-4 accent-[var(--brand-forest)]" />
                        <span>
                          <span className="block font-medium text-stone-900">{label}</span>
                          <span className="text-stone-500">{detail}</span>
                        </span>
                      </span>
                      <span className="font-medium text-stone-900">{price}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="rounded-3xl border border-stone-200 bg-white p-6">
                <h2 className="text-lg font-semibold text-stone-900">Payment</h2>
                <div className="mt-4 flex flex-wrap gap-2 text-xs font-medium uppercase tracking-[0.12em] text-stone-600">
                  {['Cash on delivery', 'Card', 'Bank transfer', 'Easy paisa'].map((method) => (
                    <span key={method} className="rounded-full border border-stone-200 bg-[var(--brand-paper)] px-3 py-2">
                      {method}
                    </span>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                className="w-full rounded-full bg-[var(--brand-forest)] px-6 py-3.5 text-sm font-medium text-white transition hover:bg-[var(--brand-forest-deep)]"
              >
                Place order · {formatPrice(total)}
              </button>
            </form>

            <aside className="rounded-3xl border border-stone-200 bg-white p-6">
              <h2 className="text-lg font-semibold text-stone-900">Order summary</h2>
              <div className="mt-5 space-y-4">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-3 border-b border-stone-200 pb-4 last:border-b-0 last:pb-0">
                    <img src={item.image} alt={item.name} className="h-20 w-16 rounded-xl object-cover" />
                    <div className="min-w-0 flex-1">
                      <p className="line-clamp-2 text-sm font-medium text-stone-900">{item.name}</p>
                      <p className="mt-1 text-xs text-stone-500">Qty {item.quantity}</p>
                    </div>
                    <p className="text-sm font-medium text-stone-900">{formatPrice(item.price * item.quantity)}</p>
                  </div>
                ))}
              </div>

              <div className="mt-6 space-y-3 border-t border-stone-200 pt-4 text-sm text-stone-600">
                <div className="flex items-center justify-between">
                  <span>Subtotal</span>
                  <span className="font-medium text-stone-900">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Shipping</span>
                  <span className="font-medium text-stone-900">{shipping === 0 ? 'Free' : formatPrice(shipping)}</span>
                </div>
                <div className="flex items-center justify-between text-base font-semibold text-stone-900">
                  <span>Total</span>
                  <span>{formatPrice(total)}</span>
                </div>
              </div>
            </aside>
          </div>
        ) : (
          <div className="rounded-3xl border border-[var(--brand-forest)]/20 bg-[var(--brand-forest)]/5 p-8 text-center">
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-[var(--brand-forest)]">Order placed</p>
            <h2 className="mt-3 font-serif text-3xl text-stone-900">Thank you for your order.</h2>
            <p className="mt-3 text-stone-600">Your order is confirmed and a confirmation email is on the way.</p>
            <Link
              to="/shop"
              className="mt-6 inline-flex items-center justify-center rounded-full bg-[var(--brand-forest)] px-6 py-3 text-sm font-medium text-white transition hover:bg-[var(--brand-forest-deep)]"
            >
              Keep shopping
            </Link>
          </div>
        )}
      </main>
      <Footer />
    </>
  )
}

export default Checkout
