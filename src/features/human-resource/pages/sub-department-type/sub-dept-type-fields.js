export const SUB_DEPT_TYPE_INITIAL_VALUES = {
  hospitalId: null,
  deptTypeId: null,
  departmentId: null,
  subDepartmentType: '',
};

export const SUB_DEPT_TYPE_FILTER_INITIAL_VALUES = {
  deptTypeId: null,
  departmentId: null,
  subDepartmentType: '',
};

export const getSubDeptTypeFields = ({
  hospitalOptions = [],
  hospitalsLoading = false,
  deptTypeOptions = [],
  departmentOptions = [],
  hospitalId = null,
  deptTypeId = null,
} = {}) => [
  {
    type: 'select',
    name: 'hospitalId',
    label: 'Hospital Name',
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
    type: 'select',
    name: 'departmentId',
    label: 'Department Name',
    options: departmentOptions,
    rules: [{ required: true, message: 'Department Name is required.' }],
    props: {
      disabled: !deptTypeId,
      showSearch: true,
      optionFilterProp: 'label',
      placeholder: deptTypeId ? 'Select department' : 'Select department type first',
    },
  },
  {
    type: 'text',
    name: 'subDepartmentType',
    label: 'Sub Department Type',
    rules: [{ required: true, whitespace: true, message: 'Sub Department Type is required.' }],
    props: { autoComplete: 'off' },
  },
];

export const getSubDeptTypeFilterFields = ({
  deptTypeOptions = [],
  departmentOptions = [],
} = {}) => [
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
    type: 'select',
    name: 'departmentId',
    label: 'Department Name',
    floating: true,
    span: 6,
    options: departmentOptions,
    props: {
      allowClear: true,
      showSearch: true,
      optionFilterProp: 'label',
      placeholder: '',
    },
  },
  {
    type: 'text',
    name: 'subDepartmentType',
    label: 'Sub Department Type',
    floating: true,
    span: 6,
    props: { allowClear: true, autoComplete: 'off' },
  },
];
