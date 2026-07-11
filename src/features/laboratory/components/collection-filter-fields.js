import DateRangeField from '@/components/ui/DateRangeField';
import DobAgeField from '@/components/ui/DobAgeField';
import {
  CENTER_TYPE_OPTIONS,
  createLaboratoryWorklistFilters,
  LABORATORY_PATIENT_TYPE_OPTIONS,
  LABORATORY_SEND_OUT_OPTIONS,
  LABORATORY_STATUS_OPTIONS,
  LABORATORY_TEST_GROUP_OPTIONS,
} from '@/features/laboratory/api/mock-laboratory-worklist';
import { DOB_AGE_UNITS } from '@/lib/dob-from-age';

export function getCollectionFilterInitialValues(defaultStatus) {
  const base = createLaboratoryWorklistFilters(defaultStatus);

  return {
    firstName: base.firstName,
    lastName: base.lastName,
    cnic: base.cnic,
    dateRange: null,
    labNo: base.labNo,
    patientType: base.patientType,
    mrNo: base.mrNo,
    visitNo: base.visitNo,
    dobAge: {
      age: '',
      unit: DOB_AGE_UNITS.years,
    },
    mobile: base.mobile,
    testNameText: base.testNameText,
    status: base.status,
    testGroup: base.testGroup,
    sendOut: base.sendOut,
    departmentType: base.departmentType,
    referenceNo: base.referenceNo,
  };
}

export function normalizeCollectionFilters(values = {}) {
  const { dobAge, ...rest } = values;

  return {
    ...rest,
    patientAge: dobAge?.age ?? '',
    ageUnit: dobAge?.unit ?? DOB_AGE_UNITS.years,
  };
}

export const COLLECTION_FILTER_FIELDS = [
  {
    type: 'text',
    name: 'firstName',
    label: 'First Name',
    col: 6,
    floating: true,
    props: { allowClear: true, autoComplete: 'off' },
  },
  {
    type: 'text',
    name: 'mrNo',
    label: 'MR #',
    col: 6,
    floating: true,
    props: { allowClear: true, autoComplete: 'off' },
  },
  {
    type: 'dobAge',
    name: 'dobAge',
    label: 'DOB',
    col: 6,
    floating: true,
    props: {
      component: function DobAgeFormControl({ value, onChange }) {
        return (
          <DobAgeField
            embedded
            className="patient-reg-dob-age"
            age={value?.age ?? ''}
            unit={value?.unit ?? DOB_AGE_UNITS.years}
            onChange={onChange}
          />
        );
      },
    },
  },
  {
    type: 'select',
    name: 'status',
    label: 'Status',
    col: 6,
    floating: true,
    options: LABORATORY_STATUS_OPTIONS,
    props: { allowClear: true, placeholder: '' },
  },
  {
    type: 'text',
    name: 'lastName',
    label: 'Last Name',
    col: 6,
    floating: true,
    props: { allowClear: true, autoComplete: 'off' },
  },
  {
    type: 'text',
    name: 'visitNo',
    label: 'Visit #',
    col: 6,
    floating: true,
    props: { allowClear: true, autoComplete: 'off' },
  },
  {
    type: 'custom',
    name: 'dateRange',
    label: 'From - To Date',
    col: 6,
    floating: true,
    props: {
      render: () => <DateRangeField />,
    },
  },
  {
    type: 'select',
    name: 'departmentType',
    label: 'Center',
    col: 6,
    floating: true,
    options: CENTER_TYPE_OPTIONS,
    props: { allowClear: true, placeholder: '' },
  },
  {
    type: 'text',
    name: 'cnic',
    label: 'CNIC #',
    col: 6,
    floating: true,
    props: { allowClear: true, autoComplete: 'off' },
  },
  {
    type: 'text',
    name: 'labNo',
    label: 'Lab #',
    col: 6,
    floating: true,
    props: { allowClear: true, autoComplete: 'off' },
  },
  {
    type: 'select',
    name: 'testGroup',
    label: 'Test Group',
    col: 6,
    floating: true,
    options: LABORATORY_TEST_GROUP_OPTIONS,
    props: { allowClear: true, placeholder: '' },
  },
  {
    type: 'select',
    name: 'patientType',
    label: 'Patient Type',
    col: 6,
    floating: true,
    options: LABORATORY_PATIENT_TYPE_OPTIONS,
    props: { allowClear: true, placeholder: '' },
  },
  {
    type: 'text',
    name: 'mobile',
    label: 'Mobile #',
    col: 6,
    floating: true,
    props: { allowClear: true, autoComplete: 'off' },
  },
  {
    type: 'text',
    name: 'referenceNo',
    label: 'Reference #',
    col: 6,
    floating: true,
    props: { allowClear: true, autoComplete: 'off' },
  },
  {
    type: 'text',
    name: 'testNameText',
    label: 'Test Name',
    col: 6,
    floating: true,
    props: { allowClear: true, autoComplete: 'off' },
  },
  {
    type: 'select',
    name: 'sendOut',
    label: 'Send Out',
    col: 6,
    floating: true,
    options: LABORATORY_SEND_OUT_OPTIONS,
    props: { allowClear: true, placeholder: '' },
  },
];
