'use client';

import { Button } from 'antd';
import AppModal from '@/components/ui/AppModal';
import PathologyTestRangeForm from '@/features/admin-pathology/pages/pathology-test-range/PathologyTestRangeForm';

export default function PathologyTestRangeModal({
  open,
  onClose,
  title = 'Add Test Range',
  form,
  unitOptions,
  conditionOptions,
  errors,
  onPatchForm,
  onClearError,
  onSave,
  onAddCondition,
  onAddConversionRate,
}) {
  return (
    <AppModal
      open={open}
      onClose={onClose}
      title={title}
      centered={false}
      mask={{ closable: false }}
      style={{ top: 20 }}
      width={900}
      className="pathology-test-range-modal"
      rootClassName="pathology-test-range-modal-root"
      footer={
        <>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="primary" className="pathology-test-range-save-btn" onClick={onSave}>
            Save
          </Button>
        </>
      }
    >
      <PathologyTestRangeForm
        form={form}
        unitOptions={unitOptions}
        conditionOptions={conditionOptions}
        errors={errors}
        onPatchForm={onPatchForm}
        onClearError={onClearError}
        onAddCondition={onAddCondition}
        onAddConversionRate={onAddConversionRate}
      />
    </AppModal>
  );
}
