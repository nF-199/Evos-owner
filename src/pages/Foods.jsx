import React from "react";
import { GiKnifeFork } from "react-icons/gi";
import PageHeader from "../components/PageHeader";
import Placeholder from "../components/Placeholder";

const Foods = () => {
  return (
    <div className="mx-auto max-w-[1400px]">
      <PageHeader
        eyebrow="Menyu"
        title="Taomlar"
        subtitle="Mahsulotlar, narxlar va qoldiq"
      />
      <Placeholder icon={GiKnifeFork} title="Taomlar" />
    </div>
  );
};

export default Foods;
