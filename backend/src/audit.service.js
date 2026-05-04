const prisma = require('./prisma');

async function log({ actorId, action, entity, entityId, meta, ip }) {
  return prisma.auditLog.create({
    data: {
      actorId: actorId ?? null,
      action,
      entity: entity ?? null,
      entityId: entityId ?? null,
      meta: meta ?? undefined,
      ip: ip ?? null,
    },
  });
}

async function listRecent(limit = 100) {
  const take = Math.min(500, Math.max(1, Number(limit) || 100));
  return prisma.auditLog.findMany({
    orderBy: { createdAt: 'desc' },
    take,
  });
}

module.exports = { log, listRecent };
