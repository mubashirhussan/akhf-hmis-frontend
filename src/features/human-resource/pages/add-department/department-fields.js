export const DEPARTMENT_INITIAL_VALUES = {
  hospitalId: null,
  deptTypeId: null,
  departmentName: '',
  phone: '',
  fax: '',
  location: '',
};

export const DEPARTMENT_FILTER_INITIAL_VALUES = {
  hospitalId: null,
  deptTypeId: null,
  departmentName: '',
};

export const getDepartmentFields = ({
  hospitalOptions = [],
  hospitalsLoading = false,
  deptTypeOptions = [],
  hospitalId = null,
} = {}) => [
  {
    type: 'select',
    name: 'hospitalId',
    label: 'Hospital Name',
    col: 12,
    options: hospitalOptions,
    rules: [{ required: true, message: 'Hospital Name is required.' }],
    props: {
      loading: hospitalsLoading,
      showSearch: true,
      optionFilterProp: 'label',
      placeholder: 'Select hospital',
    },
  },
  {
    type: 'select',
    name: 'deptTypeId',
    label: 'Department Type',
    col: 12,
    options: deptTypeOptions,
    rules: [{ required: true, message: 'Department Type is required.' }],
    props: {
      disabled: !hospitalId,
      showSearch: true,
      optionFilterProp: 'label',
      placeholder: hospitalId ? 'Select department type' : 'Select hospital first',
    },
  },
  {
    type: 'text',
    name: 'departmentName',
    label: 'Department Name',
    col: 12,
    rules: [{ required: true, whitespace: true, message: 'Department Name is required.' }],
    props: { autoComplete: 'off' },
  },
  {
    type: 'text',
    name: 'phone',
    label: 'Phone',
    col: 12,
    props: { autoComplete: 'off' },
  },
  {
    type: 'text',
    name: 'fax',
    label: 'Fax #',
    col: 12,
    props: { autoComplete: 'off' },
  },
  {
    type: 'text',
    name: 'location',
    label: 'Location',
    col: 24,
    props: { autoComplete: 'off' },
  },
];

export const getDepartmentFilterFields = ({
  hospitalOptions = [],
  deptTypeOptions = [],
} = {}) => [
  {
    type: 'select',
    name: 'hospitalId',
    label: 'Hospital Name',
    floating: true,
    span: 6,
    options: hospitalOptions,
    props: {
      allowClear: true,
      showSearch: true,
      optionFilterProp: 'label',
      placeholder: '',
    },
  },
  {
    type: 'select',
    name: 'deptTypeId',
    label: 'Department Type',
    floating: true,
    span: 6,
    options: deptTypeOptions,
    props: {
      allowClear: true,
      showSearch: true,
      optionFilterProp: 'label',
      placeholder: '',
    },
  },
  {
    type: 'text',
    name: 'departmentName',
    label: 'Department Name',
    floating: true,
    span: 6,
    props: { allowClear: true, autoComplete: 'off' },
  },
];
