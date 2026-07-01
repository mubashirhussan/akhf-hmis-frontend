# App routing layer

Routes mirror the sidebar defined in `src/config/navigation.js`.

## Layout

- `app/(protected)/` — authenticated shell (`AppShell`)
- `app/(auth)/` — login and forgot-password
- `app/(protected)/[...path]/` — catch-all placeholder for unbuilt modules

## Feature pages

Business UI lives in `src/features/*/pages/`. Route files here are thin shells that import feature pages.

Add or change a module in **one place** (`navigation.js`). The catch-all route renders a placeholder until you replace it with real screens.

## Folder map

```
src/
├── app/                    # Routing only
├── features/               # Business logic (opd, billing, laboratory, patient, …)
├── components/             # Shared UI (ui, layout, feedback, providers)
├── config/                 # navigation, routes, env, permissions
├── services/               # API client layer (stubs)
├── store/                  # Global state (stubs)
├── hooks/                  # Global hooks
├── lib/                    # Pure helpers
├── styles/                 # Design system (globals → tailwind, antd, layout, utilities, themes)
│   └── features/*/styles/  # Feature + page-level CSS (imported via globals.css)
└── assets/                 # Static assets
```
