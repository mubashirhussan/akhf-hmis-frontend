"use client";

import { Form, Input, Select, Button } from "antd";
import AppIcon from "@/components/icons/AppIcon";
import { FIELD_CONTROL_CLASS } from "@/lib/field-control";
import FormGrid from "@/components/ui/FormGrid";
import FormFloatingField from "@/components/ui/FormFloatingField";
import { FormFieldPrefixProvider } from "@/components/ui/FormFieldPrefixContext";
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

const DOCTOR_OPTIONS = [
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
  doctor: "emergency",
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
        <FormFieldPrefixProvider prefix="emergency-reg">
        <div className="bg-white rounded-lg border border-gray-200 px-5 py-4 mb-4">
          <div className="flex items-end gap-4">
            <div className="flex-1">
              <FormGrid columns={5}>
                <FormFloatingField name="regNo" label="Reg No">
                  <Input
                    className={ctrl}
                    placeholder="Enter Registration Number"
                  />
                </FormFloatingField>

                <FormFloatingField name="visit" label="Visit #">
                  <Input className={ctrl} placeholder="Enter Visit Number" />
                </FormFloatingField>

                <Button
                  icon={<AppIcon icon="material-symbols:search" className="h-[1.5em] w-[1.5em]" />}
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

        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="bg-[#026BB1] text-white flex items-center gap-2 px-5 py-2.5">
            <AppIcon icon="solar:user-bold" className="h-[1.25em] w-[1.25em] text-base" />
            <span className="text-sm font-semibold tracking-wide">
              Patient Information
            </span>
          </div>

          <div className="px-5 py-5">
            <FormGrid columns={4}>
              <FormFloatingField
                name="firstName"
                label="First Name"
                required
                rules={requiredRule("First name is required")}
                validateTrigger={["onChange", "onSubmit"]}
              >
                <Input className={ctrl} placeholder="Enter First Name" />
              </FormFloatingField>

              <FormFloatingField name="relation" label="Relation">
                <Select className={ctrl} options={RELATION_OPTIONS} />
              </FormFloatingField>

              <FormFloatingField
                name="relationFirstName"
                label="Relation First Name"
              >
                <Input className={ctrl} placeholder="Enter First Name" />
              </FormFloatingField>

              <FormFloatingField name="admitBy" label="Admit By">
                <Input className={ctrl} placeholder="Enter Name" />
              </FormFloatingField>

              <FormFloatingField
                name="dobAge"
                label="DOB / Age"
                required
                rules={dobAgeRules}
                validateTrigger={["onChange", "onSubmit"]}
              >
                <DobAgeFormControl />
              </FormFloatingField>

              <FormFloatingField
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
              </FormFloatingField>

              <FormFloatingField name="mobile" label="Mobile #">
                <Input className={ctrl} placeholder="Enter Mobile Number" />
              </FormFloatingField>

              <FormFloatingField name="address" label="Address">
                <Input className={ctrl} placeholder="Enter Address here..." />
              </FormFloatingField>

              <FormFloatingField name="department" label="Department">
                <Select className={ctrl} options={DEPARTMENT_OPTIONS} />
              </FormFloatingField>

              <FormFloatingField name="doctor" label="Doctor">
                <Select className={ctrl} options={DOCTOR_OPTIONS} />
              </FormFloatingField>

              <FormFloatingField name="arrivalStatus" label="Arrival Status">
                <Select className={ctrl} options={ARRIVAL_STATUS_OPTIONS} />
              </FormFloatingField>

              <FormFloatingField
                name="patientCondition"
                label="Patient Condition"
              >
                <Select className={ctrl} options={PATIENT_CONDITION_OPTIONS} />
              </FormFloatingField>

              <FormFloatingField
                name="admittedDiagnosis"
                label="Admitted Diagnosis"
                col={2}
              >
                <Input.TextArea
                  className={` pl-4! pt-3! ${ctrl}`}
                  placeholder="Enter here..." rows={3}
                />
              </FormFloatingField>
            </FormGrid>
          </div>
        </div>

        <div className="flex justify-end gap-4 mt-6">
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
        </FormFieldPrefixProvider>
      </Form>
    </div>
  );
}
