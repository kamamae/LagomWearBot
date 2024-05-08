import ProductList from "../../components/ProductList/main";
import { WebAppProvider, MainButton } from '@vkruglikov/react-telegram-web-app';
import {useTelegram} from '../../hooks/useTelegram';
import {useEffect} from 'react';



export const Home = () => {
  const {user, chat, tg} = useTelegram();
  console.log(user,chat,tg)



  useEffect(()=>{
  tg.MainButton.setParams({
      text:'Посмотреть корзину'
  })
  },[])
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
