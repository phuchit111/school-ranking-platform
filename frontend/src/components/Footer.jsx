import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-main-800 bg-main text-contrast dark:border-main-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-end gap-6">
          {/* Links */}
          <nav className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-contrast/75">
            <Link href="/" className="transition-colors hover:text-contrast">
              อันดับโรงเรียน
            </Link>
            <Link href="/about" className="transition-colors hover:text-contrast">
              เกี่ยวกับโครงการ
            </Link>
            <Link href="/school/register" className="transition-colors hover:text-contrast">
              ลงทะเบียนโรงเรียน
            </Link>
            <Link href="/admin/login" className="transition-colors hover:text-contrast">
              ผู้ดูแลระบบ
            </Link>
          </nav>
        </div>

        <div className="mt-8 pt-6 border-t border-contrast/10 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-contrast/55">
            © {new Date().getFullYear()} SCEE — ครอบคลุมทุกจังหวัดทั่วราชอาณาจักรไทย
          </p>
          <p className="text-xs text-contrast/55">
            โรงเรียนประถมศึกษาและมัธยมศึกษา ภาครัฐและเอกชน
          </p>
        </div>
      </div>
    </footer>
  );
}
