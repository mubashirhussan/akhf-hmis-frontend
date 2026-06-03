"use client";

import { useState } from "react";
import { Input, Radio, Select } from "antd";
import HmisDobAgeField from "@/components/ui/HmisDobAgeField";
import HmisFloatingField from "@/components/ui/HmisFloatingField";
import HmisFormGrid from "@/components/ui/HmisFormGrid";
import HmisFormGridRow from "@/components/ui/HmisFormGridRow";
import { DOB_AGE_UNITS } from "@/lib/dob-from-age";
import { HMIS_FIELD_CONTROL_CLASS } from "@/lib/hmis-field-control";
import SearchServicesSection from "@/components/opd/SearchServicesSection";

const TITLE_OPTIONS = [
  { value: "mr", label: "Mr." },
  { value: "miss", label: "Miss" },
  { value: "mrs", label: "Mrs." },
  { value: "bo", label: "B/O" },
];

const RELATION_OPTIONS = [
  { value: "so", label: "S/O" },
  { value: "do", label: "D/O" },
  { value: "wo", label: "W/O" },
];

const GENDER_OPTIONS = [
  { value: "male", label: "Male" },
  { value: "female", label: "Female" },
  { value: "other", label: "Other" },
];

const RELIGION_OPTIONS = [
  { value: "islam", label: "Islam" },
  { value: "hindu", label: "Hindu" },
  { value: "christian", label: "Christian" },
  { value: "other", label: "Other" },
];

const DEPARTMENT_OPTIONS = [
  { value: "laboratory", label: "Laboratory" },
  { value: "private", label: "Private" },
  { value: "radiology", label: "Radiology" },
];

const CONSULTANT_OPTIONS = [
  { value: "abc", label: "Mr abc" },
  { value: "ali", label: "Mr Ali" },
  { value: "xyz", label: "Mr xyz" },
];

const CATEGORY_OPTIONS = [
  { value: "general", label: "General" },
  { value: "panel", label: "Panel" },
  { value: "b2b", label: "B2B LABS" },
];

const PATIENT_TYPE_OPTIONS = [
  { value: "opd", label: "OPD" },
  { value: "ipd", label: "IPD" },
];

const CHECKUP_TYPE_OPTIONS = [
  { value: "routine", label: "Routine" },
  { value: "emergency", label: "Emergency" },
];

const INSURER_OPTIONS = [
  { value: "ptcl", label: "PTCL" },
  { value: "ssp", label: "SSP" },
  { value: "state-life", label: "State Life" },
];

const DESIGNATION_OPTIONS = [{ value: "na", label: "N/A" }];

const LAB_OPTIONS = [
  { value: "chughtai", label: "Chughtai Lab" },
  { value: "excel", label: "Excel Lab" },
  { value: "dr-essa", label: "Dr. Essa Laboratory" },
  { value: "shaukat", label: "Shaukat Khanum Lab" },
];

const controlClass = HMIS_FIELD_CONTROL_CLASS;

export default function AddNewRecordTab({ formColumns = 4 }) {
  const [title, setTitle] = useState("mr");
  const [relation, setRelation] = useState("so");
  const [category, setCategory] = useState("panel");
  const [selectedLab, setSelectedLab] = useState(undefined);
  const [dobAge, setDobAge] = useState({ age: "", unit: DOB_AGE_UNITS.years, dob: null });

  const isB2bCategory = category === "b2b";

  const handleCategoryChange = (event) => {
    setCategory(event.target.value);
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
        <HmisFloatingField label="Title" variant="radios">
          <Radio.Group
            options={TITLE_OPTIONS}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="walk-in-add-record-radios"
          />
        </HmisFloatingField>

        <HmisFormGridRow columns={6}>
          <HmisFloatingField label="Full Name" htmlFor="full-name" col={1}>
            <Input
              id="full-name"
              size="middle"
              className={controlClass}
              placeholder="Enter Name"
            />
          </HmisFloatingField>

          <HmisFloatingField label="Last Name" htmlFor="last-name" col={1}>
            <Input
              id="last-name"
              size="middle"
              className={controlClass}
              placeholder="Enter Last Name"
            />
          </HmisFloatingField>

          <HmisFloatingField label="Contact #" htmlFor="contact" col={1}>
            <Input
              id="contact"
              size="middle"
              className={controlClass}
              placeholder="e.g 0356-2356858"
            />
          </HmisFloatingField>

          <HmisFloatingField label="CNIC #" htmlFor="cnic" col={1}>
            <Input
              id="cnic"
              size="middle"
              className={controlClass}
              placeholder="e.g 35262-3568845-5"
            />
          </HmisFloatingField>

          <HmisDobAgeField
            col={1}
            age={dobAge.age}
            unit={dobAge.unit}
            onChange={setDobAge}
          />

          <HmisFloatingField label="Gender" htmlFor="gender" col={1}>
            <Select
              id="gender"
              size="middle"
              className={`w-full ${controlClass}`}
              defaultValue="male"
              options={GENDER_OPTIONS}
            />
          </HmisFloatingField>
        </HmisFormGridRow>

        <HmisFloatingField label="Relation" variant="radios">
          <Radio.Group
            options={RELATION_OPTIONS}
            value={relation}
            onChange={(e) => setRelation(e.target.value)}
            className="walk-in-add-record-radios"
          />
        </HmisFloatingField>

        <HmisFloatingField label="First Name" htmlFor="guardian-first">
          <Input
            id="guardian-first"
            size="middle"
            className={controlClass}
            placeholder="Enter First Name"
          />
        </HmisFloatingField>

        <HmisFloatingField label="Last Name" htmlFor="guardian-last">
          <Input
            id="guardian-last"
            size="middle"
            className={controlClass}
            placeholder="Enter Last Name"
          />
        </HmisFloatingField>

        <HmisFloatingField label="Email" htmlFor="email">
          <Input
            id="email"
            size="middle"
            className={controlClass}
            type="email"
            placeholder="e.g abcd@gmail.com"
          />
        </HmisFloatingField>

        <HmisFloatingField label="Address" htmlFor="address">
          <Input
            id="address"
            size="middle"
            className={controlClass}
            placeholder="Enter Address"
          />
        </HmisFloatingField>

        <HmisFloatingField label="Religion" htmlFor="religion">
          <Select
            id="religion"
            size="middle"
            className={`w-full ${controlClass}`}
            defaultValue="islam"
            options={RELIGION_OPTIONS}
          />
        </HmisFloatingField>

        <HmisFloatingField label="Department" htmlFor="department">
          <Select
            id="department"
            size="middle"
            className={`w-full ${controlClass}`}
            defaultValue="laboratory"
            options={DEPARTMENT_OPTIONS}
          />
        </HmisFloatingField>

        <HmisFloatingField label="Consultant" htmlFor="consultant">
          <Select
            id="consultant"
            size="middle"
            className={`w-full ${controlClass}`}
            defaultValue="abc"
            options={CONSULTANT_OPTIONS}
          />
        </HmisFloatingField>

        <HmisFloatingField label="Refer Doctor" htmlFor="refer-doctor">
          <Input
            id="refer-doctor"
            size="middle"
            className={controlClass}
            placeholder="Enter Doc Name"
          />
        </HmisFloatingField>

        <HmisFloatingField label="Category" variant="radios">
          <Radio.Group
            options={CATEGORY_OPTIONS}
            value={category}
            onChange={handleCategoryChange}
            className="walk-in-add-record-radios"
          />
        </HmisFloatingField>

        <div className="walk-in-category-fields-row">
          {isB2bCategory ? (
            <HmisFloatingField label="Labs" htmlFor="lab" className="walk-in-category-field-slot">
              <Select
                id="lab"
                size="middle"
                className={`w-full ${controlClass}`}
                placeholder="Select LAB"
                value={selectedLab}
                onChange={setSelectedLab}
                options={LAB_OPTIONS}
                allowClear
              />
            </HmisFloatingField>
          ) : (
            <>
              <HmisFloatingField
                label="Patient Type"
                htmlFor="patient-type"
                className="walk-in-category-field-slot"
              >
                <Select
                  id="patient-type"
                  size="middle"
                  className={`w-full ${controlClass}`}
                  defaultValue="ipd"
                  options={PATIENT_TYPE_OPTIONS}
                />
              </HmisFloatingField>

              <HmisFloatingField
                label="Checkup Type"
                htmlFor="checkup-type"
                className="walk-in-category-field-slot"
              >
                <Select
                  id="checkup-type"
                  size="middle"
                  className={`w-full ${controlClass}`}
                  defaultValue="emergency"
                  options={CHECKUP_TYPE_OPTIONS}
                />
              </HmisFloatingField>

              <HmisFloatingField
                label="Insurer"
                htmlFor="insurer"
                className="walk-in-category-field-slot"
              >
                <Select
                  id="insurer"
                  size="middle"
                  className={`w-full ${controlClass}`}
                  defaultValue="ptcl"
                  options={INSURER_OPTIONS}
                />
              </HmisFloatingField>

              <HmisFloatingField
                label="Designation"
                htmlFor="designation"
                className="walk-in-category-field-slot"
              >
                <Select
                  id="designation"
                  size="middle"
                  className={`w-full ${controlClass}`}
                  defaultValue="na"
                  options={DESIGNATION_OPTIONS}
                />
              </HmisFloatingField>

              <HmisFloatingField
                label="Reference #"
                htmlFor="reference"
                className="walk-in-category-field-slot"
              >
                <Input
                  id="reference"
                  size="middle"
                  className={controlClass}
                  placeholder="Enter Reference No"
                />
              </HmisFloatingField>
            </>
          )}
        </div>
      </HmisFormGrid>

      <div className="walk-in-add-record-services">
        <SearchServicesSection />
      </div>
    </div>
  );
}
