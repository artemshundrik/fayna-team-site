import React from 'react';
import Header from '../components/Header';
import styled, { keyframes } from 'styled-components';
import { Link } from 'react-router-dom';

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

export default function NotFound() {
  return (
    <PageWrapper>
      <Header />
      <ContentWrapper>
        <div style={{ maxWidth: '600px', width: '100%' }}>
          <AnimatedWrapper>
            <div style={{ fontSize: '8rem', marginBottom: '1rem' }}>🚫</div>
            <h1 style={{ marginBottom: '0.5rem' }}>Сторінку не знайдено</h1>
            <p style={{ fontSize: '1.5rem', marginTop: '0' }}>Ой! Схоже ця сторінка відправлена у аут.</p>
            <StyledLink to="/">Повернутись на головну</StyledLink>
          </AnimatedWrapper>
        </div>
      </ContentWrapper>
    </PageWrapper>
  );
}