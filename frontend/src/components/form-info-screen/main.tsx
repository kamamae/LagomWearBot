import React, { useState, useEffect } from 'react';
import InputField from '../InputField/main';
import { WebAppProvider, BackButton, MainButton } from '@vkruglikov/react-telegram-web-app';
import { useTelegram } from '../../hooks/useTelegram';
import { useNavigate } from 'react-router-dom';


const Form = () => {
  const {tg,user} = useTelegram();
  const userId = user?.id
  const navigate = useNavigate();
  const [name, setName] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [city, setCity] = useState<string>('');
  const [zipCode, setZipCode] = useState<string>('');
  const [pickupAddress, setPickupAddress] = useState<string>('');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const goBack = () => {
    window.history.back();
  };
  const onClickHandler = () => {
    navigate(`/cart/form/${userId}`);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
    } else {
      const formData = {
        name,
        phone,
        city,
        zipCode,
        pickupAddress,
      };
      localStorage.setItem('formData', JSON.stringify(formData));
      console.log(formData);
    }
  };

  useEffect(() => {
    tg.MainButton.onClick(handleSubmit);
    tg.MainButton.setParams({
      text: `Продолжить оформление`,
    });
  }, [tg.MainButton, handleSubmit]);
  
  useEffect(() => {
    const storedUserData = JSON.parse(localStorage.getItem('formData') || '{}');
    if (storedUserData.name) {
      setName(storedUserData.name);
      setPhone(storedUserData.phone);
      setCity(storedUserData.city);
      setZipCode(storedUserData.zipCode);
      setPickupAddress(storedUserData.pickupAddress);
    }
  }, []);

  const validate = () => {
    const newErrors: { [key: string]: string } = {};
    if (!name) newErrors.name = 'Поле должно быть заполнено';
    if (!phone) newErrors.phone = 'Поле должно быть заполнено';
    if (!city) newErrors.city = 'Поле должно быть заполнено';
    if (!zipCode) newErrors.zipCode = 'Поле должно быть заполнено';
    if (!pickupAddress) newErrors.pickupAddress = 'Поле должно быть заполнено';
    return newErrors;
  };


  const handleNameChange = (value: string) => {
    setName(value);
    if (errors.name) {
      setErrors((prevErrors) => ({ ...prevErrors, name: '' }));
    }
  };

  const handlePhoneChange = (value: string) => {
    setPhone(value.slice(0, 12));
    if (errors.phone) {
      setErrors((prevErrors) => ({ ...prevErrors, phone: '' }));
    }
  };

  const handleCityChange = (value: string) => {
    setCity(value);
    if (errors.city) {
      setErrors((prevErrors) => ({ ...prevErrors, city: '' }));
    }
  };

  const handleZipCodeChange = (value: string) => {
    setZipCode(value.slice(0, 6));
    if (errors.zipCode) {
      setErrors((prevErrors) => ({ ...prevErrors, zipCode: '' }));
    }
  };

  const handlePickupAddressChange = (value: string) => {
    setPickupAddress(value);
    if (errors.pickupAddress) {
      setErrors((prevErrors) => ({ ...prevErrors, pickupAddress: '' }));
    }
  };

  return (
    <WebAppProvider>
      <BackButton onClick={goBack} />
      <form className="delivery-form" onSubmit={handleSubmit}>
        <InputField
          label="Имя"
          value={name}
          onChange={handleNameChange}
          error={errors.name}
        />
        <InputField
          label="Телефон"
          value={phone}
          onChange={handlePhoneChange}
          type="tel"
          maxLength={12}
          error={errors.phone}
        />
        <InputField
          label="Город"
          value={city}
          onChange={handleCityChange}
          error={errors.city}
        />
        <InputField
          label="Почтовый индекс"
          value={zipCode}
          onChange={handleZipCodeChange}
          maxLength={6}
          error={errors.zipCode}
        />
        <InputField
          label="Адрес пункта выдачи"
          value={pickupAddress}
          onChange={handlePickupAddressChange}
          error={errors.pickupAddress}
        />
      </form>
    <MainButton onClick={onClickHandler}/>
    </WebAppProvider>
  );
};

export default Form;
