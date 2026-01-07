// components/ProductFilters.jsx
import React, { useState, useEffect } from 'react';
import { FaSearch, FaTimes, FaFilter, FaSortAmountDown } from 'react-icons/fa';

const ProductFilters = ({ 
  products = [], 
  onFilterChange = () => {},
  activeFilters = {},
  onClearFilters = () => {}
}) => {
  // Ensure products is always an array
  const safeProducts = Array.isArray(products) ? products : [];
  const [searchTerm, setSearchTerm] = useState(activeFilters.search || '');
  const [selectedCategory, setSelectedCategory] = useState(activeFilters.category || '');
  const [priceRange, setPriceRange] = useState({
    min: activeFilters.priceMin || '',
    max: activeFilters.priceMax || ''
  });
  const [sortBy, setSortBy] = useState(activeFilters.sortBy || 'newest');
  const [showFilters, setShowFilters] = useState(false);

  // Extract unique categories from products
  const categories = [...new Set(
    safeProducts
      .map(product => product.category)
      .filter(Boolean)
      .map(category => typeof category === 'string' ? category : String(category))
      .filter(category => category && category !== 'undefined' && category !== 'null')
  )];
  
  // Price range calculations
  const prices = safeProducts
    .map(p => p.price)
    .filter(price => price != null && !isNaN(price) && price > 0);
  const minPrice = prices.length > 0 ? Math.min(...prices) : 0;
  const maxPrice = prices.length > 0 ? Math.max(...prices) : 1000;

  // Handle filter changes
  useEffect(() => {
    const filters = {
      search: searchTerm,
      category: selectedCategory,
      priceMin: priceRange.min,
      priceMax: priceRange.max,
      sortBy: sortBy
    };
    onFilterChange(filters);
  }, [searchTerm, selectedCategory, priceRange, sortBy, onFilterChange]);

  const handlePriceChange = (type, value) => {
    setPriceRange(prev => ({
      ...prev,
      [type]: value
    }));
  };

  const clearAllFilters = () => {
    setSearchTerm('');
    setSelectedCategory('');
    setPriceRange({ min: '', max: '' });
    setSortBy('newest');
    onClearFilters();
  };

  const activeFilterCount = Object.values(activeFilters).filter(value => 
    value !== '' && value !== undefined
  ).length;

  return (
    <div className="product-filters">
      {/* Search Bar */}
      <div className="search-section">
        <div className="search-input-wrapper">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
            id="product-search"
            name="productSearch"
            aria-label="Search products"
          />
          {searchTerm && (
            <button 
              onClick={() => setSearchTerm('')}
              className="clear-search-btn"
              aria-label="Clear search"
            >
              <FaTimes />
            </button>
          )}
        </div>
      </div>

      {/* Filter Toggle Button */}
      <div className="filter-controls">
        <button 
          onClick={() => setShowFilters(!showFilters)}
          className="filter-toggle-btn"
        >
          <FaFilter />
          Filters
          {activeFilterCount > 0 && (
            <span className="filter-count">{activeFilterCount}</span>
          )}
        </button>

        {/* Sort Dropdown */}
        <div className="sort-section">
          <FaSortAmountDown className="sort-icon" />
          <select 
            value={sortBy} 
            onChange={(e) => setSortBy(e.target.value)}
            className="sort-select"
            aria-label="Sort products by"
            id="sort-select"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="name-asc">Name: A to Z</option>
            <option value="name-desc">Name: Z to A</option>
          </select>
        </div>
      </div>

      {/* Expandable Filter Panel */}
      {showFilters && (
        <div className="filter-panel">
          <div className="filter-panel-content">
            
            {/* Category Filter */}
            <div className="filter-group">
              <label className="filter-label">Category</label>
              <select 
                value={selectedCategory} 
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="filter-select"
                aria-label="Filter products by category"
                id="category-filter"
              >
                <option value="">All Categories</option>
                {categories.map((category, index) => {
                  const categoryKey = `category-${category}-${index}`;
                  const categoryValue = String(category);
                  return (
                    <option key={categoryKey} value={categoryValue}>
                      {categoryValue}
                    </option>
                  );
                })}
              </select>
            </div>

            {/* Price Range Filter */}
            <div className="filter-group">
              <label className="filter-label">Price Range</label>
              <div className="price-range-inputs">
                <input
                  type="number"
                  placeholder={`Min ($${minPrice})`}
                  value={priceRange.min}
                  onChange={(e) => handlePriceChange('min', e.target.value)}
                  className="price-input"
                  min={minPrice}
                  max={maxPrice}
                  id="price-min"
                  name="priceMin"
                  aria-label="Minimum price"
                />
                <span className="price-separator">to</span>
                <input
                  type="number"
                  placeholder={`Max ($${maxPrice})`}
                  value={priceRange.max}
                  onChange={(e) => handlePriceChange('max', e.target.value)}
                  className="price-input"
                  min={minPrice}
                  max={maxPrice}
                  id="price-max"
                  name="priceMax"
                  aria-label="Maximum price"
                />
              </div>
            </div>

            {/* Clear Filters */}
            <div className="filter-actions">
              <button 
                onClick={clearAllFilters}
                className="clear-filters-btn"
                disabled={activeFilterCount === 0}
              >
                Clear All Filters
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Active Filters Display */}
      {activeFilterCount > 0 && (
        <div className="active-filters">
          <span className="active-filters-label">Active filters:</span>
          <div className="active-filter-tags">
            {searchTerm && (
              <span className="filter-tag">
                Search: "{searchTerm}"
                <button onClick={() => setSearchTerm('')}>
                  <FaTimes />
                </button>
              </span>
            )}
            {selectedCategory && (
              <span className="filter-tag">
                Category: {selectedCategory}
                <button onClick={() => setSelectedCategory('')}>
                  <FaTimes />
                </button>
              </span>
            )}
            {priceRange.min && (
              <span className="filter-tag">
                Min: ${priceRange.min}
                <button onClick={() => handlePriceChange('min', '')}>
                  <FaTimes />
                </button>
              </span>
            )}
            {priceRange.max && (
              <span className="filter-tag">
                Max: ${priceRange.max}
                <button onClick={() => handlePriceChange('max', '')}>
                  <FaTimes />
                </button>
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductFilters;