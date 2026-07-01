"use client";

import Image from "next/image";

export default function AuthShell({ title, subtitle, children }) {
  return (
    <div className="auth-layout">
      <aside className="auth-visual" aria-hidden={true}>
        <Image
          src="/login-bg.png"
          alt=""
          fill
          className="auth-visual__image"
          priority
          sizes="50vw"
        />
      </aside>

      <section className="auth-panel">
        <div className="auth-panel__logo">
          <Image
            src="/logo.png"
            alt="Alkhidmat"
            width={72}
            height={72}
            priority
          />
        </div>

        <div className="auth-panel__body">
          <header className="auth-panel__header">
            <h1 className="auth-panel__title">{title}</h1>
            {subtitle ? (
              <p className="auth-panel__subtitle">{subtitle}</p>
            ) : null}
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
