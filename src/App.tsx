import React from 'react';
import { Route, Routes } from 'react-router-dom';
import './App.css';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { Home } from './pages/Home';
import { ProductDetailsPage } from './pages/ProductDetailsPage';
import { ScrollToHash } from './components/ScrollToHash/ScrollToHash';

const App = () => (
  <div className="app">
    <ScrollToHash />
    <Header />
    <main className="app__main">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/image/:id" element={<ProductDetailsPage />} />
      </Routes>
    </main>
    <Footer />
  </div>
);

export { App };
