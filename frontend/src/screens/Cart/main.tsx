import { useTelegram } from '../../hooks/useTelegram';
import ProductCartList from '../../components/ProductCartList/main';
import { WebAppProvider, MainButton,BackButton } from '@vkruglikov/react-telegram-web-app';
import {useEffect} from 'react';



export const Cart = () => {
  const {user, chat, tg} = useTelegram();
  const userId = user.id; 
  const goBack = () => {
    window.history.back();
  };

    useEffect(() => {

    tg.MainButton.setParams({
    text: 'Оформить заказ',
    });
    }, [tg.user, tg.MainButton]);

    console.log('User Info:', user,chat,tg)
      useEffect(() => {
  
      tg.MainButton.setParams({
      text: 'Оформить заказ',
        });
      }, [tg.user, tg.MainButton, userId]);
      console.log(tg.user,tg)

    console.log(tg.user,tg)
    const url = `http://127.0.0.1:8000/api/v1/cart/${userId}/`;
    // const url = `http://127.0.0.1:8000/api/v1/cart/123123/`;

    return (
      <WebAppProvider>
      <BackButton onClick={goBack}/>

      <div>
        <ProductCartList url={url} />
      </div>
      <MainButton/>
    </WebAppProvider>
  );
};

export default Cart




