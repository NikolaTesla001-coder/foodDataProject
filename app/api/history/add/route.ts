import clientPromise from "@/lib/mongodb";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.json();

  const client = await clientPromise;
  const db = client.db("fooddata");

  await db.collection("history").insertOne(body);

  return NextResponse.json({ success: true });
}