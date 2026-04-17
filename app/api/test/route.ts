import clientPromise from "@/lib/mongodb";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const client = await clientPromise;
    return NextResponse.json({ message: "DB Connected ✅" });
  } catch (err) {
    return NextResponse.json({ error: "DB Failed ❌" });
  }
}