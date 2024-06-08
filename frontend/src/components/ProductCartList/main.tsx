import { useState, useEffect, memo } from 'react';
import axios from 'axios';
import ProductCart from '../ProductItemCart/main';
import './styles.css';




const ProductCartList = memo(({ url }: any) => {
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
    }, []);

  return (
    <div className="cart-list">
      {products.map((item) => (
        <ProductCart key={item.id} product={item} />
              ))}
    </div>
  );
});

export default ProductCartList;
