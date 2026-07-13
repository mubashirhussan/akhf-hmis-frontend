'use client';

import Link from 'next/link';
import { ArrowLeftOutlined, PlusOutlined } from '@ant-design/icons';
import { Button } from 'antd';

export default function EmployeeEntryHeader({ isEditMode, onNewEmployee }) {
  return (
    <div
      className={`employee-entry-header${isEditMode ? '' : ' employee-entry-header--end'}`}
    >
      {isEditMode ? (
        <Link href="/human-resource/search-all-employee" className="employee-entry-back-link">
          <ArrowLeftOutlined aria-hidden />
          <span>Search Employees</span>
        </Link>
      ) : null}
      <div className="employee-entry-header-actions">
        {isEditMode ? (
          <Button
            type="primary"
            icon={<PlusOutlined />}
            className="patient-reg-btn-save"
            onClick={onNewEmployee}
          >
            New Employee
          </Button>
        ) : (
          <Link href="/human-resource/search-all-employee">
            <Button>Search Employees</Button>
          </Link>
        )}
      </div>
    </div>
  );
}
