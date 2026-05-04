'use client';

function ensureUrl(value) {
  if (!value) return null;
  return /^https?:\/\//i.test(value) ? value : `https://${value}`;
}

function Row({ icon, label, children }) {
  return (
    <div className="flex items-start gap-3 text-sm">
      <span className="shrink-0 inline-flex w-8 h-8 items-center justify-center rounded-full bg-blue-50 text-blue-600">
        {icon}
      </span>
      <div className="min-w-0">
        <div className="text-xs uppercase tracking-wider text-gray-500">{label}</div>
        <div className="text-gray-800 break-words">{children}</div>
      </div>
    </div>
  );
}

export default function ProfileContact({ school }) {
  const websiteUrl = ensureUrl(school.website);
  const facebookUrl = ensureUrl(school.facebookUrl);

  const hasAny =
    school.address ||
    school.phone ||
    school.contact ||
    school.website ||
    school.facebookUrl ||
    school.lineId;

  if (!hasAny) {
    return <p className="text-sm text-gray-500">ยังไม่มีข้อมูลติดต่อ</p>;
  }

  return (
    <div className="grid sm:grid-cols-2 gap-x-6 gap-y-4">
      {school.address ? (
        <Row icon={<span aria-hidden>📍</span>} label="ที่อยู่">
          <span className="whitespace-pre-line">{school.address}</span>
        </Row>
      ) : null}
      {school.phone ? (
        <Row icon={<span aria-hidden>☎️</span>} label="โทรศัพท์">
          <a href={`tel:${school.phone}`} className="text-blue-700 hover:underline">
            {school.phone}
          </a>
        </Row>
      ) : null}
      {websiteUrl ? (
        <Row icon={<span aria-hidden>🌐</span>} label="เว็บไซต์">
          <a
            href={websiteUrl}
            target="_blank"
            rel="noreferrer"
            className="text-blue-700 hover:underline break-all"
          >
            {school.website}
          </a>
        </Row>
      ) : null}
      {facebookUrl ? (
        <Row icon={<span aria-hidden>📘</span>} label="Facebook">
          <a
            href={facebookUrl}
            target="_blank"
            rel="noreferrer"
            className="text-blue-700 hover:underline break-all"
          >
            {school.facebookUrl}
          </a>
        </Row>
      ) : null}
      {school.lineId ? (
        <Row icon={<span aria-hidden>💬</span>} label="LINE">
          <span>{school.lineId}</span>
        </Row>
      ) : null}
      {school.contact ? (
        <Row icon={<span aria-hidden>📨</span>} label="ช่องทางติดต่ออื่น">
          <span className="whitespace-pre-line">{school.contact}</span>
        </Row>
      ) : null}
    </div>
  );
}
