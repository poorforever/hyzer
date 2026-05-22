import React, { useState } from 'react';
import { FiSearch } from 'react-icons/fi';
import './Home.css';

const Home: React.FC = () => {
  const [query, setQuery] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  return (
    <div className="home">
      <div className="home-center">
        <h2 className="home-greeting">What can I help with?</h2>
        <form className="search-form" onSubmit={handleSubmit}>
          <div className="search-bar">
            <FiSearch className="search-icon" />
            <input
              type="text"
              className="search-input"
              placeholder="Ask anything..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
        </form>
      </div>
    </div>
  );
};

export default Home;
