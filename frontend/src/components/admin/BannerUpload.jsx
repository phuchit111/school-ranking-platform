'use client';

import { useState } from 'react';
import Image from 'next/image';
import api from '@/lib/api';
import { toast } from 'sonner';
import { resolveAssetUrl } from '@/lib/assets';

export default function BannerUpload({ schoolId, currentUrl, onChange }) {
  const [preview, setPreview] = useState(() => resolveAssetUrl(currentUrl));
  const [loading, setLoading] = useState(false);

  async function handleFile(e) {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    const fd = new FormData();
    fd.append('banner', file);
    setLoading(true);
    try {
      const { data } = await api.post(`/api/upload/banner/${schoolId}`, fd);
      const url = resolveAssetUrl(data.bannerUrl);
      setPreview(url);
      onChange?.(data.bannerUrl);
      toast.success('อัปโหลดแบนเนอร์สำเร็จ');
    } catch {
      toast.error('อัปโหลดแบนเนอร์ล้มเหลว');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-3">
      <div className="relative w-full aspect-[16/5] bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl overflow-hidden border">
        {preview ? (
          <Image src={preview} alt="banner" fill sizes="100vw" className="object-cover" unoptimized />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-sm text-gray-400">
            ยังไม่มีแบนเนอร์ — อัตราส่วนแนะนำ 16:5 (เช่น 1600 × 500)
          </div>
        )}
      </div>
      <label className="cursor-pointer inline-block border rounded-lg px-4 py-2 text-sm hover:bg-gray-50">
        {loading ? 'กำลังอัปโหลด...' : 'เลือกภาพแบนเนอร์'}
        <input
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFile}
          disabled={loading}
        />
      </label>
    </div>
  );
}
