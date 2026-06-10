'use client';

import { SearchOutlined } from '@ant-design/icons';
import { Button, Input, Select } from 'antd';
import DateRangeField from '@/components/ui/DateRangeField';
import DobAgeField from '@/components/ui/DobAgeField';
import FloatingField from '@/components/ui/FloatingField';
import FormGrid from '@/components/ui/FormGrid';
import {
  CENTER_TYPE_OPTIONS,
  LABORATORY_PATIENT_TYPE_OPTIONS,
  LABORATORY_SEND_OUT_OPTIONS,
  LABORATORY_STATUS_OPTIONS,
  LABORATORY_TEST_GROUP_OPTIONS,
  LABORATORY_TEST_NAME_OPTIONS,
} from '@/features/laboratory/api/mock-laboratory-worklist';
import { FIELD_CONTROL_CLASS } from '@/lib/field-control';

const controlClass = FIELD_CONTROL_CLASS;

export default function CollectionFilterForm({ idPrefix, filters, onPatchFilter, onSubmit }) {
  const fieldId = (name) => `${idPrefix}-${name}`;

  return (
    <div className="walk-in-add-record-layout services-billing-search-layout">
      <FormGrid
        as="form"
        columns={4}
        className="walk-in-add-record-form"
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit();
        }}
      >
           <FloatingField label="First Name" htmlFor={fieldId('first-name')}>
          <Input
            id={fieldId('first-name')}
            className={controlClass}
            value={filters.firstName}
            onChange={(e) => onPatchFilter({ firstName: e.target.value })}
            autoComplete="off"
          />
        </FloatingField>
         <FloatingField label="MR #" htmlFor={fieldId('mr-no')}>
          <Input
            id={fieldId('mr-no')}
            className={controlClass}
            value={filters.mrNo}
            onChange={(e) => onPatchFilter({ mrNo: e.target.value })}
            autoComplete="off"
          />
        </FloatingField>
     

      

      
  
       

        
      
 
        <FloatingField label="DOB" htmlFor={fieldId('dob-age')}>
          <DobAgeField
            embedded
            className="patient-reg-dob-age"
            ageInputId={fieldId('dob-age')}
            age={filters.patientAge}
            unit={filters.ageUnit}
            onChange={({ age, unit }) => onPatchFilter({ patientAge: age, ageUnit: unit })}
          />
        </FloatingField>
       <FloatingField label="Status" htmlFor={fieldId('status')}>
          <Select
            id={fieldId('status')}
            className={controlClass}
            value={filters.status}
            options={LABORATORY_STATUS_OPTIONS}
            onChange={(status) => onPatchFilter({ status })}
          />
        </FloatingField>
  <FloatingField label="Last Name" htmlFor={fieldId('last-name')}>
          <Input
            id={fieldId('last-name')}
            className={controlClass}
            value={filters.lastName}
            onChange={(e) => onPatchFilter({ lastName: e.target.value })}
            autoComplete="off"
          />
        </FloatingField>
       <FloatingField label="Visit #" htmlFor={fieldId('visit-no')}>
          <Input
            id={fieldId('visit-no')}
            className={controlClass}
            value={filters.visitNo}
            onChange={(e) => onPatchFilter({ visitNo: e.target.value })}
            autoComplete="off"
          />
        </FloatingField>
   <FloatingField label="From - To Date" htmlFor={fieldId('date-range')}>
          <DateRangeField
            id={fieldId('date-range')}
            value={filters.dateRange}
            onChange={(dateRange) => onPatchFilter({ dateRange })}
          />
        </FloatingField>
       

          <FloatingField label="Center" htmlFor={fieldId('department-type')}>
          <Select
            id={fieldId('department-type')}
            className={controlClass}
            value={filters.departmentType}
            options={CENTER_TYPE_OPTIONS}
            onChange={(departmentType) => onPatchFilter({ departmentType })}
          />
        </FloatingField>
       

        
     
  <FloatingField label="CNIC #" htmlFor={fieldId('cnic')}>
          <Input
            id={fieldId('cnic')}
            className={controlClass}
            value={filters.cnic}
            onChange={(e) => onPatchFilter({ cnic: e.target.value })}
            autoComplete="off"
          />
        </FloatingField>
        
        <FloatingField label="Lab #" htmlFor={fieldId('lab-no')}>
          <Input
            id={fieldId('lab-no')}
            className={controlClass}
            value={filters.labNo}
            onChange={(e) => onPatchFilter({ labNo: e.target.value })}
            autoComplete="off"
          />
        </FloatingField>

        <FloatingField label="Test Group" htmlFor={fieldId('test-group')}>
          <Select
            id={fieldId('test-group')}
            className={controlClass}
            value={filters.testGroup}
            options={LABORATORY_TEST_GROUP_OPTIONS}
            onChange={(testGroup) => onPatchFilter({ testGroup })}
          />
        </FloatingField>

        <FloatingField label="Patient Type" htmlFor={fieldId('patient-type')}>
          <Select
            id={fieldId('patient-type')}
            className={controlClass}
            value={filters.patientType}
            options={LABORATORY_PATIENT_TYPE_OPTIONS}
            onChange={(patientType) => onPatchFilter({ patientType })}
          />
        </FloatingField>
 <FloatingField label="Mobile #" htmlFor={fieldId('mobile')}>
          <Input
            id={fieldId('mobile')}
            className={controlClass}
            value={filters.mobile}
            onChange={(e) => onPatchFilter({ mobile: e.target.value })}
            autoComplete="off"
          />
        </FloatingField>
         <FloatingField label="Reference #" htmlFor={fieldId('reference')}>
          <Input
            id={fieldId('reference')}
            className={controlClass}
            value={filters.referenceNo}
            onChange={(e) => onPatchFilter({ referenceNo: e.target.value })}
            autoComplete="off"
          />
        </FloatingField>
        <FloatingField label="Test Name" htmlFor={fieldId('test-name')}>
          <Input
            id={fieldId('test-name')}
            className={controlClass}
            value={filters.testNameText}
            onChange={(e) => onPatchFilter({ testNameText: e.target.value })}
            autoComplete="off"
          />
        </FloatingField>

        <FloatingField label="Send Out" htmlFor={fieldId('send-out')}>
          <Select
            id={fieldId('send-out')}
            className={controlClass}
            value={filters.sendOut}
            options={LABORATORY_SEND_OUT_OPTIONS}
            onChange={(sendOut) => onPatchFilter({ sendOut })}
          />
        </FloatingField>

       

        <div className="services-billing-search-actions">
          <Button
            type="primary"
            htmlType="submit"
            icon={<SearchOutlined />}
            className="walk-in-search-btn services-billing-search-btn"
          >
            Search
          </Button>
        </div>
      </FormGrid>
    </div>
  );
}
