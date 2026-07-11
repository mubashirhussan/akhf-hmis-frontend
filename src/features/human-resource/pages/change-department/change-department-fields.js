import {
  ALL_FILTER_VALUE,
  DEPARTMENT_FILTER_OPTIONS,
  DESIGNATION_FILTER_OPTIONS,
  HOSPITAL_FILTER_OPTIONS,
  SUB_DEPARTMENT_FILTER_OPTIONS,
} from '@/features/human-resource/api/mock-employee-search';

export const CHANGE_DEPARTMENT_INITIAL_VALUES = {
  department: '',
  subDepartment: '',
  designation: '',
  shift: '',
  reason: '',
};

export const CHANGE_DEPARTMENT_FILTER_INITIAL_VALUES = {
  hospital: ALL_FILTER_VALUE,
  department: ALL_FILTER_VALUE,
  designation: ALL_FILTER_VALUE,
  employeeName: '',
  cnicNo: '',
  employeeNo: '',
};

const SHIFT_OPTIONS = [
  { value: 'morning', label: 'Morning' },
  { value: 'evening', label: 'Evening' },
  { value: 'night', label: 'Night' },
];

export const CHANGE_DEPARTMENT_FIELDS = [
  {
    type: 'select',
    name: 'department',
    label: 'Department',
    col: 12,
    options: DEPARTMENT_FILTER_OPTIONS.filter((o) => o.value !== ALL_FILTER_VALUE),
    rules: [{ required: true, message: 'Department is required.' }],
  },
  {
    type: 'select',
    name: 'subDepartment',
    label: 'Sub Department',
    col: 12,
    options: SUB_DEPARTMENT_FILTER_OPTIONS.filter((o) => o.value !== ALL_FILTER_VALUE),
    rules: [{ required: true, message: 'Sub Department is required.' }],
  },
  {
    type: 'select',
    name: 'designation',
    label: 'Designation Name',
    col: 12,
    options: DESIGNATION_FILTER_OPTIONS.filter((o) => o.value !== ALL_FILTER_VALUE),
    rules: [{ required: true, message: 'Designation is required.' }],
  },
  {
    type: 'select',
    name: 'shift',
    label: 'Shift Name',
    col: 12,
    options: SHIFT_OPTIONS,
    rules: [{ required: true, message: 'Shift is required.' }],
  },
  {
    type: 'textarea',
    name: 'reason',
    label: 'Reason',
    col: 24,
    rules: [{ required: true, whitespace: true, message: 'Reason is required.' }],
    props: { rows: 3 },
  },
];

export const CHANGE_DEPARTMENT_FILTER_FIELDS = [
  {
    type: 'select',
    name: 'hospital',
    label: 'Hospital',
    floating: true,
    span: 8,
    options: HOSPITAL_FILTER_OPTIONS,
  },
  {
    type: 'select',
    name: 'department',
    label: 'Department',
    floating: true,
    span: 8,
    options: DEPARTMENT_FILTER_OPTIONS,
  },
  {
    type: 'select',
    name: 'designation',
    label: 'Designation',
    floating: true,
    span: 8,
    options: DESIGNATION_FILTER_OPTIONS,
  },
  {
    type: 'text',
    name: 'employeeName',
    label: 'Employee Name',
    floating: true,
    span: 8,
    props: { allowClear: true, autoComplete: 'off' },
  },
  {
    type: 'text',
    name: 'cnicNo',
    label: 'CNIC #',
    floating: true,
    span: 8,
    props: { allowClear: true, autoComplete: 'off' },
  },
  {
    type: 'text',
    name: 'employeeNo',
    label: 'Emp No',
    floating: true,
    span: 8,
    props: { allowClear: true, autoComplete: 'off' },
  },
];
