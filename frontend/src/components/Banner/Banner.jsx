import React, { useState, useEffect, useCallback } from 'react';
import './Banner.css';
import assets from '../../assets/assets.js';

const Banner = () => {
  const bannerData = [
    { image: assets.banner_1, title: "Món ngon mỗi ngày", description: "Khám phá các món ăn đặc biệt", link: 'https://cook-and-carry.vercel.app/detail/67b8a9e166a57572511a47f1' },
    { image: assets.banner_2, title: "Ẩm thực đa dạng", description: "Hương vị độc đáo từ nhiều vùng miền", link: '#' },
    { image: assets.banner_3, title: "Tươi ngon mỗi ngày", description: "Chất lượng làm nên thương hiệu", link: '#' },
    { image: assets.banner_4, title: "Đặt hàng dễ dàng", description: "Giao hàng nhanh chóng", link: '#' },
  ];

  const [currentSlide, setCurrentSlide] = useState(0);
  const totalSlides = bannerData.length;

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
  }, [totalSlides]);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
  }, [totalSlides]);

  useEffect(() => {
    const intervalId = setInterval(nextSlide, 5000);
    return () => clearInterval(intervalId);
  }, [nextSlide]);

  const handleDotClick = (index) => setCurrentSlide(index);

  const handleBannerClick = () => {
    const url = bannerData[currentSlide].link;
    if (url && url !== '#') window.open(url, '_blank');
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowLeft') prevSlide();
      if (e.key === 'ArrowRight') nextSlide();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [nextSlide, prevSlide]);

  return (
    <div className="banner-container">
      <div className="banner-slider" style={{ transform: `translateX(-${currentSlide * 100}%)` }}>
        {bannerData.map((item, index) => (
          <div key={index} className="banner-slide" onClick={handleBannerClick}>
            <img src={item.image} alt={item.title} />
            <div className="banner-content">
              <h2>{item.title}</h2>
              <p>{item.description}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="banner-nav banner-nav-prev" onClick={prevSlide}>&#10094;</div>
      <div className="banner-nav banner-nav-next" onClick={nextSlide}>&#10095;</div>
      <div className="banner-dots">
        {bannerData.map((_, index) => (
          <span key={index} className={`banner-dot ${index === currentSlide ? 'active' : ''}`} onClick={() => handleDotClick(index)}></span>
        ))}
      </div>
    </div>
  );
};

export default Banner;
