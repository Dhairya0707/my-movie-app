import { NextResponse } from "next/server";
import { Pinecone } from "@pinecone-database/pinecone";
import { GoogleGenAI } from "@google/genai";
import { movies } from "@/app/db/movies";
import { genEmbeddingsGemini, queryMoviesByEmbedding } from "../Utils/utlis";

// --- GET API: Related Movies by movie_id ---
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const movieId = searchParams.get("movieId");

    if (!movieId) {
      return NextResponse.json(
        { error: "movieId query parameter is required" },
        { status: 400 }
      );
    }

    // // Find movie in local DB
    const movie = movies.find((m) => m.movie_id === movieId);
    if (!movie) {
      return NextResponse.json({ error: "Movie not found" }, { status: 404 });
    }

    // Generate embedding for this movie
    const text = `${movie.genre ?? ""} ${movie.overview ?? ""} ${
      movie.cast ?? ""
    }`;
    const embedding = await genEmbeddingsGemini(text);

    // Query Pinecone for top 5-10 related movies
    const relatedMovies = await queryMoviesByEmbedding(embedding, 20);

    // Filter out the original movie
    const filteredMovies = relatedMovies.filter((m) => m.movie_id !== movieId);
    console.log("Getting results for : ", movie.movie_name);

    return NextResponse.json(filteredMovies);
  } catch (error: any) {
    return NextResponse.json(
      { error: "Failed to fetch related movies", details: error.message },
      { status: 500 }
    );
  }
}
