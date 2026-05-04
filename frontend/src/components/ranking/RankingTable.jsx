'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import api from '@/lib/api';
import { EyeIcon, ChevronUpIcon, ChevronDownIcon, ArrowLeftIcon, ArrowRightIcon, MapPinIconFull } from '@/components/Icons';

const LEVEL_COLOR = {
  A: 'bg-amber-50 text-amber-800 border-amber-200',
  B: 'bg-slate-50 text-slate-700 border-slate-200',
  C: 'bg-yellow-50 text-yellow-800 border-yellow-200',
  D: 'bg-gray-50 text-gray-600 border-gray-200',
  E: 'bg-blue-50 text-blue-700 border-blue-200',
};

function SortIndicator({ active, direction }) {
  if (!active) return <ChevronDownIcon className="w-3.5 h-3.5 text-gray-300 ml-1" />;
  return direction === 'asc' ? (
    <ChevronUpIcon className="w-3.5 h-3.5 text-navy-600 ml-1" />
  ) : (
    <ChevronDownIcon className="w-3.5 h-3.5 text-navy-600 ml-1" />
  );
}

function ScoreMiniBar({ score, max = 100 }) {
  const pct = Math.min((score / max) * 100, 100);
  return (
    <div className="flex items-center gap-2.5">
      <span className="text-sm font-semibold text-gray-900 tabular-nums w-12 text-right">
        {score?.toFixed(2)}
      </span>
      <div className="hidden sm:block w-16 bg-gray-100 rounded-full h-1.5">
        <div
          className="h-1.5 rounded-full bg-gradient-to-r from-navy-300 to-navy-500 transition-all duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
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

  const totalPages = Math.ceil(total / limit);

  if (loading) {
    return (
      <div className="space-y-3 mt-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-16 rounded-xl shimmer-bg" />
        ))}
      </div>
    );
  }

  return (
    <div className="mt-2 animate-fade-in">
      {/* Header bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <h2 className="text-lg font-bold text-gray-900">ตารางอันดับทั้งหมด</h2>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <label htmlFor="ranking-page-size" className="sr-only">จำนวนรายการต่อหน้า</label>
          <span>แสดง</span>
          <select
            id="ranking-page-size"
            value={limit}
            onChange={(e) => setLimit(Number(e.target.value))}
            className="appearance-none border border-gray-200 rounded-lg px-2.5 py-1.5 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-navy-200 cursor-pointer"
          >
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
          </select>
          <span>รายการ</span>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50/80 border-b border-gray-100">
                <th
                  className="text-left px-4 sm:px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider cursor-pointer select-none hover:text-gray-700 transition-colors"
                  onClick={() => toggleSort('rank')}
                >
                  <span className="inline-flex items-center">
                    อันดับ
                    <SortIndicator active={sortBy === 'rank'} direction={order} />
                  </span>
                </th>
                <th className="text-left px-4 sm:px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  โรงเรียน
                </th>
                <th className="text-left px-4 sm:px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden md:table-cell">
                  จังหวัด
                </th>
                <th className="text-left px-4 sm:px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden lg:table-cell">
                  สังกัด
                </th>
                <th
                  className="text-left px-4 sm:px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider cursor-pointer select-none hover:text-gray-700 transition-colors"
                  onClick={() => toggleSort('totalScore')}
                >
                  <span className="inline-flex items-center">
                    คะแนน
                    <SortIndicator active={sortBy === 'totalScore'} direction={order} />
                  </span>
                </th>
                <th
                  className="text-left px-4 sm:px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider cursor-pointer select-none hover:text-gray-700 transition-colors"
                  onClick={() => toggleSort('level')}
                >
                  <span className="inline-flex items-center">
                    ระดับ
                    <SortIndicator active={sortBy === 'level'} direction={order} />
                  </span>
                </th>
                <th className="w-14 px-4 sm:px-5 py-3.5" scope="col">
                  <span className="sr-only">ดูรายละเอียด</span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {rows.map((r) => (
                <tr
                  key={r.id}
                  className="group hover:bg-navy-50/30 transition-colors"
                >
                  {/* Rank */}
                  <td className="px-4 sm:px-5 py-4">
                    <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-navy-50 text-navy-700 text-sm font-bold">
                      {r.rank}
                    </span>
                  </td>

                  {/* School name */}
                  <td className="px-4 sm:px-5 py-4">
                    <Link
                      href={`/schools/${r.school.id}`}
                      className="group/link inline-block text-left max-w-full"
                    >
                      <span className="font-semibold text-gray-900 group-hover/link:text-navy-700 transition-colors">
                        {r.school.name}
                      </span>
                      {r.school.nameEn?.trim() && (
                        <span className="block text-xs text-gray-400 font-normal mt-0.5 truncate max-w-xs">
                          {r.school.nameEn}
                        </span>
                      )}
                      {/* Mobile-only location */}
                      <span className="md:hidden flex items-center gap-1 text-xs text-gray-400 mt-1">
                        <MapPinIconFull className="w-3 h-3 shrink-0" />
                        {r.school.province}
                      </span>
                    </Link>
                  </td>

                  {/* Province (hidden mobile) */}
                  <td className="px-4 sm:px-5 py-4 hidden md:table-cell">
                    <span className="inline-flex items-center gap-1.5 text-sm text-gray-600">
                      <MapPinIconFull className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                      {r.school.province}
                    </span>
                  </td>

                  {/* Affiliation (hidden mobile/tablet) */}
                  <td className="px-4 sm:px-5 py-4 text-sm text-gray-600 hidden lg:table-cell">
                    {r.school.affiliation}
                  </td>

                  {/* Score */}
                  <td className="px-4 sm:px-5 py-4">
                    <ScoreMiniBar score={r.totalScore} />
                  </td>

                  {/* Level */}
                  <td className="px-4 sm:px-5 py-4">
                    <span
                      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${LEVEL_COLOR[r.level] || 'bg-gray-50 text-gray-600 border-gray-200'}`}
                    >
                      {r.level}
                    </span>
                  </td>

                  {/* Action */}
                  <td className="px-4 sm:px-5 py-4 text-center">
                    <Link
                      href={`/schools/${r.school.id}`}
                      className="inline-flex items-center justify-center w-8 h-8 rounded-lg text-gray-400 hover:text-navy-600 hover:bg-navy-50 transition-all"
                      aria-label={`ดูรายละเอียด ${r.school.name}`}
                      title="ดูรายละเอียดโรงเรียน"
                    >
                      <EyeIcon className="w-4 h-4" />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mt-5">
        <span className="text-sm text-gray-500">
          ทั้งหมด <span className="font-semibold text-gray-700">{total}</span> โรงเรียน
          {totalPages > 1 && (
            <> · หน้า <span className="font-semibold text-gray-700">{page}</span> จาก {totalPages}</>
          )}
        </span>
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-gray-200 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            <ArrowLeftIcon className="w-3.5 h-3.5" />
            ก่อนหน้า
          </button>
          <button
            type="button"
            disabled={page * limit >= total}
            onClick={() => setPage((p) => p + 1)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-gray-200 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            ถัดไป
            <ArrowRightIcon className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
