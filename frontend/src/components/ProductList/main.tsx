import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ProductItem from '../ProductItem/main';
import './styles.css';

const ProductList = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/api/v1/products');
        setProducts(response.data);

        console.log(response.data)
      } catch (error) {
        console.error('Ошибка при получении данных:', error);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className="list">
      {products.map((item) => (
        <ProductItem key={item.id} product={item} className="item" />
      ))}
    </div>
  );
};

export default ProductList;