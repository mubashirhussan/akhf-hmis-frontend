import {
  BOOLEAN_OPTIONS,
  SERVICE_HEAD_OPTIONS,
} from '@/features/service-admin/api/mock-service-admin';

export const UPDATE_ADMIN_SERVICES_INITIAL_VALUES = {
  serviceName: '',
  serviceCategory: '',
  currentAmount: 0,
  serviceCharges: 0,
  serviceChargesBefore: 'true',
  serviceEditPrice: 'false',
  serviceHead: 'opd-income',
};

export function getUpdateAdminServicesFields({ serviceCategoryOptions = [] } = {}) {
  return [
    {
      type: 'select',
      name: 'serviceCategory',
      label: 'Service Category',
      options: serviceCategoryOptions,
      rules: [{ required: true, message: 'Service Category is required.' }],
      props: {
        showSearch: true,
        optionFilterProp: 'label',
        disabled: !serviceCategoryOptions.length,
      },
    },
    {
      type: 'text',
      name: 'serviceName',
      label: 'Service Name',
      rules: [{ required: true, whitespace: true, message: 'Service Name is required.' }],
    },
    {
      type: 'number',
      name: 'currentAmount',
      label: 'Current Amount',
      props: { disabled: true, className: 'update-admin-services-charges-input' },
    },
    {
      type: 'number',
      name: 'serviceCharges',
      label: 'Service Charges',
      rules: [{ required: true, message: 'Service Charges is required.' }],
      props: { min: 0, className: 'update-admin-services-charges-input' },
    },
    {
      type: 'select',
      name: 'serviceChargesBefore',
      label: 'Service Charges Before',
      options: BOOLEAN_OPTIONS,
    },
    {
      type: 'select',
      name: 'serviceEditPrice',
      label: 'Service Edit Price',
      options: BOOLEAN_OPTIONS,
    },
    {
      type: 'select',
      name: 'serviceHead',
      label: 'Service Head',
      options: SERVICE_HEAD_OPTIONS,
      rules: [{ required: true, message: 'Service Head is required.' }],
      props: { showSearch: true, optionFilterProp: 'label' },
    },
  ];
}
