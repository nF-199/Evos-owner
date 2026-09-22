import React from "react";

const PageHeader = ({ eyebrow, title, subtitle, actions }) => (
  <header className="mb-6 flex flex-wrap items-end justify-between gap-4">
    <div>
      {eyebrow && (
        <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-primary">{eyebrow}</p>
      )}
      <h1 className="mt-1 text-2xl font-extrabold tracking-tight lg:text-3xl">{title}</h1>
      {subtitle && <p className="mt-1.5 text-sm text-base-content/50">{subtitle}</p>}
    </div>
    {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
  </header>
);

export default PageHeader;
