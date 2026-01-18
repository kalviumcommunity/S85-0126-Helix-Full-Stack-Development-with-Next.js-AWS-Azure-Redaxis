export const dynamic = "force-dynamic";

async function getUserData() {
  const res = await fetch(`http://localhost:3000/api/user`, {
    cache: "no-store",
  });

  return res.json();
}

export default async function ProfilePage() {
  const user = await getUserData();

  return (
    <div>
      <p>Name: {user.name}</p>
      <p>Age: {user.age}</p>
      <p>City: {user.city}</p>
    </div>
  );
}
