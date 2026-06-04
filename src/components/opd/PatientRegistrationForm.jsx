'use client';

import { useEffect, useMemo, useState } from 'react';
import { DownOutlined, UpOutlined } from '@ant-design/icons';
import { App, Button, Checkbox, Collapse, Form, Input, Select } from 'antd';
import HmisDobAgeField from '@/components/ui/HmisDobAgeField';
import HmisFormGrid from '@/components/ui/HmisFormGrid';
import PatientRegField from '@/components/opd/PatientRegField';
import { DOB_AGE_UNITS } from '@/lib/dob-from-age';
import {
  clearPatientRegValidationState,
  focusFormField,
  handleFormChangeClearErrors,
  highlightAllInvalidFields,
} from '@/lib/hmis-form-validation';
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

const REQUIRED_RULE = (msg) => [
  {
    required: true,
    whitespace: true,
    message: msg,
    validateTrigger: ['onChange', 'onSubmit'],
  },
];

const dobAgeValidator = (_, value) => {
  const age = value?.age?.trim?.() ?? '';
  if (!age || Number(age) <= 0) {
    return Promise.reject(new Error('Age is required'));
  }
  return Promise.resolve();
};

const dobAgeRules = [
  { validator: dobAgeValidator, validateTrigger: ['onChange', 'onSubmit'] },
];

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

const ALL_PANEL_KEYS = ['patient', 'address', 'kin', 'general'];

/** Maps form field names to accordion panel keys for expand-on-error. */
const FIELD_PANEL_MAP = {
  title: 'patient',
  firstName: 'patient',
  lastName: 'patient',
  dobAge: 'patient',
  gender: 'patient',
  cnic: 'patient',
  contactNo: 'patient',
  city: 'patient',
  town: 'patient',
  guardianRelation: 'patient',
  guardianFirstName: 'patient',
  guardianLastName: 'patient',
  email: 'patient',
  presentAddress: 'patient',
  religion: 'address',
  country: 'address',
  province: 'address',
  district: 'address',
  addressCity: 'address',
  nationality: 'address',
  addressEmail: 'address',
  sameForNextOfKin: 'address',
  permanentAddress: 'address',
  kinTitle: 'kin',
  kinGender: 'kin',
  kinRelation: 'kin',
  kinFirstName: 'kin',
  kinMiddleName: 'kin',
  kinLastName: 'kin',
  kinCnic: 'kin',
  kinContact: 'kin',
  kinCountry: 'kin',
  kinProvince: 'kin',
  kinDistrict: 'kin',
  kinCity: 'kin',
  kinAddress1: 'kin',
  kinAddress2: 'kin',
  speciality: 'general',
  doctor: 'general',
  checkupType: 'general',
  panelReference: 'general',
  primaryCategory: 'general',
  labCategory: 'general',
  complaint: 'general',
  complaintOther: 'general',
  comments: 'general',
  selectedLab: 'general',
};

export default function PatientRegistrationForm() {
  const { message } = App.useApp();
  const [form] = Form.useForm();
  const [activePanels, setActivePanels] = useState(DEFAULT_OPEN_PANELS);
  const [pendingSubmitErrors, setPendingSubmitErrors] = useState(null);
  const labCategory = Form.useWatch('labCategory', form);

  const isB2bLabCategory = labCategory === 'b2b';

  const collapseItems = useMemo(
    () => [
      {
        key: 'patient',
        label: 'Patient Information',
        children: (
          <HmisFormGrid columns={4} className="patient-reg-section-grid">
            <PatientRegField name="title" label="Title">
              <Select className={controlClass} options={TITLE_OPTIONS} />
            </PatientRegField>

            <PatientRegField
              name="firstName"
              label="First Name"
              required
              rules={REQUIRED_RULE('First name is required')}
              validateTrigger={['onChange', 'onSubmit']}
            >
              <Input className={controlClass} />
            </PatientRegField>

            <PatientRegField name="lastName" label="Last Name">
              <Input className={controlClass} />
            </PatientRegField>

            <PatientRegField
              name="dobAge"
              label="DOB / Age"
              required
              rules={dobAgeRules}
              validateTrigger={['onChange', 'onSubmit']}
            >
              <DobAgeFormControl />
            </PatientRegField>

            <PatientRegField name="gender" label="Patient Gender">
              <Select className={controlClass} options={GENDER_OPTIONS} />
            </PatientRegField>

            <PatientRegField name="cnic" label="CNIC #">
              <Input className={controlClass} />
            </PatientRegField>

            <PatientRegField
              name="contactNo"
              label="Contact #"
              required
              rules={REQUIRED_RULE('Contact number is required')}
              validateTrigger={['onChange', 'onSubmit']}
            >
              <Input className={controlClass} />
            </PatientRegField>

            <PatientRegField name="city" label="City">
              <Select className={controlClass} options={CITY_OPTIONS} />
            </PatientRegField>

            <PatientRegField name="town" label="Town">
              <Select className={controlClass} options={TOWN_OPTIONS} />
            </PatientRegField>

            <PatientRegField name="guardianRelation" label="Guardian">
              <Select className={controlClass} options={RELATION_OPTIONS} />
            </PatientRegField>

            <PatientRegField
              name="guardianFirstName"
              label="Guardian First Name"
              required
              rules={REQUIRED_RULE('Gaurdian first name is required')}
              validateTrigger={['onChange', 'onSubmit']}
            >
              <Input className={controlClass} />
            </PatientRegField>

            <PatientRegField name="guardianLastName" label="Guardian Last Name">
              <Input className={controlClass} />
            </PatientRegField>

            <PatientRegField name="email" label="Email">
              <Input className={controlClass} type="email" />
            </PatientRegField>

            <PatientRegField name="presentAddress" label="Present Address">
              <Input className={controlClass} />
            </PatientRegField>
          </HmisFormGrid>
        ),
      },
      {
        key: 'address',
        label: 'Address Information',
        children: (
          <HmisFormGrid columns={4} className="patient-reg-section-grid">
            <PatientRegField name="religion" label="Religion">
              <Select className={controlClass} options={RELIGION_OPTIONS} />
            </PatientRegField>

            <PatientRegField name="country" label="Country">
              <Select className={controlClass} options={COUNTRY_OPTIONS} />
            </PatientRegField>

            <PatientRegField name="province" label="Province">
              <Select className={controlClass} options={PROVINCE_OPTIONS} allowClear />
            </PatientRegField>

            <PatientRegField name="district" label="District">
              <Select className={controlClass} options={DISTRICT_OPTIONS} allowClear />
            </PatientRegField>

            <PatientRegField name="addressCity" label="City">
              <Select className={controlClass} options={CITY_OPTIONS} allowClear />
            </PatientRegField>

            <PatientRegField name="nationality" label="Nationality">
              <Select className={controlClass} options={NATIONALITY_OPTIONS} />
            </PatientRegField>

            <PatientRegField name="addressEmail" label="Email">
              <Input className={controlClass} type="email" />
            </PatientRegField>

            <div className="patient-reg-checkbox-slot">
              <Form.Item name="sameForNextOfKin" valuePropName="checked" noStyle>
                <Checkbox>Same for Next of Kin</Checkbox>
              </Form.Item>
            </div>

            <PatientRegField name="permanentAddress" label="Permanent Address" col="full">
              <Input.TextArea className={controlClass} rows={2} />
            </PatientRegField>
          </HmisFormGrid>
        ),
      },
      {
        key: 'kin',
        label: 'Next of Kin Information',
        children: (
          <HmisFormGrid columns={4} className="patient-reg-section-grid">
            <PatientRegField name="kinTitle" label="Title">
              <Select className={controlClass} options={KIN_TITLE_OPTIONS} />
            </PatientRegField>

            <PatientRegField name="kinGender" label="Gender">
              <Select className={controlClass} options={KIN_GENDER_OPTIONS} />
            </PatientRegField>

            <PatientRegField name="kinRelation" label="Relation with patient">
              <Select className={controlClass} options={KIN_RELATION_OPTIONS} />
            </PatientRegField>

            <PatientRegField name="kinFirstName" label="First Name">
              <Input className={controlClass} />
            </PatientRegField>

            <PatientRegField name="kinMiddleName" label="Middle Name">
              <Input className={controlClass} />
            </PatientRegField>

            <PatientRegField name="kinLastName" label="Last Name">
              <Input className={controlClass} />
            </PatientRegField>

            <PatientRegField name="kinCnic" label="CNIC #">
              <Input className={controlClass} />
            </PatientRegField>

            <PatientRegField name="kinContact" label="Contact #">
              <Input className={controlClass} />
            </PatientRegField>

            <PatientRegField name="kinCountry" label="Country">
              <Select className={controlClass} options={COUNTRY_OPTIONS} />
            </PatientRegField>

            <PatientRegField name="kinProvince" label="Province">
              <Select className={controlClass} options={PROVINCE_OPTIONS} allowClear />
            </PatientRegField>

            <PatientRegField name="kinDistrict" label="District">
              <Select className={controlClass} options={DISTRICT_OPTIONS} allowClear />
            </PatientRegField>

            <PatientRegField name="kinCity" label="City">
              <Select className={controlClass} options={CITY_OPTIONS} allowClear />
            </PatientRegField>

            <PatientRegField name="kinAddress1" label="Address 1">
              <Input className={controlClass} />
            </PatientRegField>

            <PatientRegField name="kinAddress2" label="Address 2">
              <Input className={controlClass} />
            </PatientRegField>
          </HmisFormGrid>
        ),
      },
      {
        key: 'general',
        label: 'General Information',
        children: isB2bLabCategory ? (
          <HmisFormGrid columns={4} className="patient-reg-section-grid">
            <PatientRegField name="labCategory" label="Lab Partner">
              <Select className={controlClass} options={LAB_CATEGORY_OPTIONS} />
            </PatientRegField>

            <PatientRegField
              name="selectedLab"
              label="Select Lab"
              required
              rules={REQUIRED_RULE('Please select a lab')}
              validateTrigger={['onChange', 'onSubmit']}
            >
              <Select className={controlClass} options={LAB_OPTIONS} allowClear />
            </PatientRegField>
          </HmisFormGrid>
        ) : (
          <HmisFormGrid columns={4} className="patient-reg-section-grid">
            <PatientRegField name="speciality" label="Speciality/Dept">
              <Select className={controlClass} options={SPECIALITY_OPTIONS} />
            </PatientRegField>

            <PatientRegField name="doctor" label="Doctor">
              <Select className={controlClass} options={DOCTOR_OPTIONS} />
            </PatientRegField>

            <PatientRegField name="checkupType" label="Checkup Type">
              <Select className={controlClass} options={CHECKUP_TYPE_OPTIONS} />
            </PatientRegField>

            <PatientRegField name="panelReference" label="Reference #">
              <Input className={controlClass} />
            </PatientRegField>

            <PatientRegField name="primaryCategory" label="Category">
              <Select className={controlClass} options={PRIMARY_CATEGORY_OPTIONS} />
            </PatientRegField>

            <PatientRegField name="labCategory" label="Lab Partner">
              <Select className={controlClass} options={LAB_CATEGORY_OPTIONS} />
            </PatientRegField>

            <PatientRegField name="complaint" label="Complaint">
              <Select className={controlClass} options={COMPLAINT_OPTIONS} allowClear />
            </PatientRegField>

            <PatientRegField name="complaintOther" label="Other">
              <Input className={controlClass} />
            </PatientRegField>

            <PatientRegField name="comments" label="Comments">
              <Input className={controlClass} />
            </PatientRegField>
          </HmisFormGrid>
        ),
      },
    ],
    [isB2bLabCategory],
  );

  const handleClear = () => {
    form.resetFields();
    setPendingSubmitErrors(null);
    clearPatientRegValidationState();
    setActivePanels(DEFAULT_OPEN_PANELS);
    message.info('Form cleared');
  };

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
  }, [pendingSubmitErrors, activePanels, form]);

  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      setPendingSubmitErrors(null);
      clearPatientRegValidationState();
      message.success('Patient registration saved');
      console.info('Patient registration', values);
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
    <div className="patient-registration-page">
      <Form
        form={form}
        layout="vertical"
        className="patient-registration-form"
        requiredMark={false}
        scrollToFirstError
        initialValues={initialValues}
        onValuesChange={(changed) => {
          handleFormChangeClearErrors(form, changed, (values) => {
            if ('labCategory' in values && values.labCategory === 'b2b') {
              form.setFieldValue('selectedLab', undefined);
            }
          });
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
