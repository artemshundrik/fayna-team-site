import React from 'react';
import Layout from '../layout/Layout';
import InstagramSection from '../components/InstagramSection';
import Hero from '../components/Hero';
import Fixtures from '../components/Fixtures';
import NextMatch from '../components/NextMatch';
import PlayersSection from '../components/PlayersSection';

const Home = () => (
  <Layout>
    <Hero />
    <Fixtures />
    <NextMatch />
    <PlayersSection />
    {/* <InstagramSection /> */}
  </Layout>
);

export default Home;