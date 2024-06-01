import './styles.css';
import { useState, useEffect } from 'react';
import getCurrentTheme from '../../hooks/theme';
import {useTelegram} from '../../hooks/useTelegram';


const ProductCart = ({ product }: { product: any }) => {
  const firstImage = `http://127.0.0.1:8000/media/${product.product.images[0].image}`;
  const [quantity, setQuantity] = useState(product.quantity);
  const {user,tg} = useTelegram();
  const userId = user.id; 
  console.log('USER',userId)
  useEffect(() => {
    tg.ready();
  },[])

  const handleQuantityIncrement = async () => {
    try {
      const newQuantity = quantity + 1;
      setQuantity(newQuantity);
  
      await updateCartQuantity(product.id, newQuantity);
    } catch (error) {
      console.error('Ошибка при обновлении количества товара в корзине:', error);
    }
  };
  const handleQuantityDecrement = async () => {
 try {
    if (quantity > 1) {
      const newQuantity = quantity - 1;
      setQuantity(newQuantity);
      await updateCartQuantity(product.id, newQuantity);
    }
    } catch (error) {
      console.error('Ошибка при обновлении количества товара в корзине:', error);
    }
  };

  const handleDeleteProduct = async () => {
    try {
      await deleteCartProduct(product.id, 0);
    } catch (error) {
      console.error('Ошибка при удалении товара в корзине:', error);
    }
  };
  
  const updateCartQuantity = async (productId: string, newQuantity: number) => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/v1/cart/${userId}/${productId}/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ quantity: newQuantity }),
      });
  
      if (response.ok) {
        const updatedCartItem = await response.json();
        setQuantity(updatedCartItem.quantity);
      } else {
        const errorData = await response.json();
        console.error('Ошибка при обновлении количества товара в корзине:', errorData);
      }
    } catch (error) {
      console.error('Ошибка при отправке запроса:', error);
    }
  };
  const deleteCartProduct = async (productId: string, newQuantity: number) => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/v1/cart/${userId}/${productId}/`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ quantity: newQuantity }),
      });

      if (response.ok) {
      } else {
        const errorData = await response.json();
        console.error('Ошибка при удалении товара в корзине:', errorData);
      }
    } catch (error) {
      console.error('Ошибка при отправке запроса:', error);
    }
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
        <img src={firstImage} alt="foto" className="product-cart-image" />
        <div>
          <h2 className="product-cart-name">{product.product.name}</h2>
          <p className="cart-size">{product.product_size.size_name}</p>
          <div className="quantity-controls">
            <button className="quantity-btn" onClick={handleQuantityDecrement}>
              -
            </button>
            <p className="quantity">{quantity}</p>
            <button className="quantity-btn" onClick={handleQuantityIncrement}>
              +
            </button>
          </div>
        </div>
      </div>
      <div className="product-cart-price-actions">
        <p className="product-cart-price">{product.product.price} ₽</p>
        <button className="trash-btn" onClick={handleDeleteProduct}>
          <svg
            className="trash"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              className="trash"
              d="M4 6.17647H20M10 16.7647V10.4118M14 16.7647V10.4118M16 21H8C6.89543 21 6 20.0519 6 18.8824V7.23529C6 6.65052 6.44772 6.17647 7 6.17647H17C17.5523 6.17647 18 6.65052 18 7.23529V18.8824C18 20.0519 17.1046 21 16 21ZM10 6.17647H14C14.5523 6.17647 15 5.70242 15 5.11765V4.05882C15 3.47405 14.5523 3 14 3H10C9.44772 3 9 3.47405 9 4.05882V5.11765C9 5.70242 9.44772 6.17647 10 6.17647Z"
              stroke="none"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default ProductCart;