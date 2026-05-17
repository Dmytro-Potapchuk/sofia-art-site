import React from 'react';
import { Gallery } from '../Gallery';
import { images } from '../../data/images';

const ProductCard = () => {
  return (
    <div>
      <Gallery images={images} />
    </div>
  );
};

export { ProductCard };
export { images };
