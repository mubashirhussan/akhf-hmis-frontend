'use client';

import { useState } from 'react';
import { Input, Select } from 'antd';
import DobAgeField from '@/components/ui/DobAgeField';
import FloatingField from '@/components/ui/FloatingField';
import FormGrid from '@/components/ui/FormGrid';
import FormGridRow from '@/components/ui/FormGridRow';
import { DOB_AGE_UNITS } from '@/lib/dob-from-age';
import { FIELD_CONTROL_CLASS } from '@/lib/field-control';
import SearchServicesSection from '@/features/opd/components/SearchServicesSection';

const controlClass = FIELD_CONTROL_CLASS;

const TITLE_OPTIONS = [
  { value: 'mr', label: 'Mr.' },
  { value: 'miss', label: 'Miss' },
  { value: 'mrs', label: 'Mrs.' },
  { value: 'bo', label: 'B/O' },
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

const RELIGION_OPTIONS = [
  { value: 'islam', label: 'Islam' },
  { value: 'hindu', label: 'Hindu' },
  { value: 'christian', label: 'Christian' },
  { value: 'other', label: 'Other' },
];

const DEPARTMENT_OPTIONS = [
  { value: 'laboratory', label: 'Laboratory' },
  { value: 'private', label: 'Private' },
  { value: 'radiology', label: 'Radiology' },
];

const CONSULTANT_OPTIONS = [
  { value: 'abc', label: 'Mr abc' },
  { value: 'ali', label: 'Mr Ali' },
  { value: 'xyz', label: 'Mr xyz' },
];

const CATEGORY_OPTIONS = [
  { value: 'general', label: 'General' },
  { value: 'panel', label: 'Panel' },
  { value: 'b2b', label: 'B2B LABS' },
];

const PATIENT_TYPE_OPTIONS = [
  { value: 'opd', label: 'OPD' },
  { value: 'ipd', label: 'IPD' },
];

const CHECKUP_TYPE_OPTIONS = [
  { value: 'routine', label: 'Routine' },
  { value: 'emergency', label: 'Emergency' },
];

const INSURER_OPTIONS = [
  { value: 'ptcl', label: 'PTCL' },
  { value: 'ssp', label: 'SSP' },
  { value: 'state-life', label: 'State Life' },
];

const DESIGNATION_OPTIONS = [{ value: 'na', label: 'N/A' }];

const LAB_OPTIONS = [
  { value: 'chughtai', label: 'Chughtai Lab' },
  { value: 'excel', label: 'Excel Lab' },
  { value: 'dr-essa', label: 'Dr. Essa Laboratory' },
  { value: 'shaukat', label: 'Shaukat Khanum Lab' },
];

export default function AddNewRecordTab({ formColumns = 4 }) {
  const [title, setTitle] = useState('mr');
  const [relation, setRelation] = useState('so');
  const [gender, setGender] = useState('male');
  const [religion, setReligion] = useState('islam');
  const [department, setDepartment] = useState('laboratory');
  const [consultant, setConsultant] = useState('abc');
  const [category, setCategory] = useState('general');
  const [patientType, setPatientType] = useState('opd');
  const [checkupType, setCheckupType] = useState('emergency');
  const [insurer, setInsurer] = useState('ptcl');
  const [designation, setDesignation] = useState('na');
  const [selectedLab, setSelectedLab] = useState(undefined);
  const [dobAge, setDobAge] = useState({
    age: '',
    unit: DOB_AGE_UNITS.years,
    dob: null,
  });

  const isB2bCategory = category === 'b2b';
  const isGeneralCategory = category === 'general';
  const showPanelFields = !isB2bCategory && !isGeneralCategory;

  const handleCategoryChange = (value) => {
    setCategory(value);
    setSelectedLab(undefined);
  };

  return (
    <div className="walk-in-add-record-layout mt-2">
      <FormGrid
        as="form"
        columns={formColumns}
        className="walk-in-add-record-form"
        onSubmit={(e) => e.preventDefault()}
      >
        <FloatingField label="Title" htmlFor="title">
          <Select
            id="title"
            className={controlClass}
            value={title}
            options={TITLE_OPTIONS}
            onChange={setTitle}
          />
        </FloatingField>

        <FloatingField label="First Name" htmlFor="full-name">
          <Input id="full-name" className={controlClass} autoComplete="off" />
        </FloatingField>

        <FloatingField label="Last Name" htmlFor="last-name">
          <Input id="last-name" className={controlClass} autoComplete="off" />
        </FloatingField>

        <FloatingField label="DOB / Age" htmlFor="dob-age">
          <DobAgeField
            embedded
            className="patient-reg-dob-age"
            age={dobAge.age}
            unit={dobAge.unit}
            onChange={setDobAge}
          />
        </FloatingField>

        <FloatingField label="Gender" htmlFor="gender">
          <Select
            id="gender"
            className={controlClass}
            value={gender}
            options={GENDER_OPTIONS}
            onChange={setGender}
          />
        </FloatingField>

        <FloatingField label="Contact #" htmlFor="contact-no">
          <Input id="contact-no" className={controlClass} autoComplete="off" />
        </FloatingField>

        <FloatingField label="CNIC #" htmlFor="cnic">
          <Input id="cnic" className={controlClass} autoComplete="off" />
        </FloatingField>

        <FloatingField label="Religion" htmlFor="religion">
          <Select
            id="religion"
            className={controlClass}
            value={religion}
            options={RELIGION_OPTIONS}
            onChange={setReligion}
          />
        </FloatingField>

        <FloatingField label="Relation" htmlFor="relation">
          <Select
            id="relation"
            className={controlClass}
            value={relation}
            options={RELATION_OPTIONS}
            onChange={setRelation}
          />
        </FloatingField>

        <FloatingField label="Relation First Name" htmlFor="guardian-first-name">
          <Input id="guardian-first-name" className={controlClass} autoComplete="off" />
        </FloatingField>

        <FloatingField label="Relation Last Name" htmlFor="guardian-last-name">
          <Input id="guardian-last-name" className={controlClass} autoComplete="off" />
        </FloatingField>

        <FloatingField label="Email" htmlFor="email">
          <Input id="email" className={controlClass} type="email" autoComplete="off" />
        </FloatingField>

        <FloatingField label="Address" htmlFor="address" col={2}>
          <Input id="address" className={controlClass} autoComplete="off" />
        </FloatingField>

        <FormGridRow columns={formColumns}>
          <FloatingField label="Department" htmlFor="department">
            <Select
              id="department"
              className={controlClass}
              value={department}
              options={DEPARTMENT_OPTIONS}
              onChange={setDepartment}
            />
          </FloatingField>

          <FloatingField label="Consultant" htmlFor="consultant">
            <Select
              id="consultant"
              className={controlClass}
              value={consultant}
              options={CONSULTANT_OPTIONS}
              onChange={setConsultant}
            />
          </FloatingField>

          <FloatingField label="Refer Doctor" htmlFor="refer-doctor">
            <Input id="refer-doctor" className={controlClass} autoComplete="off" />
          </FloatingField>
        </FormGridRow>

        <FormGridRow columns={formColumns}>
          <FloatingField label="Category" htmlFor="category">
            <Select
              id="category"
              className={controlClass}
              value={category}
              options={CATEGORY_OPTIONS}
              onChange={handleCategoryChange}
            />
          </FloatingField>

          <FloatingField label="Patient Type" htmlFor="patient-type">
            <Select
              id="patient-type"
              className={controlClass}
              value={patientType}
              options={PATIENT_TYPE_OPTIONS}
              onChange={setPatientType}
            />
          </FloatingField>

          <FloatingField label="Checkup Type" htmlFor="checkup-type">
            <Select
              id="checkup-type"
              className={controlClass}
              value={checkupType}
              options={CHECKUP_TYPE_OPTIONS}
              onChange={setCheckupType}
            />
          </FloatingField>
        </FormGridRow>

        {showPanelFields && (
          <FormGridRow columns={formColumns}>
            <FloatingField label="Insurer" htmlFor="insurer">
              <Select
                id="insurer"
                className={controlClass}
                value={insurer}
                options={INSURER_OPTIONS}
                onChange={setInsurer}
              />
            </FloatingField>

            <FloatingField label="Designation" htmlFor="designation">
              <Select
                id="designation"
                className={controlClass}
                value={designation}
                options={DESIGNATION_OPTIONS}
                onChange={setDesignation}
              />
            </FloatingField>

            <FloatingField label="Reference #" htmlFor="reference-no">
              <Input id="reference-no" className={controlClass} autoComplete="off" />
            </FloatingField>
          </FormGridRow>
        )}

        {isB2bCategory && (
          <FormGridRow columns={formColumns}>
            <FloatingField label="Select Lab" htmlFor="selected-lab">
              <Select
                id="selected-lab"
                className={controlClass}
                placeholder="Select LAB"
                value={selectedLab}
                options={LAB_OPTIONS}
                allowClear
                onChange={setSelectedLab}
              />
            </FloatingField>
          </FormGridRow>
        )}
      </FormGrid>

      <div className="walk-in-add-record-services">
        <SearchServicesSection />
      </div>
    </div>
  );
}
