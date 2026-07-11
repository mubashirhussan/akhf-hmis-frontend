import {
  ALL_FILTER_VALUE,
  DEPARTMENT_FILTER_OPTIONS,
  HOSPITAL_FILTER_OPTIONS,
  SUB_DEPARTMENT_FILTER_OPTIONS,
} from '@/features/human-resource/api/mock-employee-search';

export const ACTIVATE_DEACTIVATE_FILTER_INITIAL_VALUES = {
  hospital: ALL_FILTER_VALUE,
  department: ALL_FILTER_VALUE,
  subDepartment: ALL_FILTER_VALUE,
  employeeNo: '',
  employeeName: '',
  status: ALL_FILTER_VALUE,
};

export const ACTIVATE_DEACTIVATE_STATUS_OPTIONS = [
  { value: ALL_FILTER_VALUE, label: 'All' },
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' },
];

export const ACTIVATE_DEACTIVATE_FILTER_FIELDS = [
  {
    type: 'select',
    name: 'hospital',
    label: 'Hospital',
    floating: true,
    col: 6,
    options: HOSPITAL_FILTER_OPTIONS,
  },
  {
    type: 'select',
    name: 'department',
    label: 'Department',
    floating: true,
    col: 6,
    options: DEPARTMENT_FILTER_OPTIONS,
  },
  {
    type: 'select',
    name: 'subDepartment',
    label: 'Sub Department',
    floating: true,
    col: 6,
    options: SUB_DEPARTMENT_FILTER_OPTIONS,
  },
  {
    type: 'text',
    name: 'employeeNo',
    label: 'Employee No.',
    floating: true,
    col: 6,
    props: { allowClear: true, placeholder: '', autoComplete: 'off' },
  },
  {
    type: 'text',
    name: 'employeeName',
    label: 'Employee Name',
    floating: true,
    col: 6,
    props: { allowClear: true, placeholder: '', autoComplete: 'off' },
  },
  {
    type: 'select',
    name: 'status',
    label: 'Status',
    floating: true,
    col: 6,
    options: ACTIVATE_DEACTIVATE_STATUS_OPTIONS,
  },
];
