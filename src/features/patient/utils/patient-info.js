function buildFromBillingVisit(visit = {}) {
  const nameParts = String(visit?.patientName ?? '').trim().split(/\s+/);
  const firstName = nameParts[0] ?? 'Patient';

  return {
    displayName: `Mr. ${firstName}`,
    relationPrefix: visit?.relation ?? 'S/O',
    relationName: visit?.relationName ?? 'ABC',
    relationLine: `${visit?.relation ?? 'S/O'} ${visit?.relationName ?? ''}`.trim(),
    ageDetail: visit?.ageDetail ?? visit?.age ?? '22 Years 0M 5D',
    dob: visit?.dob ?? 'May 22, 2004',
    gender: visit?.gender ?? 'Male',
    department: visit?.plName ?? visit?.testDisplay ?? 'TEST TEST',
    mrNo:
      visit?.mrDisplay ??
      `AKHD-${String(visit?.regNo ?? '').replace(/\D/g, '').slice(-6) || '123456'}-01`,
    patientType: visit?.patientType ?? 'General',
    panelLimit: visit?.panelLimit ?? null,
    doctor: visit?.doctor ?? 'Dr SOHAIL AHMAD',
    checkupType: visit?.checkupType ?? 'Emergency',
  };
}

function buildFromLabRecord(record = {}) {
  const nameParts = String(record?.patientName ?? '').trim().split(/\s+/);
  const firstName = nameParts[0] ?? 'Patient';

  return {
    displayName: `Mr. ${firstName}`,
    relationPrefix: record?.relation ?? 'S/O',
    relationName: record?.relationName ?? '',
    relationLine: `${record?.relation ?? 'S/O'} ${record?.relationName ?? ''}`.trim(),
    ageDetail: record?.ageDetail ?? record?.age ?? '',
    dob: record?.dob ?? 'May 22, 2004',
    gender: record?.gender ?? 'Male',
    department: record?.testDisplay ?? record?.testName ?? 'TEST TEST',
    mrNo: record?.mrNo ?? '',
    patientType: record?.patientType ?? 'General',
    panelLimit: null,
    doctor: record?.doctor ?? 'Dr SOHAIL AHMAD',
    checkupType: record?.checkupType ?? record?.department ?? 'Emergency',
  };
}

export function buildPatientInfoSummary(source = {}) {
  if (source?.regNo != null) {
    return buildFromBillingVisit(source);
  }

  return buildFromLabRecord(source);
}
