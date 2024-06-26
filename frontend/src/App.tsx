import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import { Home } from './screens/Home/main';
import DetailProduct from './screens/DetailProductScreen/main';
import getCurrentTheme from './hooks/theme';
import Cart from './screens/cart/main';
import {WebAppProvider} from '@vkruglikov/react-telegram-web-app';
  const currentTheme = getCurrentTheme();

  if (currentTheme === 'dark') {
    document.documentElement.style.setProperty('--tg-theme-bg-color', 'var(--theme-dark-bg-color)');
    document.documentElement.style.setProperty('--tg-theme-text-color', 'var(--theme-dark-text-color)');
  } else {
    document.documentElement.style.setProperty('--tg-theme-bg-color', 'var(--theme-light-bg-color)');
    document.documentElement.style.setProperty('--tg-theme-text-color', 'var(--theme-light-text-color)');
  }

function App() {
  return (
    <WebAppProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products/:id/" element={<DetailProduct />} />
          <Route path="/cart/:userId/" element={<Cart />} />
        </Routes>
      </Router>
    </WebAppProvider> );
}

export default App;