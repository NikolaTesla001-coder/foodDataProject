import clientPromise from "@/lib/mongodb";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { username } = await req.json();

  const client = await clientPromise;
  const db = client.db("fooddata");

  const data = await db
    .collection("history")
    .find({ username })
    .toArray();

  return NextResponse.json(data);
}