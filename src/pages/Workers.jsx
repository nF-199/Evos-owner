import React from "react";
import { FiUsers } from "react-icons/fi";
import PageHeader from "../components/PageHeader";
import Placeholder from "../components/Placeholder";

const Workers = () => {
  return (
    <div className="mx-auto max-w-[1400px]">
      <PageHeader
        eyebrow="Jamoa"
        title="Xodimlar"
        subtitle="Kassir va oshpazlar, rollar va oyliklar"
      />
      <Placeholder icon={FiUsers} title="Xodimlar" />
    </div>
  );
};

export default Workers;
