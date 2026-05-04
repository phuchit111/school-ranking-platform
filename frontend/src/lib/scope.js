/** ข้อมูลขอบเขตโครงการ (1.6 ขอบเขตและพื้นที่ดำเนินงาน) */

/** พื้นที่นำร่อง — `value` ใช้เก็บในฐานข้อมูลและส่งไป API */
export const PILOT_PROVINCE_OPTIONS = [
  { value: 'กรุงเทพมหานคร', label: 'กรุงเทพมหานคร' },
  { value: 'สมุทรปราการ', label: 'จังหวัดสมุทรปราการ' },
];

export const PILOT_PROVINCES = PILOT_PROVINCE_OPTIONS.map((o) => o.value);

/** ตัวกรองหน้าอันดับ — ค่าว่าง = ไม่กรองจังหวัด */
export const PROVINCE_FILTER_OPTIONS = [
  { value: '', label: 'ทั้งหมด (จังหวัด)' },
  ...PILOT_PROVINCE_OPTIONS,
];

/** บรรทัดเดียวสำหรับ metadata / เอกสาร */
export const SCOPE_SUMMARY =
  'พื้นที่นำร่อง กรุงเทพมหานคร และจังหวัดสมุทรปราการ · โรงเรียนประถมศึกษาและมัธยมศึกษา ทั้งภาครัฐและเอกชน';

/** สังกัดตามข้อ 1.6 — แบ่งภาครัฐ / เอกชน */
export const AFFILIATION_GROUPS = [
  {
    label: 'ภาครัฐ',
    options: [
      { value: 'สพฐ.', label: 'สพฐ.' },
      { value: 'อปท.', label: 'อปท.' },
    ],
  },
  {
    label: 'ภาคเอกชน',
    options: [
      { value: 'เอกชน', label: 'เอกชน' },
      { value: 'สช.', label: 'สช.' },
    ],
  },
];

/** แบนรายการค่าทั้งหมด (ใช้ตรวจข้อมูลเดิม) */
export function flattenAffiliationValues() {
  return AFFILIATION_GROUPS.flatMap((g) => g.options.map((o) => o.value));
}
