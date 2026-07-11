import { Checkbox, Select } from 'antd';
import {
  BILLING_PACKAGE_OPTIONS,
  BILLING_REFERENCE_OPTIONS,
  BILLING_SERVICE_CATEGORY_OPTIONS,
} from '@/features/billing/api/mock-billing-visit-services';
import { FIELD_CONTROL_CLASS } from '@/lib/field-control';

export const BILLING_VISIT_SERVICES_FILTER_INITIAL_VALUES = {
  category: 'all',
  reference: undefined,
  packageId: undefined,
  searchQuery: '',
  selectedServices: [],
};

function ServiceMultiSelect({
  value,
  onChange,
  options = [],
  selectedServiceSet = new Set(),
  hasSearched = false,
}) {
  return (
    <div className="walk-in-service-results-dropdown-wrap">
      <Select
        size="middle"
        mode="multiple"
        allowClear
        className={`w-full ${FIELD_CONTROL_CLASS}`}
        placeholder="Select services"
        value={value}
        options={options}
        onChange={onChange}
        disabled={!hasSearched}
        maxTagCount={1}
        maxTagTextLength={26}
        maxTagPlaceholder={(omittedValues) => `+${omittedValues.length}`}
        optionRender={(option) => (
          <div className="walk-in-service-option">
            <Checkbox
              checked={selectedServiceSet.has(option.value)}
              tabIndex={-1}
              className="walk-in-service-option-checkbox"
            />
            <span className="walk-in-service-option-label">{option.label}</span>
          </div>
        )}
      />
    </div>
  );
}

export function getBillingVisitServicesFilterFields({
  serviceSelectOptions = [],
  selectedServiceSet = new Set(),
  hasSearched = false,
} = {}) {
  return [
    {
      type: 'select',
      name: 'category',
      label: 'Category',
      col: 5,
      floating: true,
      options: BILLING_SERVICE_CATEGORY_OPTIONS,
    },
    {
      type: 'select',
      name: 'reference',
      label: 'Select Refer',
      col: 5,
      floating: true,
      options: BILLING_REFERENCE_OPTIONS,
      props: { placeholder: 'Select Reference', allowClear: true },
    },
    {
      type: 'select',
      name: 'packageId',
      label: 'Select Packages',
      col: 5,
      floating: true,
      options: BILLING_PACKAGE_OPTIONS,
      props: { placeholder: 'Select Packages', allowClear: true },
    },
    {
      type: 'text',
      name: 'searchQuery',
      label: 'Search Services',
      col: 5,
      floating: true,
      props: { placeholder: 'Search Services here...', autoComplete: 'off', allowClear: true },
    },
    {
      type: 'custom',
      name: 'selectedServices',
      label: 'Select Services',
      col: 4,
      floating: true,
      props: {
        render: () => (
          <ServiceMultiSelect
            options={serviceSelectOptions}
            selectedServiceSet={selectedServiceSet}
            hasSearched={hasSearched}
          />
        ),
      },
    },
  ];
}
