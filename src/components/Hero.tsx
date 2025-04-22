import React from 'react';
import styled from 'styled-components';
// import Button from '@mui/material/Button';

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
  overflow: hidden;
  border-radius: 0px;

  @media (max-width: 768px) {
    height: 90vh;
    padding-bottom: 4rem;
  }

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background-image: inherit;
    background-size: cover;
    background-position: center;
    transform: scale(1.1) translateY(-2%);
    will-change: transform;
    z-index: 0;
    transition: transform 1.5s ease;
    animation: zoomOut 1.5s ease forwards;
    border-radius: 0px;
  }
`;

const Overlay = styled.div`
  position: absolute;
  inset: 0;
  background: linear-gradient(to bottom, rgba(0, 0, 0, 0.2) 0%, rgba(0, 0, 0, 0.85) 100%);
  z-index: 1;
  backdrop-filter: blur(2px);
  -webkit-backdrop-filter: blur(2px);
  mask-image: linear-gradient(to bottom, transparent 0%, black 70%, black 100%);
  -webkit-mask-image: linear-gradient(to bottom, transparent 0%, black 70%, black 100%);
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
  max-width: 256px;
  width: 90%;
  height: auto;
  margin: 0 auto 3rem;
  display: block;
  img {
    width: 100%;
    height: auto;
  }
`;

// const Buttons = styled.div`
//   opacity: 0;
//   transform: translateY(40px);
//   animation: fadeInUp 1s ease-out 0.6s forwards;
//   display: flex;
//   justify-content: center;
//   gap: 2rem;
//   flex-direction: row-reverse;
// `;

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
        {/* <Buttons>
          <Button href="#matches" variant="contained" size="large" color="primary">
            Дивитись матчі
          </Button>
          <Button href="#players" variant="outlined" size="large" color="secondary">
            Склад команди
          </Button>
        </Buttons> */}
        <Social>
        <SocialBox href="https://www.youtube.com/@FCFAYNATEAM" target="_blank" rel="noopener noreferrer">
            <img src="/images/icons/youtube-default.svg" className="default" alt="YouTube" />
            <img src="/images/icons/youtube-hover.svg" className="hover" alt="YouTube" />
          </SocialBox>
          <Divider />
          <SocialBox href="https://www.instagram.com/fc_fayna_team/?igsh=MWx4eXRlMW54NWR2eg%3D%3D&utm_source=qr#" target="_blank" rel="noopener noreferrer">
            <img src="/images/icons/instagram-default.svg" className="default" alt="Instagram" />
            <img src="/images/icons/instagram-hover.svg" className="hover" alt="Instagram" />
          </SocialBox>
        </Social>
      </Content>
    </Section>
  );
};

export default Hero;
