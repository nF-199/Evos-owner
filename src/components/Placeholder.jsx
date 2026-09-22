import React from "react";

/* Sahifa hali to'ldirilmagan — shu yerga kontent keladi. */
const Placeholder = ({ icon: Icon, title, note = "Bu sahifa hali to'ldirilmagan." }) => (
  <div className="flex min-h-[55vh] flex-col items-center justify-center gap-4 rounded-[var(--radius-box)] border border-dashed border-base-300 bg-base-100/60 p-10 text-center">
    {Icon && (
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-base-200 text-3xl text-base-content/25">
        <Icon />
      </div>
    )}
    <div>
      <p className="text-lg font-extrabold tracking-tight">{title}</p>
      <p className="mt-1 text-sm text-base-content/45">{note}</p>
    </div>
  </div>
);

export default Placeholder;
