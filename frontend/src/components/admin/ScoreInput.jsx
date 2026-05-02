'use client';

import { useState } from 'react';

const CATEGORIES = ['A', 'B', 'C', 'D', 'E'];

export default function ScoreInput({ initial = {}, onChange }) {
  const [scores, setScores] = useState(() => {
    const s = {};
    CATEGORIES.forEach((cat) =>
      [1, 2, 3, 4, 5].forEach((n) => {
        const key = `${cat.toLowerCase()}${n}`;
        s[key] = initial[key] ?? 0;
      })
    );
    return s;
  });

  function set(key, val) {
    const v = Math.min(4, Math.max(0, Number(val)));
    const next = { ...scores, [key]: v };
    setScores(next);
    onChange?.(next);
  }

  function catTotal(cat) {
    return [1, 2, 3, 4, 5].reduce((s, n) => s + (scores[`${cat.toLowerCase()}${n}`] || 0), 0);
  }

  return (
    <div className="space-y-4">
      {CATEGORIES.map((cat) => (
        <div key={cat} className="border rounded p-4">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-semibold">หมวด {cat}</h3>
            <span className="text-sm bg-blue-100 text-blue-800 px-2 py-0.5 rounded">
              รวม: {catTotal(cat)}/20
            </span>
          </div>
          <div className="grid grid-cols-5 gap-2">
            {[1, 2, 3, 4, 5].map((n) => {
              const key = `${cat.toLowerCase()}${n}`;
              return (
                <div key={n} className="text-center">
                  <div className="text-xs text-gray-500">
                    {cat}
                    {n}
                  </div>
                  <input
                    type="number"
                    min="0"
                    max="4"
                    value={scores[key]}
                    onChange={(e) => set(key, e.target.value)}
                    className="w-full border rounded text-center py-1 text-sm"
                  />
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
