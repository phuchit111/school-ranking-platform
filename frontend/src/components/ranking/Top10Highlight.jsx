'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import api from '@/lib/api';

const MEDAL_BG = {
  0: 'bg-yellow-50 border-yellow-400',
  1: 'bg-gray-50 border-gray-400',
  2: 'bg-orange-50 border-orange-400',
};

export default function Top10Highlight() {
  const [top10, setTop10] = useState([]);

  useEffect(() => {
    api.get('/api/ranking/top10').then(({ data }) => setTop10(data));
  }, []);

  return (
    <div className="mb-8">
      <h2 className="text-xl font-semibold mb-3">🏆 Top 10 โรงเรียน</h2>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {top10.map((r, i) => (
          <Link
            key={r.id}
            href={`/schools/${r.school.id}`}
            className={`block border-l-4 rounded p-3 text-sm transition hover:ring-2 hover:ring-blue-200 ${MEDAL_BG[i] || 'bg-white border-gray-200'}`}
          >
            <div className="font-bold text-lg">#{r.rank}</div>
            <div className="font-medium truncate text-blue-800" title={r.school.nameEn || undefined}>
              {r.school.name}
            </div>
            {r.school.nameEn?.trim() ? (
              <div className="text-gray-500 text-xs truncate">{r.school.nameEn}</div>
            ) : null}
            <div className="text-gray-500 text-xs">{r.school.province}</div>
            <div className="mt-1 font-semibold">{r.totalScore?.toFixed(2)} คะแนน</div>
            <span className="mt-2 inline-block text-xs text-blue-600">ดูรายละเอียด →</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
