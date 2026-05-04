'use client';

import Image from 'next/image';
import { resolveAssetUrl } from '@/lib/assets';
import { getLevelStyle } from '@/lib/level';

export default function ProfileBanner({ school }) {
  const bannerUrl = resolveAssetUrl(school.bannerUrl);
  const logoUrl = resolveAssetUrl(school.logoUrl);
  const level = school.ranking?.level;
  const style = level ? getLevelStyle(level) : null;

  return (
    <section className="relative">
      <div className="relative w-full aspect-[16/5] sm:aspect-[16/4] bg-gradient-to-br from-blue-100 via-sky-100 to-indigo-100 overflow-hidden rounded-b-2xl">
        {bannerUrl ? (
          <Image
            src={bannerUrl}
            alt={`แบนเนอร์โรงเรียน ${school.name}`}
            fill
            priority
            sizes="100vw"
            className="object-cover"
            unoptimized
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-blue-300 text-sm">
            ยังไม่มีภาพแบนเนอร์
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/15 to-transparent" />

        {level && style ? (
          <div className="absolute top-4 right-4 sm:top-6 sm:right-6">
            <div
              className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs sm:text-sm font-semibold shadow-sm ring-2 ring-white/40 backdrop-blur-sm ${style.badgeClass}`}
              title={style.title}
            >
              <span className={`inline-block w-2.5 h-2.5 rounded-full ${style.dotClass}`} />
              ระดับ {level} · {style.title}
            </div>
          </div>
        ) : null}
      </div>

      <div className="max-w-5xl mx-auto px-4 -mt-12 sm:-mt-16 relative z-10">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-5 sm:p-6 flex flex-col sm:flex-row gap-5 sm:items-center">
          <div className="shrink-0 w-20 h-20 sm:w-24 sm:h-24 rounded-xl border bg-white flex items-center justify-center overflow-hidden">
            {logoUrl ? (
              <Image
                src={logoUrl}
                alt={`โลโก้ ${school.name}`}
                width={96}
                height={96}
                className="object-contain"
                unoptimized
              />
            ) : (
              <div className="text-3xl text-gray-300">🏫</div>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 leading-tight">
              {school.name}
            </h1>
            {school.nameEn?.trim() ? (
              <p className="text-sm text-gray-500 mt-0.5">{school.nameEn}</p>
            ) : null}
            <div className="mt-3 flex flex-wrap items-center gap-2 text-sm">
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-gray-100 text-gray-700">
                <span aria-hidden>📍</span>
                {school.province}
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-gray-100 text-gray-700">
                <span aria-hidden>🏛️</span>
                สังกัด {school.affiliation}
              </span>
              {school.level ? (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-gray-100 text-gray-700">
                  <span aria-hidden>🎓</span>
                  {school.level}
                </span>
              ) : null}
            </div>
          </div>

          {level && style ? (
            <div
              className={`shrink-0 hidden sm:flex w-28 h-28 rounded-2xl items-center justify-center flex-col text-center shadow-md ${style.chipBg} ${style.textOnChip}`}
              title={`${style.title} (${style.englishTitle})`}
            >
              <div className="text-xs uppercase tracking-wider opacity-90">Level</div>
              <div className="text-4xl font-extrabold leading-none mt-0.5">{level}</div>
              <div className="text-xs mt-1 opacity-95">{style.title}</div>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
