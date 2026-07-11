import { Checkbox, Form, Input } from 'antd';
import { FIELD_CONTROL_CLASS } from '@/lib/field-control';

export const TITLE_OPTIONS = [
  { value: 'mr', label: 'Mr.' },
  { value: 'ms', label: 'Ms.' },
  { value: 'dr', label: 'Dr.' },
];

export const RELATION_OPTIONS = [
  { value: 'so', label: 'S/O' },
  { value: 'do', label: 'D/O' },
];

export const GENDER_OPTIONS = [
  { value: 'male', label: 'Male' },
  { value: 'female', label: 'Female' },
  { value: 'other', label: 'Other' },
];

export const EMPLOYEE_TYPE_OPTIONS = [
  { value: 'na', label: 'N/A' },
  { value: 'permanent', label: 'Permanent' },
  { value: 'contract', label: 'Contract' },
  { value: 'visiting', label: 'Visiting' },
];

export const NATIONALITY_OPTIONS = [
  { value: 'pakistani', label: 'Pakistani' },
  { value: 'afghan', label: 'Afghan' },
  { value: 'other', label: 'Other' },
];

export const PLACE_OPTIONS = [
  { value: 'abbotabad', label: 'Abbotabad' },
  { value: 'islamabad', label: 'Islamabad' },
  { value: 'karachi', label: 'Karachi' },
  { value: 'lahore', label: 'Lahore' },
];

export const RELIGION_OPTIONS = [
  { value: 'islam', label: 'Islam' },
  { value: 'christianity', label: 'Christianity' },
  { value: 'hinduism', label: 'Hinduism' },
  { value: 'other', label: 'Other' },
];

export const DOMICILE_OPTIONS = [
  { value: 'abbotabad', label: 'Abbotabad' },
  { value: 'haripur', label: 'Haripur' },
  { value: 'mansehra', label: 'Mansehra' },
];

export const BLOOD_GROUP_OPTIONS = [
  { value: 'nil', label: 'Nil' },
  { value: 'a-positive', label: 'A+' },
  { value: 'a-negative', label: 'A-' },
  { value: 'b-positive', label: 'B+' },
  { value: 'b-negative', label: 'B-' },
  { value: 'ab-positive', label: 'AB+' },
  { value: 'ab-negative', label: 'AB-' },
  { value: 'o-positive', label: 'O+' },
  { value: 'o-negative', label: 'O-' },
];

export const DISTRICT_OPTIONS = [
  { value: 'abbotabad', label: 'Abbotabad' },
  { value: 'haripur', label: 'Haripur' },
  { value: 'mansehra', label: 'Mansehra' },
];

export const TEHSIL_OPTIONS = [
  { value: 'abbotabad', label: 'Abbotabad' },
  { value: 'havelian', label: 'Havelian' },
  { value: 'bakot', label: 'Bakot' },
];

export const GRADE_OPTIONS = Array.from({ length: 10 }, (_, index) => ({
  value: String(index + 1),
  label: String(index + 1),
}));

export const SHIFT_OPTIONS = [
  { value: 'morning', label: 'Morning (8AM-2PM)' },
  { value: 'evening', label: 'Evening (2PM-10PM)' },
  { value: 'night', label: 'Night (10PM-8AM)' },
];

export const SALARY_MODE_OPTIONS = [
  { value: 'cash', label: 'Cash' },
  { value: 'bank-transfer', label: 'Bank Transfer' },
  { value: 'cheque', label: 'Cheque' },
];

export const MARITAL_STATUS_OPTIONS = [
  { value: 'single', label: 'Single' },
  { value: 'married', label: 'Married' },
];

export const REQUIRED_RULE = (message) => [
  {
    required: true,
    whitespace: true,
    message,
    validateTrigger: ['onChange', 'onSubmit'],
  },
];

function ReadOnlyValue({ value }) {
  return <div className="employee-entry-readonly">{value}</div>;
}

export function getGeneralInfoFields({ photoRender } = {}) {
  return [
    {
      type: 'custom',
      label: 'Profile photo',
      floating: true,
      span: 24,
      className: 'employee-entry-photo-field',
      props: { render: photoRender },
    },
    { type: 'text', name: 'employeeNo', label: 'Employee No', floating: true, span: 6 },
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
      required: true,
      rules: REQUIRED_RULE('First name is required'),
    },
    { type: 'text', name: 'middleName', label: 'Middle Name', floating: true, span: 6 },
    {
      type: 'text',
      name: 'lastName',
      label: 'Last Name',
      floating: true,
      span: 6,
      required: true,
      rules: REQUIRED_RULE('Last name is required'),
    },
    {
      type: 'select',
      name: 'relationType',
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
      required: true,
      rules: REQUIRED_RULE('Relation first name is required'),
    },
    {
      type: 'text',
      name: 'relationMiddleName',
      label: 'Relation Middle Name',
      floating: true,
      span: 6,
    },
    {
      type: 'text',
      name: 'relationLastName',
      label: 'Relation Last Name',
      floating: true,
      span: 6,
      required: true,
      rules: REQUIRED_RULE('Relation last name is required'),
    },
    {
      type: 'select',
      name: 'gender',
      label: 'Gender',
      floating: true,
      span: 6,
      options: GENDER_OPTIONS,
    },
    {
      type: 'select',
      name: 'employeeType',
      label: 'Employee Type',
      floating: true,
      span: 6,
      options: EMPLOYEE_TYPE_OPTIONS,
    },
  ];
}

export function getBasicInfoFields({ ageLabel } = {}) {
  return [
    {
      type: 'text',
      name: 'dob',
      label: 'Date Of Birth',
      floating: true,
      span: 6,
      props: { placeholder: 'dd/MM/yyyy' },
    },
    {
      type: 'custom',
      label: 'Age',
      floating: true,
      span: 6,
      props: {
        render: () => <ReadOnlyValue value={ageLabel} />,
      },
    },
    {
      type: 'select',
      name: 'nationality',
      label: 'Nationality',
      floating: true,
      span: 6,
      options: NATIONALITY_OPTIONS,
    },
    {
      type: 'select',
      name: 'otherNationality',
      label: 'Other Nationality',
      floating: true,
      span: 6,
      options: NATIONALITY_OPTIONS,
    },
    {
      type: 'select',
      name: 'placeOfBirth',
      label: 'Place Of Birth',
      floating: true,
      span: 6,
      options: PLACE_OPTIONS,
    },
    {
      type: 'select',
      name: 'maritalStatus',
      label: 'Marital Status',
      floating: true,
      span: 6,
      options: MARITAL_STATUS_OPTIONS,
    },
    {
      type: 'select',
      name: 'religion',
      label: 'Religion',
      floating: true,
      span: 6,
      options: RELIGION_OPTIONS,
      props: { allowClear: true },
    },
    {
      type: 'select',
      name: 'domicile',
      label: 'Domicile',
      floating: true,
      span: 6,
      options: DOMICILE_OPTIONS,
      props: { allowClear: true },
    },
    { type: 'text', name: 'cnicNo', label: 'CNIC No', floating: true, span: 6 },
    { type: 'text', name: 'passportNo', label: 'Passport No', floating: true, span: 6 },
    {
      type: 'custom',
      label: 'CNIC Expiry',
      floating: true,
      span: 6,
      props: {
        render: () => (
          <div className="employee-entry-expiry-row">
            <Form.Item noStyle name="cnicExpiry">
              <Input className={FIELD_CONTROL_CLASS} placeholder="dd/MM/yyyy" />
            </Form.Item>
            <Form.Item noStyle name="cnicExpiryLifetime" valuePropName="checked">
              <Checkbox className="employee-entry-inline-checkbox">Life Time</Checkbox>
            </Form.Item>
          </div>
        ),
      },
    },
    { type: 'text', name: 'languageKnown', label: 'Language Known', floating: true, span: 6 },
    {
      type: 'select',
      name: 'bloodGroup',
      label: 'Blood Group',
      floating: true,
      span: 6,
      options: BLOOD_GROUP_OPTIONS,
    },
  ];
}

export function getAddressInfoFields() {
  return [
    { type: 'text', name: 'homePhoneNumber', label: 'Home Phone', floating: true, span: 6 },
    { type: 'text', name: 'mobileNo', label: 'Mobile No', floating: true, span: 6 },
    { type: 'text', name: 'officePhoneNumber', label: 'Office Phone', floating: true, span: 6 },
    {
      type: 'text',
      name: 'emailAddress',
      label: 'Email Address',
      floating: true,
      span: 6,
      props: { type: 'email' },
    },
    {
      type: 'text',
      name: 'emergencyContactNo',
      label: 'Emergency Contact #',
      floating: true,
      span: 6,
    },
    {
      type: 'text',
      name: 'emergencyContactName',
      label: 'Emergency Contact Name',
      floating: true,
      span: 6,
    },
    {
      type: 'select',
      name: 'districtName',
      label: 'District Name',
      floating: true,
      span: 6,
      options: DISTRICT_OPTIONS,
    },
    {
      type: 'select',
      name: 'tehsilName',
      label: 'Tehsil Name',
      floating: true,
      span: 6,
      options: TEHSIL_OPTIONS,
    },
    {
      type: 'textarea',
      name: 'permanentAddress',
      label: 'Permanent Address',
      floating: true,
      span: 6,
      required: true,
      rules: REQUIRED_RULE('Permanent address is required'),
      props: { rows: 2 },
    },
    {
      type: 'textarea',
      name: 'presentAddress',
      label: 'Present Address',
      floating: true,
      span: 6,
      props: { rows: 2 },
    },
    {
      type: 'textarea',
      name: 'officeAddress',
      label: 'Office Address',
      floating: true,
      span: 6,
      props: { rows: 2 },
    },
  ];
}

export function getEmploymentInfoFields({
  form,
  selectedHospital,
  selectedDepartment,
  hospitalOptions = [],
  designationOptions = [],
  departmentOptions = [],
  subDepartmentOptions = [],
} = {}) {
  return [
    {
      type: 'select',
      name: 'designation',
      label: 'Designation',
      floating: true,
      span: 6,
      options: designationOptions,
      props: { showSearch: true, optionFilterProp: 'label', allowClear: true },
    },
    {
      type: 'select',
      name: 'grade',
      label: 'Grade (I-IX)',
      floating: true,
      span: 6,
      options: GRADE_OPTIONS,
    },
    {
      type: 'text',
      name: 'doj',
      label: 'D.O.J',
      floating: true,
      span: 6,
      props: { placeholder: 'dd/MM/yyyy' },
    },
    {
      type: 'select',
      name: 'hospital',
      label: 'Hospital',
      floating: true,
      span: 6,
      options: hospitalOptions,
      props: {
        showSearch: true,
        optionFilterProp: 'label',
        allowClear: true,
        onChange: () => {
          form.setFieldsValue({ department: null, subDepartment: null });
        },
      },
    },
    {
      type: 'select',
      name: 'department',
      label: 'Department',
      floating: true,
      span: 6,
      options: departmentOptions,
      props: {
        disabled: !selectedHospital,
        showSearch: true,
        optionFilterProp: 'label',
        allowClear: true,
        placeholder: selectedHospital ? 'Select department' : 'Select hospital first',
        onChange: () => {
          form.setFieldsValue({ subDepartment: null });
        },
      },
    },
    { type: 'text', name: 'ntnNo', label: 'NTN #', floating: true, span: 6 },
    {
      type: 'select',
      name: 'subDepartment',
      label: 'Sub Department',
      floating: true,
      span: 6,
      options: subDepartmentOptions,
      props: {
        disabled: !selectedDepartment,
        showSearch: true,
        optionFilterProp: 'label',
        allowClear: true,
        placeholder: selectedDepartment ? 'Select sub department' : 'Select department first',
      },
    },
    {
      type: 'select',
      name: 'shift',
      label: 'Shift',
      floating: true,
      span: 6,
      options: SHIFT_OPTIONS,
    },
    {
      type: 'textarea',
      name: 'designationDetail',
      label: 'Designation Detail',
      floating: true,
      span: 6,
      props: { rows: 1 },
    },
    {
      type: 'select',
      name: 'salaryMode',
      label: 'Salary Mode',
      floating: true,
      span: 6,
      options: SALARY_MODE_OPTIONS,
    },
    { type: 'text', name: 'gpFundNo', label: 'GP Fund No', floating: true, span: 6 },
    {
      type: 'text',
      name: 'providentFundNo',
      label: 'Provident Fund No',
      floating: true,
      span: 6,
    },
    { type: 'text', name: 'eobiNo', label: 'EOBI No', floating: true, span: 6 },
    {
      type: 'custom',
      floating: false,
      span: 6,
      props: {
        render: () => (
          <div className="employee-entry-checkbox-slot">
            <Form.Item name="isConsultant" valuePropName="checked" noStyle>
              <Checkbox>Is Consultant</Checkbox>
            </Form.Item>
          </div>
        ),
      },
    },
  ];
}

export const EMPLOYEE_INFO_FIELD_PANEL_MAP = {
  title: 'general',
  employeeNo: 'general',
  firstName: 'general',
  middleName: 'general',
  lastName: 'general',
  gender: 'general',
  relationType: 'general',
  relationFirstName: 'general',
  relationMiddleName: 'general',
  relationLastName: 'general',
  employeeType: 'general',
  dob: 'basic',
  nationality: 'basic',
  otherNationality: 'basic',
  placeOfBirth: 'basic',
  religion: 'basic',
  maritalStatus: 'basic',
  domicile: 'basic',
  cnicNo: 'basic',
  passportNo: 'basic',
  cnicExpiry: 'basic',
  languageKnown: 'basic',
  bloodGroup: 'basic',
  homePhoneCountry: 'address',
  homePhoneCity: 'address',
  homePhoneNumber: 'address',
  mobileNo: 'address',
  officePhoneCountry: 'address',
  officePhoneCity: 'address',
  officePhoneNumber: 'address',
  emailAddress: 'address',
  emergencyContactNo: 'address',
  emergencyContactName: 'address',
  districtName: 'address',
  tehsilName: 'address',
  permanentAddress: 'address',
  presentAddress: 'address',
  officeAddress: 'address',
  designation: 'employment',
  grade: 'employment',
  doj: 'employment',
  hospital: 'employment',
  department: 'employment',
  ntnNo: 'employment',
  subDepartment: 'employment',
  designationDetail: 'employment',
  shift: 'employment',
  gpFundNo: 'employment',
  salaryMode: 'employment',
  providentFundNo: 'employment',
  eobiNo: 'employment',
};
