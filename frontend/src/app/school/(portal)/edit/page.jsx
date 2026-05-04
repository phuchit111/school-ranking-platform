'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';
import SchoolForm from '@/components/admin/SchoolForm';
import LogoUpload from '@/components/admin/LogoUpload';
import { useSchoolPortal } from '@/contexts/SchoolPortalContext';
import { toast } from 'sonner';

export default function SchoolEditPage() {
  const { schoolId } = useSchoolPortal();
  const [school, setSchool] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let c = false;
    (async () => {
      try {
        const { data } = await api.get(`/api/schools/${schoolId}`);
        if (!c) setSchool(data);
      } catch {
        toast.error('โหลดข้อมูลไม่สำเร็จ');
      } finally {
        if (!c) setLoading(false);
      }
    })();
    return () => {
      c = true;
    };
  }, [schoolId]);

  async function handleSubmit(form) {
    setSaving(true);
    try {
      await api.patch(`/api/schools/${schoolId}`, form);
      toast.success('บันทึกแล้ว');
      const { data } = await api.get(`/api/schools/${schoolId}`);
      setSchool(data);
    } catch {
      toast.error('บันทึกไม่สำเร็จ');
    } finally {
      setSaving(false);
    }
  }

  if (loading || !school) {
    return <div className="h-32 bg-gray-100 rounded-lg animate-pulse" />;
  }

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold">ข้อมูลโรงเรียน</h1>
      <section>
        <h2 className="font-semibold mb-3">โลโก้</h2>
        <LogoUpload schoolId={school.id} currentUrl={school.logoUrl} />
      </section>
      <SchoolForm
        initial={school}
        onSubmit={handleSubmit}
        loading={saving}
        submitLabel="บันทึกการแก้ไข"
        forSchoolAdmin
      />
    </div>
  );
}
