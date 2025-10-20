import { NextResponse } from "next/server";
import { Pinecone } from "@pinecone-database/pinecone";
import { GoogleGenAI } from "@google/genai";
import { genEmbeddingsGemini, queryMoviesByEmbedding } from "../Utils/utlis";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q");

    if (!query) {
      return NextResponse.json(
        { error: "Query parameter 'q' is required" },
        { status: 400 }
      );
    }

    const embedding = await genEmbeddingsGemini(query);

    const searchResults = await queryMoviesByEmbedding(embedding, 20);
    return NextResponse.json(searchResults);
  } catch (error: any) {
    return NextResponse.json(
      { error: "Failed to search movies", details: error.message },
      { status: 500 }
    );
  }
}
