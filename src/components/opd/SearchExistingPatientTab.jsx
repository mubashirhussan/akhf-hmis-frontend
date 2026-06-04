'use client';

import { useMemo, useState } from 'react';
import { Avatar, Button, Input, message, Modal } from 'antd';
import HmisDetailSection from '@/components/ui/HmisDetailSection';
import HmisTable from '@/components/ui/HmisTable';
import { SearchOutlined, UserOutlined } from '@ant-design/icons';
import {
  MOCK_WALK_IN_PATIENTS,
  searchWalkInPatients,
} from '@/data/mock-walk-in-patients';
import SearchServicesSection from '@/components/opd/SearchServicesSection';
import { HMIS_FIELD_CONTROL_CLASS } from '@/lib/hmis-field-control';
import { validateWalkInPatientSearch } from '@/lib/walk-in-search-validation';

function PatientDetailsPanel({ patient }) {
  const { visitSummary } = patient;

  const patientFields = [
    { key: 'mr', label: 'MR No', value: patient.registrationNo },
    { key: 'name', label: 'Patient Name', value: patient.name },
    { key: 'gender', label: 'Gender', value: patient.gender },
    { key: 'age', label: 'Age', value: patient.ageLabel },
    { key: 'mobile', label: 'Mobile No', value: patient.mobile },
    { key: 'cnic', label: 'CNIC', value: patient.cnic },
    { key: 'reg', label: 'Registration No', value: patient.displayRegNo },
    { key: 'visit', label: 'Visit Date & Time', value: patient.visitDateTime },
    { key: 'address', label: 'Address', value: patient.address, span: 4 },
  ];

  const visitFields = [
    { key: 'visits', label: 'Total Visits', value: visitSummary.totalVisits },
    { key: 'last', label: 'Last Visit', value: visitSummary.lastVisit },
    { key: 'services', label: 'Total Services', value: visitSummary.totalServices },
    { key: 'charges', label: 'Total Charges', value: visitSummary.totalCharges },
  ];

  return (
    <div className="hmis-patient-details">
      <HmisDetailSection title="Patient Details" fields={patientFields} />
      <HmisDetailSection
        title="Visit Summary"
        fields={visitFields}
        className="hmis-detail-section--last"
      />
    </div>
  );
}

export default function SearchExistingPatientTab() {
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
      registrationNo: mrNo,
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
            style={{ backgroundColor: '#E6F1FA', color: '#026BB1', fontSize: 12 }}
            icon={!record.picture ? <UserOutlined /> : null}
          >
            {!record.picture ? initials : null}
          </Avatar>
        );
      },
    },
    {
      title: 'MR No',
      dataIndex: 'registrationNo',
      key: 'registrationNo',
      width: 160,
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
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
            className={HMIS_FIELD_CONTROL_CLASS}
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
            className={HMIS_FIELD_CONTROL_CLASS}
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
        <div className="hmis-section-header hmis-section-header--inline mt-4">
          <div className="hmis-section-header-text">
            <h2 className="hmis-section-title">No of Registered Patients</h2>
            {/* <p className="hmis-section-description">{patientCountLabel}</p> */}
          </div>
          <div className="hmis-section-header-extra">{searchFields}</div>
        </div>
        <HmisTable
          className="hmis-table--patient-list"
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
            className: selectedPatient?.id === record.id ? 'hmis-table-row--selected' : undefined,
          })}
        />
      </section>

      <SearchServicesSection />

      <Modal
        className="hmis-patient-details-modal"
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
