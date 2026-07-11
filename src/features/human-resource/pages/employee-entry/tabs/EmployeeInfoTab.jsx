'use client';

import { useMemo } from 'react';
import { CameraOutlined, DownOutlined, UpOutlined, UserOutlined } from '@ant-design/icons';
import { Avatar, Collapse, Form, Upload } from 'antd';
import DynamicForm from '@/components/form/DynamicForm';
import {
  useGetHospitalsQuery,
  useGetDeptTypesQuery,
  useGetDepartmentsQuery,
  useGetDesignationsQuery,
} from '@/features/human-resource/api/employeeApi';
import {
  EMPLOYEE_INFO_FIELD_PANEL_MAP,
  getAddressInfoFields,
  getBasicInfoFields,
  getEmploymentInfoFields,
  getGeneralInfoFields,
} from './employee-info-fields';

export { EMPLOYEE_INFO_FIELD_PANEL_MAP };

const SECTION_CLASS = 'patient-reg-section-grid employee-entry-section-grid';

export default function EmployeeInfoTab({
  activePanels,
  onPanelsChange,
  ageLabel,
  fileList,
  onFileListChange,
  photoPreview,
  onPhotoPreviewChange,
}) {
  const { data: hospitals = [] } = useGetHospitalsQuery();
  const { data: deptTypes = [] } = useGetDeptTypesQuery();
  const { data: departments = [] } = useGetDepartmentsQuery();
  const { data: designations = [] } = useGetDesignationsQuery();

  const form = Form.useFormInstance();
  const selectedHospital = Form.useWatch('hospital', form);
  const selectedDepartment = Form.useWatch('department', form);

  const hospitalOptions = useMemo(
    () => hospitals.map((h) => ({ value: h.id, label: h.name })),
    [hospitals],
  );

  const designationOptions = useMemo(
    () => designations.map((d) => ({ value: d.id, label: d.designation })),
    [designations],
  );

  const departmentOptions = useMemo(() => {
    if (!selectedHospital) return [];
    return deptTypes
      .filter((d) => d.hospitalId === selectedHospital)
      .map((d) => ({ value: d.id, label: d.departmentType }));
  }, [deptTypes, selectedHospital]);

  const subDepartmentOptions = useMemo(() => {
    if (!selectedDepartment) return [];
    return departments
      .filter((d) => d.deptTypeId === selectedDepartment)
      .map((d) => ({ value: d.id, label: d.departmentName }));
  }, [departments, selectedDepartment]);

  const generalFields = useMemo(
    () =>
      getGeneralInfoFields({
        photoRender: () => (
          <Upload
            accept="image/*"
            beforeUpload={() => false}
            maxCount={1}
            showUploadList={false}
            fileList={fileList}
            onChange={({ fileList: nextFileList }) => {
              const next = nextFileList.slice(-1);
              onFileListChange(next);

              const latestFile = next[0]?.originFileObj;
              if (!latestFile) {
                onPhotoPreviewChange('');
                return;
              }

              const reader = new FileReader();
              reader.onload = () => {
                onPhotoPreviewChange(typeof reader.result === 'string' ? reader.result : '');
              };
              reader.readAsDataURL(latestFile);
            }}
          >
            <div
              className={[
                'employee-entry-avatar-upload',
                photoPreview ? 'employee-entry-avatar-upload--has-photo' : '',
              ]
                .filter(Boolean)
                .join(' ')}
              role="button"
              tabIndex={0}
              aria-label="Upload profile photo"
            >
              <Avatar
                shape="square"
                size={64}
                src={photoPreview || undefined}
                icon={!photoPreview ? <UserOutlined /> : undefined}
                className="employee-entry-photo-preview"
              />
              <span className="employee-entry-avatar-upload-badge" aria-hidden>
                <CameraOutlined />
              </span>
              <div className="employee-entry-avatar-overlay">
                <span>{photoPreview ? 'Change' : 'Upload'}</span>
              </div>
            </div>
          </Upload>
        ),
      }),
    [fileList, onFileListChange, onPhotoPreviewChange, photoPreview],
  );

  const basicFields = useMemo(
    () => getBasicInfoFields({ ageLabel }),
    [ageLabel],
  );

  const addressFields = useMemo(() => getAddressInfoFields(), []);

  const employmentFields = useMemo(
    () =>
      getEmploymentInfoFields({
        form,
        selectedHospital,
        selectedDepartment,
        hospitalOptions,
        designationOptions,
        departmentOptions,
        subDepartmentOptions,
      }),
    [
      form,
      selectedHospital,
      selectedDepartment,
      hospitalOptions,
      designationOptions,
      departmentOptions,
      subDepartmentOptions,
    ],
  );

  const collapseItems = useMemo(
    () => [
      {
        key: 'general',
        label: 'General Information',
        children: (
          <DynamicForm fields={generalFields} gutter={[14, 12]} className={SECTION_CLASS} />
        ),
      },
      {
        key: 'basic',
        label: 'Basic Information',
        children: (
          <DynamicForm fields={basicFields} gutter={[14, 12]} className={SECTION_CLASS} />
        ),
      },
      {
        key: 'address',
        label: 'Address Information',
        children: (
          <DynamicForm fields={addressFields} gutter={[14, 12]} className={SECTION_CLASS} />
        ),
      },
      {
        key: 'employment',
        label: 'Employment Information',
        children: (
          <DynamicForm fields={employmentFields} gutter={[14, 12]} className={SECTION_CLASS} />
        ),
      },
    ],
    [generalFields, basicFields, addressFields, employmentFields],
  );

  return (
    <Collapse
      items={collapseItems}
      activeKey={activePanels}
      onChange={onPanelsChange}
      destroyOnHidden={false}
      classNames={{
        root: 'patient-registration-collapse',
        header: 'patient-reg-collapse-header',
        title: 'patient-reg-collapse-title',
      }}
      expandIconPlacement="end"
      expandIcon={({ isActive }) =>
        isActive ? (
          <DownOutlined className="patient-reg-collapse-icon" aria-hidden />
        ) : (
          <UpOutlined className="patient-reg-collapse-icon" aria-hidden />
        )
      }
    />
  );
}
