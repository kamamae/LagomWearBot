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
  onTotalPriceChange: (newTotalPrice: number) => void;
}

const ProductCartList: React.FC<ProductCartListProps> = ({ url, onCartItemsChange, onTotalPriceChange }) => {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get<Product[]>(url);
        setProducts(response.data);
        calculateTotalPrice(response.data);
      } catch (error) {
        console.error('Ошибка при получении данных:', error);
      }
    };

    fetchProducts();
  }, [url]);

  const handleDeleteProduct = (productId: string, productPrice: number, productQuantity: number) => {
    const updatedProducts = products.filter((product) => product.id !== productId);
    setProducts(updatedProducts);
    onCartItemsChange(updatedProducts);
    onTotalPriceChange(-(productPrice * productQuantity));
  };

  const calculateTotalPrice = (products: Product[]) => {
    const total = products.reduce((sum, product) => sum + product.product.price * product.quantity, 0);
    onTotalPriceChange(total);
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
