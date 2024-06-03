import ProductList from "../../components/ProductList/main";
import { WebAppProvider, MainButton } from '@vkruglikov/react-telegram-web-app';
import { useTelegram } from '../../hooks/useTelegram';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export const Home = () => {
  const { user, tg } = useTelegram();
  const userId = user.id;
  const navigate = useNavigate();
  const [profile, setProfile] = useState<any[]>([]);

  console.log(profile)
  useEffect(() => {
    tg.MainButton.setText('Посмотреть корзину');
    tg.MainButton.show();

    const onClickHandler = () => {
      navigate(`/cart/${userId}`);
    };

    tg.MainButton.onClick(onClickHandler);

    createOrCheckUser({
      telegram_id: userId,
      telegram_name: user.username,
      chat_id: 1,
      payment_token: 1
    });

    return () => {
      tg.MainButton.offClick(onClickHandler);
      tg.MainButton.hide();
    };
  }, [tg, navigate, userId, user.id, setProfile]);

  async function createOrCheckUser(data: any) {
    try {
      const response = await axios.get(`http://127.0.0.1:8000/api/v1/profiles/${userId}`)
      console.log(response)
    } catch (err) {
      if (axios.isAxiosError(err) && err.response && err.response.status === 404) {
        console.log('User not found, creating new profile...');
        await axios.post(`http://127.0.0.1:8000/api/v1/profile/${userId}/create`, data, {
          headers: {
            'Content-Type': 'application/json',
          }
        });
        console.log('New user created');
      } else {
        console.error('Error creating/updating user:', err);
      }
    }
  }

  return (
    <WebAppProvider>
      <div>
        <ProductList url="http://127.0.0.1:8000/api/v1/products/" />
      </div>
      <MainButton />
    </WebAppProvider>
  );
};

export default Home;