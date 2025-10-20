import { NextResponse } from "next/server";
import { Pinecone } from "@pinecone-database/pinecone";
import { GoogleGenAI } from "@google/genai";
import { movies } from "@/app/db/movies";
import { genEmbeddingsGemini, queryMoviesByEmbedding } from "../Utils/utlis";

function shuffleArray<T>(arr: T[]): T[] {
  const copy = arr.slice();
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

async function getLikedByGenre(genres: string[]) {
  if (!genres.length) return [];

  const genreText = genres.join(" ") + " movies";
  const embedding = await genEmbeddingsGemini(genreText);
  const semanticMovies = await queryMoviesByEmbedding(embedding, 20);

  const genrePool = movies.filter((m) =>
    m.genre?.split(",").some((g) => genres.includes(g.trim()))
  );
  const randomMovies = shuffleArray(genrePool).slice(0, 8);

  const combined = shuffleArray([...semanticMovies, ...randomMovies]);
  return combined.filter(
    (v, i, a) => a.findIndex((x) => x.movie_id === v.movie_id) === i
  );
}

async function getLikedByLikes(likedMovies: any[]) {
  if (!likedMovies.length) return [];

  const promises = likedMovies.map(async (movie) => {
    const text = `${movie.genre ?? ""} ${movie.overview ?? ""} ${
      movie.cast ?? ""
    }`;
    const embedding = await genEmbeddingsGemini(text);
    return queryMoviesByEmbedding(embedding, 20);
  });

  const results = await Promise.all(promises);
  const flatResults = results.flat();

  const combined = shuffleArray(flatResults).slice(0, 20);
  return combined.filter(
    (v, i, a) => a.findIndex((x) => x.movie_id === v.movie_id) === i
  );
}

async function generateHomeFeed({ likedGenres = [], likedMovies = [] } = {}) {
  try {
    const [likedByGenre, likedByLikes] = await Promise.all([
      getLikedByGenre(likedGenres),
      getLikedByLikes(likedMovies),
    ]);

    return { likedByGenre, likedByLikes };
  } catch (err: any) {
    return { error: "Failed to generate home feed", details: err.message };
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { likedGenres = [], likedMovies = [] } = body;
    const feed = await generateHomeFeed({ likedGenres, likedMovies });
    return NextResponse.json(feed);
  } catch (error: any) {
    return NextResponse.json(
      { error: "Invalid request", details: error.message },
      { status: 400 }
    );
  }
}

export async function GET() {
  const likedGenres: any = ["Action", "Comedy"];
  const likedMovies: any = [
    movies[0],
    movies[10],
    movies[5],
    movies[90],
    movies[65],
  ];

  const feed = await generateHomeFeed({ likedGenres, likedMovies });
  return NextResponse.json(feed);
}
