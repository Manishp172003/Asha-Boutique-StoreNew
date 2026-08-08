import { useState, useEffect } from "react";
import LazyImage from "../../../../components/common/LazyImage";
import "./ProductGallery.css";

const ProductGallery = ({ product }) => {
  const getImagesList = () => {
    if (!product || !product.imageUrl) return ['/images/product1.jpg'];
    return product.imageUrl.includes(',') ? product.imageUrl.split(',') : [product.imageUrl];
  };

  const images = getImagesList();
  const [selectedImage, setSelectedImage] = useState(images[0]);

  // Reset selected image when product changes
  useEffect(() => {
    const list = getImagesList();
    setSelectedImage(list[0]);
  }, [product.id, product.imageUrl]);

  return (

    <div className="product-gallery">

      <div className="thumbnail-column">

        {images.map((image, index) => (

          <div
            key={index}
            className={`thumbnail ${
              selectedImage === image ? "active" : ""
            }`}
            onClick={() => setSelectedImage(image)}
            role="button"
            tabIndex={0}
            aria-label={`View image ${index + 1}`}
          >

            <LazyImage
              src={image}
              alt={`Thumbnail ${index + 1}`}
              loading="lazy"
            />

          </div>

        ))}

      </div>

      <div className="main-image">

        <LazyImage
          src={selectedImage}
          alt={product.name}
          loading="eager"
        />

      </div>

    </div>

  );

};

export default ProductGallery;