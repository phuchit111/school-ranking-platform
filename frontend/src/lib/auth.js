export function setTokens(accessToken, refreshToken) {
  document.cookie = `accessToken=${accessToken}; path=/; max-age=900`;
  document.cookie = `refreshToken=${refreshToken}; path=/; max-age=604800`;
}

export function clearTokens() {
  document.cookie = 'accessToken=; path=/; max-age=0';
  document.cookie = 'refreshToken=; path=/; max-age=0';
}

export function getAccessToken() {
  return document.cookie.match(/accessToken=([^;]+)/)?.[1] || null;
}
