'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import { setTokens } from '@/lib/auth';
import { toast } from 'sonner';

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.post('/api/auth/login', form);
      setTokens(data.accessToken, data.refreshToken);
      toast.success('เข้าสู่ระบบสำเร็จ');
      if (data.user?.role === 'SCHOOL_ADMIN') {
        router.push('/school/dashboard');
      } else {
        router.push('/admin/dashboard');
      }
    } catch {
      toast.error('อีเมลหรือรหัสผ่านไม่ถูกต้อง');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-xl shadow w-full max-w-sm space-y-4"
      >
        <h1 className="text-2xl font-bold text-center">Admin Login</h1>
        <input
          type="email"
          placeholder="อีเมล"
          value={form.email}
          required
          onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
          className="w-full border rounded px-3 py-2"
        />
        <input
          type="password"
          placeholder="รหัสผ่าน"
          value={form.password}
          required
          onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))}
          className="w-full border rounded px-3 py-2"
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? 'กำลังเข้าสู่ระบบ...' : 'เข้าสู่ระบบ'}
        </button>
        <p className="text-center text-sm">
          <Link href="/admin/forgot-password" className="text-blue-600 hover:underline">
            ลืมรหัสผ่าน
          </Link>
        </p>
      </form>
    </div>
  );
}
