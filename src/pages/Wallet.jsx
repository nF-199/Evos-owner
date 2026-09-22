import React from "react";
import { FiCreditCard } from "react-icons/fi";
import PageHeader from "../components/PageHeader";
import Placeholder from "../components/Placeholder";

const Wallet = () => {
  return (
    <div className="mx-auto max-w-[1400px]">
      <PageHeader
        eyebrow="Moliya"
        title="Hamyon"
        subtitle="Kirim, chiqim va sof foyda"
      />
      <Placeholder icon={FiCreditCard} title="Hamyon" />
    </div>
  );
};

export default Wallet;
