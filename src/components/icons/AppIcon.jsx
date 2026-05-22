'use client';

import { Icon } from '@iconify/react';

export default function AppIcon({ icon, className = 'h-[18px] w-[18px] shrink-0', ...props }) {
  if (!icon) return null;
  return <Icon icon={icon} className={className} aria-hidden {...props} />;
}
