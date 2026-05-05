'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import { setTokens } from '@/lib/auth';
import { toast } from 'sonner';
import { ChartBarIcon, MailIcon, EyeIcon, ArrowLeftIcon } from '@/components/Icons';

function LockIcon({ className = 'w-5 h-5' }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className} aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
    </svg>
  );
}

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [showPw, setShowPw] = useState(false);

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
    } catch (err) {
      const status = err.response?.status;
      const body = err.response?.data;
      const serverMsg =
        typeof body?.error === 'string'
          ? body.error
          : Array.isArray(body?.errors) && body.errors[0]?.msg
            ? body.errors[0].msg
            : null;
      if (status === 401) {
        toast.error('อีเมลหรือรหัสผ่านไม่ถูกต้อง');
      } else if (serverMsg) {
        toast.error(serverMsg);
      } else {
        toast.error('เข้าสู่ระบบไม่สำเร็จ กรุณาลองใหม่หรือตรวจการตั้งค่า API');
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center py-10 px-4 overflow-hidden">
      {/* Background */}
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-br from-navy-900 via-navy-800 to-navy-950"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -top-24 -right-24 h-80 w-80 rounded-full bg-gold-400/15 blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -bottom-32 -left-16 h-72 w-72 rounded-full bg-navy-400/20 blur-3xl"
        aria-hidden
      />

      <div className="relative z-10 w-full max-w-[420px] animate-slide-up">
        <div className="rounded-2xl border border-white/10 bg-white/[0.97] shadow-elevated backdrop-blur-xl dark:border-gray-700/80 dark:bg-gray-900/95">
          <div className="border-b border-gray-100/80 px-8 pt-8 pb-6 text-center dark:border-gray-800">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-navy-600 to-navy-800 text-white shadow-lg shadow-navy-900/25">
              <ChartBarIcon className="h-7 w-7" />
            </div>
            <h1 className="text-xl font-bold tracking-tight text-gray-900 sm:text-2xl dark:text-white">เข้าสู่ระบบ</h1>
            <p className="mt-1.5 text-sm text-gray-500 dark:text-gray-400">
              SCEE Rankings · <span className="text-navy-600 font-medium dark:text-navy-300">ผู้ดูแลระบบ</span>
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5 px-8 pb-8 pt-2">
            <div>
              <label htmlFor="login-email" className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                อีเมล
              </label>
              <div className="relative">
                <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                  <MailIcon className="h-5 w-5" />
                </span>
                <input
                  id="login-email"
                  type="email"
                  autoComplete="email"
                  placeholder="you@school.ac.th"
                  value={form.email}
                  required
                  onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
                  className="w-full rounded-xl border border-gray-200 bg-gray-50/80 py-2.5 pl-10 pr-3 text-gray-900 placeholder:text-gray-400 transition-colors focus:border-navy-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-navy-500/20 dark:border-gray-700 dark:bg-gray-950/80 dark:text-gray-100 dark:placeholder:text-gray-500 dark:focus:border-navy-400 dark:focus:bg-gray-950 dark:focus:ring-navy-500/30"
                />
              </div>
            </div>

            <div>
              <label htmlFor="login-password" className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                รหัสผ่าน
              </label>
              <div className="relative">
                <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                  <LockIcon className="h-5 w-5" />
                </span>
                <input
                  id="login-password"
                  type={showPw ? 'text' : 'password'}
                  autoComplete="current-password"
                  placeholder="••••••••"
                  value={form.password}
                  required
                  onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))}
                  className="w-full rounded-xl border border-gray-200 bg-gray-50/80 py-2.5 pl-10 pr-11 text-gray-900 placeholder:text-gray-400 transition-colors focus:border-navy-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-navy-500/20 dark:border-gray-700 dark:bg-gray-950/80 dark:text-gray-100 dark:placeholder:text-gray-500 dark:focus:border-navy-400 dark:focus:bg-gray-950 dark:focus:ring-navy-500/30"
                />
                <button
                  type="button"
                  onClick={() => setShowPw((v) => !v)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-800 dark:hover:text-gray-300"
                  aria-label={showPw ? 'ซ่อนรหัสผ่าน' : 'แสดงรหัสผ่าน'}
                >
                  <EyeIcon className="h-5 w-5" />
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="group relative w-full overflow-hidden rounded-xl bg-gradient-to-r from-navy-600 to-navy-700 py-3 text-sm font-semibold text-white shadow-md shadow-navy-900/20 transition-all hover:from-navy-700 hover:to-navy-800 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-50"
            >
              <span className="relative z-10">
                {loading ? 'กำลังเข้าสู่ระบบ…' : 'เข้าสู่ระบบ'}
              </span>
              <span
                className="absolute inset-0 bg-gradient-to-r from-gold-400/0 via-gold-300/10 to-gold-400/0 opacity-0 transition-opacity group-hover:opacity-100"
                aria-hidden
              />
            </button>

            <div className="flex flex-col gap-3 border-t border-gray-100 pt-5 sm:flex-row sm:items-center sm:justify-between dark:border-gray-800">
              <Link
                href="/"
                className="inline-flex items-center justify-center gap-1.5 text-sm text-gray-500 transition-colors hover:text-gray-800 sm:justify-start dark:text-gray-400 dark:hover:text-gray-200"
              >
                <ArrowLeftIcon className="h-4 w-4" />
                กลับหน้าหลัก
              </Link>
              <Link
                href="/admin/forgot-password"
                className="text-center text-sm font-medium text-navy-600 transition-colors hover:text-navy-800 sm:text-right dark:text-navy-300 dark:hover:text-navy-200"
              >
                ลืมรหัสผ่าน
              </Link>
            </div>
          </form>
        </div>

        <p className="mt-6 text-center text-xs text-white/45">
          Smart Classroom Equity Evaluation — ข้อมูลของคุณถูกเข้ารหัสระหว่างส่ง
        </p>
      </div>
    </div>
  );
}
