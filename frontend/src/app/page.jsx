'use client';

import Top10Highlight from '@/components/ranking/Top10Highlight';
import RankingFilters from '@/components/ranking/RankingFilters';
import RankingTable from '@/components/ranking/RankingTable';
import { useState } from 'react';
import { ChartBarIcon, SchoolIcon } from '@/components/Icons';

export default function HomePage() {
  const [filters, setFilters] = useState({});

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-main-700 via-main-800 to-main-950 overflow-hidden">
        {/* Subtle pattern overlay */}
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }} />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-20">
          <div className="text-center max-w-3xl mx-auto">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/18 backdrop-blur-md border border-white/28 text-xs font-semibold text-white mb-6 shadow-sm">
              <SchoolIcon className="w-3.5 h-3.5 text-white" />
              ครอบคลุมทุกจังหวัดทั่วราชอาณาจักรไทย
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white leading-tight tracking-tight text-balance">
              อันดับโรงเรียน
              <span className="block mt-1 text-[#F8FAFF]">
                Smart Classroom Equity
              </span>
            </h1>

            <p className="mt-4 text-base sm:text-lg text-white/60 max-w-xl mx-auto leading-relaxed">
              จัดอันดับโรงเรียนประถมศึกษาและมัธยมศึกษา ทั้งภาครัฐและเอกชน ตามเกณฑ์ SCEE
            </p>

            {/* Stats */}
            <div className="flex items-center justify-center gap-6 sm:gap-10 mt-8">
              <div className="text-center">
                <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-white/10 mx-auto mb-2">
                  <ChartBarIcon className="w-5 h-5 text-accent-400" />
                </div>
                <div className="text-sm font-medium text-white/70">ระดับ A–E</div>
              </div>
              <div className="w-px h-10 bg-white/10" />
              <div className="text-center">
                <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-white/10 mx-auto mb-2">
                  <SchoolIcon className="w-5 h-5 text-accent-400" />
                </div>
                <div className="text-sm font-medium text-white/70">ภาครัฐ & เอกชน</div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom wave */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-8 sm:h-12">
            <path
              d="M0 48h1440V24c-240-32-480-32-720 0S240-8 0 24v24z"
              className="fill-muted-50 dark:fill-main-950"
            />
          </svg>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <Top10Highlight />
        <RankingFilters onChange={setFilters} />
        <RankingTable filters={filters} />
      </div>
    </main>
  );
}
