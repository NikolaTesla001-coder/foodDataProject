import clientPromise from "@/lib/mongodb";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { username, password } = await req.json();

  const client = await clientPromise;
  const db = client.db("fooddata");

  const user = await db.collection("users").findOne({
    username,
    password,
  });

  if (!user) {
    return NextResponse.json({ success: false });
  }

  return NextResponse.json({ success: true });
}