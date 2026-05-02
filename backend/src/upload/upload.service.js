const path = require('path');
const prisma = require('../prisma');

async function saveLogo(schoolId, file) {
  const school = await prisma.school.findUnique({ where: { id: schoolId } });
  if (!school) {
    const err = new Error('School not found');
    err.status = 404;
    throw err;
  }
  const logoUrl = `/uploads/${path.basename(file.path)}`;
  await prisma.school.update({
    where: { id: schoolId },
    data: { logoUrl },
  });
  return { logoUrl };
}

module.exports = { saveLogo };
