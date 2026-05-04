/** Normalize Thai school name for dedupe / unique key (trim, collapse spaces, lowercase). */
function normalizeSchoolName(value) {
  return String(value ?? '')
    .trim()
    .replace(/\s+/g, ' ')
    .toLowerCase();
}

module.exports = { normalizeSchoolName };
