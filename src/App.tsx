import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Placeholder from './pages/Placeholder';
import Profile from './pages/Profile';
import './App.css';

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <div className="app-layout">
        <Header />
        <div className="app-body">
          <Sidebar />
          <main className="main-content">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/messages" element={<Placeholder title="Messages" />} />
              <Route path="/analytics" element={<Placeholder title="Analytics" />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/settings" element={<Placeholder title="Settings" />} />
            </Routes>
          </main>
        </div>
        <Footer />
      </div>
    </BrowserRouter>
  );
};

export default App;
