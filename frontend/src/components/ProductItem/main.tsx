import React from 'react';
import Button from '../Button/main';
import './styles.css';
import { Link } from 'react-router-dom';

const ProductCard = ({ product }) => {
  const { id, name, price, image } = product;
  const firstImage = `http://127.0.0.1:8000/media/${product.images[0].image}`;

  console.log(firstImage);

  return (
    <div className="product-card">
      <img src={firstImage} alt='foto' className="product-image" />
      <h2 className="product-name">{name}</h2>
      <p className="product-price">{price} руб.</p>
      <Link to={`/products/${id}`} >
        <Button className="open-detail-screen">Добавить</Button>
      </Link>
    </div>
  );
};

export default ProductCard;