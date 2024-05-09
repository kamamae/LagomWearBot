import ProductList from "../../components/ProductList/main";
import { WebAppProvider, MainButton } from '@vkruglikov/react-telegram-web-app';
import {useTelegram} from '../../hooks/useTelegram';
import {useEffect} from 'react';


export const Home = () => {
  const {user, chat, tg} = useTelegram();
  console.log('User Info:', user,chat,tg)

    useEffect(() => {

    tg.MainButton.setParams({
    text: 'Посмотреть корзину',
    });
    }, [tg.user, tg.MainButton]);

    console.log(userId,tg)


  return (
  <WebAppProvider>
    <div>
      <ProductList/>
    </div>
    <MainButton/>
  </WebAppProvider>
  );
};

export default Home
