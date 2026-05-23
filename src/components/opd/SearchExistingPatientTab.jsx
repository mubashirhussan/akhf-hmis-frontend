'use client';

import { useMemo, useState } from 'react';
import {
  Avatar,
  Button,
  Col,
  ConfigProvider,
  Descriptions,
  Empty,
  Input,
  Row,
  Select,
  Typography,
} from 'antd';
import { FileTextOutlined, SearchOutlined, UserOutlined } from '@ant-design/icons';
import AppIcon from '@/components/icons/AppIcon';
import {
  MOCK_WALK_IN_PATIENTS,
  searchWalkInPatients,
} from '@/data/mock-walk-in-patients';
import SearchServicesSection from '@/components/opd/SearchServicesSection';
import HmisCard from '../ui/HmisCard';

const { Title, Text } = Typography;

const SEARCH_BY_OPTIONS = [
  { value: 'registration', label: 'Registration No' },
  { value: 'mobile', label: 'Mobile No' },
];

const SEARCH_PLACEHOLDERS = {
  registration: 'Enter registration number',
  mobile: 'Enter mobile number',
};

function PatientMetric({ label, value }) {
  return (
    <div className="walk-in-patient-metric">
      <span className="walk-in-patient-metric-label">{label}</span>
      <span className="walk-in-patient-metric-value">{value}</span>
    </div>
  );
}

function PatientListItem({ patient, selected, onSelect }) {
  const initials = patient.name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <button
      type="button"
      onClick={() => onSelect(patient)}
      className={`walk-in-patient-row ${selected ? 'walk-in-patient-row--selected' : ''}`}
    >
      <Avatar size={48} className="walk-in-patient-avatar shrink-0">
        {initials}
      </Avatar>
      <div className="walk-in-patient-row-main min-w-0 flex-1">
        <p className="walk-in-patient-name">{patient.name}</p>
        <p className="walk-in-patient-reg">{patient.registrationNo}</p>
      </div>
      <div className="walk-in-patient-row-stats">
        <div className="walk-in-patient-gender">
          <span className="walk-in-patient-gender-icon" aria-hidden>
            <AppIcon
              icon={patient.gender === 'Female' ? 'mdi:gender-female' : 'mdi:gender-male'}
              className="h-4 w-4"
            />
          </span>
          <PatientMetric label="GENDER" value={patient.gender} />
        </div>
        <PatientMetric label="AGE" value={patient.ageLabel} />
        <PatientMetric label="WEIGHT" value={patient.weight} />
      </div>
    </button>
  );
}

function VisitSummaryCards({ summary }) {
  const cards = [
    { key: 'visits', label: 'Total Visits', value: summary.totalVisits, tone: 'default' },
    { key: 'last', label: 'Last Visit', value: summary.lastVisit, tone: 'default' },
    { key: 'services', label: 'Total Services', value: summary.totalServices, tone: 'success' },
    { key: 'charges', label: 'Total Charges', value: summary.totalCharges, tone: 'primary' },
  ];

  return (
    <div className="walk-in-visit-summary-grid">
      {cards.map((card) => (
        <div key={card.key} className="walk-in-visit-summary-card">
          <span className="walk-in-visit-summary-label">{card.label}</span>
          <span className={`walk-in-visit-summary-value walk-in-visit-summary-value--${card.tone}`}>
            {card.value}
          </span>
        </div>
      ))}
    </div>
  );
}

function PatientDetailsPanel({ patient }) {
  const items = [
    { key: 'reg', label: 'Registration No', children: patient.displayRegNo },
    { key: 'name', label: 'Patient Name', children: patient.name },
    { key: 'mobile', label: 'Mobile No', children: patient.mobile },
    { key: 'cnic', label: 'CNIC', children: patient.cnic },
    {
      key: 'ageGender',
      label: 'Age / Gender',
      children: `${patient.age} Years / ${patient.gender}`,
    },
    { key: 'address', label: 'Address', children: patient.address },
    { key: 'visit', label: 'Visit Date & Time', children: patient.visitDateTime },
  ];

  return (
    <div className="walk-in-details-panel">
      <div className="walk-in-panel-header">
        <UserOutlined className="walk-in-panel-header-icon" />
        <span className="walk-in-panel-header-title">Patient Details</span>
      </div>
      <Descriptions
        className="walk-in-descriptions"
        column={1}
        colon={false}
        items={items}
      />
      <div className="walk-in-panel-header walk-in-panel-header--spaced">
        <FileTextOutlined className="walk-in-panel-header-icon" />
        <span className="walk-in-panel-header-title">Visit Summary</span>
      </div>
      <VisitSummaryCards summary={patient.visitSummary} />
    </div>
  );
}

export default function SearchExistingPatientTab() {
  const [searchBy, setSearchBy] = useState('registration');
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);

  const placeholder = SEARCH_PLACEHOLDERS[searchBy];

  const handleSearch = () => {
    const matched = searchWalkInPatients(MOCK_WALK_IN_PATIENTS, searchBy, searchQuery);
    setResults(matched);
    setHasSearched(true);
    setSelectedPatient(null);
  };

  const totalLabel = useMemo(() => {
    if (!hasSearched) return 'Total : 0';
    return `Total : ${results.length}`;
  }, [hasSearched, results.length]);

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#026BB1',
          fontFamily: 'var(--font-poppins), Poppins, system-ui, sans-serif',
          borderRadius: 6,
        },
      }}
    >
      <HmisCard className='rounded-tl-none'>
 <div className="walk-in-search-layout">
        <Row gutter={[24, 24]}>
          <Col xs={24} xl={15}>
            <section className="walk-in-search-section">
              <Title level={5} className="walk-in-section-title">
                Search Registration
              </Title>
              <Text className="walk-in-section-subtitle">
                Search patient by registration number or mobile number.
              </Text>

              <Row gutter={[12, 12]} align="bottom" className="walk-in-search-form">
                <Col xs={24} sm={8} md={7}>
                  <label className="walk-in-field-label" htmlFor="walk-in-search-by">
                    Search By
                  </label>
                  <Select
                    id="walk-in-search-by"
                    className="w-full"
                    value={searchBy}
                    options={SEARCH_BY_OPTIONS}
                    onChange={(value) => {
                      setSearchBy(value);
                      setSearchQuery('');
                    }}
                  />
                </Col>
                <Col xs={24} sm={10} md={11}>
                  <label className="walk-in-field-label" htmlFor="walk-in-search-query">
                    &nbsp;
                  </label>
                  <Input
                    id="walk-in-search-query"
                    placeholder={placeholder}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onPressEnter={handleSearch}
                  />
                </Col>
                <Col xs={24} sm={6} md={6}>
                  <Button
                    type="primary"
                    icon={<SearchOutlined />}
                    className="walk-in-search-btn w-full"
                    onClick={handleSearch}
                  >
                    Search
                  </Button>
                </Col>
              </Row>
            </section>

            <section className="walk-in-patient-list-panel">
              <div className="walk-in-patient-list-header">
                <div className="flex items-center gap-2">
                  <UserOutlined className="walk-in-patient-list-header-icon" />
                  <span className="walk-in-patient-list-header-title">
                    No of Registered Patients
                  </span>
                </div>
                <span className="walk-in-patient-list-total">{totalLabel}</span>
              </div>

              <div className="walk-in-patient-list-body">
                {!hasSearched ? (
                  <Empty
                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                    description="Search to view registered patients"
                    className="py-10"
                  />
                ) : results.length === 0 ? (
                  <Empty
                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                    description="No patients found"
                    className="py-10"
                  />
                ) : (
                  results.map((patient) => (
                    <PatientListItem
                      key={patient.id}
                      patient={patient}
                      selected={selectedPatient?.id === patient.id}
                      onSelect={setSelectedPatient}
                    />
                  ))
                )}
              </div>
            </section>
          </Col>

          <Col xs={24} xl={9}>
            {selectedPatient ? (
              <PatientDetailsPanel patient={selectedPatient} />
            ) : (
              <div className="walk-in-details-empty">
                <Empty
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                  description={
                    hasSearched && results.length > 0
                      ? 'Select a patient to view details'
                      : 'Patient details will appear here'
                  }
                />
              </div>
            )}
          </Col>
        </Row>

      </div>
      </HmisCard>
        <SearchServicesSection />
     
    </ConfigProvider>
  );
}
