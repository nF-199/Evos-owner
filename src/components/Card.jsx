import React from "react";

export const Card = ({ title, subtitle, action, children, className = "", bodyClass = "" }) => (
  <section
    className={`rounded-[var(--radius-box)] border border-base-300/70 bg-base-100 shadow-sm ${className}`}
  >
    {(title || action) && (
      <div className="flex items-start justify-between gap-3 border-b border-base-300/60 px-5 py-4">
        <div>
          <h2 className="text-sm font-extrabold tracking-tight">{title}</h2>
          {subtitle && <p className="mt-0.5 text-xs text-base-content/45">{subtitle}</p>}
        </div>
        {action}
      </div>
    )}
    <div className={`p-5 ${bodyClass}`}>{children}</div>
  </section>
);

export const EmptyState = ({ icon: Icon, title, text, action }) => (
  <div className="flex flex-col items-center justify-center gap-3 py-14 text-center">
    {Icon && (
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-base-200 text-2xl text-base-content/30">
        <Icon />
      </div>
    )}
    <div>
      <p className="font-bold">{title}</p>
      {text && <p className="mt-1 text-sm text-base-content/45">{text}</p>}
    </div>
    {action}
  </div>
);

export const Loader = ({ text = "Yuklanmoqda..." }) => (
  <div className="flex flex-col items-center justify-center gap-3 py-20 text-base-content/45">
    <span className="loading loading-spinner loading-lg text-primary" />
    <p className="text-sm font-semibold">{text}</p>
  </div>
);

export default Card;
