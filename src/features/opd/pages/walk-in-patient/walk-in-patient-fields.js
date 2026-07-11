import { DOB_AGE_UNITS } from '@/lib/dob-from-age';
import DobAgeField from '@/components/ui/DobAgeField';
import {
  TITLE_OPTIONS,
  RELATION_OPTIONS,
  CATEGORY_OPTIONS,
  PATIENT_TYPE_OPTIONS,
  CHECKUP_TYPE_OPTIONS,
  LAB_OPTIONS,
  DEPARTMENT_OPTIONS,
  INSURER_OPTIONS,
  dobAgeRules,
} from './walk-in-patient-options';

export const WALK_IN_INITIAL_VALUES = {
  title: 'mr',
  relation: 'so',
  department: 'laboratory',
  category: 'general',
  patientType: 'opd',
  checkupType: 'emergency',
  insurer: 'ptcl',
  dobAge: { age: '', unit: DOB_AGE_UNITS.years, dob: null },
};

export const buildWalkInBaseFields = ({ genderOptions = [], religionOptions = [] } = {}) => [
  {
    type: 'select',
    name: 'title',
    label: 'Title',
    floating: true,
    span: 6,
    options: TITLE_OPTIONS,
  },
  {
    type: 'text',
    name: 'firstName',
    label: 'First Name',
    floating: true,
    span: 6,
  },
  {
    type: 'text',
    name: 'lastName',
    label: 'Last Name',
    floating: true,
    span: 6,
  },
  {
    type: 'dobAge',
    name: 'dobAge',
    label: 'DOB / Age',
    floating: true,
    span: 6,
    rules: dobAgeRules,
    validateTrigger: ['onChange', 'onSubmit'],
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
    name: 'gender',
    label: 'Gender',
    floating: true,
    span: 6,
    options: genderOptions,
  },
  {
    type: 'text',
    name: 'contactNo',
    label: 'Contact #',
    floating: true,
    span: 6,
  },
  {
    type: 'text',
    name: 'cnic',
    label: 'CNIC #',
    floating: true,
    span: 6,
  },
  {
    type: 'select',
    name: 'religion',
    label: 'Religion',
    floating: true,
    span: 6,
    options: religionOptions,
  },
  {
    type: 'select',
    name: 'relation',
    label: 'Relation',
    floating: true,
    span: 6,
    options: RELATION_OPTIONS,
  },
  {
    type: 'text',
    name: 'relationFirstName',
    label: 'Relation First Name',
    floating: true,
    span: 6,
  },
  {
    type: 'text',
    name: 'relationLastName',
    label: 'Relation Last Name',
    floating: true,
    span: 6,
  },
  {
    type: 'text',
    name: 'email',
    label: 'Email',
    floating: true,
    span: 6,
    props: { type: 'email' },
  },
  {
    type: 'text',
    name: 'address',
    label: 'Address',
    floating: true,
    span: 12,
  },
];

export const buildWalkInVisitFields = ({ consultantOptions = [] } = {}) => [
  {
    type: 'select',
    name: 'department',
    label: 'Department',
    floating: true,
    span: 6,
    options: DEPARTMENT_OPTIONS,
  },
  {
    type: 'select',
    name: 'consultant',
    label: 'Consultant',
    floating: true,
    span: 6,
    options: consultantOptions,
  },
  {
    type: 'text',
    name: 'referDoctor',
    label: 'Refer Doctor',
    floating: true,
    span: 6,
  },
];

export const WALK_IN_CATEGORY_FIELDS = [
  {
    type: 'select',
    name: 'category',
    label: 'Category',
    floating: true,
    span: 6,
    options: CATEGORY_OPTIONS,
  },
  {
    type: 'select',
    name: 'patientType',
    label: 'Patient Type',
    floating: true,
    span: 6,
    options: PATIENT_TYPE_OPTIONS,
  },
  {
    type: 'select',
    name: 'checkupType',
    label: 'Checkup Type',
    floating: true,
    span: 6,
    options: CHECKUP_TYPE_OPTIONS,
  },
];

export const buildWalkInPanelFields = ({ designationOptions = [] } = {}) => [
  {
    type: 'select',
    name: 'insurer',
    label: 'Insurer',
    floating: true,
    span: 6,
    options: INSURER_OPTIONS,
  },
  {
    type: 'select',
    name: 'designation',
    label: 'Designation',
    floating: true,
    span: 6,
    options: designationOptions,
  },
  {
    type: 'text',
    name: 'referenceNo',
    label: 'Reference #',
    floating: true,
    span: 6,
  },
];

export const WALK_IN_B2B_FIELDS = [
  {
    type: 'select',
    name: 'selectedLab',
    label: 'Select Lab',
    floating: true,
    span: 6,
    options: LAB_OPTIONS,
    props: { allowClear: true },
  },
];