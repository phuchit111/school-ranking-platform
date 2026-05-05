'use client';

import { Toaster } from 'sonner';
import { useTheme } from '@/components/ThemeProvider';

export default function ThemedToaster() {
  const { theme, ready } = useTheme();
  return (
    <Toaster position="top-right" richColors theme={ready && theme === 'dark' ? 'dark' : 'light'} />
  );
}
