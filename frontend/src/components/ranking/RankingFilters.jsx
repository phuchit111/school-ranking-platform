'use client';

import { useState, useRef } from 'react';

const PROVINCES = ['ทั้งหมด', 'กรุงเทพมหานคร', 'เชียงใหม่', 'ขอนแก่น', 'สงขลา', 'นครราชสีมา'];
const AFFILIATIONS = ['ทั้งหมด', 'สพฐ.', 'อปท.', 'เอกชน', 'สช.'];
const LEVELS = ['ทั้งหมด', 'ประถมศึกษา', 'มัธยมศึกษา', 'อาชีวศึกษา'];

export default function RankingFilters({ onChange }) {
  const [filters, setFilters] = useState({
    province: '',
    affiliation: '',
    level: '',
    search: '',
  });
  const debounceRef = useRef(null);

  function update(key, value) {
    const next = { ...filters, [key]: value === 'ทั้งหมด' ? '' : value };
    setFilters(next);
    if (key === 'search') {
      clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => onChange(next), 300);
    } else {
      onChange(next);
    }
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
      {[
        ['province', PROVINCES],
        ['affiliation', AFFILIATIONS],
        ['level', LEVELS],
      ].map(([key, opts]) => {
        const val = filters[key] || 'ทั้งหมด';
        return (
          <select
            key={key}
            value={val}
            onChange={(e) => update(key, e.target.value)}
            className="border rounded px-3 py-2 text-sm"
          >
            {opts.map((o) => (
              <option key={o} value={o}>
                {o}
              </option>
            ))}
          </select>
        );
      })}
    </div>
  );
}
