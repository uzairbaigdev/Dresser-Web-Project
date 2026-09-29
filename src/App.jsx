import { useEffect } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import Home from './pages/home/home.jsx'
import Shop from './pages/shop/shop.jsx'
import Search from './pages/search/search.jsx'
import About from './pages/about/about.jsx'
import Contact from './pages/contact/contact.jsx'
import Product from './pages/product/product.jsx'
import NotFound from './pages/404 page/404.jsx'

function ScrollToTop() {
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'auto',
    })
  }, [pathname])

  return null
}

function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/product/:productId" element={<Product />} />
        <Route path="/product" element={<Product />} />
        <Route path="/search" element={<Search />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <a
        href="https://wa.me/923368167345"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat with us on WhatsApp"
        title="Chat with us on WhatsApp"
        className="fixed bottom-5 right-5 z-50 grid h-14 w-14 place-items-center rounded-full bg-[#25D366] text-white shadow-[0_8px_24px_rgba(0,0,0,0.28)] transition duration-200 hover:-translate-y-1 hover:bg-[#1fb959] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--brand-forest)]"
      >
        <svg viewBox="0 0 24 24" className="h-8 w-8" fill="currentColor" aria-hidden="true">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.198-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.372-.025-.521-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.262.489 1.693.626.711.226 1.358.194 1.87.118.57-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.002-5.45 4.437-9.884 9.892-9.884 2.64.001 5.12 1.03 6.985 2.898a9.82 9.82 0 0 1 2.89 6.99c-.002 5.45-4.438 9.884-9.888 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.334.157 11.89c0 2.096.548 4.142 1.593 5.946L.05 24l6.31-1.655a11.94 11.94 0 0 0 5.687 1.446h.005c6.557 0 11.89-5.335 11.893-11.893a11.81 11.81 0 0 0-3.482-8.41z" />
        </svg>
      </a>
    </>
  )
}

export default App

 

