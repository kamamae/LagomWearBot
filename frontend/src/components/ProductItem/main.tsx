import Button from '../Button/main';
import './styles.css';
import { Link } from 'react-router-dom';

import getCurrentTheme from '../../hooks/theme';


const ProductCard = ({ product }: { product: { id: number, name: string, price: number, image: string, images: { image: string }[] } }) => {
  const { id, name, price } = product;
  const firstImage = `http://127.0.0.1:8000/media/${product.images[0].image}`;

  const currentTheme = getCurrentTheme();

  if (currentTheme === 'dark') {
    document.documentElement.style.setProperty('--card-bg-color', '#282828');
    document.documentElement.style.setProperty('--card-text-color', '#ffffff');
  } else {
    document.documentElement.style.setProperty('--card-bg-color', '#F2F2F2');
    document.documentElement.style.setProperty('--card-text-color', '#555555');
  }
  return (
    <div className="product-card">
      <img src={firstImage} alt='foto' className="product-image" />
      <h2 className="product-name">{name}</h2>
      <p className="product-price">{price} ₽</p>
      <Link to={`/products/${id}`} >
        <Button className="open-detail-screen">Добавить</Button>
      </Link>
    </div>
  );
};

export default ProductCard;