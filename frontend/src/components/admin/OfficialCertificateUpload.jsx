'use client';

import { useState } from 'react';
import api from '@/lib/api';
import { toast } from 'sonner';

export default function OfficialCertificateUpload({ schoolId, hasPdf, onUploaded }) {
  const [loading, setLoading] = useState(false);

  async function handleFile(e) {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    const fd = new FormData();
    fd.append('pdf', file);
    setLoading(true);
    try {
      await api.post(`/api/upload/official-certificate-pdf/${schoolId}`, fd);
      toast.success('อัปโหลดใบรับรอง PDF แล้ว');
      onUploaded?.();
    } catch {
      toast.error('อัปโหลดไม่สำเร็จ');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-2">
      <p className="text-sm text-gray-600">
        อัปโหลดไฟล์ PDF ใบรับรองฉบับจริง เพื่อให้แอดมินโรงเรียนดาวน์โหลดจากเมนูรายงานเท่านั้น
        (หน้าโปรไฟล์สาธารณะไม่แสดงลิงก์ดาวน์โหลด)
      </p>
      {hasPdf ? (
        <p className="text-xs text-green-800 bg-green-50 border border-green-200 rounded-lg px-3 py-2">
          มีไฟล์ใบรับรองแล้ว — อัปโหลดใหม่จะแทนที่ไฟล์เดิม
        </p>
      ) : (
        <p className="text-xs text-amber-800 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
          ยังไม่มีไฟล์ใบรับรอง
        </p>
      )}
      <label className="cursor-pointer inline-block border rounded-lg px-4 py-2 text-sm hover:bg-gray-50">
        {loading ? 'กำลังอัปโหลด...' : 'เลือกไฟล์ PDF'}
        <input
          type="file"
          accept="application/pdf,.pdf"
          className="hidden"
          onChange={handleFile}
          disabled={loading}
        />
      </label>
    </div>
  );
}
