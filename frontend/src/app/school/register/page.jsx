'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import api from '@/lib/api';
import { AFFILIATION_GROUPS, PILOT_PROVINCE_OPTIONS } from '@/lib/scope';
import { toast } from 'sonner';

export default function SchoolRegisterPage() {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    schoolName: '',
    nameEn: '',
    province: '',
    affiliation: '',
    level: '',
    coordinatorName: '',
    coordinatorEmail: '',
    coordinatorPhone: '',
    message: '',
  });

  const provinceChoices = useMemo(() => [...PILOT_PROVINCE_OPTIONS], []);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/api/school-applications', form);
      toast.success('ส่งคำขอแล้ว ทีมงานจะตรวจสอบและติดต่อกลับทางอีเมล');
      setForm({
        schoolName: '',
        nameEn: '',
        province: '',
        affiliation: '',
        level: '',
        coordinatorName: '',
        coordinatorEmail: '',
        coordinatorPhone: '',
        message: '',
      });
    } catch (err) {
      const msg =
        err.response?.data?.error ||
        err.response?.data?.errors?.[0]?.msg ||
        'ส่งคำขอไม่สำเร็จ';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="max-w-xl mx-auto px-4 py-10">
      <div className="mb-6">
        <Link href="/" className="text-sm text-blue-600 hover:underline">
          ← กลับหน้าอันดับ
        </Link>
        <h1 className="text-2xl font-bold mt-4">ลงทะเบียนโรงเรียน (รอการอนุมัติ)</h1>
        <p className="text-sm text-gray-600 mt-2">
          กรอกข้อมูลโรงเรียนและผู้ประสานงาน แอดมินจะอนุมัติและสร้างบัญชีเข้าใช้งานให้ หรือติดต่อกลับหากต้องการข้อมูลเพิ่ม
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 bg-white border rounded-xl p-6 shadow-sm">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">ชื่อโรงเรียน (ภาษาไทย) *</label>
          <input
            type="text"
            required
            value={form.schoolName}
            onChange={(e) => setForm((p) => ({ ...p, schoolName: e.target.value }))}
            className="w-full border rounded px-3 py-2"
            placeholder="ชื่อเต็มโรงเรียน"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">ชื่อโรงเรียน (อังกฤษ)</label>
          <input
            type="text"
            value={form.nameEn}
            onChange={(e) => setForm((p) => ({ ...p, nameEn: e.target.value }))}
            className="w-full border rounded px-3 py-2"
            placeholder="ถ้ามี"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">จังหวัด *</label>
          <select
            required
            value={form.province}
            onChange={(e) => setForm((p) => ({ ...p, province: e.target.value }))}
            className="w-full border rounded px-3 py-2 bg-white"
          >
            <option value="">เลือกจังหวัด</option>
            {provinceChoices.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">สังกัด *</label>
          <select
            required
            value={form.affiliation}
            onChange={(e) => setForm((p) => ({ ...p, affiliation: e.target.value }))}
            className="w-full border rounded px-3 py-2 bg-white"
          >
            <option value="">เลือกสังกัด</option>
            {AFFILIATION_GROUPS.map((group) => (
              <optgroup key={group.label} label={group.label}>
                {group.options.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </optgroup>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">ระดับการศึกษา *</label>
          <select
            required
            value={form.level}
            onChange={(e) => setForm((p) => ({ ...p, level: e.target.value }))}
            className="w-full border rounded px-3 py-2 bg-white"
          >
            <option value="">เลือกระดับ</option>
            <option value="ประถมศึกษา">ประถมศึกษา</option>
            <option value="มัธยมศึกษา">มัธยมศึกษา</option>
          </select>
        </div>

        <div className="border-t pt-4 mt-2">
          <h2 className="text-sm font-semibold text-gray-900 mb-3">ผู้ประสานงานของโรงเรียน</h2>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">ชื่อผู้ประสานงาน *</label>
          <input
            type="text"
            required
            value={form.coordinatorName}
            onChange={(e) => setForm((p) => ({ ...p, coordinatorName: e.target.value }))}
            className="w-full border rounded px-3 py-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">อีเมล (ใช้เป็นบัญชีล็อกอิน) *</label>
          <input
            type="email"
            required
            autoComplete="email"
            value={form.coordinatorEmail}
            onChange={(e) => setForm((p) => ({ ...p, coordinatorEmail: e.target.value }))}
            className="w-full border rounded px-3 py-2"
            placeholder="school@example.go.th"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">เบอร์โทรศัพท์</label>
          <input
            type="text"
            inputMode="tel"
            value={form.coordinatorPhone}
            onChange={(e) => setForm((p) => ({ ...p, coordinatorPhone: e.target.value }))}
            className="w-full border rounded px-3 py-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">ข้อความถึงทีมงาน</label>
          <textarea
            value={form.message}
            onChange={(e) => setForm((p) => ({ ...p, message: e.target.value }))}
            rows={3}
            className="w-full border rounded px-3 py-2 resize-y"
            placeholder="หมายเหตุหรือคำถามเพิ่มเติม (ถ้ามี)"
            maxLength={2000}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-slate-800 text-white py-2.5 rounded-lg hover:bg-slate-900 disabled:opacity-50"
        >
          {loading ? 'กำลังส่ง...' : 'ส่งคำขอ'}
        </button>
      </form>
    </main>
  );
}
