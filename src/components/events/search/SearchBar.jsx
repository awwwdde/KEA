// src/components/SearchBar.js
import React from 'react';
import './searchbar.scss';
const SearchBar = ({ searchTerm, setSearchTerm }) => {
  return (
    <div className="search">
      <input
        className='search-imput'
        type="text"
        placeholder="Поиск"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
    </div>
  );
};

export default SearchBar;