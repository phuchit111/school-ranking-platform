const prisma = require('../prisma');

function listFilters(query) {
  const where = { isPublished: true };
  if (query.province) where.province = query.province;
  if (query.affiliation) where.affiliation = query.affiliation;
  if (query.level) where.level = query.level;
  if (query.search) {
    where.name = { contains: query.search, mode: 'insensitive' };
  }
  return where;
}

async function listPublished(query) {
  const page = Math.max(1, Number(query.page) || 1);
  const limit = Math.min(100, Math.max(1, Number(query.limit) || 20));
  const where = listFilters(query);
  const [total, data] = await prisma.$transaction([
    prisma.school.count({ where }),
    prisma.school.findMany({
      where,
      include: { ranking: true },
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { name: 'asc' },
    }),
  ]);
  return { data, total, page, limit };
}

async function listAll(query) {
  const page = Math.max(1, Number(query.page) || 1);
  const limit = Math.min(100, Math.max(1, Number(query.limit) || 50));
  const where = {};
  if (query.search) {
    where.name = { contains: query.search, mode: 'insensitive' };
  }
  const [total, data] = await prisma.$transaction([
    prisma.school.count({ where }),
    prisma.school.findMany({
      where,
      include: { ranking: true },
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { updatedAt: 'desc' },
    }),
  ]);
  return { data, total, page, limit };
}

async function getById(id, isAdmin) {
  const school = await prisma.school.findUnique({
    where: { id },
    include: { ranking: true, scores: true },
  });
  if (!school) return null;
  if (!school.isPublished && !isAdmin) return null;
  return school;
}

async function create(body) {
  return prisma.school.create({
    data: {
      name: body.name,
      province: body.province,
      affiliation: body.affiliation,
      level: body.level,
      logoUrl: body.logoUrl || null,
      isPublished: Boolean(body.isPublished),
    },
  });
}

async function update(id, body) {
  return prisma.school.update({
    where: { id },
    data: {
      ...(body.name !== undefined && { name: body.name }),
      ...(body.province !== undefined && { province: body.province }),
      ...(body.affiliation !== undefined && { affiliation: body.affiliation }),
      ...(body.level !== undefined && { level: body.level }),
      ...(body.logoUrl !== undefined && { logoUrl: body.logoUrl }),
      ...(body.isPublished !== undefined && { isPublished: Boolean(body.isPublished) }),
    },
  });
}

async function remove(id) {
  await prisma.school.delete({ where: { id } });
}

async function setPublished(id, isPublished) {
  return prisma.school.update({
    where: { id },
    data: { isPublished: Boolean(isPublished) },
  });
}

module.exports = {
  listPublished,
  listAll,
  getById,
  create,
  update,
  remove,
  setPublished,
};
