import dayjs from 'dayjs';
import { createResultEntryTestsForRecord } from '@/features/laboratory/api/mock-result-entry';
import { LABORATORY_TEST_GROUP_OPTIONS } from '@/features/laboratory/api/mock-laboratory-worklist';

const TEST_GROUP_LABELS = Object.fromEntries(
  LABORATORY_TEST_GROUP_OPTIONS.filter((option) => option.value !== 'all').map((option) => [
    option.value,
    option.label,
  ]),
);

export const UNDELIVERED_PAYMENT_STATUS_META = {
  paid: { label: 'Paid', tone: 'paid' },
  'request-for-refund': { label: 'Request for refund', tone: 'refund' },
  pending: { label: 'Pending', tone: 'pending' },
};

const DEMO_PAYMENT_STATUSES = ['paid', 'request-for-refund', 'pending'];

export const UNDELIVERED_DELIVER_RELATION_OPTIONS = [
  { value: 'S/O', label: 'S/O' },
  { value: 'D/O', label: 'D/O' },
  { value: 'W/O', label: 'W/O' },
];

export function formatUndeliveredBookingDate(requestedDate) {
  if (!requestedDate) return '—';

  const datePart = String(requestedDate).split(' ')[0];
  const parsed = dayjs(datePart, 'DD/MM/YYYY');

  return parsed.isValid() ? parsed.format('MMM DD, YYYY') : requestedDate;
}

export function getUndeliveredReportLineItems(record) {
  const tests = createResultEntryTestsForRecord(record);
  const pfName = record?.testDisplay ?? record?.relationName ?? '—';

  return tests.map((test, index) => {
    const paymentStatus = DEMO_PAYMENT_STATUSES[index % DEMO_PAYMENT_STATUSES.length];
    const paymentMeta = UNDELIVERED_PAYMENT_STATUS_META[paymentStatus];

    return {
      id: test.id,
      mainId: record?.labNo ?? '—',
      pfName,
      patientName: record?.patientName ?? '—',
      relation: record?.relation ?? '—',
      groupName: TEST_GROUP_LABELS[test.testGroup] ?? test.testGroup,
      bookingDate: formatUndeliveredBookingDate(record?.requestedDate),
      paymentStatus,
      paymentStatusLabel: paymentMeta?.label ?? paymentStatus,
      paymentStatusTone: paymentMeta?.tone ?? 'pending',
      department: record?.department ?? '—',
      testBookingName: test.label,
    };
  });
}

export function createUndeliveredDeliveryForm(record) {
  const relationNameParts = String(record?.relationName ?? '')
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  return {
    deliverFirstName: '',
    deliverLastName: '',
    deliverRelation: record?.relation ?? 'S/O',
    relationFirstName: relationNameParts[0] ?? '',
    relationLastName: relationNameParts.slice(1).join(' '),
    cnic: '',
    description: '',
  };
}
