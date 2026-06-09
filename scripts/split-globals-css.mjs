import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const srcPath = path.join(root, 'src/styles/globals.css');
const css = fs.readFileSync(srcPath, 'utf8');

function classifyBlock(block) {
  const trimmed = block.trim();
  if (!trimmed || trimmed.startsWith('/*')) return 'comment';
  if (trimmed.startsWith('@import')) return 'tailwind';
  if (trimmed.startsWith(':root') || trimmed.startsWith('@theme')) return 'variables';
  if (trimmed.includes('--app-primary') || trimmed.includes('--background')) return 'variables';
  if (/^body\s*\{/.test(trimmed)) return 'base';

  const selectorMatch = trimmed.match(/^([^{]+)\{/);
  const selectors = selectorMatch ? selectorMatch[1] : trimmed;

  if (/\.(app-host|app-sidebar|sidebar-|app-header|header-|breadcrumb)/.test(selectors)) return 'layout';
  if (/\.(sample-collection)/.test(selectors)) return 'laboratory';
  if (/\.(services-billing|billing-|discount-request)/.test(selectors)) return 'billing';
  if (/\.(patient-details|detail-section|detail-grid|detail-field|detail-label|detail-value|patient-info)/.test(selectors)) return 'patient';
  if (/\.(walk-in-|patient-registration|patient-reg-)/.test(selectors)) return 'opd';
  if (/\.(data-table|form-grid|floating-|dob-age|field-control|section-header|section-title|ui-card|app-tabs|confirm-modal|app-modal|phi-form|age-unit)/.test(selectors)) return 'utilities';
  if (/^(html|body)?.*scrollbar|\.app-scrollbar/.test(selectors)) return 'utilities';
  if (/\.ant-/.test(selectors)) return 'antd';
  if (/^@layer/.test(trimmed)) return 'antd';
  if (/^@media/.test(trimmed)) {
    if (/\.(walk-in-|patient-reg|patient-registration)/.test(trimmed)) return 'opd';
    if (/\.(billing-|services-billing|discount)/.test(trimmed)) return 'billing';
    if (/\.(sample-collection)/.test(trimmed)) return 'laboratory';
    if (/\.(detail-|patient-details)/.test(trimmed)) return 'patient';
    if (/\.(app-sidebar|sidebar|header)/.test(trimmed)) return 'layout';
    return 'utilities';
  }
  return 'utilities';
}

function parseBlocks(content) {
  const blocks = [];
  let i = 0;
  const len = content.length;

  while (i < len) {
    if (content[i] === '/' && content[i + 1] === '*') {
      const end = content.indexOf('*/', i + 2);
      const block = content.slice(i, end + 2);
      blocks.push(block);
      i = end + 2;
      continue;
    }

    if (content[i] === '\n' || content[i] === '\r') {
      i++;
      continue;
    }

    let depth = 0;
    let start = i;
    let j = i;
    while (j < len) {
      if (content[j] === '/' && content[j + 1] === '*') {
        const end = content.indexOf('*/', j + 2);
        j = end + 2;
        continue;
      }
      if (content[j] === '{') depth++;
      if (content[j] === '}') {
        depth--;
        if (depth === 0) {
          j++;
          break;
        }
      }
      j++;
    }
    blocks.push(content.slice(start, j));
    i = j;
  }

  return blocks;
}

const buckets = {
  tailwind: [],
  variables: [],
  base: [],
  antd: [],
  layout: [],
  utilities: [],
  opd: [],
  patient: [],
  billing: [],
  laboratory: [],
  comments: [],
};

for (const block of parseBlocks(css)) {
  const bucket = classifyBlock(block);
  if (bucket === 'comment') buckets.comments.push(block);
  else if (buckets[bucket]) buckets[bucket].push(block);
  else buckets.utilities.push(block);
}

function write(file, blocks, header = '') {
  const dir = path.dirname(file);
  fs.mkdirSync(dir, { recursive: true });
  const body = blocks.join('\n\n').trim();
  fs.writeFileSync(file, header ? `${header}\n\n${body}\n` : `${body}\n`);
}

const stylesDir = path.join(root, 'src/styles');

write(path.join(stylesDir, 'tailwind.css'), ['@import "tailwindcss";']);
write(path.join(stylesDir, 'themes/variables.css'), buckets.variables);
write(path.join(stylesDir, 'antd-overrides.css'), buckets.antd, '/* Ant Design global overrides */');
write(path.join(stylesDir, 'layout.css'), buckets.layout, '/* App shell — sidebar, header */');
write(path.join(stylesDir, 'utilities.css'), buckets.utilities, '/* Shared utilities — tables, forms, modals */');

write(path.join(root, 'src/features/opd/styles/walk-in.css'), buckets.opd, '/* OPD walk-in & patient registration */');
write(path.join(root, 'src/features/opd/styles/index.css'), ['@import "./walk-in.css";']);
write(path.join(root, 'src/features/patient/styles/patient.css'), buckets.patient, '/* Patient detail sections */');
write(path.join(root, 'src/features/patient/styles/index.css'), ['@import "./patient.css";']);
write(path.join(root, 'src/features/billing/styles/billing.css'), buckets.billing, '/* Billing — services, payment, discounts */');
write(path.join(root, 'src/features/billing/styles/index.css'), ['@import "./billing.css";']);
write(path.join(root, 'src/features/laboratory/styles/laboratory.css'), buckets.laboratory, '/* Laboratory — sample collection */');
write(path.join(root, 'src/features/laboratory/styles/index.css'), ['@import "./laboratory.css";']);

const bodyBlock = buckets.base.length ? buckets.base.join('\n\n') : `body {
  background: var(--background);
  color: var(--foreground);
  font-family: var(--font-geist-sans), system-ui, sans-serif;
  font-size: var(--font-size-base);
  line-height: var(--line-height-base);
}`;

const newGlobals = `/* Design system entry — base only */
@import "./tailwind.css";
@import "./themes/variables.css";
@import "./antd-overrides.css";
@import "./layout.css";
@import "./utilities.css";
@import "../features/opd/styles/index.css";
@import "../features/patient/styles/index.css";
@import "../features/billing/styles/index.css";
@import "../features/laboratory/styles/index.css";
@import "../features/pharmacy/styles/index.css";
@import "../features/auth/styles/index.css";
@import "../features/doctor/styles/index.css";
@import "../features/appointment/styles/index.css";

${bodyBlock}
`;

fs.writeFileSync(srcPath, `${newGlobals.trim()}\n`);

// Empty feature style stubs
for (const feature of ['pharmacy', 'auth', 'doctor', 'appointment']) {
  const dir = path.join(root, `src/features/${feature}/styles`);
  fs.mkdirSync(dir, { recursive: true });
  const indexPath = path.join(dir, 'index.css');
  if (!fs.existsSync(indexPath)) fs.writeFileSync(indexPath, `/* ${feature} feature styles */\n`);
}

console.log('Split complete:');
for (const [key, val] of Object.entries(buckets)) {
  if (key !== 'comments') console.log(`  ${key}: ${val.length} blocks`);
}
