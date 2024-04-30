import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Route,Routes } from 'react-router-dom';
import './App.css'
import { Home} from './screens/Home/main'
import DetailProduct from './screens/DetailProductScreen/main'
// import { Profile} from './screens/favorites/main'
// import { Backet} from './screens/favorites/main'
const tg = window.Telegram.WebApp;

function App() {
  const [count, setCount] = useState(0)
  useEffect(() => {
  tg.ready();
  });

  return (
    <>
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/products/:id" element={<DetailProduct />} />
        {/*<Route path="/backet" element={<Backet />} /> */}

      </Routes>
    </Router>
     </>
  )
}

export default App
