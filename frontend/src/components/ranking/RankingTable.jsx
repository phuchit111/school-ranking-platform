'use client';

import { useEffect, useState, useCallback } from 'react';
import api from '@/lib/api';

const MEDAL = { 1: '🥇', 2: '🥈', 3: '🥉' };
const LEVEL_COLOR = {
  A: 'bg-green-100 text-green-800',
  B: 'bg-blue-100 text-blue-800',
  C: 'bg-yellow-100 text-yellow-800',
  D: 'bg-orange-100 text-orange-800',
  E: 'bg-red-100 text-red-800',
};

export default function RankingTable({ filters = {} }) {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [sortBy, setSortBy] = useState('rank');
  const [order, setOrder] = useState('asc');
  const limit = 20;

  const filterKey = JSON.stringify(filters);

  useEffect(() => {
    setPage(1);
  }, [filterKey]);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page, limit, sortBy, order, ...filters };
      const { data } = await api.get('/api/ranking', { params });
      setRows(data.data);
      setTotal(data.total);
    } finally {
      setLoading(false);
    }
  }, [page, sortBy, order, filters]);

  useEffect(() => {
    load();
  }, [load]);

  function toggleSort(col) {
    if (sortBy === col) setOrder((o) => (o === 'asc' ? 'desc' : 'asc'));
    else {
      setSortBy(col);
      setOrder('asc');
    }
  }

  if (loading)
    return (
      <div className="space-y-2 mt-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-12 bg-gray-200 rounded animate-pulse" />
        ))}
      </div>
    );

  return (
    <div className="mt-4 overflow-x-auto">
      <table className="w-full text-sm border-collapse">
        <thead>
          <tr className="bg-gray-100 text-left">
            <th className="p-3 cursor-pointer" onClick={() => toggleSort('rank')}>
              อันดับ {sortBy === 'rank' ? (order === 'asc' ? '↑' : '↓') : ''}
            </th>
            <th className="p-3">โรงเรียน</th>
            <th className="p-3">จังหวัด</th>
            <th className="p-3">สังกัด</th>
            <th className="p-3 cursor-pointer" onClick={() => toggleSort('totalScore')}>
              คะแนน {sortBy === 'totalScore' ? (order === 'asc' ? '↑' : '↓') : ''}
            </th>
            <th className="p-3 cursor-pointer" onClick={() => toggleSort('level')}>
              ระดับ {sortBy === 'level' ? (order === 'asc' ? '↑' : '↓') : ''}
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.id} className="border-b hover:bg-gray-50">
              <td className="p-3 font-bold">{MEDAL[r.rank] || `#${r.rank}`}</td>
              <td className="p-3">{r.school.name}</td>
              <td className="p-3">{r.school.province}</td>
              <td className="p-3">{r.school.affiliation}</td>
              <td className="p-3">{r.totalScore?.toFixed(2)}</td>
              <td className="p-3">
                <span
                  className={`px-2 py-0.5 rounded text-xs font-medium ${LEVEL_COLOR[r.level] || ''}`}
                >
                  {r.level}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="flex justify-between items-center mt-4 text-sm text-gray-600">
        <span>ทั้งหมด {total} โรงเรียน</span>
        <div className="flex gap-2">
          <button
            type="button"
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
            className="px-3 py-1 border rounded disabled:opacity-40"
          >
            ก่อนหน้า
          </button>
          <button
            type="button"
            disabled={page * limit >= total}
            onClick={() => setPage((p) => p + 1)}
            className="px-3 py-1 border rounded disabled:opacity-40"
          >
            ถัดไป
          </button>
        </div>
      </div>
    </div>
  );
}
