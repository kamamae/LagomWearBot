import React, { useState } from 'react';
import ProductItem from '../ProductItem/main';
import { useTelegram } from '../../hooks/useTelegram';

interface Product {
  id: string;
  title: string;
  price: number;
  description: string;
}

const products: Product[] = [
  { id: '1', title: 'Лонгсливы', price: 5000, description: 'blue' },
  { id: '2', title: 'Лонгсливы', price: 5000, description: 'white' }
];

const ProductList: React.FC = () => {
  const { tg } = useTelegram();
  const [addedItems, setAddedItems] = useState<Product[]>([]);

  const onAdd = (product: Product) => {
    const alreadyAdded = addedItems.find(item => item.id === product.id);
    let newItems: Product[] = [];

    if (alreadyAdded) {
      newItems = addedItems.filter(item => item.id !== product.id);
    } else {
      newItems = [...addedItems, product];
    }
    setAddedItems(newItems);
  };

  return (
    <div className="list">
      {products.map(item => (
        <ProductItem
          key={item.id}
          product={item}
          onAdd={onAdd}
          className="item"
        />
      ))}
    </div>
  );
};

export default ProductList;