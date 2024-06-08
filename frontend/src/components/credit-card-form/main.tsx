import React, { useState, useEffect } from 'react';
import InputField from '../InputField/main';
import { WebAppProvider, BackButton, MainButton } from '@vkruglikov/react-telegram-web-app';
import { useTelegram } from '../../hooks/useTelegram';
import { useNavigate } from 'react-router-dom';

const CreditCardForm = () => {
  const {tg,user} = useTelegram();
  const userId = user?.id
  const navigate = useNavigate();
  const [cardNumber, setCardNumber] = useState<string>('');
  const [expirationDate, setExpirationDate] = useState<string>('');
  const [cvv, setCvv] = useState<string>('');
  const [cardholderName, setCardholderName] = useState<string>('');
  const [errors, setErrors] = useState<{ [key: string]: string }>({
    cardNumber: '',
    expirationDate: '',
    cvv: '',
    cardholderName: ''
  });

  const goBack = () => {
    window.history.back();
  };
  const onClickHandler = () => {
    navigate(`/cart/form/${userId}`);
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {
      cardNumber: '',
      expirationDate: '',
      cvv: '',
      cardholderName: ''
    };
  
    if (!cardNumber) newErrors.cardNumber = 'Поле должно быть заполнено';
    if (!expirationDate) newErrors.expirationDate = 'Поле должно быть заполнено';
    if (!cvv) newErrors.cvv = 'Поле должно быть заполнено';
    if (!cardholderName) newErrors.cardholderName = 'Поле должно быть заполнено';
  
    return newErrors;
  };
  
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const newErrors = validateForm();
    setErrors(newErrors);
    if (Object.keys(newErrors).every(key => newErrors[key] === '')) {
      const cardData = {
        cardNumber,
        expirationDate,
        cvv,
        cardholderName,
      };
      localStorage.setItem('cardData', JSON.stringify(cardData));
      console.log(cardData);
    }
  };

  useEffect(() => {
    const storedCardData = JSON.parse(localStorage.getItem('cardData') || '{}');
    if (storedCardData.cardNumber) {
      setCardNumber(storedCardData.cardNumber);
      setExpirationDate(storedCardData.expirationDate);
      setCvv(storedCardData.cvv);
      setCardholderName(storedCardData.cardholderName);
    }
  }, []);

  useEffect(() => {
    tg.MainButton.onClick(handleSubmit);
    tg.MainButton.setParams({
      text: `Продолжить оформление`,
    });
  }, [tg.MainButton, handleSubmit]);

  const handleCardNumberChange = (value: string) => {
    let formattedValue = value.replace(/\D/g, '');
    if (formattedValue.length > 0) {
      formattedValue = formattedValue.match(/.{1,4}/g)!.join(' ');
    }
    setCardNumber(formattedValue.slice(0, 19));
  };

  const handleExpirationDateChange = (value: string) => {
    let formattedValue = value;
    if (value.length === 2 && expirationDate.length < 3) {
      formattedValue += '/';
    }
    setExpirationDate(formattedValue.slice(0, 5));
  };

  const handleCvvChange = (value: string) => {
    setCvv(value.replace(/\D/g, '').slice(0, 3));
  };


  return (
    <WebAppProvider>
    <BackButton onClick={goBack} />
    <form className="credit-card-form" onSubmit={handleSubmit}>
      <div>
        <InputField
          label="Номер карты"
          value={cardNumber}
          onChange={handleCardNumberChange}
          type="text"
        />
        {errors.cardNumber && <p className="error-text">{errors.cardNumber}</p>}
      </div>
      <div className="flex gap-4">
        <div>
          <InputField
            label="Срок действия"
            value={expirationDate}
            onChange={handleExpirationDateChange}
            type="text"
            placeholder="MM/YY"
          />
          {errors.expirationDate && <p className="error-text">{errors.expirationDate}</p>}
        </div>
        <div>
          <InputField
            label="CVV"
            value={cvv}
            onChange={handleCvvChange}
            type="password"
          />
          {errors.cvv && <p className="error-text">{errors.cvv}</p>}
        </div>
      </div>
      <div>
        <InputField
          label="Имя владельца"
          value={cardholderName}
          onChange={setCardholderName}
          type="text"
        />
        {errors.cardholderName && <p className="error-text">{errors.cardholderName}</p>}
      </div>
      <button type="submit" className="credit-card-form__submit-button">
        Отправить
      </button>
    </form>
    <MainButton onClick={onClickHandler}/>
    </WebAppProvider>
  );
};

export default CreditCardForm;
