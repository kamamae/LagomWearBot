import { useTelegram } from '../../hooks/useTelegram';
import ProductCartList from '../../components/ProductCartList/main';
import { WebAppProvider, MainButton,BackButton } from '@vkruglikov/react-telegram-web-app';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';


export const Cart = () => {
  const {user, tg} = useTelegram();
  const userId = user.id; 
  const navigate = useNavigate();
  const [price, setPrice] = useState<any[]>([]);


  const goBack = () => {
    window.history.back();
  };
  const onClickHandler = () => {
    navigate(`/form/${userId}/`);
  };
  tg.MainButton.onClick(onClickHandler);

      useEffect(() => {
  
      tg.MainButton.setParams({
      text: 'Оформить заказ',
        });
      }, [tg.user, tg.MainButton, userId]);
      console.log(tg.user,tg)

    console.log(tg.user,tg)
    const fetchPrice = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:8000/api/v1/cart/${userId}/price/`);
        console.log('price',price,setPrice)
        setPrice(response.data);
        console.log(response.data);
      } catch (error) {
        console.error('Ошибка при получении данных:', error);
      }
    };

    fetchPrice();
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




