import { RELAXATION_TIME_OPTIONS } from '@/features/duty-roaster/api/mock-shifts';

export const SHIFT_INITIAL_VALUES = {
  shiftName: '',
  shiftDescription: '',
  abbreviation: '',
  startTime: null,
  endTime: null,
  relaxationTime: 0,
};

export const SHIFT_FILTER_INITIAL_VALUES = {
  shiftName: '',
  shiftDescription: '',
  abbreviation: '',
  startTime: null,
  endTime: null,
  relaxationTime: null,
};

export const SHIFT_FIELDS = [
  {
    type: 'text',
    name: 'shiftName',
    label: 'Shift Name',
    col: 12,
    rules: [{ required: true, whitespace: true, message: 'Shift Name is required.' }],
    props: { autoComplete: 'off' },
  },
  {
    type: 'text',
    name: 'shiftDescription',
    label: 'Shift Description',
    col: 24,
    props: { autoComplete: 'off' },
  },
  {
    type: 'text',
    name: 'abbreviation',
    label: 'Abbreviation',
    col: 12,
    rules: [{ required: true, whitespace: true, message: 'Abbreviation is required.' }],
    props: { autoComplete: 'off' },
  },
  {
    type: 'time',
    name: 'startTime',
    label: 'Start Time',
    col: 12,
    rules: [{ required: true, message: 'Start Time is required.' }],
    props: { use12Hours: true, format: 'h:mm A' },
  },
  {
    type: 'time',
    name: 'endTime',
    label: 'End Time',
    col: 12,
    rules: [{ required: true, message: 'End Time is required.' }],
    props: { use12Hours: true, format: 'h:mm A' },
  },
  {
    type: 'select',
    name: 'relaxationTime',
    label: 'Time Relaxation',
    col: 12,
    options: RELAXATION_TIME_OPTIONS,
  },
];

export const SHIFT_FILTER_FIELDS = [
  {
    type: 'text',
    name: 'shiftName',
    label: 'Shift Name',
    col: 6,
    floating: true,
    props: { allowClear: true, autoComplete: 'off' },
  },
  {
    type: 'text',
    name: 'shiftDescription',
    label: 'Shift Description',
    col: 6,
    floating: true,
    props: { allowClear: true, autoComplete: 'off' },
  },
  {
    type: 'text',
    name: 'abbreviation',
    label: 'Abbreviation',
    col: 6,
    floating: true,
    props: { allowClear: true, autoComplete: 'off' },
  },
  {
    type: 'time',
    name: 'startTime',
    label: 'Start Time',
    col: 6,
    floating: true,
    props: { use12Hours: true, format: 'h:mm A', allowClear: true },
  },
  {
    type: 'time',
    name: 'endTime',
    label: 'End Time',
    col: 6,
    floating: true,
    props: { use12Hours: true, format: 'h:mm A', allowClear: true },
  },
  {
    type: 'select',
    name: 'relaxationTime',
    label: 'Time Relaxation',
    col: 6,
    floating: true,
    options: RELAXATION_TIME_OPTIONS,
    props: { allowClear: true, placeholder: '' },
  },
];
