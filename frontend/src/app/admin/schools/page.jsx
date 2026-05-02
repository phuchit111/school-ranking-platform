'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import api from '@/lib/api';
import { toast } from 'sonner';

export default function AdminSchoolsPage() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    try {
      const { data } = await api.get('/api/schools/all', { params: { limit: 100 } });
      setRows(data.data);
    } catch {
      toast.error('โหลดข้อมูลไม่สำเร็จ');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function togglePublish(school) {
    try {
      await api.patch(`/api/schools/${school.id}/publish`, {
        isPublished: !school.isPublished,
      });
      toast.success('อัปเดตการเผยแพร่แล้ว');
      load();
    } catch {
      toast.error('อัปเดตไม่สำเร็จ');
    }
  }

  async function removeSchool(id) {
    if (!window.confirm('ลบโรงเรียนนี้?')) return;
    try {
      await api.delete(`/api/schools/${id}`);
      toast.success('ลบแล้ว');
      load();
    } catch {
      toast.error('ลบไม่สำเร็จ');
    }
  }

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-10">
        <div className="h-10 bg-gray-200 rounded animate-pulse max-w-md" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
        <h1 className="text-2xl font-bold">โรงเรียนทั้งหมด</h1>
        <div className="flex gap-2">
          <Link href="/admin/dashboard" className="text-sm border rounded px-4 py-2 hover:bg-gray-50">
            แดชบอร์ด
          </Link>
          <Link
            href="/admin/schools/create"
            className="text-sm bg-blue-600 text-white rounded px-4 py-2 hover:bg-blue-700"
          >
            + เพิ่มโรงเรียน
          </Link>
        </div>
      </div>
      <div className="overflow-x-auto border rounded-lg bg-white">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3">ชื่อ</th>
              <th className="p-3">จังหวัด</th>
              <th className="p-3">เผยแพร่</th>
              <th className="p-3 text-right">การจัดการ</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((s) => (
              <tr key={s.id} className="border-t">
                <td className="p-3 font-medium">{s.name}</td>
                <td className="p-3">{s.province}</td>
                <td className="p-3">
                  <button
                    type="button"
                    onClick={() => togglePublish(s)}
                    className={`text-xs px-2 py-1 rounded ${s.isPublished ? 'bg-green-100 text-green-800' : 'bg-gray-100'}`}
                  >
                    {s.isPublished ? 'เผยแพร่' : 'ซ่อน'}
                  </button>
                </td>
                <td className="p-3 text-right space-x-2 whitespace-nowrap">
                  <Link href={`/admin/schools/${s.id}/edit`} className="text-blue-600 hover:underline">
                    แก้ไข
                  </Link>
                  <Link href={`/admin/scores/${s.id}`} className="text-blue-600 hover:underline">
                    คะแนน
                  </Link>
                  <button type="button" onClick={() => removeSchool(s.id)} className="text-red-600 hover:underline">
                    ลบ
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {rows.length === 0 && <p className="text-gray-500 mt-6">ยังไม่มีโรงเรียน — เพิ่มจากปุ่มด้านบน</p>}
    </div>
  );
}
