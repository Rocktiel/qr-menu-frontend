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



export async function generateStaticParams() {

  // Örnek statik parametreler

  return [

    {

      restaurantId: '1',

      tableNumber: '1'

    },

    {

      restaurantId: '1',

      tableNumber: '2'

    },

    {

      restaurantId: '2',

      tableNumber: '1'

    }

  ];

}
