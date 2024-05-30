import ProductList from "../../components/ProductList/main";
import { WebAppProvider, MainButton } from '@vkruglikov/react-telegram-web-app';
import {useTelegram} from '../../hooks/useTelegram';
import {useEffect} from 'react';
import { useNavigate } from 'react-router-dom';

export const Home = () => {
  const {user, chat, tg} = useTelegram();
  const userId = user.id; 
  console.log('User Info:', user,chat,tg)
  const navigate = useNavigate();
    useEffect(() => {

    tg.MainButton.setParams({
    text: 'Посмотреть корзину',
    onClick: () => navigate(`/cart/${userId}`),
      });
    }, [tg.user, tg.MainButton, navigate, userId]);
    console.log(tg.user,tg)


  return (
  <WebAppProvider>
    <div>
    <ProductList url="http://127.0.0.1:8000/api/v1/products/" />
    </div>
    <MainButton/>
  </WebAppProvider>
  );
};

export default Home
