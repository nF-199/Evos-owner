import React from "react";
import { Link } from "react-router-dom";
import { FiArrowLeft, FiCompass } from "react-icons/fi";

const NotFound = () => (
  <div className="flex min-h-[70vh] flex-col items-center justify-center gap-5 text-center">
    <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-base-100 text-4xl text-base-content/25 shadow-sm">
      <FiCompass />
    </div>
    <div>
      <p className="text-5xl font-black tracking-tight text-base-content/15">404</p>
      <p className="mt-2 text-lg font-extrabold">Bunday sahifa yo'q</p>
      <p className="mt-1 text-sm text-base-content/45">
        Manzilni tekshiring yoki dashboardga qayting.
      </p>
    </div>
    <Link to="/" className="btn btn-primary btn-sm gap-2 rounded-xl">
      <FiArrowLeft /> Dashboardga qaytish
    </Link>
  </div>
);

export default NotFound;
