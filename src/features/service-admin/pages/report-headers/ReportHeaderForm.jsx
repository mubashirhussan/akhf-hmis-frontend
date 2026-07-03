'use client';

import { UploadOutlined } from '@ant-design/icons';
import { Button, Input, Select, Upload } from 'antd';
import FormField from '@/components/ui/FormField';
import FormGrid from '@/components/ui/FormGrid';
import { FIELD_CONTROL_CLASS } from '@/lib/field-control';

const controlClass = FIELD_CONTROL_CLASS;

function readFileAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export default function ReportHeaderForm({
  form,
  errors = {},
  onPatchForm,
  onClearError,
  hospitalOptions,
}) {
  const fieldId = (name) => `report-header-${name}`;

  const handleImageChange = async (field, info) => {
    const file = info.file.originFileObj || info.file;
    if (file instanceof File) {
      const url = await readFileAsDataUrl(file);
      onPatchForm({ [field]: { url, name: file.name } });
      onClearError?.(field);
      return;
    }

    if (file && typeof file === 'object' && file.url) {
      onPatchForm({ [field]: file });
      onClearError?.(field);
      return;
    }
  };

  return (
    <FormGrid columns={2} className="report-header-form-grid">
      <FormField label="Hospital Name" required error={errors?.hospitalId}>
        <Select
          id={fieldId('hospital')}
          className={controlClass}
          status={errors?.hospitalId ? 'error' : ''}
          value={form.hospitalId || undefined}
          options={hospitalOptions}
          showSearch
          optionFilterProp="label"
          onChange={(hospitalId) => {
            onPatchForm({ hospitalId });
            onClearError?.('hospitalId');
          }}
        />
      </FormField>

      <FormField label="Heading 1">
        <Input
          id={fieldId('heading1')}
          className={controlClass}
          value={form.heading1}
          onChange={(e) => onPatchForm({ heading1: e.target.value })}
        />
      </FormField>

      <FormField label="Heading 2">
        <Input
          id={fieldId('heading2')}
          className={controlClass}
          value={form.heading2}
          onChange={(e) => onPatchForm({ heading2: e.target.value })}
        />
      </FormField>

      <FormField label="Heading 3">
        <Input
          id={fieldId('heading3')}
          className={controlClass}
          value={form.heading3}
          onChange={(e) => onPatchForm({ heading3: e.target.value })}
        />
      </FormField>

      <FormField label="Footer Heading">
        <Input
          id={fieldId('footer-heading')}
          className={controlClass}
          value={form.footerHeading}
          onChange={(e) => onPatchForm({ footerHeading: e.target.value })}
        />
      </FormField>

      <FormField label="Image Left">
        <Upload
          accept="image/*"
          beforeUpload={() => false}
          maxCount={1}
          showUploadList={false}
          onChange={(info) => handleImageChange('imageLeft', info)}
        >
          <Button icon={<UploadOutlined />} className={controlClass}>
            Choose File
          </Button>
        </Upload>
        {form.imageLeft ? (
          <div className="report-header-upload-preview">
            <img src={form.imageLeft.url || form.imageLeft} alt="Left" />
          </div>
        ) : null}
      </FormField>

      <FormField label="Image Right">
        <Upload
          accept="image/*"
          beforeUpload={() => false}
          maxCount={1}
          showUploadList={false}
          onChange={(info) => handleImageChange('imageRight', info)}
        >
          <Button icon={<UploadOutlined />} className={controlClass}>
            Choose File
          </Button>
        </Upload>
        {form.imageRight ? (
          <div className="report-header-upload-preview">
            <img src={form.imageRight.url || form.imageRight} alt="Right" />
          </div>
        ) : null}
      </FormField>
    </FormGrid>
  );
}
