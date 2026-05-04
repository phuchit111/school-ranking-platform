'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSchoolPortal } from '@/contexts/SchoolPortalContext';

const links = [
  { href: '/school/dashboard', label: 'แดชบอร์ด' },
  { href: '/school/edit', label: 'ข้อมูลโรงเรียน' },
  { href: '/school/profile', label: 'หน้าโปรไฟล์โรงเรียน' },
  { href: '/school/scores', label: 'ดูคะแนนประเมิน' },
  { href: '/school/evidence', label: 'หลักฐาน' },
  { href: '/school/reports', label: 'รายงาน / ใบรับรอง' },
];

export default function SchoolPortalNav() {
  const { me, logout } = useSchoolPortal();
  const pathname = usePathname();

  return (
    <header className="bg-white border-b border-gray-200">
      <div className="max-w-5xl mx-auto px-4 py-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="text-xs text-gray-500 uppercase tracking-wide">พอร์ทัลโรงเรียน</div>
          <div className="font-semibold text-gray-900">{me.school?.name ?? 'โรงเรียน'}</div>
        </div>
        <nav className="flex flex-wrap gap-1 sm:gap-2 text-sm">
          {links.map((l) => {
            const active = pathname === l.href || pathname.startsWith(`${l.href}/`);
            return (
              <Link
                key={l.href}
                href={l.href}
                className={`px-3 py-1.5 rounded-md ${
                  active ? 'bg-blue-100 text-blue-800 font-medium' : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {l.label}
              </Link>
            );
          })}
        </nav>
        <button
          type="button"
          onClick={logout}
          className="text-sm border border-gray-300 rounded-md px-3 py-1.5 hover:bg-gray-50 self-start sm:self-center"
        >
          ออกจากระบบ
        </button>
      </div>
    </header>
  );
}
