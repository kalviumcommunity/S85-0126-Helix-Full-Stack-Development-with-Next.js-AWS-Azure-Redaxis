export const revalidate = 60; // Rebuild this page every 60 seconds

async function getInventory() {
  console.log("ISR: Inventory fetched");

  // fake API for now
  return [
    { type: "O+", units: Math.floor(Math.random() * 10) },
    { type: "A+", units: Math.floor(Math.random() * 10) },
  ];
}

export default async function InventoryPage() {
  const data = await getInventory();

  return (
    <div>
      <h1>Live Blood Inventory</h1>
      {data.map((b) => (
        <p key={b.type}>
          {b.type}: {b.units} units
        </p>
      ))}
    </div>
  );
}
