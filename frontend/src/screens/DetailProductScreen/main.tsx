import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DetailProductCard from '../../components/DetailProductItem/main';
import { useParams } from 'react-router-dom';


const DetailProduct = () => {
  const { id } = useParams(); // Get the product ID from the URL params
  const [product, setProduct] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:8000/api/v1/products/${id}`);
        setProduct(response.data);
      } catch (error) {
        console.error('Ошибка при получении данных:', error);
      }
    };

    fetchProduct();
  }, [id]);

  if (!product) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <DetailProductCard product={product} />
    </div>
  );
};

export default DetailProduct;