const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const prisma = require('../prisma');

function signAccessToken(user) {
  return jwt.sign(
    { sub: user.id, email: user.email, role: user.role },
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
  const user = await prisma.user.findUnique({ where: { email } });
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
  return { accessToken, refreshToken };
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

module.exports = { login, refresh, logout, signAccessToken };
