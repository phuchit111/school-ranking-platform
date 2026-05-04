'use client';

import { useCallback, useEffect, useState } from 'react';
import api from '@/lib/api';
import { useSchoolPortal } from '@/contexts/SchoolPortalContext';
import { toast } from 'sonner';

export default function SchoolReportsPage() {
  const { schoolId } = useSchoolPortal();
  const [status, setStatus] = useState(undefined);
  const [school, setSchool] = useState(null);
  const [loading, setLoading] = useState(true);
  const [ackLoading, setAckLoading] = useState(false);
  const [pdfLoading, setPdfLoading] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [reportRes, schoolRes] = await Promise.all([
        api.get(`/api/schools/${schoolId}/report`),
        api.get(`/api/schools/${schoolId}`),
      ]);
      setStatus(reportRes.data);
      setSchool(schoolRes.data);
    } catch {
      toast.error('โหลดสถานะไม่สำเร็จ');
    } finally {
      setLoading(false);
    }
  }, [schoolId]);

  useEffect(() => {
    load();
  }, [load]);

  async function acknowledge() {
    setAckLoading(true);
    try {
      await api.post(`/api/schools/${schoolId}/report/acknowledge`);
      toast.success('บันทึกการรับทราบแล้ว');
      load();
    } catch {
      toast.error('ดำเนินการไม่สำเร็จ');
    } finally {
      setAckLoading(false);
    }
  }

  async function downloadOfficialPdf() {
    setPdfLoading(true);
    try {
      const res = await api.get(`/api/schools/${schoolId}/certificate/pdf`, {
        responseType: 'blob',
      });
      const blob = new Blob([res.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${school?.name || 'certificate'}-certificate.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
      toast.success('ดาวน์โหลดแล้ว');
    } catch {
      toast.error('ดาวน์โหลดไม่สำเร็จ — อาจยังไม่มีไฟล์หรือไม่มีสิทธิ์');
    } finally {
      setPdfLoading(false);
    }
  }

  async function openCertificateHtml() {
    try {
      const { data: html } = await api.get(`/api/schools/${schoolId}/certificate`, {
        responseType: 'text',
      });
      const w = window.open('', '_blank');
      if (w) {
        w.document.write(html);
        w.document.close();
      }
    } catch {
      toast.error('เปิดเอกสารไม่สำเร็จ');
    }
  }

  if (loading) {
    return <div className="h-32 bg-gray-100 rounded-lg animate-pulse" />;
  }
  if (status === null || status === undefined) {
    return <p className="text-red-600 text-sm">ไม่สามารถโหลดข้อมูลได้</p>;
  }

  const hasPdf = Boolean(school?.certificatePdfUrl);

  return (
    <div className="space-y-6 max-w-2xl">
      <h1 className="text-2xl font-bold">รายงานและเอกสารรับรอง</h1>
      <p className="text-sm text-gray-600">
        รับทราบรายงานผลการประเมินเชิงพัฒนา และดาวน์โหลดใบรับรอง PDF ที่หน่วยงานอัปโหลดให้ (เฉพาะแอดมินโรงเรียนและผู้ดูแลระบบ)
      </p>
      <p className="text-sm text-slate-700 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2">
        หมายเหตุ: รายงานผลการประเมินเชิงพัฒนา (Development Report) ฉบับจริงจากหน่วยงานอาจจัดส่งนอกระบบ —
        หน้านี้ใช้สำหรับรับทราบผลและจัดการไฟล์ใบรับรองที่เก็บในระบบเท่านั้น
      </p>
      <div className="border rounded-lg p-4 bg-white space-y-2">
        <h2 className="font-semibold">การรับทราบรายงาน</h2>
        {status.acknowledged ? (
          <p className="text-sm text-green-800">
            รับทราบแล้ว เมื่อ{' '}
            {status.acknowledgedAt
              ? new Date(status.acknowledgedAt).toLocaleString('th-TH')
              : '—'}
            {status.acknowledgedByEmail ? ` (${status.acknowledgedByEmail})` : ''}
          </p>
        ) : (
          <p className="text-sm text-gray-600">ยังไม่มีการกดรับทราบ</p>
        )}
        <button
          type="button"
          onClick={acknowledge}
          disabled={ackLoading}
          className="mt-2 bg-slate-800 text-white px-4 py-2 rounded-lg text-sm hover:bg-slate-900 disabled:opacity-50"
        >
          {ackLoading ? 'กำลังบันทึก...' : 'รับทราบรายงาน'}
        </button>
      </div>
      <div className="border rounded-lg p-4 bg-white space-y-3">
        <h2 className="font-semibold">ใบรับรอง PDF (ฉบับจริง)</h2>
        <p className="text-sm text-gray-600">
          ไฟล์ PDF ที่หน่วยงานอัปโหลดในระบบ — ดาวน์โหลดได้เฉพาะเมื่อเข้าสู่ระบบในฐานะแอดมินโรงเรียนนี้ (ไม่แสดงในหน้าโปรไฟล์สาธารณะ)
        </p>
        {hasPdf ? (
          <button
            type="button"
            onClick={downloadOfficialPdf}
            disabled={pdfLoading}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 disabled:opacity-50"
          >
            {pdfLoading ? 'กำลังดาวน์โหลด...' : 'ดาวน์โหลดใบรับรอง PDF'}
          </button>
        ) : (
          <p className="text-sm text-amber-800 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
            ยังไม่มีไฟล์ใบรับรองในระบบ — โปรดรอผู้ดูแลระบบอัปโหลดให้
          </p>
        )}
      </div>
      <div className="border rounded-lg p-4 bg-white space-y-2">
        <h2 className="font-semibold">หนังสือรับรองตัวอย่างจากระบบ (HTML)</h2>
        <p className="text-sm text-gray-600">
          เปิดในหน้าต่างใหม่ แล้วใช้พิมพ์หรือบันทึกเป็น PDF จากเบราว์เซอร์ (ข้อมูลจากระบบ — ไม่ใช่ไฟล์ที่หน่วยงานอัปโหลด)
        </p>
        <button
          type="button"
          onClick={openCertificateHtml}
          className="bg-gray-100 text-gray-900 border border-gray-300 px-4 py-2 rounded-lg text-sm hover:bg-gray-50"
        >
          เปิดตัวอย่าง HTML
        </button>
      </div>
    </div>
  );
}
