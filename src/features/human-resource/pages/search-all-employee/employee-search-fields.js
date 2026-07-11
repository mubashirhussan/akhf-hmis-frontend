import {
  ALL_FILTER_VALUE,
  DEPARTMENT_FILTER_OPTIONS,
  DESIGNATION_FILTER_OPTIONS,
  EMPLOYEE_STATUS_FILTER_OPTIONS,
  EMPLOYEE_TYPE_FILTER_OPTIONS,
  HOSPITAL_FILTER_OPTIONS,
} from '@/features/human-resource/api/mock-employee-search';

export const EMPLOYEE_SEARCH_FILTER_INITIAL_VALUES = {
  hospital: ALL_FILTER_VALUE,
  department: ALL_FILTER_VALUE,
  employeeQuery: '',
  designation: ALL_FILTER_VALUE,
  employeeType: ALL_FILTER_VALUE,
  status: ALL_FILTER_VALUE,
};

export const EMPLOYEE_SEARCH_FILTER_FIELDS = [
  {
    type: 'select',
    name: 'hospital',
    label: 'Hospital',
    floating: true,
    col: 6,
    options: HOSPITAL_FILTER_OPTIONS.filter((option) => option.value !== 'all'),
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
    type: 'text',
    name: 'employeeQuery',
    label: 'Employee',
    floating: true,
    col: 6,
    props: {
      allowClear: true,
      placeholder: 'Filter by name, emp no, emp id or CNIC',
      autoComplete: 'off',
    },
  },
  {
    type: 'select',
    name: 'designation',
    label: 'Designation',
    floating: true,
    col: 6,
    options: DESIGNATION_FILTER_OPTIONS,
  },
  {
    type: 'select',
    name: 'employeeType',
    label: 'Employee Type',
    floating: true,
    col: 6,
    options: EMPLOYEE_TYPE_FILTER_OPTIONS,
  },
  {
    type: 'select',
    name: 'status',
    label: 'Employee Status',
    floating: true,
    col: 6,
    options: EMPLOYEE_STATUS_FILTER_OPTIONS,
  },
];
