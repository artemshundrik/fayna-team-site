import React, { useState, useEffect } from 'react';
import Layout from '../layout/Layout';
import styled, { keyframes } from 'styled-components';
import { Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { supabase } from '../supabase'; // make sure this path is correct

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(24px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const AnimatedWrapper = styled.div`
  animation: ${fadeIn} 0.6s ease-out both;
`;

const StyledLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: clamp(0.75rem, 2vw, 1rem) clamp(1rem, 4vw, 2rem);
  font-size: clamp(1rem, 2vw, 1.4rem);
  text-transform: uppercase;
  font-family: 'Cuprum', sans-serif;
  text-decoration: none;
  position: relative;
  background: black;
  color: white;
  border: none;
  border-radius: 0;
  box-shadow: 0 0 12px rgba(0, 0, 0, 0.4), 0 0 24px rgba(0, 0, 0, 0.2);
  overflow: hidden;
  transition: background 0.3s;
  max-width: 320px;
  width: 100%;
  margin: 0 auto;

  &::after {
    content: "";
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(120deg, transparent, rgba(255,255,255,0.3), transparent);
    transition: all 0.75s ease;
  }

  &:hover::after {
    left: 100%;
  }

  &:hover {
    background: white;
    color: black;
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.4);
  }
`;

const PageWrapper = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
`;

const ContentWrapper = styled.div`
  flex: 1;
  background-color: #fff;
  color: #111;
  font-family: 'Cuprum', sans-serif;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 2rem;
`;

function Fanshop() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [selectedSizeIndex, setSelectedSizeIndex] = useState<number | null>(null);
  const [products, setProducts] = useState<any[]>([]);

  useEffect(() => {
    let isMounted = true;

    const fetchProducts = async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('active', true);

      if (error) {
        console.error('Error fetching products:', error);
      } else {
        console.log('Fetched products from Supabase:', data);
        if (isMounted) setProducts(data || []);
      }
    };

    fetchProducts();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <Layout>
      <ContentWrapper>
        <div style={{ maxWidth: '1280px', width: '100%', margin: '0 auto', padding: '2rem' }}>
          <h1 style={{ fontSize: '3rem', marginBottom: '2rem', textAlign: 'center' }}>FAYNA Fan Shop</h1>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '2rem'
          }}>
          {Array.isArray(products) && products.length > 0 &&
            Array.from(new Map(products.map(p => [p.id, p])).values()).map((product, i) => (
              <ProductCard
                key={product.id || i}
                index={i}
                product={product}
                isHovered={hoveredIndex === i}
                setHoveredIndex={setHoveredIndex}
                selectedSizeIndex={selectedSizeIndex}
                setSelectedSizeIndex={setSelectedSizeIndex}
              />
            ))
          }
          </div>
        </div>
      </ContentWrapper>
    </Layout>
  );
}

export default Fanshop;