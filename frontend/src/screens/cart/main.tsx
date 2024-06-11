import { useTelegram } from '../../hooks/useTelegram';
import ProductCartList from '../../components/ProductCartList/main';
import { WebAppProvider, MainButton, BackButton } from '@vkruglikov/react-telegram-web-app';
import { useEffect, useState } from 'react';
import axios from 'axios';

export const Cart = () => {
  const { user, tg } = useTelegram();
  const userId = user.id;
  const [price, setPrice] = useState<number>(0);

  const goBack = () => {
    window.history.back();
  };

  const sendEventToTelegram = () => {
    try {
      tg.WebApps.postEvent('user_input_received', { text: 'Hello, Telegram!' });
    } catch (error) {
      console.error('Error sending event to Telegram:', error);
    }
  };
  
  const onClickHandler = () => {  
    if (price > 0) {
      tg.sendData(JSON.stringify({ price }));
    } else {
      console.error('Invalid price value:', price);
    }
    sendEventToTelegram();

  };

  tg.MainButton.onClick(onClickHandler);

  const updateMainButtonText = () => {
    tg.MainButton.setParams({
      text: `Оплатить ${price} руб.`,
    });
  };

  useEffect(() => {
    const fetchPrice = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:8000/api/v1/cart/${userId}/price/`);
        console.log('PRICE', price)
        setPrice(response.data.total_price);
        updateMainButtonText();
      } catch (error) {
        console.error('Ошибка при получении данных:', error);
      }
    };
    fetchPrice();
  }, [userId, price]);

  const url = `http://127.0.0.1:8000/api/v1/cart/${userId}/`;

  return (
    <WebAppProvider>
      <BackButton onClick={goBack} />
      <div>
        <ProductCartList url={url} />
      </div>
      <MainButton color="#CC87FE" />
    </WebAppProvider>
  );
};

export default Cart;