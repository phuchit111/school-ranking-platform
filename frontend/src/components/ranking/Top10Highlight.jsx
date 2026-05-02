'use client';

import { useEffect, useState } from 'react';
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
          <div
            key={r.id}
            className={`border-l-4 rounded p-3 text-sm ${MEDAL_BG[i] || 'bg-white border-gray-200'}`}
          >
            <div className="font-bold text-lg">#{r.rank}</div>
            <div className="font-medium truncate">{r.school.name}</div>
            <div className="text-gray-500 text-xs">{r.school.province}</div>
            <div className="mt-1 font-semibold">{r.totalScore?.toFixed(2)} คะแนน</div>
          </div>
        ))}
      </div>
    </div>
  );
}
