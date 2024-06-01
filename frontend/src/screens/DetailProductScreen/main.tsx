import { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import DetailProductCard from '../../components/DetailProductItem/main';
import { useParams } from 'react-router-dom';
import { WebAppProvider, BackButton, MainButton } from '@vkruglikov/react-telegram-web-app';
import { useTelegram } from '../../hooks/useTelegram';
import { useNavigate } from 'react-router-dom';

const DetailProduct = () => {
  const [selectedSizeId, setSelectedSizeId] = useState(null);
  const { id } = useParams();
  const [profile, setUserProfile] = useState<any | null>(null);
  const [product, setProduct] = useState<any | null>(null);
  const { tg, user } = useTelegram();
  const navigate = useNavigate();

  const handleSizeChange = (sizeId: any) => {
    setSelectedSizeId(sizeId);
    console.log('Выбран размер с ID:', sizeId);
    console.log('PROFILE',profile)
  };

  const goBack = () => {
    window.history.back();
  };

  const userId = user.id;

  const fetchProduct = useCallback(() => {
    axios.get(`http://127.0.0.1:8000/api/v1/products/${id}`)
      .then((response) => {
        console.log("PRODUCT ID", id); 
        setProduct(response.data);
      })
      .catch((error) => {
        console.error('Ошибка при получении данных:', error);
      });
  }, [id]);

  const fetchUserProfile = useCallback((telegramId: number) => {
    axios.get(`http://127.0.0.1:8000/api/v1/profiles/${telegramId}/`)
      .then((response) => {
        const userId = response.data.id; 
        setUserProfile(response.data);
        console.log("USER", userId); 
      })
      .catch((error) => {
        console.error('Ошибка при получении профиля пользователя:', error);
      });
  }, []);

  useEffect(() => {
    if (!product) {
      fetchProduct();
    }

    if (user.id) {
      fetchUserProfile(user.id);
    }
  }, [id, user.id, fetchProduct, fetchUserProfile]);

  let onClickHandler: () => void | undefined;

  useEffect(() => {
    if (!product) {
      fetchProduct();
    }

    if (product) {
      tg.MainButton.setText('Добавить в корзину');
      tg.MainButton.show();

      onClickHandler = () => {
        addToCart(product, selectedSizeId)
          .then(() => {
            tg.MainButton.setParams({
              text: 'Добавлено в корзину',
              color: '#808080'
            });
            navigate(`/cart/${userId}`);
          })
          .catch((error) => {
            console.error('Не удалось добавить товар в корзину:', error);
          });
      };

      tg.MainButton.onClick(onClickHandler);
    }

    return () => {
      if (onClickHandler) {
        tg.MainButton.offClick(onClickHandler);
        tg.MainButton.hide();
      }
    };
  }, [id, tg, user.id, product, navigate, fetchProduct, selectedSizeId]);

  function addToCart(product: any, sizeId: number | null) {
    const data = {
      quantity: 1,
      payment_status: 'pending',
      user: profile.id,
      product: product.id,
      product_size: sizeId
    };
  
    console.table(data);
  
    return axios.post(`http://127.0.0.1:8000/api/v1/cart/${user.id}/add/`, data, {
      headers: {
        'Content-Type': 'application/json',
      }
    });
  }

  if (!product) {
    return <div>Загрузка...</div>;
  }

  return (
    <WebAppProvider>
      <BackButton onClick={goBack} />
      <div>
      <DetailProductCard
      product={product}
      onSizeChange={handleSizeChange}
  />
      </div>
      <MainButton />
    </WebAppProvider>
  );
};

export default DetailProduct;