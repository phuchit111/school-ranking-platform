'use client';

import Link from 'next/link';
import RankingTable from '@/components/ranking/RankingTable';
import RankingFilters from '@/components/ranking/RankingFilters';
import Top10Highlight from '@/components/ranking/Top10Highlight';
import { useState } from 'react';

export default function HomePage() {
  const [filters, setFilters] = useState({});
  return (
    <main className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <h1 className="text-3xl font-bold">อันดับโรงเรียน</h1>
        <Link
          href="/school/register"
          className="text-sm font-medium text-white bg-slate-800 hover:bg-slate-900 rounded-lg px-4 py-2"
        >
          ลงทะเบียนโรงเรียน
        </Link>
      </div>
      <Top10Highlight />
      <RankingFilters onChange={setFilters} />
      <RankingTable filters={filters} />
    </main>
  );
}
