'use client';

import { useCallback, useEffect, useState } from 'react';
import Image from 'next/image';
import api from '@/lib/api';
import { toast } from 'sonner';
import { resolveAssetUrl } from '@/lib/assets';

const MAX_IMAGES = 5;

export default function GalleryManager({ schoolId }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [caption, setCaption] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.get(`/api/schools/${schoolId}/gallery`);
      setItems(data);
    } catch {
      toast.error('โหลดภาพกิจกรรมไม่สำเร็จ');
    } finally {
      setLoading(false);
    }
  }, [schoolId]);

  useEffect(() => {
    load();
  }, [load]);

  async function onFile(e) {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    if (items.length >= MAX_IMAGES) {
      toast.error(`อัปโหลดได้สูงสุด ${MAX_IMAGES} ภาพ`);
      return;
    }
    const fd = new FormData();
    fd.append('image', file);
    if (caption) fd.append('caption', caption);
    setUploading(true);
    try {
      await api.post(`/api/upload/gallery/${schoolId}`, fd);
      toast.success('อัปโหลดสำเร็จ');
      setCaption('');
      load();
    } catch (err) {
      toast.error(err?.response?.data?.error || 'อัปโหลดไม่สำเร็จ');
    } finally {
      setUploading(false);
    }
  }

  async function remove(id) {
    if (!window.confirm('ลบภาพนี้?')) return;
    try {
      await api.delete(`/api/schools/${schoolId}/gallery/${id}`);
      toast.success('ลบแล้ว');
      load();
    } catch {
      toast.error('ลบไม่สำเร็จ');
    }
  }

  const remaining = MAX_IMAGES - items.length;

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-end gap-3">
        <div className="flex-1">
          <label className="block text-xs font-medium text-gray-600 mb-1">
            คำบรรยายภาพ (ไม่บังคับ)
          </label>
          <input
            type="text"
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            placeholder="เช่น กิจกรรมห้องเรียนต้นแบบ 2025"
            maxLength={200}
            className="w-full border rounded-lg px-3 py-2 text-sm"
          />
        </div>
        <label
          className={`cursor-pointer inline-flex items-center justify-center border rounded-lg px-4 py-2 text-sm whitespace-nowrap ${
            remaining <= 0 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'hover:bg-gray-50'
          }`}
        >
          {uploading ? 'กำลังอัปโหลด...' : remaining > 0 ? `+ เพิ่มภาพ (เหลือ ${remaining})` : 'ครบ 5 ภาพแล้ว'}
          <input
            type="file"
            accept="image/*"
            className="hidden"
            disabled={uploading || remaining <= 0}
            onChange={onFile}
          />
        </label>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="aspect-square bg-gray-100 rounded-lg animate-pulse" />
          ))}
        </div>
      ) : items.length === 0 ? (
        <p className="text-sm text-gray-500">ยังไม่มีภาพกิจกรรม</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {items.map((img) => {
            const url = resolveAssetUrl(img.url);
            return (
              <div key={img.id} className="relative group rounded-lg border overflow-hidden bg-gray-50">
                <div className="relative aspect-square">
                  {url ? (
                    <Image
                      src={url}
                      alt={img.caption || 'gallery'}
                      fill
                      sizes="(max-width: 640px) 50vw, 20vw"
                      className="object-cover"
                      unoptimized
                    />
                  ) : null}
                </div>
                {img.caption ? (
                  <div className="p-1.5 text-xs text-gray-700 truncate" title={img.caption}>
                    {img.caption}
                  </div>
                ) : null}
                <button
                  type="button"
                  onClick={() => remove(img.id)}
                  className="absolute top-1.5 right-1.5 bg-white/90 text-red-600 text-xs px-2 py-1 rounded shadow opacity-0 group-hover:opacity-100 hover:bg-white"
                  aria-label="ลบภาพ"
                >
                  ลบ
                </button>
              </div>
            );
          })}
        </div>
      )}
      <p className="text-xs text-gray-500">อัปโหลดได้สูงสุด {MAX_IMAGES} ภาพ · ขนาดไฟล์ตามนโยบายระบบ</p>
    </div>
  );
}
