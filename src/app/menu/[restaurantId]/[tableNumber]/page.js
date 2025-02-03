import MenuPage from "./MenuPage";

export default function Page({ params }) {
  return <MenuPage params={params} />;
}

export async function generateStaticParams() {
  return [
    {
      restaurantId: "1",
      tableNumber: "1",
    },
    {
      restaurantId: "1",
      tableNumber: "2",
    },
    {
      restaurantId: "2",
      tableNumber: "1",
    },
  ];
}
