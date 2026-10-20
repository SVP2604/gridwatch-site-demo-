// Shared by every /api/dev/* route so the password check can't drift apart
// between the read endpoint and the write endpoint.
export function checkPassword(password) {
  const expected = process.env.DEV_PASSWORD;
  if (!expected) return { error: '서버에 DEV_PASSWORD가 설정되지 않았습니다.', status: 500 };
  if (password !== expected) return { error: '비밀번호가 올바르지 않습니다.', status: 401 };
  return null;
}
