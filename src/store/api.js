import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { env } from '@/config/env';
import { logout } from '@/store/authSlice';

const baseQuery = fetchBaseQuery({
  baseUrl: env.apiBaseUrl,
  prepareHeaders: (headers, { getState }) => {
    const token = getState().auth?.token;
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
    return headers;
  },
});

async function baseQueryWithAuth(args, api, extraOptions) {
  const result = await baseQuery(args, api, extraOptions);
  if (result.error?.status === 401) {
    api.dispatch(logout());
  }
  return result;
}

export const api = createApi({
  reducerPath: 'api',
  baseQuery: baseQueryWithAuth,
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
    'Receptionist',
    'Visiting',
    'Shift',
    'AdminDutyRoaster',
    'AssignDutyToEmployee',
    'HospitalService',
    'Package'
  ],
  endpoints: () => ({}),
});
