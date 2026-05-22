'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { footerLinks, navigation } from '@/config/navigation-data';
import NavIcon from '@/components/icons/NavIcon';
import { getExpandedKeys, isPathActive } from '@/lib/navigation-utils';

function NavChevron({ expanded }) {
  return (
    <NavIcon
      name="chevronDown"
      strokeWidth={1.5}
      className={`sidebar-nav-chevron ${expanded ? 'rotate-180' : ''}`}
    />
  );
}

function SidebarLink({ href, active, children, className = '' }) {
  return (
    <Link
      href={href}
      className={`sidebar-nav-parent flex items-center gap-2.5 rounded-lg px-3 py-2 transition-colors ${active ? 'bg-white text-[var(--hmis-primary)] shadow-sm' : 'text-white/95 hover:bg-white/10'} ${className}`}
    >
      {children}
    </Link>
  );
}

function NavItem({ item, pathname, collapsed, expandedKeys, onToggle }) {
  const hasChildren = Boolean(item.children?.length);
  const isExpanded = expandedKeys.includes(item.key);
  const isParentActive = hasChildren && item.children.some((c) => isPathActive(pathname, c.href));
  const isSelfActive = !hasChildren && isPathActive(pathname, item.href);

  if (hasChildren) {
    return (
      <li>
        <button
          type="button"
          onClick={() => onToggle(item.key)}
          className={`sidebar-nav-parent flex w-full items-center gap-2.5 rounded-lg px-3 py-2 transition-colors ${isParentActive || isExpanded ? 'bg-white text-[var(--hmis-primary)] shadow-sm' : 'text-white/95 hover:bg-white/10'}`}
        >
          {item.icon && <NavIcon name={item.icon} />}
          {!collapsed && (
            <>
              <span className="flex-1 text-left truncate">{item.label}</span>
              <NavChevron expanded={isExpanded} />
            </>
          )}
        </button>
        {isExpanded && !collapsed && (
          <ul className="relative mt-1 ml-4 space-y-0.5 border-l border-white/40 pl-4">
            {item.children.map((child) => {
              const childActive = isPathActive(pathname, child.href);
              return (
                <li
                  key={child.key}
                  className="relative before:absolute before:-left-4 before:top-1/2 before:h-px before:w-3 before:bg-white/40"
                >
                  <Link
                    href={child.href}
                    className={`sidebar-nav-child block rounded-[8px] px-3 py-2.5 transition-colors ${childActive ? 'bg-white text-[var(--hmis-primary)] shadow-sm' : 'text-white/90 hover:bg-white/10'}`}
                  >
                    {child.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </li>
    );
  }

  return (
    <li>
      <SidebarLink href={item.href} active={isSelfActive}>
        {item.icon && <NavIcon name={item.icon} />}
        {!collapsed && <span className="truncate">{item.label}</span>}
      </SidebarLink>
    </li>
  );
}

export default function AppSidebar({ collapsed, onCollapsedChange }) {
  const pathname = usePathname();
  const [expandedKeys, setExpandedKeys] = useState(() => getExpandedKeys(pathname));

  useEffect(() => {
    setExpandedKeys((prev) => {
      const fromPath = getExpandedKeys(pathname);
      return [...new Set([...prev, ...fromPath])];
    });
  }, [pathname]);

  const toggleExpanded = (key) => {
    setExpandedKeys((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key],
    );
  };

  return (
    <aside
      className={`relative flex h-screen shrink-0 flex-col bg-[var(--hmis-primary)] text-white transition-[width] duration-200 ${collapsed ? 'w-[72px]' : 'w-[256px]'}`}
    >
      <button
        type="button"
        onClick={() => onCollapsedChange(!collapsed)}
        className="absolute cursor-pointer -right-3 top-6 z-20 flex h-7 w-7 items-center justify-center rounded-[24px] border border-white bg-[#026BB1] p-1.5 text-white transition hover:brightness-110"
        aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
      >
        <NavIcon name={collapsed ? 'chevronRight' : 'chevronLeft'} className="h-4 w-4" />
      </button>

      <div
        className={`flex items-center gap-3 border-b border-white/20 px-4 py-4 ${collapsed ? 'justify-center px-2' : 'pr-6'}`}
      >
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white text-[var(--hmis-primary)]">
          <NavIcon name="user" className="h-5 w-5" />
        </div>
        {!collapsed && (
          <div className="min-w-0 flex-1">
            <p className="truncate text-[10px] font-medium uppercase tracking-wide text-white/75">
              UI/UX Designer (IT Dept)
            </p>
            <p className="truncate text-sm font-semibold">Mr. Ammar Shahid</p>
          </div>
        )}
      </div>

      <nav className="flex flex-1 flex-col overflow-hidden">
        <div className="sidebar-scroll flex-1 overflow-y-auto px-3 py-3">
          {!collapsed && (
            <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-widest text-white/50">
              Main
            </p>
          )}
          <ul className="space-y-0.5">
            {navigation.map((item) => (
              <NavItem
                key={item.key}
                item={item}
                pathname={pathname}
                collapsed={collapsed}
                expandedKeys={expandedKeys}
                onToggle={toggleExpanded}
              />
            ))}
          </ul>
        </div>

        <div className="border-t border-white/20 px-3 py-3">
          <ul className="space-y-0.5">
            {footerLinks.map((link) => (
              <li key={link.key}>
                <Link
                  href={link.href}
                  className="sidebar-nav-parent flex items-center gap-2.5 rounded-lg px-3 py-2 text-white/95 hover:bg-white/10"
                >
                  <NavIcon name={link.key === 'help' ? 'help' : 'logout'} />
                  {!collapsed && <span>{link.label}</span>}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </nav>
    </aside>
  );
}
