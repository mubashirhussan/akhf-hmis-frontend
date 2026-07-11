'use client';
import { useCallback, useMemo, useState } from 'react';
import { App, Button, Form } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import AppIcon from '@/components/icons/AppIcon';
import DataTable from '@/components/ui/DataTable';
import DynamicForm from '@/components/form/DynamicForm';
import {
  PATIENT_SEARCH_FILTER_FIELDS,
  PATIENT_SEARCH_FILTER_INITIAL_VALUES,
} from '@/features/opd/pages/patient-search/patient-search-fields';

/* ─────────────────────────────────────────────────────────────────────────── */
/*  Demo data                                                                   */
/* ─────────────────────────────────────────────────────────────────────────── */

const DEMO_PATIENTS = [
  {
    id: 1,
    registrationNo: 'REG-00001',
    patientName: 'Muhammad Ali',
    relation: 'S/O',
    relationName: 'Muhammad Akram',
    patientAge: 34,
    gender: 'Male',
    registrationDate: '01-07-2025',
    dateOfBirth: '15-03-1991',
    mobilePhone: '0300-1234567',
    cnic: '35201-1234567-1',
    department: 'Cardiology',
    roomNo: '101',
    patientType: 'OPD',
    billingPartyId: 'BP-001',
    partyName: 'Self',
  },
  {
    id: 2,
    registrationNo: 'REG-00002',
    patientName: 'Fatima Zahra',
    relation: 'D/O',
    relationName: 'Ahmed Raza',
    patientAge: 28,
    gender: 'Female',
    registrationDate: '03-07-2025',
    dateOfBirth: '22-09-1996',
    mobilePhone: '0321-9876543',
    cnic: '35202-9876543-2',
    department: 'Gynecology',
    roomNo: '205',
    patientType: 'IPD',
    billingPartyId: 'BP-012',
    partyName: 'Jubilee Insurance',
  },
  {
    id: 3,
    registrationNo: 'REG-00003',
    patientName: 'Khalid Mehmood',
    relation: 'S/O',
    relationName: 'Ghulam Rasool',
    patientAge: 52,
    gender: 'Male',
    registrationDate: '05-07-2025',
    dateOfBirth: '10-11-1972',
    mobilePhone: '0333-5551234',
    cnic: '35401-5551234-3',
    department: 'Orthopedics',
    roomNo: '310',
    patientType: 'OPD',
    billingPartyId: 'BP-005',
    partyName: 'State Life',
  },
  {
    id: 4,
    registrationNo: 'REG-00004',
    patientName: 'Ayesha Siddiqui',
    relation: 'W/O',
    relationName: 'Tariq Siddiqui',
    patientAge: 45,
    gender: 'Female',
    registrationDate: '06-07-2025',
    dateOfBirth: '18-05-1980',
    mobilePhone: '0312-7774455',
    cnic: '35101-7774455-4',
    department: 'Dermatology',
    roomNo: '112',
    patientType: 'OPD',
    billingPartyId: 'BP-001',
    partyName: 'Self',
  },
  {
    id: 5,
    registrationNo: 'REG-00005',
    patientName: 'Usman Farooq',
    relation: 'S/O',
    relationName: 'Farooq Ahmed',
    patientAge: 19,
    gender: 'Male',
    registrationDate: '07-07-2025',
    dateOfBirth: '01-01-2006',
    mobilePhone: '0345-2223344',
    cnic: '',
    department: 'General Surgery',
    roomNo: '401',
    patientType: 'Emergency',
    billingPartyId: 'BP-020',
    partyName: 'SNGPL',
  },
  {
    id: 6,
    registrationNo: 'REG-00006',
    patientName: 'Sana Malik',
    relation: 'D/O',
    relationName: 'Malik Nawaz',
    patientAge: 31,
    gender: 'Female',
    registrationDate: '08-07-2025',
    dateOfBirth: '14-06-1994',
    mobilePhone: '0311-6667788',
    cnic: '35301-6667788-5',
    department: 'Ophthalmology',
    roomNo: '214',
    patientType: 'OPD',
    billingPartyId: 'BP-001',
    partyName: 'Self',
  },
  {
    id: 7,
    registrationNo: 'REG-00007',
    patientName: 'Imran Hassan',
    relation: 'S/O',
    relationName: 'Hassan Nawab',
    patientAge: 60,
    gender: 'Male',
    registrationDate: '09-07-2025',
    dateOfBirth: '25-12-1964',
    mobilePhone: '0300-9998877',
    cnic: '35502-9998877-6',
    department: 'Neurology',
    roomNo: '502',
    patientType: 'IPD',
    billingPartyId: 'BP-007',
    partyName: 'EFU Insurance',
  },
  {
    id: 8,
    registrationNo: 'REG-00008',
    patientName: 'Zainab Hussain',
    relation: 'D/O',
    relationName: 'Hussain Ali',
    patientAge: 8,
    gender: 'Female',
    registrationDate: '10-07-2025',
    dateOfBirth: '30-04-2017',
    mobilePhone: '0322-4445566',
    cnic: '',
    department: 'Pediatrics',
    roomNo: '303',
    patientType: 'OPD',
    billingPartyId: 'BP-001',
    partyName: 'Self',
  },
  {
    id: 9,
    registrationNo: 'REG-00009',
    patientName: 'Abdul Rehman',
    relation: 'S/O',
    relationName: 'Rehman Ullah',
    patientAge: 41,
    gender: 'Male',
    registrationDate: '10-07-2025',
    dateOfBirth: '07-08-1984',
    mobilePhone: '0336-1112233',
    cnic: '35601-1112233-7',
    department: 'Urology',
    roomNo: '415',
    patientType: 'OPD',
    billingPartyId: 'BP-003',
    partyName: 'Adamjee Insurance',
  },
  {
    id: 10,
    registrationNo: 'REG-00010',
    patientName: 'Nadia Iqbal',
    relation: 'W/O',
    relationName: 'Iqbal Hussain',
    patientAge: 37,
    gender: 'Female',
    registrationDate: '11-07-2025',
    dateOfBirth: '19-02-1988',
    mobilePhone: '0344-8889900',
    cnic: '35201-8889900-8',
    department: 'Endocrinology',
    roomNo: '220',
    patientType: 'OPD',
    billingPartyId: 'BP-001',
    partyName: 'Self',
  },
];

/* ─────────────────────────────────────────────────────────────────────────── */
/*  Component                                                                   */
/* ─────────────────────────────────────────────────────────────────────────── */

export default function PatientSearchPage() {
  const { message } = App.useApp();
  const [filterForm] = Form.useForm();

  const [filters, setFilters] = useState(PATIENT_SEARCH_FILTER_INITIAL_VALUES);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10 });

  /* ── Clear handler ──────────────────────────────────────────────────────── */
  const handleClear = useCallback(() => {
    filterForm.resetFields();
    setFilters(PATIENT_SEARCH_FILTER_INITIAL_VALUES);
    setPagination((p) => ({ ...p, current: 1 }));
  }, [filterForm]);

  const filteredRows = useMemo(() => {
    return DEMO_PATIENTS.filter((row) => {
      const matchesRegNo = (filters.registrationNo ?? '').trim()
        ? row.registrationNo
            ?.toLowerCase()
            .includes((filters.registrationNo ?? '').trim().toLowerCase())
        : true;

      const matchesCnic = (filters.cnic ?? '').trim()
        ? row.cnic?.toLowerCase().includes((filters.cnic ?? '').trim().toLowerCase())
        : true;

      const matchesPassport = (filters.passportNo ?? '').trim()
        ? row.passportNo?.toLowerCase().includes((filters.passportNo ?? '').trim().toLowerCase())
        : true;

      const matchesMobile = (filters.mobileNo ?? '').trim()
        ? row.mobilePhone?.toLowerCase().includes((filters.mobileNo ?? '').trim().toLowerCase())
        : true;

      const matchesName = (filters.name ?? '').trim()
        ? row.patientName?.toLowerCase().includes((filters.name ?? '').trim().toLowerCase())
        : true;

      const matchesDate = (filters.registrationDate ?? '')
        ? row.registrationDate === filters.registrationDate
        : true;

      return (
        matchesRegNo &&
        matchesCnic &&
        matchesPassport &&
        matchesMobile &&
        matchesName &&
        matchesDate
      );
    });
  }, [filters]);
  /* ── Export handler ─────────────────────────────────────────────────────── */
  const handleExport = useCallback(() => {
    if (filteredRows.length === 0) {
      message.warning('No data to export.');
      return;
    }
    message.info('Export will be connected to the backend API.');
  }, [message, filteredRows]);

  /* ── Client-side filtering ──────────────────────────────────────────────── */

  /* ── Table columns ──────────────────────────────────────────────────────── */
  const columns = useMemo(
    () => [
      {
        title: 'R #',
        dataIndex: 'registrationNo',
        key: 'registrationNo',
        width: 90,
        className: 'patient-search-col-reg-no',
      },
      {
        title: 'Patient Name',
        dataIndex: 'patientName',
        key: 'patientName',
        width: 160,
        className: 'patient-search-col-patient-name',
      },
      {
        title: 'Relation',
        dataIndex: 'relation',
        key: 'relation',
        width: 70,
      },
      {
        title: 'Relation Name',
        dataIndex: 'relationName',
        key: 'relationName',
        width: 150,
      },
      {
        title: 'Patient Age',
        dataIndex: 'patientAge',
        key: 'patientAge',
        width: 90,
      },
      {
        title: 'Gender',
        dataIndex: 'gender',
        key: 'gender',
        width: 80,
        className: 'patient-search-col-gender',
      },
      {
        title: 'Registration Date',
        dataIndex: 'registrationDate',
        key: 'registrationDate',
        width: 130,
      },
{
  title: 'Date Of Birth',
  dataIndex: 'dateOfBirth',
  key: 'dateOfBirth',
  width: 110,
  className: 'patient-search-col-dob',
},
      {
        title: 'MobilePhone',
        dataIndex: 'mobilePhone',
        key: 'mobilePhone',
        width: 120,
      },
      {
        title: 'CNIC',
        dataIndex: 'cnic',
        key: 'cnic',
        width: 140,
      },
      {
        title: 'Department',
        dataIndex: 'department',
        key: 'department',
        width: 140,
      },
      {
        title: 'Room No',
        dataIndex: 'roomNo',
        key: 'roomNo',
        width: 80,
      },
      {
        title: 'Patient Type',
        dataIndex: 'patientType',
        key: 'patientType',
        width: 100,
        className: 'patient-search-col-patient-type',
      },
      {
        title: 'Billing Party Id',
        dataIndex: 'billingPartyId',
        key: 'billingPartyId',
        width: 110,
      },
      {
        title: 'Party Name',
        dataIndex: 'partyName',
        key: 'partyName',
        width: 140,
      },
    ],
    [],
  );

  /* ── Render ─────────────────────────────────────────────────────────────── */
  return (
    <div className="services-billing-page patient-search-page">
      {/* ── Filter Panel ─────────────────────────────────────────────────── */}
      <section
        className="patient-search-filter-panel"
        aria-label="Patient search filters"
      >
        <div className="walk-in-add-record-layout patient-search-filter-layout">
          <Form
            form={filterForm}
            layout="vertical"
            initialValues={PATIENT_SEARCH_FILTER_INITIAL_VALUES}
            className="walk-in-add-record-form patient-search-filter-form"
            onValuesChange={(_changed, allValues) => {
              setFilters(allValues);
            }}
            onFinish={() => {
              setFilters(filterForm.getFieldsValue());
              setPagination((p) => ({ ...p, current: 1 }));
            }}
          >
            <DynamicForm fields={PATIENT_SEARCH_FILTER_FIELDS} gutter={[16, 12]} />

            <div className="patient-search-filter-actions">
              <Button
                type="link"
                className="patient-reg-btn-clear"
                onClick={handleClear}
              >
                Clear
              </Button>
              <Button
                type="default"
                className="hr-search-btn"
                icon={<SearchOutlined />}
                htmlType="submit"
              >
                Search
              </Button>
            </div>
          </Form>
        </div>
      </section>

      {/* ── Results Table ─────────────────────────────────────────────────── */}
      <section
        className="services-billing-results patient-search-results"
        aria-label="Patient search results"
      >
        <div className="patient-search-table-toolbar">
          <Button
            className="patient-search-export-btn"
            icon={<AppIcon icon="mdi:export" className="h-4 w-4" />}
            onClick={handleExport}
          >
            Export
          </Button>
        </div>
<DataTable
  rowKey="id"
  columns={columns}
  dataSource={filteredRows}
  columnAlign="left"
  scroll={{ x: 'max-content' }}
  pagination={{
    current: pagination.current,
    pageSize: pagination.pageSize,
    showSizeChanger: true,
    pageSizeOptions: ['10', '20', '50', '100'],
    showTotal: (total) => `Total ${total} items`,
    onChange: (current, pageSize) => setPagination({ current, pageSize }),
  }}
/>
      </section>
    </div>
  );
}