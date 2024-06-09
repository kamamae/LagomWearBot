import { useTelegram } from '../../hooks/useTelegram';
import ProductCartList from '../../components/ProductCartList/main';
import { WebAppProvider, MainButton,BackButton } from '@vkruglikov/react-telegram-web-app';
import {useEffect } from 'react';
import { useNavigate } from 'react-router-dom';


export const Cart = () => {
  const {user, tg} = useTelegram();
  const userId = user.id; 
  const navigate = useNavigate();

  const goBack = () => {
    window.history.back();
  };
  const onClickHandler = () => {
    navigate(`/cart/form/${userId}/`);
  };
  tg.MainButton.onClick(onClickHandler);

      useEffect(() => {
  
      tg.MainButton.setParams({
      text: 'Оформить заказ',
        });
      }, [tg.user, tg.MainButton, userId]);
      console.log(tg.user,tg)

    console.log(tg.user,tg)
    const url = `http://127.0.0.1:8000/api/v1/cart/${userId}/`;

    return (
      <WebAppProvider>
      <BackButton onClick={goBack}/>
      <div>
        <ProductCartList url={url} />
      </div>
      <MainButton  color="#CC87FE"/>
    </WebAppProvider>
  );
};

export default Cart
