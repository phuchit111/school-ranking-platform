'use client';

import { useCallback, useEffect, useState } from 'react';
import api from '@/lib/api';
import ScoreInput from '@/components/admin/ScoreInput';
import { useSchoolPortal } from '@/contexts/SchoolPortalContext';
import { toast } from 'sonner';

export default function SchoolScoresPage() {
  const { schoolId } = useSchoolPortal();
  const [initialScores, setInitialScores] = useState({});
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const { data: scores } = await api.get(`/api/scores/${schoolId}`);
      const s = scores && scores.id ? scores : {};
      setInitialScores(s);
    } catch {
      toast.error('โหลดคะแนนไม่สำเร็จ');
    } finally {
      setLoading(false);
    }
  }, [schoolId]);

  useEffect(() => {
    load();
  }, [load]);

  if (loading) {
    return <div className="h-40 bg-gray-100 rounded-lg animate-pulse" />;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-bold">ดูคะแนนประเมิน</h1>
      </div>
      <p className="text-sm text-gray-600">
        ดูคะแนนที่ผู้ดูแลระบบบันทึกไว้ได้เท่านั้น — โรงเรียนไม่สามารถแก้ไขคะแนนได้
      </p>
      <ScoreInput
        key={JSON.stringify(initialScores)}
        initial={initialScores}
        readOnly
      />
    </div>
  );
}
