export const dashboardStats = [
  { label: "Total units", value: 284, trend: "+12%" },
  { label: "Pending requests", value: 7, trend: "-2" },
  { label: "Donors today", value: 23, trend: "+5" },
  { label: "Critical stock", value: 2, trend: "O-" },
];

export const bloodInventory = [
  { type: "A+", units: 45, status: "healthy" },
  { type: "A-", units: 12, status: "low" },
  { type: "B+", units: 38, status: "healthy" },
  { type: "B-", units: 8, status: "critical" },
  { type: "O+", units: 62, status: "healthy" },
  { type: "O-", units: 5, status: "critical" },
  { type: "AB+", units: 18, status: "healthy" },
  { type: "AB-", units: 6, status: "low" },
];

export const requestStatusCards = [
  {
    id: "req-1",
    patientRef: "P-8821",
    bloodType: "O-",
    units: 2,
    status: "fulfilled",
    requestedAt: "2026-02-08T10:00:00",
  },
  {
    id: "req-2",
    patientRef: "P-8824",
    bloodType: "B-",
    units: 1,
    status: "pending",
    requestedAt: "2026-02-09T09:30:00",
  },
  {
    id: "req-3",
    patientRef: "P-8826",
    bloodType: "A+",
    units: 3,
    status: "in_progress",
    requestedAt: "2026-02-09T11:00:00",
  },
];
