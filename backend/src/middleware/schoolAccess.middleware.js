/**
 * @param {string} paramName Express route param holding school UUID (e.g. 'id', 'schoolId')
 */
function requireSchoolAccess(paramName = 'id') {
  return (req, res, next) => {
    const schoolId = req.params[paramName];
    if (!schoolId) return res.status(400).json({ error: 'Missing school id' });
    if (req.user.role === 'ADMIN') return next();
    if (req.user.role === 'SCHOOL_ADMIN' && req.user.schoolId === schoolId) return next();
    return res.status(403).json({ error: 'Forbidden' });
  };
}

module.exports = { requireSchoolAccess };
