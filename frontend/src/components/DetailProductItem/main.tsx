import React, { useState, useEffect } from 'react';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import Button from '../Button/main';
import './styles.css';

const DetailProductCard = ({ product }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [selectedSize, setSelectedSize] = useState('');
  const [availableSizes, setAvailableSizes] = useState([]);

  useEffect(() => {
    setAvailableSizes(product.size);
  }, [product.size]);

  const handleSizeChange = (size) => {
    const selectedSizeObj = availableSizes.find((s) => s.name === size);

    if (!selectedSizeObj || !selectedSizeObj.in_stock) {
      return;
    }

    setSelectedSize(size);
    console.log('Выбран размер:', size);
  };

  const handleNextSlide = () => {
    if (currentSlide < product.images.length - 1) {
      setCurrentSlide(currentSlide + 1);
    }
  };

  const handlePrevSlide = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    }
  };

  return (
    <div className="product-card">
      <Carousel
        swipeable={true}
        draggable={true}
        showArrows={false}
        showStatus={false}
        showIndicators={true}
        infiniteLoop={false}
        emulateTouch={true}
        itemsToShow={1}
        showThumbs={false}
        selectedItem={currentSlide}
        onChange={setCurrentSlide}
      >
        {product.images.map((image, index) => (
          <div key={index}>
            <img src={`http://127.0.0.1:8000/media/${image.image}`} alt={product.name} />
          </div>
        ))}
      </Carousel>
      <div className="product-info">
        <div className="product-details">
          <h2 className="product-name">{product.name}</h2>
          <h2 className="product-price">{product.price} руб.</h2>
        </div>
        <div className="product-description">{product.description}</div>
        <div className="sizes">
          {availableSizes.map((size, index) => (
            <Button
              key={index}
              className={`size-button ${selectedSize === size.name ? 'selected' : ''} ${!size.in_stock ? 'out-of-stock' : ''}`}
              disabled={!size.in_stock}
              onClick={() => handleSizeChange(size.name)}
            >
              {size.name}
            </Button>
          ))}
        </div>
        <Button className="buy-button">В корзину</Button>
      </div>
    </div>
  );
};

export default DetailProductCard;