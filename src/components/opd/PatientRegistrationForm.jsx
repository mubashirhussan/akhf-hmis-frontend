'use client';

import { useMemo, useState } from 'react';
import { DownOutlined, UpOutlined } from '@ant-design/icons';
import {
  Button,
  Checkbox,
  Col,
  Collapse,
  Form,
  Input,
  Radio,
  Row,
  Select,
  message,
} from 'antd';
import HmisDobAgeField from '@/components/ui/HmisDobAgeField';
import { DOB_AGE_UNITS } from '@/lib/dob-from-age';
import { HMIS_FIELD_CONTROL_CLASS } from '@/lib/hmis-field-control';

const controlClass = HMIS_FIELD_CONTROL_CLASS;

const TITLE_OPTIONS = [
  { value: 'mr', label: 'Mr.' },
  { value: 'miss', label: 'Miss' },
  { value: 'mrs', label: 'Mrs.' },
  { value: 'b', label: 'B' },
  { value: 'mas', label: 'Mas.' },
];

const RELATION_OPTIONS = [
  { value: 'so', label: 'S/O' },
  { value: 'do', label: 'D/O' },
  { value: 'wo', label: 'W/O' },
];

const GENDER_OPTIONS = [
  { value: 'male', label: 'Male' },
  { value: 'female', label: 'Female' },
  { value: 'other', label: 'Other' },
];

const CITY_OPTIONS = [
  { value: 'peshawar', label: 'Peshawar' },
  { value: 'islamabad', label: 'Islamabad' },
  { value: 'lahore', label: 'Lahore' },
];

const TOWN_OPTIONS = [
  { value: 'town-1', label: 'Peshawar Town-1' },
  { value: 'town-2', label: 'Peshawar Town-2' },
];

const SPECIALITY_OPTIONS = [
  { value: 'gynae', label: 'Gynae' },
  { value: 'medicine', label: 'Medicine' },
  { value: 'surgery', label: 'Surgery' },
];

const DOCTOR_OPTIONS = [
  { value: 'nabeela', label: 'NABEELA RAUF' },
  { value: 'ali', label: 'Dr. Ali' },
  { value: 'khan', label: 'Dr. Khan' },
];

const PRIMARY_CATEGORY_OPTIONS = [
  { value: 'general', label: 'General' },
  { value: 'employee', label: 'Employee' },
  { value: 'panel', label: 'Panel' },
  { value: 'pwf', label: 'Patient Welfare Fund' },
];

const LAB_CATEGORY_OPTIONS = [
  { value: 'b2b', label: 'B2B LABS' },
  { value: 'friendMedical', label: 'Friend Medical Lab' },
  { value: 'rdl', label: 'The real lab (RDL)' },
];

const CHECKUP_TYPE_OPTIONS = [
  { value: 'routine', label: 'Routine' },
  { value: 'emergency', label: 'Emergency' },
];

const COMPLAINT_OPTIONS = [
  { value: 'fever', label: 'Fever' },
  { value: 'pain', label: 'Pain' },
  { value: 'checkup', label: 'General Checkup' },
];

const LAB_OPTIONS = [
  { value: 'chughtai', label: 'Chughtai Lab' },
  { value: 'excel', label: 'Excel Lab' },
  { value: 'dr-essa', label: 'Dr. Essa Laboratory' },
];

const RELIGION_OPTIONS = [
  { value: 'islam', label: 'Islam' },
  { value: 'hindu', label: 'Hindu' },
  { value: 'christian', label: 'Christian' },
  { value: 'other', label: 'Other' },
];

const NATIONALITY_OPTIONS = [
  { value: 'pakistani', label: 'Pakistani' },
  { value: 'afghan', label: 'Afghan' },
  { value: 'other', label: 'Other' },
];

const COUNTRY_OPTIONS = [{ value: 'pakistan', label: 'PAKISTAN' }];

const PROVINCE_OPTIONS = [
  { value: 'kp', label: 'Khyber Pakhtunkhwa' },
  { value: 'punjab', label: 'Punjab' },
  { value: 'sindh', label: 'Sindh' },
];

const DISTRICT_OPTIONS = [
  { value: 'peshawar', label: 'Peshawar' },
  { value: 'mardan', label: 'Mardan' },
  { value: 'swat', label: 'Swat' },
];

const KIN_TITLE_OPTIONS = [
  { value: 'mr', label: 'Mr.' },
  { value: 'miss', label: 'Miss' },
  { value: 'mrs', label: 'Mrs.' },
];

const KIN_GENDER_OPTIONS = [
  { value: 'male', label: 'Male' },
  { value: 'female', label: 'Female' },
];

const KIN_RELATION_OPTIONS = [
  { value: 'son', label: 'Son' },
  { value: 'daughter', label: 'Daughter' },
  { value: 'spouse', label: 'Spouse' },
  { value: 'parent', label: 'Parent' },
  { value: 'sibling', label: 'Sibling' },
  { value: 'other', label: 'Other' },
];

const REQUIRED_RULE = (message) => [
  { required: true, message, validateTrigger: 'onSubmit' },
];

const dobAgeValidator = (_, value) => {
  const age = value?.age?.trim?.() ?? '';
  if (!age || Number(age) <= 0) {
    return Promise.reject(new Error('Age is required'));
  }
  return Promise.resolve();
};

const dobAgeRules = [{ validator: dobAgeValidator, validateTrigger: 'onSubmit' }];

function DobAgeFormControl({ value, onChange }) {
  return (
    <HmisDobAgeField
      embedded
      className="patient-reg-dob-age"
      age={value?.age ?? ''}
      unit={value?.unit ?? DOB_AGE_UNITS.years}
      onChange={onChange}
    />
  );
}

const initialValues = {
  title: 'mr',
  guardianRelation: 'so',
  gender: 'male',
  city: 'peshawar',
  town: 'town-1',
  dobAge: { age: '', unit: DOB_AGE_UNITS.years, dob: null },
  religion: 'islam',
  nationality: 'pakistani',
  country: 'pakistan',
  province: 'kp',
  district: 'peshawar',
  addressCity: 'peshawar',
  kinTitle: 'mr',
  kinGender: 'male',
  kinRelation: 'son',
  kinCountry: 'pakistan',
  primaryCategory: 'general',
  labCategory: 'friendMedical',
  speciality: 'gynae',
  doctor: 'nabeela',
  checkupType: 'routine',
  panelReference: '700',
};

const DEFAULT_OPEN_PANELS = ['patient', 'general'];

function renderRequiredMark(label, { required }) {
  if (!required) {
    return label;
  }

  return (
    <span className="patient-reg-label">
      {label}
      <span className="patient-reg-label-asterisk" aria-hidden>
        *
      </span>
    </span>
  );
}

export default function PatientRegistrationForm() {
  const [form] = Form.useForm();
  const [activePanels, setActivePanels] = useState(DEFAULT_OPEN_PANELS);
  const labCategory = Form.useWatch('labCategory', form);

  const isB2bLabCategory = labCategory === 'b2b';

  const collapseItems = useMemo(
    () => [
      {
        key: 'patient',
        label: 'Patient Information',
        children: (
          <>
            <Form.Item name="title" label="Title" className="patient-reg-title-row">
              <Radio.Group options={TITLE_OPTIONS} />
            </Form.Item>

            <Row gutter={[16, 0]} className="patient-reg-grid-4">
              <Col xs={24} sm={12} lg={6}>
                <Form.Item
                  name="firstName"
                  label="First Name"
                  required
                  rules={REQUIRED_RULE('First name is required')}
                >
                  <Input className={controlClass} />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12} lg={6}>
                <Form.Item name="lastName" label="Last Name">
                  <Input className={controlClass} />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12} lg={6}>
                <Form.Item
                  name="dobAge"
                  label="DOB / Age"
                  required
                  rules={dobAgeRules}
                >
                  <DobAgeFormControl />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12} lg={6}>
                <Form.Item name="gender" label="Patient Gender">
                  <Select className={controlClass} options={GENDER_OPTIONS} />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12} lg={6}>
                <Form.Item name="cnic" label="CNIC #">
                  <Input className={controlClass} />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12} lg={6}>
                <Form.Item
                  name="contactNo"
                  label="Contact #"
                  required
                  rules={REQUIRED_RULE('Contact number is required')}
                >
                  <Input className={controlClass} />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12} lg={6}>
                <Form.Item name="city" label="City">
                  <Select className={controlClass} options={CITY_OPTIONS} />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12} lg={6}>
                <Form.Item name="town" label="Town">
                  <Select className={controlClass} options={TOWN_OPTIONS} />
                </Form.Item>
              </Col>
            </Row>

            <div className="patient-reg-guardian-box">
              <Row gutter={[16, 0]} className="patient-reg-grid-4">
                <Col xs={24} lg={6}>
                  <Form.Item name="guardianRelation" label="Guardian">
                    <Radio.Group options={RELATION_OPTIONS} />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                  <Form.Item
                    name="guardianFirstName"
                    label="Father First Name"
                    required
                    rules={REQUIRED_RULE('Father first name is required')}
                  >
                    <Input className={controlClass} />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                  <Form.Item name="guardianLastName" label="Last Name">
                    <Input className={controlClass} />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                  <Form.Item name="email" label="Email">
                    <Input className={controlClass} type="email" />
                  </Form.Item>
                </Col>
              </Row>
            </div>

            <Form.Item name="presentAddress" label="Present Address">
              <Input className={controlClass} />
            </Form.Item>
          </>
        ),
      },
      {
        key: 'address',
        label: 'Address Information',
        children: (
          <Row gutter={[16, 0]} className="patient-reg-grid-4">
            <Col xs={24} sm={12} lg={6}>
              <Form.Item name="religion" label="Religion">
                <Select className={controlClass} options={RELIGION_OPTIONS} />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <Form.Item name="country" label="Country">
                <Select className={controlClass} options={COUNTRY_OPTIONS} />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <Form.Item name="province" label="Province">
                <Select className={controlClass} options={PROVINCE_OPTIONS} allowClear />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <Form.Item name="district" label="District">
                <Select className={controlClass} options={DISTRICT_OPTIONS} allowClear />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <Form.Item name="addressCity" label="City">
                <Select className={controlClass} options={CITY_OPTIONS} allowClear />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <Form.Item name="nationality" label="Nationality">
                <Select className={controlClass} options={NATIONALITY_OPTIONS} />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <Form.Item name="addressEmail" label="Email">
                <Input className={controlClass} type="email" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} lg={6} className="patient-reg-checkbox-col">
              <Form.Item name="sameForNextOfKin" valuePropName="checked">
                <Checkbox>Same for Next of Kin</Checkbox>
              </Form.Item>
            </Col>
            <Col xs={24}>
              <Form.Item name="permanentAddress" label="Permanent Address">
                <Input.TextArea className={controlClass} rows={2} />
              </Form.Item>
            </Col>
          </Row>
        ),
      },
      {
        key: 'kin',
        label: 'Next of Kin Information',
        children: (
          <Row gutter={[16, 0]} className="patient-reg-grid-4">
            <Col xs={24} sm={12} lg={6}>
              <Form.Item name="kinTitle" label="Title">
                <Select className={controlClass} options={KIN_TITLE_OPTIONS} />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <Form.Item name="kinGender" label="Gender">
                <Select className={controlClass} options={KIN_GENDER_OPTIONS} />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <Form.Item name="kinRelation" label="Relation with patient">
                <Select className={controlClass} options={KIN_RELATION_OPTIONS} />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <Form.Item name="kinFirstName" label="First Name">
                <Input className={controlClass} />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <Form.Item name="kinMiddleName" label="Middle Name">
                <Input className={controlClass} />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <Form.Item name="kinLastName" label="Last Name">
                <Input className={controlClass} />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <Form.Item name="kinCnic" label="CNIC #">
                <Input className={controlClass} />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <Form.Item name="kinContact" label="Contact #">
                <Input className={controlClass} />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <Form.Item name="kinCountry" label="Country">
                <Select className={controlClass} options={COUNTRY_OPTIONS} />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <Form.Item name="kinProvince" label="Province">
                <Select className={controlClass} options={PROVINCE_OPTIONS} allowClear />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <Form.Item name="kinDistrict" label="District">
                <Select className={controlClass} options={DISTRICT_OPTIONS} allowClear />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <Form.Item name="kinCity" label="City">
                <Select className={controlClass} options={CITY_OPTIONS} allowClear />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} lg={12}>
              <Form.Item name="kinAddress1" label="Address 1">
                <Input.TextArea className={controlClass} rows={2} />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} lg={12}>
              <Form.Item name="kinAddress2" label="Address 2">
                <Input.TextArea className={controlClass} rows={2} />
              </Form.Item>
            </Col>
          </Row>
        ),
      },
      {
        key: 'general',
        label: 'General Information',
        children: isB2bLabCategory ? (
          <Row gutter={[16, 0]} className="patient-reg-grid-4">
            <Col xs={24}>
              <Form.Item name="labCategory" label="Lab Partner" className="patient-reg-radio-row">
                <Radio.Group options={LAB_CATEGORY_OPTIONS} />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <Form.Item
                name="selectedLab"
                label="Select Lab"
                required
                rules={REQUIRED_RULE('Please select a lab')}
              >
                <Select className={controlClass} options={LAB_OPTIONS} allowClear />
              </Form.Item>
            </Col>
          </Row>
        ) : (
          <Row gutter={[16, 0]} className="patient-reg-grid-4">
            <Col xs={24} sm={12} lg={6}>
              <Form.Item name="speciality" label="Speciality/Dept">
                <Select className={controlClass} options={SPECIALITY_OPTIONS} />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <Form.Item name="doctor" label="Doctor">
                <Select className={controlClass} options={DOCTOR_OPTIONS} />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <Form.Item name="checkupType" label="Checkup Type">
                <Select className={controlClass} options={CHECKUP_TYPE_OPTIONS} />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <Form.Item name="panelReference" label="Reference #">
                <Input className={controlClass} />
              </Form.Item>
            </Col>
            <Col xs={24} lg={12}>
              <Form.Item name="primaryCategory" label="Category" className="patient-reg-radio-row">
                <Radio.Group options={PRIMARY_CATEGORY_OPTIONS} />
              </Form.Item>
            </Col>
            <Col xs={24} lg={12}>
              <Form.Item name="labCategory" label="Lab Partner" className="patient-reg-radio-row">
                <Radio.Group options={LAB_CATEGORY_OPTIONS} />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <Form.Item name="complaint" label="Complaint">
                <Select className={controlClass} options={COMPLAINT_OPTIONS} allowClear />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <Form.Item name="complaintOther" label="Other">
                <Input className={controlClass} />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} lg={12}>
              <Form.Item name="comments" label="Comments">
                <Input className={controlClass} />
              </Form.Item>
            </Col>
          </Row>
        ),
      },
    ],
    [isB2bLabCategory],
  );

  const handleClear = () => {
    form.resetFields();
    setActivePanels(DEFAULT_OPEN_PANELS);
    message.info('Form cleared');
  };

  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      message.success('Patient registration saved');
      console.info('Patient registration', values);
    } catch {
      message.error('Please complete all required fields');
    }
  };

  return (
    <div className="patient-registration-page">
      {/* <h1 className="patient-registration-title">Patient Registration</h1> */}
      <Form
        form={form}
        layout="vertical"
        className="patient-registration-form"
        validateTrigger="onSubmit"
        requiredMark={renderRequiredMark}
        scrollToFirstError
        initialValues={initialValues}
        onValuesChange={(changed) => {
          if ('labCategory' in changed && changed.labCategory === 'b2b') {
            form.setFieldValue('selectedLab', undefined);
          }
        }}
      >
        <Collapse
          items={collapseItems}
          activeKey={activePanels}
          onChange={setActivePanels}
          className="patient-registration-collapse"
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
            Save &amp; Print
          </Button>
        </div>
      </Form>
    </div>
  );
}
