export const WARD_BEDS_INITIAL_VALUES = {
  hospitalId: undefined,
  departmentId: undefined,
  subDepartmentId: undefined,
  wardName: '',
  rooms: null,
  maxBeds: null,
};

export function getWardBedsFields({
  hospitalOptions = [],
  departmentOptions = [],
  subDepartmentOptions = [],
  hasHospital = false,
  hasDepartment = false,
} = {}) {
  return [
    {
      type: 'select',
      name: 'hospitalId',
      label: 'Hospital',
      options: hospitalOptions,
      rules: [{ required: true, message: 'Hospital is required.' }],
      props: { showSearch: true, optionFilterProp: 'label', placeholder: 'Select Hospital' },
    },
    {
      type: 'select',
      name: 'departmentId',
      label: 'Department',
      options: departmentOptions,
      rules: [{ required: true, message: 'Department is required.' }],
      props: {
        showSearch: true,
        optionFilterProp: 'label',
        placeholder: hasHospital ? 'Select Department' : 'Select a hospital first',
        disabled: !hasHospital,
      },
    },
    {
      type: 'select',
      name: 'subDepartmentId',
      label: 'Sub Department',
      options: subDepartmentOptions,
      rules: [{ required: true, message: 'Sub Department is required.' }],
      props: {
        showSearch: true,
        optionFilterProp: 'label',
        placeholder: hasDepartment ? 'Select Sub Department' : 'Select a department first',
        disabled: !hasDepartment,
      },
    },
    {
      type: 'text',
      name: 'wardName',
      label: 'Ward Name',
      rules: [{ required: true, whitespace: true, message: 'Ward Name is required.' }],
      props: { placeholder: 'Enter Ward Name' },
    },
    {
      type: 'number',
      name: 'rooms',
      label: 'Rooms',
      rules: [{ required: true, message: 'Rooms is required.' }],
      props: { min: 1, precision: 0, placeholder: 'Number of rooms' },
    },
    {
      type: 'number',
      name: 'maxBeds',
      label: 'Maximum Beds',
      rules: [{ required: true, message: 'Maximum Beds is required.' }],
      props: { min: 1, precision: 0, placeholder: 'Max beds per room' },
    },
  ];
}
