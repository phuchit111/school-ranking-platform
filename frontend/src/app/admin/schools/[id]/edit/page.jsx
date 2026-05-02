'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import api from '@/lib/api';
import SchoolForm from '@/components/admin/SchoolForm';
import LogoUpload from '@/components/admin/LogoUpload';
import { toast } from 'sonner';

export default function EditSchoolPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id;
  const [school, setSchool] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const { data } = await api.get(`/api/schools/${id}`);
        if (!cancelled) setSchool(data);
      } catch {
        toast.error('โหลดข้อมูลไม่สำเร็จ');
        router.push('/admin/schools');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [id, router]);

  async function handleSubmit(form) {
    setSaving(true);
    try {
      await api.patch(`/api/schools/${id}`, form);
      toast.success('บันทึกแล้ว');
      router.push('/admin/schools');
    } catch {
      toast.error('บันทึกไม่สำเร็จ');
    } finally {
      setSaving(false);
    }
  }

  if (loading || !school) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-10">
        <div className="h-40 bg-gray-100 rounded animate-pulse" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-10 space-y-8">
      <div className="flex items-center gap-4">
        <Link href="/admin/schools" className="text-sm text-blue-600 hover:underline">
          ← กลับ
        </Link>
        <h1 className="text-2xl font-bold">แก้ไขโรงเรียน</h1>
      </div>
      <section>
        <h2 className="font-semibold mb-3">โลโก้</h2>
        <LogoUpload schoolId={school.id} currentUrl={school.logoUrl} />
      </section>
      <SchoolForm initial={school} onSubmit={handleSubmit} loading={saving} submitLabel="บันทึกการแก้ไข" />
      <div>
        <Link href={`/admin/scores/${school.id}`} className="text-blue-600 hover:underline text-sm">
          ไปกรอกคะแนน →
        </Link>
      </div>
    </div>
  );
}
