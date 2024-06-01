import ProductList from "../../components/ProductList/main";
import { WebAppProvider, MainButton } from '@vkruglikov/react-telegram-web-app';
import {useTelegram} from '../../hooks/useTelegram';
import {useEffect} from 'react';
import { useNavigate } from 'react-router-dom';

export const Home = () => {
  const { user, tg } = useTelegram();
  const userId = user.id; 
  const navigate = useNavigate();

  useEffect(() => {
    tg.MainButton.setText('Посмотреть корзину');
    tg.MainButton.show();

    const onClickHandler = () => {
      navigate(`/cart/${userId}`);
    };

    tg.MainButton.onClick(onClickHandler);

    return () => {
      tg.MainButton.offClick(onClickHandler);
      tg.MainButton.hide();
    };
  }, [tg, navigate, userId]);

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
