'use client';

import { useMemo, useState } from 'react';
import { App, Avatar, Button, Input, Modal } from 'antd';
import DetailSection from '@/components/ui/DetailSection';
import DataTable from '@/components/ui/DataTable';
import { SearchOutlined, UserOutlined } from '@ant-design/icons';
import {
  useLazyGetPatientByIdQuery,
  useGetConsultantsQuery,
  useRegisterPatientWithVisitMutation,
} from '@/features/opd/api/opdEndpoints';
import SearchServicesSection from '@/features/opd/components/SearchServicesSection';
import { FIELD_CONTROL_CLASS } from '@/lib/field-control';

function mapApiPatient(raw) {
  const prefix = (raw.Prefix ?? '').trim();
  const nameParts = [raw.PFName, raw.PMName, raw.PLName].filter(Boolean).join(' ');
  const fullName = [prefix, nameParts].filter(Boolean).join(' ').trim();

  const genderMap = { 1: 'Male', 2: 'Female' };
  const gender = genderMap[raw.SexID] ?? 'Other';

  const ageType = (raw.AgeType ?? '').trim();
  const ageLabel = raw.Age ? `${raw.Age} ${ageType}`.trim() : '—';

  const visitDateTime = raw.RegDateTime
    ? new Date(raw.RegDateTime).toLocaleString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      })
    : '—';

  return {
    id: raw.id,
    mrNo: raw.RegNo,
    name: fullName || '—',
    gender,
    ageLabel,
    mobile: raw.MobilePhone ?? '—',
    cnic: raw.CNIC ?? '—',
    email: raw.email_address ?? '—',
    address: raw.StreetAddress ?? '—',
    patientType: raw.Patient_Type ?? '—',
    visitDateTime,
    picture: raw.Picture_Path ?? null,
    raw,
  };
}

function PatientDetailsPanel({ patient }) {
  const patientFields = [
    { key: 'mr',       label: 'Reg No',           value: patient.mrNo },
    { key: 'name',     label: 'Patient Name',      value: patient.name },
    { key: 'gender',   label: 'Gender',            value: patient.gender },
    { key: 'age',      label: 'Age',               value: patient.ageLabel },
    { key: 'mobile',   label: 'Mobile No',         value: patient.mobile },
    { key: 'cnic',     label: 'CNIC',              value: patient.cnic },
    { key: 'email',    label: 'Email',             value: patient.email },
    { key: 'type',     label: 'Patient Type',      value: patient.patientType },
    { key: 'visit',    label: 'Visit Date & Time', value: patient.visitDateTime },
    { key: 'address',  label: 'Address',           value: patient.address },
  ];

  return (
    <div className="patient-details">
      <DetailSection title="Patient Details" fields={patientFields} />
    </div>
  );
}

export default function SearchExistingPatientTab() {
  const { message } = App.useApp();
  const [regNo, setRegNo] = useState('');
  const [results, setResults] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [isPatientDetailsModalOpen, setIsPatientDetailsModalOpen] = useState(false);
  const [addedServices, setAddedServices] = useState([]);

  const [fetchPatient, { isLoading }] = useLazyGetPatientByIdQuery();
  const { data: consultantOptions = [] } = useGetConsultantsQuery();
  const [registerPatient, { isLoading: isSaving }] = useRegisterPatientWithVisitMutation();

  const handleSearch = async () => {
    const query = regNo.trim();
    if (!query) {
      message.error('Please enter a Registration No. to search');
      return;
    }

    const { data, error } = await fetchPatient(query);

    if (error || !data?.success || !data?.data) {
      setResults([]);
      setHasSearched(true);
      setSelectedPatient(null);
      setIsPatientDetailsModalOpen(false);
      message.error(data?.message ?? 'No patient found for this Registration No.');
      return;
    }

    const mapped = mapApiPatient(data.data);
    setResults([mapped]);
    setHasSearched(true);
    setSelectedPatient(null);
    setIsPatientDetailsModalOpen(false);
    setAddedServices([]);
  };

  const handleClear = () => {
    setRegNo('');
    setResults([]);
    setHasSearched(false);
    setSelectedPatient(null);
    setIsPatientDetailsModalOpen(false);
    setAddedServices([]);
  };

  const handlePatientSelect = (patient) => {
    setSelectedPatient(patient);
    setIsPatientDetailsModalOpen(true);
  };

  const handleClosePatientModal = () => {
    setIsPatientDetailsModalOpen(false);
  };

  const handleSave = async () => {
    if (!selectedPatient) {
      message.error('Please select a patient before saving services.');
      return;
    }

    if (addedServices.length === 0) {
      message.error('Please add at least one service before saving.');
      return;
    }

    const raw = selectedPatient.raw ?? {};
    const now = new Date().toISOString();
    const firstService = addedServices[0];
    const totalAmount = addedServices.reduce(
      (sum, row) => sum + row.price * row.quantity - row.discount,
      0,
    );

    const payload = {
      prefix: raw.Prefix ?? null,
      pfName: raw.PFName ?? null,
      pmName: raw.PMName ?? null,
      plName: raw.PLName ?? null,
      relation: raw.Relation ?? null,
      rfName: raw.RFName ?? null,
      rmName: raw.RMName ?? null,
      rlName: raw.RLName ?? null,
      sexID: raw.SexID ?? 0,
      age: raw.Age ?? 0,
      regDateTime: raw.RegDateTime ?? now,
      countryCode: raw.CountryCode ?? 0,
      provinceID: raw.ProvinceID ?? 0,
      districtID: raw.DistrictID ?? 0,
      tehsil: raw.Tehsil ?? 0,
      zipcode: raw.ZipCode ?? 0,
      house_No: raw.House_No ?? null,
      streetAddress: raw.StreetAddress ?? null,
      city: raw.City ?? null,
      colony: raw.Colony ?? null,
      homePhone: raw.HomePhone ?? null,
      mobilePhone: raw.MobilePhone ?? null,
      nic: raw.CNIC ?? null,
      dateOfBirth: raw.DateOfBirth ?? null,
      regNo: raw.RegNo ?? null,
      dateTime: now,
      deptID: raw.DeptID ?? 0,
      empID: firstService.doctorId ?? raw.EmpID ?? 0,
      diagonosis: raw.Diagonosis ?? null,
      patientType: raw.Patient_Type ?? null,
      ageType: raw.AgeType ?? null,
      referFrom: raw.ReferFrom ?? null,
      to_sub_Dept: raw.To_Sub_Dept ?? 0,
      patient_Type: raw.Patient_Type ?? null,
      pt_Cast: raw.Pt_Cast ?? null,
      payment_Status: raw.Payment_Status ?? null,
      passport_No: raw.Passport_No ?? null,
      email_address: raw.email_address ?? null,
      doctorID: firstService.doctorId ?? raw.DoctorID ?? 0,
      religion: raw.Religion ?? 0,
      nationality: raw.Nationality ?? 0,
      party_ID: raw.Party_ID ?? 0,
      party_Desg_ID: raw.Party_Desg_ID ?? 0,
      registrationType: raw.RegistrationType ?? null,
      emp_No: raw.Emp_No ?? null,
      room_No: raw.Room_No ?? null,
      s_ID: firstService.serviceId,
      amount: firstService.price,
      panelAmounts: totalAmount,
      hospital_Id: raw.Hospital_Id ?? 0,
      emp_DeptId: raw.Emp_DeptId ?? 0,
      emp_SubDeptId: raw.Emp_SubDeptId ?? 0,
      patient_Type_Id: raw.Patient_Type_Id ?? 0,
      referenceNo: raw.ReferenceNo ?? 0,
      doctor_Subdept_Id: raw.Doctor_Subdept_Id ?? 0,
      checkupType: raw.CheckupType ?? null,
    };

    try {
      const result = await registerPatient(payload).unwrap();
      if (result?.success) {
        message.success('Services saved successfully.');
        setAddedServices([]);
      } else {
        message.error(result?.message ?? 'Save failed. Please try again.');
      }
    } catch {
      message.error('Save failed. Please try again.');
    }
  };

  const handleCancel = () => {
    setAddedServices([]);
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
      title: 'Reg No',
      dataIndex: 'mrNo',
      key: 'mrNo',
      width: 180,
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
          <Input
            id="walk-in-search-reg"
            className={FIELD_CONTROL_CLASS}
            placeholder="e.g. AKK-000017-26"
            value={regNo}
            onChange={(e) => setRegNo(e.target.value)}
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
            loading={isLoading}
          >
            Search
          </Button>
          {(regNo || hasSearched) && (
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
          </div>
          <div className="section-header-extra">{searchFields}</div>
        </div>
        <DataTable
          className="data-table--patient-list"
          columns={patientColumns}
          dataSource={results}
          loading={isLoading}
          rowKey="id"
          columnAlign="left"
          pagination={false}
          locale={{
            emptyText: hasSearched
              ? 'No patient found'
              : 'Enter a Registration No. above and press Search',
          }}
          onRow={(record) => ({
            onClick: () => handlePatientSelect(record),
            className:
              selectedPatient?.id === record.id ? 'data-table-row--selected' : undefined,
          })}
        />
      </section>

      <SearchServicesSection
        addedServices={addedServices}
        onAddedServicesChange={setAddedServices}
        consultantOptions={consultantOptions}
        onSave={handleSave}
        onCancel={handleCancel}
        isSaving={isSaving}
      />

      <Modal
        className="patient-details-modal"
        title={null}
        open={isPatientDetailsModalOpen}
        onCancel={handleClosePatientModal}
        footer={null}
        width={1100}
        centered
        destroyOnHidden
      >
        {selectedPatient ? (
          <PatientDetailsPanel patient={selectedPatient} />
        ) : null}
      </Modal>
    </>
  );
}