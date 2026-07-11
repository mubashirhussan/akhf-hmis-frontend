export const ADMIN_DUTY_ROASTER_INITIAL_VALUES = {
  departmentId: undefined,
  subDepartmentId: undefined,
  shiftId: undefined,
  startTime: null,
  durationHours: 0,
  durationMinutes: 0,
};

export const ADMIN_DUTY_ROASTER_FILTER_INITIAL_VALUES = {
  departmentId: undefined,
  subDepartmentId: undefined,
  shiftId: undefined,
  startTime: null,
  durationHours: null,
  durationMinutes: null,
};

export function getAdminDutyRoasterFields({
  departmentOptions = [],
  subDepartmentOptions = [],
  shiftOptions = [],
  hasDepartment = false,
  durationField,
} = {}) {
  return [
    {
      type: 'select',
      name: 'departmentId',
      label: 'Department Name',
      col: 12,
      options: departmentOptions,
      rules: [{ required: true, message: 'Department Name is required.' }],
      props: {
        showSearch: true,
        optionFilterProp: 'label',
        placeholder: 'Select department',
      },
    },
    {
      type: 'select',
      name: 'subDepartmentId',
      label: 'Sub Department Name',
      col: 12,
      options: subDepartmentOptions,
      rules: [{ required: true, message: 'Sub Department Name is required.' }],
      props: {
        showSearch: true,
        optionFilterProp: 'label',
        placeholder: 'Select sub department',
        disabled: !hasDepartment,
      },
    },
    {
      type: 'select',
      name: 'shiftId',
      label: 'Shift Name',
      col: 12,
      options: shiftOptions,
      rules: [{ required: true, message: 'Shift Name is required.' }],
      props: {
        showSearch: true,
        optionFilterProp: 'label',
        placeholder: 'Select shift',
      },
    },
    {
      type: 'time',
      name: 'startTime',
      label: 'Start Time',
      col: 12,
      rules: [{ required: true, message: 'Start Time is required.' }],
      props: { use12Hours: true, format: 'h:mm A' },
    },
    ...(durationField ? [durationField] : []),
  ];
}

export function getAdminDutyRoasterFilterFields({
  departmentOptions = [],
  subDepartmentOptions = [],
  shiftOptions = [],
  hasDepartment = false,
} = {}) {
  return [
    {
      type: 'select',
      name: 'departmentId',
      label: 'Department Name',
      col: 6,
      floating: true,
      options: departmentOptions,
      props: {
        allowClear: true,
        showSearch: true,
        optionFilterProp: 'label',
        placeholder: '',
      },
    },
    {
      type: 'select',
      name: 'subDepartmentId',
      label: 'Sub Department Name',
      col: 6,
      floating: true,
      options: subDepartmentOptions,
      props: {
        allowClear: true,
        showSearch: true,
        optionFilterProp: 'label',
        placeholder: '',
        disabled: !hasDepartment,
      },
    },
    {
      type: 'select',
      name: 'shiftId',
      label: 'Shift Name',
      col: 6,
      floating: true,
      options: shiftOptions,
      props: {
        allowClear: true,
        showSearch: true,
        optionFilterProp: 'label',
        placeholder: '',
      },
    },
    {
      type: 'time',
      name: 'startTime',
      label: 'Start Time',
      col: 6,
      floating: true,
      props: { use12Hours: true, format: 'h:mm A', allowClear: true },
    },
    {
      type: 'number',
      name: 'durationHours',
      label: 'Duration (hr.)',
      col: 6,
      floating: true,
      props: { min: 0, max: 23, precision: 0 },
    },
    {
      type: 'number',
      name: 'durationMinutes',
      label: 'Duration (min)',
      col: 6,
      floating: true,
      props: { min: 0, max: 59, precision: 0 },
    },
  ];
}
