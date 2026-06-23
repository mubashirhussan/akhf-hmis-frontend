'use client';

import { useEffect, useMemo, useState } from 'react';
import { DownOutlined, UpOutlined, UserOutlined } from '@ant-design/icons';
import {
  App,
  Avatar,
  Button,
  Checkbox,
  Collapse,
  Form,
  Input,
  Select,
  Space,
  Upload,
} from 'antd';
import FormGrid from '@/components/ui/FormGrid';
import PatientRegField from '@/features/opd/components/PatientRegField';
import {
  clearPatientRegValidationState,
  focusFormField,
  handleFormChangeClearErrors,
  highlightAllInvalidFields,
} from '@/lib/form-validation';
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

const MONTH_OPTIONS = [
  { value: '1', label: 'Jan' },
  { value: '2', label: 'Feb' },
  { value: '3', label: 'Mar' },
  { value: '4', label: 'Apr' },
  { value: '5', label: 'May' },
  { value: '6', label: 'Jun' },
  { value: '7', label: 'Jul' },
  { value: '8', label: 'Aug' },
  { value: '9', label: 'Sep' },
  { value: '10', label: 'Oct' },
  { value: '11', label: 'Nov' },
  { value: '12', label: 'Dec' },
];

const REQUIRED_RULE = (message) => [
  {
    required: true,
    whitespace: true,
    message,
    validateTrigger: ['onChange', 'onSubmit'],
  },
];

const initialValues = {
  title: 'mr',
  relationType: 'so',
  gender: 'male',
  employeeType: 'na',
  nationality: 'pakistani',
  otherNationality: 'pakistani',
  placeOfBirth: 'abbotabad',
  religion: 'islam',
  maritalStatus: 'single',
  domicile: 'abbotabad',
  bloodGroup: 'nil',
  districtName: 'abbotabad',
  tehsilName: 'abbotabad',
  designation: 'neuro-surgeon',
  grade: '1',
  hospital: 'alkhidmat-diagnostics-karachi',
  department: 'administration',
  subDepartment: 'administration',
  shift: 'evening',
  salaryMode: 'cash',
  isConsultant: false,
};

const DEFAULT_OPEN_PANELS = ['general', 'basic', 'address', 'employment'];
const ALL_PANEL_KEYS = ['general', 'basic', 'address', 'employment'];

const FIELD_PANEL_MAP = {
  title: 'general',
  employeeNo: 'general',
  firstName: 'general',
  middleName: 'general',
  lastName: 'general',
  gender: 'general',
  relationType: 'general',
  relationFirstName: 'general',
  relationMiddleName: 'general',
  relationName: 'general',
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

function calculateAge(day, month, year) {
  if (!day || !month || !year) {
    return '0 Years';
  }

  const birthDate = new Date(Number(year), Number(month) - 1, Number(day));
  if (Number.isNaN(birthDate.getTime())) {
    return '0 Years';
  }

  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDifference = today.getMonth() - birthDate.getMonth();
  const hasBirthdayPassed =
    monthDifference > 0 ||
    (monthDifference === 0 && today.getDate() >= birthDate.getDate());

  if (!hasBirthdayPassed) {
    age -= 1;
  }

  return `${Math.max(age, 0)} Years`;
}

function BirthDateControl() {
  return (
    <div className="employee-entry-birth-grid">
      <Form.Item
        noStyle
        name="birthDay"
        rules={[{ required: true, message: 'Birth day is required' }]}
        validateTrigger={['onChange', 'onSubmit']}
      >
        <Input className={controlClass} placeholder="DD" maxLength={2} />
      </Form.Item>
      <Form.Item
        noStyle
        name="birthMonth"
        rules={[{ required: true, message: 'Birth month is required' }]}
        validateTrigger={['onChange', 'onSubmit']}
      >
        <Select
          className={controlClass}
          placeholder="Month"
          options={MONTH_OPTIONS}
          optionFilterProp="label"
        />
      </Form.Item>
      <Form.Item
        noStyle
        name="birthYear"
        rules={[{ required: true, message: 'Birth year is required' }]}
        validateTrigger={['onChange', 'onSubmit']}
      >
        <Input className={controlClass} placeholder="YYYY" maxLength={4} />
      </Form.Item>
    </div>
  );
}

function ReadOnlyValue({ value }) {
  return <div className="employee-entry-readonly">{value}</div>;
}

function PhoneSegments({ names, placeholders = ['009', '21', ''] }) {
  return (
    <Space.Compact block className="employee-entry-phone-compact">
      <Form.Item noStyle name={names[0]}>
        <Input className={controlClass} placeholder={placeholders[0]} maxLength={4} />
      </Form.Item>
      <Form.Item noStyle name={names[1]}>
        <Input className={controlClass} placeholder={placeholders[1]} maxLength={4} />
      </Form.Item>
      <Form.Item noStyle name={names[2]}>
        <Input className={controlClass} placeholder={placeholders[2]} maxLength={16} />
      </Form.Item>
    </Space.Compact>
  );
}

export default function EmployeeEntryPage() {
  const { message } = App.useApp();
  const [form] = Form.useForm();
  const [activePanels, setActivePanels] = useState(DEFAULT_OPEN_PANELS);
  const [pendingSubmitErrors, setPendingSubmitErrors] = useState(null);
  const [fileList, setFileList] = useState([]);
  const [photoPreview, setPhotoPreview] = useState('');

  const birthDay = Form.useWatch('birthDay', form);
  const birthMonth = Form.useWatch('birthMonth', form);
  const birthYear = Form.useWatch('birthYear', form);

  const ageLabel = useMemo(
    () => calculateAge(birthDay, birthMonth, birthYear),
    [birthDay, birthMonth, birthYear],
  );

  useEffect(() => {
    if (!pendingSubmitErrors?.length) {
      return undefined;
    }

    const firstInvalidName = pendingSubmitErrors[0].name;
    const timer = window.setTimeout(() => {
      highlightAllInvalidFields(pendingSubmitErrors);
      if (typeof form.scrollToField === 'function') {
        form.scrollToField(firstInvalidName, {
          behavior: 'smooth',
          block: 'center',
        });
      }
      focusFormField(form, firstInvalidName);
      setPendingSubmitErrors(null);
    }, 50);

    return () => window.clearTimeout(timer);
  }, [activePanels, form, pendingSubmitErrors]);

  useEffect(() => {
    return () => {
      if (photoPreview.startsWith('blob:')) {
        URL.revokeObjectURL(photoPreview);
      }
    };
  }, [photoPreview]);

  const collapseItems = useMemo(
    () => [
      {
        key: 'general',
        label: 'General Information',
        children: (
          <FormGrid columns={4} className="patient-reg-section-grid employee-entry-section-grid">
            <PatientRegField
              name="title"
              label="Title"
            >
              <Select className={controlClass} options={TITLE_OPTIONS} />
            </PatientRegField>

            <PatientRegField
              name="relationType"
              label="Relation"
            >
              <Select className={controlClass} options={RELATION_OPTIONS} />
            </PatientRegField>

            <PatientRegField name="employeeNo" label="Employee No">
              <Input className={controlClass} />
            </PatientRegField>

            <PatientRegField
              name="firstName"
              label="First Name"
              required
              rules={REQUIRED_RULE('First name is required')}
            >
              <Input className={controlClass} />
            </PatientRegField>

            <PatientRegField name="middleName" label="Middle Name">
              <Input className={controlClass} />
            </PatientRegField>

            <PatientRegField
              name="lastName"
              label="Last Name"
              required
              rules={REQUIRED_RULE('Last name is required')}
            >
              <Input className={controlClass} />
            </PatientRegField>

            <PatientRegField
              name="relationFirstName"
              label="Relation First Name"
              required
              rules={REQUIRED_RULE('Relation first name is required')}
            >
              <Input className={controlClass} />
            </PatientRegField>

            <PatientRegField name="relationMiddleName" label="Relation Middle Name">
              <Input className={controlClass} />
            </PatientRegField>

            <PatientRegField name="relationName" label="Name">
              <Input className={controlClass} />
            </PatientRegField>

            <PatientRegField
              name="relationLastName"
              label="Relation Last Name"
              required
              rules={REQUIRED_RULE('Relation last name is required')}
            >
              <Input className={controlClass} />
            </PatientRegField>

            <PatientRegField name="gender" label="Gender">
              <Select className={controlClass} options={GENDER_OPTIONS} />
            </PatientRegField>

            <PatientRegField name="employeeType" label="Employee Type">
              <Select className={controlClass} options={EMPLOYEE_TYPE_OPTIONS} />
            </PatientRegField>

            <PatientRegField label="Attach Picture" col={2}>
              <div className="employee-entry-photo-row">
                <Upload
                  beforeUpload={() => false}
                  maxCount={1}
                  fileList={fileList}
                  onChange={({ fileList: nextFileList }) => {
                    const next = nextFileList.slice(-1);
                    setFileList(next);

                    const latestFile = next[0]?.originFileObj;
                    if (!latestFile) {
                      if (photoPreview.startsWith('blob:')) {
                        URL.revokeObjectURL(photoPreview);
                      }
                      setPhotoPreview('');
                      return;
                    }

                    if (photoPreview.startsWith('blob:')) {
                      URL.revokeObjectURL(photoPreview);
                    }

                    setPhotoPreview(URL.createObjectURL(latestFile));
                  }}
                >
                  <Button>Choose File</Button>
                </Upload>

                <Button
                  type="primary"
                  onClick={() => {
                    if (fileList.length === 0) {
                      message.warning('Please choose a picture first.');
                      return;
                    }
                    message.success('Picture attached.');
                  }}
                >
                  Attach
                </Button>

                <Avatar
                  shape="square"
                  size={64}
                  src={photoPreview || undefined}
                  icon={!photoPreview ? <UserOutlined /> : undefined}
                  className="employee-entry-photo-preview"
                />
              </div>
            </PatientRegField>
          </FormGrid>
        ),
      },
      {
        key: 'basic',
        label: 'Basic Information',
        children: (
          <FormGrid columns={4} className="patient-reg-section-grid employee-entry-section-grid">
            <PatientRegField label="Date Of Birth" col={2}>
              <BirthDateControl />
            </PatientRegField>

            <PatientRegField label="Age">
              <ReadOnlyValue value={ageLabel} />
            </PatientRegField>

            <PatientRegField name="nationality" label="Nationality">
              <Select className={controlClass} options={NATIONALITY_OPTIONS} />
            </PatientRegField>

            <PatientRegField name="otherNationality" label="Other Nationality">
              <Select className={controlClass} options={NATIONALITY_OPTIONS} />
            </PatientRegField>

            <PatientRegField name="placeOfBirth" label="Place Of Birth">
              <Select className={controlClass} options={PLACE_OPTIONS} />
            </PatientRegField>

            <PatientRegField
              name="maritalStatus"
              label="Marital Status"
            >
              <Select className={controlClass} options={MARITAL_STATUS_OPTIONS} />
            </PatientRegField>

            <PatientRegField name="religion" label="Religion">
              <Select className={controlClass} options={RELIGION_OPTIONS} allowClear />
            </PatientRegField>

            <PatientRegField name="domicile" label="Domicile">
              <Select className={controlClass} options={DOMICILE_OPTIONS} allowClear />
            </PatientRegField>

            <PatientRegField name="cnicNo" label="CNIC No">
              <Input className={controlClass} />
            </PatientRegField>

            <PatientRegField name="passportNo" label="Passport No">
              <Input className={controlClass} />
            </PatientRegField>

            <PatientRegField label="CNIC Expiry">
              <div className="employee-entry-expiry-row">
                <Form.Item noStyle name="cnicExpiry">
                  <Input className={controlClass} placeholder="dd/MM/yyyy" />
                </Form.Item>
                <Form.Item noStyle name="cnicExpiryLifetime" valuePropName="checked">
                  <Checkbox className="employee-entry-inline-checkbox">Life Time</Checkbox>
                </Form.Item>
              </div>
            </PatientRegField>

            <PatientRegField name="languageKnown" label="Language Known">
              <Input className={controlClass} />
            </PatientRegField>

            <PatientRegField name="bloodGroup" label="Blood Group">
              <Select className={controlClass} options={BLOOD_GROUP_OPTIONS} />
            </PatientRegField>
          </FormGrid>
        ),
      },
      {
        key: 'address',
        label: 'Address Information',
        children: (
          <FormGrid columns={4} className="patient-reg-section-grid employee-entry-section-grid">
            <PatientRegField label="Home Phone">
              <PhoneSegments
                names={['homePhoneCountry', 'homePhoneCity', 'homePhoneNumber']}
              />
            </PatientRegField>

            <PatientRegField name="mobileNo" label="Mobile No">
              <Input className={controlClass} />
            </PatientRegField>

            <PatientRegField label="Office Phone">
              <PhoneSegments
                names={['officePhoneCountry', 'officePhoneCity', 'officePhoneNumber']}
              />
            </PatientRegField>

            <PatientRegField name="emailAddress" label="Email Address">
              <Input className={controlClass} type="email" />
            </PatientRegField>

            <PatientRegField name="emergencyContactNo" label="Emergency Contact #">
              <Input className={controlClass} />
            </PatientRegField>

            <PatientRegField name="emergencyContactName" label="Emergency Contact Name">
              <Input className={controlClass} />
            </PatientRegField>

            <PatientRegField name="districtName" label="District Name">
              <Select className={controlClass} options={DISTRICT_OPTIONS} />
            </PatientRegField>

            <PatientRegField name="tehsilName" label="Tehsil Name">
              <Select className={controlClass} options={TEHSIL_OPTIONS} />
            </PatientRegField>

            <PatientRegField
              name="permanentAddress"
              label="Permanent Address"
              required
              rules={REQUIRED_RULE('Permanent address is required')}
              col="full"
            >
              <Input.TextArea className={controlClass} rows={2} />
            </PatientRegField>

            <PatientRegField name="presentAddress" label="Present Address" col={2}>
              <Input.TextArea className={controlClass} rows={2} />
            </PatientRegField>

            <PatientRegField name="officeAddress" label="Office Address" col={2}>
              <Input.TextArea className={controlClass} rows={2} />
            </PatientRegField>
          </FormGrid>
        ),
      },
      {
        key: 'employment',
        label: 'Employment Information',
        children: (
          <FormGrid columns={4} className="patient-reg-section-grid employee-entry-section-grid">
            <PatientRegField name="designation" label="Designation">
              <Select className={controlClass} options={DESIGNATION_OPTIONS} />
            </PatientRegField>

            <PatientRegField name="grade" label="Grade (I-IX)">
              <Select className={controlClass} options={GRADE_OPTIONS} />
            </PatientRegField>

            <PatientRegField name="doj" label="D.O.J">
              <Input className={controlClass} placeholder="dd/MM/yyyy" />
            </PatientRegField>

            <PatientRegField name="hospital" label="Hospital">
              <Select className={controlClass} options={HOSPITAL_OPTIONS} />
            </PatientRegField>

            <PatientRegField name="department" label="Department">
              <Select className={controlClass} options={DEPARTMENT_OPTIONS} />
            </PatientRegField>

            <PatientRegField name="ntnNo" label="NTN #">
              <Input className={controlClass} />
            </PatientRegField>

            <PatientRegField name="subDepartment" label="Sub Department">
              <Select className={controlClass} options={SUB_DEPARTMENT_OPTIONS} />
            </PatientRegField>

            <PatientRegField name="shift" label="Shift">
              <Select className={controlClass} options={SHIFT_OPTIONS} />
            </PatientRegField>

            <PatientRegField name="designationDetail" label="Designation Detail" col={2}>
              <Input.TextArea className={controlClass} rows={3} />
            </PatientRegField>

            <PatientRegField name="salaryMode" label="Salary Mode">
              <Select className={controlClass} options={SALARY_MODE_OPTIONS} />
            </PatientRegField>

            <PatientRegField name="gpFundNo" label="GP Fund No">
              <Input className={controlClass} />
            </PatientRegField>

            <PatientRegField name="providentFundNo" label="Provident Fund No">
              <Input className={controlClass} />
            </PatientRegField>

            <PatientRegField name="eobiNo" label="EOBI No">
              <Input className={controlClass} />
            </PatientRegField>

            <div className="employee-entry-checkbox-slot">
              <Form.Item name="isConsultant" valuePropName="checked" noStyle>
                <Checkbox>Is Consultant</Checkbox>
              </Form.Item>
            </div>
          </FormGrid>
        ),
      },
    ],
    [ageLabel, fileList, form, message, photoPreview],
  );

  const handleClear = () => {
    form.resetFields();
    setPendingSubmitErrors(null);
    clearPatientRegValidationState();
    setActivePanels(DEFAULT_OPEN_PANELS);
    setFileList([]);

    if (photoPreview.startsWith('blob:')) {
      URL.revokeObjectURL(photoPreview);
    }
    setPhotoPreview('');
    message.info('Form cleared');
  };

  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      setPendingSubmitErrors(null);
      clearPatientRegValidationState();
      message.success('Employee entry saved');
      console.info('Employee entry', {
        ...values,
        picture: fileList[0]?.name ?? null,
        age: ageLabel,
      });
    } catch (error) {
      const errorFields = error?.errorFields ?? [];
      if (errorFields.length > 0) {
        const panelsToOpen = new Set(activePanels);
        for (const field of errorFields) {
          const fieldName = Array.isArray(field.name) ? field.name[0] : field.name;
          const panel = FIELD_PANEL_MAP[fieldName];
          if (panel) {
            panelsToOpen.add(panel);
          }
        }
        setActivePanels([...panelsToOpen]);
        setPendingSubmitErrors(errorFields);
      } else {
        setActivePanels(ALL_PANEL_KEYS);
      }
      message.error('Please complete all required fields');
    }
  };

  return (
    <div className="patient-registration-page employee-entry-page">
      <Form
        form={form}
        layout="vertical"
        className="patient-registration-form employee-entry-form"
        requiredMark={false}
        scrollToFirstError
        initialValues={initialValues}
        onValuesChange={(changed) => {
          handleFormChangeClearErrors(form, changed);
          const stillHasErrors = form.getFieldsError().some(({ errors }) => errors.length > 0);
          if (!stillHasErrors) {
            clearPatientRegValidationState();
          }
        }}
      >
        <Collapse
          items={collapseItems}
          activeKey={activePanels}
          onChange={setActivePanels}
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

        <div className="patient-registration-actions">
          <Button type="link" className="patient-reg-btn-clear" onClick={handleClear}>
            Clear
          </Button>
          <Button type="primary" className="patient-reg-btn-save" onClick={handleSave}>
            Save Employee
          </Button>
        </div>
      </Form>
    </div>
  );
}
