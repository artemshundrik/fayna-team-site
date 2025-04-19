import React from 'react';
import { Link } from 'react-router-dom';

interface Product {
  id: string;
  type: 'simple' | 'variant';
  title: string;
  price: number;
  image_1_url: string;
  image_2_url?: string;
  sizes?: string[];
  active?: boolean;
}

interface ProductCardProps {
  index: number;
  isHovered: boolean;
  setHoveredIndex: (i: number | null) => void;
  selectedSizeIndex: number | null;
  setSelectedSizeIndex: (i: number) => void;
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({
  index,
  isHovered,
  setHoveredIndex,
  selectedSizeIndex,
  setSelectedSizeIndex,
  product
}) => {
  return (
    <>
      <div
        key={product.id}
        onMouseEnter={() => setHoveredIndex(index)}
        onMouseLeave={() => {
          setHoveredIndex(null);
          setSelectedSizeIndex(null);
        }}
        style={{
          backgroundColor: '#f9f9f9',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          transition: 'all 0.2s ease-in-out',
          border: '1px solid #eee',
          boxShadow: isHovered ? '0 2px 8px rgba(0,0,0,0.1)' : 'none',
          position: 'relative'
        }}
      >
      <div style={{ position: 'relative', width: '100%', paddingTop: '100%', overflow: 'hidden' }}>
        {!product.image_2_url ? (
          <div style={{ overflow: 'hidden', transition: 'transform 0.3s ease' }}>
            <img
              src={product.image_1_url}
              alt={product.title}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                objectFit: 'contain',
                transition: 'opacity 0.4s ease, transform 0.3s ease',
                opacity: 1,
                transform: isHovered ? 'scale(1.05)' : 'scale(1)',
              }}
            />
          </div>
        ) : (
          <>
            <div style={{ overflow: 'hidden', transition: 'transform 0.3s ease' }}>
              <img
                src={product.image_1_url}
                alt={product.title}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  objectFit: 'contain',
                  transition: 'opacity 0.4s ease, transform 0.3s ease',
                  opacity: isHovered ? 0 : 1,
                  transform: isHovered ? 'scale(1.05)' : 'scale(1)',
                }}
              />
            </div>
            <div style={{ overflow: 'hidden', transition: 'transform 0.3s ease' }}>
              <img
                src={product.image_2_url}
                alt={product.title}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  objectFit: 'contain',
                  transition: 'opacity 0.4s ease, transform 0.3s ease',
                  opacity: isHovered ? 1 : 0,
                  transform: isHovered ? 'scale(1.05)' : 'scale(1)',
                }}
              />
            </div>
          </>
        )}
        {product.type === 'simple' && (
          <div
            style={{
              position: 'absolute',
              left: 0,
              right: 0,
              bottom: 0,
              height: isHovered ? '80px' : '2px',
              transform: isHovered ? 'translateY(0)' : 'translateY(100%)',
              opacity: isHovered ? 1 : 0,
              pointerEvents: isHovered ? 'auto' : 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backdropFilter: 'blur(8px)',
              background: 'rgba(255, 255, 255, 0.3)',
              transition: 'opacity 0.4s ease, transform 0.4s ease, height 0.4s ease'
            }}
          >
            <Link to="/" className="order-button">
              Замовити
            </Link>
          </div>
        )}
        {product.type === 'variant' && (
          <div
            style={{
              position: 'absolute',
              left: 0,
              right: 0,
              bottom: 0,
              height: '80px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backdropFilter: 'blur(8px)',
              background: 'rgba(255, 255, 255, 0.3)',
              transition: 'opacity 0.4s ease, transform 0.4s ease, visibility 0.4s ease',
              opacity: isHovered && selectedSizeIndex !== index ? 1 : 0,
              transform: isHovered && selectedSizeIndex !== index ? 'translateY(0)' : 'translateY(100%)',
              visibility: isHovered && selectedSizeIndex !== index ? 'visible' : 'hidden'
            }}
          >
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              {Array.isArray(product.sizes) && product.sizes.map((size, j) => (
                <button
                  key={j}
                  onClick={() => setSelectedSizeIndex(index)}
                  className={`size-button ${selectedSizeIndex === index ? 'selected' : ''}`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>
        )}

        <div
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            bottom: 0,
            height: '80px',
            display: 'flex',
            visibility: selectedSizeIndex === index ? 'visible' : 'hidden',
            alignItems: 'center',
            justifyContent: 'center',
            backdropFilter: 'blur(8px)',
            background: 'rgba(255, 255, 255, 0.3)',
            transition: 'opacity 0.4s ease, transform 0.4s ease, visibility 0.4s ease',
            opacity: selectedSizeIndex === index ? 1 : 0,
            transform: selectedSizeIndex === index ? 'translateY(0)' : 'translateY(100%)'
          }}
        >
          <Link
            to="/"
            className="order-button"
          >
            Замовити
          </Link>
        </div>
      </div>
      <div style={{ padding: '0.5rem 1rem 0.75rem', textAlign: 'left' }}>
        <p style={{ fontWeight: 700, fontSize: '1.2rem', marginBottom: '0.5rem' }}>
          {product.price?.toLocaleString('uk-UA') ?? '–––'} грн
        </p>
                <p style={{ fontSize: '1rem', color: '#333', margin: 0 }}>
          {product.title ?? 'Назва товару'}
        </p>
      </div>
      </div>
      <style>{`
        .order-button {
          display: inline-block;
          background: #000;
          color: #fff;
          padding: 0.6rem 1.5rem;
          font-weight: 600;
          text-decoration: none;
          border-radius: 0;
          text-transform: uppercase;
          transition: background 0.3s ease;
        }
        .order-button:hover {
          background: #222;
        }

        .size-button {
          padding: 0.4rem 1rem;
          border: 1px solid #000;
          background: transparent;
          color: #000;
          cursor: pointer;
          text-transform: uppercase;
          font-weight: 600;
          transition: all 0.2s ease;
        }
        .size-button:hover {
          background: #000;
          color: #fff;
        }
        .size-button.selected {
          background: #000;
          color: #fff;
        }
      `}</style>
    </>
  );
};

export default ProductCard;