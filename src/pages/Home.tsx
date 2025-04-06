import React from 'react';
import Layout from '../layout/Layout';
import Hero from '../components/Hero';
import Fixtures from '../components/Fixtures';
import NextMatch from '../components/NextMatch';

const Home = () => (
  <Layout>
    <Hero />
    <Fixtures />
    <NextMatch />
  </Layout>
);

export default Home;