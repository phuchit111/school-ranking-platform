import Link from 'next/link';
import { ChartBarIcon } from '@/components/Icons';

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-gray-200 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          {/* Brand */}
          <div className="flex items-center gap-2.5">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-navy-500 text-white">
              <ChartBarIcon className="w-4 h-4" />
            </div>
            <div>
              <span className="text-sm font-bold text-gray-900 tracking-tight">SCEE Rankings</span>
              <p className="text-xs text-gray-500 mt-0.5">
                Smart Classroom Equity Evaluation
              </p>
            </div>
          </div>

          {/* Links */}
          <nav className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-gray-500">
            <Link href="/" className="hover:text-gray-900 transition-colors">
              อันดับโรงเรียน
            </Link>
            <Link href="/school/register" className="hover:text-gray-900 transition-colors">
              ลงทะเบียนโรงเรียน
            </Link>
            <Link href="/admin/login" className="hover:text-gray-900 transition-colors">
              ผู้ดูแลระบบ
            </Link>
          </nav>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-gray-400">
            © {new Date().getFullYear()} SCEE — พื้นที่นำร่อง กรุงเทพมหานคร และจังหวัดสมุทรปราการ
          </p>
          <p className="text-xs text-gray-400">
            โรงเรียนประถมศึกษาและมัธยมศึกษา ภาครัฐและเอกชน
          </p>
        </div>
      </div>
    </footer>
  );
}
