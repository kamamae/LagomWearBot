import ProductList from "../../components/ProductList/main";
import { WebAppProvider, MainButton } from '@vkruglikov/react-telegram-web-app';
import {useTelegram} from '../../hooks/useTelegram';
import {useEffect, useState} from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export const Home = () => {
  const { user, tg } = useTelegram();
  const userId = user.id; 
  const navigate = useNavigate();
  const [profile, setProfile] = useState<any[]>([]);

  useEffect(() => {
    tg.MainButton.setText('Посмотреть корзину');
    tg.MainButton.show();
  
    const onClickHandler = () => {
      navigate(`/cart/${userId}`);
    };
  
    tg.MainButton.onClick(onClickHandler);

    createUser();

    return () => {
      tg.MainButton.offClick(onClickHandler);
      tg.MainButton.hide();
    };
  }, [tg, navigate, userId, user.id, setProfile]);

  function createUser() {
    const data = {
      telegram_id: user.id,
      telegram_name: user.username,
      chat_id: 1,
      payment_token: 1
    };

    console.table(data);

    return axios.post(`api/v1/profile/${user.id}/create`, data, {
      headers: {
        'Content-Type': 'application/json',
      }
    });
  }

  return (
    <WebAppProvider>
      <div>
        <ProductList url="http://127.0.0.1:8000/api/v1/products/" />
      </div>
      <MainButton/>
    </WebAppProvider>
  );
};

export default Home;