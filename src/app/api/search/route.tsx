import { NextResponse } from "next/server";
import { Pinecone } from "@pinecone-database/pinecone";
import { GoogleGenAI } from "@google/genai";
import { genEmbeddingsGemini, queryMoviesByEmbedding } from "../Utils/utlis";

export async function GET(request: Request) {
  try {
    const ip = request.headers.get("x-forwarded-for");
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q");

    if (!query) {
      return NextResponse.json(
        { error: "Query parameter 'q' is required" },
        { status: 400 }
      );
    }

    const embedding = await genEmbeddingsGemini(query);
    const searchResults = await queryMoviesByEmbedding(embedding, 50);
    console.log(`Search from IP ${ip}: ${query}`);
    return NextResponse.json(searchResults);
  } catch (error: any) {
    const ip = request.headers.get("x-forwarded-for");
    console.error(`Failed search for IP ${ip}`, {
      details: error.message,
      query: new URL(request.url).searchParams.get("q"),
    });
    return NextResponse.json(
      { error: "Failed to search movies", details: error.message },
      { status: 500 }
    );
  }
}
