'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import api from '@/lib/api';

const MEDAL = { 1: '🥇', 2: '🥈', 3: '🥉' };
const LEVEL_COLOR = {
  A: 'bg-green-100 text-green-800',
  B: 'bg-blue-100 text-blue-800',
  C: 'bg-yellow-100 text-yellow-800',
  D: 'bg-orange-100 text-orange-800',
  E: 'bg-red-100 text-red-800',
};

function EyeIcon({ className }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className={className}
      aria-hidden
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
      />
    </svg>
  );
}

export default function RankingTable({ filters = {} }) {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [sortBy, setSortBy] = useState('rank');
  const [order, setOrder] = useState('asc');
  const [limit, setLimit] = useState(20);

  const filterKey = JSON.stringify(filters);

  useEffect(() => {
    setPage(1);
  }, [filterKey, limit]);

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
  }, [page, limit, sortBy, order, filters]);

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
      <div className="flex flex-wrap items-center justify-end gap-2 mb-3 text-sm text-gray-600">
        <label htmlFor="ranking-page-size" className="sr-only">
          จำนวนรายการต่อหน้า
        </label>
        <span>แสดง</span>
        <select
          id="ranking-page-size"
          value={limit}
          onChange={(e) => setLimit(Number(e.target.value))}
          className="border rounded px-2 py-1 bg-white"
        >
          <option value={10}>10</option>
          <option value={20}>20</option>
          <option value={50}>50</option>
        </select>
        <span>รายการต่อหน้า</span>
      </div>
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
            <th className="p-3 w-14 text-center" scope="col">
              <span className="sr-only">ดูรายละเอียด</span>
              <EyeIcon className="w-5 h-5 inline text-gray-400" aria-hidden />
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.id} className="border-b hover:bg-gray-50">
              <td className="p-3 font-bold">{MEDAL[r.rank] || `#${r.rank}`}</td>
              <td className="p-3">
                <Link
                  href={`/schools/${r.school.id}`}
                  className="group inline-block text-left max-w-full"
                >
                  <span className="font-medium text-blue-700 group-hover:underline">
                    {r.school.name}
                  </span>
                  {r.school.nameEn?.trim() ? (
                    <span className="block text-xs text-gray-500 font-normal mt-0.5 group-hover:text-gray-600">
                      {r.school.nameEn}
                    </span>
                  ) : null}
                </Link>
              </td>
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
              <td className="p-3 text-center">
                <Link
                  href={`/schools/${r.school.id}`}
                  className="inline-flex items-center justify-center p-1.5 rounded-full text-gray-500 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                  aria-label={`ดูรายละเอียด ${r.school.name}`}
                  title="ดูรายละเอียดโรงเรียน"
                >
                  <EyeIcon className="w-5 h-5" />
                </Link>
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
