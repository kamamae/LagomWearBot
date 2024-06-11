import { useTelegram } from '../../hooks/useTelegram';
import ProductCartList from '../../components/ProductCartList/main';
import { WebAppProvider, MainButton, BackButton } from '@vkruglikov/react-telegram-web-app';
import { useEffect, useState } from 'react';
import axios from 'axios';

export const Cart = () => {
  const { user,tg } = useTelegram();
  const userId = user.id;
  const [price, setPrice] = useState<number>(0);
  const goBack = () => {
    window.history.back();
  };


  // const sendTestPaymentToTelegram = () => {
  //   try {
  //     const testPaymentUrl = '401643678:TEST:8d293e33-bd47-4a51-9053-6227becc9110';
  //     tg.openInvoice(tg.sendInvoice(testPaymentUrl));
  //   } catch (error) {
  //     console.error('Error sending test payment to Telegram:', error);
  //   }
  // };

  const sendText = () => {
    try {
      // Get the current user and chat information
      const { query_id } = tg.initDataCredentials();
  
      // Send a text message to the user
      console.log('LOL')
      tg.answerWebAppQuery(query_id, JSON.stringify({
        type: 'message',
        text: 'Hello, this is a test message!'
      }));
    } catch (error) {
      console.error('Error sending text message to Telegram:', error);
    }
  };




//  tg.bot.on('web_app_data', (ctx:any) => {
//     if (ctx.webAppData.data.type === 'web_app_open_invoice') {
//       const slug = ctx.webAppData.data.slug;
//       console.log('Received invoice slug:', slug);
//       tg.openInvoice(`https://example.com/invoice/${slug}`);
//     }
//   });

  
  const onClickHandler = () => {  
    if (price > 0) {
      tg.sendData(JSON.stringify({ price }));
    } else {
      console.error('Invalid price value:', price);
    }
  };

  tg.MainButton.onClick(onClickHandler);

  const updateMainButtonText = () => {
    tg.MainButton.setParams({
      text: `Оплатить ${price} руб.`,
    });
    sendText();
  };

  useEffect(() => {
    const fetchPrice = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:8000/api/v1/cart/${userId}/price/`);
        console.log('PRICE', price)
        setPrice(response.data.total_price);
        updateMainButtonText();
      } catch (error) {
        console.error('Ошибка при получении данных:', error);
      }
    };
    fetchPrice();
  }, [userId, price]);

  const url = `http://127.0.0.1:8000/api/v1/cart/${userId}/`;

  return (
    <WebAppProvider>
      <BackButton onClick={goBack} />
      <div>
        <ProductCartList url={url} />
      </div>
      <MainButton color="#CC87FE" />
    </WebAppProvider>
  );
};

export default Cart;