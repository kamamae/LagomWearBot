import React, { useState, useEffect } from 'react';
import { WebAppProvider, MainButton, BackButton } from '@vkruglikov/react-telegram-web-app';
import { useTelegram } from '../../hooks/useTelegram';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './styles.css'


interface MainFormScreenProps {}

const MainFormScreen: React.FC<MainFormScreenProps> = () => {
  const {tg} = useTelegram();
  const userId = 1387017894;
  const navigate = useNavigate();
  const [cardData, setCardData] = useState<any>(null);
  const [userData, setUserData] = useState<any>(null);
  const [price, setPrice] = useState<number>(0);

  useEffect(() => {
    const storedCardData = JSON.parse(localStorage.getItem('cardData') || '{}');
    setCardData(storedCardData);
    const storedUserData = JSON.parse(localStorage.getItem('formData') || '{}');
    setUserData(storedUserData)
  }, []);

  // const handleCardFormSubmit = (data: any) => {
  //   setCardData(data);
  //   localStorage.setItem('cardData', JSON.stringify(data));
  // };

  // const handleUserFormSubmit = (data: any) => {
  //   setUserData(data);
  //   localStorage.setItem('formData', JSON.stringify(data));
  // };

  // const handlePay = async () => {
  //   try {
  //     await tg.sendInvoice({
  //       provider_token: 'YOUR_PROVIDER_TOKEN',
  //       start_parameter: 'time-machine',
  //       title: 'Product',
  //       description: 'Product description',
  //       currency: 'RUB',
  //       prices: [{ label: 'Product', amount: price * 100 }], // Цена в копейках
  //     });
  //   } catch (error) {
  //     console.error('Error processing payment:', error);
  //   }
  // };

  useEffect(() => {
    // tg.MainButton.onClick(handlePay);
    tg.MainButton.setParams({
      text: `Оплатить ${price} руб.`,
    });
  }, [tg.MainButton, price]);

  const goBack = () => {
    window.history.back();
  };

  const onClickUserData = () => {
    navigate(`/form/${userId}/user/`);
  };

  const onClickCardData = () => {
    navigate(`/form/${userId}/card/`);
  };

  useEffect(() => {
    const fetchPrice = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:8000/api/v1/cart/${userId}/price/`);
        setPrice(response.data.total_price);
      } catch (error) {
        console.error('Ошибка при получении данных:', error);
      }
    };

    fetchPrice();
  }, [userId]);

  return (
    <WebAppProvider>
    <BackButton onClick={goBack} />
<div className='body'>
  <div className='data-field' onClick={onClickCardData}>
    <div>
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M2.99968 9.29995H20.9997M6.59968 13.4999H9.59968M4.80015 5.1001H19.1998C20.5252 5.1001 21.5997 6.17377 21.5998 7.49923L21.6 16.5011C21.6001 17.8266 20.5255 18.9001 19.2001 18.9001L4.80038 18.8999C3.47493 18.8999 2.40044 17.8254 2.4004 16.5L2.40015 7.50016C2.40011 6.17465 3.47464 5.1001 4.80015 5.1001Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
    {cardData?.cardNumber && (
      <div className="form-info">
        <div className="address-container">
          <p className="data">**** **** **** {cardData.cardNumber.slice(-4)}</p>
        </div>
        <p className="label">Способ оплаты</p>
      </div>
    )}
    {!cardData?.cardNumber && (
      <div className="form-info">
        <div className="address-container">
        </div>
        <p className="label">Способ оплаты</p>
      </div>
    )}
  </div>

    <div className="data-field" onClick={onClickUserData}>
     <div>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M3.23779 19.5C4.5632 17.2892 7.46807 15.7762 12.0001 15.7762C16.5321 15.7762 19.4369 17.2892 20.7623 19.5M15.6001 8.1C15.6001 10.0882 13.9883 11.7 12.0001 11.7C10.0118 11.7 8.40007 10.0882 8.40007 8.1C8.40007 6.11177 10.0118 4.5 12.0001 4.5C13.9883 4.5 15.6001 6.11177 15.6001 8.1Z" stroke="white" stroke-width="2" stroke-linecap="round" />
        </svg>
      </div>
      {userData ? (
          <div className="form-info">
            <p className="data">{userData.name}</p>
            <p className="label">Имя</p>
          </div>
      ) : (
        <div className="form-info">
          <p className="label">Имя</p>
        </div>
      )}
    </div>


    <div className='data-field' onClick={onClickUserData}>
        <div>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12.0001 21.6C12.0001 21.6 19.5131 14.9218 19.5131 9.91307C19.5131 5.76373 16.1494 2.40002 12.0001 2.40002C7.85076 2.40002 4.48706 5.76373 4.48706 9.91307C4.48706 14.9218 12.0001 21.6 12.0001 21.6Z" stroke="white" stroke-width="2"/>
          <path d="M14.4004 9.60018C14.4004 10.9257 13.3259 12.0002 12.0004 12.0002C10.6749 12.0002 9.60041 10.9257 9.60041 9.60018C9.60041 8.27469 10.6749 7.20018 12.0004 7.20018C13.3259 7.20018 14.4004 8.27469 14.4004 9.60018Z" stroke="white" stroke-width="2"/>
          </svg>
        </div>
      {userData ? (
        <div className='form-info'>
          <div className='address-container'>
            <p className='data'>{userData.city}</p>
            <p className='data'>{userData.pickupAddress}</p>
            <p className='data'>{userData.zipCode}</p>
          </div>
        <p className="label">Адрес доставки</p>
      </div>
    ):(
      <div className='form-info'>
      <div className='address-container'>
      </div>
    <p className="label">Адрес доставки</p>
  </div>
    )}
  </div>

      <div className='data-field' onClick={onClickUserData}>
        <div>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M4.49236 0.25C4.09978 0.25 3.71307 0.390625 3.3908 0.648438L3.34392 0.671875L3.32049 0.695313L0.976737 3.10938L1.00017 3.13281C0.276542 3.80078 0.0538858 4.7998 0.367363 5.66406C0.370292 5.66992 0.364433 5.68164 0.367363 5.6875C1.0031 7.50684 2.62908 11.0195 5.80486 14.1953C8.99236 17.3828 12.5519 18.9443 14.3127 19.6328H14.3361C15.2472 19.9375 16.2346 19.7207 16.9377 19.1172L19.3049 16.75C19.926 16.1289 19.926 15.0508 19.3049 14.4297L16.258 11.3828L16.2346 11.3359C15.6135 10.7148 14.5119 10.7148 13.8908 11.3359L12.3908 12.8359C11.8488 12.5752 10.5568 11.9072 9.32049 10.7266C8.09295 9.55469 7.466 8.20703 7.23455 7.67969L8.73455 6.17969C9.36443 5.54981 9.37615 4.50098 8.71111 3.88281L8.73455 3.85938L8.66424 3.78906L5.66424 0.695313L5.6408 0.671875L5.59392 0.648438C5.27166 0.390625 4.88494 0.25 4.49236 0.25ZM4.49236 1.75C4.54803 1.75 4.60369 1.77637 4.65642 1.82031L7.65642 4.89063L7.72674 4.96094C7.72088 4.95508 7.77068 5.03418 7.67986 5.125L5.80486 7L5.4533 7.32813L5.61736 7.79688C5.61736 7.79688 6.47869 10.1025 8.28924 11.8281L8.4533 11.9688C10.1965 13.5596 12.2502 14.4297 12.2502 14.4297L12.7189 14.6406L14.9455 12.4141C15.0744 12.2852 15.051 12.2852 15.1799 12.4141L18.2502 15.4844C18.3791 15.6133 18.3791 15.5664 18.2502 15.6953L15.9533 17.9922C15.6076 18.2881 15.2414 18.3496 14.8049 18.2031C13.1056 17.5352 9.80389 16.085 6.85955 13.1406C3.89178 10.1729 2.34197 6.80664 1.77361 5.17188C1.65935 4.86719 1.74139 4.41602 2.00799 4.1875L2.05486 4.14063L4.3283 1.82031C4.38103 1.77637 4.4367 1.75 4.49236 1.75Z" fill="white"/>
          </svg>
        </div>
        {userData ? (
          <div className='form-info'>
            <div className='address-container'>
              <p className='data'>{userData.phone}</p>

            </div>
            <p className="label">Номер телефона</p>
          </div>
        ):
        (
          <div className='form-info'>
          <div className='address-container'>
            <p className='data'>sdlsdal</p>

          </div>
          <p className="label">Номер телефона</p>
        </div>
        ) }
      </div> 
    </div>
    <MainButton />
    </WebAppProvider>
  );
};

export default MainFormScreen;