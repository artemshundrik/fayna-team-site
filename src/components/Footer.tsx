import React from 'react';
import styled from 'styled-components';
import { MapPin, Phone, Mail, Instagram, Youtube } from "lucide-react";

const FooterWrapper = styled.footer`
  background-color: #000;
  color: #fff;
  padding: 2rem 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;
  font-family: 'Cuprum', sans-serif;

  a {
    color: #fff;
    text-decoration: none;
    transition: color 0.3s ease;

    &:hover {
      color: #FF1695;
      text-decoration: underline;
    }
  }
`;

const FooterNav = styled.nav`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  justify-content: center;
  margin-bottom: 1rem;
  flex-direction: column;
  align-items: center;
  text-align: center;

  a {
    font-weight: 700;
  }
`;

const FooterContacts = styled.div`
  text-align: center;

  p {
    margin: 0.25rem 0;
  }

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
  flex-wrap: wrap;
  gap: 2rem;
  margin-bottom: 1rem;
  max-width: 300px;

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
  max-width: 90%;
  line-height: 1.5;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  margin-top: 2rem;
`;

const Footer = () => {
  return (
    <FooterWrapper>
      <div style={{
        background: 'linear-gradient(90deg, #111 0%, #000 100%)',
        padding: '1.5rem 0',
        width: '100%'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '3rem',
          flexWrap: 'wrap',
          maxWidth: '1200px',
          margin: '0 auto'
        }}>
          <a href="https://wookie.com.ua/ua/" target="_blank" rel="noopener noreferrer">
            <img src="/images/sponsors/logo-sponsor-wookie-white.svg" alt="Wookie" height="32" style={{ opacity: 0.8, transition: 'opacity 0.3s' }} onMouseOver={(e) => e.currentTarget.style.opacity = '1'} onMouseOut={(e) => e.currentTarget.style.opacity = '0.8'} />
          </a>
          <a href="https://minimal_coffeeroom/" target="_blank" rel="noopener noreferrer">
            <img src="/images/sponsors/logo-sponsor-minimal-white.svg" alt="Minimal" height="32" style={{ opacity: 0.8, transition: 'opacity 0.3s' }} onMouseOver={(e) => e.currentTarget.style.opacity = '1'} onMouseOut={(e) => e.currentTarget.style.opacity = '0.8'} />
          </a>
          <a href="https://tosho.agency/" target="_blank" rel="noopener noreferrer">
            <img src="/images/sponsors/logo-sponsor-tosho-white.svg" alt="Tosho" height="32" style={{ opacity: 0.8, transition: 'opacity 0.3s' }} onMouseOver={(e) => e.currentTarget.style.opacity = '1'} onMouseOut={(e) => e.currentTarget.style.opacity = '0.8'} />
          </a>
        </div>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '2rem',
        width: '100%',
        maxWidth: '1200px',
        padding: '2rem 1rem'
      }}>
        <div>
          <h4 style={{ textTransform: 'uppercase', fontSize: '1.25rem', marginBottom: '1rem' }}>Швидкі посилання</h4>
          <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <a href="/">Головна</a>
            <a href="/calendar">Календар</a>
            <a href="/team">Гравці</a>
            <a href="/fanshop">Фан-шоп</a>
            <a href="/news">Новини</a>
          </nav>
        </div>

        <div>
          <h4 style={{ textTransform: 'uppercase', fontSize: '1.25rem', marginBottom: '1rem' }}>Контакти</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <MapPin size={18} />
              вул. Спортивна 123, Київ, Україна, 01001
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Phone size={18} />
              +380 44 123 4567
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Mail size={18} />
              <a href="mailto:info@faynateam.com">info@faynateam.com</a>
            </div>
          </div>
        </div>

        <div style={{ alignSelf: 'start', display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start', textAlign: 'left' }}>
          <img src="/images/logo-fayna-full-white.svg" alt="FAYNA TEAM" height="48" />
          <p style={{ marginTop: '1rem' }}>Засновано 2024. Віддані досконалості у футзалі.</p>
          <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
            <a href="https://www.instagram.com/fc_fayna_team/?igsh=MWx4eXRlMW54NWR2eg%3D%3D&utm_source=qr#" target="_blank" rel="noopener noreferrer">
              <Instagram size={28} strokeWidth={1.5} />
            </a>
            <a href="https://www.youtube.com/@FCFAYNATEAM" target="_blank" rel="noopener noreferrer">
              <Youtube size={28} strokeWidth={1.5} />
            </a>
          </div>
        </div>
      </div>

      <FooterBottom>
        <p>© 2025 Fayna Team. Всі права захищені.</p>
      </FooterBottom>
    </FooterWrapper>
  );
};

export default Footer;
