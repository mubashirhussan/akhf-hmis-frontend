'use client';

import { ConfigProvider } from 'antd';

const HMIS_PRIMARY = '#026BB1';
const HMIS_PRIMARY_HOVER = '#015a9a';
const HMIS_PRIMARY_ACTIVE = '#014d85';

const hmisTheme = {
  token: {
    colorPrimary: HMIS_PRIMARY,
    colorLink: HMIS_PRIMARY,
    colorInfo: HMIS_PRIMARY,
    borderRadius: 6,
    fontFamily: 'var(--font-poppins), Poppins, system-ui, sans-serif',
  },
  components: {
    Button: {
      colorPrimary: HMIS_PRIMARY,
      colorPrimaryHover: HMIS_PRIMARY_HOVER,
      colorPrimaryActive: HMIS_PRIMARY_ACTIVE,
      primaryColor: '#ffffff',
    },
    Radio: {
      colorPrimary: HMIS_PRIMARY,
    },
    Checkbox: {
      colorPrimary: HMIS_PRIMARY,
    },
    Select: {
      colorPrimary: HMIS_PRIMARY,
      optionSelectedBg: '#e8f4fc',
      optionSelectedColor: HMIS_PRIMARY,
    },
    DatePicker: {
      colorPrimary: HMIS_PRIMARY,
    },
    Pagination: {
      colorPrimary: HMIS_PRIMARY,
    },
    Switch: {
      colorPrimary: HMIS_PRIMARY,
    },
  },
};

export default function AntdConfigProvider({ children }) {
  return <ConfigProvider theme={hmisTheme}>{children}</ConfigProvider>;
}
