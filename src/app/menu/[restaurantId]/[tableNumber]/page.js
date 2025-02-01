// import CustomerMenuClient from "./CustomerMenuClient";

// export default function CustomerMenu({ params }) {
//   const { restaurantId, tableId } = params;

//   return <CustomerMenuClient restaurantId={restaurantId} tableId={tableId} />;
// }
// "use client"; // Bu satır eklenmeli

// import { useEffect, useState } from "react";
// import CustomerMenuClient from "./CustomerMenuClient";

// export default function CustomerMenu({ params }) {
//   const [restaurantId, setRestaurantId] = useState(null);
//   const [tableId, setTableId] = useState(null);

//   useEffect(() => {
//     if (params) {
//       const { restaurantId, tableId } = params;
//       setRestaurantId(restaurantId);
//       setTableId(tableId);
//     }
//   }, [params]);

//   if (!restaurantId || !tableId) {
//     return <div>Loading...</div>;
//   }

//   return <CustomerMenuClient restaurantId={restaurantId} tableId={tableId} />;
// }
"use client"; // Bu satır önemli

import React, { useState, useEffect } from "react";
import CustomerMenuClient from "./CustomerMenuClient";

export default function CustomerMenu({ params }) {
  const resolvedParams = React.use(params); // params'ı React.use() ile çöz
  const [restaurantId, setRestaurantId] = useState(null);
  const [tableNumber, setTableNumber] = useState(null);

  useEffect(() => {
    if (resolvedParams) {
      const { restaurantId, tableNumber } = resolvedParams;
      setRestaurantId(restaurantId);
      setTableNumber(tableNumber);
    }
  }, [resolvedParams]);

  if (!restaurantId || !tableNumber) {
    return <div>Loading...</div>;
  }

  return (
    <CustomerMenuClient restaurantId={restaurantId} tableNumber={tableNumber} />
  );
}
