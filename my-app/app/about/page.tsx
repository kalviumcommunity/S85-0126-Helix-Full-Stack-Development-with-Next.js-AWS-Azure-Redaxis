export const metadata = {
  title: "About | Blood Donation & Inventory Platform",
  description:
    "A real-time blood donation and inventory management platform connecting donors, hospitals, and NGOs across India.",
};

export default function AboutPage() {
  return (
    <main className="min-h-screen px-6 py-12 md:px-16 lg:px-32 bg-white text-gray-800">
      
      {/* Hero Section */}
      <section className="mb-12">
        <h1 className="text-4xl font-bold mb-4 text-red-600">
          About the Platform
        </h1>
        <p className="text-lg leading-relaxed max-w-3xl">
          India’s blood shortage crisis is not always caused by a lack of donors,
          but by fragmented systems, outdated records, and poor coordination.
          Our platform aims to bridge this critical gap using technology.
        </p>
      </section>

      {/* Problem Section */}
      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-3">
          The Problem
        </h2>
        <p className="leading-relaxed max-w-3xl">
          Hospitals and blood banks often struggle to locate the right blood type
          at the right time. Inventory data is frequently updated manually,
          donors are difficult to reach in emergencies, and NGOs operate in
          silos. These delays can cost lives even when blood is available nearby.
        </p>
      </section>

      {/* Solution Section */}
      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-3">
          Our Solution
        </h2>
        <p className="leading-relaxed max-w-3xl">
          We propose a full-stack, real-time blood donation and inventory
          management platform that connects donors, hospitals, and NGOs on a
          single secure network. By leveraging geolocation, live dashboards, and
          verified authentication, we ensure accurate visibility and faster
          response during emergencies.
        </p>
      </section>

      {/* How It Works */}
      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-3">
          How It Works
        </h2>
        <ul className="list-disc pl-6 max-w-3xl space-y-2">
          <li>Donors can register, verify their identity, and share availability.</li>
          <li>Hospitals update blood inventory in real time.</li>
          <li>NGOs coordinate donation drives and emergency requests.</li>
          <li>Geolocation helps locate the nearest available blood instantly.</li>
          <li>Secure authentication protects sensitive medical data.</li>
        </ul>
      </section>

      {/* Vision */}
      <section>
        <h2 className="text-2xl font-semibold mb-3">
          Our Vision
        </h2>
        <p className="leading-relaxed max-w-3xl">
          Our goal is simple yet powerful: no life should be lost due to outdated
          data or poor coordination. By transforming how blood availability is
          tracked and shared, we aim to build a faster, smarter, and more humane
          healthcare support system for India.
        </p>
      </section>

    </main>
  );
}
