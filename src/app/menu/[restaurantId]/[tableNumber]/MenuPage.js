"use client";

import React, { useState, useEffect } from "react";
import CustomerMenuClient from "./CustomerMenuClient";

export default function MenuPage({ params }) {
  const [restaurantId, setRestaurantId] = useState(null);
  const [tableNumber, setTableNumber] = useState(null);

  useEffect(() => {
    if (params) {
      const { restaurantId, tableNumber } = params;
      setRestaurantId(restaurantId);
      setTableNumber(tableNumber);
    }
  }, [params]);

  if (!restaurantId || !tableNumber) {
    return <div>Loading...</div>;
  }

  return (
    <CustomerMenuClient restaurantId={restaurantId} tableNumber={tableNumber} />
  );
}
