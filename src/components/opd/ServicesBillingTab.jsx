'use client';

import { useMemo, useState } from 'react';
import {
  CreditCardOutlined,
  EditOutlined,
  EyeOutlined,
  SettingOutlined,
} from '@ant-design/icons';
import { Button, DatePicker, Form, Input, Space, Tag, Tooltip } from 'antd';
import HmisAgeUnitField from '@/components/ui/HmisAgeUnitField';
import HmisFloatingField from '@/components/ui/HmisFloatingField';
import HmisFormGrid from '@/components/ui/HmisFormGrid';
import HmisTable from '@/components/ui/HmisTable';
import {
  MOCK_SERVICES_BILLING_VISITS,
  searchServicesBillingVisits,
  SERVICES_BILLING_STATUS_COLORS,
  SERVICES_BILLING_TYPE_COLORS,
} from '@/data/mock-services-billing';
import { HMIS_FIELD_CONTROL_CLASS } from '@/lib/hmis-field-control';
import { HMIS_SERVICES_BILLING_TABLE_SCROLL_Y } from '@/lib/hmis-table-scroll';
import { DOB_AGE_UNITS } from '@/lib/dob-from-age';

const controlClass = HMIS_FIELD_CONTROL_CLASS;

function BillingTag({ value }) {
  const palette =
    SERVICES_BILLING_STATUS_COLORS[value] ??
    SERVICES_BILLING_TYPE_COLORS[value] ?? {
      bg: '#f1f5f9',
      color: '#475569',
      border: '#cbd5e1',
    };

  return (
    <Tag
      bordered
      className="services-billing-tag"
      style={{
        backgroundColor: palette.bg,
        color: palette.color,
        borderColor: palette.border,
      }}
    >
      {value}
    </Tag>
  );
}

const initialValues = {
  visitNo: '',
  mrNo: '',
  patientAge: '',
  ageUnit: DOB_AGE_UNITS.years,
  registrationDate: null,
  cnic: '',
  mobile: '',
  firstName: '',
  middleName: '',
  lastName: '',
  relationFirstName: '',
  relationMiddleName: '',
  relationLastName: '',
};

export default function ServicesBillingTab() {
  const [form] = Form.useForm();
  const patientAge = Form.useWatch('patientAge', form);
  const ageUnit = Form.useWatch('ageUnit', form);
  const [results, setResults] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = () => {
    const values = form.getFieldsValue();
    const matched = searchServicesBillingVisits(MOCK_SERVICES_BILLING_VISITS, {
      ...values,
      patientAge: patientAge ?? '',
      ageUnit: ageUnit ?? DOB_AGE_UNITS.years,
    });
    setResults(matched);
    setHasSearched(true);
  };

  const columns = useMemo(
    () => [
      { title: 'Visit No', dataIndex: 'visitNo', key: 'visitNo', width: 130 },
      { title: 'Reg No', dataIndex: 'regNo', key: 'regNo', width: 120 },
      { title: 'Patient Name', dataIndex: 'patientName', key: 'patientName', width: 150 },
      { title: 'PL Name', dataIndex: 'plName', key: 'plName', width: 140 },
      { title: 'Relation', dataIndex: 'relation', key: 'relation', width: 88 },
      { title: 'Relation Name', dataIndex: 'relationName', key: 'relationName', width: 150 },
      { title: 'Age', dataIndex: 'age', key: 'age', width: 96 },
      { title: 'Gender', dataIndex: 'gender', key: 'gender', width: 88 },
      { title: 'Reg Date&Time', dataIndex: 'regDateTime', key: 'regDateTime', width: 168 },
      { title: 'CNIC', dataIndex: 'cnic', key: 'cnic', width: 150 },
      { title: 'Date&Time To', dataIndex: 'dateTimeTo', key: 'dateTimeTo', width: 168 },
      {
        title: 'Status',
        dataIndex: 'status',
        key: 'status',
        width: 100,
        render: (value) => <BillingTag value={value} />,
      },
      {
        title: 'Patient Type',
        dataIndex: 'patientType',
        key: 'patientType',
        width: 118,
        render: (value) => <BillingTag value={value} />,
      },
      {
        title: 'Checkup Type',
        dataIndex: 'checkupType',
        key: 'checkupType',
        width: 118,
        render: (value) => <BillingTag value={value} />,
      },
      {
        title: 'Actions',
        key: 'actions',
        width: 132,
        fixed: 'right',
        align: 'center',
        render: () => (
          <Space size={4} className="services-billing-actions-cell">
            <Tooltip title="Billing">
              <Button type="link" size="small" icon={<CreditCardOutlined />} aria-label="Billing" />
            </Tooltip>
            <Tooltip title="View">
              <Button type="link" size="small" icon={<EyeOutlined />} aria-label="View" />
            </Tooltip>
            <Tooltip title="Edit">
              <Button type="link" size="small" icon={<EditOutlined />} aria-label="Edit" />
            </Tooltip>
            <Tooltip title="Settings">
              <Button type="link" size="small" icon={<SettingOutlined />} aria-label="Settings" />
            </Tooltip>
          </Space>
        ),
      },
    ],
    [],
  );

  return (
    <div className="services-billing-page">
      <Form
        form={form}
        layout="vertical"
        className="services-billing-search-form"
        initialValues={initialValues}
        onFinish={handleSearch}
      >
        <HmisFormGrid columns={4} className="services-billing-search-grid">
          <HmisFloatingField label="Visit #" htmlFor="billing-visit-no">
            <Form.Item name="visitNo" noStyle>
              <Input
                id="billing-visit-no"
                className={controlClass}
                placeholder="Enter Visit id"
                allowClear
              />
            </Form.Item>
          </HmisFloatingField>

          <HmisFloatingField label="MR #" htmlFor="billing-mr-no">
            <Form.Item name="mrNo" noStyle>
              <Input
                id="billing-mr-no"
                className={controlClass}
                placeholder="Enter MR Number"
                allowClear
              />
            </Form.Item>
          </HmisFloatingField>

          <HmisFloatingField label="Patient Age" htmlFor="billing-patient-age">
            <HmisAgeUnitField
              ageInputId="billing-patient-age"
              age={patientAge ?? ''}
              unit={ageUnit ?? DOB_AGE_UNITS.years}
              onChange={({ age, unit }) => {
                form.setFieldsValue({ patientAge: age, ageUnit: unit });
              }}
            />
          </HmisFloatingField>

          <HmisFloatingField label="Registration Date">
            <Form.Item name="registrationDate" noStyle>
              <DatePicker className={controlClass} style={{ width: '100%' }} format="DD/MM/YYYY" />
            </Form.Item>
          </HmisFloatingField>

          <HmisFloatingField label="CNIC #" htmlFor="billing-cnic">
            <Form.Item name="cnic" noStyle>
              <Input
                id="billing-cnic"
                className={controlClass}
                placeholder="Enter CNIC Number"
                allowClear
              />
            </Form.Item>
          </HmisFloatingField>

          <HmisFloatingField label="Mobile #" htmlFor="billing-mobile">
            <Form.Item name="mobile" noStyle>
              <Input
                id="billing-mobile"
                className={controlClass}
                placeholder="Enter Mobile Number"
                allowClear
              />
            </Form.Item>
          </HmisFloatingField>

          <HmisFloatingField label="First Name" htmlFor="billing-first-name">
            <Form.Item name="firstName" noStyle>
              <Input
                id="billing-first-name"
                className={controlClass}
                placeholder="Enter First Name"
                allowClear
              />
            </Form.Item>
          </HmisFloatingField>

          <HmisFloatingField label="Middle Name" htmlFor="billing-middle-name">
            <Form.Item name="middleName" noStyle>
              <Input
                id="billing-middle-name"
                className={controlClass}
                placeholder="Enter Middle Name"
                allowClear
              />
            </Form.Item>
          </HmisFloatingField>

          <HmisFloatingField label="Last Name" htmlFor="billing-last-name">
            <Form.Item name="lastName" noStyle>
              <Input
                id="billing-last-name"
                className={controlClass}
                placeholder="Enter Last Name"
                allowClear
              />
            </Form.Item>
          </HmisFloatingField>

          <HmisFloatingField label="Relation First Name" htmlFor="billing-rel-first">
            <Form.Item name="relationFirstName" noStyle>
              <Input
                id="billing-rel-first"
                className={controlClass}
                placeholder="Enter First Name"
                allowClear
              />
            </Form.Item>
          </HmisFloatingField>

          <HmisFloatingField label="Relation Middle Name" htmlFor="billing-rel-middle">
            <Form.Item name="relationMiddleName" noStyle>
              <Input
                id="billing-rel-middle"
                className={controlClass}
                placeholder="Enter Middle Name"
                allowClear
              />
            </Form.Item>
          </HmisFloatingField>

          <HmisFloatingField label="Relation Last Name" htmlFor="billing-rel-last">
            <Form.Item name="relationLastName" noStyle>
              <Input
                id="billing-rel-last"
                className={controlClass}
                placeholder="Enter Last Name"
                allowClear
              />
            </Form.Item>
          </HmisFloatingField>
        </HmisFormGrid>

        <div className="services-billing-search-actions">
          <Button
            type="primary"
            htmlType="submit"
            className="walk-in-search-btn services-billing-search-btn"
            onClick={handleSearch}
          >
            Submit
          </Button>
        </div>
      </Form>

      <section className="services-billing-results" aria-label="Billing search results">
        <HmisTable
          className="hmis-table--billing-results"
          columns={columns}
          dataSource={results}
          rowKey="id"
          columnAlign="left"
          pagination={false}
          scroll={{ x: 1680, y: HMIS_SERVICES_BILLING_TABLE_SCROLL_Y }}
          locale={{
            emptyText: hasSearched
              ? 'No visits found'
              : 'Use the search form above to find visits',
          }}
        />
      </section>
    </div>
  );
}
