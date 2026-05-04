const prisma = require('../prisma');

const LEVEL_COPY = {
  A: { th: 'ระดับดีเด่น', en: 'Exemplary Smart Equity' },
  B: { th: 'ระดับดีมาก', en: 'Advanced Smart Equity' },
  C: { th: 'ระดับพัฒนา', en: 'Developing Smart Equity' },
  D: { th: 'ระดับเริ่มต้น', en: 'Basic Smart Equity' },
  E: { th: 'ระดับเข้าร่วม', en: 'Participating School' },
};

async function getReportStatus(schoolId) {
  const ack = await prisma.reportAcknowledgment.findUnique({
    where: { schoolId },
    include: { user: { select: { email: true } } },
  });
  return {
    acknowledged: Boolean(ack),
    acknowledgedAt: ack?.acknowledgedAt ?? null,
    acknowledgedByEmail: ack?.user?.email ?? null,
  };
}

async function acknowledgeReport(schoolId, userId) {
  return prisma.reportAcknowledgment.upsert({
    where: { schoolId },
    create: { schoolId, userId },
    update: { userId, acknowledgedAt: new Date() },
    include: { user: { select: { email: true } } },
  });
}

function certificateHtml(school, ranking) {
  const levelKey = ranking?.level && LEVEL_COPY[ranking.level] ? ranking.level : 'E';
  const copy = LEVEL_COPY[levelKey];
  const scoreText =
    ranking && ranking.totalScore != null ? Number(ranking.totalScore).toFixed(2) : '—';
  const rankText = ranking?.rank != null ? String(ranking.rank) : '—';
  const dateStr = new Date().toLocaleDateString('th-TH', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return `<!DOCTYPE html>
<html lang="th">
<head>
  <meta charset="utf-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1"/>
  <title>หนังสือรับรอง — ${escapeHtml(school.name)}</title>
  <style>
    body { font-family: 'Sarabun', 'Segoe UI', system-ui, sans-serif; max-width: 720px; margin: 2rem auto; padding: 1.5rem; color: #111; line-height: 1.6; }
    h1 { font-size: 1.35rem; text-align: center; margin-bottom: 0.25rem; }
    .sub { text-align: center; color: #444; font-size: 0.95rem; margin-bottom: 2rem; }
    .box { border: 2px solid #1e40af; border-radius: 12px; padding: 1.5rem 1.75rem; background: #f8fafc; }
    .row { margin: 0.5rem 0; }
    .label { color: #64748b; font-size: 0.85rem; }
    .footer { margin-top: 2rem; font-size: 0.8rem; color: #64748b; text-align: center; }
    @media print { body { margin: 0; } }
  </style>
</head>
<body>
  <h1>หนังสือรับรองเกียรติคุณ (ตัวอย่างจากระบบ)</h1>
  <p class="sub">Smart Classroom Equity — ระดับผลการประเมิน</p>
  <div class="box">
    <p class="row"><span class="label">ชื่อสถานศึกษา</span><br/><strong>${escapeHtml(school.name)}</strong>
    ${school.nameEn ? `<br/><span>${escapeHtml(school.nameEn)}</span>` : ''}</p>
    <p class="row"><span class="label">จังหวัด</span> ${escapeHtml(school.province)}</p>
    <p class="row"><span class="label">ระดับผลการประเมิน</span><br/>
      <strong>${escapeHtml(copy.th)}</strong> (${escapeHtml(copy.en)})</p>
    <p class="row"><span class="label">คะแนนรวม / อันดับ</span> ${escapeHtml(scoreText)} / ${escapeHtml(rankText)}</p>
    <p class="row"><span class="label">วันที่ออกเอกสาร</span> ${escapeHtml(dateStr)}</p>
  </div>
  <p class="footer">เอกสารนี้สร้างจากระบบ SCEE3 สำหรับดาวน์โหลดหรือพิมพ์เป็นหลักฐานภายในโรงเรียน<br/>
  การรับรองอย่างเป็นทางการจากกระทรวงศึกษาธิการเป็นไปตามประกาศและขั้นตอนของหน่วยงานต้นสังกัด</p>
</body>
</html>`;
}

function escapeHtml(s) {
  if (s == null) return '';
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

module.exports = {
  getReportStatus,
  acknowledgeReport,
  certificateHtml,
  LEVEL_COPY,
};
