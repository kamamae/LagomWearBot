import { useTelegram } from '../../hooks/useTelegram';
import ProductCartList from '../../components/ProductCartList/main';
import { MainButton, BackButton } from '@vkruglikov/react-telegram-web-app';
import { useEffect, useState, useCallback } from 'react';
import axios from 'axios';

export const Cart = () => {
  const { user, tg } = useTelegram();
  const userId = user.id;
  const [price, setPrice] = useState<number>(0);
  const [cartItems, setCartItems] = useState<any[]>([]);
  const url = `http://127.0.0.1:8000/api/v1/cart/${userId}/`;

  const goBack = () => {
    window.history.back();
  };

  const onClickHandler = () => {
    if (price > 0) {
      window.Telegram.WebApp.sendData(JSON.stringify({ price, cartItems }));
      console.log('cartItems', cartItems);
    } else {
      console.error('Invalid price value:', price, cartItems);
    }
  };

  useEffect(() => {
    tg.MainButton.onClick(onClickHandler);
    return () => {
      tg.MainButton.offClick(onClickHandler);
    };
  }, [onClickHandler, tg.MainButton]);

  const updateMainButtonText = useCallback(() => {
    tg.MainButton.setParams({
      text: `Оплатить ${price} руб.`,
    });
    console.log(`Updated button text: Оплатить ${price} руб.`);
  }, [price, tg.MainButton]);

  const fetchCartItems = useCallback(async () => {
    try {
      const response = await axios.get(url);
      setCartItems(response.data);
      const priceResponse = await axios.get(`http://127.0.0.1:8000/api/v1/cart/${userId}/price/`);
      setPrice(priceResponse.data.total_price);
      updateMainButtonText();
    } catch (error) {
      console.error('Ошибка при получении данных:', error);
    }
  }, [url, userId, updateMainButtonText]);

  useEffect(() => {
    fetchCartItems();
  }, [fetchCartItems]);

  const handleCartItemsChange = (updatedCartItem: any) => {
    const updatedCartItems = cartItems.map(item => item.id === updatedCartItem.id ? updatedCartItem : item);
    setCartItems(updatedCartItems);
    calculateTotalPrice(updatedCartItems);
  };

  const handleTotalPriceChange = (priceChange: number) => {
    setPrice(prevPrice => prevPrice + priceChange);
  };

  const calculateTotalPrice = (items: any) => {
    const newTotalPrice = items.reduce((total: any, item: any) => total + item.product.price * item.quantity, 0);
    setPrice(newTotalPrice);
  };

  useEffect(() => {
    updateMainButtonText();
  }, [price, updateMainButtonText]);

  return (
    <>
      <BackButton onClick={goBack} />
      <div>
        <ProductCartList url={url} onCartItemsChange={handleCartItemsChange} onTotalPriceChange={handleTotalPriceChange} />
      </div>
      <MainButton color="#CC87FE" disabled={price === 0} />
    </>
  );
};

export default Cart;
