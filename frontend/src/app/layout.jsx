import './globals.css';
import Script from 'next/script';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { ThemeProvider } from '@/components/ThemeProvider';
import ThemedToaster from '@/components/ThemedToaster';
import { THEME_INIT_SCRIPT } from '@/lib/themeInitScript';

export const metadata = {
  title: 'SCEE Rankings — อันดับโรงเรียน Smart Classroom Equity',
  description:
    'จัดอันดับโรงเรียนตามเกณฑ์ Smart Classroom Equity Evaluation — ทุกจังหวัดทั่วราชอาณาจักรไทย',
};

export default function RootLayout({ children }) {
  return (
    <html lang="th" suppressHydrationWarning>
      <body className="flex min-h-screen flex-col bg-muted-50 text-main-950 antialiased transition-colors dark:bg-main-950 dark:text-muted-100">
        <Script id="theme-init" strategy="beforeInteractive">
          {THEME_INIT_SCRIPT}
        </Script>
        <ThemeProvider>
          <Navbar />
          <div className="flex-1">{children}</div>
          <Footer />
          <ThemedToaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
