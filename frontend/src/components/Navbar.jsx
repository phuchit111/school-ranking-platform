'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { MenuIcon, XIcon, ExternalLinkIcon } from '@/components/Icons';
import ThemeToggle from '@/components/ThemeToggle';

const NAV_LINKS = [
  { href: '/', label: 'อันดับโรงเรียน' },
  { href: '/about', label: 'เกี่ยวกับโครงการ' },
  { href: '/school/register', label: 'ลงทะเบียนโรงเรียน' },
];
const LOGO_SRC = '/images/logo/SCEE%20%20Smart%20Classroom%20%20Equity%20Excellence.png';

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
          : 'bg-white border-b border-muted-100 dark:bg-main-950 dark:border-main-800'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-28">
          {/* Brand */}
          <Link href="/" className="flex items-center group">
            <div className="h-16 w-56 transition-transform group-hover:scale-105">
              <Image src={LOGO_SRC} alt="SCEE logo" width={440} height={160} className="h-full w-full object-contain" />
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
                      ? 'bg-accent-50 text-accent-700 dark:bg-accent-950/50 dark:text-accent-200'
                      : 'text-muted-600 hover:text-main-950 hover:bg-muted-50 dark:text-muted-400 dark:hover:text-contrast dark:hover:bg-main-900/80'
                  }`}
                >
                  {l.label}
                </Link>
              );
            })}
            <Link
              href="/admin/login"
              className="ml-2 inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium text-accent-700 border border-accent-200 hover:bg-accent-50 transition-colors dark:text-accent-300 dark:border-accent-800 dark:hover:bg-accent-950/40"
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
              className="p-2 rounded-lg text-muted-600 hover:bg-muted-100 transition-colors dark:text-muted-400 dark:hover:bg-main-900"
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
        <div className="md:hidden border-t border-muted-100 bg-white animate-fade-in dark:border-main-800 dark:bg-main-950">
          <div className="px-4 py-3 space-y-1">
            {NAV_LINKS.map((l) => {
              const active = pathname === l.href;
              return (
                <Link
                  key={l.href}
                  href={l.href}
                  className={`block px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    active
                      ? 'bg-accent-50 text-accent-700 dark:bg-accent-950/50 dark:text-accent-200'
                      : 'text-muted-600 hover:bg-muted-50 dark:text-muted-400 dark:hover:bg-main-900/80'
                  }`}
                >
                  {l.label}
                </Link>
              );
            })}
            <Link
              href="/admin/login"
              className="block px-4 py-2.5 rounded-lg text-sm font-medium text-accent-700 hover:bg-accent-50 dark:text-accent-300 dark:hover:bg-accent-950/40"
            >
              เข้าสู่ระบบ
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
