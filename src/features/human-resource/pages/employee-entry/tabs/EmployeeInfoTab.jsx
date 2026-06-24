'use client';

import { useMemo } from 'react';
import { CameraOutlined, DownOutlined, UpOutlined, UserOutlined } from '@ant-design/icons';
import { Avatar, Checkbox, Collapse, Form, Input, Select, Upload } from 'antd';
import FormGrid from '@/components/ui/FormGrid';
import FormFloatingField from '@/components/ui/FormFloatingField';
import { FIELD_CONTROL_CLASS } from '@/lib/field-control';

const controlClass = FIELD_CONTROL_CLASS;

const TITLE_OPTIONS = [
  { value: 'mr', label: 'Mr.' },
  { value: 'ms', label: 'Ms.' },
  { value: 'dr', label: 'Dr.' },
];

const RELATION_OPTIONS = [
  { value: 'so', label: 'S/O' },
  { value: 'do', label: 'D/O' },
];

const GENDER_OPTIONS = [
  { value: 'male', label: 'Male' },
  { value: 'female', label: 'Female' },
  { value: 'other', label: 'Other' },
];

const EMPLOYEE_TYPE_OPTIONS = [
  { value: 'na', label: 'N/A' },
  { value: 'permanent', label: 'Permanent' },
  { value: 'contract', label: 'Contract' },
  { value: 'visiting', label: 'Visiting' },
];

const NATIONALITY_OPTIONS = [
  { value: 'pakistani', label: 'Pakistani' },
  { value: 'afghan', label: 'Afghan' },
  { value: 'other', label: 'Other' },
];

const PLACE_OPTIONS = [
  { value: 'abbotabad', label: 'Abbotabad' },
  { value: 'islamabad', label: 'Islamabad' },
  { value: 'karachi', label: 'Karachi' },
  { value: 'lahore', label: 'Lahore' },
];

const RELIGION_OPTIONS = [
  { value: 'islam', label: 'Islam' },
  { value: 'christianity', label: 'Christianity' },
  { value: 'hinduism', label: 'Hinduism' },
  { value: 'other', label: 'Other' },
];

const DOMICILE_OPTIONS = [
  { value: 'abbotabad', label: 'Abbotabad' },
  { value: 'haripur', label: 'Haripur' },
  { value: 'mansehra', label: 'Mansehra' },
];

const BLOOD_GROUP_OPTIONS = [
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

const DISTRICT_OPTIONS = [
  { value: 'abbotabad', label: 'Abbotabad' },
  { value: 'haripur', label: 'Haripur' },
  { value: 'mansehra', label: 'Mansehra' },
];

const TEHSIL_OPTIONS = [
  { value: 'abbotabad', label: 'Abbotabad' },
  { value: 'havelian', label: 'Havelian' },
  { value: 'bakot', label: 'Bakot' },
];

const DESIGNATION_OPTIONS = [
  { value: 'neuro-surgeon', label: 'Neuro Surgeon' },
  { value: 'medical-officer', label: 'Medical Officer' },
  { value: 'staff-nurse', label: 'Staff Nurse' },
  { value: 'administrator', label: 'Administrator' },
  { value: 'officer', label: 'Officer' },
];

const GRADE_OPTIONS = Array.from({ length: 10 }, (_, index) => ({
  value: String(index + 1),
  label: String(index + 1),
}));

const HOSPITAL_OPTIONS = [
  { value: 'alkhidmat-diagnostics-karachi', label: 'ALKHIDMAT DIAGNOSTICS KARACHI' },
  { value: 'alkhidmat-hospital-peshawar', label: 'ALKHIDMAT HOSPITAL PESHAWAR' },
];

const DEPARTMENT_OPTIONS = [
  { value: 'administration', label: 'ADMINISTRATION' },
  { value: 'human-resource', label: 'HUMAN RESOURCE' },
  { value: 'medical', label: 'MEDICAL' },
];

const SUB_DEPARTMENT_OPTIONS = [
  { value: 'administration', label: 'Administration' },
  { value: 'finance', label: 'Finance' },
  { value: 'reception', label: 'Reception' },
  { value: 'human-resource', label: 'Human Resource' },
];

const SHIFT_OPTIONS = [
  { value: 'morning', label: 'Morning (8AM-2PM)' },
  { value: 'evening', label: 'Evening (2PM-10PM)' },
  { value: 'night', label: 'Night (10PM-8AM)' },
];

const SALARY_MODE_OPTIONS = [
  { value: 'cash', label: 'Cash' },
  { value: 'bank-transfer', label: 'Bank Transfer' },
  { value: 'cheque', label: 'Cheque' },
];

const MARITAL_STATUS_OPTIONS = [
  { value: 'single', label: 'Single' },
  { value: 'married', label: 'Married' },
];

const REQUIRED_RULE = (message) => [
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

export default function EmployeeInfoTab({
  activePanels,
  onPanelsChange,
  ageLabel,
  fileList,
  onFileListChange,
  photoPreview,
  onPhotoPreviewChange,
}) {
  const collapseItems = useMemo(
    () => [
      {
        key: 'general',
        label: 'General Information',
        children: (
          <FormGrid columns={4} className="patient-reg-section-grid employee-entry-section-grid">
            <FormFloatingField
              label="Profile photo"
              col="full"
              className="employee-entry-photo-field"
            >
              <Upload
                accept="image/*"
                beforeUpload={() => false}
                maxCount={1}
                showUploadList={false}
                fileList={fileList}
                onChange={({ fileList: nextFileList }) => {
                  const next = nextFileList.slice(-1);
                  onFileListChange(next);

                  const latestFile = next[0]?.originFileObj;
                  if (!latestFile) {
                    if (photoPreview.startsWith('blob:')) {
                      URL.revokeObjectURL(photoPreview);
                    }
                    onPhotoPreviewChange('');
                    return;
                  }

                  if (photoPreview.startsWith('blob:')) {
                    URL.revokeObjectURL(photoPreview);
                  }

                  onPhotoPreviewChange(URL.createObjectURL(latestFile));
                }}
              >
                <div
                  className={[
                    'employee-entry-avatar-upload',
                    photoPreview ? 'employee-entry-avatar-upload--has-photo' : '',
                  ]
                    .filter(Boolean)
                    .join(' ')}
                  role="button"
                  tabIndex={0}
                  aria-label="Upload profile photo"
                >
                  <Avatar
                    shape="square"
                    size={64}
                    src={photoPreview || undefined}
                    icon={!photoPreview ? <UserOutlined /> : undefined}
                    className="employee-entry-photo-preview"
                  />
                  <span className="employee-entry-avatar-upload-badge" aria-hidden>
                    <CameraOutlined />
                  </span>
                  <div className="employee-entry-avatar-overlay">
                    <span>{photoPreview ? 'Change' : 'Upload'}</span>
                  </div>
                </div>
              </Upload>
            </FormFloatingField>

            <FormFloatingField name="employeeNo" label="Employee No">
              <Input className={controlClass} />
            </FormFloatingField>

            <FormFloatingField name="title" label="Title">
              <Select className={controlClass} options={TITLE_OPTIONS} />
            </FormFloatingField>

            <FormFloatingField
              name="firstName"
              label="First Name"
              required
              rules={REQUIRED_RULE('First name is required')}
            >
              <Input className={controlClass} />
            </FormFloatingField>

            <FormFloatingField name="middleName" label="Middle Name">
              <Input className={controlClass} />
            </FormFloatingField>

            <FormFloatingField
              name="lastName"
              label="Last Name"
              required
              rules={REQUIRED_RULE('Last name is required')}
            >
              <Input className={controlClass} />
            </FormFloatingField>

            <FormFloatingField name="relationType" label="Relation">
              <Select className={controlClass} options={RELATION_OPTIONS} />
            </FormFloatingField>

            <FormFloatingField
              name="relationFirstName"
              label="Relation First Name"
              required
              rules={REQUIRED_RULE('Relation first name is required')}
            >
              <Input className={controlClass} />
            </FormFloatingField>

            <FormFloatingField name="relationMiddleName" label="Relation Middle Name">
              <Input className={controlClass} />
            </FormFloatingField>

            <FormFloatingField
              name="relationLastName"
              label="Relation Last Name"
              required
              rules={REQUIRED_RULE('Relation last name is required')}
            >
              <Input className={controlClass} />
            </FormFloatingField>

            <FormFloatingField name="gender" label="Gender">
              <Select className={controlClass} options={GENDER_OPTIONS} />
            </FormFloatingField>

            <FormFloatingField name="employeeType" label="Employee Type">
              <Select className={controlClass} options={EMPLOYEE_TYPE_OPTIONS} />
            </FormFloatingField>
          </FormGrid>
        ),
      },
      {
        key: 'basic',
        label: 'Basic Information',
        children: (
          <FormGrid columns={4} className="patient-reg-section-grid employee-entry-section-grid">
            <FormFloatingField label="Date Of Birth">
              <Input className={controlClass} type="date" />
            </FormFloatingField>

            <FormFloatingField label="Age">
              <ReadOnlyValue value={ageLabel} />
            </FormFloatingField>

            <FormFloatingField name="nationality" label="Nationality">
              <Select className={controlClass} options={NATIONALITY_OPTIONS} />
            </FormFloatingField>

            <FormFloatingField name="otherNationality" label="Other Nationality">
              <Select className={controlClass} options={NATIONALITY_OPTIONS} />
            </FormFloatingField>

            <FormFloatingField name="placeOfBirth" label="Place Of Birth">
              <Select className={controlClass} options={PLACE_OPTIONS} />
            </FormFloatingField>

            <FormFloatingField name="maritalStatus" label="Marital Status">
              <Select className={controlClass} options={MARITAL_STATUS_OPTIONS} />
            </FormFloatingField>

            <FormFloatingField name="religion" label="Religion">
              <Select className={controlClass} options={RELIGION_OPTIONS} allowClear />
            </FormFloatingField>

            <FormFloatingField name="domicile" label="Domicile">
              <Select className={controlClass} options={DOMICILE_OPTIONS} allowClear />
            </FormFloatingField>

            <FormFloatingField name="cnicNo" label="CNIC No">
              <Input className={controlClass} />
            </FormFloatingField>

            <FormFloatingField name="passportNo" label="Passport No">
              <Input className={controlClass} />
            </FormFloatingField>

            <FormFloatingField label="CNIC Expiry">
              <div className="employee-entry-expiry-row">
                <Form.Item noStyle name="cnicExpiry">
                  <Input className={controlClass} placeholder="dd/MM/yyyy" />
                </Form.Item>
                <Form.Item noStyle name="cnicExpiryLifetime" valuePropName="checked">
                  <Checkbox className="employee-entry-inline-checkbox">Life Time</Checkbox>
                </Form.Item>
              </div>
            </FormFloatingField>

            <FormFloatingField name="languageKnown" label="Language Known">
              <Input className={controlClass} />
            </FormFloatingField>

            <FormFloatingField name="bloodGroup" label="Blood Group">
              <Select className={controlClass} options={BLOOD_GROUP_OPTIONS} />
            </FormFloatingField>
          </FormGrid>
        ),
      },
      {
        key: 'address',
        label: 'Address Information',
        children: (
          <FormGrid columns={4} className="patient-reg-section-grid employee-entry-section-grid">
            <FormFloatingField label="Home Phone" name="homePhoneNumber">
              <Input className={controlClass} />
            </FormFloatingField>

            <FormFloatingField name="mobileNo" label="Mobile No">
              <Input className={controlClass} />
            </FormFloatingField>

            <FormFloatingField label="Office Phone" name="officePhoneNumber">
              <Input className={controlClass} />
            </FormFloatingField>

            <FormFloatingField name="emailAddress" label="Email Address">
              <Input className={controlClass} type="email" />
            </FormFloatingField>

            <FormFloatingField name="emergencyContactNo" label="Emergency Contact #">
              <Input className={controlClass} />
            </FormFloatingField>

            <FormFloatingField name="emergencyContactName" label="Emergency Contact Name">
              <Input className={controlClass} />
            </FormFloatingField>

            <FormFloatingField name="districtName" label="District Name">
              <Select className={controlClass} options={DISTRICT_OPTIONS} />
            </FormFloatingField>

            <FormFloatingField name="tehsilName" label="Tehsil Name">
              <Select className={controlClass} options={TEHSIL_OPTIONS} />
            </FormFloatingField>

            <FormFloatingField
              name="permanentAddress"
              label="Permanent Address"
              required
              rules={REQUIRED_RULE('Permanent address is required')}
            >
              <Input.TextArea className={controlClass} rows={2} />
            </FormFloatingField>

            <FormFloatingField name="presentAddress" label="Present Address">
              <Input.TextArea className={controlClass} rows={2} />
            </FormFloatingField>

            <FormFloatingField name="officeAddress" label="Office Address">
              <Input.TextArea className={controlClass} rows={2} />
            </FormFloatingField>
          </FormGrid>
        ),
      },
      {
        key: 'employment',
        label: 'Employment Information',
        children: (
          <FormGrid columns={4} className="patient-reg-section-grid employee-entry-section-grid">
            <FormFloatingField name="designation" label="Designation">
              <Select className={controlClass} options={DESIGNATION_OPTIONS} />
            </FormFloatingField>

            <FormFloatingField name="grade" label="Grade (I-IX)">
              <Select className={controlClass} options={GRADE_OPTIONS} />
            </FormFloatingField>

            <FormFloatingField name="doj" label="D.O.J">
              <Input className={controlClass} placeholder="dd/MM/yyyy" />
            </FormFloatingField>

            <FormFloatingField name="hospital" label="Hospital">
              <Select className={controlClass} options={HOSPITAL_OPTIONS} />
            </FormFloatingField>

            <FormFloatingField name="department" label="Department">
              <Select className={controlClass} options={DEPARTMENT_OPTIONS} />
            </FormFloatingField>

            <FormFloatingField name="ntnNo" label="NTN #">
              <Input className={controlClass} />
            </FormFloatingField>

            <FormFloatingField name="subDepartment" label="Sub Department">
              <Select className={controlClass} options={SUB_DEPARTMENT_OPTIONS} />
            </FormFloatingField>

            <FormFloatingField name="shift" label="Shift">
              <Select className={controlClass} options={SHIFT_OPTIONS} />
            </FormFloatingField>

            <FormFloatingField name="designationDetail" label="Designation Detail">
              <Input.TextArea className={controlClass} rows={1} />
            </FormFloatingField>

            <FormFloatingField name="salaryMode" label="Salary Mode">
              <Select className={controlClass} options={SALARY_MODE_OPTIONS} />
            </FormFloatingField>

            <FormFloatingField name="gpFundNo" label="GP Fund No">
              <Input className={controlClass} />
            </FormFloatingField>

            <FormFloatingField name="providentFundNo" label="Provident Fund No">
              <Input className={controlClass} />
            </FormFloatingField>

            <FormFloatingField name="eobiNo" label="EOBI No">
              <Input className={controlClass} />
            </FormFloatingField>

            <div className="employee-entry-checkbox-slot">
              <Form.Item name="isConsultant" valuePropName="checked" noStyle>
                <Checkbox>Is Consultant</Checkbox>
              </Form.Item>
            </div>
          </FormGrid>
        ),
      },
    ],
    [ageLabel, fileList, onFileListChange, onPhotoPreviewChange, photoPreview],
  );

  return (
    <Collapse
      items={collapseItems}
      activeKey={activePanels}
      onChange={onPanelsChange}
      destroyOnHidden={false}
      classNames={{
        root: 'patient-registration-collapse',
        header: 'patient-reg-collapse-header',
        title: 'patient-reg-collapse-title',
      }}
      expandIconPlacement="end"
      expandIcon={({ isActive }) =>
        isActive ? (
          <DownOutlined className="patient-reg-collapse-icon" aria-hidden />
        ) : (
          <UpOutlined className="patient-reg-collapse-icon" aria-hidden />
        )
      }
    />
  );
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
  birthDay: 'basic',
  birthMonth: 'basic',
  birthYear: 'basic',
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
