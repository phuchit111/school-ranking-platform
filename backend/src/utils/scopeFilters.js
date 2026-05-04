/**
 * กรองตามภาครัฐ / เอกชน (สอดคล้องค่า affiliation ในฟอร์ม)
 * ภาครัฐ: สพฐ., อปท. | เอกชน: เอกชน, สช.
 */
function applySectorFilter(where, sector) {
  if (!sector) return;
  const s = String(sector).toLowerCase();
  if (s === 'government') {
    where.affiliation = { in: ['สพฐ.', 'อปท.'] };
    return;
  }
  if (s === 'private') {
    where.affiliation = { in: ['เอกชน', 'สช.'] };
    return;
  }
}

module.exports = { applySectorFilter };
