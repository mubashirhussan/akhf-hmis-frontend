import {
  WARD_OPTIONS,
  PACKAGE_SERVICE_HEAD_OPTIONS,
} from '@/features/service-admin/api/mock-service-admin';

export const NEW_PACKAGE_INITIAL_VALUES = {
  ward: undefined,
  department: undefined,
  packageName: '',
  totalAmount: null,
  doctorShare: null,
  description: '',
  serviceHead: undefined,
  serviceCategory: undefined,
  services: [],
};

export function getNewPackageFields({
  departmentOptions = [],
  serviceCategoryOptions = [],
  serviceOptions = [],
  hasServiceCategory = false,
  servicesTotalField,
} = {}) {
  return [
    {
      type: 'select',
      name: 'ward',
      label: 'Ward',
      col: 12,
      options: WARD_OPTIONS,
    },
    {
      type: 'select',
      name: 'department',
      label: 'Department',
      col: 12,
      options: departmentOptions,
      props: { showSearch: true, optionFilterProp: 'label' },
    },
    {
      type: 'text',
      name: 'packageName',
      label: 'Package Name',
      col: 12,
      rules: [{ required: true, whitespace: true, message: 'Package Name is required.' }],
    },
    {
      type: 'number',
      name: 'doctorShare',
      label: 'Doctor Share',
      col: 12,
      props: { min: 0 },
    },
    {
      type: 'select',
      name: 'serviceHead',
      label: 'Service Head',
      col: 12,
      options: PACKAGE_SERVICE_HEAD_OPTIONS,
      props: { showSearch: true, optionFilterProp: 'label' },
    },
    {
      type: 'textarea',
      name: 'description',
      label: 'Description',
      col: 12,
      props: { rows: 2 },
    },
    {
      type: 'select',
      name: 'serviceCategory',
      label: 'Service Category',
      col: 12,
      options: serviceCategoryOptions,
      props: {
        showSearch: true,
        optionFilterProp: 'label',
        disabled: !serviceCategoryOptions.length,
      },
    },
    {
      type: 'select',
      name: 'services',
      label: 'Services',
      col: 12,
      options: serviceOptions,
      props: {
        mode: 'multiple',
        showSearch: true,
        optionFilterProp: 'label',
        maxTagCount: 'responsive',
        disabled: !hasServiceCategory,
      },
    },
    ...(servicesTotalField ? [servicesTotalField] : []),
    {
      type: 'number',
      name: 'totalAmount',
      label: 'Package Amount',
      col: 12,
      props: { min: 0 },
    },
  ];
}
