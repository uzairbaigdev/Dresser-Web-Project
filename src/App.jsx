import { useEffect } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import Home from './pages/home/home.jsx'
import Shop from './pages/Shop/Shop.jsx'
import Search from './pages/search/search.jsx'
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
        <Route path="/search" element={<Search />} />

        <Route path="*" element={<NotFound />} />
        
      </Routes>
    </>
  )
}

export default App

 

