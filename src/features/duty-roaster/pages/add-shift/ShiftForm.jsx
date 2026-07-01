'use client';

import { Input, Select, TimePicker } from 'antd';
import dayjs from 'dayjs';
import FormField from '@/components/ui/FormField';
import FormGrid from '@/components/ui/FormGrid';
import { FIELD_CONTROL_CLASS } from '@/lib/field-control';
import { RELAXATION_TIME_OPTIONS } from '@/features/duty-roaster/api/mock-shifts';

const controlClass = FIELD_CONTROL_CLASS;

function parseTime(value) {
  if (!value) return null;
  const parsed = dayjs(value, 'HH:mm');
  return parsed.isValid() ? parsed : null;
}

export default function ShiftForm({ form, errors = {}, onPatchForm, onClearError }) {
  const fieldId = (name) => `shift-${name}`;

  return (
    <FormGrid columns={2} className="shift-form-grid">
      <FormField label="Shift Name" required error={errors?.shiftName}>
        <Input
          id={fieldId('shiftName')}
          className={controlClass}
          value={form.shiftName}
          status={errors?.shiftName ? 'error' : ''}
          onChange={(e) => {
            onPatchForm({ shiftName: e.target.value });
            onClearError?.('shiftName');
          }}
          autoComplete="off"
        />
      </FormField>

      <FormField label="Shift Description" className="form-grid-row" error={errors?.shiftDescription}>
        <Input
          id={fieldId('shiftDescription')}
          className={controlClass}
          value={form.shiftDescription}
          status={errors?.shiftDescription ? 'error' : ''}
          onChange={(e) => {
            onPatchForm({ shiftDescription: e.target.value });
            onClearError?.('shiftDescription');
          }}
          autoComplete="off"
        />
      </FormField>

      <FormField label="Abbreviation" required error={errors?.abbreviation}>
        <Input
          id={fieldId('abbreviation')}
          className={controlClass}
          value={form.abbreviation}
          status={errors?.abbreviation ? 'error' : ''}
          onChange={(e) => {
            onPatchForm({ abbreviation: e.target.value });
            onClearError?.('abbreviation');
          }}
          autoComplete="off"
        />
      </FormField>

      <FormField label="Start Time" required error={errors?.startTime}>
        <TimePicker
          id={fieldId('startTime')}
          className={controlClass}
          style={{ width: '100%' }}
          use12Hours
          format="h:mm A"
          value={parseTime(form.startTime)}
          status={errors?.startTime ? 'error' : ''}
          onChange={(time) => {
            onPatchForm({ startTime: time ? time.format('HH:mm') : '' });
            onClearError?.('startTime');
          }}
        />
      </FormField>

      <FormField label="End Time" required error={errors?.endTime}>
        <TimePicker
          id={fieldId('endTime')}
          className={controlClass}
          style={{ width: '100%' }}
          use12Hours
          format="h:mm A"
          value={parseTime(form.endTime)}
          status={errors?.endTime ? 'error' : ''}
          onChange={(time) => {
            onPatchForm({ endTime: time ? time.format('HH:mm') : '' });
            onClearError?.('endTime');
          }}
        />
      </FormField>

      <FormField label="Time Relaxation" error={errors?.relaxationTime}>
        <Select
          id={fieldId('relaxationTime')}
          className={controlClass}
          style={{ width: '100%' }}
          value={form.relaxationTime}
          options={RELAXATION_TIME_OPTIONS}
          status={errors?.relaxationTime ? 'error' : ''}
          onChange={(val) => {
            onPatchForm({ relaxationTime: val ?? 0 });
            onClearError?.('relaxationTime');
          }}
        />
      </FormField>
    </FormGrid>
  );
}
