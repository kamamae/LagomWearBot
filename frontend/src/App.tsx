import { useState } from 'react'
import { BrowserRouter as Router, Route,Routes } from 'react-router-dom';
import './App.css'
import { Home} from './screens/Home/main'
import { Favorites} from './screens/favorites/main'
// import { Profile} from './screens/favorites/main'
// import { Backet} from './screens/favorites/main'


function App() {
  const [count, setCount] = useState(0)

  return (
    <>
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/favorites" element={<Favorites />} />
        {/* <Route path="/profile" element={<Profile />} />
        <Route path="/backet" element={<Backet />} /> */}

      </Routes>
    </Router>
     </>
  )
}

export default App
