import { SchoolPortalProvider } from '@/contexts/SchoolPortalContext';
import SchoolPortalNav from '@/components/school/SchoolPortalNav';

export default function SchoolPortalLayout({ children }) {
  return (
    <SchoolPortalProvider>
      <div className="min-h-screen bg-gray-50">
        <SchoolPortalNav />
        <div className="max-w-5xl mx-auto px-4 py-8">{children}</div>
      </div>
    </SchoolPortalProvider>
  );
}
