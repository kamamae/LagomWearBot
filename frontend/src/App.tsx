// import { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import { Home } from './screens/Home/main';
import DetailProduct from './screens/DetailProductScreen/main';


function App() {
//   useEffect(() => {
//     if (window.Telegram && window.Telegram.WebApp) {
//       window.Telegram.WebApp.ready();
//     }
//   }, []);

//   const onClose = () => {
//     if (window.Telegram && window.Telegram.WebApp) {
//       window.Telegram.WebApp.close();
//     }
//   };

  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products/:id" element={<DetailProduct />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;