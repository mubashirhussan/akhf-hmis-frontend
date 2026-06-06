'use client';

import { UserOutlined } from '@ant-design/icons';
import { Avatar, Button } from 'antd';
import AppIcon from '@/components/icons/AppIcon';

export default function BillingPatientHeaderCard({ patient }) {
  return (
    <section className="billing-patient-header-card">
      <div className="billing-patient-header-body">
        <div className="billing-patient-header-main">
          <Avatar size={64} icon={<UserOutlined />} className="billing-patient-avatar" />

          <div className="billing-patient-header-info">
            <div className="billing-patient-name-row">
              <h2 className="billing-patient-name">{patient.displayName}</h2>
              <span className="billing-patient-relation-inline">
                {patient.relationPrefix} {patient.relationName}
              </span>
            </div>

            <div className="billing-patient-meta-row">
              <span className="billing-patient-meta-item">
                <AppIcon icon="mdi:account-group-outline" className="billing-patient-meta-icon" />
                {patient.ageDetail}
              </span>
              <span className="billing-patient-meta-divider" aria-hidden />
              <span className="billing-patient-meta-item">
                <AppIcon icon="mdi:calendar-outline" className="billing-patient-meta-icon" />
                {patient.dob}
              </span>
              <span className="billing-patient-meta-divider" aria-hidden />
              <span className="billing-patient-meta-item">
                <AppIcon
                  icon={
                    patient.gender?.toLowerCase() === 'female'
                      ? 'mdi:gender-female'
                      : 'mdi:gender-male'
                  }
                  className="billing-patient-meta-icon"
                />
                {patient.gender}
              </span>
            </div>

            <p className="billing-patient-department">{patient.department}</p>

            <div className="billing-patient-id-row">
              <span className="billing-patient-id-item">
                MR # <strong className="billing-patient-id-value">{patient.mrNo}</strong>
              </span>
              <span className="billing-patient-meta-divider" aria-hidden />
              <span className="billing-patient-id-item">
                Patient Type{' '}
                <strong className="billing-patient-id-value">{patient.patientType}</strong>
              </span>
            </div>
          </div>
        </div>

        <div className="billing-patient-header-side">
          <Button
            className="billing-patient-report-btn"
            icon={<AppIcon icon="mdi:file-document-outline" className="h-4 w-4" />}
          >
            Patient Report
          </Button>

          <div className="billing-patient-doctor-card">
            <span className="billing-patient-doctor-accent" aria-hidden />
            <button type="button" className="billing-patient-doctor-handle" aria-label="More options">
              <AppIcon icon="mdi:dots-grid" className="h-4 w-4" />
            </button>

            <div className="billing-patient-doctor-avatar-wrap">
              <Avatar size={40} icon={<UserOutlined />} className="billing-patient-doctor-avatar" />
              {patient.checkupType === 'Emergency' && (
                <span className="billing-patient-doctor-emergency-badge" aria-hidden>
                  <AppIcon icon="mdi:alert-decagram" className="h-[11px] w-[11px]" />
                </span>
              )}
            </div>

            <div className="billing-patient-doctor-text">
              {patient.checkupType === 'Emergency' ? (
                <div className="billing-patient-emergency-row">
                  <span className="billing-patient-emergency-pill">
                    <AppIcon icon="mdi:alert-decagram" className="h-[10px] w-[10px]" />
                    Emergency
                  </span>
                  <span className="billing-patient-emergency-slash">/Emergency</span>
                </div>
              ) : (
                <span className="billing-patient-checkup-pill">{patient.checkupType}</span>
              )}
              <p className="billing-patient-doctor-name">{patient.doctor}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
