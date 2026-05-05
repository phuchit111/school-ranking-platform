'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChartBarIcon, MenuIcon, XIcon, ExternalLinkIcon } from '@/components/Icons';
import ThemeToggle from '@/components/ThemeToggle';

const NAV_LINKS = [
  { href: '/', label: 'อันดับโรงเรียน' },
  { href: '/about', label: 'เกี่ยวกับโครงการ' },
  { href: '/school/register', label: 'ลงทะเบียนโรงเรียน' },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'glass-nav shadow-sm'
          : 'bg-white border-b border-gray-100 dark:bg-gray-950 dark:border-gray-800'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-navy-500 text-white transition-transform group-hover:scale-105">
              <ChartBarIcon className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-bold text-gray-900 leading-tight tracking-tight dark:text-white">
                SCEE
              </span>
              <span className="text-[10px] font-medium text-gray-500 leading-none -mt-0.5 tracking-wide uppercase dark:text-gray-400">
                Rankings
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map((l) => {
              const active = pathname === l.href;
              return (
                <Link
                  key={l.href}
                  href={l.href}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    active
                      ? 'bg-navy-50 text-navy-700 dark:bg-navy-900/50 dark:text-navy-200'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-800/80'
                  }`}
                >
                  {l.label}
                </Link>
              );
            })}
            <Link
              href="/admin/login"
              className="ml-2 inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium text-navy-600 border border-navy-200 hover:bg-navy-50 transition-colors dark:text-navy-300 dark:border-navy-700 dark:hover:bg-navy-900/40"
            >
              เข้าสู่ระบบ
              <ExternalLinkIcon className="w-3.5 h-3.5" />
            </Link>
            <ThemeToggle />
          </nav>

          {/* Mobile: เมนูแล้วตามด้วยโหมดขาวดำที่ขวาสุด */}
          <div className="flex items-center gap-1 md:hidden">
            <button
              type="button"
              onClick={() => setOpen(!open)}
              className="p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors dark:text-gray-400 dark:hover:bg-gray-800"
              aria-label="เปิดเมนู"
            >
              {open ? <XIcon className="w-5 h-5" /> : <MenuIcon className="w-5 h-5" />}
            </button>
            <ThemeToggle />
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden border-t border-gray-100 bg-white animate-fade-in dark:border-gray-800 dark:bg-gray-950">
          <div className="px-4 py-3 space-y-1">
            {NAV_LINKS.map((l) => {
              const active = pathname === l.href;
              return (
                <Link
                  key={l.href}
                  href={l.href}
                  className={`block px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    active
                      ? 'bg-navy-50 text-navy-700 dark:bg-navy-900/50 dark:text-navy-200'
                      : 'text-gray-600 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-800/80'
                  }`}
                >
                  {l.label}
                </Link>
              );
            })}
            <Link
              href="/admin/login"
              className="block px-4 py-2.5 rounded-lg text-sm font-medium text-navy-600 hover:bg-navy-50 dark:text-navy-300 dark:hover:bg-navy-900/40"
            >
              เข้าสู่ระบบ
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
