'use client';

import { useState } from 'react';
import { Input, Select } from 'antd';
import HmisDobAgeField from '@/components/ui/HmisDobAgeField';
import HmisFloatingField from '@/components/ui/HmisFloatingField';
import HmisFormGrid from '@/components/ui/HmisFormGrid';
import HmisFormGridRow from '@/components/ui/HmisFormGridRow';
import { DOB_AGE_UNITS } from '@/lib/dob-from-age';
import { HMIS_FIELD_CONTROL_CLASS } from '@/lib/hmis-field-control';
import SearchServicesSection from '@/components/opd/SearchServicesSection';

const controlClass = HMIS_FIELD_CONTROL_CLASS;

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
  const [category, setCategory] = useState('panel');
  const [patientType, setPatientType] = useState('ipd');
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
      <HmisFormGrid
        as="form"
        columns={formColumns}
        className="walk-in-add-record-form"
        onSubmit={(e) => e.preventDefault()}
      >
        {/* Row 1 */}
        <HmisFloatingField label="Title" htmlFor="title">
          <Select
            id="title"
            className={controlClass}
            value={title}
            options={TITLE_OPTIONS}
            onChange={setTitle}
          />
        </HmisFloatingField>

        <HmisFloatingField label="First Name" htmlFor="full-name">
          <Input id="full-name" className={controlClass} autoComplete="off" />
        </HmisFloatingField>

        <HmisFloatingField label="Last Name" htmlFor="last-name">
          <Input id="last-name" className={controlClass} autoComplete="off" />
        </HmisFloatingField>

        <HmisFloatingField label="Contact #" htmlFor="contact-no">
          <Input id="contact-no" className={controlClass} autoComplete="off" />
        </HmisFloatingField>

        <HmisFloatingField label="CNIC #" htmlFor="cnic">
          <Input id="cnic" className={controlClass} autoComplete="off" />
        </HmisFloatingField>

        {/* Row 2 */}
        <HmisFloatingField label="DOB / Age" htmlFor="dob-age">
          <HmisDobAgeField
            embedded
            className="patient-reg-dob-age"
            age={dobAge.age}
            unit={dobAge.unit}
            onChange={setDobAge}
          />
        </HmisFloatingField>

        <HmisFloatingField label="Gender" htmlFor="gender">
          <Select
            id="gender"
            className={controlClass}
            value={gender}
            options={GENDER_OPTIONS}
            onChange={setGender}
          />
        </HmisFloatingField>

        <HmisFloatingField label="Relation" htmlFor="relation">
          <Select
            id="relation"
            className={controlClass}
            value={relation}
            options={RELATION_OPTIONS}
            onChange={setRelation}
          />
        </HmisFloatingField>

        <HmisFloatingField label="First Name" htmlFor="guardian-first-name">
          <Input id="guardian-first-name" className={controlClass} autoComplete="off" />
        </HmisFloatingField>

        <HmisFloatingField label="Last Name" htmlFor="guardian-last-name">
          <Input id="guardian-last-name" className={controlClass} autoComplete="off" />
        </HmisFloatingField>

        {/* Row 3 */}
        <HmisFloatingField label="Email" htmlFor="email">
          <Input id="email" className={controlClass} type="email" autoComplete="off" />
        </HmisFloatingField>

        <HmisFloatingField label="Address" htmlFor="address">
          <Input id="address" className={controlClass} autoComplete="off" />
        </HmisFloatingField>

        <HmisFloatingField label="Religion" htmlFor="religion">
          <Select
            id="religion"
            className={controlClass}
            value={religion}
            options={RELIGION_OPTIONS}
            onChange={setReligion}
          />
        </HmisFloatingField>

        <HmisFloatingField label="Department" htmlFor="department">
          <Select
            id="department"
            className={controlClass}
            value={department}
            options={DEPARTMENT_OPTIONS}
            onChange={setDepartment}
          />
        </HmisFloatingField>

        <HmisFloatingField label="Consultant" htmlFor="consultant">
          <Select
            id="consultant"
            className={controlClass}
            value={consultant}
            options={CONSULTANT_OPTIONS}
            onChange={setConsultant}
          />
        </HmisFloatingField>

        <HmisFloatingField label="Refer Doctor" htmlFor="refer-doctor">
          <Input id="refer-doctor" className={controlClass} autoComplete="off" />
        </HmisFloatingField>

        {/* Category row — always 4 columns, no empty cells */}
        <HmisFormGridRow columns={formColumns}>
          <HmisFloatingField label="Category" htmlFor="category">
            <Select
              id="category"
              className={controlClass}
              value={category}
              options={CATEGORY_OPTIONS}
              onChange={handleCategoryChange}
            />
          </HmisFloatingField>

          <HmisFloatingField label="Patient Type" htmlFor="patient-type">
            <Select
              id="patient-type"
              className={controlClass}
              value={patientType}
              options={PATIENT_TYPE_OPTIONS}
              onChange={setPatientType}
            />
          </HmisFloatingField>

          <HmisFloatingField
            label="Checkup Type"
            htmlFor="checkup-type"
            col={isGeneralCategory ? 2 : 1}
          >
            <Select
              id="checkup-type"
              className={controlClass}
              value={checkupType}
              options={CHECKUP_TYPE_OPTIONS}
              onChange={setCheckupType}
            />
          </HmisFloatingField>

          {isB2bCategory && (
            <HmisFloatingField label="Select Lab" htmlFor="selected-lab">
              <Select
                id="selected-lab"
                className={controlClass}
                placeholder="Select LAB"
                value={selectedLab}
                options={LAB_OPTIONS}
                allowClear
                onChange={setSelectedLab}
              />
            </HmisFloatingField>
          )}

          {showPanelFields && (
            <HmisFloatingField label="Insurer" htmlFor="insurer">
              <Select
                id="insurer"
                className={controlClass}
                value={insurer}
                options={INSURER_OPTIONS}
                onChange={setInsurer}
              />
            </HmisFloatingField>
          )}
        </HmisFormGridRow>

        {showPanelFields && (
          <HmisFormGridRow columns={formColumns}>
            <HmisFloatingField label="Designation" htmlFor="designation">
              <Select
                id="designation"
                className={controlClass}
                value={designation}
                options={DESIGNATION_OPTIONS}
                onChange={setDesignation}
              />
            </HmisFloatingField>

            <HmisFloatingField label="Reference #" htmlFor="reference-no" col={3}>
              <Input id="reference-no" className={controlClass} autoComplete="off" />
            </HmisFloatingField>
          </HmisFormGridRow>
        )}
      </HmisFormGrid>

      <div className="walk-in-add-record-services">
        <SearchServicesSection />
      </div>
    </div>
  );
}
