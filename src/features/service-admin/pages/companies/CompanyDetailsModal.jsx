'use client';

import { Modal } from 'antd';
import DetailSection from '@/components/ui/DetailSection';

export default function CompanyDetailsModal({ open, onClose, company }) {
  const companyFields = company
    ? [
        { key: 'companyType', label: 'Company Type', value: company.companyType },
        { key: 'companyName', label: 'Company Name', value: company.companyName, span: 1 },
        { key: 'ntn', label: 'NTN #', value: company.ntn },
        { key: 'status', label: 'Status', value: company.status },
      ]
    : [];

  const contactFields = company
    ? [
        { key: 'city', label: 'City', value: company.city },
        { key: 'address', label: 'Address', value: company.address, span: 1 },
        { key: 'contactPersonName', label: 'Contact Person Name', value: company.contactPersonName },
        { key: 'cnic', label: 'CNIC', value: company.cnic },
        { key: 'phone', label: 'Phone', value: company.phone },
        { key: 'fax', label: 'Fax', value: company.fax },
        { key: 'email', label: 'Email', value: company.email, span: 1 },
        { key: 'website', label: 'Website', value: company.website, span: 1 },
        { key: 'str', label: 'STR #', value: company.str, span: 1 },
        { key: 'bankAccount', label: 'Bank A/C No.', value: company.bankAccount, span: 1 },
      ]
    : [];

  return (
    <Modal
      className="company-details-modal"
      title={null}
      open={open}
      onCancel={onClose}
      footer={null}
      width={900}
      centered
      destroyOnHidden
    >
      {company ? (
        <div className="company-details-panel">
          <DetailSection title="Company Information" fields={companyFields} />
          <DetailSection
            title="Contact Details"
            fields={contactFields}
            className="detail-section--last"
          />
        </div>
      ) : null}
    </Modal>
  );
}
