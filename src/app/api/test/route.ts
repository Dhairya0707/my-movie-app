import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    message: "✅ Test route working!",
    envCheck: {
      nodeEnv: process.env.NODE_ENV || "not set",
      geminiKey: process.env.GEMINI_API_KEY
        ? process.env.GEMINI_API_KEY.slice(0, 8) + "****"
        : "missing",
      pineconeKey: process.env.PINECONE_API_KEY
        ? process.env.PINECONE_API_KEY.slice(0, 8) + "****"
        : "missing",
    },
    time: new Date().toISOString(),
  });
}

// Optional: echo back body for POST tests
export async function POST(request: Request) {
  const body = await request.json();
  return NextResponse.json({
    message: "POST received 👋",
    yourData: body,
    timestamp: new Date().toLocaleTimeString(),
  });
}
