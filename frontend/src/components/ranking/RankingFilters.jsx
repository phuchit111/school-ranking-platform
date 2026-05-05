'use client';

import { useState, useRef } from 'react';
import { PROVINCE_FILTER_OPTIONS } from '@/lib/scope';
import { SearchIcon, FilterIcon, XIcon } from '@/components/Icons';

const LEVEL_OPTIONS = [
  { value: '', label: 'ทุกระดับ' },
  { value: 'ประถมศึกษา', label: 'ประถมศึกษา' },
  { value: 'มัธยมศึกษา', label: 'มัธยมศึกษา' },
];

const SECTOR_OPTIONS = [
  { value: '', label: 'ทุกสังกัด' },
  { value: 'government', label: 'ภาครัฐ (สพฐ., อปท.)' },
  { value: 'private', label: 'เอกชน (เอกชน, สช.)' },
];

export default function RankingFilters({ onChange }) {
  const [filters, setFilters] = useState({
    province: '',
    sector: '',
    level: '',
    search: '',
  });
  const debounceRef = useRef(null);

  function update(key, value) {
    const next = { ...filters, [key]: value };
    setFilters(next);
    if (key === 'search') {
      clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => onChange(next), 300);
    } else {
      onChange(next);
    }
  }

  function clearSearch() {
    const next = { ...filters, search: '' };
    setFilters(next);
    onChange(next);
  }

  const activeCount = [filters.province, filters.sector, filters.level].filter(Boolean).length;

  return (
    <div className="bg-white rounded-2xl border border-muted-100 shadow-card p-4 sm:p-5 mb-8 dark:bg-main-900/80 dark:border-main-800">
      {/* Search + Filter header */}
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <SearchIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          <input
            type="text"
            placeholder="ค้นหาโรงเรียน..."
            value={filters.search}
            onChange={(e) => update('search', e.target.value)}
            className="w-full pl-10 pr-9 py-2.5 rounded-xl border border-muted-200 bg-muted-50/50 text-sm text-main-950 placeholder-muted-400 focus:outline-none focus:ring-2 focus:ring-accent-200 focus:border-accent-300 transition-all dark:border-main-800 dark:bg-main-950/50 dark:text-muted-100 dark:placeholder-muted-500 dark:focus:ring-accent-800 dark:focus:border-accent-600"
            id="ranking-search"
          />
          {filters.search && (
            <button
              type="button"
              onClick={clearSearch}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-200 transition-colors dark:hover:bg-gray-700 dark:hover:text-gray-300"
              aria-label="Clear search"
            >
              <XIcon className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Filter badge */}
        <div className="hidden sm:flex items-center gap-1.5 text-xs text-muted-500 px-3 py-2 rounded-xl bg-muted-50 border border-muted-100 dark:bg-main-950/50 dark:border-main-800 dark:text-muted-400">
          <FilterIcon className="w-4 h-4 text-gray-400" />
          <span>ตัวกรอง</span>
          {activeCount > 0 && (
            <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-accent-600 text-contrast text-[10px] font-bold">
              {activeCount}
            </span>
          )}
        </div>
      </div>

      {/* Dropdowns */}
      <div className="flex flex-wrap gap-3 mt-3">
        <div className="relative">
          <select
            value={filters.province}
            onChange={(e) => update('province', e.target.value)}
            className="appearance-none pl-3 pr-8 py-2 rounded-xl border border-muted-200 bg-muted-50/50 text-sm text-main-900 focus:outline-none focus:ring-2 focus:ring-accent-200 focus:border-accent-300 transition-all cursor-pointer dark:border-main-800 dark:bg-main-950/50 dark:text-muted-200 dark:focus:ring-accent-800"
            id="filter-province"
          >
            {PROVINCE_FILTER_OPTIONS.map((o) => (
              <option key={o.value || 'all'} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
          <svg className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" /></svg>
        </div>

        <div className="relative">
          <select
            value={filters.level}
            onChange={(e) => update('level', e.target.value)}
            className="appearance-none pl-3 pr-8 py-2 rounded-xl border border-muted-200 bg-muted-50/50 text-sm text-main-900 focus:outline-none focus:ring-2 focus:ring-accent-200 focus:border-accent-300 transition-all cursor-pointer dark:border-main-800 dark:bg-main-950/50 dark:text-muted-200 dark:focus:ring-accent-800"
            id="filter-level"
          >
            {LEVEL_OPTIONS.map((o) => (
              <option key={o.value || 'all'} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
          <svg className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" /></svg>
        </div>

        <div className="relative">
          <select
            value={filters.sector}
            onChange={(e) => update('sector', e.target.value)}
            className="appearance-none pl-3 pr-8 py-2 rounded-xl border border-muted-200 bg-muted-50/50 text-sm text-main-900 focus:outline-none focus:ring-2 focus:ring-accent-200 focus:border-accent-300 transition-all cursor-pointer dark:border-main-800 dark:bg-main-950/50 dark:text-muted-200 dark:focus:ring-accent-800"
            id="filter-sector"
          >
            {SECTOR_OPTIONS.map((o) => (
              <option key={o.value || 'all'} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
          <svg className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" /></svg>
        </div>
      </div>

      {/* Active filter chips */}
      {activeCount > 0 && (
        <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t border-muted-100 dark:border-main-800">
          {filters.province && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-accent-50 text-accent-800 text-xs font-medium dark:bg-accent-950/60 dark:text-accent-200">
              {PROVINCE_FILTER_OPTIONS.find((o) => o.value === filters.province)?.label}
              <button type="button" onClick={() => update('province', '')} className="hover:text-accent-950 transition-colors" aria-label="Remove province filter">
                <XIcon className="w-3 h-3" />
              </button>
            </span>
          )}
          {filters.level && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-accent-50 text-accent-800 text-xs font-medium dark:bg-accent-950/60 dark:text-accent-200">
              {LEVEL_OPTIONS.find((o) => o.value === filters.level)?.label}
              <button type="button" onClick={() => update('level', '')} className="hover:text-accent-950 transition-colors" aria-label="Remove level filter">
                <XIcon className="w-3 h-3" />
              </button>
            </span>
          )}
          {filters.sector && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-accent-50 text-accent-800 text-xs font-medium dark:bg-accent-950/60 dark:text-accent-200">
              {SECTOR_OPTIONS.find((o) => o.value === filters.sector)?.label}
              <button type="button" onClick={() => update('sector', '')} className="hover:text-accent-950 transition-colors" aria-label="Remove sector filter">
                <XIcon className="w-3 h-3" />
              </button>
            </span>
          )}
        </div>
      )}
    </div>
  );
}
