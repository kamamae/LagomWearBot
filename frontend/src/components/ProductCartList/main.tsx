import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ProductCart from '../ProductItemCart/main';
import './styles.css';

interface Product {
  id: string;
  product: {
    name: string;
    price: number;
    images: { image: string }[];
  };
  product_size: { size_name: string };
  quantity: number;
}

interface ProductCartListProps {
  url: string;
  onCartItemsChange: (updatedCartItems: Product[]) => void;
}

const ProductCartList: React.FC<ProductCartListProps> = ({ url, onCartItemsChange }) => {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get<Product[]>(url);
        setProducts(response.data);
      } catch (error) {
        console.error('Ошибка при получении данных:', error);
      }
    };

    fetchProducts();
  }, [url]);

  const handleDeleteProduct = (productId: string) => {
    const updatedProducts = products.map((product) =>
      product.id === productId ? { ...product, quantity: 0 } : product
    ).filter((product) => product.id !== productId);
    setProducts(updatedProducts);
    onCartItemsChange(updatedProducts);
  };

  return (
    <div className="cart-list">
      {products.map((item) => (
        <ProductCart
          key={item.id}
          product={item}
          onCartItemsChange={onCartItemsChange}
          onDeleteProduct={handleDeleteProduct}
        />
      ))}
    </div>
  );
};

export default ProductCartList;
