import { DELIVERED_DELIVER_RELATION_OPTIONS } from '@/features/laboratory/api/mock-delivered-reports';

export const DELIVERED_DELIVERY_TOP_FIELDS = [
  {
    type: 'text',
    name: 'deliverFirstName',
    label: 'First Name',
    col: 6,
    floating: true,
    props: { autoComplete: 'off' },
  },
  {
    type: 'text',
    name: 'deliverLastName',
    label: 'Last Name',
    col: 6,
    floating: true,
    props: { autoComplete: 'off' },
  },
  {
    type: 'text',
    name: 'description',
    label: 'Description',
    col: 12,
    floating: true,
    props: { autoComplete: 'off' },
  },
];

export const DELIVERED_DELIVERY_RELATION_FIELDS = [
  {
    type: 'select',
    name: 'deliverRelation',
    label: 'Relation',
    col: 6,
    floating: true,
    options: DELIVERED_DELIVER_RELATION_OPTIONS,
  },
  {
    type: 'text',
    name: 'relationFirstName',
    label: 'First Name',
    col: 6,
    floating: true,
    props: { autoComplete: 'off' },
  },
  {
    type: 'text',
    name: 'relationLastName',
    label: 'Last Name',
    col: 6,
    floating: true,
    props: { autoComplete: 'off' },
  },
  {
    type: 'text',
    name: 'cnic',
    label: 'CNIC #',
    col: 6,
    floating: true,
    props: { autoComplete: 'off' },
  },
];
