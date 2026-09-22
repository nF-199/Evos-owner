import React from "react";
import { FiShoppingBag } from "react-icons/fi";
import PageHeader from "../components/PageHeader";
import Placeholder from "../components/Placeholder";

const Orders = () => {
  return (
    <div className="mx-auto max-w-[1400px]">
      <PageHeader
        eyebrow="Savdo"
        title="Buyurtmalar"
        subtitle="Barcha buyurtmalar ro'yxati"
      />
      <Placeholder icon={FiShoppingBag} title="Buyurtmalar" />
    </div>
  );
};

export default Orders;
