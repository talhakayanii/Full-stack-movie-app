import React, { useState, useCallback, useRef, useEffect } from 'react';

interface SearchBarProps {
  onSearch: (query: string) => void;
  placeholder?: string;
  className?: string;
  debounceMs?: number;
  initialValue?: string;
  autoFocus?: boolean;
}

const SearchBar: React.FC<SearchBarProps> = ({
  onSearch,
  placeholder = 'Search movies...',
  className = '',
  debounceMs = 300,
  initialValue = '',
  autoFocus = false
}) => {
  const [query, setQuery] = useState(initialValue);
  const [isFocused, setIsFocused] = useState(false);
  const [isMac, setIsMac] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceTimeout = useRef<NodeJS.Timeout | null>(null);

  // Detect OS for keyboard shortcut display
  useEffect(() => {
    setIsMac(navigator.userAgent.includes('Mac'));
  }, []);

  // Handle search with debouncing
  const handleSearch = useCallback((searchQuery: string) => {
    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }

    debounceTimeout.current = setTimeout(() => {
      onSearch(searchQuery.trim());
    }, debounceMs);
  }, [onSearch, debounceMs]);

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    handleSearch(value);
  };

  // Handle clear button
  const handleClear = useCallback(() => {
    setQuery('');
    onSearch('');
    inputRef.current?.focus();
  }, [onSearch]);

  // Handle form submission (Enter key)
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }
    onSearch(query.trim());
  };

  // Keyboard shortcuts - simple implementation without external library
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (debounceTimeout.current) {
        clearTimeout(debounceTimeout.current);
      }
    };
  }, []);

  // Handle initial value changes
  useEffect(() => {
    setQuery(initialValue);
  }, [initialValue]);

  // Handle focus with delay to prevent immediate blur
  const handleFocus = () => {
    setIsFocused(true);
  };

  // Handle blur with delay to allow clear button click
  const handleBlur = () => {
    setTimeout(() => {
      setIsFocused(false);
    }, 150);
  };

  return (
    <div className={`search-bar-container ${className}`}>
      <div className="search-bar-wrapper">
        <form onSubmit={handleSubmit}>
          <div className={`search-input-container ${isFocused ? 'focused' : ''} ${query ? 'has-content' : ''}`}>
            {/* Search Icon */}
            <div className="search-icon">
              <svg 
                className="search-icon-svg"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" 
                />
              </svg>
            </div>

            {/* Input field */}
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={handleInputChange}
              onFocus={handleFocus}
              onBlur={handleBlur}
              placeholder={placeholder}
              autoFocus={autoFocus}
              className="search-input"
              aria-label="Search movies"
            />

            {/* Clear button */}
            {query && (
              <button
                type="button"
                onClick={handleClear}
                className="clear-button"
                aria-label="Clear search"
              >
                <svg 
                  className="clear-icon"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M6 18L18 6M6 6l12 12" 
                  />
                </svg>
              </button>
            )}

            {/* Keyboard hint */}
            {!isFocused && !query && (
              <div className="keyboard-hint">
                <kbd className="kbd-shortcut">
                  {isMac ? '⌘' : 'Ctrl'} K
                </kbd>
              </div>
            )}
          </div>
        </form>

        
      </div>
    </div>
  );
};

export default React.memo(SearchBar);