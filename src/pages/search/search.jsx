import React from 'react'
import Nav from '../../components/nav/nav.jsx'
import SearchBox from '../../components/searchComponents/searchBox.jsx'
import FourthSection from '../../components/homeComponets/FourthSection.jsx'
import Footer from '../../components/homeComponets/footer.jsx'

const Search = () => {
    return (
     <>
     <Nav forceSolid />
     <div className="px-4 pt-8 sm:px-6 lg:px-8">
       <SearchBox />
     </div>
     <FourthSection />
     <Footer />
     </>
    )
}

export default Search