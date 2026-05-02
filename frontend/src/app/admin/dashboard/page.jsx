'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import { clearTokens } from '@/lib/auth';
import { toast } from 'sonner';

export default function AdminDashboardPage() {
  const router = useRouter();

  async function handleLogout() {
    try {
      await api.post('/api/auth/logout');
    } catch {
      /* ignore */
    }
    clearTokens();
    toast.success('ออกจากระบบแล้ว');
    router.push('/admin/login');
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <h1 className="text-2xl font-bold">แดชบอร์ดผู้ดูแล</h1>
        <button
          type="button"
          onClick={handleLogout}
          className="text-sm border rounded px-4 py-2 hover:bg-gray-50"
        >
          ออกจากระบบ
        </button>
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        <Link
          href="/admin/schools"
          className="block border rounded-xl p-6 hover:border-blue-400 hover:bg-blue-50/50 transition"
        >
          <h2 className="font-semibold text-lg mb-1">จัดการโรงเรียน</h2>
          <p className="text-sm text-gray-600">เพิ่ม แก้ไข เผยแพร่ และลบข้อมูลโรงเรียน</p>
        </Link>
        <a
          href={`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3005'}/api/docs`}
          target="_blank"
          rel="noreferrer"
          className="block border rounded-xl p-6 hover:border-gray-400 hover:bg-gray-50 transition"
        >
          <h2 className="font-semibold text-lg mb-1">เอกสาร API (Swagger)</h2>
          <p className="text-sm text-gray-600">เปิดในแท็บใหม่</p>
        </a>
      </div>
    </div>
  );
}
