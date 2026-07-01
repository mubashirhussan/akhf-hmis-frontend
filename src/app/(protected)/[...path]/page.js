import ModulePlaceholder from '@/components/layout/ModulePlaceholder';
import { findNavItemByHref, normalizePath } from '@/lib/navigation-utils';
import { notFound } from 'next/navigation';

export default async function ModulePage({ params }) {
  const resolved = await params;
  const segments = resolved.path ?? [];
  const pathname = normalizePath(`/${segments.join('/')}`);
  const navItem = findNavItemByHref(pathname);

  if (!navItem) {
    notFound();
  }

  return <ModulePlaceholder pathname={pathname} />;
}
