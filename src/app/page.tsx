"use client";

import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  Film,
  Search,
  Heart,
  Star,
  Sparkles,
  Flame,
  Mic2,
  Eye,
  Drama,
  Rocket,
  Skull,
  Clapperboard,
  Ghost,
  Mountain,
  Swords,
  Play,
  Plus,
  TrendingUp,
  User,
  Settings,
  Check, // Import Check icon for 'Liked' state
} from "lucide-react";
import { movies } from "./db/movies";
import { genres, heroMovies } from "./db/Homepadedb";
import { NavigationBar } from "./components/Header and footer";
import { Footer } from "./components/Header and footer";

//================================================================================
// --- TYPE DEFINITIONS & CONSTANTS ---
//================================================================================

interface Movie {
  id?: any;
  movie_id: string;
  movie_name: string;
  genre: string;
  overview: string;
  director?: string;
  cast?: string;
  year: string;
}

interface HeroMovie extends Movie {
  backdrop_url: string;
}

// Local Storage Keys
const GENRE_STORAGE_KEY = "user_preferred_genres";
const LIKED_MOVIES_STORAGE_KEY = "user_liked_movie";

// API and Image Configuration (Unchanged)
const TMDB_API_KEY = "b36a8f5e4e7fd0a175b10384cc76a0ab";
const TMDB_BASE_URL = "https://api.themoviedb.org/3/movie/";
const POSTER_BASE_URL = "https://image.tmdb.org/t/p/w500/";
const BACKDROP_BASE_URL = "https://image.tmdb.org/t/p/original/";
const FEED_API_ROUTE = "/api/feed";

// --- Utility: getMovieImages (Unchanged) ---
async function getMovieImages(movieId: string) {
  if (!movieId) {
    return { poster: "/placeholder.jpg", backdrop: "/placeholder.jpg" };
  }
  const fetchUrl = `${TMDB_BASE_URL}${movieId}/images?api_key=${TMDB_API_KEY}`;
  // ... (image fetching logic remains the same)
  try {
    const response = await fetch(fetchUrl);
    if (!response.ok) {
      // throw new Error(`TMDb API Error: ${response.status}`);
      console.log(`TMDb API Error: ${response.status}`);
    }
    const data = await response.json();
    const posterPath = data.posters?.[0]?.file_path || null;
    const backdropPath = data.backdrops?.[0]?.file_path || null;

    return {
      poster: posterPath
        ? `${POSTER_BASE_URL}${posterPath}`
        : "/placeholder.jpg",
      backdrop: backdropPath
        ? `${BACKDROP_BASE_URL}${backdropPath}`
        : "/placeholder.jpg",
    };
  } catch (error) {
    console.error("Failed to fetch movie images:", error);
    return { poster: "/placeholder.jpg", backdrop: "/placeholder.jpg" };
  }
}

interface MovieCardProps {
  movie: Movie;
  router: any;
  isLiked: boolean;
  onToggleLike: (movie: Movie) => void;
}

function MovieCard({ movie, router, isLiked, onToggleLike }: MovieCardProps) {
  const [posterUrl, setPosterUrl] = useState<string | null>(null);
  const title = movie.movie_name || "Unknown Title";
  const year = movie.year || "N/A";

  useEffect(() => {
    async function fetchImage() {
      const { poster } = await getMovieImages(movie.movie_id);
      setPosterUrl(poster);
    }
    if (movie.movie_id) {
      fetchImage();
    }
  }, [movie.movie_id]);

  if (!posterUrl) {
    return (
      <div className="group flex-shrink-0 w-48 animate-pulse">
        <div className="relative aspect-[2/3] rounded-xl overflow-hidden bg-slate-800"></div>
        <div className="mt-3 space-y-2">
          <div className="h-4 bg-slate-800 rounded w-3/4"></div>
          <div className="h-3 bg-slate-800 rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  const likeButtonClasses = isLiked
    ? "w-9 h-9 rounded-full bg-red-600/90 flex items-center justify-center hover:scale-110 transition-transform shadow-lg border-2 border-red-500" // Liked state: Red/Checked
    : "w-9 h-9 rounded-full bg-slate-800/95 border-2 border-slate-600 flex items-center justify-center hover:scale-110 transition-transform"; // Unliked state: Grey/Plus

  const likeIcon = isLiked ? (
    <Check className="w-5 h-5 text-white" strokeWidth={2.5} />
  ) : (
    <Plus className="w-4 h-4 text-white" strokeWidth={2.5} />
  );

  return (
    <div
      className="group cursor-pointer flex-shrink-0 w-48"
      onClick={() => router.push(`/movie/${movie.movie_id}`)} // Main card click redirects to movie details
    >
      <div className="relative aspect-[2/3] rounded-xl overflow-hidden bg-slate-800/50 border-2 border-slate-800/50 group-hover:border-slate-700 transition-all">
        <Image
          src={posterUrl}
          alt={title}
          fill
          sizes="200px"
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="absolute bottom-0 left-0 right-0 p-4">
            <div className="flex items-center gap-2 mb-2">
              {/* Play Button - Redirects to Movie Details */}
              <button
                className="w-9 h-9 rounded-full bg-white/95 flex items-center justify-center hover:scale-110 transition-transform shadow-lg"
                onClick={(e) => {
                  e.stopPropagation(); // Prevent card click
                  router.push(`/movie/${movie.movie_id}`);
                }}
              >
                <Play
                  className="w-4 h-4 text-slate-900 ml-0.5"
                  fill="currentColor"
                />
              </button>

              {/* Add/Remove Button - Toggles Like Status */}
              <button
                className={likeButtonClasses}
                onClick={(e) => {
                  e.stopPropagation(); // Prevent card click
                  onToggleLike(movie);
                }}
              >
                {likeIcon}
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-3 space-y-1">
        <h3 className="text-slate-200 font-medium truncate group-hover:text-white transition-colors">
          {title}
        </h3>
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <span>{year}</span>
        </div>
      </div>
    </div>
  );
}

// --- Other UI components (Loader, EmptyMessage, HeroSkeleton) remain unchanged ---
const MovieListLoader = () => (
  <div className="pb-4 -mb-4 overflow-x-auto">
    <div className="grid grid-rows-2 grid-flow-col-dense gap-5 w-max">
      {Array.from({ length: 12 }).map((_, index) => (
        <div key={index} className="group flex-shrink-0 w-48 animate-pulse">
          <div className="relative aspect-[2/3] rounded-xl overflow-hidden bg-slate-800/80"></div>
          <div className="mt-3 space-y-2">
            <div className="h-4 bg-slate-800 rounded w-3/4"></div>
            <div className="h-3 bg-slate-800 rounded w-1/2"></div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const EmptyLikesMessage = () => (
  <div className="flex items-center justify-center h-48 p-8 bg-slate-800/40 rounded-xl border border-slate-700/50">
    <div className="text-center space-y-3">
      <Heart className="w-8 h-8 text-red-500 mx-auto" strokeWidth={1.5} />
      <h3 className="text-xl font-semibold text-slate-100">
        Unlock Semantic Magic
      </h3>
      <p className="text-slate-400 max-w-sm">
        Like a few movies to get truly personalized, semantically similar
        recommendations here. Your taste is the key!
      </p>
    </div>
  </div>
);

const HeroSkeleton = () => (
  <div className="absolute inset-0 animate-pulse">
    <div className="absolute inset-0 bg-slate-900/80"></div>
    <div className="relative h-full max-w-7xl mx-auto px-6 flex items-end pb-20">
      <div className="max-w-2xl space-y-6">
        <div className="h-4 w-24 bg-slate-800 rounded-full"></div>
        <div className="h-16 bg-slate-800 rounded w-full"></div>
        <div className="h-6 bg-slate-800 rounded w-5/6"></div>
        <div className="space-y-2">
          <div className="h-3 bg-slate-800 rounded w-11/12"></div>
          <div className="h-3 bg-slate-800 rounded w-full"></div>
        </div>
        <div className="flex items-center gap-4 pt-4">
          <div className="h-14 w-40 bg-indigo-700/50 rounded-xl"></div>
          <div className="h-14 w-40 bg-slate-800/60 rounded-xl border border-slate-700/50"></div>
        </div>
      </div>
    </div>
  </div>
);

//================================================================================
// --- MAIN HOME PAGE COMPONENT (MODIFIED) ---
//================================================================================
export default function HomePage() {
  const router = useRouter();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isScrolled, setIsScrolled] = useState(false);
  const [heroData, setHeroData] = useState<HeroMovie[]>([]);
  const [isLoadingHero, setIsLoadingHero] = useState(true);
  const [likedMovies, setLikedMovies] = useState<any>([]);
  const [genreFeed, setGenreFeed] = useState<Movie[]>([]);
  const [likesFeed, setLikesFeed] = useState<Movie[]>([]);
  const [isLoadingFeed, setIsLoadingFeed] = useState(true);
  // Renamed to explicitly track initial feed fetch completion
  const hasFetchedFeed = useRef(false);

  // --- Handler for toggling movie like status (Instant UI update + localStorage write) ---
  const handleToggleLike = useCallback((movieToToggle: Movie) => {
    setLikedMovies((prevLikedMovies: any) => {
      const isAlreadyLiked = prevLikedMovies.some(
        (m: any) => m.movie_id === movieToToggle.movie_id
      );

      let newLikedMovies: any;

      if (isAlreadyLiked) {
        // Remove movie
        newLikedMovies = prevLikedMovies.filter(
          (m: any) => m.movie_id !== movieToToggle.movie_id
        );
      } else {
        // Add movie, ensuring correct structure
        const newMovie = {
          ...movieToToggle,
          // Assign a unique ID if one doesn't exist, to match the desired format structure
          id: movieToToggle.id || Date.now().toString(),
        };
        newLikedMovies = [...prevLikedMovies, newMovie];
      }

      // Update localStorage immediately
      if (typeof window !== "undefined") {
        localStorage.setItem(
          LIKED_MOVIES_STORAGE_KEY,
          JSON.stringify(newLikedMovies)
        );
      }
      return newLikedMovies;
    });
  }, []);

  // Helper to check if a movie is liked
  const isMovieLiked = useCallback(
    (movieId: string) => likedMovies.some((m: any) => m.movie_id === movieId),
    [likedMovies]
  );

  // --- Redirection Handlers ---
  const handleGenreSettingsClick = () => router.push("/onboarding");
  const handleMyListClick = () => router.push("/mylist");
  const handleMovieDetailClick = (movieId: string) =>
    router.push(`/movie/${movieId}`);

  // --- Utility to load liked movies from localStorage (Runs only once on mount) ---
  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const likedMoviesString = localStorage.getItem(
          LIKED_MOVIES_STORAGE_KEY
        );
        const initialLikedMovies = likedMoviesString
          ? JSON.parse(likedMoviesString)
          : [];
        setLikedMovies(initialLikedMovies);
      } catch (e) {
        console.error("❌ Failed to load liked movies:", e);
        setLikedMovies([]);
      }
    }
  }, []);

  // --- API Fetch Effect for /api/feed (Optimized: Runs only on initial mount) ---
  useEffect(() => {
    // We only want to run this once on initial page load
    if (hasFetchedFeed.current) return;
    hasFetchedFeed.current = true; // Mark as fetched immediately

    // 1. Fetch current user data from localStorage for the API payload
    const likedGenresString =
      typeof window !== "undefined"
        ? localStorage.getItem(GENRE_STORAGE_KEY)
        : null;
    const likedMoviesString =
      typeof window !== "undefined"
        ? localStorage.getItem(LIKED_MOVIES_STORAGE_KEY)
        : null;

    let likedGenres: string[] = [];
    let likedMoviesForApi: any[] = [];

    try {
      likedGenres = likedGenresString ? JSON.parse(likedGenresString) : [];
      likedMoviesForApi = likedMoviesString
        ? JSON.parse(likedMoviesString)
        : [];

      // Map liked movies to the required minimal structure for the API call
      likedMoviesForApi = likedMoviesForApi.map((movie: any) => ({
        genre: movie.genre,
        overview: movie.overview,
        cast: movie.cast,
        movie_id: movie.movie_id,
      }));
    } catch (e) {
      console.error("Error parsing data from localStorage:", e);
    }

    if (!likedGenres || likedGenres.length === 0) {
      if (typeof window !== "undefined") {
        router.push("/onboarding");
      }
      // Since we marked it fetched, we reset loading state if we redirect
      setIsLoadingFeed(false);
      return;
    }

    async function fetchMovieFeed(genres: string[], movies: any[]) {
      setIsLoadingFeed(true);
      try {
        const payload = {
          likedGenres: genres,
          likedMovies: movies,
        };
        const response = await fetch(FEED_API_ROUTE, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch feed: ${response.statusText}`);
        }

        const data: { likedByGenre: Movie[]; likedByLikes: Movie[] } =
          await response.json();

        setGenreFeed(data.likedByGenre || []);
        setLikesFeed(data.likedByLikes || []);
      } catch (error) {
        console.error("Error fetching home feed:", error);
        setGenreFeed([]);
        setLikesFeed([]);
      } finally {
        setIsLoadingFeed(false);
      }
    }

    // Only run the fetch once on initial page load
    fetchMovieFeed(likedGenres, likedMoviesForApi);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router]); // DEPENDENCY ARRAY ONLY CONTAINS ROUTER

  // --- Hero Section Data Fetch and Slider Logic (Unchanged) ---
  useEffect(() => {
    async function fetchHeroData() {
      setIsLoadingHero(true);
      const dataWithImages = await Promise.all(
        heroMovies.map(async (movie: any) => {
          const { backdrop } = await getMovieImages(movie.movie_id);
          return {
            ...movie,
            backdrop_url: backdrop,
            title: movie.movie_name || "Featured Movie",
            overview: movie.overview || "No summary available.",
            year: movie.year || "N/A",
            genre: movie.genre || "N/A",
          };
        })
      );
      setHeroData(dataWithImages as HeroMovie[]);
      setIsLoadingHero(false);
    }
    fetchHeroData();
  }, []);

  // Hero slider interval
  useEffect(() => {
    if (heroData.length === 0) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroData.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [heroData.length]);

  // Nav scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const currentMovie = useMemo(
    () => heroData[currentSlide],
    [heroData, currentSlide]
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Background and Navigation (unchanged) */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900/10 via-transparent to-transparent"></div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-violet-900/10 via-transparent to-transparent"></div>
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:64px_64px]"></div>
      </div>

      {/* --- REFINED NAVIGATION BAR --- */}
      <NavigationBar isScrolled={isScrolled} />

      <main className="relative z-0 pt-18">
        {/* --- MODIFIED HERO SECTION (with Toggle Like Logic) --- */}
        <section className="relative h-[91vh] overflow-hidden">
          {isLoadingHero ? (
            <div className="flex justify-center items-center h-full text-slate-400">
              Loading...
            </div>
          ) : (
            heroData.map((movie: any, index: number) => {
              const liked = isMovieLiked(movie.movie_id);
              const likeButtonClasses = liked
                ? "flex items-center gap-3 px-8 py-4 bg-red-600 text-white rounded-xl font-semibold hover:bg-red-700 transition-all shadow-lg hover:shadow-xl hover:scale-105"
                : "flex items-center gap-3 px-8 py-4 bg-slate-800/60 text-white rounded-xl font-semibold hover:bg-slate-800 transition-all backdrop-blur-sm border border-slate-700/50 hover:scale-105";

              return (
                <div
                  key={movie.movie_id}
                  className={`absolute inset-0 transition-opacity duration-1000 ${
                    index === currentSlide ? "opacity-100" : "opacity-0"
                  }`}
                >
                  <div className="absolute inset-0">
                    <Image
                      src={movie.backdrop_url}
                      alt={movie.movie_name}
                      fill
                      priority={index === 0}
                      className="object-cover object-center"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/80 to-transparent"></div>
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent"></div>
                  </div>

                  <div className="relative h-full max-w-7xl z-100 mx-auto px-6 flex items-end pb-20">
                    <div className="max-w-2xl space-y-6">
                      <div className="flex items-center gap-3">
                        <div className="px-3 py-1.5 rounded-full bg-indigo-500/20 border border-indigo-400/30 backdrop-blur-sm">
                          <span className="text-indigo-300 text-sm font-medium">
                            Featured
                          </span>
                        </div>
                        <span className="text-slate-400 text-sm font-medium">
                          {movie.year || "Unknown"}
                        </span>
                        <span className="text-slate-500">•</span>
                        <span className="text-slate-400 text-sm">
                          {movie.genre?.split(",")[0] || "Unknown"}
                        </span>
                      </div>

                      <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-br from-slate-50 via-slate-200 to-slate-400 bg-clip-text text-transparent leading-tight">
                        {movie.movie_name || "Unknown Title"}
                      </h1>

                      <p className="text-slate-300 text-lg leading-relaxed line-clamp-2">
                        {movie.overview || "No summary available."}
                      </p>

                      <div className="flex items-center gap-4 pt-4 z-50">
                        {/* --- SEE DETAILS BUTTON --- */}
                        <button
                          onClick={() => handleMovieDetailClick(movie.movie_id)}
                          className="flex items-center gap-3 px-8 py-4 bg-white text-slate-900 rounded-xl font-semibold hover:bg-slate-100 transition-all shadow-lg hover:shadow-xl hover:scale-105"
                        >
                          <Play className="w-5 h-5" fill="currentColor" />
                          See Details
                        </button>

                        <button
                          onClick={() => handleToggleLike(movie)}
                          className={likeButtonClasses}
                        >
                          {liked ? (
                            <Check className="w-5 h-5" />
                          ) : (
                            <Plus className="w-5 h-5" />
                          )}
                          {liked ? "Remove from List" : "My List"}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
          {/* Slider Controls only show after loading */}
          {heroData.length > 0 && (
            <div className="absolute bottom-8 right-8 flex gap-2">
              {heroData.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`h-1 rounded-full transition-all ${
                    index === currentSlide
                      ? "w-8 bg-indigo-400"
                      : "w-6 bg-slate-600 hover:bg-slate-500"
                  }`}
                />
              ))}
            </div>
          )}
        </section>

        {/* --- DYNAMIC MOVIE LIST SECTION 1: likedByGenre --- */}
        <section className="py-12 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <TrendingUp className="w-6 h-6 text-indigo-400" />
                <h2 className="text-2xl font-semibold text-slate-200">
                  Curated Picks for You
                </h2>
              </div>

              {/* Change Genres Button */}
              <button
                onClick={handleGenreSettingsClick}
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-slate-400 bg-slate-800/50 hover:text-indigo-400 hover:bg-slate-800 transition-all border border-slate-700/50 text-sm font-medium"
              >
                <Settings className="w-4 h-4" />
                Change Genres
              </button>
            </div>
            {isLoadingFeed ? (
              <MovieListLoader />
            ) : (
              <div className="pb-4 -mb-4 overflow-x-auto scrollbar-thin scrollbar-thumb-indigo-500 scrollbar-track-transparent">
                <div className="grid grid-rows-2 grid-flow-col-dense gap-5 w-max">
                  {genreFeed.map((movie) => (
                    <MovieCard
                      key={movie.movie_id}
                      movie={movie}
                      router={router}
                      isLiked={isMovieLiked(movie.movie_id)}
                      onToggleLike={handleToggleLike}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>

        {/* --- DYNAMIC MOVIE LIST SECTION 2: likedByLikes --- */}
        <section className="py-12 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <Sparkles className="w-6 h-6 text-violet-400" />
                <h2 className="text-2xl font-semibold text-slate-200">
                  Smart Similarity — AI Suggestions
                </h2>
              </div>
            </div>
            {isLoadingFeed ? (
              <MovieListLoader />
            ) : likesFeed.length === 0 ? (
              <EmptyLikesMessage />
            ) : (
              <div className="pb-4 -mb-4 overflow-x-auto scrollbar-thin scrollbar-thumb-indigo-500 scrollbar-track-transparent">
                <div className="grid grid-rows-2 grid-flow-col-dense gap-5 w-max">
                  {likesFeed.map((movie) => (
                    <MovieCard
                      key={movie.movie_id}
                      movie={movie}
                      router={router}
                      isLiked={isMovieLiked(movie.movie_id)}
                      onToggleLike={handleToggleLike}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Genre Section (static - unchanged) */}
        <section className="py-12 px-6">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-2xl font-semibold text-slate-200 mb-8">
              Explore by Genre
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {genres.map((genre) => {
                const IconComponent = genre.icon;
                return (
                  <button
                    key={genre.name}
                    onClick={() => {
                      router.push(
                        "/search?q=" + encodeURIComponent(genre.name) + " movie"
                      );
                    }}
                    className="group relative overflow-hidden rounded-xl p-6 bg-slate-800/30 border-2 border-slate-700/40 hover:border-slate-600 hover:bg-slate-800/50 transition-all"
                  >
                    <div
                      className={`absolute inset-0 bg-gradient-to-br ${genre.color} opacity-0 group-hover:opacity-100 transition-opacity`}
                    ></div>
                    <div className="relative flex flex-col items-center gap-3">
                      <IconComponent className="w-8 h-8 text-slate-400 group-hover:text-slate-200 transition-colors" />
                      <span className="text-sm font-semibold text-slate-300 group-hover:text-white transition-colors">
                        {genre.name}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        {/* Footer (unchanged) */}
        <Footer />
      </main>
    </div>
  );
}
