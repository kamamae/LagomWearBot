import React from 'react';
import Button from '../Button/main';
import './styles.css';



const ProductCard = ({ product }) => {
  const { name, price, image } = product;
const firstImage = 'http://127.0.0.1:8000/media/'+product.images[0].image
console.log(firstImage);
  return (
    <div className="product-card">
      <img src={firstImage} alt='foto' className="product-image" />
      <h2 className="product-name">{name}</h2>
      <p className="product-price">{price} руб.</p>
      <button className="add-to-cart-button">добавить</button>
    </div>
  );
};

export default ProductCard;