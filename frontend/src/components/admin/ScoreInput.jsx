'use client';

import { useState } from 'react';
import { CATEGORY_A_HEADER, RUBRIC_A_ITEMS } from '@/lib/rubricCategoryA';
import { CATEGORY_B_HEADER, RUBRIC_B_ITEMS } from '@/lib/rubricCategoryB';
import { CATEGORY_C_HEADER, RUBRIC_C_ITEMS } from '@/lib/rubricCategoryC';
import { CATEGORY_D_HEADER, RUBRIC_D_ITEMS } from '@/lib/rubricCategoryD';
import { CATEGORY_E_HEADER, RUBRIC_E_ITEMS } from '@/lib/rubricCategoryE';

const CATEGORIES = ['A', 'B', 'C', 'D', 'E'];

/** @param {'Q' | 'Qual' | 'Q/Qual'} t */
function rubricTypeLabel(t) {
  if (t === 'Q') return 'เชิงปริมาณ';
  if (t === 'Qual') return 'เชิงคุณภาพ';
  return 'เชิงปริมาณ/คุณภาพ';
}

const DETAILED_RUBRICS = {
  A: { header: CATEGORY_A_HEADER, items: RUBRIC_A_ITEMS },
  B: { header: CATEGORY_B_HEADER, items: RUBRIC_B_ITEMS },
  C: { header: CATEGORY_C_HEADER, items: RUBRIC_C_ITEMS },
  D: { header: CATEGORY_D_HEADER, items: RUBRIC_D_ITEMS },
  E: { header: CATEGORY_E_HEADER, items: RUBRIC_E_ITEMS },
};

export default function ScoreInput({ initial = {}, onChange, readOnly = false }) {
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
    if (readOnly) return;
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
      {CATEGORIES.map((cat) => {
        const detail = DETAILED_RUBRICS[cat];
        return (
        <div key={cat} className="border rounded p-4">
          <div className="flex justify-between items-start gap-4 mb-3">
            <div>
              <h3 className="font-semibold">
                หมวด {cat}
                {detail && (
                  <span className="block text-sm font-normal text-gray-600 mt-1">
                    {detail.header.titleTh}{' '}
                    <span className="text-gray-400">({detail.header.titleEn})</span>
                    <span className="ml-2 text-xs bg-slate-100 text-slate-700 px-2 py-0.5 rounded">
                      น้ำหนัก {detail.header.weight}
                    </span>
                  </span>
                )}
              </h3>
              {detail && (
                <p className="text-sm text-gray-600 mt-2 leading-relaxed">
                  วัตถุประสงค์: {detail.header.purpose}
                </p>
              )}
            </div>
            <span className="text-sm bg-blue-100 text-blue-800 px-2 py-0.5 rounded shrink-0">
              รวม: {catTotal(cat)}/20
            </span>
          </div>

          {detail ? (
            <div className="space-y-4">
              {detail.items.map((item) => (
                <div
                  key={item.key}
                  className="border border-slate-200 rounded-lg p-3 bg-slate-50/50 space-y-2"
                >
                  <div className="flex w-full flex-nowrap items-start justify-between gap-4">
                    <div className="min-w-0 flex-1 pr-2">
                      <div className="font-medium text-gray-900">
                        <span className="text-blue-700">{item.code}</span>{' '}
                        {item.title}
                        <span className="ml-1.5 text-xs font-normal text-gray-500">
                          ({rubricTypeLabel(item.type)})
                        </span>
                      </div>
                      <p className="text-sm text-gray-700 mt-1.5 leading-relaxed">{item.focus}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        วิธีวัด / หลักฐาน: {item.evidence}
                      </p>
                    </div>
                    <div className="flex flex-col items-end justify-start gap-1 shrink-0 self-stretch border-l border-slate-200/80 pl-4 sm:pl-5 min-w-[5.5rem]">
                      <label
                        className="text-xs text-gray-500 whitespace-nowrap"
                        htmlFor={`score-${item.key}`}
                      >
                        คะแนน (0–4)
                      </label>
                      <input
                        id={`score-${item.key}`}
                        type="number"
                        min="0"
                        max="4"
                        value={scores[item.key]}
                        readOnly={readOnly}
                        onChange={(e) => set(item.key, e.target.value)}
                        className={`w-full max-w-[5rem] border rounded text-center py-1.5 text-sm ${
                          readOnly ? 'bg-gray-100 text-gray-800 cursor-default' : 'bg-white'
                        }`}
                      />
                    </div>
                  </div>
                  <details className="text-sm">
                    <summary className="cursor-pointer text-blue-600 hover:underline">
                      เกณฑ์การให้คะแนน (0–4)
                    </summary>
                    <ul className="mt-2 space-y-1 pl-4 text-gray-700 border-l-2 border-blue-200 ml-1">
                      {item.steps.map((step) => (
                        <li key={step.score}>
                          <span className="font-mono text-xs text-gray-500">{step.score}</span>
                          {' — '}
                          {step.label}
                        </li>
                      ))}
                    </ul>
                  </details>
                </div>
              ))}
            </div>
          ) : (
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
                      readOnly={readOnly}
                      onChange={(e) => set(key, e.target.value)}
                      className={`w-full border rounded text-center py-1 text-sm ${
                        readOnly ? 'bg-gray-100 text-gray-800 cursor-default' : ''
                      }`}
                    />
                  </div>
                );
              })}
            </div>
          )}
        </div>
        );
      })}
    </div>
  );
}
