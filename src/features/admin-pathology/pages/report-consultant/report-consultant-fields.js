import { DOCTOR_OPTIONS } from '@/features/admin-pathology/api/mock-report-consultant';

export const REPORT_CONSULTANT_INITIAL_VALUES = {
  doctorName: '',
  doctorDesignation: '',
  doctorQualification: '',
};

export const REPORT_CONSULTANT_FIELDS = [
  {
    type: 'select',
    name: 'doctorName',
    label: 'Doctor Name',
    options: DOCTOR_OPTIONS,
    rules: [{ required: true, message: 'Doctor Name is required.' }],
    props: {
      placeholder: 'Select doctor',
      showSearch: true,
      optionFilterProp: 'label',
    },
  },
  {
    type: 'text',
    name: 'doctorDesignation',
    label: 'Doctor Designation',
    rules: [
      { required: true, whitespace: true, message: 'Doctor Designation is required.' },
    ],
  },
  {
    type: 'textarea',
    name: 'doctorQualification',
    label: 'Doctor Qualification',
    rules: [
      {
        required: true,
        whitespace: true,
        message: 'Doctor Qualification is required.',
      },
    ],
    props: { rows: 3 },
  },
];
