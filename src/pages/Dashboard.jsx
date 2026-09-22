import React from "react";
import { FiGrid } from "react-icons/fi";
import PageHeader from "../components/PageHeader";
import Placeholder from "../components/Placeholder";

const Dashboard = () => {
  return (
    <div className="mx-auto max-w-[1400px]">
      <PageHeader
        eyebrow="Umumiy ko'rinish"
        title="Dashboard"
        subtitle="Savdo, oqim va asosiy ko'rsatkichlar"
      />
      <Placeholder icon={FiGrid} title="Dashboard" />
    </div>
  );
};

export default Dashboard;
