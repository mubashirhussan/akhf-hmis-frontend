'use client';

import HmisFormGrid from '@/components/ui/HmisFormGrid';

/**
 * HIPAA-aligned form section — groups related PHI / operational fields with a clear header.
 */
export default function HmisPhiFormSection({
  title,
  columns = 4,
  className = '',
  children,
}) {
  const sectionId = title
    ? `phi-section-${title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`
    : undefined;

  return (
    <section
      className={['hmis-phi-form-section', className].filter(Boolean).join(' ')}
      aria-labelledby={sectionId}
    >
      {title ? (
        <header className="hmis-phi-form-section__header">
          <h3 id={sectionId} className="hmis-phi-form-section__title">
            {title}
          </h3>
        </header>
      ) : null}
      <HmisFormGrid columns={columns} className="walk-in-add-record-form hmis-phi-form-section__grid">
        {children}
      </HmisFormGrid>
    </section>
  );
}
