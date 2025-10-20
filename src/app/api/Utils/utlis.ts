import { GoogleGenAI } from "@google/genai";
import { Pinecone } from "@pinecone-database/pinecone";

export const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
export const PINECONE_API_KEY = process.env.PINECONE_API_KEY;
export const INDEX_NAME = process.env.PINECONE_INDEX!;

export const pc = new Pinecone({ apiKey: PINECONE_API_KEY! });
export const index = pc.index(INDEX_NAME);
export const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

export async function genEmbeddingsGemini(text: string) {
  const response = await ai.models.embedContent({
    model: "gemini-embedding-001",
    contents: text,
    config: { outputDimensionality: 3072 },
  });
  return response.embeddings?.[0]?.values;
}

export async function queryMoviesByEmbedding(embedding: any, topK = 10) {
  const results = await index.query({
    vector: embedding,
    topK,
    includeMetadata: true,
  });

  return results.matches.map((m: any) => ({
    movie_id: m.metadata.id,
    movie_name: m.metadata.title,
    genre: m.metadata.genre,
    overview: m.metadata.overview,
    director: m.metadata.director,
    cast: m.metadata.cast,
    year: m.metadata.year,
  }));
}
