// components/FiltersPanel.tsx
import React from 'react';
import { SearchFilters } from '../types/movie';

interface FiltersPanelProps {
  filters: SearchFilters;
  onChange: (filters: SearchFilters) => void;
  className?: string;
}

const FiltersPanel: React.FC<FiltersPanelProps> = ({ filters, onChange, className = '' }) => {
  const handleSortChange = (sortBy: SearchFilters['sortBy']) => {
    onChange({ ...filters, sortBy });
  };

  return (
    <div className={`filters-panel bg-gray-800 rounded-lg p-4 ${className}`}>
      <div className="flex flex-wrap items-center gap-4">
        <div>
          <label className="block text-sm text-gray-400 mb-1"><b>Sort By</b></label>
          <div className="flex space-x-2">
            <button
              onClick={() => handleSortChange('popularity.desc')}
              className={`px-3 py-1 rounded-md text-sm ${filters.sortBy === 'popularity.desc' ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
            >
              Popular
            </button>
            <button
              onClick={() => handleSortChange('vote_average.desc')}
              className={`px-3 py-1 rounded-md text-sm ${filters.sortBy === 'vote_average.desc' ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
            >
              Top Rated
            </button>
            <button
              onClick={() => handleSortChange('release_date.desc')}
              className={`px-3 py-1 rounded-md text-sm ${filters.sortBy === 'release_date.desc' ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
            >
              Newest
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FiltersPanel;