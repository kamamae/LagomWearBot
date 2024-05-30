import './styles.css';
import getCurrentTheme from '../../hooks/theme';


const ProductCart = ({ product }: { product: any }) => {
  const firstImage = `http://127.0.0.1:8000/media/${product.product.images[0].image}`;

  const handleQuantityChange = () => {

  };


const currentTheme = getCurrentTheme();

if (currentTheme === 'dark') {
  document.documentElement.style.setProperty('--card-bg-color', '#282828');
  document.documentElement.style.setProperty('--card-text-color', '#ffffff');
} else {
  document.documentElement.style.setProperty('--card-bg-color', '#F2F2F2');
  document.documentElement.style.setProperty('--card-text-color', '#555555');
}
return (
<div className="product-cart-card">
<div className="product-cart-info">
  <img src={firstImage} alt='foto' className="product-cart-image" />
  <div>
    <h2 className="product-cart-name">{product.product.name}</h2>
      <p className='cart-size'>{product.product_size.size_name}</p>
    <div className="quantity-controls">
      <button className="quantity-btn" onClick={() => handleQuantityChange()}>-</button>
      {/* <button className="quantity-btn" onClick={() => handleQuantityChange(product.id, product.quantity - 1)}>-</button> */}
      <p className="quantity">{product.quantity}</p>
      <button className="quantity-btn" onClick={() => handleQuantityChange()}>+</button>
      {/* <button className="quantity-btn" onClick={() => handleQuantityChange(product.id, product.quantity + 1)}>+</button> */}

    </div>
  </div>
</div>
<div className="product-cart-price-actions">
  <p className="product-cart-price">{product.product.price} ₽</p>
<button className="trash-btn">
  <svg className="trash"  width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path className="trash" d="M4 6.17647H20M10 16.7647V10.4118M14 16.7647V10.4118M16 21H8C6.89543 21 6 20.0519 6 18.8824V7.23529C6 6.65052 6.44772 6.17647 7 6.17647H17C17.5523 6.17647 18 6.65052 18 7.23529V18.8824C18 20.0519 17.1046 21 16 21ZM10 6.17647H14C14.5523 6.17647 15 5.70242 15 5.11765V4.05882C15 3.47405 14.5523 3 14 3H10C9.44772 3 9 3.47405 9 4.05882V5.11765C9 5.70242 9.44772 6.17647 10 6.17647Z" stroke="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>
</button>
</div>
</div>
);
};

export default ProductCart;