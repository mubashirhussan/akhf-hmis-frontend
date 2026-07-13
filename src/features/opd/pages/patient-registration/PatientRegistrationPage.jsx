'use client';

import { useMemo, useState } from 'react';
import { DownOutlined, UpOutlined } from '@ant-design/icons';
import { App, Button, Collapse, Form } from 'antd';
import DynamicForm from '@/components/form/DynamicForm';
import {
  PATIENT_FORM_INITIAL_VALUES,
  PATIENT_FIELDS,
  ADDRESS_FIELDS,
  KIN_FIELDS,
  GENERAL_FIELDS,
  GENERAL_B2B_FIELDS,
} from './patient-registration-fields';
import { useCreatePatientMutation } from '@/features/opd/api/opdEndpoints';
import { buildPatientPayload } from '@/features/opd/utils/buildPatientPayload';

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
  const [createPatient, { isLoading: isSaving }] = useCreatePatientMutation();
  const labCategory = Form.useWatch('labCategory', form);

  const isB2bLabCategory = labCategory === 'b2b';

  const collapseItems = useMemo(
    () => [
      {
        key: 'patient',
        label: 'Patient Information',
        children: (
          <DynamicForm
            fields={PATIENT_FIELDS}
            gutter={[12, 0]}
            className="patient-reg-section-grid"
          />
        ),
      },
      {
        key: 'address',
        label: 'Address Information',
        children: (
          <DynamicForm
            fields={ADDRESS_FIELDS}
            gutter={[12, 0]}
            className="patient-reg-section-grid"
          />
        ),
      },
      {
        key: 'kin',
        label: 'Next of Kin Information',
        children: (
          <DynamicForm
            fields={KIN_FIELDS}
            gutter={[12, 0]}
            className="patient-reg-section-grid"
          />
        ),
      },
      {
        key: 'general',
        label: 'General Information',
        children: (
          <DynamicForm
            fields={isB2bLabCategory ? GENERAL_B2B_FIELDS : GENERAL_FIELDS}
            gutter={[12, 0]}
            className="patient-reg-section-grid"
          />
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

      const payload = buildPatientPayload(values, {
        hospitalID: 1, // TODO: replace with value from your auth/session context
        empID: 1, // TODO: replace with logged-in user's empID
      });

      await createPatient(payload).unwrap();

      message.success('Patient registered successfully');
      form.resetFields();
      setActivePanels(DEFAULT_OPEN_PANELS);
    } catch (error) {
      if (error?.status || error?.data) {
        message.error(error?.data?.message ?? 'Registration failed. Please try again.');
        return;
      }

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
        name="patient-reg"
        layout="vertical"
        className="patient-registration-form"
        requiredMark={false}
        scrollToFirstError
        initialValues={PATIENT_FORM_INITIAL_VALUES}
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
          <Button type="primary" className="patient-reg-btn-save" onClick={handleSave} loading={isSaving}>
            Save &amp; Print
          </Button>
        </div>
      </Form>
    </div>
  );
}
