'use client';

import { useState } from 'react';
import api from '@/lib/api';
import { toast } from 'sonner';
import Image from 'next/image';

function resolveLogoSrc(url) {
  if (!url) return null;
  if (url.startsWith('http')) return url;
  const base = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3005';
  const path = url.startsWith('/') ? url : `/${url}`;
  return `${base}${path}`;
}

export default function LogoUpload({ schoolId, currentUrl }) {
  const [preview, setPreview] = useState(() => resolveLogoSrc(currentUrl));
  const [loading, setLoading] = useState(false);

  async function handleFile(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    const formData = new FormData();
    formData.append('logo', file);
    setLoading(true);
    try {
      const { data } = await api.post(`/api/upload/logo/${schoolId}`, formData);
      setPreview(resolveLogoSrc(data.logoUrl));
      toast.success('อัปโหลดโลโก้สำเร็จ');
    } catch {
      toast.error('อัปโหลดล้มเหลว');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-2">
      {preview && (
        <Image
          src={preview}
          alt="logo"
          width={80}
          height={80}
          className="rounded border object-cover"
          unoptimized
        />
      )}
      <label className="cursor-pointer inline-block border rounded px-4 py-2 text-sm hover:bg-gray-50">
        {loading ? 'กำลังอัปโหลด...' : 'เลือกไฟล์โลโก้'}
        <input type="file" accept="image/*" className="hidden" onChange={handleFile} disabled={loading} />
      </label>
    </div>
  );
}
