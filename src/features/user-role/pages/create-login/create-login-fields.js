import { MAIN_PAGE_OPTIONS } from '@/features/user-role/api/mock-create-login';

export const CREATE_LOGIN_INITIAL_VALUES = {
  departmentId: undefined,
  subDepartmentId: undefined,
  employeeId: undefined,
  mainPage: undefined,
  branchAccess: false,
  userName: '',
  password: '',
  confirmPassword: '',
};

export const BRANCH_ACCESS_OPTIONS = [
  { value: true, label: 'Yes' },
  { value: false, label: 'No' },
];

export function getCreateLoginFields({
  departmentOptions = [],
  subDepartmentOptions = [],
  employeeOptions = [],
  hasDepartment = false,
  hasSubDepartment = false,
} = {}) {
  return [
    {
      type: 'select',
      name: 'departmentId',
      label: 'Department',
      col: 6,
      options: departmentOptions,
      rules: [{ required: true, message: 'Department is required.' }],
      props: {
        showSearch: true,
        optionFilterProp: 'label',
        placeholder: 'Select department',
      },
    },
    {
      type: 'select',
      name: 'subDepartmentId',
      label: 'Sub Department',
      col: 6,
      options: subDepartmentOptions,
      rules: [{ required: true, message: 'Sub Department is required.' }],
      props: {
        showSearch: true,
        optionFilterProp: 'label',
        placeholder: 'Select sub department',
        disabled: !hasDepartment,
      },
    },
    {
      type: 'select',
      name: 'employeeId',
      label: 'Employee',
      col: 6,
      options: employeeOptions,
      rules: [{ required: true, message: 'Employee is required.' }],
      props: {
        showSearch: true,
        optionFilterProp: 'label',
        placeholder: 'Select employee',
        disabled: !hasSubDepartment,
      },
    },
    {
      type: 'select',
      name: 'mainPage',
      label: 'Select Main page',
      col: 6,
      options: MAIN_PAGE_OPTIONS,
      rules: [{ required: true, message: 'Main page is required.' }],
      props: {
        showSearch: true,
        optionFilterProp: 'label',
        placeholder: 'Select main page',
      },
    },
    {
      type: 'select',
      name: 'branchAccess',
      label: 'Branch Access',
      col: 6,
      options: BRANCH_ACCESS_OPTIONS,
    },
    {
      type: 'text',
      name: 'userName',
      label: 'User name',
      col: 6,
      rules: [{ required: true, whitespace: true, message: 'User name is required.' }],
      props: { autoComplete: 'off' },
    },
    {
      type: 'password',
      name: 'password',
      label: 'Create a password',
      col: 6,
      rules: [{ required: true, message: 'Password is required.' }],
      props: { autoComplete: 'new-password' },
    },
    {
      type: 'password',
      name: 'confirmPassword',
      label: 'Confirm your password',
      col: 6,
      dependencies: ['password'],
      rules: [
        { required: true, message: 'Confirm password is required.' },
        ({ getFieldValue }) => ({
          validator(_, value) {
            if (!value || getFieldValue('password') === value) {
              return Promise.resolve();
            }
            return Promise.reject(new Error('Passwords do not match.'));
          },
        }),
      ],
      props: { autoComplete: 'new-password' },
    },
  ];
}
