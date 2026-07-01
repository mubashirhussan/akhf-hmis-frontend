'use client';

import Image from 'next/image';

export default function AuthShell({ title, subtitle, children }) {
  return (
    <div className="auth-layout">
      <aside className="auth-visual" aria-hidden={false}>
        <div className="auth-visual__inner">
          <div className="auth-visual__image-wrap">
            <Image
              src="/login-bg-img.png"
              alt=""
              width={640}
              height={520}
              className="auth-visual__image"
              priority
            />
          </div>
          <div className="auth-visual__content">
            <h2 className="auth-visual__heading">Introducing new features</h2>
            <p className="auth-visual__text">
              Analyzing previous trends ensures that businesses always make the right decision. And as
              the scale of the decision and it&apos;s impact magnifies...
            </p>
          </div>
        </div>
      </aside>

      <section className="auth-panel">
        <div className="auth-panel__logo">
          <Image src="/logo.png" alt="Alkhidmat" width={72} height={72} priority />
        </div>

        <div className="auth-panel__body">
          <header className="auth-panel__header">
            <h1 className="auth-panel__title">{title}</h1>
            {subtitle ? <p className="auth-panel__subtitle">{subtitle}</p> : null}
          </header>
          {children}
        </div>

        <footer className="auth-panel__footer">
          &copy; 2026 - All rights reserved - Alkhidmat Foundation Pakistan
        </footer>
      </section>
    </div>
  );
}
