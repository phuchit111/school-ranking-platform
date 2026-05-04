import './globals.css';
import { Toaster } from 'sonner';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export const metadata = {
  title: 'SCEE Rankings — อันดับโรงเรียน Smart Classroom Equity',
  description:
    'จัดอันดับโรงเรียนตามเกณฑ์ Smart Classroom Equity Evaluation — พื้นที่นำร่อง กรุงเทพมหานคร และจังหวัดสมุทรปราการ',
};

export default function RootLayout({ children }) {
  return (
    <html lang="th">
      <body className="flex flex-col min-h-screen">
        <Navbar />
        <div className="flex-1">{children}</div>
        <Footer />
        <Toaster position="top-right" richColors />
      </body>
    </html>
  );
}
