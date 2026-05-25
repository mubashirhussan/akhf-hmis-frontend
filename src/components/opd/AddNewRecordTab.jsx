"use client";

import { useState } from "react";
import { Col, DatePicker, Input, Radio, Row, Select } from "antd";
import SearchServicesSection from "@/components/opd/SearchServicesSection";
import HmisCard from "@/components/ui/HmisCard";

const FORM_GUTTER = [20, 20];

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

const AGE_UNIT_OPTIONS = [
  { value: "years", label: "Years" },
  { value: "months", label: "Months" },
  { value: "days", label: "Days" },
];

const RELIGION_OPTIONS = [
  { value: "islam", label: "Islam" },
  { value: "hindu", label: "Hindu" },
  { value: "christian", label: "Christian" },
  { value: "other", label: "Other" },
];

const DEPARTMENT_OPTIONS = [
  { value: "", label: "Select Dept." },
  { value: "laboratory", label: "Laboratory" },
  { value: "private", label: "Private" },
  { value: "radiology", label: "Radiology" },
];

const CONSULTANT_OPTIONS = [
  { value: "", label: "Select Consultant" },
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
  { value: "", label: "Select Party" },
  { value: "ptcl", label: "PTCL" },
  { value: "ssp", label: "SSP" },
  { value: "state-life", label: "State Life" },
];

const DESIGNATION_OPTIONS = [{ value: "na", label: "N/A" }];

const controlClass = "walk-in-add-record-control";

function FormField({ label, htmlFor, children, className = "" }) {
  return (
    <div className={`walk-in-add-record-field ${className}`.trim()}>
      <label className="walk-in-add-record-label" htmlFor={htmlFor}>
        {label}
      </label>
      <div className="walk-in-add-record-control-wrap">{children}</div>
    </div>
  );
}

export default function AddNewRecordTab() {
  const [title, setTitle] = useState("mr");
  const [relation, setRelation] = useState("so");
  const [category, setCategory] = useState("panel");

  return (
    <HmisCard className="walk-in-add-record-layout border-tl-none">
      <Row gutter={[32, 24]} align="stretch" className="walk-in-add-record-row">
        <Col xs={24} xl={12} className="walk-in-add-record-form-col">
          <form
            className="walk-in-add-record-form"
            onSubmit={(e) => e.preventDefault()}
          >
            {/* Row 1: Title */}
            <Row gutter={FORM_GUTTER} className="walk-in-add-record-form-row">
              <Col xs={24}>
                <FormField label="Title">
                  <Radio.Group
                    options={TITLE_OPTIONS}
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="walk-in-add-record-radios"
                  />
                </FormField>
              </Col>
            </Row>

            {/* Row 2: Full name, Last name, Contact */}
            <Row gutter={FORM_GUTTER} className="walk-in-add-record-form-row">
              <Col xs={24} sm={8}>
                <FormField label="Full Name" htmlFor="full-name">
                  <Input
                    id="full-name"
                    className={controlClass}
                    placeholder="Enter Name"
                  />
                </FormField>
              </Col>
              <Col xs={24} sm={8}>
                <FormField label="Last Name" htmlFor="last-name">
                  <Input
                    id="last-name"
                    className={controlClass}
                    placeholder="Enter Last Name"
                  />
                </FormField>
              </Col>
              <Col xs={24} sm={8}>
                <FormField label="Contact #" htmlFor="contact">
                  <Input
                    id="contact"
                    className={controlClass}
                    placeholder="e.g 0356-2356858"
                  />
                </FormField>
              </Col>
            </Row>

            {/* Row 3: CNIC, DOB, Gender */}
            <Row gutter={FORM_GUTTER} className="walk-in-add-record-form-row">
              <Col xs={24} sm={8}>
                <FormField label="CNIC #" htmlFor="cnic">
                  <Input
                    id="cnic"
                    className={controlClass}
                    placeholder="e.g 35262-3568845-5"
                  />
                </FormField>
              </Col>
              <Col xs={24} sm={8}>
                <FormField label="DOB">
                  <div className="walk-in-dob-group">
                    <DatePicker
                      className={`walk-in-dob-date ${controlClass}`}
                      format="DD/MM/YYYY"
                      placeholder="DD/MM/YYYY"
                    />
                    <Input
                      className={`walk-in-dob-age ${controlClass}`}
                      placeholder="22"
                    />
                    <Select
                      className={`walk-in-dob-unit ${controlClass}`}
                      defaultValue="years"
                      options={AGE_UNIT_OPTIONS}
                    />
                  </div>
                </FormField>
              </Col>
              <Col xs={24} sm={8}>
                <FormField label="Gender" htmlFor="gender">
                  <Select
                    id="gender"
                    className={`w-full ${controlClass}`}
                    defaultValue="male"
                    options={GENDER_OPTIONS}
                  />
                </FormField>
              </Col>
            </Row>

            {/* Row 4: Relation */}
            <Row gutter={FORM_GUTTER} className="walk-in-add-record-form-row">
              <Col xs={24}>
                <FormField label="Relation">
                  <Radio.Group
                    options={RELATION_OPTIONS}
                    value={relation}
                    onChange={(e) => setRelation(e.target.value)}
                    className="walk-in-add-record-radios"
                  />
                </FormField>
              </Col>
            </Row>

            {/* Row 5: First name, Last name, Email */}
            <Row gutter={FORM_GUTTER} className="walk-in-add-record-form-row">
              <Col xs={24} sm={8}>
                <FormField label="First Name" htmlFor="guardian-first">
                  <Input
                    id="guardian-first"
                    className={controlClass}
                    placeholder="Enter First Name"
                  />
                </FormField>
              </Col>
              <Col xs={24} sm={8}>
                <FormField label="Last Name" htmlFor="guardian-last">
                  <Input
                    id="guardian-last"
                    className={controlClass}
                    placeholder="Enter Last Name"
                  />
                </FormField>
              </Col>
              <Col xs={24} sm={8}>
                <FormField label="Email" htmlFor="email">
                  <Input
                    id="email"
                    className={controlClass}
                    type="email"
                    placeholder="e.g abcd@gmail.com"
                  />
                </FormField>
              </Col>
            </Row>

            {/* Row 6: Address, Religion */}
            <Row gutter={FORM_GUTTER} className="walk-in-add-record-form-row">
              <Col xs={24} sm={12}>
                <FormField label="Address" htmlFor="address">
                  <Input
                    id="address"
                    className={controlClass}
                    placeholder="Enter Address"
                  />
                </FormField>
              </Col>
              <Col xs={24} sm={12}>
                <FormField label="Religion" htmlFor="religion">
                  <Select
                    id="religion"
                    className={`w-full ${controlClass}`}
                    defaultValue="islam"
                    options={RELIGION_OPTIONS}
                  />
                </FormField>
              </Col>
            </Row>

            {/* Row 7: Department, Consultant, Refer doctor */}
            <Row gutter={FORM_GUTTER} className="walk-in-add-record-form-row">
              <Col xs={24} sm={8}>
                <FormField label="Department" htmlFor="department">
                  <Select
                    id="department"
                    className={`w-full ${controlClass}`}
                    defaultValue="laboratory"
                    options={DEPARTMENT_OPTIONS}
                  />
                </FormField>
              </Col>
              <Col xs={24} sm={8}>
                <FormField label="Consultant" htmlFor="consultant">
                  <Select
                    id="consultant"
                    className={`w-full ${controlClass}`}
                    defaultValue="abc"
                    options={CONSULTANT_OPTIONS}
                  />
                </FormField>
              </Col>
              <Col xs={24} sm={8}>
                <FormField label="Refer Doctor" htmlFor="refer-doctor">
                  <Input
                    id="refer-doctor"
                    className={controlClass}
                    placeholder="Enter Doc Name"
                  />
                </FormField>
              </Col>
            </Row>

            {/* Row 8: Category, Patient type, Checkup type */}
            <Row
              gutter={FORM_GUTTER}
              align="bottom"
              className="walk-in-add-record-form-row"
            >
              <Col xs={24} sm={8}>
                <FormField label="Category">
                  <Radio.Group
                    options={CATEGORY_OPTIONS}
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="walk-in-add-record-radios"
                  />
                </FormField>
              </Col>
              <Col xs={24} sm={8}>
                <FormField label="Patient Type" htmlFor="patient-type">
                  <Select
                    id="patient-type"
                    className={`w-full ${controlClass}`}
                    defaultValue="ipd"
                    options={PATIENT_TYPE_OPTIONS}
                  />
                </FormField>
              </Col>
              <Col xs={24} sm={8}>
                <FormField label="Checkup Type" htmlFor="checkup-type">
                  <Select
                    id="checkup-type"
                    className={`w-full ${controlClass}`}
                    defaultValue="emergency"
                    options={CHECKUP_TYPE_OPTIONS}
                  />
                </FormField>
              </Col>
            </Row>

            {/* Row 9: Insurer, Designation, Reference */}
            <Row gutter={FORM_GUTTER} className="walk-in-add-record-form-row">
              <Col xs={24} sm={8}>
                <FormField label="Insurer" htmlFor="insurer">
                  <Select
                    id="insurer"
                    className={`w-full ${controlClass}`}
                    defaultValue="ptcl"
                    options={INSURER_OPTIONS}
                  />
                </FormField>
              </Col>
              <Col xs={24} sm={8}>
                <FormField label="Designation" htmlFor="designation">
                  <Select
                    id="designation"
                    className={`w-full ${controlClass}`}
                    defaultValue="na"
                    options={DESIGNATION_OPTIONS}
                  />
                </FormField>
              </Col>
              <Col xs={24} sm={8}>
                <FormField label="Reference #" htmlFor="reference">
                  <Input
                    id="reference"
                    className={controlClass}
                    placeholder="Enter Reference No"
                  />
                </FormField>
              </Col>
            </Row>
          </form>
        </Col>

        <Col xs={24} xl={12} className="walk-in-add-record-services-col">
          <SearchServicesSection variant="sidebar" />
        </Col>
      </Row>
    </HmisCard>
  );
}
