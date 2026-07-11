export const NEW_CATEGORY_INITIAL_VALUES = {
  serviceName: '',
};

export const NEW_CATEGORY_FIELDS = [
  {
    type: 'text',
    name: 'serviceName',
    label: 'Service Category',
    rules: [{ required: true, whitespace: true, message: 'Service Category is required.' }],
  },
];
