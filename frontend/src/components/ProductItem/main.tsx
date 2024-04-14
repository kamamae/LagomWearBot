import React from 'react';
import Button from '../Button/main';
import './styles.css';



// const ProductItem = ({product, className, onAdd}) => {

//     const onAddHandler = () => {
//     onAdd(product);
//     }

//     return(
//         <div className={'product' + className}>
//             <div className = {'img'}/>
//             <div className={'title'}>{product.title}</div>
//             <div className={'description'}>{product.description}</div>
//             <div className={'price'}>{product.price}</div>
//             <Button className={'add_btn'} onClick={onAddHandler}>Добавить в коризину</Button>
//         </div>
//     )
// }

// export default ProductItem;



const ProductCard = ({ product }) => {
  const { name, price, description, image } = product;

  return (
    <div className="product-card">
      <img src={image} alt={name} className="product-image" />
      <h2 className="product-name">{name}</h2>
      <p className="product-description">{description}</p>
      <p className="product-price">${price}</p>
      <button className="add-to-cart-button">Add to Cart</button>
    </div>
  );
};

export default ProductCard;