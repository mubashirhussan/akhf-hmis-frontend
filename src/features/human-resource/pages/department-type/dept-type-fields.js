export const DEPT_TYPE_INITIAL_VALUES = {
  hospitalId: null,
  departmentType: '',
  status: 'active',
};

export const DEPT_TYPE_FILTER_INITIAL_VALUES = {
  hospitalId: null,
  departmentType: '',
  status: null,
};

export const getDeptTypeFields = ({
  hospitalOptions = [],
  hospitalsLoading = false,
  isEdit = false,
} = {}) => {
  const fields = [
    {
      type: 'select',
      name: 'hospitalId',
      label: 'Hospital Name',
      options: hospitalOptions,
      rules: [{ required: true, message: 'Hospital Name is required.' }],
      props: {
        loading: hospitalsLoading,
        disabled: isEdit,
        placeholder: 'Select hospital',
        showSearch: true,
        optionFilterProp: 'label',
      },
    },
    {
      type: 'text',
      name: 'departmentType',
      label: 'Department Type',
      rules: [{ required: true, whitespace: true, message: 'Department Type is required.' }],
      props: { autoComplete: 'off' },
    },
  ];

  if (isEdit) {
    fields.push({
      type: 'select',
      name: 'status',
      label: 'Status',
      options: [
        { value: 'active', label: 'Active' },
        { value: 'inactive', label: 'inactive' },
      ],
      rules: [{ required: true, message: 'Status is required.' }],
    });
  }

  return fields;
};

export const getDeptTypeFilterFields = ({ hospitalOptions = [] } = {}) => [
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
    type: 'text',
    name: 'departmentType',
    label: 'Department Type',
    floating: true,
    span: 6,
    props: { allowClear: true, autoComplete: 'off' },
  },
  {
    type: 'select',
    name: 'status',
    label: 'Status',
    floating: true,
    span: 6,
    options: [
      { value: 'active', label: 'Active' },
      { value: 'inactive', label: 'inactive' },
    ],
    props: { allowClear: true, placeholder: '' },
  },
];
