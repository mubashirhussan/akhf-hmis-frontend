import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { env } from '@/config/env';

export const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({ baseUrl: env.apiBaseUrl }),
  tagTypes: [
    'MainGroup',
    'SubGroup',
    'TestName',
    'PathologyComponent',
    'PathologyTestRange',
    "TestBooking",
    'ReportConsultant',
    'Interpretation',
    'MachineIntegrationCompwise',
    'PathologyLookups',
    'LaboratoryWorklist',
    'WalkInPatient',
    'WalkInService',
    'BillingVisit',
    'BillingVisitServices',
    'ServiceAdmin',
    'Employee',
    'Hospital',
    'DeptType',
    'Department',
    'SubDeptType',
    'SubDepartment',
    'Designation',
    'Receptionist'
    'Visiting'
  ],
  endpoints: () => ({}),
});
