export function isSuperAdminEmail(email?: string | null) {
  if (!email) return false;
  const configured = process.env.SUPER_ADMIN_EMAILS ?? 'igorjvs82@gmail.com';
  const allowed = configured.split(',').map((item) => item.trim().toLowerCase()).filter(Boolean);
  return allowed.includes(email.toLowerCase());
}
