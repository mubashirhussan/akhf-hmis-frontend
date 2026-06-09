import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');

function parseBlocks(content) {
  const blocks = [];
  let i = 0;
  const len = content.length;
  while (i < len) {
    if (content[i] === '/' && content[i + 1] === '*') {
      const end = content.indexOf('*/', i + 2);
      blocks.push(content.slice(i, end + 2));
      i = end + 2;
      continue;
    }
    if (content[i] === '\n' || content[i] === '\r') { i++; continue; }
    let depth = 0;
    let start = i;
    let j = i;
    while (j < len) {
      if (content[j] === '/' && content[j + 1] === '*') {
        j = content.indexOf('*/', j + 2) + 2;
        continue;
      }
      if (content[j] === '{') depth++;
      if (content[j] === '}') {
        depth--;
        if (depth === 0) { j++; break; }
      }
      j++;
    }
    blocks.push(content.slice(start, j));
    i = j;
  }
  return blocks;
}

function classifyOpd(block) {
  if (/\.(patient-registration|patient-reg-)/.test(block)) return 'patient-registration';
  return 'walk-in-patient';
}

function classifyBilling(block) {
  if (/discount-request/.test(block)) return 'discount-request';
  if (/billing-visit-payment|billing-payment/.test(block)) return 'payment';
  if (/billing-visit-services/.test(block)) return 'billing-visit-services';
  if (/services-billing/.test(block)) return 'services-billing';
  return 'shared';
}

function classifyLab(block) {
  if (/sample-collection/.test(block)) return 'sample-collection';
  return 'worklist';
}

function splitFile(sourceFile, classifier, targets) {
  const content = fs.readFileSync(sourceFile, 'utf8');
  const header = content.split('\n').find((l) => l.startsWith('/*')) ?? '';
  const blocks = parseBlocks(content.replace(/^\/\*[\s\S]*?\*\/\s*/, ''));
  const buckets = Object.fromEntries(Object.keys(targets).map((k) => [k, []]));

  for (const block of blocks) {
    const key = classifier(block.trim());
    (buckets[key] ?? buckets.shared ?? buckets['walk-in-patient']).push(block);
  }

  for (const [key, outPath] of Object.entries(targets)) {
    const dir = path.dirname(outPath);
    fs.mkdirSync(dir, { recursive: true });
    const body = (buckets[key] ?? []).join('\n\n').trim();
    fs.writeFileSync(outPath, body ? `${header}\n\n${body}\n` : `${header}\n\n/* Page styles */\n`);
  }
}

splitFile(
  path.join(root, 'src/features/opd/styles/walk-in.css'),
  classifyOpd,
  {
    'walk-in-patient': path.join(root, 'src/features/opd/pages/walk-in-patient/walk-in-patient.css'),
    'patient-registration': path.join(root, 'src/features/opd/pages/patient-registration/patient-registration.css'),
  },
);

splitFile(
  path.join(root, 'src/features/billing/styles/billing.css'),
  classifyBilling,
  {
    'services-billing': path.join(root, 'src/features/billing/pages/services-billing/services-billing.css'),
    'billing-visit-services': path.join(root, 'src/features/billing/pages/services-billing/billing-visit-services.css'),
    'payment': path.join(root, 'src/features/billing/pages/payment/payment.css'),
    'discount-request': path.join(root, 'src/features/billing/components/discount-request.css'),
    shared: path.join(root, 'src/features/billing/styles/shared.css'),
  },
);

splitFile(
  path.join(root, 'src/features/laboratory/styles/laboratory.css'),
  classifyLab,
  {
    'sample-collection': path.join(root, 'src/features/laboratory/pages/sample-collection/sample-collection.css'),
    worklist: path.join(root, 'src/features/laboratory/styles/worklist.css'),
  },
);

// Feature index files
fs.writeFileSync(path.join(root, 'src/features/opd/styles/index.css'), `/* OPD feature styles */
@import "../pages/walk-in-patient/walk-in-patient.css";
@import "../pages/patient-registration/patient-registration.css";
`);

fs.writeFileSync(path.join(root, 'src/features/billing/styles/index.css'), `/* Billing feature styles */
@import "../pages/services-billing/services-billing.css";
@import "../pages/services-billing/billing-visit-services.css";
@import "../pages/payment/payment.css";
@import "../components/discount-request.css";
@import "./shared.css";
`);

fs.writeFileSync(path.join(root, 'src/features/laboratory/styles/index.css'), `/* Laboratory feature styles */
@import "./worklist.css";
@import "../pages/sample-collection/sample-collection.css";
`);

// Future OPD page style stubs (per target architecture)
const opdStubs = [
  ['dashboard', 'opdDashboard.module.css'],
  ['queue', 'queue.module.css'],
  ['consultation', 'consultation.module.css'],
  ['billing', 'billing.module.css'],
];
for (const [folder, file] of opdStubs) {
  const dir = path.join(root, `src/features/opd/pages/${folder}`);
  fs.mkdirSync(dir, { recursive: true });
  const filePath = path.join(dir, file);
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, `/* OPD ${folder} page styles — add when page is implemented */\n`);
  }
}

// Auth login styles stub
fs.writeFileSync(path.join(root, 'src/features/auth/styles/login.css'), `/* Auth login & forgot-password */
.auth-card .ant-card {
  border-radius: 12px;
  box-shadow: 0 8px 24px rgba(15, 23, 42, 0.08);
}
`);
fs.writeFileSync(path.join(root, 'src/features/auth/styles/index.css'), `@import "./login.css";\n`);

// Remove old monolithic feature css files
for (const f of [
  'src/features/opd/styles/walk-in.css',
  'src/features/billing/styles/billing.css',
  'src/features/laboratory/styles/laboratory.css',
]) {
  if (fs.existsSync(path.join(root, f))) fs.unlinkSync(path.join(root, f));
}

console.log('Feature styles split into page-level files.');
