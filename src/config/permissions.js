/** Role-based permissions — extend when auth is wired. */
export const PERMISSIONS = {
  opd: { view: 'opd:view', manage: 'opd:manage' },
  laboratory: { view: 'laboratory:view', manage: 'laboratory:manage' },
  billing: { view: 'billing:view', manage: 'billing:manage' },
  pharmacy: { view: 'pharmacy:view', manage: 'pharmacy:manage' },
};

export function hasPermission(_user, _permission) {
  return true;
}
