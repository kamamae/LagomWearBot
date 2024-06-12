import { useTelegram } from '../../hooks/useTelegram';
import ProductCartList from '../../components/ProductCartList/main';
import { WebAppProvider, MainButton, BackButton } from '@vkruglikov/react-telegram-web-app';
import { useEffect, useState, useCallback } from 'react';
import axios from 'axios';

export const Cart = () => {
  const { user, tg } = useTelegram();
  const userId = user.id;
  const [price, setPrice] = useState<number>(0);
  const [cartItems, setCartItems] = useState([]);
  const url = `http://127.0.0.1:8000/api/v1/cart/${userId}/`;

  const goBack = () => {
    window.history.back();
  };

  const onClickHandler = () => {
    if (price > 0) {
      tg.sendData(JSON.stringify({ price, cartItems }));
      console.log('cartItems', cartItems);
    } else {
      console.error('Invalid price value:', price, cartItems);
    }
  };

  tg.MainButton.onClick(onClickHandler);

  const updateMainButtonText = () => {
    tg.MainButton.setParams({
      text: `Оплатить ${price} руб.`,
    });
  };

  const fetchCartItems = useCallback(async () => {
    try {
      const response = await axios.get(url);
      setCartItems(response.data);
      console.log("response.data.items", response.data);

      const priceResponse = await axios.get(`http://127.0.0.1:8000/api/v1/cart/${userId}/price/`);
      console.log('PRICE', priceResponse.data.total_price);
      setPrice(priceResponse.data.total_price);
      updateMainButtonText();
    } catch (error) {
      console.error('Ошибка при получении данных:', error);
    }
  }, [userId, updateMainButtonText]);

  useEffect(() => {
    fetchCartItems();
  }, [fetchCartItems]);

  useEffect(() => {
    updateMainButtonText();
  }, [price]);

  return (
    <WebAppProvider>
      <BackButton onClick={goBack} />
      <div>
        <ProductCartList url={url} onCartItemsChange={fetchCartItems} />
      </div>
      <MainButton color="#CC87FE" />
    </WebAppProvider>
  );
};

export default Cart;