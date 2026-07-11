'use client';

import { useMemo } from 'react';
import { UploadOutlined } from '@ant-design/icons';
import { Button, Form, Upload } from 'antd';
import AppModal from '@/components/ui/AppModal';
import DynamicForm from '@/components/form/DynamicForm';
import { FIELD_CONTROL_CLASS } from '@/lib/field-control';
import {
  REPORT_HEADER_INITIAL_VALUES,
  getReportHeaderFields,
} from '@/features/service-admin/pages/report-headers/report-header-fields';

function readFileAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function ImageUploadField({ value, onChange, alt }) {
  const handleChange = async (info) => {
    const file = info.file.originFileObj || info.file;
    if (file instanceof File) {
      const url = await readFileAsDataUrl(file);
      onChange?.({ url, name: file.name });
      return;
    }
    if (file && typeof file === 'object' && file.url) {
      onChange?.(file);
    }
  };

  return (
    <div>
      <Upload
        accept="image/*"
        beforeUpload={() => false}
        maxCount={1}
        showUploadList={false}
        onChange={handleChange}
      >
        <Button icon={<UploadOutlined />} className={FIELD_CONTROL_CLASS}>
          Choose File
        </Button>
      </Upload>
      {value ? (
        <div className="report-header-upload-preview">
          <img src={value.url || value} alt={alt} />
        </div>
      ) : null}
    </div>
  );
}

export default function ReportHeaderModal({
  open,
  onClose,
  title,
  form,
  onSave,
  hospitalOptions = [],
}) {
  const fields = useMemo(
    () =>
      getReportHeaderFields({
        hospitalOptions,
        imageLeftField: {
          type: 'custom',
          name: 'imageLeft',
          label: 'Image Left',
          col: 12,
          props: {
            render: () => <ImageUploadField alt="Left" />,
          },
        },
        imageRightField: {
          type: 'custom',
          name: 'imageRight',
          label: 'Image Right',
          col: 12,
          props: {
            render: () => <ImageUploadField alt="Right" />,
          },
        },
      }),
    [hospitalOptions],
  );

  return (
    <AppModal
      open={open}
      onClose={onClose}
      title={title}
      className="report-header-modal"
      rootClassName="report-header-modal-root"
      width={760}
      footer={
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="primary" onClick={onSave}>
            Save
          </Button>
        </div>
      }
    >
      <Form
        form={form}
        layout="vertical"
        requiredMark
        preserve={false}
        initialValues={REPORT_HEADER_INITIAL_VALUES}
      >
        <DynamicForm fields={fields} className="report-header-form-grid" />
      </Form>
    </AppModal>
  );
}
