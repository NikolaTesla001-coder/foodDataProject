import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(req: NextRequest) {

  try {
    const form = await req.formData();
    const file = form.get("file") as File | null;

    // YOUR RULE → no image = 1
    if (!file) {
      return NextResponse.json({ count: 1 });
    }

    const bytes = Buffer.from(await file.arrayBuffer()).toString("base64");

    const genai = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY!);

    const model = genai.getGenerativeModel({
      model: "gemini-2.0-flash",
    });

    const prompt = `
Return ONLY JSON:
{ "count": number }
Count visually similar objects in the image.
`;

    const result = await model.generateContent([
      prompt,
      {
        inlineData: {
          data: bytes,
          mimeType: file.type,
        },
      },
    ]);

    const text = result.response.text();

    const match = text.match(/\d+/);

    return NextResponse.json({
      count: match ? Number(match[0]) : 1,
    });

  } catch (err) {
    return NextResponse.json({ count: 1 });
  }
}
