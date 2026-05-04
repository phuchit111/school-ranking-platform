const path = require('path');
const fs = require('fs').promises;
const prisma = require('../prisma');

const uploadRoot = process.env.UPLOAD_PATH || path.join(__dirname, '../../uploads');

const MAX_GALLERY_IMAGES = 5;

function publicUrl(file) {
  return `/uploads/${path.basename(file.path)}`;
}

async function ensureSchool(schoolId) {
  const school = await prisma.school.findUnique({ where: { id: schoolId } });
  if (!school) {
    const err = new Error('School not found');
    err.status = 404;
    throw err;
  }
  return school;
}

async function unlinkSafe(url) {
  if (!url) return;
  const name = path.basename(url);
  const diskPath = path.join(uploadRoot, name);
  try {
    await fs.unlink(diskPath);
  } catch {
    /* ignore missing file */
  }
}

async function saveBanner(schoolId, file) {
  const school = await ensureSchool(schoolId);
  const newUrl = publicUrl(file);
  await prisma.school.update({
    where: { id: schoolId },
    data: { bannerUrl: newUrl },
  });
  if (school.bannerUrl) await unlinkSafe(school.bannerUrl);
  return { bannerUrl: newUrl };
}

async function listGallery(schoolId) {
  return prisma.schoolGalleryImage.findMany({
    where: { schoolId },
    orderBy: [{ sortOrder: 'asc' }, { createdAt: 'asc' }],
  });
}

async function addGalleryImage(schoolId, file, caption = '') {
  await ensureSchool(schoolId);
  const count = await prisma.schoolGalleryImage.count({ where: { schoolId } });
  if (count >= MAX_GALLERY_IMAGES) {
    await unlinkSafe(file.path);
    const err = new Error(`Gallery is limited to ${MAX_GALLERY_IMAGES} images`);
    err.status = 400;
    throw err;
  }
  return prisma.schoolGalleryImage.create({
    data: {
      schoolId,
      url: publicUrl(file),
      caption: caption || '',
      sortOrder: count,
    },
  });
}

async function removeGalleryImage(schoolId, imageId) {
  const row = await prisma.schoolGalleryImage.findFirst({
    where: { id: imageId, schoolId },
  });
  if (!row) {
    const err = new Error('Not found');
    err.status = 404;
    throw err;
  }
  await prisma.schoolGalleryImage.delete({ where: { id: imageId } });
  await unlinkSafe(row.url);
}

async function listCertificates(schoolId) {
  return prisma.schoolCertificate.findMany({
    where: { schoolId },
    orderBy: { createdAt: 'desc' },
  });
}

async function addCertificate(schoolId, file, title = '') {
  await ensureSchool(schoolId);
  const fileType = file.mimetype === 'application/pdf' ? 'pdf' : 'image';
  return prisma.schoolCertificate.create({
    data: {
      schoolId,
      title: title || file.originalname || '',
      fileUrl: publicUrl(file),
      fileType,
    },
  });
}

async function removeCertificate(schoolId, certId) {
  const row = await prisma.schoolCertificate.findFirst({
    where: { id: certId, schoolId },
  });
  if (!row) {
    const err = new Error('Not found');
    err.status = 404;
    throw err;
  }
  await prisma.schoolCertificate.delete({ where: { id: certId } });
  await unlinkSafe(row.fileUrl);
}

/**
 * Official ministry-style certificate PDF (single file per school).
 * Stored under uploads/; download only via authenticated route (not public JSON).
 */
async function saveOfficialCertificatePdf(schoolId, file) {
  const school = await ensureSchool(schoolId);
  if (!file.mimetype || file.mimetype !== 'application/pdf') {
    await unlinkSafe(file.path);
    const err = new Error('Only PDF files allowed');
    err.status = 400;
    throw err;
  }
  const newUrl = publicUrl(file);
  await prisma.school.update({
    where: { id: schoolId },
    data: { certificatePdfUrl: newUrl },
  });
  if (school.certificatePdfUrl) await unlinkSafe(school.certificatePdfUrl);
  return { certificatePdfUrl: newUrl };
}

/** Absolute path on disk for school's official PDF, or null if missing / unreadable */
async function officialCertificateAbsolutePath(schoolId) {
  const row = await prisma.school.findUnique({
    where: { id: schoolId },
    select: { certificatePdfUrl: true },
  });
  if (!row?.certificatePdfUrl) return null;
  const abs = path.join(uploadRoot, path.basename(row.certificatePdfUrl));
  try {
    await fs.access(abs);
    return abs;
  } catch {
    return null;
  }
}

module.exports = {
  MAX_GALLERY_IMAGES,
  uploadRoot,
  saveBanner,
  listGallery,
  addGalleryImage,
  removeGalleryImage,
  listCertificates,
  addCertificate,
  removeCertificate,
  saveOfficialCertificatePdf,
  officialCertificateAbsolutePath,
};
