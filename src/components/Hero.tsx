import React from 'react';
import styled from 'styled-components';

const Section = styled.section`
  position: relative;
  height: 100svh;
  box-sizing: border-box;
  background-image: url('/images/hero-team-photo.webp');
  background-size: cover;
  background-position: center;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  padding: 0 1rem 6rem;

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background-image: inherit;
    background-size: cover;
    background-position: center;
    transform: scale(1.1);
    z-index: 0;
    transition: transform 1.5s ease;
    animation: zoomOut 1.5s ease forwards;
  }
`;

const Overlay = styled.div`
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  z-index: 1;
`;

const Content = styled.div`
  position: relative;
  text-align: center;
  z-index: 10;
  opacity: 0;
  animation: fadeInUp 1s ease-out 0.3s forwards;
  margin-bottom: 2rem;
`;

const Logo = styled.div`
  max-width: 320px;
  width: 90%;
  height: auto;
  margin: 0 auto 3rem;
  display: block;
  img {
    width: 100%;
    height: auto;
  }
`;

const Buttons = styled.div`
  opacity: 0;
  transform: translateY(40px);
  animation: fadeInUp 1s ease-out 0.6s forwards;
  display: flex;
  justify-content: center;
  gap: 2rem;
  flex-direction: row-reverse;

  a.btn {
    padding: clamp(0.75rem, 2vw, 1rem) clamp(1rem, 4vw, 2rem);
    font-size: clamp(1rem, 2vw, 1.4rem);
    text-transform: uppercase;
    font-family: 'Cuprum', sans-serif;
    text-decoration: none;
  }

  a.btn-primary {
    position: relative;
    background: linear-gradient(135deg, #FF1695, #ff6ac1);
    color: white;
    border: none;
    box-shadow: 0 0 12px rgba(255, 22, 149, 0.5), 0 0 24px rgba(255, 22, 149, 0.3);
    overflow: hidden;
    display: inline-flex;
    align-items: center;
    justify-content: center;
  }

  a.btn-primary::after {
    content: "";
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(120deg, transparent, rgba(255,255,255,0.4), transparent);
    transition: all 0.75s ease;
  }

  a.btn-primary:hover::after {
    left: 100%;
  }

  a.btn-primary:hover {
    background: white;
    color: #FF1695;
    box-shadow: 0 6px 16px rgba(255, 22, 149, 0.5);
  }

  a.btn-secondary {
    background: rgba(255, 255, 255, 0.1);
    color: white;
    border: 2px solid rgba(255, 255, 255, 0.3);
    backdrop-filter: blur(6px);
    position: relative;
    overflow: hidden;
  }

  a.btn-secondary::after {
    content: "";
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(120deg, transparent, rgba(255,255,255,0.4), transparent);
    transition: all 0.75s ease;
    pointer-events: none;
  }

  a.btn-secondary:hover::after {
    left: 100%;
  }

  a.btn-secondary:hover {
    background: white;
    color: black;
  }
`;

const Social = styled.div`
  margin-top: 3rem;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 3rem;
  opacity: 0;
  transform: translateY(40px);
  animation: fadeInUp 1s ease-out 0.9s forwards;
`;

const Divider = styled.div`
  width: 1px;
  height: 60px;
  background-color: rgba(255, 255, 255, 0.4);
`;

const SocialBox = styled.a<{ $bigger?: boolean }>`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 54px;

  img {
    height: auto;
    max-height: ${(props) => (props.$bigger ? '72px' : '64px')};
    max-width: ${(props) => (props.$bigger ? '180px' : '160px')};
    transition: opacity 0.3s ease, transform 0.6s ease;
    display: block;
    margin: 0 auto;
  }

  &:hover img {
    transform: scale(1.08);
  }

  &:hover img.hover {
    transform: none;
  }

  img.hover {
    display: none;
  }

  &:hover img.default {
    display: none;
  }

  &:hover img.hover {
    display: inline;
  }
`;

const Hero: React.FC = () => {
  return (
    <Section>
      <Overlay />
      <Content>
        <Logo>
          <img src="/images/logo-hero-fayna.svg" alt="FAYNA TEAM" />
        </Logo>
        <Buttons>
          <a href="#matches" className="btn btn-primary">Дивитись матчі</a>
          <a href="#players" className="btn btn-secondary">Склад команди</a>
        </Buttons>
        <Social>
          <SocialBox href="https://youtube.com" target="_blank" rel="noopener noreferrer">
            <img src="/images/icons/youtube-default.svg" className="default" alt="YouTube" />
            <img src="/images/icons/youtube-hover.svg" className="hover" alt="YouTube" />
          </SocialBox>
          <Divider />
          <SocialBox href="https://instagram.com/faynateam" target="_blank" rel="noopener noreferrer" $bigger>
            <img src="/images/icons/instagram-default.svg" className="default" alt="Instagram" />
            <img src="/images/icons/instagram-hover.svg" className="hover" alt="Instagram" />
          </SocialBox>
        </Social>
      </Content>
    </Section>
  );
};

export default Hero;
