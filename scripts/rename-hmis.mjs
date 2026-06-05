import fs from 'fs';
import path from 'path';

const root = path.join(process.cwd(), 'src');

const fileReplacements = [
  ['@/components/ui/HmisTable', '@/components/ui/DataTable'],
  ['@/components/ui/HmisFormGridRow', '@/components/ui/FormGridRow'],
  ['@/components/ui/HmisFormGrid', '@/components/ui/FormGrid'],
  ['@/components/ui/HmisFloatingField', '@/components/ui/FloatingField'],
  ['@/components/ui/HmisDetailSection', '@/components/ui/DetailSection'],
  ['@/components/ui/HmisDobAgeField', '@/components/ui/DobAgeField'],
  ['@/components/ui/HmisAgeUnitField', '@/components/ui/AgeUnitField'],
  ['@/components/ui/HmisPhiFormSection', '@/components/ui/PhiFormSection'],
  ['@/components/ui/HmisTabs', '@/components/ui/AppTabs'],
  ['@/components/ui/HmisCard', '@/components/ui/UiCard'],
  ['@/hooks/useHmisConfirm', '@/hooks/useConfirm'],
  ['@/lib/hmis-field-control', '@/lib/field-control'],
  ['@/lib/hmis-form-validation', '@/lib/form-validation'],
  ['@/lib/hmis-form-grid', '@/lib/form-grid'],
  ['@/lib/hmis-grid-column', '@/lib/grid-column'],
  ['@/lib/hmis-table-scroll', '@/lib/table-scroll'],
  ['HMIS_FIELD_CONTROL_CLASS', 'FIELD_CONTROL_CLASS'],
  ['HMIS_WALK_IN_SERVICES_SIDEBAR_SCROLL_Y', 'WALK_IN_SERVICES_SIDEBAR_SCROLL_Y'],
  ['HMIS_WALK_IN_TABLE_BODY_SCROLL_Y', 'WALK_IN_TABLE_BODY_SCROLL_Y'],
  ['HMIS_SERVICES_BILLING_TABLE_SCROLL_Y', 'SERVICES_BILLING_TABLE_SCROLL_Y'],
  ['useHmisConfirm', 'useConfirm'],
  ['HmisTable', 'DataTable'],
  ['HmisFormGridRow', 'FormGridRow'],
  ['HmisFormGrid', 'FormGrid'],
  ['HmisFloatingField', 'FloatingField'],
  ['HmisDetailSection', 'DetailSection'],
  ['HmisDobAgeField', 'DobAgeField'],
  ['HmisAgeUnitField', 'AgeUnitField'],
  ['HmisPhiFormSection', 'PhiFormSection'],
  ['HmisTabs', 'AppTabs'],
  ['HmisCard', 'UiCard'],
  ['var(--hmis-primary)', 'var(--app-primary)'],
  ['var(--hmis-header-bg)', 'var(--app-header-bg)'],
  ['var(--hmis-error)', 'var(--app-error)'],
  ['var(--hmis-scrollbar-thumb-hover)', 'var(--app-scrollbar-thumb-hover)'],
  ['/hmis-base-img.svg', '/base-img.svg'],
  ['AKHF HMIS', 'AKHF'],
  ['HMIS_PRIMARY_HOVER', 'APP_PRIMARY_HOVER'],
  ['HMIS_PRIMARY_ACTIVE', 'APP_PRIMARY_ACTIVE'],
  ['HMIS_PRIMARY', 'APP_PRIMARY'],
  ['hmisFieldTokens', 'fieldTokens'],
  ['hmisTheme', 'appTheme'],
];

const cssReplacements = [
  ['--hmis-table-scroll-y', '--data-table-scroll-y'],
  ['--hmis-table-header-bg', '--data-table-header-bg'],
  ['--hmis-table-header-color', '--data-table-header-color'],
  ['--hmis-table-row-selected-bg', '--data-table-row-selected-bg'],
  ['--hmis-table-row-hover-bg', '--data-table-row-hover-bg'],
  ['--hmis-form-cols', '--form-cols'],
  ['--hmis-field-height', '--field-height'],
  ['--hmis-error-focus-ring', '--app-error-focus-ring'],
  ['--hmis-header-bg', '--app-header-bg'],
  ['--hmis-scrollbar-thumb-hover', '--app-scrollbar-thumb-hover'],
  ['--hmis-scrollbar-thumb', '--app-scrollbar-thumb'],
  ['--hmis-scrollbar-track', '--app-scrollbar-track'],
  ['--hmis-scrollbar-size', '--app-scrollbar-size'],
  ['--hmis-primary', '--app-primary'],
  ['--hmis-error', '--app-error'],
  ['.hmis-table-wrap--scroll-body', '.data-table-wrap--scroll-body'],
  ['.hmis-table-row--selected', '.data-table-row--selected'],
  ['.hmis-table--patient-list', '.data-table--patient-list'],
  ['.hmis-table--billing-results', '.data-table--billing-results'],
  ['.hmis-table-wrap', '.data-table-wrap'],
  ['.hmis-table', '.data-table'],
  ['.hmis-confirm-modal', '.confirm-modal'],
  ['hmis-confirm-modal__', 'confirm-modal__'],
  ['.hmis-age-unit-field', '.age-unit-field'],
  ['.hmis-patient-details-modal', '.patient-details-modal'],
  ['.hmis-patient-details', '.patient-details'],
  ['.hmis-section-description', '.section-description'],
  ['.hmis-section-header-extra', '.section-header-extra'],
  ['.hmis-section-header-text', '.section-header-text'],
  ['.hmis-section-header--stacked', '.section-header--stacked'],
  ['.hmis-section-header--inline', '.section-header--inline'],
  ['.hmis-section-header', '.section-header'],
  ['.hmis-section-title', '.section-title'],
  ['.hmis-detail-section--last', '.detail-section--last'],
  ['.hmis-detail-section-title', '.detail-section-title'],
  ['.hmis-detail-section', '.detail-section'],
  ['.hmis-detail-field--span-4', '.detail-field--span-4'],
  ['.hmis-detail-field--span-2', '.detail-field--span-2'],
  ['.hmis-detail-field', '.detail-field'],
  ['.hmis-detail-label', '.detail-label'],
  ['.hmis-detail-value', '.detail-value'],
  ['.hmis-detail-grid', '.detail-grid'],
  ['.hmis-phi-form-section__grid', '.phi-form-section__grid'],
  ['.hmis-phi-form-section__header', '.phi-form-section__header'],
  ['.hmis-phi-form-section__title', '.phi-form-section__title'],
  ['.hmis-phi-form-section', '.phi-form-section'],
  ['.hmis-form-grid-row', '.form-grid-row'],
  ['.hmis-form-grid', '.form-grid'],
  ['.hmis-floating-field--radios', '.floating-field--radios'],
  ['.hmis-floating-label-asterisk', '.floating-label-asterisk'],
  ['.hmis-floating-label--inline', '.floating-label--inline'],
  ['.hmis-floating-label', '.floating-label'],
  ['.hmis-floating-control', '.floating-control'],
  ['.hmis-floating-field', '.floating-field'],
  ['.hmis-dob-age-field--embedded', '.dob-age-field--embedded'],
  ['.hmis-dob-age-field-inner', '.dob-age-field-inner'],
  ['.hmis-dob-age-field', '.dob-age-field'],
  ['.hmis-dob-age-date', '.dob-age-date'],
  ['.hmis-dob-age-age', '.dob-age-age'],
  ['.hmis-dob-age-unit', '.dob-age-unit'],
  ['.hmis-field-control', '.field-control'],
  ['.hmis-tabs-panel--first-active', '.app-tabs-panel--first-active'],
  ['.hmis-tabs-panel', '.app-tabs-panel'],
  ['.hmis-tabs-tab--active', '.app-tabs-tab--active'],
  ['.hmis-tabs-tab', '.app-tabs-tab'],
  ['.hmis-tabs-nav', '.app-tabs-nav'],
  ['.hmis-tabs', '.app-tabs'],
  ['.hmis-card-header-extra', '.ui-card-header-extra'],
  ['.hmis-card-header-text', '.ui-card-header-text'],
  ['.hmis-card-header--stacked', '.ui-card-header--stacked'],
  ['.hmis-card-header--inline', '.ui-card-header--inline'],
  ['.hmis-card-description', '.ui-card-description'],
  ['.hmis-card-title', '.ui-card-title'],
  ['.hmis-card-header', '.ui-card-header'],
  ['.hmis-card', '.ui-card'],
  ['.hmis-sidebar--hover-expand', '.app-sidebar--hover-expand'],
  ['.hmis-sidebar', '.app-sidebar'],
  ['.hmis-scrollbar', '.app-scrollbar'],
  ['.hmis-app-host', '.app-host'],
  ['HmisTable', 'DataTable'],
  ['HMIS ', 'app '],
  ['HMIS', 'app'],
];

const classReplacements = [
  ['hmis-table--patient-list', 'data-table--patient-list'],
  ['hmis-table--billing-results', 'data-table--billing-results'],
  ['hmis-table-row--selected', 'data-table-row--selected'],
  ['hmis-table-wrap', 'data-table-wrap'],
  ['hmis-table', 'data-table'],
  ['hmis-section-header--stacked', 'section-header--stacked'],
  ['hmis-section-header--inline', 'section-header--inline'],
  ['hmis-section-header-extra', 'section-header-extra'],
  ['hmis-section-header-text', 'section-header-text'],
  ['hmis-section-header', 'section-header'],
  ['hmis-section-title', 'section-title'],
  ['hmis-section-description', 'section-description'],
  ['hmis-detail-section--last', 'detail-section--last'],
  ['hmis-patient-details-modal', 'patient-details-modal'],
  ['hmis-patient-details', 'patient-details'],
  ['hmis-age-unit-field--no-dob', 'age-unit-field--no-dob'],
  ['hmis-sidebar--hover-expand', 'app-sidebar--hover-expand'],
  ['hmis-sidebar', 'app-sidebar'],
  ['hmis-scrollbar', 'app-scrollbar'],
  ['hmis-app-host', 'app-host'],
];

const filesToDelete = [
  'components/ui/HmisTable.jsx',
  'components/ui/HmisFormGrid.jsx',
  'components/ui/HmisFormGridRow.jsx',
  'components/ui/HmisFloatingField.jsx',
  'components/ui/HmisCard.jsx',
  'components/ui/HmisTabs.jsx',
  'components/ui/HmisDetailSection.jsx',
  'components/ui/HmisDobAgeField.jsx',
  'components/ui/HmisAgeUnitField.jsx',
  'components/ui/HmisPhiFormSection.jsx',
  'lib/hmis-field-control.js',
  'lib/hmis-form-grid.js',
  'lib/hmis-grid-column.js',
  'lib/hmis-form-validation.js',
  'lib/hmis-table-scroll.js',
  'hooks/useHmisConfirm.js',
];

function walk(dir, out = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, out);
    else if (/\.(js|jsx|css|md)$/.test(entry.name)) out.push(full);
  }
  return out;
}

function applyReplacements(content, pairs) {
  let next = content;
  for (const [from, to] of pairs) next = next.split(from).join(to);
  return next;
}

const files = walk(root);
let updated = 0;

for (const file of files) {
  const rel = path.relative(root, file).replace(/\\/g, '/');
  if (filesToDelete.includes(rel)) continue;

  let content = fs.readFileSync(file, 'utf8');
  const original = content;

  if (file.endsWith('globals.css')) {
    content = applyReplacements(content, cssReplacements);
  } else {
    content = applyReplacements(content, fileReplacements);
    content = applyReplacements(content, classReplacements);
  }

  if (content !== original) {
    fs.writeFileSync(file, content);
    updated += 1;
  }
}

for (const rel of filesToDelete) {
  const full = path.join(root, rel);
  if (fs.existsSync(full)) fs.unlinkSync(full);
}

const publicOld = path.join(process.cwd(), 'public', 'hmis-base-img.svg');
const publicNew = path.join(process.cwd(), 'public', 'base-img.svg');
if (fs.existsSync(publicOld) && !fs.existsSync(publicNew)) {
  fs.copyFileSync(publicOld, publicNew);
}

console.log(`Updated ${updated} files, deleted ${filesToDelete.length} legacy files.`);
