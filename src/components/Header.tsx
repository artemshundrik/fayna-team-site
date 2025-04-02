import React from 'react';
import styled from 'styled-components';

const HeaderWrapper = styled.header`
  display: grid;
  grid-template-columns: auto auto 1fr;
  align-items: center;
  padding: 0.5rem 2rem;
  background-color: white;
  position: sticky;
  top: 0;
  z-index: 100;
  backdrop-filter: blur(10px);
  border-bottom: 1px solid #e0e0e0;
`;

const Sponsors = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;

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
  return (
    <HeaderWrapper>
      <Logo>
        <a href="/">
          <img src="/images/logo-fayna.svg" alt="FAYNA TEAM logo" />
        </a>
      </Logo>
      <Nav>
        <a href="#" className="active">Головна</a>
        <a href="#">Склад</a>
        <a href="#">Матчі</a>
        <a href="#">Фаншоп</a>
        <a href="#">Галерея</a>
        <a href="#">Про нас</a>
        
      </Nav>
      <Sponsors>
        <img src="/images/sponsors/logo-sponsor-tosho.svg" alt="ToSho logo" />
        <img src="/images/sponsors/logo-sponsor-wookie.svg" alt="Wookie logo" />
        <img src="/images/sponsors/logo-sponsor-minimal.svg" alt="Minimal logo" />
      </Sponsors>
    </HeaderWrapper>
  );
};

export default Header;
