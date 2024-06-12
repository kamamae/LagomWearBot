import { useState, useEffect } from 'react';
import axios from 'axios';
import ProductCart from '../ProductItemCart/main';
import './styles.css';

const ProductCartList = ({ url, onCartItemsChange }: { url: string, onCartItemsChange: (updatedCartItems: any) => void }) => {
  const [products, setProducts] = useState<any[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(url);
        setProducts(response.data);
        console.log(response.data);
      } catch (error) {
        console.error('Ошибка при получении данных:', error);
      }
    };

    fetchProducts();
  }, [url]);

  return (
    <div className="list">
      {products.map((item) => (
        <ProductCart key={item.id} product={item} onCartItemsChange={onCartItemsChange} />
      ))}
    </div>
  );
};

export default ProductCartList;
