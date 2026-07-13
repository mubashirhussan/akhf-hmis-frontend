"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import { Modal } from "antd";
import {
  getExpandedKeys,
  hasActiveDescendant,
  isPathActive,
  navigation,
  footerLinks,
} from "@/components/layout/sidebar-nav";
import { clearLegacyStoredAuth, logout } from "@/store/authSlice";
import { clearAuthSession } from "@/features/auth/session";
import AppIcon from "@/components/icons/AppIcon";

function NavChevron({ expanded }) {
  return (
    <AppIcon
      icon="mdi:chevron-down"
      className={`sidebar-nav-chevron ${expanded ? "rotate-180" : ""}`}
    />
  );
}

function SidebarLink({ href, active, children, className = "" }) {
  return (
    <Link
      href={href}
      prefetch={false}
      className={`sidebar-nav-parent flex items-center gap-2.5 rounded-lg px-3 py-2 transition-colors ${active ? "bg-white text-[var(--app-primary)] shadow-sm" : "text-white/95 hover:bg-white/10"} ${className}`}
    >
      {children}
    </Link>
  );
}

function NavChildItem({ item, pathname, expandedKeys, onToggle }) {
  const hasChildren = Boolean(item.children?.length);
  const isExpanded = expandedKeys.includes(item.key);
  const isParentActive = hasChildren && hasActiveDescendant(item, pathname);
  const isSelfActive = !hasChildren && isPathActive(pathname, item.href);

  if (hasChildren) {
    return (
      <li className="relative before:absolute before:-left-4 before:top-5 before:h-px before:w-3 before:bg-white/40">
        <button
          type="button"
          onClick={() => onToggle(item.key)}
          className={`sidebar-nav-child flex w-full items-center gap-2 rounded-[8px] px-3 py-2.5 transition-colors ${isParentActive || isExpanded ? "bg-white text-[var(--app-primary)] shadow-sm" : "text-white/90 hover:bg-white/10"}`}
        >
          <span className="flex-1 text-left truncate">{item.label}</span>
          <NavChevron expanded={isExpanded} />
        </button>
        {isExpanded && (
          <ul className="relative mt-1 ml-3 space-y-0.5 border-l border-white/30 pl-3">
            {item.children.map((child) => (
              <NavChildItem
                key={child.key}
                item={child}
                pathname={pathname}
                expandedKeys={expandedKeys}
                onToggle={onToggle}
              />
            ))}
          </ul>
        )}
      </li>
    );
  }

  return (
    <li className="relative before:absolute before:-left-4 before:top-1/2 before:h-px before:w-3 before:bg-white/40">
      <Link
        href={item.href}
        prefetch={false}
        className={`sidebar-nav-child block rounded-[8px] px-3 py-2.5 transition-colors ${isSelfActive ? "bg-white text-[var(--app-primary)] shadow-sm" : "text-white/90 hover:bg-white/10"}`}
      >
        {item.label}
      </Link>
    </li>
  );
}

function NavItem({ item, pathname, collapsed, expandedKeys, onToggle }) {
  const hasChildren = Boolean(item.children?.length);
  const isExpanded = expandedKeys.includes(item.key);
  const isParentActive = hasChildren && hasActiveDescendant(item, pathname);
  const isSelfActive = !hasChildren && isPathActive(pathname, item.href);

  if (hasChildren) {
    return (
      <li>
        <button
          type="button"
          onClick={() => onToggle(item.key)}
          className={`sidebar-nav-parent flex w-full items-center gap-2.5 rounded-lg px-3 py-2 transition-colors ${isParentActive || isExpanded ? "bg-white text-[var(--app-primary)] shadow-sm" : "text-white/95 hover:bg-white/10"}`}
        >
          {item.icon && <AppIcon icon={item.icon} />}
          {!collapsed && (
            <>
              <span className="flex-1 text-left truncate">{item.label}</span>
              <NavChevron expanded={isExpanded} />
            </>
          )}
        </button>
        {isExpanded && !collapsed && (
          <ul className="relative mt-1 ml-4 space-y-0.5 border-l border-white/40 pl-4">
            {item.children.map((child) => (
              <NavChildItem
                key={child.key}
                item={child}
                pathname={pathname}
                expandedKeys={expandedKeys}
                onToggle={onToggle}
              />
            ))}
          </ul>
        )}
      </li>
    );
  }

  return (
    <li>
      <SidebarLink href={item.href} active={isSelfActive}>
        {item.icon && <AppIcon icon={item.icon} />}
        {!collapsed && <span className="truncate">{item.label}</span>}
      </SidebarLink>
    </li>
  );
}

export default function AppSidebar({ collapsed, onCollapsedChange }) {
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useDispatch();
  const [hovering, setHovering] = useState(false);
  const [logoutOpen, setLogoutOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const pathExpandedKeys = useMemo(() => getExpandedKeys(pathname), [pathname]);
  const [userToggledKeys, setUserToggledKeys] = useState(() => new Set());
  const [prevPathname, setPrevPathname] = useState(pathname);

  if (pathname !== prevPathname) {
    setPrevPathname(pathname);
    setUserToggledKeys((prev) => {
      const next = new Set(prev);
      for (const key of pathExpandedKeys) {
        next.delete(key);
      }
      return next;
    });
  }

  const expandedKeys = useMemo(() => {
    const expanded = new Set(pathExpandedKeys);
    for (const key of userToggledKeys) {
      if (expanded.has(key)) {
        expanded.delete(key);
      } else {
        expanded.add(key);
      }
    }
    return [...expanded];
  }, [pathExpandedKeys, userToggledKeys]);

  const isCollapsed = collapsed && !hovering;
  const isHoverExpanded = collapsed && hovering;

  const toggleExpanded = (key) => {
    setUserToggledKeys((prev) => {
      const next = new Set(prev);
      if (next.has(key)) {
        next.delete(key);
      } else {
        next.add(key);
      }
      return next;
    });
  };

  const handleConfirmLogout = async () => {
    setLoggingOut(true);
    try {
      dispatch(logout());
      clearLegacyStoredAuth();
      try {
        await clearAuthSession();
      } catch {
        // Redirect even if cookie clear fails.
      }
      setLogoutOpen(false);
      router.replace("/login");
    } finally {
      setLoggingOut(false);
    }
  };

  return (
    <aside
      className={`app-sidebar relative flex h-screen shrink-0 flex-col bg-[var(--app-primary)] text-white transition-[width] duration-200 ${isCollapsed ? "w-[72px]" : "w-[256px]"} ${isHoverExpanded ? "app-sidebar--hover-expand" : ""}`}
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
    >
      <Modal
        open={logoutOpen}
        title="Logout"
        centered
        okText="Yes, logout"
        cancelText="Cancel"
        okButtonProps={{ danger: true }}
        confirmLoading={loggingOut}
        onOk={handleConfirmLogout}
        onCancel={() => {
          if (!loggingOut) setLogoutOpen(false);
        }}
        mask={{ closable: !loggingOut }}
        closable={!loggingOut}
      >
        Are you sure you want to logout?
      </Modal>
      <button
        type="button"
        onClick={() => onCollapsedChange(!collapsed)}
        className="absolute -right-3 top-6 z-20 flex h-7 w-7 cursor-pointer items-center justify-center rounded-[24px] border border-white bg-[#026BB1] p-1.5 text-white transition hover:brightness-110"
        aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
      >
        <AppIcon
          icon={isCollapsed ? "mdi:chevron-right" : "mdi:chevron-left"}
          className="h-4 w-4"
        />
      </button>

      <div
        className={`flex items-center gap-3 border-b border-white/20 px-4 py-4 ${isCollapsed ? "justify-center px-2" : "pr-6"}`}
      >
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white text-[var(--app-primary)]">
          <AppIcon icon="carbon:user" className="h-5 w-5" />
        </div>
        {!isCollapsed && (
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
          {!isCollapsed && (
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
                collapsed={isCollapsed}
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
                {link.key === "logout" ? (
                  <button
                    type="button"
                    onClick={() => setLogoutOpen(true)}
                    className="sidebar-nav-parent cursor-pointer flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-white/95 hover:bg-white/10"
                  >
                    <AppIcon icon={link.icon} />
                    {!isCollapsed && <span>{link.label}</span>}
                  </button>
                ) : (
                  <Link
                    href={link.href}
                    prefetch={false}
                    className="sidebar-nav-parent flex items-center gap-2.5 rounded-lg px-3 py-2 text-white/95 hover:bg-white/10"
                  >
                    <AppIcon icon={link.icon} />
                    {!isCollapsed && <span>{link.label}</span>}
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </div>
      </nav>
    </aside>
  );
}
