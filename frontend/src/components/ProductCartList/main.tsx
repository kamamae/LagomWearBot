import { useState, useEffect, memo } from 'react';
import axios from 'axios';
import ProductCart from '../ProductItemCart/main';
import './styles.css';

const ProductCartList = memo(({ url, onTotalPriceUpdate, cartItems }: any) => {
  const [products, setProducts] = useState<any[]>([]);
  const [totalPrice, setTotalPrice] = useState(0);

  const calculateTotalPrice = (items: any[]) => {
    console.log('totalPrice', totalPrice)
    const total = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
    return total;
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(url);
        setProducts(response.data);

        const newTotalPrice = calculateTotalPrice(response.data);
        setTotalPrice(newTotalPrice);
        onTotalPriceUpdate(newTotalPrice);
      } catch (error) {
        console.error('Error fetching data:', error);

        const newTotalPrice = calculateTotalPrice(cartItems);
        setTotalPrice(newTotalPrice);
        onTotalPriceUpdate(newTotalPrice);
      }
    };

    fetchProducts();
  }, [url, cartItems, onTotalPriceUpdate]);

  return (
    <div className="cart-list">
      {products.map((item) => (
        <ProductCart key={item.id} product={item} />
      ))}
    </div>
  );
});

export default ProductCartList;