import React from 'react'
import Nav from '../../components/nav/nav.jsx'
import Products from '../../components/shopComponents/products.jsx'
import FourthSection from '../../components/homeComponets/FourthSection.jsx'
import Footer from '../../components/homeComponets/footer.jsx'

const Shop = () => {
  return (
    <div>
      <Nav forceSolid />
      <Products />
      <FourthSection />
      <Footer />
    </div>
  )
}

export default Shop