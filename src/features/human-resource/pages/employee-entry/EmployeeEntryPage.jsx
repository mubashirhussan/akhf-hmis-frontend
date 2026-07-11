"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { App, Form } from "antd";
import AppTabs from "@/components/ui/AppTabs";
import { ROUTES } from "@/config/routes";
import {
  useCreateEmployeeMutation,
  useUpdateEmployeeInfoMutation,
    useSaveEmployeeEducationsMutation,
  useSaveEmployeeCertificatesMutation,
  useSaveEmployeeDocumentsMutation,
  useSaveEmployeeSkillsMutation,
  useSaveEmployeeRelationshipsMutation,
  useSaveEmployeeAdditionalInfosMutation,
  useSaveEmployeeCardsMutation,
  useSaveEmployeeEmpConfirmationsMutation,
  useSaveEmployeeResignationsMutation,
  useSaveEmployeeSuspensionsMutation,
  useSaveEmployeeContractsMutation,
  useSaveEmployeeAcImprovementsMutation,
  useSaveEmployeeProImprovementsMutation,
  useSaveEmployeeJobHistoriesMutation,
  useSaveEmployeeFileLabelsMutation,
  useSaveEmployeeEmpSummariesMutation,
  useSaveEmployeePromotionsMutation,
  useGetEmployeeQuery,
} from "@/features/human-resource/api/employeeApi";
import EmployeeTabActions from "./components/EmployeeTabActions";
import EmployeeEntryHeader from "./components/EmployeeEntryHeader";
import {
  DEFAULT_OPEN_PANELS,
  EMPLOYEE_ENTRY_TABS,
  EMPLOYEE_INFO_FIELD_NAMES,
  EMPLOYEE_LIST_TAB_FIELDS,
  TAB_SAVE_LABELS,
  TAB_SAVE_SUCCESS_MESSAGES,
  initialValues,
  getNextEmployeeEntryTab,
  employeeToFormValues,
  ensureFirstListRecord,
  shouldEnsureFirstListRecord,
} from "./employee-entry-config";
import EmployeeInfoTab, {
  EMPLOYEE_INFO_FIELD_PANEL_MAP,
} from "./tabs/EmployeeInfoTab";
import EmployeeEducationTab from './tabs/EmployeeEducationTab';
import EmployeeCertificatesTab from './tabs/EmployeeCertificatesTab';
import EmployeeDocumentsTab from './tabs/EmployeeDocumentsTab';
import EmployeeSkillsTab from './tabs/EmployeeSkillsTab';
import EmployeeRelationshipTab from './tabs/EmployeeRelationshipTab';
import EmployeeAdditionalInfoTab from './tabs/EmployeeAdditionalInfoTab';
import EmployeeCardTab from './tabs/EmployeeCardTab';
import EmployeeEmpConfirmationTab from './tabs/EmployeeEmpConfirmationTab';
import EmployeeResignationTab from './tabs/EmployeeResignationTab';
import EmployeeSuspensionTab from './tabs/EmployeeSuspensionTab';
import EmployeeContractTab from './tabs/EmployeeContractTab';
import EmployeeAcImprovementTab from './tabs/EmployeeAcImprovementTab';
import EmployeeProImprovementTab from './tabs/EmployeeProImprovementTab';
import EmployeeJobHistoryTab from './tabs/EmployeeJobHistoryTab';
import EmployeeFileLabelTab from './tabs/EmployeeFileLabelTab';
import EmployeeEmpSummaryTab from './tabs/EmployeeEmpSummaryTab';
import EmployeePromotionTab from './tabs/EmployeePromotionTab';

function calculateAgeFromDob(dob) {
  if (!dob || typeof dob !== "string") {
    return "0 Years";
  }

  const parts = dob.trim().split(/[/-]/);
  if (parts.length !== 3) {
    return "0 Years";
  }

  const [day, month, year] = parts;
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
  const searchParams = useSearchParams();
  const editEmployeeId = searchParams.get("employeeId");
  const { data: fetchedEmployee, isFetching } = useGetEmployeeQuery(
    editEmployeeId,
    {
      skip: !editEmployeeId,
    },
  );
  const editingEmployee = editEmployeeId ? (fetchedEmployee ?? null) : null;

  if (editEmployeeId && isFetching && !editingEmployee) {
    return null;
  }

  return (
    <EmployeeEntryFormContent
      key={editEmployeeId ?? "new"}
      editingEmployee={editingEmployee}
      isEditMode={Boolean(editEmployeeId)}
    />
  );
}

function EmployeeEntryFormContent({ editingEmployee, isEditMode }) {
  const { message } = App.useApp();
  const router = useRouter();
  const [form] = Form.useForm();
  const [createEmployee, { isLoading: isCreating }] =
    useCreateEmployeeMutation();
  const [updateEmployeeInfo, { isLoading: isUpdatingInfo }] =
    useUpdateEmployeeInfoMutation();

  const [saveEducations, { isLoading: isSavingEducations }] =
    useSaveEmployeeEducationsMutation();
  const [saveCertificates, { isLoading: isSavingCertificates }] =
    useSaveEmployeeCertificatesMutation();

  const [saveDocuments, { isLoading: isSavingDocuments }] =
    useSaveEmployeeDocumentsMutation();
  const [saveSkills, { isLoading: isSavingSkills }] =
    useSaveEmployeeSkillsMutation();
  const [saveRelationships, { isLoading: isSavingRelationships }] =
    useSaveEmployeeRelationshipsMutation();
    const [saveAdditionalInfos, { isLoading: isSavingAdditionalInfos }] =
    useSaveEmployeeAdditionalInfosMutation();
  const [saveCards, { isLoading: isSavingCards }] =
    useSaveEmployeeCardsMutation();
  const [saveEmpConfirmations, { isLoading: isSavingEmpConfirmations }] =
    useSaveEmployeeEmpConfirmationsMutation();
  const [saveResignations, { isLoading: isSavingResignations }] =
    useSaveEmployeeResignationsMutation();
  const [saveSuspensions, { isLoading: isSavingSuspensions }] =
    useSaveEmployeeSuspensionsMutation();
  const [saveContracts, { isLoading: isSavingContracts }] =
    useSaveEmployeeContractsMutation();
  const [saveAcImprovements, { isLoading: isSavingAcImprovements }] =
    useSaveEmployeeAcImprovementsMutation();
  const [saveProImprovements, { isLoading: isSavingProImprovements }] =
    useSaveEmployeeProImprovementsMutation();
  const [saveJobHistories, { isLoading: isSavingJobHistories }] =
    useSaveEmployeeJobHistoriesMutation();
  const [saveFileLabels, { isLoading: isSavingFileLabels }] =
    useSaveEmployeeFileLabelsMutation();
  const [saveEmpSummaries, { isLoading: isSavingEmpSummaries }] =
    useSaveEmployeeEmpSummariesMutation();
  const [savePromotions, { isLoading: isSavingPromotions }] =
    useSaveEmployeePromotionsMutation();

  const [employeeId, setEmployeeId] = useState(editingEmployee?.id ?? null);
  const [activeTab, setActiveTab] = useState(EMPLOYEE_ENTRY_TABS.INFO);
  const [activePanels, setActivePanels] = useState(DEFAULT_OPEN_PANELS);
  const [fileList, setFileList] = useState([]);
  const [photoPreview, setPhotoPreview] = useState(
    () => editingEmployee?.picture ?? "",
  );

  const formInitialValues = useMemo(
    () => employeeToFormValues(editingEmployee),
    [editingEmployee],
  );

  const dob = Form.useWatch("dob", form);

  const isEmployeeSaved = Boolean(employeeId);

  const ageLabel = useMemo(() => calculateAgeFromDob(dob), [dob]);

 const savingTab = useMemo(() => {
    if (isCreating || isUpdatingInfo) return EMPLOYEE_ENTRY_TABS.INFO;
        if (isSavingEducations) return EMPLOYEE_ENTRY_TABS.EDUCATION;
    if (isSavingCertificates) return EMPLOYEE_ENTRY_TABS.CERTIFICATES;
    if (isSavingSkills) return EMPLOYEE_ENTRY_TABS.SKILLS;
    if (isSavingAdditionalInfos) return EMPLOYEE_ENTRY_TABS.ADDITIONAL_INFO;
    if (isSavingRelationships) return EMPLOYEE_ENTRY_TABS.RELATIONSHIP;
    if (isSavingDocuments) return EMPLOYEE_ENTRY_TABS.DOCUMENTS;
    if (isSavingCards) return EMPLOYEE_ENTRY_TABS.CARD;
    if (isSavingEmpConfirmations) return EMPLOYEE_ENTRY_TABS.EMP_CONFIRMATION;
    if (isSavingResignations) return EMPLOYEE_ENTRY_TABS.RESIGNATION;
    if (isSavingSuspensions) return EMPLOYEE_ENTRY_TABS.SUSPENSION;
    if (isSavingContracts) return EMPLOYEE_ENTRY_TABS.CONTRACT;
    if (isSavingAcImprovements) return EMPLOYEE_ENTRY_TABS.AC_IMPROVEMENT;
    if (isSavingProImprovements) return EMPLOYEE_ENTRY_TABS.PRO_IMPROVEMENT;
    if (isSavingJobHistories) return EMPLOYEE_ENTRY_TABS.JOB_HISTORY;
    if (isSavingFileLabels) return EMPLOYEE_ENTRY_TABS.FILE_LABEL;
    if (isSavingEmpSummaries) return EMPLOYEE_ENTRY_TABS.EMP_SUMMARY;
    if (isSavingPromotions) return EMPLOYEE_ENTRY_TABS.PROMOTION;
    return null;
  }, [
    isCreating,
    isUpdatingInfo,
        isSavingEducations,
    isSavingCertificates,
    isSavingSkills,
    isSavingAdditionalInfos,
    isSavingRelationships,
    isSavingDocuments,
    isSavingCards,
    isSavingEmpConfirmations,
    isSavingResignations,
    isSavingSuspensions,
    isSavingContracts,
    isSavingAcImprovements,
    isSavingProImprovements,
    isSavingJobHistories,
    isSavingFileLabels,
    isSavingEmpSummaries,
    isSavingPromotions,
  ]);

  useEffect(() => {
    return () => {
      if (photoPreview.startsWith("blob:")) {
        URL.revokeObjectURL(photoPreview);
      }
    };
  }, [photoPreview]);

  const restoreSavedPhoto = useCallback(() => {
    if (photoPreview.startsWith("blob:")) {
      URL.revokeObjectURL(photoPreview);
    }
    setPhotoPreview(editingEmployee?.picture ?? "");
    setFileList([]);
  }, [editingEmployee?.picture, photoPreview]);

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
        picture: photoPreview || null,
        age: ageLabel,
      };

      if (employeeId) {
        await updateEmployeeInfo({ id: employeeId, ...payload }).unwrap();
      } else {
        const created = await createEmployee(payload).unwrap();
        setEmployeeId(created.id);
        router.replace(
          `${ROUTES.humanResource.employeeEntry}?employeeId=${created.id}`,
        );
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
      const rawRows = form.getFieldValue(listName) ?? [];
    const rows = rawRows.filter((row) =>
      Object.values(row ?? {}).some(
        (value) => value !== undefined && value !== null && value !== '',
      ),
    );

      if (rows.length > 0) {
        const nestedPaths = rows.flatMap((_, rowIndex) =>
          Object.keys(rows[rowIndex]).map((fieldName) => [listName, rowIndex, fieldName])
        );
        await form.validateFields(nestedPaths);
      }

      const payload = { id: employeeId, [listName]: rows };

      if (tabKey === EMPLOYEE_ENTRY_TABS.EDUCATION) {
        await saveEducations(payload).unwrap();
      } else if (tabKey === EMPLOYEE_ENTRY_TABS.CERTIFICATES) {
        await saveCertificates(payload).unwrap();
      } else if (tabKey === EMPLOYEE_ENTRY_TABS.SKILLS) {
        await saveSkills(payload).unwrap();
      } else if (tabKey === EMPLOYEE_ENTRY_TABS.ADDITIONAL_INFO) {
        await saveAdditionalInfos(payload).unwrap();
      } else if (tabKey === EMPLOYEE_ENTRY_TABS.RELATIONSHIP) {
        await saveRelationships(payload).unwrap();
      } else if (tabKey === EMPLOYEE_ENTRY_TABS.DOCUMENTS) {
        await saveDocuments(payload).unwrap();
      } else if (tabKey === EMPLOYEE_ENTRY_TABS.CARD) {
        await saveCards(payload).unwrap();
      } else if (tabKey === EMPLOYEE_ENTRY_TABS.EMP_CONFIRMATION) {
        await saveEmpConfirmations(payload).unwrap();
      } else if (tabKey === EMPLOYEE_ENTRY_TABS.RESIGNATION) {
        await saveResignations(payload).unwrap();
      } else if (tabKey === EMPLOYEE_ENTRY_TABS.SUSPENSION) {
        await saveSuspensions(payload).unwrap();
      } else if (tabKey === EMPLOYEE_ENTRY_TABS.CONTRACT) {
        await saveContracts(payload).unwrap();
      } else if (tabKey === EMPLOYEE_ENTRY_TABS.AC_IMPROVEMENT) {
        await saveAcImprovements(payload).unwrap();
      } else if (tabKey === EMPLOYEE_ENTRY_TABS.PRO_IMPROVEMENT) {
        await saveProImprovements(payload).unwrap();
      } else if (tabKey === EMPLOYEE_ENTRY_TABS.JOB_HISTORY) {
        await saveJobHistories(payload).unwrap();
      } else if (tabKey === EMPLOYEE_ENTRY_TABS.FILE_LABEL) {
        await saveFileLabels(payload).unwrap();
      } else if (tabKey === EMPLOYEE_ENTRY_TABS.EMP_SUMMARY) {
        await saveEmpSummaries(payload).unwrap();
      } else if (tabKey === EMPLOYEE_ENTRY_TABS.PROMOTION) {
        await savePromotions(payload).unwrap();
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

  const resetPhoto = useCallback(() => {
    if (photoPreview.startsWith("blob:")) {
      URL.revokeObjectURL(photoPreview);
    }
    setPhotoPreview("");
    setFileList([]);
  }, [photoPreview]);

  const handleNewEmployee = useCallback(() => {
    router.replace(ROUTES.humanResource.employeeEntry);
  }, [router]);

  const handleClearInfo = () => {
    if (isEditMode) {
      form.setFieldsValue(formInitialValues);
      restoreSavedPhoto();
      setActivePanels(DEFAULT_OPEN_PANELS);
      setActiveTab(EMPLOYEE_ENTRY_TABS.INFO);
      message.info("Unsaved changes discarded");
      return;
    }

    form.setFieldsValue(ensureFirstListRecord(initialValues));
    resetPhoto();
    setEmployeeId(null);
    setActivePanels(DEFAULT_OPEN_PANELS);
    setActiveTab(EMPLOYEE_ENTRY_TABS.INFO);
    message.info("Form cleared");
  };

  const handleClearListTab = (tabKey) => {
    const listName = EMPLOYEE_LIST_TAB_FIELDS[tabKey];
    const existingRows = isEditMode ? editingEmployee?.[listName] ?? [] : [];
    const resetRows = existingRows.length > 0 ? existingRows : shouldEnsureFirstListRecord(tabKey) ? [{}] : [];
    form.setFieldValue(listName, resetRows);
    message.info(
      isEditMode
        ? `${TAB_SAVE_LABELS[tabKey]} reset`
        : `${TAB_SAVE_LABELS[tabKey]} cleared`,
    );
  };

  const infoClearLabel = isEditMode ? "Discard Changes" : "Clear";

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
              clearLabel={infoClearLabel}
              loading={savingTab === EMPLOYEE_ENTRY_TABS.INFO}
              onClear={handleClearInfo}
              onSave={handleSaveInfo}
            />
          </>
        ),
      },
          {
        key: EMPLOYEE_ENTRY_TABS.EDUCATION,
        label: "Education",
        disabled: !isEmployeeSaved,
        children: (
          <>
            <EmployeeEducationTab />
            <EmployeeTabActions
              saveLabel={TAB_SAVE_LABELS[EMPLOYEE_ENTRY_TABS.EDUCATION]}
              loading={savingTab === EMPLOYEE_ENTRY_TABS.EDUCATION}
              onClear={() => handleClearListTab(EMPLOYEE_ENTRY_TABS.EDUCATION)}
              onSave={() => handleSaveListTab(EMPLOYEE_ENTRY_TABS.EDUCATION)}
            />
          </>
        ),
      },{
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
        key: EMPLOYEE_ENTRY_TABS.ADDITIONAL_INFO,
        label: "Additional Info",
        disabled: !isEmployeeSaved,
        children: (
          <>
            <EmployeeAdditionalInfoTab />
            <EmployeeTabActions
              saveLabel={TAB_SAVE_LABELS[EMPLOYEE_ENTRY_TABS.ADDITIONAL_INFO]}
              loading={savingTab === EMPLOYEE_ENTRY_TABS.ADDITIONAL_INFO}
              onClear={() => handleClearListTab(EMPLOYEE_ENTRY_TABS.ADDITIONAL_INFO)}
              onSave={() => handleSaveListTab(EMPLOYEE_ENTRY_TABS.ADDITIONAL_INFO)}
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
              onClear={() => handleClearListTab(EMPLOYEE_ENTRY_TABS.RELATIONSHIP)}
              onSave={() => handleSaveListTab(EMPLOYEE_ENTRY_TABS.RELATIONSHIP)}
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
        key: EMPLOYEE_ENTRY_TABS.CARD,
        label: "Card",
        disabled: !isEmployeeSaved,
        children: (
          <EmployeeCardTab
            employeeName={[
              form.getFieldValue('firstName'),
              form.getFieldValue('middleName'),
              form.getFieldValue('lastName'),
            ]
              .filter(Boolean)
              .join(' ')}
          />
        ),
      },
      {
        key: EMPLOYEE_ENTRY_TABS.EMP_CONFIRMATION,
        label: "Confirmation",
        disabled: !isEmployeeSaved,
        children: (
          <>
            <EmployeeEmpConfirmationTab />
            <EmployeeTabActions
              saveLabel={TAB_SAVE_LABELS[EMPLOYEE_ENTRY_TABS.EMP_CONFIRMATION]}
              loading={savingTab === EMPLOYEE_ENTRY_TABS.EMP_CONFIRMATION}
              onClear={() => handleClearListTab(EMPLOYEE_ENTRY_TABS.EMP_CONFIRMATION)}
              onSave={() => handleSaveListTab(EMPLOYEE_ENTRY_TABS.EMP_CONFIRMATION)}
            />
          </>
        ),
      },
      {
        key: EMPLOYEE_ENTRY_TABS.RESIGNATION,
        label: "Resignation",
        disabled: !isEmployeeSaved,
        children: (
          <>
            <EmployeeResignationTab />
            <EmployeeTabActions
              saveLabel={TAB_SAVE_LABELS[EMPLOYEE_ENTRY_TABS.RESIGNATION]}
              loading={savingTab === EMPLOYEE_ENTRY_TABS.RESIGNATION}
              onClear={() => handleClearListTab(EMPLOYEE_ENTRY_TABS.RESIGNATION)}
              onSave={() => handleSaveListTab(EMPLOYEE_ENTRY_TABS.RESIGNATION)}
            />
          </>
        ),
      },
      {
        key: EMPLOYEE_ENTRY_TABS.SUSPENSION,
        label: "Suspension",
        disabled: !isEmployeeSaved,
        children: (
          <>
            <EmployeeSuspensionTab
              employeeName={[
                form.getFieldValue('firstName'),
                form.getFieldValue('middleName'),
                form.getFieldValue('lastName'),
              ].filter(Boolean).join(' ')}
            />
            <EmployeeTabActions
              saveLabel={TAB_SAVE_LABELS[EMPLOYEE_ENTRY_TABS.SUSPENSION]}
              loading={savingTab === EMPLOYEE_ENTRY_TABS.SUSPENSION}
              onClear={() => handleClearListTab(EMPLOYEE_ENTRY_TABS.SUSPENSION)}
              onSave={() => handleSaveListTab(EMPLOYEE_ENTRY_TABS.SUSPENSION)}
            />
          </>
        ),
      },
      {
        key: EMPLOYEE_ENTRY_TABS.CONTRACT,
        label: "Contract",
        disabled: !isEmployeeSaved,
        children: (
          <>
            <EmployeeContractTab
              employeeName={[
                form.getFieldValue('firstName'),
                form.getFieldValue('middleName'),
                form.getFieldValue('lastName'),
              ].filter(Boolean).join(' ')}
            />
            <EmployeeTabActions
              saveLabel={TAB_SAVE_LABELS[EMPLOYEE_ENTRY_TABS.CONTRACT]}
              loading={savingTab === EMPLOYEE_ENTRY_TABS.CONTRACT}
              onClear={() => handleClearListTab(EMPLOYEE_ENTRY_TABS.CONTRACT)}
              onSave={() => handleSaveListTab(EMPLOYEE_ENTRY_TABS.CONTRACT)}
            />
          </>
        ),
      },
      {
        key: EMPLOYEE_ENTRY_TABS.AC_IMPROVEMENT,
        label: "Academic Improvement",
        disabled: !isEmployeeSaved,
        children: (
          <>
            <EmployeeAcImprovementTab />
            <EmployeeTabActions
              saveLabel={TAB_SAVE_LABELS[EMPLOYEE_ENTRY_TABS.AC_IMPROVEMENT]}
              loading={savingTab === EMPLOYEE_ENTRY_TABS.AC_IMPROVEMENT}
              onClear={() => handleClearListTab(EMPLOYEE_ENTRY_TABS.AC_IMPROVEMENT)}
              onSave={() => handleSaveListTab(EMPLOYEE_ENTRY_TABS.AC_IMPROVEMENT)}
            />
          </>
        ),
      },
      {
        key: EMPLOYEE_ENTRY_TABS.PRO_IMPROVEMENT,
        label: "Professional Improvement",
        disabled: !isEmployeeSaved,
        children: (
          <>
            <EmployeeProImprovementTab />
            <EmployeeTabActions
              saveLabel={TAB_SAVE_LABELS[EMPLOYEE_ENTRY_TABS.PRO_IMPROVEMENT]}
              loading={savingTab === EMPLOYEE_ENTRY_TABS.PRO_IMPROVEMENT}
              onClear={() => handleClearListTab(EMPLOYEE_ENTRY_TABS.PRO_IMPROVEMENT)}
              onSave={() => handleSaveListTab(EMPLOYEE_ENTRY_TABS.PRO_IMPROVEMENT)}
            />
          </>
        ),
      },
      {
        key: EMPLOYEE_ENTRY_TABS.JOB_HISTORY,
        label: "Job History",
        disabled: !isEmployeeSaved,
        children: (
          <>
            <EmployeeJobHistoryTab />
            <EmployeeTabActions
              saveLabel={TAB_SAVE_LABELS[EMPLOYEE_ENTRY_TABS.JOB_HISTORY]}
              loading={savingTab === EMPLOYEE_ENTRY_TABS.JOB_HISTORY}
              onClear={() => handleClearListTab(EMPLOYEE_ENTRY_TABS.JOB_HISTORY)}
              onSave={() => handleSaveListTab(EMPLOYEE_ENTRY_TABS.JOB_HISTORY)}
            />
          </>
        ),
      },
      {
        key: EMPLOYEE_ENTRY_TABS.FILE_LABEL,
        label: "File Label",
        disabled: !isEmployeeSaved,
        children: (
          <>
            <EmployeeFileLabelTab />
            <EmployeeTabActions
              saveLabel={TAB_SAVE_LABELS[EMPLOYEE_ENTRY_TABS.FILE_LABEL]}
              loading={savingTab === EMPLOYEE_ENTRY_TABS.FILE_LABEL}
              onClear={() => handleClearListTab(EMPLOYEE_ENTRY_TABS.FILE_LABEL)}
              onSave={() => handleSaveListTab(EMPLOYEE_ENTRY_TABS.FILE_LABEL)}
            />
          </>
        ),
      },
      {
        key: EMPLOYEE_ENTRY_TABS.EMP_SUMMARY,
        label: "Summary",
        disabled: !isEmployeeSaved,
        children: (
          <>
            <EmployeeEmpSummaryTab />
            <EmployeeTabActions
              saveLabel={TAB_SAVE_LABELS[EMPLOYEE_ENTRY_TABS.EMP_SUMMARY]}
              loading={savingTab === EMPLOYEE_ENTRY_TABS.EMP_SUMMARY}
              onClear={() => handleClearListTab(EMPLOYEE_ENTRY_TABS.EMP_SUMMARY)}
              onSave={() => handleSaveListTab(EMPLOYEE_ENTRY_TABS.EMP_SUMMARY)}
            />
          </>
        ),
      },
      {
        key: EMPLOYEE_ENTRY_TABS.PROMOTION,
        label: "Promotion",
        disabled: !isEmployeeSaved,
        children: (
          <>
            <EmployeePromotionTab
              employeeName={[
                form.getFieldValue('firstName'),
                form.getFieldValue('middleName'),
                form.getFieldValue('lastName'),
              ].filter(Boolean).join(' ')}
            />
            <EmployeeTabActions
              saveLabel={TAB_SAVE_LABELS[EMPLOYEE_ENTRY_TABS.PROMOTION]}
              loading={savingTab === EMPLOYEE_ENTRY_TABS.PROMOTION}
              onClear={() => handleClearListTab(EMPLOYEE_ENTRY_TABS.PROMOTION)}
              onSave={() => handleSaveListTab(EMPLOYEE_ENTRY_TABS.PROMOTION)}
            />
          </>
        ),
      },
    ],
[
      activePanels,
      ageLabel,
      editingEmployee,
      fileList,
      formInitialValues,
      handleSaveInfo,
      infoClearLabel,
      isEditMode,
      isEmployeeSaved,
      photoPreview,
      savingTab,
      isSavingAdditionalInfos,
      isSavingCards,
      isSavingEmpConfirmations,
      isSavingResignations,
      isSavingSuspensions,
      isSavingContracts,
      isSavingAcImprovements,
      isSavingProImprovements,
      isSavingJobHistories,
      isSavingFileLabels,
      isSavingEmpSummaries,
      isSavingPromotions,
    ],
  );

  return (
    <div className="patient-registration-page employee-entry-page">
      <EmployeeEntryHeader
        isEditMode={isEditMode}
        onNewEmployee={handleNewEmployee}
      />
      <Form
        form={form}
        name="employee-entry"
        layout="vertical"
        className="patient-registration-form employee-entry-form"
        requiredMark={false}
        scrollToFirstError
        initialValues={formInitialValues}
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
