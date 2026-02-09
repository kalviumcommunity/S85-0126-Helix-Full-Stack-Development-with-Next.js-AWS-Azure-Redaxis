// import { cookies } from "next/headers";
// import { redirect } from "next/navigation";
// import { Nav } from "@/components/layout/Nav";
// import { prisma } from "@/lib/prisma";
// import { verifyToken } from "@/lib/jwt";

// const AUTH_COOKIE_NAME = "auth_token";

// export default async function ProfilePage() {
//   const cookieStore = cookies();
//   const token = cookieStore.get(AUTH_COOKIE_NAME)?.value;

//   if (!token) {
//     redirect("/login");
//   }

//   let payload: any;

//   try {
//     payload = await verifyToken(token!);
//   } catch {
//     redirect("/login");
//   }

//   const userId = Number(payload.id);

//   if (!userId || Number.isNaN(userId)) {
//     redirect("/login");
//   }

//   const user = await prisma.user.findUnique({
//     where: { id: userId },
//     include: {
//       donor: true,
//       hospital: true,
//     },
//   });

//   if (!user) {
//     redirect("/login");
//   }

//   const { password, ...safeUser } = user as any;

//   const roleLabel =
//     safeUser.role === "DONOR"
//       ? "Donor"
//       : safeUser.role === "HOSPITAL"
//         ? "Hospital"
//         : safeUser.role === "NGO"
//           ? "NGO"
//           : safeUser.role;

//   return (
//     <>
//       <Nav />
//       <main className="min-h-screen bg-gray-50 px-4 pt-28 pb-12">
//         <div className="mx-auto max-w-2xl rounded-2xl bg-white p-8 shadow">
//           <h1 className="text-3xl font-bold text-gray-900 mb-2">Profile</h1>
//           <p className="text-sm text-gray-500 mb-6">
//             Your account details and role information.
//           </p>

//           <div className="space-y-4 text-sm">
//             <div>
//               <p className="font-semibold text-gray-800">Name</p>
//               <p className="text-gray-700">{safeUser.name}</p>
//             </div>
//             <div>
//               <p className="font-semibold text-gray-800">Email</p>
//               <p className="text-gray-700">{safeUser.email}</p>
//             </div>
//             <div>
//               <p className="font-semibold text-gray-800">Role</p>
//               <p className="text-gray-700">{roleLabel}</p>
//             </div>

//             {safeUser.role === "DONOR" && safeUser.donor && (
//               <div>
//                 <p className="font-semibold text-gray-800">Donor profile</p>
//                 <p className="text-gray-700">
//                   Blood group: <span className="font-medium">{safeUser.donor.bloodGroup}</span>
//                 </p>
//                 <p className="text-gray-700">
//                   City: <span className="font-medium">{safeUser.donor.city}</span>
//                 </p>
//               </div>
//             )}

//             {safeUser.role === "HOSPITAL" && safeUser.hospital && (
//               <div>
//                 <p className="font-semibold text-gray-800">Hospital profile</p>
//                 <p className="text-gray-700">
//                   Name: <span className="font-medium">{safeUser.hospital.name}</span>
//                 </p>
//                 <p className="text-gray-700">
//                   City: <span className="font-medium">{safeUser.hospital.city}</span>
//                 </p>
//               </div>
//             )}

//             <div>
//               <p className="font-semibold text-gray-800">Member since</p>
//               <p className="text-gray-700">
//                 {new Date(safeUser.createdAt).toLocaleDateString()}
//               </p>
//             </div>
//           </div>
//         </div>
//       </main>
//     </>
//   );
// }
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { Nav } from "@/components/layout/Nav";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/jwt";

/* =========================
   Types
========================= */
type JwtPayload = {
  id: number;
  email: string;
  role: "DONOR" | "HOSPITAL" | "NGO";
};

const AUTH_COOKIE_NAME = "auth_token";

export default async function ProfilePage() {
  const cookieStore = await cookies();
  const token = cookieStore.get(AUTH_COOKIE_NAME)?.value;

  if (!token) {
    redirect("/login");
  }

  let payload: JwtPayload;

  try {
    payload = (await verifyToken(token)) as JwtPayload;
  } catch {
    redirect("/login");
  }

  const userId = Number(payload.id);

  if (!userId || Number.isNaN(userId)) {
    redirect("/login");
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      donor: true,
      hospital: true,
    },
  });

  if (!user) {
    redirect("/login");
  }

  // remove password safely
  const { password: _password, ...safeUser } = user;

  const roleLabel =
    safeUser.role === "DONOR"
      ? "Donor"
      : safeUser.role === "HOSPITAL"
      ? "Hospital"
      : "NGO";

  return (
    <>
      <Nav />

      <main className="min-h-screen bg-gray-50 px-4 pt-28 pb-12">
        <div className="mx-auto max-w-2xl rounded-2xl bg-white p-8 shadow">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Profile</h1>
          <p className="text-sm text-gray-500 mb-6">
            Your account details and role information.
          </p>

          <div className="space-y-4 text-sm">
            <div>
              <p className="font-semibold text-gray-800">Name</p>
              <p className="text-gray-700">{safeUser.name}</p>
            </div>

            <div>
              <p className="font-semibold text-gray-800">Email</p>
              <p className="text-gray-700">{safeUser.email}</p>
            </div>

            <div>
              <p className="font-semibold text-gray-800">Role</p>
              <p className="text-gray-700">{roleLabel}</p>
            </div>

            {safeUser.role === "DONOR" && safeUser.donor && (
              <div>
                <p className="font-semibold text-gray-800">Donor profile</p>
                <p className="text-gray-700">
                  Blood group:{" "}
                  <span className="font-medium">
                    {safeUser.donor.bloodGroup}
                  </span>
                </p>
                <p className="text-gray-700">
                  City:{" "}
                  <span className="font-medium">
                    {safeUser.donor.city}
                  </span>
                </p>
              </div>
            )}

            {safeUser.role === "HOSPITAL" && safeUser.hospital && (
              <div>
                <p className="font-semibold text-gray-800">Hospital profile</p>
                <p className="text-gray-700">
                  Name:{" "}
                  <span className="font-medium">
                    {safeUser.hospital.name}
                  </span>
                </p>
                <p className="text-gray-700">
                  City:{" "}
                  <span className="font-medium">
                    {safeUser.hospital.city}
                  </span>
                </p>
              </div>
            )}

            <div>
              <p className="font-semibold text-gray-800">Member since</p>
              <p className="text-gray-700">
                {new Date(safeUser.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}

