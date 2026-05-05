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
      className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-600 transition-colors hover:bg-gray-50 hover:text-gray-900 disabled:opacity-40 dark:border-gray-700 dark:bg-gray-900 dark:text-amber-200/90 dark:hover:bg-gray-800 dark:hover:text-amber-100"
      aria-label={theme === 'dark' ? 'สลับเป็นโหมดสว่าง' : 'สลับเป็นโหมดมืด'}
      title={theme === 'dark' ? 'โหมดสว่าง' : 'โหมดมืด'}
    >
      {theme === 'dark' ? <SunIcon className="h-5 w-5" /> : <MoonIcon className="h-5 w-5" />}
    </button>
  );
}
