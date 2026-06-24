"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { App, Form } from "antd";
import AppTabs from "@/components/ui/AppTabs";
import {
  useCreateEmployeeMutation,
  useUpdateEmployeeInfoMutation,
  useSaveEmployeeCertificatesMutation,
  useSaveEmployeeDocumentsMutation,
  useSaveEmployeeSkillsMutation,
  useSaveEmployeeRelationshipsMutation,
} from "@/features/human-resource/api/employeeApi";
import EmployeeTabActions from "./components/EmployeeTabActions";
import {
  DEFAULT_OPEN_PANELS,
  EMPLOYEE_ENTRY_TABS,
  EMPLOYEE_INFO_FIELD_NAMES,
  EMPLOYEE_LIST_TAB_FIELDS,
  TAB_SAVE_LABELS,
  TAB_SAVE_SUCCESS_MESSAGES,
  initialValues,
  getNextEmployeeEntryTab,
} from "./employee-entry-config";
import EmployeeInfoTab, {
  EMPLOYEE_INFO_FIELD_PANEL_MAP,
} from "./tabs/EmployeeInfoTab";
import EmployeeCertificatesTab from "./tabs/EmployeeCertificatesTab";
import EmployeeDocumentsTab from "./tabs/EmployeeDocumentsTab";
import EmployeeSkillsTab from "./tabs/EmployeeSkillsTab";
import EmployeeRelationshipTab from "./tabs/EmployeeRelationshipTab";

function calculateAge(day, month, year) {
  if (!day || !month || !year) {
    return "0 Years";
  }

  const birthDate = new Date(Number(year), Number(month) - 1, Number(day));
  if (Number.isNaN(birthDate.getTime())) {
    return "0 Years";
  }

  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDifference = today.getMonth() - birthDate.getMonth();
  const hasBirthdayPassed =
    monthDifference > 0 ||
    (monthDifference === 0 && today.getDate() >= birthDate.getDate());

  if (!hasBirthdayPassed) {
    age -= 1;
  }

  return `${Math.max(age, 0)} Years`;
}

function pickEmployeeInfoValues(values) {
  return EMPLOYEE_INFO_FIELD_NAMES.reduce((acc, fieldName) => {
    if (fieldName in values) {
      acc[fieldName] = values[fieldName];
    }
    return acc;
  }, {});
}

export default function EmployeeEntryPage() {
  const { message } = App.useApp();
  const [form] = Form.useForm();
  const [createEmployee, { isLoading: isCreating }] =
    useCreateEmployeeMutation();
  const [updateEmployeeInfo, { isLoading: isUpdatingInfo }] =
    useUpdateEmployeeInfoMutation();
  const [saveCertificates, { isLoading: isSavingCertificates }] =
    useSaveEmployeeCertificatesMutation();
  const [saveDocuments, { isLoading: isSavingDocuments }] =
    useSaveEmployeeDocumentsMutation();
  const [saveSkills, { isLoading: isSavingSkills }] =
    useSaveEmployeeSkillsMutation();
  const [saveRelationships, { isLoading: isSavingRelationships }] =
    useSaveEmployeeRelationshipsMutation();

  const [employeeId, setEmployeeId] = useState(null);
  const [activeTab, setActiveTab] = useState(EMPLOYEE_ENTRY_TABS.INFO);
  const [activePanels, setActivePanels] = useState(DEFAULT_OPEN_PANELS);
  const [fileList, setFileList] = useState([]);
  const [photoPreview, setPhotoPreview] = useState("");

  const birthDay = Form.useWatch("birthDay", form);
  const birthMonth = Form.useWatch("birthMonth", form);
  const birthYear = Form.useWatch("birthYear", form);

  const isEmployeeSaved = Boolean(employeeId);

  const ageLabel = useMemo(
    () => calculateAge(birthDay, birthMonth, birthYear),
    [birthDay, birthMonth, birthYear],
  );

  const savingTab = useMemo(() => {
    if (isCreating || isUpdatingInfo) return EMPLOYEE_ENTRY_TABS.INFO;
    if (isSavingCertificates) return EMPLOYEE_ENTRY_TABS.CERTIFICATES;
    if (isSavingDocuments) return EMPLOYEE_ENTRY_TABS.DOCUMENTS;
    if (isSavingSkills) return EMPLOYEE_ENTRY_TABS.SKILLS;
    if (isSavingRelationships) return EMPLOYEE_ENTRY_TABS.RELATIONSHIP;
    return null;
  }, [
    isCreating,
    isUpdatingInfo,
    isSavingCertificates,
    isSavingDocuments,
    isSavingSkills,
    isSavingRelationships,
  ]);

  useEffect(() => {
    return () => {
      if (photoPreview.startsWith("blob:")) {
        URL.revokeObjectURL(photoPreview);
      }
    };
  }, [photoPreview]);

  const handleValidationError = useCallback(
    (errorFields, tabKey) => {
      if (!errorFields?.length) {
        return false;
      }

      if (tabKey === EMPLOYEE_ENTRY_TABS.INFO) {
        const panelsToOpen = new Set(activePanels);
        for (const field of errorFields) {
          const fieldName = Array.isArray(field.name)
            ? field.name[0]
            : field.name;
          const panel = EMPLOYEE_INFO_FIELD_PANEL_MAP[fieldName];
          if (panel) {
            panelsToOpen.add(panel);
          }
        }
        setActivePanels([...panelsToOpen]);
      }

      const firstInvalidName = errorFields[0].name;
      window.setTimeout(() => {
        form.scrollToField(firstInvalidName, {
          behavior: "smooth",
          block: "center",
        });
      }, 100);

      return true;
    },
    [activePanels, form],
  );

  const handleSaveInfo = async () => {
    try {
      const values = await form.validateFields(EMPLOYEE_INFO_FIELD_NAMES);
      const payload = {
        ...pickEmployeeInfoValues(values),
        picture: fileList[0]?.name ?? null,
        age: ageLabel,
      };

      if (employeeId) {
        await updateEmployeeInfo({ id: employeeId, ...payload }).unwrap();
      } else {
        const created = await createEmployee(payload).unwrap();
        setEmployeeId(created.id);
      }

      message.success(TAB_SAVE_SUCCESS_MESSAGES[EMPLOYEE_ENTRY_TABS.INFO]);

      const nextTab = getNextEmployeeEntryTab(EMPLOYEE_ENTRY_TABS.INFO);
      if (nextTab) {
        setActiveTab(nextTab);
      }
    } catch (error) {
      if (handleValidationError(error?.errorFields, EMPLOYEE_ENTRY_TABS.INFO)) {
        message.error("Please complete all required fields");
        return;
      }
      message.error("Failed to save employee info");
    }
  };

  const handleSaveListTab = async (tabKey) => {
    if (!employeeId) {
      message.warning("Please save employee info first");
      return;
    }

    const listName = EMPLOYEE_LIST_TAB_FIELDS[tabKey];

    try {
      const rows = form.getFieldValue(listName) ?? [];
      if (rows.length > 0) {
        await form.validateFields([listName]);
      }

      const payload = { id: employeeId, [listName]: rows };

      if (tabKey === EMPLOYEE_ENTRY_TABS.CERTIFICATES) {
        await saveCertificates(payload).unwrap();
      } else if (tabKey === EMPLOYEE_ENTRY_TABS.DOCUMENTS) {
        await saveDocuments(payload).unwrap();
      } else if (tabKey === EMPLOYEE_ENTRY_TABS.SKILLS) {
        await saveSkills(payload).unwrap();
      } else if (tabKey === EMPLOYEE_ENTRY_TABS.RELATIONSHIP) {
        await saveRelationships(payload).unwrap();
      }

      message.success(TAB_SAVE_SUCCESS_MESSAGES[tabKey]);

      const nextTab = getNextEmployeeEntryTab(tabKey);
      if (nextTab) {
        setActiveTab(nextTab);
      }
    } catch (error) {
      if (handleValidationError(error?.errorFields, tabKey)) {
        message.error("Please complete all required fields");
        return;
      }
      message.error(`Failed to save ${TAB_SAVE_LABELS[tabKey].toLowerCase()}`);
    }
  };

  const handleTabChange = useCallback(
    (key) => {
      if (!isEmployeeSaved && key !== EMPLOYEE_ENTRY_TABS.INFO) {
        return;
      }
      setActiveTab(key);
    },
    [isEmployeeSaved],
  );

  const resolvedActiveTab =
    !isEmployeeSaved && activeTab !== EMPLOYEE_ENTRY_TABS.INFO
      ? EMPLOYEE_ENTRY_TABS.INFO
      : activeTab;

  const handleClearInfo = () => {
    form.setFieldsValue(
      EMPLOYEE_INFO_FIELD_NAMES.reduce((acc, fieldName) => {
        acc[fieldName] = initialValues[fieldName];
        return acc;
      }, {}),
    );
    setActivePanels(DEFAULT_OPEN_PANELS);
    setFileList([]);

    if (photoPreview.startsWith("blob:")) {
      URL.revokeObjectURL(photoPreview);
    }
    setPhotoPreview("");
    setEmployeeId(null);
    setActiveTab(EMPLOYEE_ENTRY_TABS.INFO);
    message.info("Employee info cleared");
  };

  const handleClearListTab = (tabKey) => {
    const listName = EMPLOYEE_LIST_TAB_FIELDS[tabKey];
    form.setFieldValue(listName, []);
    message.info(`${TAB_SAVE_LABELS[tabKey]} cleared`);
  };

  const tabItems = useMemo(
    () => [
      {
        key: EMPLOYEE_ENTRY_TABS.INFO,
        label: "Employee Info",
        children: (
          <>
            <EmployeeInfoTab
              activePanels={activePanels}
              onPanelsChange={setActivePanels}
              ageLabel={ageLabel}
              fileList={fileList}
              onFileListChange={setFileList}
              photoPreview={photoPreview}
              onPhotoPreviewChange={setPhotoPreview}
            />
            <EmployeeTabActions
              saveLabel={TAB_SAVE_LABELS[EMPLOYEE_ENTRY_TABS.INFO]}
              loading={savingTab === EMPLOYEE_ENTRY_TABS.INFO}
              onClear={handleClearInfo}
              onSave={handleSaveInfo}
            />
          </>
        ),
      },
      {
        key: EMPLOYEE_ENTRY_TABS.CERTIFICATES,
        label: "Certificates",
        disabled: !isEmployeeSaved,
        children: (
          <>
            <EmployeeCertificatesTab />
            <EmployeeTabActions
              saveLabel={TAB_SAVE_LABELS[EMPLOYEE_ENTRY_TABS.CERTIFICATES]}
              loading={savingTab === EMPLOYEE_ENTRY_TABS.CERTIFICATES}
              onClear={() =>
                handleClearListTab(EMPLOYEE_ENTRY_TABS.CERTIFICATES)
              }
              onSave={() => handleSaveListTab(EMPLOYEE_ENTRY_TABS.CERTIFICATES)}
            />
          </>
        ),
      },
      {
        key: EMPLOYEE_ENTRY_TABS.DOCUMENTS,
        label: "Documents",
        disabled: !isEmployeeSaved,
        children: (
          <>
            <EmployeeDocumentsTab />
            <EmployeeTabActions
              saveLabel={TAB_SAVE_LABELS[EMPLOYEE_ENTRY_TABS.DOCUMENTS]}
              loading={savingTab === EMPLOYEE_ENTRY_TABS.DOCUMENTS}
              onClear={() => handleClearListTab(EMPLOYEE_ENTRY_TABS.DOCUMENTS)}
              onSave={() => handleSaveListTab(EMPLOYEE_ENTRY_TABS.DOCUMENTS)}
            />
          </>
        ),
      },
      {
        key: EMPLOYEE_ENTRY_TABS.SKILLS,
        label: "Skills",
        disabled: !isEmployeeSaved,
        children: (
          <>
            <EmployeeSkillsTab />
            <EmployeeTabActions
              saveLabel={TAB_SAVE_LABELS[EMPLOYEE_ENTRY_TABS.SKILLS]}
              loading={savingTab === EMPLOYEE_ENTRY_TABS.SKILLS}
              onClear={() => handleClearListTab(EMPLOYEE_ENTRY_TABS.SKILLS)}
              onSave={() => handleSaveListTab(EMPLOYEE_ENTRY_TABS.SKILLS)}
            />
          </>
        ),
      },
      {
        key: EMPLOYEE_ENTRY_TABS.RELATIONSHIP,
        label: "Relationship",
        disabled: !isEmployeeSaved,
        children: (
          <>
            <EmployeeRelationshipTab />
            <EmployeeTabActions
              saveLabel={TAB_SAVE_LABELS[EMPLOYEE_ENTRY_TABS.RELATIONSHIP]}
              loading={savingTab === EMPLOYEE_ENTRY_TABS.RELATIONSHIP}
              onClear={() =>
                handleClearListTab(EMPLOYEE_ENTRY_TABS.RELATIONSHIP)
              }
              onSave={() => handleSaveListTab(EMPLOYEE_ENTRY_TABS.RELATIONSHIP)}
            />
          </>
        ),
      },
    ],
    [activePanels, ageLabel, fileList, handleSaveInfo, isEmployeeSaved, photoPreview, savingTab],
  );

  return (
    <div className="patient-registration-page employee-entry-page">
      <Form
        form={form}
        layout="vertical"
        className="patient-registration-form employee-entry-form"
        requiredMark={false}
        scrollToFirstError
        initialValues={initialValues}
      >
        <AppTabs
          items={tabItems}
          activeKey={resolvedActiveTab}
          onChange={handleTabChange}
          className="employee-entry-tabs"
          cardClassName="employee-entry-tabs-panel"
        />
      </Form>
    </div>
  );
}
