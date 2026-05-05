'use client';

import { MoonIcon, SunIcon } from '@/components/Icons';
import { useTheme } from '@/components/ThemeProvider';

export default function ThemeToggle() {
  const { theme, toggle, ready } = useTheme();

  return (
    <button
      type="button"
      onClick={toggle}
      disabled={!ready}
      className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-muted-200 bg-white text-muted-600 transition-colors hover:bg-muted-50 hover:text-main-950 disabled:opacity-40 dark:border-main-700 dark:bg-main-900 dark:text-muted-300 dark:hover:bg-main-800 dark:hover:text-contrast"
      aria-label={theme === 'dark' ? 'สลับเป็นโหมดสว่าง' : 'สลับเป็นโหมดมืด'}
      title={theme === 'dark' ? 'โหมดสว่าง' : 'โหมดมืด'}
    >
      {theme === 'dark' ? <SunIcon className="h-5 w-5" /> : <MoonIcon className="h-5 w-5" />}
    </button>
  );
}
