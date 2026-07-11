import {
  B2B_LABS_OPTIONS,
  ACTIVE_STATUS_OPTIONS,
} from '@/features/service-admin/api/mock-service-admin';

export const PATIENT_TYPE_INITIAL_VALUES = {
  patientType: '',
  b2bLabs: '',
  status: 'active',
};

export const getPatientTypeFields = ({ isEdit = false } = {}) => {
  const fields = [
    {
      type: 'text',
      name: 'patientType',
      label: 'Patient Type',
      rules: [{ required: true, whitespace: true, message: 'Patient Type is required.' }],
    },
    {
      type: 'select',
      name: 'b2bLabs',
      label: 'B2B LABS',
      options: B2B_LABS_OPTIONS,
      rules: [{ required: true, message: 'B2B LABS is required.' }],
      props: { placeholder: 'Select' },
    },
  ];

  if (isEdit) {
    fields.push({
      type: 'select',
      name: 'status',
      label: 'Status',
      options: ACTIVE_STATUS_OPTIONS,
      rules: [{ required: true, message: 'Status is required.' }],
      props: { placeholder: 'Select' },
    });
  }

  return fields;
};
