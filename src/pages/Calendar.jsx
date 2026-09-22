import React from "react";
import { FiCalendar } from "react-icons/fi";
import PageHeader from "../components/PageHeader";
import Placeholder from "../components/Placeholder";

const Calendar = () => {
  return (
    <div className="mx-auto max-w-[1400px]">
      <PageHeader
        eyebrow="Rejalashtirish"
        title="Kalendar"
        subtitle="Kunlar kesimida savdo va tadbirlar"
      />
      <Placeholder icon={FiCalendar} title="Kalendar" />
    </div>
  );
};

export default Calendar;
