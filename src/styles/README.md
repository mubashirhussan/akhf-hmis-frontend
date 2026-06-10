# Design system

Entry point: `globals.css` (imported from `src/app/layout.js`).

## Structure

```
styles/
├── globals.css          # Base + import chain only
├── tailwind.css         # Tailwind v4
├── antd-overrides.css   # Ant Design global overrides
├── layout.css           # App shell (sidebar, header)
├── utilities.css        # Shared tables, forms, modals
├── themes/
│   ├── variables.css    # CSS custom properties
│   └── dark.css         # Dark theme tokens
└── utilities.css
```

## Feature styles

Feature CSS lives under `src/features/*/styles/` and page folders:

- `features/opd/pages/walk-in-patient/walk-in-patient.css`
- `features/opd/pages/patient-registration/patient-registration.css`
- `features/billing/pages/services-billing/*.css`
- `features/billing/pages/payment/payment.css`
- `features/laboratory/pages/sample-collection/sample-collection.css`
- `features/patient/styles/patient.css`
- `features/auth/styles/login.css`

All feature styles are pulled in through `globals.css` import chain.
