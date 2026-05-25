"use client";

import { ConfigProvider } from "antd";

const HMIS_PRIMARY = "#026BB1";
const HMIS_PRIMARY_HOVER = "#015a9a";
const HMIS_PRIMARY_ACTIVE = "#014d85";

const hmisFieldTokens = {
  controlHeight: 40,
  borderRadius: 8,
  fontSize: 11,
  colorBorder: "#d8dee9",
  hoverBorderColor: "#b8c4d4",
  activeBorderColor: HMIS_PRIMARY,
  colorText: "#000000",
  colorTextPlaceholder: "#6c6c6c",
  paddingInline: 11,
  paddingBlock: 8,
};

const hmisTheme = {
  token: {
    colorPrimary: HMIS_PRIMARY,
    colorLink: HMIS_PRIMARY,
    colorInfo: HMIS_PRIMARY,
    colorWhite: "#ffffff",
    borderRadius: 6,
    fontFamily: "var(--font-poppins), Poppins, system-ui, sans-serif",
  },
  components: {
    Input: hmisFieldTokens,
    Button: {
      colorPrimary: HMIS_PRIMARY,
      colorPrimaryHover: HMIS_PRIMARY_HOVER,
      colorPrimaryActive: HMIS_PRIMARY_ACTIVE,
      primaryColor: "#ffffff",
    },
    Radio: {
      colorPrimary: HMIS_PRIMARY,
    },
    Checkbox: {
      colorPrimary: HMIS_PRIMARY,
      colorWhite: "#ffffff",
    },
    Select: {
      ...hmisFieldTokens,
      colorPrimary: HMIS_PRIMARY,
      optionSelectedBg: "#e8f4fc",
      optionSelectedColor: HMIS_PRIMARY,
    },
    DatePicker: {
      ...hmisFieldTokens,
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
