import { useTelegram } from '../../hooks/useTelegram';
import ProductCartList from '../../components/ProductCartList/main';
import { WebAppProvider, MainButton, BackButton } from '@vkruglikov/react-telegram-web-app';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export const Cart = () => {
  const { user, tg } = useTelegram();
  const userId = user.id;
  const navigate = useNavigate();
  const [totalPrice, setTotalPrice] = useState(0);

  const handleTotalPriceUpdate = (price: number) => {
    console.log('price_cart',totalPrice, price)
    setTotalPrice(price);
  };

  const goBack = () => {
    window.history.back();
  };

  const onClickHandler = () => {
    navigate(`/form/${userId}/`);
  };

  useEffect(() => {
    tg.MainButton.setParams({
      text: 'Оформить заказ',
      onClick: onClickHandler,
    });
  }, [tg.user, tg.MainButton, userId, onClickHandler]);

  const url = `http://127.0.0.1:8000/api/v1/cart/${userId}/`;

  return (
    <WebAppProvider>
      <BackButton onClick={goBack} />
      <div>
        <ProductCartList url={url} onTotalPriceUpdate={handleTotalPriceUpdate} />
      </div>
      <MainButton />
    </WebAppProvider>
  );
};

export default Cart;