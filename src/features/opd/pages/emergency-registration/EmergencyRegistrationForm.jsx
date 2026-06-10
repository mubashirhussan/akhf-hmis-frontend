"use client";

import { Form, Input, Select, Button } from "antd";
import UserBoldIcon from "@iconify-react/solar/user-bold";
import SearchIcon from "@iconify-react/material-symbols/search";
import { FIELD_CONTROL_CLASS } from "@/lib/field-control";
import FormGrid from "@/components/ui/FormGrid";
import EmergencyRegField from "@/features/opd/components/EmergencyRegField";
import { DOB_AGE_UNITS } from "@/lib/dob-from-age";
import DobAgeField from "@/components/ui/DobAgeField";

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

const ARRIVAL_STATUS_OPTIONS = [
  { value: "ambulatory", label: "Ambulatory" },
  { value: "stretcher", label: "Stretcher" },
  { value: "wheelChair", label: "Wheel Chair" },
  { value: "bed", label: "Bed" },
];

const PATIENT_CONDITION_OPTIONS = [
  { value: "stable", label: "Stable" },
  { value: "serious", label: "Serious" },
  { value: "critical", label: "Critical" },
  { value: "broughtDead", label: "Brought Dead" },
];

const DEPARTMENT_OPTIONS = [
  { value: "emergency", label: "Emergency" },
  { value: "icu", label: "ICU" },
  { value: "opd", label: "OPD" },
  { value: "ward", label: "Ward" },
];

const DEPARTMENT_TYPE_OPTIONS = [
  { value: "emergency", label: "Emergency" },
  { value: "general", label: "General" },
  { value: "surgical", label: "Surgical" },
];

const initialValues = {
  relation: "so",
  dobAge: { age: "", unit: DOB_AGE_UNITS.years, dob: null },
  arrivalStatus: "ambulatory",
  patientCondition: "stable",
  department: "emergency",
  departmentType: "emergency",
};

const requiredRule = (msg) => [
  { required: true, whitespace: true, message: msg },
];

const dobAgeValidator = (_, value) => {
  const age = value?.age?.trim?.() ?? "";
  if (!age || Number(age) <= 0) {
    return Promise.reject(new Error("Age is required"));
  }
  return Promise.resolve();
};

const dobAgeRules = [
  { validator: dobAgeValidator, validateTrigger: ["onChange", "onSubmit"] },
];

function DobAgeFormControl({ value, onChange }) {
  return (
    <DobAgeField
      embedded
      className="patient-reg-dob-age"
      age={value?.age ?? ""}
      unit={value?.unit ?? DOB_AGE_UNITS.years}
      onChange={onChange}
    />
  );
}

const ctrl = FIELD_CONTROL_CLASS;

export default function EmergencyRegistrationForm() {
  const [form] = Form.useForm();

  return (
    <div className="min-h-screen p-6">
      <Form form={form} initialValues={initialValues} layout="vertical">
        <div className="bg-white rounded-lg shadow-sm px-5 py-4 mb-4">
          <div className="flex items-end gap-4">
            <div className="flex-1">
              <FormGrid columns={5}>
                <EmergencyRegField name="regNo" label="Reg No">
                  <Input
                    className={ctrl}
                    placeholder="Enter Registration Number"
                  />
                </EmergencyRegField>

                <EmergencyRegField name="visit" label="Visit #">
                  <Input className={ctrl} placeholder="Enter Visit Number" />
                </EmergencyRegField>

                <Button
                  icon={<SearchIcon height="1.5em" />}
                  className="!bg-[#026BB1] !border-[#026BB1] !text-white !rounded-md !h-7.75 w-24 relative top-1.75 !font-medium text-sm! shrink-0 mb-[1px]"
                  onClick={() =>
                    console.log(
                      "search",
                      form.getFieldsValue(["regNo", "visit"]),
                    )
                  }
                >
                  Search
                </Button>
              </FormGrid>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="bg-[#026BB1] text-white flex items-center gap-2 px-5 py-2.5">
            <UserBoldIcon className="text-base" height="1.25em" />
            <span className="text-sm font-semibold tracking-wide">
              Patient Information
            </span>
          </div>

          <div className="px-5 py-5">
            <FormGrid columns={4}>
              <EmergencyRegField
                name="firstName"
                label="First Name"
                required
                rules={requiredRule("First name is required")}
                validateTrigger={["onChange", "onSubmit"]}
              >
                <Input className={ctrl} placeholder="Enter First Name" />
              </EmergencyRegField>

              <EmergencyRegField name="relation" label="Relation">
                <Select className={ctrl} options={RELATION_OPTIONS} />
              </EmergencyRegField>

              <EmergencyRegField
                name="relationFirstName"
                label="Relation First Name"
              >
                <Input className={ctrl} placeholder="Enter First Name" />
              </EmergencyRegField>

              <EmergencyRegField name="admitBy" label="Admit By">
                <Input className={ctrl} placeholder="Enter Name" />
              </EmergencyRegField>

              <EmergencyRegField
                name="dobAge"
                label="DOB / Age"
                required
                rules={dobAgeRules}
                validateTrigger={["onChange", "onSubmit"]}
              >
                <DobAgeFormControl />
              </EmergencyRegField>

              <EmergencyRegField
                name="patientGender"
                label="Patient Gender"
                required
                rules={requiredRule("Gender is required")}
                validateTrigger={["onChange", "onSubmit"]}
              >
                <Select
                  className={ctrl}
                  placeholder="Gender"
                  options={GENDER_OPTIONS}
                />
              </EmergencyRegField>

              <EmergencyRegField name="mobile" label="Mobile #">
                <Input className={ctrl} placeholder="Enter Mobile Number" />
              </EmergencyRegField>

              <EmergencyRegField name="address" label="Address">
                <Input className={ctrl} placeholder="Enter Address here..." />
              </EmergencyRegField>

              <EmergencyRegField name="department" label="Department">
                <Select className={ctrl} options={DEPARTMENT_OPTIONS} />
              </EmergencyRegField>

              <EmergencyRegField name="departmentType" label="Department Type">
                <Select className={ctrl} options={DEPARTMENT_TYPE_OPTIONS} />
              </EmergencyRegField>

              <EmergencyRegField name="arrivalStatus" label="Arrival Status">
                <Select className={ctrl} options={ARRIVAL_STATUS_OPTIONS} />
              </EmergencyRegField>

              <EmergencyRegField
                name="patientCondition"
                label="Patient Condition"
              >
                <Select className={ctrl} options={PATIENT_CONDITION_OPTIONS} />
              </EmergencyRegField>

              <EmergencyRegField
                name="admittedDiagnosis"
                label="Admitted Diagnosis"
                col="full"
              >
                <Input.TextArea
                  className={`h-40!  pl-4! pt-3! ${ctrl}`}
                  placeholder="Enter here..."
                />
              </EmergencyRegField>
            </FormGrid>
          </div>
        </div>

        <div className="flex justify-center gap-4 mt-6">
          <Button
            onClick={() => form.resetFields()}
            className="!border-[#026BB1] !text-[#026BB1] !bg-white !rounded-md !h-10.5 !px-8 !font-medium !text-sm"
          >
            Clear
          </Button>
          <Button
            onClick={() => form.submit()}
            className="!bg-[#026BB1] !border-[#026BB1] !text-white !rounded-md !h-10.5 !px-8 !font-medium !text-sm"
          >
            Register
          </Button>
        </div>
      </Form>
    </div>
  );
}
