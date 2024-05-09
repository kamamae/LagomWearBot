import { useEffect, useState} from 'react';
import axios from 'axios';
import DetailProductCard from '../../components/DetailProductItem/main';
import { useParams } from 'react-router-dom';
import { WebAppProvider, BackButton } from '@vkruglikov/react-telegram-web-app';

const DetailProduct = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const goBack = () => {
    window.history.back();
  };

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:8000/api/v1/products/${id}`);
        setProduct(response.data);
      } catch (error) {
        console.error('Ошибка при получении данных:', error);
      }
    };

    const tg = window.Telegram.WebApp;
    if (tg) {
      tg.MainButton.setParams({
        text: 'Посмотреть корзину'
      });
    }

    fetchProduct();
  }, [id]);

  if (!product) {
    return <div>Загрузка...</div>;
  }

  return (
    <WebAppProvider>
      <BackButton onClick={goBack}/>
      <div>
        <DetailProductCard product={product} />
      </div>
    </WebAppProvider>
  );
};

export default DetailProduct;