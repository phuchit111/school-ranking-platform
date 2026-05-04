/**
 * Visual configuration for assessment levels A–E shown on the
 * public School Profile Page.
 *
 * Spec (TOR):
 *   A = ทอง (Gold)
 *   B = เงิน (Silver)
 *   C = ทองแดง (Bronze)
 *   D = เทา (Gray)
 *   E = น้ำเงิน (Blue)
 */
export const LEVEL_PROFILE_STYLE = {
  A: {
    label: 'ทอง',
    title: 'ระดับดีเด่น',
    englishTitle: 'Exemplary Smart Equity',
    documentTitle: 'เอกสารรับรองระดับดีเด่น',
    documents: ['ใบรับรองเกียรติคุณ', 'โล่ประกาศเกียรติคุณ', 'ป้ายรับรองโรงเรียน'],
    certifier: 'กระทรวงศึกษาธิการ พร้อมลงนามโดยปลัดกระทรวงศึกษาธิการ',
    badgeClass: 'bg-amber-100 text-amber-900 border-amber-400 ring-amber-300',
    dotClass: 'bg-amber-400',
    chipBg: 'bg-gradient-to-br from-amber-400 to-yellow-600',
    textOnChip: 'text-white',
  },
  B: {
    label: 'เงิน',
    title: 'ระดับดีมาก',
    englishTitle: 'Advanced Smart Equity',
    documentTitle: 'เอกสารรับรองระดับดีมาก',
    documents: ['ใบรับรองเกียรติคุณ', 'โล่ประกาศเกียรติคุณ', 'ป้ายรับรองโรงเรียน'],
    certifier: 'กระทรวงศึกษาธิการ พร้อมลงนามโดยปลัดกระทรวงศึกษาธิการ',
    badgeClass: 'bg-slate-100 text-slate-800 border-slate-400 ring-slate-300',
    dotClass: 'bg-slate-300',
    chipBg: 'bg-gradient-to-br from-slate-300 to-slate-500',
    textOnChip: 'text-white',
  },
  C: {
    label: 'ทองแดง',
    title: 'ระดับพัฒนา',
    englishTitle: 'Developing Smart Equity',
    documentTitle: 'เอกสารรับรองระดับพัฒนา',
    documents: ['ใบรับรองเกียรติคุณ', 'โล่ประกาศเกียรติคุณ', 'ป้ายรับรองโรงเรียน'],
    certifier: 'กระทรวงศึกษาธิการ พร้อมลงนามโดยปลัดกระทรวงศึกษาธิการ',
    badgeClass: 'bg-orange-100 text-orange-900 border-orange-500 ring-orange-300',
    dotClass: 'bg-orange-500',
    chipBg: 'bg-gradient-to-br from-orange-500 to-amber-700',
    textOnChip: 'text-white',
  },
  D: {
    label: 'เทา',
    title: 'ระดับเริ่มต้น',
    englishTitle: 'Basic Smart Equity',
    documentTitle: 'เอกสารรับรองระดับเริ่มต้น',
    documents: ['ใบรับรองเกียรติคุณ', 'โล่ประกาศเกียรติคุณ'],
    certifier: 'กระทรวงศึกษาธิการ พร้อมลงนามโดยปลัดกระทรวงศึกษาธิการ',
    badgeClass: 'bg-gray-200 text-gray-800 border-gray-500 ring-gray-300',
    dotClass: 'bg-gray-500',
    chipBg: 'bg-gradient-to-br from-gray-400 to-gray-600',
    textOnChip: 'text-white',
  },
  E: {
    label: 'น้ำเงิน',
    title: 'ระดับเข้าร่วม',
    englishTitle: 'Participating School',
    documentTitle: 'เอกสารรับรองการเข้าร่วม',
    documents: ['ใบรับรองการเข้าร่วม (Certificate of Participation)'],
    certifier: 'EICD Office',
    badgeClass: 'bg-blue-100 text-blue-900 border-blue-500 ring-blue-300',
    dotClass: 'bg-blue-600',
    chipBg: 'bg-gradient-to-br from-blue-500 to-blue-700',
    textOnChip: 'text-white',
  },
};

export function getLevelStyle(level) {
  return LEVEL_PROFILE_STYLE[level] || LEVEL_PROFILE_STYLE.E;
}
