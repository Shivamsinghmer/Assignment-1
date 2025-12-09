import React from 'react';

export default function FilterBar({ filters, onFilterChange, onClearCache, loading }) {
  return (
    <div className="filter-bar glass-card" style={styles.filterBar}>
      <div className="filter-group" style={styles.filterGroup}>
        <label htmlFor="userId" style={styles.label}>User ID</label>
        <input
          id="userId"
          type="number"
          className="input"
          placeholder="Filter by user ID (1-10)"
          value={filters.userId || ''}
          onChange={(e) => onFilterChange('userId', e.target.value)}
          min="1"
          max="10"
        />
      </div>

      <div className="filter-group" style={styles.filterGroup}>
        <label htmlFor="limit" style={styles.label}>Limit</label>
        <input
          id="limit"
          type="number"
          className="input"
          placeholder="Number of posts (1-100)"
          value={filters.limit || ''}
          onChange={(e) => onFilterChange('limit', e.target.value)}
          min="1"
          max="100"
        />
      </div>

      <div className="filter-group filter-group-wide" style={{ ...styles.filterGroup, gridColumn: 'span 2' }}>
        <label htmlFor="search" style={styles.label}>Search</label>
        <input
          id="search"
          type="text"
          className="input"
          placeholder="Search in titles and body..."
          value={filters.search || ''}
          onChange={(e) => onFilterChange('search', e.target.value)}
        />
      </div>

      <div className="filter-actions" style={styles.filterActions}>
        <button
          className="btn btn-secondary"
          onClick={() => onFilterChange('reset')}
          disabled={loading}
        >
          Reset Filters
        </button>
        <button
          className="btn btn-danger"
          onClick={onClearCache}
          disabled={loading}
        >
          Clear Cache
        </button>
      </div>
    </div>
  );
}

const styles = {
  filterBar: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: 'var(--spacing-lg)',
    marginBottom: 'var(--spacing-xl)',
    padding: 'var(--spacing-xl)',
  },
  filterGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--spacing-xs)',
  },
  label: {
    fontSize: '0.875rem',
    fontWeight: '500',
    color: 'var(--text-secondary)',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  filterActions: {
    gridColumn: 'span 2',
    display: 'flex',
    gap: 'var(--spacing-md)',
    justifyContent: 'flex-end',
  },
};
