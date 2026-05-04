'use client';

import { useState, useRef } from 'react';
import { PROVINCE_FILTER_OPTIONS } from '@/lib/scope';

const LEVEL_OPTIONS = [
  { value: '', label: 'ทั้งหมด (ระดับ)' },
  { value: 'ประถมศึกษา', label: 'ประถมศึกษา' },
  { value: 'มัธยมศึกษา', label: 'มัธยมศึกษา' },
];

const SECTOR_OPTIONS = [
  { value: '', label: 'ทั้งหมด (สังกัด)' },
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

  function updateSector(value) {
    const next = { ...filters, sector: value };
    setFilters(next);
    onChange(next);
  }

  return (
    <div className="flex flex-wrap gap-3 my-4">
      <input
        type="text"
        placeholder="ค้นหาโรงเรียน..."
        value={filters.search}
        onChange={(e) => update('search', e.target.value)}
        className="border rounded px-3 py-2 text-sm w-48"
      />
      <select
        value={filters.province}
        onChange={(e) => update('province', e.target.value)}
        className="border rounded px-3 py-2 text-sm"
      >
        {PROVINCE_FILTER_OPTIONS.map((o) => (
          <option key={o.value || 'all'} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      <select
        value={filters.level}
        onChange={(e) => update('level', e.target.value)}
        className="border rounded px-3 py-2 text-sm"
      >
        {LEVEL_OPTIONS.map((o) => (
          <option key={o.value || 'all'} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      <select
        value={filters.sector}
        onChange={(e) => updateSector(e.target.value)}
        className="border rounded px-3 py-2 text-sm"
      >
        {SECTOR_OPTIONS.map((o) => (
          <option key={o.value || 'all'} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
  );
}
