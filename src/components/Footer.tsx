import React from 'react';
import styled from 'styled-components';

const FooterWrapper = styled.footer`
  background-color: #000;
  color: #fff;
  padding: 2rem 1rem;
  font-family: 'Cuprum', sans-serif;
`;

const FooterNav = styled.nav`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  justify-content: center;
  margin-bottom: 1rem;

  a {
    color: #fff;
    text-decoration: none;
    text-transform: uppercase;
    font-weight: 700;

    &:hover {
      color: #FF1695;
    }
  }
`;

const FooterContacts = styled.div`
  text-align: center;
  margin-bottom: 1rem;

  a {
    color: #FF1695;
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }
  }
`;

const FooterSponsors = styled.div`
  display: flex;
  justify-content: center;
  gap: 2rem;
  margin-bottom: 1rem;

  img {
    height: 32px;
    transition: transform 0.3s ease;

    &:hover {
      transform: scale(1.1);
    }
  }
`;

const FooterBottom = styled.div`
  text-align: center;
  font-size: 0.875rem;
  opacity: 0.7;
`;

const Footer = () => {
  return (
    <FooterWrapper>
      <FooterNav>
        <a href="/">Головна</a>
        <a href="/team">Склад</a>
        <a href="/matches">Матчі</a>
        <a href="/news">Новини</a>
        <a href="/gallery">Галерея</a>
        <a href="/about">Про нас</a>
        <a href="/fanshop">Фаншоп</a>
      </FooterNav>

      <FooterContacts>
        <p>Email: <a href="mailto:info@fayna-team.com">info@fayna-team.com</a></p>
        <p>Instagram: <a href="https://instagram.com/faynateam" target="_blank" rel="noreferrer">@faynateam</a></p>
      </FooterContacts>

      <FooterSponsors>
        <img src="/images/sponsors/logo-sponsor-tosho.svg" alt="Tosho" />
        <img src="/images/sponsors/logo-sponsor-minimal.svg" alt="Minimal" />
        <img src="/images/sponsors/logo-sponsor-wookie.svg" alt="Wookie" />
      </FooterSponsors>

      <FooterBottom>
        © 2025 FAYNA TEAM. Всі права захищено.
      </FooterBottom>
    </FooterWrapper>
  );
};

export default Footer;
