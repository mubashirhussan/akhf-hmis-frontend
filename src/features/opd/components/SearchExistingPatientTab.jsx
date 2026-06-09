'use client';

import { useMemo, useState } from 'react';
import { App, Avatar, Button, Input, Modal } from 'antd';
import DetailSection from '@/components/ui/DetailSection';
import DataTable from '@/components/ui/DataTable';
import { SearchOutlined, UserOutlined } from '@ant-design/icons';
import {
  MOCK_WALK_IN_PATIENTS,
  searchWalkInPatients,
} from '@/features/opd/api/mock-walk-in-patients';
import SearchServicesSection from '@/features/opd/components/SearchServicesSection';
import { FIELD_CONTROL_CLASS } from '@/lib/field-control';
import { validateWalkInPatientSearch } from '@/features/opd/utils/walk-in-search-validation';

function PatientDetailsPanel({ patient }) {
  const { visitSummary } = patient;

  const patientFields = [
    { key: 'mr', label: 'MR No', value: patient.mrNo },
    { key: 'name', label: 'Patient Name', value: patient.name },
    { key: 'gender', label: 'Gender', value: patient.gender },
    { key: 'age', label: 'Age', value: patient.ageLabel },
    { key: 'mobile', label: 'Mobile No', value: patient.mobile },
    { key: 'cnic', label: 'CNIC', value: patient.cnic },
    {
      key: 'visit',
      label: 'Visit Date & Time',
      value: patient.visitDateTime,
     
    },
    { key: 'address', label: 'Address', value: patient.address,  },
  ];

  const visitFields = [
    { key: 'visits', label: 'Total Visits', value: visitSummary.totalVisits },
    { key: 'last', label: 'Last Visit', value: visitSummary.lastVisit },
    { key: 'services', label: 'Total Services', value: visitSummary.totalServices },
    { key: 'charges', label: 'Total Charges', value: visitSummary.totalCharges },
  ];

  return (
    <div className="patient-details">
      <DetailSection title="Patient Details" fields={patientFields} />
      <DetailSection
        title="Visit Summary"
        fields={visitFields}
        className="detail-section--last"
      />
    </div>
  );
}

export default function SearchExistingPatientTab() {
  const { message } = App.useApp();
  const [mrNo, setMrNo] = useState('');
  const [mobileNo, setMobileNo] = useState('');
  const [results, setResults] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [isPatientDetailsModalOpen, setIsPatientDetailsModalOpen] = useState(false);

  const handleSearch = () => {
    const validation = validateWalkInPatientSearch(mrNo, mobileNo);
    if (!validation.valid) {
      message.error(validation.message);
      setHasSearched(false);
      setResults([]);
      setSelectedPatient(null);
      setIsPatientDetailsModalOpen(false);
      return;
    }

    const matched = searchWalkInPatients(MOCK_WALK_IN_PATIENTS, {
      mrNo,
      mobile: mobileNo,
    });
    setResults(matched);
    setHasSearched(true);
    setSelectedPatient(null);
    setIsPatientDetailsModalOpen(false);
  };

  const handleClear = () => {
    setMrNo('');
    setMobileNo('');
    setResults([]);
    setHasSearched(false);
    setSelectedPatient(null);
    setIsPatientDetailsModalOpen(false);
  };

  const handlePatientSelect = (patient) => {
    setSelectedPatient(patient);
    setIsPatientDetailsModalOpen(true);
  };

  const handleClosePatientModal = () => {
    setIsPatientDetailsModalOpen(false);
  };

  const patientCountLabel = useMemo(() => {
    if (!hasSearched) return '0 patients';
    const count = results.length;
    return `${count} patient${count === 1 ? '' : 's'}`;
  }, [hasSearched, results.length]);

  const patientColumns = [
    {
      title: 'Sr #',
      key: 'serial',
      width: 72,
      align: 'center',
      render: (_, __, index) => index + 1,
    },
    {
      title: 'Picture',
      key: 'picture',
      width: 92,
      align: 'center',
      render: (_, record) => {
        const initials = (record.name || '')
          .split(' ')
          .filter(Boolean)
          .slice(0, 2)
          .map((part) => part[0]?.toUpperCase() ?? '')
          .join('');

        return (
          <Avatar
            src={record.picture}
            size={32}
            style={{ backgroundColor: '#E6F1FA', color: '#026BB1', fontSize: 14 }}
            icon={!record.picture ? <UserOutlined /> : null}
          >
            {!record.picture ? initials : null}
          </Avatar>
        );
      },
    },
    {
      title: 'MR No',
      dataIndex: 'mrNo',
      key: 'mrNo',
      width: 160,
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
     {
      title: 'Visit Date & Time',
      dataIndex: 'visitDateTime',
      key: 'visitDateTime',
    },
     {
      title: 'Mobile No',
      dataIndex: 'mobile',
      key: 'mobile',
    },
    {
      title: 'Gender',
      dataIndex: 'gender',
      key: 'gender',
      width: 120,
    },
    {
      title: 'Age',
      dataIndex: 'ageLabel',
      key: 'ageLabel',
      width: 120,
    },
  ];

  const searchFields = (
    <section className="walk-in-search-section" aria-label="Search patients">
      <div className="walk-in-patient-search-bar">
        <div className="walk-in-patient-search-field">
          {/* <label className="walk-in-patient-search-label" htmlFor="walk-in-search-mr">
            MR No
          </label> */}
          <Input
            id="walk-in-search-mr"
            className={FIELD_CONTROL_CLASS}
            placeholder="e.g. MR-002-26"
            value={mrNo}
            onChange={(e) => setMrNo(e.target.value)}
            onPressEnter={handleSearch}
            allowClear
            autoComplete="off"
            data-lpignore="true"
            data-1p-ignore="true"
          />
        </div>
        <div className="walk-in-patient-search-field">
          {/* <label className="walk-in-patient-search-label" htmlFor="walk-in-search-mobile">
            Mobile No
          </label> */}
          <Input
            id="walk-in-search-mobile"
            className={FIELD_CONTROL_CLASS}
            placeholder="e.g. 03001234567"
            value={mobileNo}
            onChange={(e) => setMobileNo(e.target.value)}
            onPressEnter={handleSearch}
            allowClear
            autoComplete="off"
            data-lpignore="true"
            data-1p-ignore="true"
          />
        </div>
        <div className="walk-in-patient-search-actions">
          <Button
            type="primary"
            icon={<SearchOutlined />}
            className="walk-in-search-btn"
            onClick={handleSearch}
          >
            Search
          </Button>
          {(mrNo || mobileNo || hasSearched) && (
            <Button type="text" className="walk-in-search-clear-btn" onClick={handleClear}>
              Clear
            </Button>
          )}
        </div>
      </div>
    </section>
  );

  return (
    <>
      <section className="walk-in-patients-section mt-2">
        <div className="section-header section-header--inline mt-4">
          <div className="section-header-text">
            <h2 className="section-title">No of Registered Patients</h2>
            {/* <p className="section-description">{patientCountLabel}</p> */}
          </div>
          <div className="section-header-extra">{searchFields}</div>
        </div>
        <DataTable
          className="data-table--patient-list"
          columns={patientColumns}
          dataSource={results}
          rowKey="id"
          columnAlign="left"
          pagination={false}
          tableLayout="fixed"
          locale={{
            emptyText: hasSearched
              ? 'No patients found'
              : 'Search by MR or mobile to view patients',
          }}
          onRow={(record) => ({
            onClick: () => handlePatientSelect(record),
            className: selectedPatient?.id === record.id ? 'data-table-row--selected' : undefined,
          })}
        />
      </section>

      <SearchServicesSection />

      <Modal
        className="patient-details-modal"
        title={null}
        open={isPatientDetailsModalOpen}
        onCancel={handleClosePatientModal}
        footer={null}
        width={900}
        centered
        destroyOnHidden
      >
        {selectedPatient ? <PatientDetailsPanel patient={selectedPatient} /> : null}
      </Modal>
    </>
  );
}
