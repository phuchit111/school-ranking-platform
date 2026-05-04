'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import api from '@/lib/api';
import ScoreInput from '@/components/admin/ScoreInput';
import { toast } from 'sonner';

const CAT_KEYS = ['a', 'b', 'c', 'd', 'e'];
const CAT_STYLE = {
  a: { label: 'A', bg: 'bg-amber-50', ring: 'ring-amber-200/80', text: 'text-amber-900' },
  b: { label: 'B', bg: 'bg-slate-50', ring: 'ring-slate-200/80', text: 'text-slate-900' },
  c: { label: 'C', bg: 'bg-orange-50', ring: 'ring-orange-200/80', text: 'text-orange-900' },
  d: { label: 'D', bg: 'bg-gray-50', ring: 'ring-gray-200/80', text: 'text-gray-900' },
  e: { label: 'E', bg: 'bg-blue-50', ring: 'ring-blue-200/80', text: 'text-blue-900' },
};

function sumCategory(payload, letter) {
  let t = 0;
  for (let n = 1; n <= 5; n += 1) {
    t += Number(payload[`${letter}${n}`]) || 0;
  }
  return t;
}

export default function AdminScoresPage() {
  const params = useParams();
  const schoolId = params.schoolId;
  const [school, setSchool] = useState(null);
  const [initialScores, setInitialScores] = useState({});
  const [payload, setPayload] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [{ data: sch }, { data: scores }] = await Promise.all([
          api.get(`/api/schools/${schoolId}`),
          api.get(`/api/scores/${schoolId}`),
        ]);
        if (cancelled) return;
        setSchool(sch);
        const s = scores && scores.id ? scores : {};
        setInitialScores(s);
        const pick = {};
        CAT_KEYS.forEach((L) =>
          [1, 2, 3, 4, 5].forEach((n) => {
            const k = `${L}${n}`;
            pick[k] = s[k] ?? 0;
          })
        );
        setPayload(pick);
      } catch {
        toast.error('โหลดข้อมูลไม่สำเร็จ');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [schoolId]);

  const grandTotal = useMemo(
    () => Object.values(payload).reduce((acc, v) => acc + (Number(v) || 0), 0),
    [payload]
  );

  async function handleSave() {
    setSaving(true);
    try {
      await api.put(`/api/scores/${schoolId}`, payload);
      toast.success('บันทึกคะแนนและคำนวณอันดับแล้ว');
      const [{ data: sch }, { data: scores }] = await Promise.all([
        api.get(`/api/schools/${schoolId}`),
        api.get(`/api/scores/${schoolId}`),
      ]);
      setSchool(sch);
      const s = scores && scores.id ? scores : {};
      setInitialScores(s);
    } catch {
      toast.error('บันทึกไม่สำเร็จ');
    } finally {
      setSaving(false);
    }
  }

  const title =
    school?.nameEn?.trim() ? `${school.name} (${school.nameEn})` : school?.name ?? '';

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-indigo-50/30 pb-28">
        <div className="max-w-4xl mx-auto px-4 py-10 space-y-6">
          <div className="h-8 w-40 bg-white/70 rounded-lg animate-pulse" />
          <div className="h-36 bg-white/80 rounded-2xl animate-pulse border border-slate-100" />
          <div className="h-96 bg-white/60 rounded-2xl animate-pulse border border-slate-100" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-indigo-50/35 pb-28 sm:pb-32">
      <div className="max-w-4xl mx-auto px-4 py-8 sm:py-10 space-y-6">
        <nav className="text-sm text-slate-500 flex flex-wrap gap-x-2 gap-y-1 items-center">
          <Link href="/admin/schools" className="hover:text-indigo-600 transition-colors">
            โรงเรียน
          </Link>
          <span aria-hidden className="text-slate-300">
            /
          </span>
          <Link href="/admin/scores" className="hover:text-indigo-600 transition-colors">
            คะแนนประเมิน
          </Link>
          <span aria-hidden className="text-slate-300">
            /
          </span>
          <span className="text-slate-800 font-medium truncate max-w-[min(100%,12rem)] sm:max-w-none">
            {school?.name ?? 'โรงเรียน'}
          </span>
        </nav>

        <header className="relative overflow-hidden rounded-2xl border border-indigo-100/80 bg-gradient-to-br from-indigo-600 via-indigo-700 to-violet-800 text-white shadow-xl shadow-indigo-900/10">
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.12]"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}
          />
          <div className="relative p-6 sm:p-8">
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
              <div className="min-w-0 flex-1">
                <p className="text-indigo-100 text-sm font-medium tracking-wide uppercase">
                  แบบประเมินคะแนน
                </p>
                <h1 className="text-2xl sm:text-3xl font-bold mt-2 leading-tight break-words">{title}</h1>
                {school ? (
                  <div className="mt-3 flex flex-wrap gap-2">
                    <span className="inline-flex items-center rounded-full bg-white/15 px-3 py-1 text-xs font-medium backdrop-blur-sm">
                      {school.province}
                    </span>
                    <span className="inline-flex items-center rounded-full bg-white/15 px-3 py-1 text-xs font-medium backdrop-blur-sm">
                      สังกัด {school.affiliation}
                    </span>
                    {school.ranking?.level ? (
                      <span className="inline-flex items-center rounded-full bg-white/20 px-3 py-1 text-xs font-semibold backdrop-blur-sm ring-1 ring-white/25">
                        ระดับ {school.ranking.level} · อันดับ {school.ranking.rank ?? '—'}
                      </span>
                    ) : (
                      <span className="inline-flex items-center rounded-full bg-white/10 px-3 py-1 text-xs text-indigo-100">
                        ยังไม่มีการจัดระดับ — บันทึกคะแนนเพื่อคำนวณ
                      </span>
                    )}
                  </div>
                ) : null}
              </div>
              <div className="flex flex-col sm:flex-row lg:flex-col gap-2 shrink-0">
                <Link
                  href={`/admin/schools/${schoolId}/edit`}
                  className="text-center rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white text-sm font-medium px-4 py-2.5 transition-colors"
                >
                  แก้ไขโรงเรียน
                </Link>
                <Link
                  href={`/schools/${schoolId}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-center rounded-xl bg-white text-indigo-700 text-sm font-semibold px-4 py-2.5 shadow-md hover:bg-indigo-50 transition-colors"
                >
                  ดูโปรไฟล์สาธารณะ ↗
                </Link>
              </div>
            </div>
          </div>
        </header>

        <div className="rounded-2xl border border-slate-200/90 bg-amber-50/40 px-4 py-3 sm:px-5 sm:py-4 text-sm text-amber-950/90">
          <strong className="font-semibold">เกณฑ์การให้คะแนน:</strong> แต่ละข้อให้คะแนน{' '}
          <span className="font-mono font-semibold">0–4</span> คะแนนรวมสูงสุดต่อหมวด{' '}
          <span className="font-mono">20</span> (หมวดละ 5 ข้อ) · รวมทั้งหมดสูงสุด{' '}
          <span className="font-mono">100</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 sm:gap-3">
          {CAT_KEYS.map((L) => {
            const st = CAT_STYLE[L];
            const sub = sumCategory(payload, L);
            return (
              <div
                key={L}
                className={`rounded-xl ring-1 ${st.ring} ${st.bg} px-3 py-3 text-center`}
              >
                <div className={`text-xs font-bold ${st.text}`}>หมวด {st.label}</div>
                <div className="text-lg font-bold text-slate-900 mt-1">
                  {sub}
                  <span className="text-slate-400 font-normal text-sm">/20</span>
                </div>
              </div>
            );
          })}
        </div>

        <section className="rounded-2xl border border-slate-200/90 bg-white shadow-sm shadow-slate-200/50 overflow-hidden">
          <div className="border-b border-slate-100 bg-slate-50/80 px-4 py-3 sm:px-6 flex flex-wrap items-center justify-between gap-2">
            <h2 className="font-semibold text-slate-900">รายการตัวชี้วัด</h2>
            <div className="text-sm text-slate-600">
              คะแนนรวมทั้งหมด{' '}
              <span className="font-semibold tabular-nums text-indigo-700">
                {grandTotal}
              </span>
              <span className="text-slate-400">/100</span>
            </div>
          </div>
          <div className="p-4 sm:p-6">
            <ScoreInput
              key={JSON.stringify(initialScores)}
              initial={initialScores}
              onChange={(next) => setPayload(next)}
            />
          </div>
        </section>
      </div>

      <div className="fixed bottom-0 left-0 right-0 z-30 border-t border-slate-200/90 bg-white/95 backdrop-blur-md shadow-[0_-8px_30px_-12px_rgba(15,23,42,0.15)]">
        <div className="max-w-4xl mx-auto px-4 py-3 sm:py-4 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="text-sm text-slate-600">
            <span className="hidden sm:inline">พร้อมบันทึกเมื่อกรอกครบ — </span>
            รวม{' '}
            <span className="font-semibold tabular-nums text-slate-900">{grandTotal}</span>
            /100
          </div>
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="inline-flex items-center justify-center rounded-xl bg-indigo-600 text-white font-semibold px-8 py-3 shadow-lg shadow-indigo-200 hover:bg-indigo-700 disabled:opacity-50 disabled:shadow-none transition-all"
          >
            {saving ? (
              <>
                <span className="inline-block h-4 w-4 border-2 border-white/40 border-t-white rounded-full animate-spin mr-2" />
                กำลังบันทึก...
              </>
            ) : (
              'บันทึกคะแนนและคำนวณอันดับ'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
