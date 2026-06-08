"use client";

import { ConfigProvider } from "antd";

const APP_PRIMARY = "#026BB1";
const APP_PRIMARY_HOVER = "#015a9a";
const APP_PRIMARY_ACTIVE = "#014d85";

const fieldTokens = {
  controlHeight: 32,
  borderRadius: 8,
  fontSize: 14,
  colorBorder: "#d8dee9",
  hoverBorderColor: "#b8c4d4",
  activeBorderColor: APP_PRIMARY,
  colorText: "#000000",
  colorTextPlaceholder: "#6c6c6c",
  lineHeight: 1.25,
};

const appTheme = {
  token: {
    colorPrimary: APP_PRIMARY,
    colorLink: APP_PRIMARY,
    colorInfo: APP_PRIMARY,
    colorWhite: "#ffffff",
    borderRadius: 6,
    fontSize: 14,
    fontFamily: "var(--font-poppins), Poppins, system-ui, sans-serif",
  },
  components: {
    Input: fieldTokens,
    Button: {
      colorPrimary: APP_PRIMARY,
      colorPrimaryHover: APP_PRIMARY_HOVER,
      colorPrimaryActive: APP_PRIMARY_ACTIVE,
      primaryColor: "#ffffff",
    },
    Radio: {
      colorPrimary: APP_PRIMARY,
    },
    Checkbox: {
      colorPrimary: APP_PRIMARY,
      colorWhite: "#ffffff",
    },
    Select: {
      ...fieldTokens,
      colorPrimary: APP_PRIMARY,
      optionSelectedBg: "#e8f4fc",
      optionSelectedColor: APP_PRIMARY,
    },
    DatePicker: {
      ...fieldTokens,
      colorPrimary: APP_PRIMARY,
    },
    Pagination: {
      colorPrimary: APP_PRIMARY,
      fontSize: 14,
    },
    Table: {
      fontSize: 14,
      cellFontSize: 14,
    },
    Switch: {
      colorPrimary: APP_PRIMARY,
    },
    Form: {
      labelFontSize: 14,
      verticalLabelPadding: '0 0 4px',
      itemMarginBottom: 8,
    },
  },
};

export default function AntdConfigProvider({ children }) {
  return <ConfigProvider theme={appTheme}>{children}</ConfigProvider>;
}
