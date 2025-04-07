import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const HeaderWrapper = styled.header`
  display: grid;
  grid-template-columns: auto auto 1fr;
  align-items: center;
  justify-content: space-between;
  padding: 0.5rem 2rem;
  background-color: white;
  position: sticky;
  top: 0;
  z-index: 100;
  backdrop-filter: blur(10px);
  border-bottom: 1px solid #e0e0e0;
`;

const MobileMenuToggle = styled.button`
  display: none;
  background: none;
  border: none;
  cursor: pointer;
  z-index: 100;

  @media (max-width: 768px) {
    display: block;
  }

  span {
    display: block;
    width: 24px;
    height: 2px;
    background: black;
    margin: 5px 0;
    transition: all 0.3s ease;
  }
`;

const MobileMenu = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: white;
  z-index: 99;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2rem;
  transition: transform 0.4s ease, opacity 0.4s ease;
  transform: translateY(-100%);
  opacity: 0;
  pointer-events: none;

  &.open {
    transform: translateY(0);
    opacity: 1;
    pointer-events: auto;
  }

  a {
    font-size: 2rem;
    font-weight: 700;
    text-transform: uppercase;
    text-decoration: none;
    color: black;
  }

  @media (min-width: 769px) {
    display: none;
  }
`;

const CloseButton = styled.button`
  position: absolute;
  top: 2rem;
  right: 2rem;
  background: none;
  border: none;
  font-size: 2rem;
  cursor: pointer;
`;

const Sponsors = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;

  @media (max-width: 768px) {
    display: none;
  }

  img {
    height: 24px;
    transition: transform 0.3s ease, opacity 0.3s ease;
    opacity: 0.8;
    cursor: pointer;

    &:hover {
      transform: scale(1.05);
      opacity: 1;
    }
  }
`;

const Logo = styled.div`
  display: flex;
  justify-content: center;
  margin-right: 2rem;
  z-index: 3;

  img {
    height: 72px;
  }
`;

const Nav = styled.nav`
  display: flex;
  justify-content: flex-start;
  gap: 1rem;

  @media (max-width: 768px) {
    display: none;
  }

  a {
    position: relative;
    z-index: 2;
    color: black;
    font-size: 1.2rem;
    text-transform: uppercase;
    text-decoration: none;
    font-weight: 700;
    font-family: 'Cuprum', sans-serif;

    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: -75%;
      width: 50%;
      height: 100%;
      background: rgba(255, 255, 255, 0.3);
      transform: skewX(-20deg);
      transition: left 0.75s ease;
      z-index: 1;
      pointer-events: none;
    }

    &::after {
      content: '';
      display: block;
      position: absolute;
      left: 0;
      bottom: -6px;
      height: 2px;
      width: 100%;
      background-color: #FF1695;
      transform: scaleX(0);
      transform-origin: left;
      transition: transform 0.3s ease-in-out;
      z-index: 2;
      border-radius: 2px;
    }

    &:hover::before {
      left: 130%;
    }

    &:hover::after {
      transform: scaleX(1);
    }
  }
`;

const Header = () => {
  const [isMenuOpen, setMenuOpen] = useState(false);

  return (
    <HeaderWrapper>
      <Logo>
        <Link to="/">
          <img src="/images/logo-fayna.svg" alt="FAYNA TEAM logo" />
        </Link>
      </Logo>

      <Nav>
        <Link to="/" className="active">Головна</Link>
        <a href="#">Склад</a>
        <Link to="/fanshop">Фаншоп</Link>
        <a href="#">Матчі</a>
        <a href="#">Галерея</a>
        <a href="#">Про нас</a>
      </Nav>

      <Sponsors>
        <a href="https://tosho.agency/" target="_blank" rel="noopener noreferrer">
          <img src="/images/sponsors/logo-sponsor-tosho.svg" alt="ToSho logo" />
        </a>
        <a href="https://wookie.com.ua/ua/" target="_blank" rel="noopener noreferrer">
          <img src="/images/sponsors/logo-sponsor-wookie.svg" alt="Wookie logo" />
        </a>
        <a href="https://www.instagram.com/minimal_coffeeroom/" target="_blank" rel="noopener noreferrer">
          <img src="/images/sponsors/logo-sponsor-minimal.svg" alt="Minimal logo" />
        </a>
      </Sponsors>

      <MobileMenuToggle onClick={() => setMenuOpen(!isMenuOpen)}>
        <span />
        <span />
        <span />
      </MobileMenuToggle>

      <MobileMenu className={isMenuOpen ? 'open' : ''}>
        <CloseButton onClick={() => setMenuOpen(false)}>×</CloseButton>
        <Link to="/" onClick={() => setMenuOpen(false)}>Головна</Link>
        <a href="#">Склад</a>
        <Link to="/fanshop" onClick={() => setMenuOpen(false)}>Фаншоп</Link>
        <a href="#">Матчі</a>
        <a href="#">Галерея</a>
        <a href="#">Про нас</a>
      </MobileMenu>
    </HeaderWrapper>
  );
};

export default Header;
