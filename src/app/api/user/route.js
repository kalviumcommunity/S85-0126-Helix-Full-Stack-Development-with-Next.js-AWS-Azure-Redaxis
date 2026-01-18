import { NextResponse } from "next/server";
export async function GET() {
  return NextResponse.json({
    name: "Ravi Kumar",
    age: 26,
    city: "Bengaluru",
  });
}
