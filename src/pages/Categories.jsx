import React from "react";
import { FiTag } from "react-icons/fi";
import PageHeader from "../components/PageHeader";
import Placeholder from "../components/Placeholder";

const Categories = () => {
  return (
    <div className="mx-auto max-w-[1400px]">
      <PageHeader
        eyebrow="Menyu"
        title="Kategoriyalar"
        subtitle="Taom yo'nalishlari"
      />
      <Placeholder icon={FiTag} title="Kategoriyalar" />
    </div>
  );
};

export default Categories;
