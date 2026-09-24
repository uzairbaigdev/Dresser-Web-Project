import React from 'react'
import Nav from '../../components/nav/nav.jsx'
import FirstSectionSlider from '../../components/homeComponets/firstSectionSlider.jsx'
import Products from '../../components/homeComponets/secondSectionProducts.jsx'
import ThirdSectionSlider from '../../components/homeComponets/thirdSectionSlider.jsx'
import FourthSection from '../../components/homeComponets/FourthSection.jsx'

const home = () => {
  return (
    <div>
      <Nav />
      <FirstSectionSlider />
      <Products/>
      <ThirdSectionSlider />
      <FourthSection />
    </div>
  )
}

export default home