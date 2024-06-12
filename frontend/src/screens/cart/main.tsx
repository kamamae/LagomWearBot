import { useTelegram } from '../../hooks/useTelegram';
import ProductCartList from '../../components/ProductCartList/main';
import { WebAppProvider, MainButton, BackButton } from '@vkruglikov/react-telegram-web-app';
import { useEffect, useState } from 'react';
import axios from 'axios';

export const Cart = () => {
  const { user,tg } = useTelegram();
  const userId = user.id;
  const [price, setPrice] = useState<number>(0);
  const [cartItems, setCartItems] = useState([]);
  const goBack = () => {
    window.history.back();
  };


useEffect(() => {
  const fetchCartItems = async () => {
    try {
      const response = await axios.get(`http://127.0.0.1:8000/api/v1/cart/${userId}/`);
      setCartItems(response.data.items);
      console.log("response.data.items",response.data.items);

      console.log(cartItems);
    } catch (error) {
      console.error('Error fetching cart items:', error);
    }
  };
  fetchCartItems();
}, [userId]);
  
  const onClickHandler = () => {  
    if (price > 0) {
      tg.sendData(JSON.stringify({ price,cartItems }));
      console.log('cartItems',cartItems)
    } else {
      console.error('Invalid price value:', price);
    }
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