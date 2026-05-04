const path = require('path');
const fs = require('fs').promises;
const prisma = require('../prisma');

const uploadRoot = process.env.UPLOAD_PATH || path.join(__dirname, '../../uploads');

async function listFiles(schoolId) {
  return prisma.evidenceFile.findMany({
    where: { schoolId },
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      originalName: true,
      mimeType: true,
      createdAt: true,
      storedName: true,
    },
  });
}

async function addFile(schoolId, file) {
  const school = await prisma.school.findUnique({ where: { id: schoolId } });
  if (!school) {
    const err = new Error('School not found');
    err.status = 404;
    throw err;
  }
  const storedName = path.basename(file.path);
  return prisma.evidenceFile.create({
    data: {
      schoolId,
      originalName: file.originalname || storedName,
      storedName,
      mimeType: file.mimetype || 'application/octet-stream',
    },
  });
}

async function removeFile(schoolId, fileId) {
  const row = await prisma.evidenceFile.findFirst({
    where: { id: fileId, schoolId },
  });
  if (!row) {
    const err = new Error('Not found');
    err.status = 404;
    throw err;
  }
  const diskPath = path.join(uploadRoot, row.storedName);
  await prisma.evidenceFile.delete({ where: { id: fileId } });
  try {
    await fs.unlink(diskPath);
  } catch {
    /* ignore missing file */
  }
}

module.exports = { listFiles, addFile, removeFile, uploadRoot };
