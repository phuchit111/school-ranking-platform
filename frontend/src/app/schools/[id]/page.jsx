'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import api from '@/lib/api';
import { getLevelStyle } from '@/lib/level';
import ProfileBanner from '@/components/school/ProfileBanner';
import ProfileGallery from '@/components/school/ProfileGallery';
import ProfileCertificates from '@/components/school/ProfileCertificates';
import ProfileContact from '@/components/school/ProfileContact';
import {
  AwardIcon,
  ClipboardIcon,
  CameraIcon,
  TrophyIcon,
  PhoneIcon,
  SchoolIcon,
  AlertTriangleIcon,
  ArrowLeftIcon,
} from '@/components/Icons';

export default function SchoolProfilePage() {
  const params = useParams();
  const id = params?.id;
  const [school, setSchool] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) return;
    let cancelled = false;
    setLoading(true);
    api
      .get(`/api/schools/${id}`)
      .then(({ data }) => {
        if (!cancelled) {
          setSchool(data);
          setError(null);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setSchool(null);
          setError(err?.response?.status === 404 ? 'not_found' : 'error');
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [id]);

  if (loading) return <ProfileSkeleton />;
  if (error === 'not_found' || !school) return <NotFoundView />;
  if (error) return <ErrorView />;

  const level = school.ranking?.level;
  const style = level ? getLevelStyle(level) : null;

  return (
    <main className="min-h-screen bg-muted-50 pb-16 dark:bg-main-950">
      <div className="max-w-5xl mx-auto px-4 pt-4 text-sm">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-accent-600 hover:text-accent-800 transition-colors font-medium"
        >
          <ArrowLeftIcon className="w-3.5 h-3.5" />
          กลับไปอันดับโรงเรียน
        </Link>
      </div>

      <ProfileBanner school={school} />

      <div className="max-w-5xl mx-auto px-4 mt-8 grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Section title="ระดับผลการประเมิน" icon={<AwardIcon className="w-4 h-4" />}>
            {level && style ? (
              <div className="flex flex-wrap items-center gap-4">
                <div
                  className={`inline-flex w-16 h-16 items-center justify-center rounded-2xl text-2xl font-extrabold shadow ${style.chipBg} ${style.textOnChip}`}
                  title={style.title}
                >
                  {level}
                </div>
                <div>
                  <div className="text-lg font-semibold text-gray-900">
                    {style.title}
                  </div>
                  <div className="text-sm font-medium text-gray-700 mt-0.5">
                    {style.englishTitle}
                  </div>
                  <div className="text-sm text-gray-600 mt-0.5">
                    คะแนนรวม {school.ranking?.totalScore?.toFixed(2) ?? '—'} ·
                    อันดับที่ {school.ranking?.rank ?? '—'}
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-sm text-gray-500">
                ยังไม่ได้รับการประเมินคะแนน — โปรดรอการประกาศผล
              </p>
            )}
            {level && style ? <LevelRecognition style={style} /> : null}
            <LevelLegend current={level} />
          </Section>

          <Section title="คำอธิบายโรงเรียน" icon={<ClipboardIcon className="w-4 h-4" />}>
            {school.description ? (
              <p className="text-gray-800 leading-relaxed whitespace-pre-line">
                {school.description}
              </p>
            ) : (
              <p className="text-sm text-gray-500">ยังไม่มีคำอธิบาย</p>
            )}
          </Section>

          <Section title="กิจกรรม Smart Classroom" icon={<CameraIcon className="w-4 h-4" />} hint="(สูงสุด 5 ภาพ)">
            <ProfileGallery images={school.galleryImages || []} />
          </Section>

          <Section title="ใบรับรองและโล่รางวัล" icon={<TrophyIcon className="w-4 h-4" />}>
            <ProfileCertificates certificates={school.certificates || []} />
          </Section>
        </div>

        <aside className="space-y-6">
          <Section title="ข้อมูลติดต่อ" icon={<PhoneIcon className="w-4 h-4" />}>
            <ProfileContact school={school} />
          </Section>
        </aside>
      </div>
    </main>
  );
}

function Section({ title, icon, hint, children }) {
  return (
    <section className="bg-white border border-gray-100 rounded-2xl shadow-card p-5 sm:p-6">
      <div className="flex items-center gap-2.5 mb-4">
        <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-accent-50 text-accent-600 shrink-0">
          {icon}
        </div>
        <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
        {hint ? <span className="text-xs text-gray-500">{hint}</span> : null}
      </div>
      {children}
    </section>
  );
}

function LevelLegend({ current }) {
  const items = ['A', 'B', 'C', 'D', 'E'];
  return (
    <div className="mt-4 pt-4 border-t border-gray-100 flex flex-wrap gap-2 text-xs">
      {items.map((lv) => {
        const s = getLevelStyle(lv);
        const active = lv === current;
        return (
          <span
            key={lv}
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border ${
              active ? `${s.badgeClass} ring-2` : 'bg-gray-50 text-gray-600 border-gray-200'
            }`}
          >
            <span className={`inline-block w-2 h-2 rounded-full ${s.dotClass}`} />
            {lv} · {s.title}
          </span>
        );
      })}
    </div>
  );
}

function LevelRecognition({ style }) {
  return (
    <div className="mt-5 rounded-xl border border-gray-100 bg-gray-50 p-4">
      <div className="text-sm font-semibold text-gray-900">{style.documentTitle}</div>
      <ul className="mt-3 grid sm:grid-cols-2 gap-2 text-sm text-gray-700">
        {style.documents.map((item) => (
          <li key={item} className="flex items-start gap-2">
            <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-accent-600 shrink-0" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
      <div className="mt-3 text-xs text-gray-500">
        การรับรองโดย {style.certifier}
      </div>
      <p className="text-xs text-gray-500 mt-2">
        ใบรับรอง PDF ฉบับจริงให้แอดมินโรงเรียนดาวน์โหลดได้เมื่อเข้าสู่ระบบที่เมนูรายงานเท่านั้น
        (ไม่แสดงลิงก์ในหน้านี้)
      </p>
    </div>
  );
}

function ProfileSkeleton() {
  return (
    <main className="min-h-screen bg-muted-50 pb-16 animate-pulse dark:bg-main-950">
      <div className="w-full aspect-[16/5] bg-gray-200 rounded-b-2xl" />
      <div className="max-w-5xl mx-auto px-4 -mt-12 relative">
        <div className="bg-white rounded-2xl shadow border h-32" />
      </div>
      <div className="max-w-5xl mx-auto px-4 mt-8 grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white border rounded-2xl h-40" />
          ))}
        </div>
        <div className="bg-white border rounded-2xl h-72" />
      </div>
    </main>
  );
}

function NotFoundView() {
  return (
    <main className="min-h-screen bg-muted-50 flex items-center justify-center px-4 dark:bg-main-950">
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-muted-100 text-muted-400 mb-4">
          <SchoolIcon className="w-8 h-8" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900">ไม่พบหน้าโรงเรียนนี้</h1>
        <p className="text-gray-600 mt-2">
          อาจถูกลบ หรือยังไม่ได้รับการเผยแพร่ในระบบ
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 mt-6 bg-accent-600 text-contrast text-sm rounded-xl px-5 py-2.5 hover:bg-accent-700 transition-colors font-medium"
        >
          <ArrowLeftIcon className="w-3.5 h-3.5" />
          กลับไปอันดับโรงเรียน
        </Link>
      </div>
    </main>
  );
}

function ErrorView() {
  return (
    <main className="min-h-screen bg-muted-50 flex items-center justify-center px-4 dark:bg-main-950">
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-red-50 text-red-400 mb-4">
          <AlertTriangleIcon className="w-8 h-8" />
        </div>
        <p className="text-gray-700 font-medium">เกิดข้อผิดพลาดในการโหลดข้อมูล</p>
        <p className="text-sm text-gray-500 mt-1">กรุณาลองใหม่อีกครั้ง</p>
      </div>
    </main>
  );
}
