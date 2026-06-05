'use client';

import FormGrid from '@/components/ui/FormGrid';

export default function PhiFormSection({
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
      className={['phi-form-section', className].filter(Boolean).join(' ')}
      aria-labelledby={sectionId}
    >
      {title ? (
        <header className="phi-form-section__header">
          <h3 id={sectionId} className="phi-form-section__title">
            {title}
          </h3>
        </header>
      ) : null}
      <FormGrid columns={columns} className="walk-in-add-record-form phi-form-section__grid">
        {children}
      </FormGrid>
    </section>
  );
}
