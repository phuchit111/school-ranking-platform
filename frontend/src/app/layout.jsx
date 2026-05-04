import './globals.css';
import { Toaster } from 'sonner';

export const metadata = {
  title: 'School Ranking Platform',
  description:
    'พื้นที่นำร่อง กรุงเทพมหานคร และจังหวัดสมุทรปราการ — โรงเรียนประถมศึกษาและมัธยมศึกษา ภาครัฐและเอกชน',
};

export default function RootLayout({ children }) {
  return (
    <html lang="th">
      <body>
        {children}
        <Toaster position="top-right" richColors />
      </body>
    </html>
  );
}
