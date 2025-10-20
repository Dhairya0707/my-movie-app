"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import Image from "next/image";
import Link from "next/link"; // Import Link
import { useRouter } from "next/navigation"; // Keep for now (for empty state button)
import { Heart, Film, User, Star, Play, Check, Plus } from "lucide-react";

// --- Import Reusable Components ---
import { NavigationBar, Footer } from "../components/Header and footer"; // Adjust path as needed

//================================================================================
// --- API & CONSTANTS (Re-used) ---
//================================================================================
const TMDB_API_KEY = "b36a8f5e4e7fd0a175b10384cc76a0ab";
const TMDB_BASE_URL = "https://api.themoviedb.org/3/movie/";
const POSTER_BASE_URL = "https://image.tmdb.org/t/p/w500/";
const LIKED_MOVIES_STORAGE_KEY = "user_liked_movie";

interface LikedMovie {
  id: string;
  movie_id: string;
  movie_name: string;
  genre: string;
  overview: string;
  year: string;
}

// --- Utility: getMovieImages (Must be defined locally or imported) ---
async function getMovieImages(movieId: string) {
  // ... (same as your original)
  if (!movieId) {
    return { poster: "/placeholder.jpg" };
  }
  const fetchUrl = `${TMDB_BASE_URL}${movieId}/images?api_key=${TMDB_API_KEY}`;
  try {
    const response = await fetch(fetchUrl);
    if (!response.ok) throw new Error(`TMDb API Error: ${response.status}`);
    const data = await response.json();
    const posterPath = data.posters?.[0]?.file_path || null;

    return {
      poster: posterPath
        ? `${POSTER_BASE_URL}${posterPath}`
        : "/placeholder.jpg",
    };
  } catch (error) {
    console.error("Failed to fetch movie images:", error);
    return { poster: "/placeholder.jpg" };
  }
}

//================================================================================
// --- UI COMPONENTS ---
//================================================================================

interface MyListMovieCardProps {
  movie: LikedMovie;
  onRemove: (movieId: string) => void;
}

// --- Updated MyListMovieCard ---
const MyListMovieCard = ({ movie, onRemove }: MyListMovieCardProps) => {
  const [posterUrl, setPosterUrl] = useState<string | null>(null);

  useEffect(() => {
    async function fetchImage() {
      const { poster } = await getMovieImages(movie.movie_id);
      setPosterUrl(poster);
    }
    if (movie.movie_id) {
      fetchImage();
    }
  }, [movie.movie_id]);

  const title = movie.movie_name || "Unknown Title";
  const year = movie.year || "N/A";
  const genre = movie.genre || "N/A";

  if (!posterUrl) {
    // Skeleton loader (unchanged)
    return (
      <div className="flex bg-slate-800/50 rounded-xl p-4 gap-4 animate-pulse">
        <div className="w-24 h-36 flex-shrink-0 bg-slate-700 rounded-lg"></div>
        <div className="flex-1 space-y-3 pt-2">
          <div className="h-5 w-3/4 bg-slate-700 rounded"></div>
          <div className="h-3 w-1/2 bg-slate-700 rounded"></div>
          <div className="h-3 w-full bg-slate-700 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    // --- Card is now wrapped in a Link ---
    <Link
      href={`/movie/${movie.movie_id}`}
      className="bg-slate-900/50 backdrop-blur-sm rounded-xl overflow-hidden border border-slate-800 transition-all hover:border-slate-700 hover:shadow-2xl hover:shadow-indigo-900/30 group"
    >
      <div className="flex p-4 gap-4">
        {/* Poster */}
        <div className="w-28 h-40 flex-shrink-0 relative rounded-lg overflow-hidden">
          <Image
            src={posterUrl}
            alt={title}
            fill
            sizes="112px"
            className="object-cover transition-transform group-hover:scale-105"
          />
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0 space-y-1">
          <h3 className="text-slate-100 text-xl font-bold truncate group-hover:text-white transition-colors">
            {title} ({year})
          </h3>
          <p className="text-sm text-indigo-300">{genre}</p>
          <p className="text-slate-400 text-sm line-clamp-3 pt-2">
            {movie.overview}
          </p>

          {/* Actions */}
          <div className="flex gap-3 pt-3">
            {/* --- Removed "Details" button --- */}
            <button
              onClick={(e) => {
                e.preventDefault(); // Stop Link navigation
                e.stopPropagation(); // Stop event bubbling
                onRemove(movie.movie_id);
              }}
              className="flex items-center gap-2 px-4 py-2 bg-red-600/20 border border-red-500/40 rounded-lg text-red-300 font-medium text-sm hover:bg-red-600/30 transition-colors"
            >
              <Check className="w-4 h-4" />
              Remove
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
};

//================================================================================
// --- MAIN PAGE COMPONENT ---
//================================================================================

export default function MyListPage() {
  const [likedMovies, setLikedMovies] = useState<LikedMovie[]>([]);
  const [loading, setLoading] = useState(true);

  // --- Load Movies on Mount (Unchanged) ---
  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const likedMoviesString = localStorage.getItem(
          LIKED_MOVIES_STORAGE_KEY
        );
        const initialLikedMovies: LikedMovie[] = likedMoviesString
          ? JSON.parse(likedMoviesString)
          : [];
        setLikedMovies(initialLikedMovies);
      } catch (e) {
        console.error("Failed to load liked movies from storage:", e);
      } finally {
        setLoading(false);
      }
    }
  }, []);

  // --- Remove Movie Handler (Unchanged) ---
  const handleRemoveMovie = useCallback((movieId: string) => {
    setLikedMovies((prevLikedMovies) => {
      const newLikedMovies = prevLikedMovies.filter(
        (m) => m.movie_id !== movieId
      );
      if (typeof window !== "undefined") {
        localStorage.setItem(
          LIKED_MOVIES_STORAGE_KEY,
          JSON.stringify(newLikedMovies)
        );
      }
      return newLikedMovies;
    });
  }, []);

  // --- Render Logic ---
  const content = useMemo(() => {
    if (loading) {
      // Skeleton (Unchanged)
      return (
        <div className="grid grid-cols-1 gap-6">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="h-44 bg-slate-800/70 rounded-xl animate-pulse"
            ></div>
          ))}
        </div>
      );
    }
    if (likedMovies.length === 0) {
      // Empty State
      return (
        <div className="p-12 rounded-xl bg-slate-800/50 border border-slate-700/50 text-center space-y-4">
          <Heart className="w-12 h-12 text-red-500 mx-auto" strokeWidth={1.5} />
          <h2 className="text-2xl font-bold text-slate-100">
            Your List is Empty
          </h2>
          <p className="text-slate-400">
            Start liking movies on the {/* --- Updated button to Link --- */}
            <Link href="/" className="text-indigo-400 hover:underline">
              Home Page
            </Link>{" "}
            to see them here!
          </p>
        </div>
      );
    }

    // Movie List
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {likedMovies.map((movie) => (
          <MyListMovieCard
            key={movie.movie_id}
            movie={movie}
            onRemove={handleRemoveMovie}
            // router prop removed
          />
        ))}
      </div>
    );
  }, [loading, likedMovies, handleRemoveMovie]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-100">
      {/* --- 1. Replaced inline nav with component --- */}
      <NavigationBar
        isScrolled={true} // Keep solid background
      />

      {/* --- 2. Added spacer for fixed navbar --- */}
      <div className="pt-20">
        {/* Background Visuals (Unchanged) */}
        <div className="fixed inset-0 z-0">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900/10 via-transparent to-transparent"></div>
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-violet-900/10 via-transparent to-transparent"></div>
        </div>

        {/* --- Main Content --- */}
        <main className="relative z-10 py-12 px-6">
          <div className="max-w-7xl mx-auto">
            {/* Page Title */}
            <div className="flex items-center gap-3 mb-8">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-500/20 to-red-700/20 flex items-center justify-center border border-red-500/30">
                <Heart className="w-6 h-6 text-red-400" fill="currentColor" />
              </div>
              <h1 className="text-4xl font-bold text-slate-100">
                My Liked Movies
              </h1>
            </div>

            {/* Rendered Content (Grid or Empty State) */}
            {content}
          </div>
        </main>
      </div>

      {/* --- 3. Replaced inline footer with component --- */}
      <Footer />
    </div>
  );
}
