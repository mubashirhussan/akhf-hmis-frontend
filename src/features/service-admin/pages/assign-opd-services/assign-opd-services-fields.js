export const ASSIGN_OPD_SERVICES_INITIAL_VALUES = {
  hospital: undefined,
  patientType: undefined,
  serviceCategory: undefined,
  service: undefined,
  subDepartment: undefined,
  amount: null,
};

export function getAssignOpdServicesFields({
  hospitalOptions = [],
  patientTypeOptions = [],
  serviceCategoryOptions = [],
  serviceOptions = [],
  subDepartmentOptions = [],
  hasServiceCategory = false,
} = {}) {
  return [
    {
      type: 'select',
      name: 'hospital',
      label: 'Hospital',
      options: hospitalOptions,
      rules: [{ required: true, message: 'Hospital is required.' }],
      props: { showSearch: true, optionFilterProp: 'label', placeholder: 'Select Hospital' },
    },
    {
      type: 'select',
      name: 'patientType',
      label: 'Patient Type',
      options: patientTypeOptions,
      rules: [{ required: true, message: 'Patient Type is required.' }],
      props: { showSearch: true, optionFilterProp: 'label', placeholder: 'Select Patient Type' },
    },
    {
      type: 'select',
      name: 'serviceCategory',
      label: 'Service Category',
      options: serviceCategoryOptions,
      rules: [{ required: true, message: 'Service Category is required.' }],
      props: {
        showSearch: true,
        optionFilterProp: 'label',
        placeholder: 'Select Service Category',
      },
    },
    {
      type: 'select',
      name: 'service',
      label: 'Service',
      options: serviceOptions,
      rules: [{ required: true, message: 'Service is required.' }],
      props: {
        showSearch: true,
        optionFilterProp: 'label',
        placeholder: hasServiceCategory ? 'Select Service' : 'Select a category first',
        disabled: !hasServiceCategory,
      },
    },
    {
      type: 'select',
      name: 'subDepartment',
      label: 'Sub Department',
      options: subDepartmentOptions,
      rules: [{ required: true, message: 'Sub Department is required.' }],
      props: {
        showSearch: true,
        optionFilterProp: 'label',
        placeholder: 'Select Sub Department',
      },
    },
    {
      type: 'number',
      name: 'amount',
      label: 'Amount',
      rules: [{ required: true, message: 'Amount is required.' }],
      props: { min: 0, placeholder: 'Enter Amount' },
    },
  ];
}
