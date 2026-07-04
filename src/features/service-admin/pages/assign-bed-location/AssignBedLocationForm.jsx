'use client';

import { Input, InputNumber, Select } from 'antd';
import FormField from '@/components/ui/FormField';
import FormGrid from '@/components/ui/FormGrid';
import { FIELD_CONTROL_CLASS } from '@/lib/field-control';

const controlClass = FIELD_CONTROL_CLASS;

export default function AssignBedLocationForm({
  form,
  errors = {},
  onPatchForm,
  onClearError,
  wardOptions = [],     
  roomOptions = [],     
  bedOptions = [],        
  isEditMode = false,    
}) {
  const fieldId = (name) => `assign-bed-location-${name}`;

  return (
    <FormGrid columns={1} className="assign-bed-location-form-grid">
      <FormField label="Ward Name" required error={errors?.wardBedId}>
        <Select
          id={fieldId('ward')}
          className={controlClass}
          status={errors?.wardBedId ? 'error' : ''}
          value={form.wardBedId || undefined}
          options={wardOptions}
          showSearch
          optionFilterProp="label"
          placeholder="Select Ward"
          disabled={isEditMode}
          onChange={(val) => {
            onPatchForm({ wardBedId: val, roomNumber: '', bedNumber: '' });
            onClearError?.('wardBedId');
            onClearError?.('roomNumber');
            onClearError?.('bedNumber');
          }}
        />
      </FormField>

      <FormField label="Room Number" required error={errors?.roomNumber}>
        <Select
          id={fieldId('room')}
          className={controlClass}
          status={errors?.roomNumber ? 'error' : ''}
          value={form.roomNumber || undefined}
          options={roomOptions}
          placeholder={form.wardBedId ? 'Select Room' : 'Select a ward first'}
          disabled={!form.wardBedId || isEditMode}
          onChange={(val) => {
            onPatchForm({ roomNumber: val, bedNumber: '' });
            onClearError?.('roomNumber');
            onClearError?.('bedNumber');
          }}
        />
      </FormField>

      <FormField label="Bed Number" required error={errors?.bedNumber}>
        <Select
          id={fieldId('bed')}
          className={controlClass}
          status={errors?.bedNumber ? 'error' : ''}
          value={form.bedNumber || undefined}
          options={bedOptions}
          placeholder={form.roomNumber ? 'Select Bed' : 'Select a room first'}
          disabled={!form.roomNumber || isEditMode}
          onChange={(val) => {
            onPatchForm({ bedNumber: val });
            onClearError?.('bedNumber');
          }}
        />
      </FormField>

      <FormField label="Location" required error={errors?.location}>
        <Input
          id={fieldId('location')}
          className={controlClass}
          status={errors?.location ? 'error' : ''}
          value={form.location}
          placeholder="e.g. Block A, Row 2"
          onChange={(e) => {
            onPatchForm({ location: e.target.value });
            onClearError?.('location');
          }}
        />
      </FormField>

      <FormField label="Price" required error={errors?.price}>
        <InputNumber
          id={fieldId('price')}
          className={controlClass}
          status={errors?.price ? 'error' : ''}
          value={form.price}
          min={0}
          placeholder="Enter Price"
          onChange={(val) => {
            onPatchForm({ price: val ?? null });
            onClearError?.('price');
          }}
        />
      </FormField>
    </FormGrid>
  );
}