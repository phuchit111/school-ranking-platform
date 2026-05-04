const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const prisma = require('../prisma');

function signAccessToken(user) {
  return jwt.sign(
    {
      sub: user.id,
      email: user.email,
      role: user.role,
      schoolId: user.schoolId ?? null,
    },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '15m' }
  );
}

function signRefreshToken(user) {
  return jwt.sign(
    { sub: user.id, type: 'refresh' },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d' }
  );
}

async function login(email, password) {
  const user = await prisma.user.findUnique({
    where: { email },
    include: { school: { select: { id: true, name: true } } },
  });
  if (!user) {
    const err = new Error('Invalid credentials');
    err.status = 401;
    throw err;
  }
  const ok = await bcrypt.compare(password, user.password);
  if (!ok) {
    const err = new Error('Invalid credentials');
    err.status = 401;
    throw err;
  }
  const accessToken = signAccessToken(user);
  const refreshToken = signRefreshToken(user);
  const refreshHash = crypto.createHash('sha256').update(refreshToken).digest('hex');
  await prisma.user.update({
    where: { id: user.id },
    data: { refreshToken: refreshHash },
  });
  return {
    accessToken,
    refreshToken,
    user: {
      id: user.id,
      email: user.email,
      role: user.role,
      schoolId: user.schoolId,
      schoolName: user.school?.name ?? null,
    },
  };
}

async function me(userId) {
  return prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      role: true,
      schoolId: true,
      school: { select: { id: true, name: true, province: true } },
    },
  });
}

async function refresh(refreshToken) {
  if (!refreshToken) {
    const err = new Error('Missing refresh token');
    err.status = 400;
    throw err;
  }
  let payload;
  try {
    payload = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
  } catch {
    const err = new Error('Invalid refresh token');
    err.status = 401;
    throw err;
  }
  if (payload.type !== 'refresh') {
    const err = new Error('Invalid refresh token');
    err.status = 401;
    throw err;
  }
  const hash = crypto.createHash('sha256').update(refreshToken).digest('hex');
  const user = await prisma.user.findFirst({
    where: { id: payload.sub, refreshToken: hash },
  });
  if (!user) {
    const err = new Error('Invalid refresh token');
    err.status = 401;
    throw err;
  }
  const accessToken = signAccessToken(user);
  return { accessToken };
}

async function logout(userId) {
  await prisma.user.update({
    where: { id: userId },
    data: { refreshToken: null },
  });
}

async function requestPasswordReset(email) {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return { ok: true };
  const rawToken = crypto.randomBytes(32).toString('hex');
  const hash = crypto.createHash('sha256').update(rawToken).digest('hex');
  const expires = new Date(Date.now() + 60 * 60 * 1000);
  await prisma.user.update({
    where: { id: user.id },
    data: { passwordResetToken: hash, passwordResetExpires: expires },
  });
  const base =
    process.env.FRONTEND_URL || process.env.PUBLIC_FRONTEND_URL || 'http://localhost:3007';
  const resetUrl = `${base.replace(/\/$/, '')}/admin/reset-password?token=${rawToken}`;
  const out = { ok: true };
  if (process.env.NODE_ENV !== 'production') {
    out.devResetUrl = resetUrl;
  }
  return out;
}

async function resetPassword(token, password) {
  if (!token || typeof password !== 'string' || password.length < 6) {
    const err = new Error('รหัสผ่านอย่างน้อย 6 ตัวอักษร');
    err.status = 400;
    throw err;
  }
  const hash = crypto.createHash('sha256').update(token).digest('hex');
  const user = await prisma.user.findFirst({
    where: {
      passwordResetToken: hash,
      passwordResetExpires: { gt: new Date() },
    },
  });
  if (!user) {
    const err = new Error('ลิงก์ไม่ถูกต้องหรือหมดอายุ');
    err.status = 400;
    throw err;
  }
  const pwdHash = await bcrypt.hash(password, 10);
  await prisma.user.update({
    where: { id: user.id },
    data: {
      password: pwdHash,
      passwordResetToken: null,
      passwordResetExpires: null,
      refreshToken: null,
    },
  });
  return { ok: true };
}

module.exports = {
  login,
  refresh,
  logout,
  signAccessToken,
  me,
  requestPasswordReset,
  resetPassword,
};
