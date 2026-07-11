'use client';

import { useState } from 'react';
import { App, Form } from 'antd';
import DynamicForm from '@/components/form/DynamicForm';
import SearchServicesSection from '@/features/opd/components/SearchServicesSection';
import {
  useGetGendersQuery,
  useGetReligionsQuery,
  useGetConsultantsQuery,
  useGetOpdDesignationsQuery,
  useRegisterPatientWithVisitMutation,
} from '@/features/opd/api/opdEndpoints';
import {
  WALK_IN_INITIAL_VALUES,
  WALK_IN_CATEGORY_FIELDS,
  WALK_IN_B2B_FIELDS,
  buildWalkInBaseFields,
  buildWalkInVisitFields,
  buildWalkInPanelFields,
} from '@/features/opd/pages/walk-in-patient/walk-in-patient-fields';

export default function AddNewRecordTab() {
  const { message } = App.useApp();
  const [form] = Form.useForm();
  const category = Form.useWatch('category', form);
  const [addedServices, setAddedServices] = useState([]);

  const { data: genderOptions = [] } = useGetGendersQuery();
  const { data: religionOptions = [] } = useGetReligionsQuery();
  const { data: consultantOptions = [] } = useGetConsultantsQuery();
  const { data: designationOptions = [] } = useGetOpdDesignationsQuery();

  const [registerPatient, { isLoading: isSaving }] = useRegisterPatientWithVisitMutation();

  const isB2b = category === 'b2b';
  const isPanel = category !== 'general' && category !== 'b2b';

  const walkInBaseFields = buildWalkInBaseFields({ genderOptions, religionOptions });
  const walkInVisitFields = buildWalkInVisitFields({ consultantOptions });
  const walkInPanelFields = buildWalkInPanelFields({ designationOptions });

  const handleSave = async () => {
    try {
      await form.validateFields();
    } catch {
      message.error('Please fill in all required fields.');
      return;
    }

    const values = form.getFieldsValue(true);
    const now = new Date().toISOString();
    const dobAge = values.dobAge ?? {};

    const firstServiceAmount = addedServices.length > 0 ? addedServices[0].price : 0;
    const totalAmount = addedServices.reduce(
      (sum, row) => sum + row.price * row.quantity - row.discount,
      0,
    );

    const payload = {
      prefix: values.title ?? null,
      pfName: values.firstName ?? null,
      pmName: null,
      plName: values.lastName ?? null,
      relation: values.relation ?? null,
      rfName: values.relationFirstName ?? null,
      rmName: null,
      rlName: values.relationLastName ?? null,
      sexID: typeof values.gender === 'number' ? values.gender : 0,
      age: dobAge.age ? Number(dobAge.age) : 0,
      regDateTime: now,
      countryCode: 0,
      provinceID: 0,
      districtID: 0,
      tehsil: 0,
      zipcode: 0,
      house_No: null,
      streetAddress: values.address ?? null,
      city: null,
      colony: null,
      homePhone: null,
      mobilePhone: values.contactNo ?? null,
      nic: values.cnic ?? null,
      dateOfBirth: dobAge.dob ? String(dobAge.dob) : null,
      regNo: null,
      dateTime: now,
      deptID: 0,
      empID: typeof values.consultant === 'number' ? values.consultant : 0,
      diagonosis: null,
      patientType: values.patientType ?? null,
      ageType: dobAge.unit ?? null,
      referFrom: values.referDoctor ?? null,
      to_sub_Dept: 0,
      patient_Type: values.patientType ?? null,
      pt_Cast: null,
      payment_Status: null,
      passport_No: null,
      email_address: values.email ?? null,
      doctorID: typeof values.consultant === 'number' ? values.consultant : 0,
      religion: typeof values.religion === 'number' ? values.religion : 0,
      nationality: 0,
      party_ID: 0,
      party_Desg_ID: typeof values.designation === 'number' ? values.designation : 0,
      registrationType: values.category ?? null,
      emp_No: null,
      room_No: null,
      s_ID: addedServices.length > 0 ? addedServices[0].serviceId : 0,
      amount: firstServiceAmount,
      panelAmounts: totalAmount,
      hospital_Id: 0,
      emp_DeptId: 0,
      emp_SubDeptId: 0,
      patient_Type_Id: 0,
      referenceNo: values.referenceNo ? Number(values.referenceNo) : 0,
      doctor_Subdept_Id: 0,
      checkupType: values.checkupType ?? null,
    };

    try {
      const result = await registerPatient(payload).unwrap();
      if (result?.success) {
        message.success('Patient registered successfully.');
        form.resetFields();
        setAddedServices([]);
      } else {
        message.error(result?.message ?? 'Registration failed. Please try again.');
      }
    } catch {
      message.error('Registration failed. Please try again.');
    }
  };

  const handleCancel = () => {
    form.resetFields();
    setAddedServices([]);
  };

  return (
    <div className="walk-in-add-record-layout mt-2">
      <Form
        form={form}
        name="walk-in-add"
        layout="vertical"
        className="walk-in-add-record-form"
        requiredMark={false}
        initialValues={WALK_IN_INITIAL_VALUES}
      >
        <DynamicForm fields={walkInBaseFields} gutter={[16, 12]} />
        <DynamicForm fields={walkInVisitFields} gutter={[16, 12]} />
        <DynamicForm fields={WALK_IN_CATEGORY_FIELDS} gutter={[16, 12]} />
        {isPanel && <DynamicForm fields={walkInPanelFields} gutter={[16, 12]} />}
        {isB2b && <DynamicForm fields={WALK_IN_B2B_FIELDS} gutter={[16, 12]} />}
      </Form>

      <div className="walk-in-add-record-services">
        <SearchServicesSection
          addedServices={addedServices}
          onAddedServicesChange={setAddedServices}
          consultantOptions={consultantOptions}
          onSave={handleSave}
          onCancel={handleCancel}
          isSaving={isSaving}
        />
      </div>
    </div>
  );
}