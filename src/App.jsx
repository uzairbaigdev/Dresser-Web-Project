import { Routes, Route } from 'react-router-dom'
import Home from './pages/home/home.jsx'
import Shop from './pages/Shop/Shop.jsx'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/shop" element={<Shop />} />
    </Routes>
  )
}

export default App

 

