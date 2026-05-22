# HMIS App Structure

Routes mirror the sidebar defined in `src/config/navigation-data.js`.

## How routing works

| URL | Source |
|-----|--------|
| `/` | `(dashboard)/page.js` |
| `/dashboard`, `/opd/walk-in-patient`, etc. | `(dashboard)/[...path]/page.js` |

Add or change a module in **one place** (`navigation-data.js`). The catch-all route renders a placeholder until you replace it with real screens.

## Folder layout

```
src/
├── config/
│   └── navigation-data.js # Sidebar modules + hrefs (single source of truth)
├── lib/
│   └── navigation-utils.js
├── components/
│   ├── icons/
│   │   └── AppIcon.jsx      # Iconify wrapper (no custom SVGs)
│   └── layout/
│       ├── AppShell.jsx
│       ├── AppSidebar.jsx
│       ├── AppHeader.jsx
│       └── ModulePlaceholder.jsx
└── app/
    └── (dashboard)/       # App shell (sidebar + header)
        ├── layout.js
        ├── page.js        # Home
        └── [...path]/     # All module routes (not home)
            └── page.js
```

## Example: OPD → Walk-in patient

- Config: `{ href: '/opd/walk-in-patient', label: 'Walk-in patient' }`
- URL: `/opd/walk-in-patient`
- Breadcrumb: OPD › Walk-in patient

To build the real page, replace the placeholder by adding `src/app/(dashboard)/opd/walk-in-patient/page.js` (optional — overrides catch-all) or edit the catch-all to load feature components.
