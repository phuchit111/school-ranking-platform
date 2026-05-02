'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import api from '@/lib/api';
import ScoreInput from '@/components/admin/ScoreInput';
import { toast } from 'sonner';

export default function AdminScoresPage() {
  const params = useParams();
  const schoolId = params.schoolId;
  const [schoolName, setSchoolName] = useState('');
  const [initialScores, setInitialScores] = useState({});
  const [payload, setPayload] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [{ data: school }, { data: scores }] = await Promise.all([
          api.get(`/api/schools/${schoolId}`),
          api.get(`/api/scores/${schoolId}`),
        ]);
        if (cancelled) return;
        setSchoolName(school.name);
        const s = scores && scores.id ? scores : {};
        setInitialScores(s);
        const pick = {};
        ['a', 'b', 'c', 'd', 'e'].forEach((L) =>
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

  async function handleSave() {
    setSaving(true);
    try {
      await api.put(`/api/scores/${schoolId}`, payload);
      toast.success('บันทึกคะแนนและคำนวณอันดับแล้ว');
    } catch {
      toast.error('บันทึกไม่สำเร็จ');
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-10">
        <div className="h-40 bg-gray-100 rounded animate-pulse" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <Link href="/admin/schools" className="text-sm text-blue-600 hover:underline">
            ← กลับไปรายการโรงเรียน
          </Link>
          <h1 className="text-2xl font-bold mt-2">คะแนน: {schoolName}</h1>
        </div>
        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {saving ? 'กำลังบันทึก...' : 'บันทึกคะแนน'}
        </button>
      </div>
      <ScoreInput
        key={JSON.stringify(initialScores)}
        initial={initialScores}
        onChange={(next) => setPayload(next)}
      />
    </div>
  );
}
