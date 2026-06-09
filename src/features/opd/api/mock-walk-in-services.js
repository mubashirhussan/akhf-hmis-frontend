export const MOCK_DOCTORS = [
  { id: '1', name: 'Ali Raza' },
  { id: '2', name: 'Sara Khan' },
  { id: '3', name: 'Hassan Ali' },
];

export const MOCK_SERVICES = [
  {
    id: 'esr',
    name: 'ESR (Erythrocytes Sedimentation Rate)',
    price: 300,
    category: 'laboratory',
  },
  {
    id: 'cbc',
    name: 'CBC (Complete Blood Count)',
    price: 450,
    category: 'laboratory',
  },
  {
    id: 'xray',
    name: 'X-Ray Chest PA View',
    price: 1200,
    category: 'radiology',
  },
  {
    id: 'consult',
    name: 'General Consultation',
    price: 1500,
    category: 'consultation',
  },
  {
    id: 'urine',
    name: 'Urine Routine Examination',
    price: 350,
    category: 'laboratory',
  },
  {
    id: 'ultrasound',
    name: 'Ultrasound Abdomen',
    price: 2500,
    category: 'radiology',
  },
  {
    id: 'ecg',
    name: 'ECG',
    price: 800,
    category: 'consultation',
  },
  {
    id: 'lft',
    name: 'Liver Function Test',
    price: 900,
    category: 'laboratory',
  },
  {
    id: 'rft',
    name: 'Renal Function Test',
    price: 900,
    category: 'laboratory',
  },
  {
    id: 'mri',
    name: 'MRI Brain',
    price: 12000,
    category: 'radiology',
  },
  {
    id: 'followup',
    name: 'Follow-up Consultation',
    price: 1000,
    category: 'consultation',
  },
];

const PAGE_SIZE = 10;

export function searchServices(services, category, query) {
  const trimmed = query.trim().toLowerCase();

  return services.filter((service) => {
    const matchesCategory = category === 'all' || service.category === category;
    const matchesQuery = !trimmed || service.name.toLowerCase().includes(trimmed);
    return matchesCategory && matchesQuery;
  });
}

export function paginateServices(services, page, pageSize = PAGE_SIZE) {
  const start = (page - 1) * pageSize;
  return {
    items: services.slice(start, start + pageSize),
    total: services.length,
    pageSize,
  };
}

export function formatServiceDateTime(date = new Date()) {
  const datePart = date.toLocaleDateString('en-GB');
  const timePart = date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
  });

  return `${datePart} ${timePart}`;
}

export function formatPkr(amount) {
  return `PKR ${Number(amount).toLocaleString('en-PK')}`;
}
