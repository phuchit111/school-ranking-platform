'use client';

import Link from 'next/link';
import { useSchoolPortal } from '@/contexts/SchoolPortalContext';

export default function SchoolDashboardPage() {
  const { me } = useSchoolPortal();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">แดชบอร์ด</h1>
      <p className="text-gray-600">
        ยินดีต้อนรับ คุณเข้าสู่ระบบในฐานะผู้ดูแลข้อมูลของ{' '}
        <strong>{me.school?.name}</strong> ({me.school?.province})
      </p>
      <ul className="grid sm:grid-cols-2 gap-3">
        <li>
          <Link
            href="/school/edit"
            className="block border rounded-xl p-4 bg-white shadow-sm hover:border-blue-300"
          >
            <div className="font-medium">แก้ไขข้อมูลโรงเรียน</div>
            <p className="text-sm text-gray-500 mt-1">ชื่อ สังกัด จังหวัด ช่องทางติดต่อ</p>
          </Link>
        </li>
        <li>
          <Link
            href="/school/profile"
            className="block border rounded-xl p-4 bg-white shadow-sm hover:border-blue-300"
          >
            <div className="font-medium">หน้าโปรไฟล์โรงเรียน</div>
            <p className="text-sm text-gray-500 mt-1">
              แบนเนอร์ คำอธิบาย ภาพกิจกรรม ใบรับรอง/โล่รางวัล
            </p>
          </Link>
        </li>
        <li>
          <Link
            href="/school/scores"
            className="block border rounded-xl p-4 bg-white shadow-sm hover:border-blue-300"
          >
            <div className="font-medium">ดูคะแนนการประเมิน</div>
            <p className="text-sm text-gray-500 mt-1">หมวด A–E (บันทึกโดยผู้ดูแลระบบ)</p>
          </Link>
        </li>
        <li>
          <Link
            href="/school/evidence"
            className="block border rounded-xl p-4 bg-white shadow-sm hover:border-blue-300"
          >
            <div className="font-medium">อัปโหลดหลักฐาน</div>
            <p className="text-sm text-gray-500 mt-1">รูป PDF เอกสารประกอบ</p>
          </Link>
        </li>
        <li>
          <Link
            href="/school/reports"
            className="block border rounded-xl p-4 bg-white shadow-sm hover:border-blue-300"
          >
            <div className="font-medium">รายงาน / ใบรับรอง</div>
            <p className="text-sm text-gray-500 mt-1">รับทราบรายงาน ดาวน์โหลดหนังสือรับรอง</p>
          </Link>
        </li>
      </ul>
    </div>
  );
}
