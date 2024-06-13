import React, { useState, useEffect } from 'react';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import Button from '../Button/main';
import './styles.css';
import { apiBaseUrl } from '../../constants/base-url';

interface Size {
  id: number;
  name: string;
  in_stock: boolean;
}

interface Image {
  image: string;
}

interface Product {
  name: string;
  price: number;
  description: string;
  size: Size[];
  images: Image[];
}

interface DetailProductCardProps {
  product: Product;
  onSizeChange: (size: number) => void;
}

const DetailProductCard: React.FC<DetailProductCardProps> = ({ product, onSizeChange }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [selectedSize, setSelectedSize] = useState<Size | null>(null);
  const [availableSizes, setAvailableSizes] = useState<Size[]>([]);

  useEffect(() => {
    setAvailableSizes(product.size);
  }, [product.size]);

  const handleSizeChange = (size: Size) => {
    if (!size.in_stock) {
      return;
    }

    setSelectedSize(size);
    console.log('Выбран размер:', size.name, 'с ID:', size.id);
    onSizeChange(size.id);
  };

  return (
    <div className="detail-product-card">
      <div className="carousel-wrapper">
        <Carousel
          swipeable={true}
          showArrows={false}
          showStatus={false}
          showIndicators={true}
          infiniteLoop={false}
          emulateTouch={true}
          showThumbs={false}
          selectedItem={currentSlide}
          onChange={setCurrentSlide}
        >
          {product.images.map((image, index) => (
            <div key={index}>
              <img
                src={`${apiBaseUrl}/media/${image.image}`}
                alt={product.name}
                style={{ width: '100%' }}
              />
            </div>
          ))}
        </Carousel>
      </div>
      <div className="product-info">
        <h2 className="product-name">{product.name}</h2>
        <h2 className="product-price">{product.price}руб</h2>
        <div className="product-description">{product.description}</div>
        <div className="sizes">
          {availableSizes.map((size, index) => (
            <Button
              key={index}
              className={`size-button ${
                selectedSize?.id === size.id ? 'selected' : ''
              } ${!size.in_stock ? 'out-of-stock' : ''}`}
              disabled={!size.in_stock}
              onClick={() => handleSizeChange(size)}
            >
              {size.name}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DetailProductCard;