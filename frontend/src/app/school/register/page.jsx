'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import api from '@/lib/api';
import { AFFILIATION_GROUPS, THAILAND_PROVINCE_OPTIONS } from '@/lib/scope';
import { ArrowLeftIcon } from '@/components/Icons';
import { toast } from 'sonner';

/** ฟิลด์พื้นขาว — บังคับสีตัวอักษรไม่ให้สืบทอด dark:text จาก body */
const FIELD =
  'w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 placeholder:text-gray-500 shadow-sm focus:border-navy-500 focus:outline-none focus:ring-2 focus:ring-navy-500/25 dark:bg-white dark:text-gray-900 dark:placeholder:text-gray-500';

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

  const provinceChoices = useMemo(() => [...THAILAND_PROVINCE_OPTIONS], []);

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
        <Link
          href="/"
          className="group inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-sm font-medium text-navy-700 shadow-sm transition-all hover:border-navy-200 hover:bg-navy-50 hover:text-navy-900 dark:border-gray-700 dark:bg-gray-900/60 dark:text-navy-200 dark:shadow-none dark:hover:border-navy-600 dark:hover:bg-navy-900/90 dark:hover:text-white"
        >
          <ArrowLeftIcon className="h-4 w-4 shrink-0 text-navy-500 transition-transform group-hover:-translate-x-0.5 dark:text-navy-300 dark:group-hover:text-white" />
          กลับหน้าอันดับ
        </Link>
        <h1 className="text-2xl font-bold mt-4 text-gray-900 dark:text-white">
          ลงทะเบียนโรงเรียน (รอการอนุมัติ)
        </h1>
        <p className="text-sm text-gray-600 mt-2 dark:text-gray-400">
          กรอกข้อมูลโรงเรียนและผู้ประสานงาน แอดมินจะอนุมัติและสร้างบัญชีเข้าใช้งานให้ หรือติดต่อกลับหากต้องการข้อมูลเพิ่ม
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-4 rounded-xl border border-gray-200 bg-white p-6 shadow-sm [color-scheme:light] dark:border-gray-700"
      >
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-200">
            ชื่อโรงเรียน (ภาษาไทย) *
          </label>
          <input
            type="text"
            required
            value={form.schoolName}
            onChange={(e) => setForm((p) => ({ ...p, schoolName: e.target.value }))}
            className={FIELD}
            placeholder="ชื่อเต็มโรงเรียน"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-200">
            ชื่อโรงเรียน (อังกฤษ)
          </label>
          <input
            type="text"
            value={form.nameEn}
            onChange={(e) => setForm((p) => ({ ...p, nameEn: e.target.value }))}
            className={FIELD}
            placeholder="ถ้ามี"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-200">จังหวัด *</label>
          <select
            required
            value={form.province}
            onChange={(e) => setForm((p) => ({ ...p, province: e.target.value }))}
            className={FIELD}
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
          <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-200">สังกัด *</label>
          <select
            required
            value={form.affiliation}
            onChange={(e) => setForm((p) => ({ ...p, affiliation: e.target.value }))}
            className={FIELD}
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
          <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-200">ระดับการศึกษา *</label>
          <select
            required
            value={form.level}
            onChange={(e) => setForm((p) => ({ ...p, level: e.target.value }))}
            className={FIELD}
          >
            <option value="">เลือกระดับ</option>
            <option value="ประถมศึกษา">ประถมศึกษา</option>
            <option value="มัธยมศึกษา">มัธยมศึกษา</option>
          </select>
        </div>

        <div className="mt-2 border-t border-gray-200 pt-4 dark:border-gray-600">
          <h2 className="mb-3 text-sm font-semibold text-gray-900 dark:text-gray-100">
            ผู้ประสานงานของโรงเรียน
          </h2>
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-200">
            ชื่อผู้ประสานงาน *
          </label>
          <input
            type="text"
            required
            value={form.coordinatorName}
            onChange={(e) => setForm((p) => ({ ...p, coordinatorName: e.target.value }))}
            className={FIELD}
            placeholder="ชื่อ–นามสกุล"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-200">
            อีเมล (ใช้เป็นบัญชีล็อกอิน) *
          </label>
          <input
            type="email"
            required
            autoComplete="email"
            value={form.coordinatorEmail}
            onChange={(e) => setForm((p) => ({ ...p, coordinatorEmail: e.target.value }))}
            className={FIELD}
            placeholder="school@example.go.th"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-200">เบอร์โทรศัพท์</label>
          <input
            type="text"
            inputMode="tel"
            value={form.coordinatorPhone}
            onChange={(e) => setForm((p) => ({ ...p, coordinatorPhone: e.target.value }))}
            className={FIELD}
            placeholder="0xx-xxx-xxxx"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-200">ข้อความถึงทีมงาน</label>
          <textarea
            value={form.message}
            onChange={(e) => setForm((p) => ({ ...p, message: e.target.value }))}
            rows={3}
            className={`${FIELD} resize-y`}
            placeholder="หมายเหตุหรือคำถามเพิ่มเติม (ถ้ามี)"
            maxLength={2000}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-slate-800 py-2.5 text-white hover:bg-slate-900 disabled:opacity-50 dark:bg-navy-600 dark:hover:bg-navy-700"
        >
          {loading ? 'กำลังส่ง...' : 'ส่งคำขอ'}
        </button>
      </form>
    </main>
  );
}
