'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { toast } from 'sonner';

export default function SchoolAdminInvite({ schoolId }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(false);

  async function refreshList() {
    try {
      const { data } = await api.get(`/api/schools/${schoolId}/admins`);
      setList(data);
    } catch {
      toast.error('โหลดรายการผู้ดูแลโรงเรียนไม่สำเร็จ');
    }
  }

  useEffect(() => {
    refreshList();
  }, [schoolId]);

  async function handleSubmit(e) {
    e.preventDefault();
    if (password.length < 6) {
      toast.error('รหัสผ่านอย่างน้อย 6 ตัวอักษร');
      return;
    }
    setLoading(true);
    try {
      await api.post(`/api/schools/${schoolId}/admins`, { email, password });
      toast.success('สร้างบัญชีผู้ดูแลโรงเรียนแล้ว');
      setEmail('');
      setPassword('');
      refreshList();
    } catch (err) {
      toast.error(err.response?.data?.error || 'สร้างบัญชีไม่สำเร็จ');
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="border rounded-xl p-6 bg-white space-y-4">
      <div>
        <h2 className="font-semibold text-lg">ผู้ดูแลโรงเรียน (School Admin)</h2>
        <p className="text-sm text-gray-600 mt-1">
          สร้างบัญชีให้โรงเรียนล็อกอินที่ /admin/login เพื่อแก้ไขข้อมูล กรอกคะแนน อัปโหลดหลักฐาน และรับทราบรายงาน
        </p>
      </div>
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 items-end flex-wrap">
        <div className="flex-1 min-w-[180px]">
          <label className="block text-xs text-gray-600 mb-1">อีเมล</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border rounded px-3 py-2 text-sm"
            placeholder="school@example.go.th"
          />
        </div>
        <div className="flex-1 min-w-[140px]">
          <label className="block text-xs text-gray-600 mb-1">รหัสผ่าน (เริ่มต้น)</label>
          <input
            type="password"
            required
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border rounded px-3 py-2 text-sm"
            placeholder="อย่างน้อย 6 ตัว"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="bg-slate-800 text-white px-4 py-2 rounded-lg text-sm hover:bg-slate-900 disabled:opacity-50"
        >
          {loading ? 'กำลังสร้าง...' : 'สร้างบัญชี'}
        </button>
      </form>
      {list.length > 0 && (
        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-2">บัญชีที่มีอยู่</h3>
          <ul className="text-sm border rounded divide-y">
            {list.map((u) => (
              <li key={u.id} className="px-3 py-2 flex justify-between gap-2">
                <span>{u.email}</span>
                <span className="text-gray-400 text-xs">
                  {new Date(u.createdAt).toLocaleDateString('th-TH')}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}
