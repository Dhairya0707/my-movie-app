"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import {
  Film,
  Search,
  Heart,
  Star,
  Play,
  Check,
  Clock,
  Calendar,
  ArrowLeft,
  User,
  TrendingUp,
  Award,
  ImageIcon,
  Users,
  Plus,
  Link,
  Info,
  Sparkles,
  Globe,
  DollarSign,
  Briefcase,
} from "lucide-react";
import { Footer, NavigationBar } from "@/app/components/Header and footer";
import {
  TMDB_BASE_URL,
  TMDB_API_KEY,
  POSTER_BASE_URL,
  BACKDROP_BASE_URL,
  IMAGE_BASE_URL,
  RELATED_API_ROUTE,
  LIKED_MOVIES_STORAGE_KEY,
} from "@/app/db/utils";

interface Genre {
  id: number;
  name: string;
}
interface CrewPerson {
  id: number;
  name: string;
  job: string;
  department: string;
  profile_path: string | null;
}
interface CastPerson {
  id: number;
  name: string;
  character: string;
  profile_path: string | null;
}
interface LocalRelatedMovie {
  movie_id: string;
  movie_name: string;
  year: string;
  genre: string;
  overview: string;
  director: string;
  cast: string;
  poster_path?: string;
  vote_average?: number;
}
interface MovieDetails {
  imdb_id: string;
  title: string;
  original_title: string;
  tagline: string;
  overview: string;
  backdrop_path: string;
  poster_path: string;
  vote_average: number;
  vote_count: number;
  runtime: number;
  release_date: string;
  status: string;
  original_language: string;
  budget: number;
  revenue: number;
  popularity: number;
  homepage: string;
  genres: Genre[];
  production_countries: { iso_3166_1: string; name: string }[];
  spoken_languages: { english_name: string; iso_639_1: string; name: string }[];
  credits: { cast: CastPerson[]; crew: CrewPerson[] };
  images: {
    backdrops: { file_path: string }[];
    posters: { file_path: string }[];
  };
  recommendations: { results: any[] };
}

async function getMovieImages(movieId: string) {
  if (!movieId) {
    return { poster: "/placeholder.jpg", backdrop: "/placeholder.jpg" };
  }
  const fetchUrl = `${TMDB_BASE_URL}${movieId}/images?api_key=${TMDB_API_KEY}`;
  try {
    const response = await fetch(fetchUrl);
    if (!response.ok) {
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

const getImageUrl = (
  filePath: string | null | undefined,
  size = "original"
) => {
  if (!filePath) return "/placeholder.jpg";
  const baseUrl =
    size === "original" ? IMAGE_BASE_URL : `https://image.tmdb.org/t/p/${size}`;
  return `${baseUrl}${filePath}`;
};

async function fetchMovieDetails(
  movieId: string
): Promise<MovieDetails | null> {
  const fetchUrl = `${TMDB_BASE_URL}${movieId}?api_key=${TMDB_API_KEY}&append_to_response=videos,credits,images,recommendations`;

  try {
    const response = await fetch(fetchUrl);
    if (!response.ok) throw new Error(`TMDb API Error: ${response.status}`);
    return (await response.json()) as MovieDetails;
  } catch (error) {
    console.error("Failed to fetch movie details:", error);
    return null;
  }
}

async function fetchRelatedMovies(
  movieId: string
): Promise<LocalRelatedMovie[]> {
  try {
    const response = await fetch(`${RELATED_API_ROUTE}?movieId=${movieId}`);
    if (!response.ok) throw new Error(`Related API Error: ${response.status}`);
    return (await response.json()) as LocalRelatedMovie[];
  } catch (error) {
    console.error("Failed to fetch related movies:", error);
    return [];
  }
}

function useLikedMovies() {
  const [likedMovies, setLikedMovies] = useState<any[]>([]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem(LIKED_MOVIES_STORAGE_KEY);
        setLikedMovies(stored ? JSON.parse(stored) : []);
      } catch (e) {
        console.error("Failed to load liked movies:", e);
      }
    }
  }, []);

  const toggleLike = useCallback((movie: MovieDetails) => {
    setLikedMovies((prev) => {
      const movieId = movie.imdb_id || movie.title;
      const isLiked = prev.some((m) => m.movie_id === movieId);
      let newLikedMovies;

      if (isLiked) {
        newLikedMovies = prev.filter((m) => m.movie_id !== movieId);
      } else {
        const formattedMovie = {
          movie_id: movieId,
          movie_name: movie.title,
          genre: movie.genres.map((g) => g.name).join(", "),
          overview: movie.overview,
          year: movie.release_date ? movie.release_date.substring(0, 4) : "N/A",
          id: Date.now().toString(),
        };
        newLikedMovies = [...prev, formattedMovie];
      }

      if (typeof window !== "undefined") {
        localStorage.setItem(
          LIKED_MOVIES_STORAGE_KEY,
          JSON.stringify(newLikedMovies)
        );
      }
      return newLikedMovies;
    });
  }, []);

  const isLiked = useCallback(
    (movieId: string) => likedMovies.some((m) => m.movie_id === movieId),
    [likedMovies]
  );

  return { isLiked, toggleLike };
}

const MovieDetailSkeleton = () => (
  <div className="min-h-screen bg-slate-950 animate-pulse">
    <div className="h-[70vh] w-full bg-slate-900 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-slate-950/50 to-slate-950"></div>
    </div>
    <div className="max-w-7xl mx-auto px-4 md:px-6 -mt-32 relative z-10">
      <div className="flex flex-col md:flex-row gap-6 md:gap-8">
        <div className="w-48 md:w-56 h-72 md:h-80 rounded-xl bg-slate-800 flex-shrink-0 shadow-2xl mx-auto md:mx-0"></div>
        <div className="flex-1 space-y-4 pt-4">
          <div className="h-8 bg-slate-800 rounded w-3/4"></div>
          <div className="h-5 bg-slate-800 rounded w-1/2"></div>
          <div className="flex gap-3 flex-wrap">
            <div className="h-9 w-24 bg-slate-800 rounded-lg"></div>
            <div className="h-9 w-20 bg-slate-800 rounded-lg"></div>
            <div className="h-9 w-28 bg-slate-800 rounded-lg"></div>
          </div>
          <div className="space-y-2 pt-2">
            <div className="h-4 bg-slate-800 rounded w-full"></div>
            <div className="h-4 bg-slate-800 rounded w-11/12"></div>
            <div className="h-4 bg-slate-800 rounded w-4/5"></div>
          </div>
          <div className="flex gap-3 pt-4">
            <div className="h-11 w-36 bg-indigo-700/50 rounded-lg"></div>
            <div className="h-11 w-11 bg-slate-800/60 rounded-lg"></div>
          </div>
        </div>
      </div>
    </div>
    <div className="max-w-7xl mx-auto px-4 md:px-6 py-12">
      <div className="h-4 w-32 bg-slate-800 mb-6 rounded"></div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-20 bg-slate-800/70 rounded-lg"></div>
        ))}
      </div>
    </div>
  </div>
);

const RelatedMovieCard = ({
  movie,
  router,
}: {
  movie: LocalRelatedMovie;
  router: any;
}) => {
  const [posterUrl, setPosterUrl] = useState("/placeholder.jpg");
  const [loadingPoster, setLoadingPoster] = useState(true);

  useEffect(() => {
    setLoadingPoster(true);
    getMovieImages(movie.movie_id)
      .then((images) => {
        setPosterUrl(images.poster);
        setLoadingPoster(false);
      })
      .catch(() => {
        setPosterUrl("/placeholder.jpg");
        setLoadingPoster(false);
      });
  }, [movie.movie_id]);

  if (loadingPoster) {
    return (
      <div className="group flex-shrink-0 w-40 md:w-44 animate-pulse">
        <div className="relative aspect-[2/3] rounded-lg overflow-hidden bg-slate-800"></div>
        <div className="mt-2 space-y-2">
          <div className="h-4 bg-slate-800 rounded w-3/4"></div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="group cursor-pointer flex-shrink-0 w-40 md:w-44"
      onClick={() => router.push(`/movie/${movie.movie_id}`)}
    >
      <div className="relative aspect-[2/3] rounded-lg overflow-hidden bg-slate-800/50 border border-slate-700/30 group-hover:border-indigo-500/50 transition-all shadow-lg group-hover:shadow-indigo-500/20">
        <Image
          src={posterUrl}
          alt={movie.movie_name}
          fill
          sizes="176px"
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
      </div>
      <div className="mt-2.5 space-y-1">
        <h3 className="text-slate-200 font-medium text-sm line-clamp-2 group-hover:text-white transition-colors">
          {movie.movie_name}
        </h3>
        <p className="text-slate-500 text-xs">{movie.year}</p>
      </div>
    </div>
  );
};

export default function MoviePage() {
  const router = useRouter();
  const params = useParams();
  const movieId = params.movieId as string;

  const [movie, setMovie] = useState<MovieDetails | null>(null);
  const [relatedMovies, setRelatedMovies] = useState<LocalRelatedMovie[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingRelated, setLoadingRelated] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");

  const { isLiked, toggleLike } = useLikedMovies();
  const likedStatus = isLiked(movieId);

  useEffect(() => {
    if (movieId) {
      setLoading(true);
      fetchMovieDetails(movieId)
        .then((data) => {
          setMovie(data);
          setLoading(false);
        })
        .catch(() => {
          setLoading(false);
          setMovie(null);
        });
    }
  }, [movieId]);

  useEffect(() => {
    if (movieId) {
      setLoadingRelated(true);
      fetchRelatedMovies(movieId)
        .then((data) => {
          setRelatedMovies(data);
          setLoadingRelated(false);
        })
        .catch(() => {
          setLoadingRelated(false);
          setRelatedMovies([]);
        });
    }
  }, [movieId]);

  const movieData = movie;
  const runtimeHours = movieData?.runtime
    ? Math.floor(movieData.runtime / 60)
    : 0;
  const runtimeMinutes = movieData?.runtime ? movieData.runtime % 60 : 0;
  const duration = movieData?.runtime
    ? `${runtimeHours}h ${runtimeMinutes}m`
    : "N/A";
  const year = movieData?.release_date
    ? new Date(movieData.release_date).getFullYear()
    : "N/A";
  const director = movieData?.credits.crew.find((p) => p.job === "Director");
  const writers = movieData?.credits.crew.filter(
    (p) => p.department === "Writing"
  );

  const crewByDepartment = useMemo(() => {
    if (!movieData) return {};
    return movieData.credits.crew.reduce((acc: any, person) => {
      if (!acc[person.department]) acc[person.department] = [];
      acc[person.department].push(person);
      return acc;
    }, {});
  }, [movieData]);

  if (loading) {
    return <MovieDetailSkeleton />;
  }

  if (!movieData) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-8 text-center text-slate-400">
        <Film className="w-16 h-16 text-indigo-500 mb-4" />
        <h1 className="text-3xl font-bold text-slate-100 mb-2">
          Movie Not Found
        </h1>
        <p>
          We couldn't retrieve details for the movie ID: {movieId}. Please check
          the URL.
        </p>
        <button
          onClick={() => router.push("/")}
          className="mt-6 px-6 py-2.5 bg-indigo-600 rounded-lg text-white hover:bg-indigo-700 transition-colors"
        >
          Go to Home
        </button>
      </div>
    );
  }

  const tabConfig = [
    { id: "overview", label: "Overview", icon: Info },
    { id: "cast", label: "Cast", icon: Users },
    { id: "crew", label: "Crew", icon: Briefcase },
    { id: "details", label: "Details", icon: Sparkles },
    { id: "images", label: "Media", icon: ImageIcon },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      {/* Fixed background gradients */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900/10 via-transparent to-transparent"></div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-violet-900/10 via-transparent to-transparent"></div>
      </div>

      {/* Navigation with proper background */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-slate-950/95 backdrop-blur-md border-b border-slate-800/50">
        <NavigationBar isScrolled={true} />
      </div>

      <main className="relative z-10 pt-16">
        {/* ===== REDESIGNED HERO SECTION ===== */}
        <section className="relative h-auto min-h-[70vh] overflow-hidden">
          {/* Backdrop Image with Gradient Overlay */}
          <div className="absolute inset-0 w-full h-full">
            <div
              className="absolute inset-0 bg-cover bg-center scale-105 blur-sm"
              style={{
                backgroundImage: `url(${getImageUrl(
                  movieData.backdrop_path,
                  "original"
                )})`,
              }}
            ></div>
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/90 to-slate-950/70"></div>
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-slate-950/30 to-slate-950"></div>
          </div>

          {/* Content Container */}
          <div className="relative max-w-7xl mx-auto px-4 md:px-6 pt-24 md:pt-32 pb-12">
            <div className="flex flex-col md:flex-row gap-6 md:gap-8 items-start">
              {/* Poster - Redesigned with better sizing */}
              <div className="flex-shrink-0 w-48 md:w-56 mx-auto md:mx-0">
                <div className="relative aspect-[2/3] rounded-xl overflow-hidden shadow-2xl border-2 border-slate-700/30 group">
                  <Image
                    src={getImageUrl(movieData.poster_path, "w500")}
                    alt={movieData.title}
                    fill
                    sizes="(max-width: 768px) 192px, 224px"
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    priority
                  />
                </div>
                {/* Action Buttons Below Poster - Better UX */}
                <div className="mt-4 space-y-2.5">
                  <a
                    href={`https://www.imdb.com/title/${movieData.imdb_id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 w-full px-4 py-2.5 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-all shadow-lg hover:shadow-indigo-500/30 hover:scale-[1.02]"
                  >
                    <Link className="w-4 h-4" />
                    View on IMDb
                  </a>
                  <button
                    onClick={() => toggleLike(movieData)}
                    className={`flex items-center justify-center gap-2 w-full px-4 py-2.5 rounded-lg font-medium transition-all border ${
                      likedStatus
                        ? "bg-red-500/20 text-red-400 border-red-500/40 hover:bg-red-500/30"
                        : "bg-slate-800/50 text-slate-300 border-slate-700/50 hover:bg-slate-800 hover:border-slate-600"
                    }`}
                  >
                    <Heart
                      className="w-4 h-4"
                      fill={likedStatus ? "currentColor" : "none"}
                    />
                    {likedStatus ? "Remove from Favorites" : "Add to Favorites"}
                  </button>
                </div>
              </div>

              {/* Movie Info - Redesigned layout */}
              <div className="flex-1 space-y-5 text-center md:text-left">
                {/* Title & Original Title */}
                <div className="space-y-2">
                  <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight bg-gradient-to-br from-white via-slate-100 to-slate-300 bg-clip-text text-transparent">
                    {movieData.title}
                  </h1>
                  {movieData.original_title !== movieData.title && (
                    <p className="text-base md:text-lg text-slate-400 italic">
                      {movieData.original_title}
                    </p>
                  )}
                  {movieData.tagline && (
                    <p className="text-base md:text-lg text-indigo-300/90 italic font-light pt-1">
                      "{movieData.tagline}"
                    </p>
                  )}
                </div>

                {/* Genres as Pills - Better UX */}
                <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                  {movieData.genres.map((genre) => (
                    <span
                      key={genre.id}
                      className="px-3 py-1 rounded-full bg-slate-800/60 border border-slate-700/50 text-slate-300 text-sm font-medium hover:bg-slate-800 transition-colors"
                    >
                      {genre.name}
                    </span>
                  ))}
                </div>

                {/* Meta Info Pills - Cleaner design */}
                <div className="flex flex-wrap items-center gap-3 justify-center md:justify-start">
                  <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-amber-500/15 border border-amber-500/30">
                    <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                    <span className="text-amber-300 font-semibold text-sm">
                      {movieData.vote_average.toFixed(1)}
                    </span>
                    <span className="text-amber-400/60 text-xs">
                      ({movieData.vote_count.toLocaleString()})
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-slate-800/40 border border-slate-700/40">
                    <Clock className="w-4 h-4 text-slate-400" />
                    <span className="text-slate-300 text-sm font-medium">
                      {duration}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-slate-800/40 border border-slate-700/40">
                    <Calendar className="w-4 h-4 text-slate-400" />
                    <span className="text-slate-300 text-sm font-medium">
                      {year}
                    </span>
                  </div>
                  <div className="px-3.5 py-1.5 rounded-lg bg-green-500/15 border border-green-500/30">
                    <span className="text-green-300 font-medium text-sm">
                      {movieData.status}
                    </span>
                  </div>
                </div>

                {/* Overview - Better typography */}
                <p className="text-slate-300 text-base md:text-lg leading-relaxed max-w-3xl">
                  {movieData.overview}
                </p>

                {/* Director & Writers - Compact format */}
                <div className="space-y-1.5 text-sm md:text-base">
                  {director && (
                    <div className="flex items-start gap-2">
                      <span className="text-slate-500 min-w-[70px]">
                        Director:
                      </span>
                      <span className="text-slate-200 font-medium">
                        {director.name}
                      </span>
                    </div>
                  )}
                  {writers && writers.length > 0 && (
                    <div className="flex items-start gap-2">
                      <span className="text-slate-500 min-w-[70px]">
                        Writers:
                      </span>
                      <span className="text-slate-200 font-medium">
                        {writers
                          .map((w) => w.name)
                          .slice(0, 3)
                          .join(", ")}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ===== REDESIGNED TABS NAVIGATION ===== */}
        <section className="sticky top-16 z-40 bg-slate-950/95 backdrop-blur-md border-b border-slate-800/50">
          <div className="max-w-7xl mx-auto px-4 md:px-6">
            <div className="flex gap-1 overflow-x-auto scrollbar-thin scrollbar-thumb-indigo-500 scrollbar-track-transparent">
              {tabConfig.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-4 md:px-6 py-3.5 font-medium transition-all whitespace-nowrap relative ${
                      activeTab === tab.id
                        ? "text-indigo-400"
                        : "text-slate-400 hover:text-slate-300"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{tab.label}</span>
                    {activeTab === tab.id && (
                      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-400"></div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        {/* ===== TAB CONTENT ===== */}
        <section className="py-10 md:py-16 px-4 md:px-6">
          <div className="max-w-7xl mx-auto">
            {/* Overview Tab */}
            {activeTab === "overview" && (
              <div className="space-y-10">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="p-4 md:p-5 rounded-xl bg-slate-800/20 border border-slate-700/30 hover:bg-slate-800/30 transition-colors">
                    <h3 className="text-slate-500 text-xs md:text-sm mb-1.5">
                      Language
                    </h3>
                    <p className="text-slate-100 font-semibold text-base md:text-lg">
                      {movieData.original_language.toUpperCase()}
                    </p>
                  </div>
                  <div className="p-4 md:p-5 rounded-xl bg-slate-800/20 border border-slate-700/30 hover:bg-slate-800/30 transition-colors">
                    <h3 className="text-slate-500 text-xs md:text-sm mb-1.5">
                      Popularity
                    </h3>
                    <p className="text-slate-100 font-semibold text-base md:text-lg">
                      {movieData.popularity.toFixed(0)}
                    </p>
                  </div>
                  <div className="p-4 md:p-5 rounded-xl bg-slate-800/20 border border-slate-700/30 hover:bg-slate-800/30 transition-colors">
                    <h3 className="text-slate-500 text-xs md:text-sm mb-1.5">
                      Release Year
                    </h3>
                    <p className="text-slate-100 font-semibold text-base md:text-lg">
                      {year}
                    </p>
                  </div>
                  <div className="p-4 md:p-5 rounded-xl bg-slate-800/20 border border-slate-700/30 hover:bg-slate-800/30 transition-colors">
                    <h3 className="text-slate-500 text-xs md:text-sm mb-1.5">
                      Runtime
                    </h3>
                    <p className="text-slate-100 font-semibold text-base md:text-lg">
                      {duration}
                    </p>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg md:text-xl font-semibold text-slate-200 mb-4 flex items-center gap-2">
                    <Globe className="w-5 h-5 text-indigo-400" />
                    Spoken Languages
                  </h3>
                  <div className="flex flex-wrap gap-2.5">
                    {movieData.spoken_languages.map((lang, index) => (
                      <div
                        key={index}
                        className="px-4 py-2 rounded-lg bg-slate-800/20 border border-slate-700/30 hover:bg-slate-800/30 transition-colors"
                      >
                        <span className="text-slate-300 text-sm">
                          {lang.english_name}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Cast Tab - Improved Grid */}
            {activeTab === "cast" && (
              <div>
                <h2 className="text-xl md:text-2xl font-semibold text-slate-200 mb-6 flex items-center gap-2">
                  <Users className="w-6 h-6 text-indigo-400" />
                  Cast ({movieData.credits.cast.length})
                </h2>
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-4 md:gap-5">
                  {movieData.credits.cast.slice(0, 24).map((person) => (
                    <div key={person.id} className="group">
                      <div className="aspect-square rounded-lg overflow-hidden bg-slate-800/40 border border-slate-700/30 group-hover:border-indigo-500/40 transition-all mb-2.5 relative shadow-lg">
                        {person.profile_path ? (
                          <Image
                            src={getImageUrl(person.profile_path, "w185")}
                            alt={person.name}
                            fill
                            sizes="150px"
                            className="object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-slate-800">
                            <User className="w-10 h-10 text-slate-600" />
                          </div>
                        )}
                      </div>
                      <h3 className="text-slate-200 font-medium text-sm line-clamp-1 group-hover:text-white transition-colors">
                        {person.name}
                      </h3>
                      <p className="text-slate-500 text-xs line-clamp-1">
                        {person.character}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Crew Tab - Better Organization */}
            {activeTab === "crew" && (
              <div className="space-y-8">
                {Object.entries(crewByDepartment)
                  .slice(0, 6)
                  .map(([department, members]: any) => (
                    <div key={department}>
                      <h2 className="text-lg md:text-xl font-semibold text-slate-200 mb-4">
                        {department}
                      </h2>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                        {members.slice(0, 9).map((person: any, index: any) => (
                          <div
                            key={`${person.id}-${index}`}
                            className="p-3.5 rounded-lg bg-slate-800/20 border border-slate-700/30 flex items-center gap-3 hover:bg-slate-800/30 hover:border-slate-700/50 transition-all"
                          >
                            <div className="w-12 h-12 rounded-lg overflow-hidden bg-slate-800 flex-shrink-0 relative">
                              {person.profile_path ? (
                                <Image
                                  src={getImageUrl(person.profile_path, "w185")}
                                  alt={person.name}
                                  fill
                                  sizes="48px"
                                  className="object-cover"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                  <User className="w-6 h-6 text-slate-600" />
                                </div>
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="text-slate-200 font-medium text-sm truncate">
                                {person.name}
                              </h3>
                              <p className="text-slate-500 text-xs truncate">
                                {person.job}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
              </div>
            )}

            {/* Details Tab - Redesigned as Cards */}
            {activeTab === "details" && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Financial Info Card */}
                <div className="p-5 md:p-6 rounded-xl bg-slate-800/20 border border-slate-700/30">
                  <h3 className="text-lg font-semibold text-slate-200 mb-4 flex items-center gap-2">
                    <DollarSign className="w-5 h-5 text-indigo-400" />
                    Financial Information
                  </h3>
                  <div className="space-y-3">
                    {[
                      {
                        label: "Budget",
                        value:
                          movieData.budget > 0
                            ? `$${(movieData.budget / 1000000).toFixed(1)}M`
                            : "N/A",
                      },
                      {
                        label: "Revenue",
                        value:
                          movieData.revenue > 0
                            ? `$${(movieData.revenue / 1000000).toFixed(1)}M`
                            : "N/A",
                      },
                      {
                        label: "Status",
                        value: movieData.status,
                      },
                    ].map((item, index) => (
                      <div
                        key={index}
                        className="flex justify-between py-2.5 border-b border-slate-700/30 last:border-0"
                      >
                        <span className="text-slate-400 text-sm">
                          {item.label}
                        </span>
                        <span className="font-medium text-slate-200 text-sm">
                          {item.value}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Ratings Card */}
                <div className="p-5 md:p-6 rounded-xl bg-slate-800/20 border border-slate-700/30">
                  <h3 className="text-lg font-semibold text-slate-200 mb-4 flex items-center gap-2">
                    <Star className="w-5 h-5 text-amber-400" />
                    Ratings & Metrics
                  </h3>
                  <div className="space-y-3">
                    {[
                      {
                        label: "Average Rating",
                        value: `${movieData.vote_average.toFixed(1)}/10`,
                      },
                      {
                        label: "Total Votes",
                        value: movieData.vote_count.toLocaleString(),
                      },
                      {
                        label: "Popularity",
                        value: movieData.popularity.toFixed(0),
                      },
                    ].map((item, index) => (
                      <div
                        key={index}
                        className="flex justify-between py-2.5 border-b border-slate-700/30 last:border-0"
                      >
                        <span className="text-slate-400 text-sm">
                          {item.label}
                        </span>
                        <span className="font-medium text-slate-200 text-sm">
                          {item.value}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Production Info - Full Width */}
                <div className="lg:col-span-2 p-5 md:p-6 rounded-xl bg-slate-800/20 border border-slate-700/30">
                  <h3 className="text-lg font-semibold text-slate-200 mb-4 flex items-center gap-2">
                    <Globe className="w-5 h-5 text-indigo-400" />
                    Production Details
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-slate-400 text-sm mb-2">
                        Production Countries
                      </p>
                      <p className="text-slate-200 text-sm">
                        {movieData.production_countries
                          .map((c) => c.name)
                          .join(", ") || "N/A"}
                      </p>
                    </div>
                    <div>
                      <p className="text-slate-400 text-sm mb-2">IMDb ID</p>
                      <p className="text-slate-200 text-sm font-mono">
                        {movieData.imdb_id}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Images Tab - Horizontal Scroll for ALL Images */}
            {activeTab === "images" && (
              <div className="space-y-10">
                {/* --- BACKDROPS SECTION --- */}
                {movieData.images.backdrops.length > 0 && (
                  <div>
                    <h2 className="text-xl md:text-2xl font-semibold text-slate-200 mb-5 flex items-center gap-2">
                      <ImageIcon className="w-6 h-6 text-indigo-400" />
                      Backdrops ({movieData.images.backdrops.length})
                    </h2>
                    {/* Change to a simple grid that shows 2 columns (hence 2 items per row) and wraps to subsequent rows */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {movieData.images.backdrops.map((image, index) => (
                        <div
                          key={index}
                          className="aspect-video rounded-lg overflow-hidden bg-slate-800/40 border border-slate-700/30 hover:border-indigo-500/40 transition-all cursor-pointer group relative shadow-lg"
                        >
                          <Image
                            src={getImageUrl(image.file_path, "w780")}
                            alt={`Backdrop ${index + 1}`}
                            fill
                            sizes="(max-width: 640px) 100vw, 50vw"
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* --- POSTERS SECTION --- */}
                {movieData.images.posters.length > 0 && (
                  <div>
                    <h2 className="text-xl md:text-2xl font-semibold text-slate-200 mb-5 flex items-center gap-2">
                      <ImageIcon className="w-6 h-6 text-violet-400" />
                      Posters ({movieData.images.posters.length})
                    </h2>
                    {/* Change to a grid that shows 4 columns on desktop (hence 4 items per row) and wraps to subsequent rows */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                      {movieData.images.posters.map((image, index) => (
                        <div
                          key={index}
                          className="aspect-[2/3] rounded-lg overflow-hidden bg-slate-800/40 border border-slate-700/30 hover:border-violet-500/40 transition-all cursor-pointer group relative shadow-lg"
                        >
                          <Image
                            src={getImageUrl(image.file_path, "w342")}
                            alt={`Poster ${index + 1}`}
                            fill
                            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 20vw"
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </section>

        {/* ===== REDESIGNED RELATED MOVIES ===== */}
        {relatedMovies.length > 0 && (
          <section className="py-10 md:py-12 px-4 md:px-6 bg-slate-900/30">
            <div className="max-w-7xl mx-auto">
              <h2 className="text-2xl md:text-3xl font-bold text-slate-200 mb-6 flex items-center gap-2">
                <TrendingUp className="w-6 h-6 text-indigo-400" />
                You Might Also Like
              </h2>
              <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-indigo-500 scrollbar-track-transparent pb-4 -mb-4">
                <div className="grid grid-rows-2 grid-flow-col gap-4 w-max">
                  {relatedMovies.map((rec) => (
                    <RelatedMovieCard
                      key={rec.movie_id}
                      movie={rec}
                      router={router}
                    />
                  ))}
                </div>
              </div>
            </div>
          </section>
        )}

        <Footer />
      </main>
    </div>
  );
}
// "use client";

// import { useState, useEffect, useCallback, useMemo } from "react";
// import { useParams, useRouter } from "next/navigation";
// import Image from "next/image";
// import {
//   Film,
//   Search,
//   Heart,
//   Star,
//   Play,
//   Check,
//   Clock,
//   Calendar,
//   ArrowLeft,
//   User,
//   TrendingUp,
//   Award,
//   ImageIcon,
//   Users,
//   Plus,
//   Link, // Used for IMDb/Homepage link
// } from "lucide-react";
// import { Footer, NavigationBar } from "@/app/components/Header and footer";
// import {
//   TMDB_BASE_URL,
//   TMDB_API_KEY,
//   POSTER_BASE_URL,
//   BACKDROP_BASE_URL,
//   IMAGE_BASE_URL,
//   RELATED_API_ROUTE,
//   LIKED_MOVIES_STORAGE_KEY,
// } from "@/app/db/utils";

// interface Genre {
//   id: number;
//   name: string;
// }
// interface CrewPerson {
//   id: number;
//   name: string;
//   job: string;
//   department: string;
//   profile_path: string | null;
// }
// interface CastPerson {
//   id: number;
//   name: string;
//   character: string;
//   profile_path: string | null;
// }
// interface LocalRelatedMovie {
//   movie_id: string;
//   movie_name: string;
//   year: string;
//   genre: string;
//   overview: string;
//   director: string;
//   cast: string;
//   poster_path?: string;
//   vote_average?: number;
// }
// interface MovieDetails {
//   imdb_id: string;
//   title: string;
//   original_title: string;
//   tagline: string;
//   overview: string;
//   backdrop_path: string;
//   poster_path: string;
//   vote_average: number;
//   vote_count: number;
//   runtime: number;
//   release_date: string;
//   status: string;
//   original_language: string;
//   budget: number;
//   revenue: number;
//   popularity: number;
//   homepage: string;
//   genres: Genre[];
//   production_countries: { iso_3166_1: string; name: string }[];
//   spoken_languages: { english_name: string; iso_639_1: string; name: string }[];
//   credits: { cast: CastPerson[]; crew: CrewPerson[] };
//   images: {
//     backdrops: { file_path: string }[];
//     posters: { file_path: string }[];
//   };
//   recommendations: { results: any[] };
// }

// async function getMovieImages(movieId: string) {
//   if (!movieId) {
//     return { poster: "/placeholder.jpg", backdrop: "/placeholder.jpg" };
//   }
//   const fetchUrl = `${TMDB_BASE_URL}${movieId}/images?api_key=${TMDB_API_KEY}`;
//   console.log("Fetching images from:", fetchUrl);
//   try {
//     const response = await fetch(fetchUrl);
//     if (!response.ok) {
//       console.log(`TMDb API Error: ${response.status}`);
//     }
//     const data = await response.json();
//     const posterPath = data.posters?.[0]?.file_path || null;
//     const backdropPath = data.backdrops?.[0]?.file_path || null;

//     return {
//       poster: posterPath
//         ? `${POSTER_BASE_URL}${posterPath}`
//         : "/placeholder.jpg",
//       backdrop: backdropPath
//         ? `${BACKDROP_BASE_URL}${backdropPath}`
//         : "/placeholder.jpg",
//     };
//   } catch (error) {
//     console.error("Failed to fetch movie images:", error);
//     return { poster: "/placeholder.jpg", backdrop: "/placeholder.jpg" };
//   }
// }

// const getImageUrl = (
//   filePath: string | null | undefined,
//   size = "original"
// ) => {
//   if (!filePath) return "/placeholder.jpg";
//   const baseUrl =
//     size === "original" ? IMAGE_BASE_URL : `https://image.tmdb.org/t/p/${size}`;
//   return `${baseUrl}${filePath}`;
// };

// async function fetchMovieDetails(
//   movieId: string
// ): Promise<MovieDetails | null> {
//   const fetchUrl = `${TMDB_BASE_URL}${movieId}?api_key=${TMDB_API_KEY}&append_to_response=videos,credits,images,recommendations`;
//   console.log("Fetching movie details from 222:", fetchUrl);
//   try {
//     const response = await fetch(fetchUrl);
//     if (!response.ok) throw new Error(`TMDb API Error: ${response.status}`);
//     return (await response.json()) as MovieDetails;
//   } catch (error) {
//     console.error("Failed to fetch movie details:", error);
//     return null;
//   }
// }

// async function fetchRelatedMovies(
//   movieId: string
// ): Promise<LocalRelatedMovie[]> {
//   try {
//     const response = await fetch(`${RELATED_API_ROUTE}?movieId=${movieId}`);
//     if (!response.ok) throw new Error(`Related API Error: ${response.status}`);
//     return (await response.json()) as LocalRelatedMovie[];
//   } catch (error) {
//     console.error("Failed to fetch related movies:", error);
//     return [];
//   }
// }

// function useLikedMovies() {
//   const [likedMovies, setLikedMovies] = useState<any[]>([]);

//   useEffect(() => {
//     if (typeof window !== "undefined") {
//       try {
//         const stored = localStorage.getItem(LIKED_MOVIES_STORAGE_KEY);
//         setLikedMovies(stored ? JSON.parse(stored) : []);
//       } catch (e) {
//         console.error("Failed to load liked movies:", e);
//       }
//     }
//   }, []);

//   const toggleLike = useCallback((movie: MovieDetails) => {
//     setLikedMovies((prev) => {
//       const movieId = movie.imdb_id || movie.title;
//       const isLiked = prev.some((m) => m.movie_id === movieId);
//       let newLikedMovies;

//       if (isLiked) {
//         newLikedMovies = prev.filter((m) => m.movie_id !== movieId);
//       } else {
//         const formattedMovie = {
//           movie_id: movieId,
//           movie_name: movie.title,
//           genre: movie.genres.map((g) => g.name).join(", "),
//           overview: movie.overview,
//           year: movie.release_date ? movie.release_date.substring(0, 4) : "N/A",
//           id: Date.now().toString(),
//         };
//         newLikedMovies = [...prev, formattedMovie];
//       }

//       if (typeof window !== "undefined") {
//         localStorage.setItem(
//           LIKED_MOVIES_STORAGE_KEY,
//           JSON.stringify(newLikedMovies)
//         );
//       }
//       return newLikedMovies;
//     });
//   }, []);

//   const isLiked = useCallback(
//     (movieId: string) => likedMovies.some((m) => m.movie_id === movieId),
//     [likedMovies]
//   );

//   return { isLiked, toggleLike };
// }

// const MovieDetailSkeleton = () => (
//   <div className="min-h-screen bg-slate-950 animate-pulse">
//     <div className="h-[85vh] w-full bg-slate-900 relative">
//       <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 to-transparent"></div>
//     </div>
//     <div className="max-w-7xl mx-auto -mt-60 lg:-mt-40 px-6 relative z-10">
//       <div className="flex flex-col md:flex-row gap-8">
//         <div className="w-full md:w-64 h-96 aspect-[2/3] rounded-2xl bg-slate-800 flex-shrink-0 shadow-2xl"></div>
//         <div className="space-y-6 pt-6 md:pt-12 w-full">
//           <div className="h-10 bg-slate-800 rounded w-full md:w-3/4"></div>
//           <div className="h-6 bg-slate-800 rounded w-1/3"></div>
//           <div className="flex gap-4">
//             <div className="h-5 w-20 bg-slate-800 rounded"></div>
//             <div className="h-5 w-24 bg-slate-800 rounded"></div>
//           </div>
//           <div className="space-y-2 pt-4">
//             <div className="h-3 bg-slate-800 rounded w-full"></div>
//             <div className="h-3 bg-slate-800 rounded w-11/12"></div>
//             <div className="h-3 bg-slate-800 rounded w-5/6"></div>
//           </div>
//           <div className="flex gap-4 pt-4">
//             <div className="h-12 w-40 bg-indigo-700/50 rounded-xl"></div>
//             <div className="h-12 w-12 bg-slate-800/60 rounded-xl"></div>
//           </div>
//         </div>
//       </div>
//     </div>
//     <div className="max-w-7xl mx-auto px-6 py-12">
//       <div className="h-4 w-40 bg-slate-800 mb-8 rounded"></div>
//       <div className="grid grid-cols-4 gap-6">
//         {[...Array(4)].map((_, i) => (
//           <div key={i} className="h-24 bg-slate-800/70 rounded-xl"></div>
//         ))}
//       </div>
//     </div>
//   </div>
// );

// const RelatedMovieCard = ({
//   movie,
//   router,
// }: {
//   movie: LocalRelatedMovie;
//   router: any;
// }) => {
//   const [posterUrl, setPosterUrl] = useState("/placeholder.jpg");
//   const [loadingPoster, setLoadingPoster] = useState(true);

//   useEffect(() => {
//     setLoadingPoster(true);

//     getMovieImages(movie.movie_id)
//       .then((images) => {
//         setPosterUrl(images.poster);
//         setLoadingPoster(false);
//       })
//       .catch(() => {
//         setPosterUrl("/placeholder.jpg");
//         setLoadingPoster(false);
//       });
//   }, [movie.movie_id]);

//   if (loadingPoster) {
//     return (
//       <div className="group flex-shrink-0 w-48 animate-pulse">
//         <div className="relative aspect-[2/3] rounded-xl overflow-hidden bg-slate-800"></div>
//         <div className="mt-3 space-y-2">
//           <div className="h-4 bg-slate-800 rounded w-3/4"></div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div
//       className="group cursor-pointer flex-shrink-0"
//       // Redirect using the TMDb ID
//       onClick={() => router.push(`/movie/${movie.movie_id}`)}
//     >
//       <div className="relative aspect-[2/3] rounded-xl overflow-hidden bg-slate-800/50 border-2 border-slate-800/50 group-hover:border-slate-700 transition-all">
//         <Image
//           src={posterUrl}
//           alt={movie.movie_name}
//           fill
//           sizes="200px"
//           className="object-cover"
//         />
//       </div>
//       <div className="mt-3 space-y-1">
//         <h3 className="text-slate-200 font-medium truncate group-hover:text-white transition-colors">
//           {movie.movie_name}
//         </h3>
//       </div>
//     </div>
//   );
// };

// export default function MoviePage() {
//   const router = useRouter();
//   const params = useParams();
//   const movieId = params.movieId as string;

//   const [movie, setMovie] = useState<MovieDetails | null>(null);
//   const [relatedMovies, setRelatedMovies] = useState<LocalRelatedMovie[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [loadingRelated, setLoadingRelated] = useState(true);
//   const [activeTab, setActiveTab] = useState("overview");

//   const { isLiked, toggleLike } = useLikedMovies();
//   const likedStatus = isLiked(movieId);

//   useEffect(() => {
//     if (movieId) {
//       setLoading(true);
//       fetchMovieDetails(movieId)
//         .then((data) => {
//           setMovie(data);
//           setLoading(false);
//         })
//         .catch(() => {
//           setLoading(false);
//           setMovie(null);
//         });
//     }
//   }, [movieId]);

//   useEffect(() => {
//     if (movieId) {
//       setLoadingRelated(true);
//       fetchRelatedMovies(movieId)
//         .then((data) => {
//           setRelatedMovies(data);
//           setLoadingRelated(false);
//         })
//         .catch(() => {
//           setLoadingRelated(false);
//           setRelatedMovies([]);
//         });
//     }
//   }, [movieId]);

//   const movieData = movie;
//   const runtimeHours = movieData?.runtime
//     ? Math.floor(movieData.runtime / 60)
//     : 0;
//   const runtimeMinutes = movieData?.runtime ? movieData.runtime % 60 : 0;
//   const duration = movieData?.runtime
//     ? `${runtimeHours}h ${runtimeMinutes}m`
//     : "N/A";
//   const year = movieData?.release_date
//     ? new Date(movieData.release_date).getFullYear()
//     : "N/A";
//   const director = movieData?.credits.crew.find((p) => p.job === "Director");
//   const writers = movieData?.credits.crew.filter(
//     (p) => p.department === "Writing"
//   );

//   // Group crew by department for Crew Tab
//   const crewByDepartment = useMemo(() => {
//     if (!movieData) return {};
//     return movieData.credits.crew.reduce((acc: any, person) => {
//       if (!acc[person.department]) acc[person.department] = [];
//       acc[person.department].push(person);
//       return acc;
//     }, {});
//   }, [movieData]);

//   // --- Render Conditions (Unchanged) ---
//   if (loading) {
//     return <MovieDetailSkeleton />;
//   }

//   if (!movieData) {
//     return (
//       <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-8 text-center text-slate-400">
//         <Film className="w-16 h-16 text-indigo-500 mb-4" />
//         <h1 className="text-3xl font-bold text-slate-100 mb-2">
//           Movie Not Found
//         </h1>
//         <p>
//           We couldn't retrieve details for the movie ID: {movieId}. Please check
//           the URL.
//         </p>
//         <button
//           onClick={() => router.push("/")}
//           className="mt-6 px-6 py-2 bg-indigo-600 rounded-lg text-white hover:bg-indigo-700 transition-colors"
//         >
//           Go to Home
//         </button>
//       </div>
//     );
//   }

//   // --- Render Page ---
//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-100">
//       <div className="fixed inset-0 z-0">
//         <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900/10 via-transparent to-transparent"></div>
//         <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-violet-900/10 via-transparent to-transparent"></div>
//       </div>

//       {/* --- BACK BUTTON & NAV OVERLAY --- */}
//       <NavigationBar isScrolled={false} />

//       <main className="relative z-10 pt-16">
//         {/* Hero Section */}
//         <section className="relative h-[85vh] overflow-hidden">
//           <div
//             className="absolute inset-0 bg-cover bg-center"
//             style={{
//               backgroundImage: `url(${getImageUrl(
//                 movieData.backdrop_path,
//                 "original"
//               )})`,
//             }}
//           >
//             <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/95 to-slate-950/30"></div>
//             <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/50 to-transparent"></div>
//           </div>

//           <div className="relative h-full max-w-7xl mx-auto px-6">
//             {/* Content block */}
//             <div className="flex items-end h-full pb-12">
//               <div className="flex gap-8 w-full">
//                 {/* Poster Column */}
//                 <div className="hidden md:block flex-shrink-0">
//                   <div className="w-64 aspect-[2/3] rounded-2xl overflow-hidden border-4 border-slate-800/50 shadow-2xl shadow-black/60 relative">
//                     <Image
//                       src={getImageUrl(movieData.poster_path, "w500")}
//                       alt={movieData.title}
//                       fill
//                       sizes="256px"
//                       className="object-cover"
//                     />
//                   </div>
//                 </div>

//                 {/* Info Column */}
//                 <div className="flex-1 space-y-6">
//                   <div className="space-y-4">
//                     <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-br from-slate-50 via-slate-200 to-slate-400 bg-clip-text text-transparent leading-tight">
//                       {movieData.title}
//                     </h1>
//                     {movieData.original_title !== movieData.title && (
//                       <p className="text-lg text-slate-400">
//                         ({movieData.original_title})
//                       </p>
//                     )}
//                     {movieData.tagline && (
//                       <p className="text-xl text-indigo-300 italic font-light">
//                         "{movieData.tagline}"
//                       </p>
//                     )}
//                   </div>

//                   {/* Rating & Metadata */}
//                   <div className="flex flex-wrap items-center gap-4">
//                     <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-amber-500/20 border border-amber-400/30">
//                       <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
//                       <span className="text-amber-200 font-semibold">
//                         {movieData.vote_average.toFixed(1)}
//                       </span>
//                       <span className="text-amber-300/60 text-sm">
//                         ({movieData.vote_count.toLocaleString()})
//                       </span>
//                     </div>
//                     <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-800/50 border border-slate-700/50">
//                       <Clock className="w-4 h-4 text-slate-400" />
//                       <span className="text-slate-300">{duration}</span>
//                     </div>
//                     <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-800/50 border border-slate-700/50">
//                       <Calendar className="w-4 h-4 text-slate-400" />
//                       <span className="text-slate-300">{year}</span>
//                     </div>
//                     <div className="px-4 py-2 rounded-lg bg-green-500/20 border border-green-400/30">
//                       <span className="text-green-300 font-medium">
//                         {movieData.status}
//                       </span>
//                     </div>
//                   </div>

//                   {/* Action Buttons & Overview */}
//                   <p className="text-slate-300 text-lg leading-relaxed max-w-3xl pt-2">
//                     {movieData.overview}
//                   </p>

//                   <div className="space-y-2 text-slate-400">
//                     {director && (
//                       <div>
//                         <span className="text-slate-500">Director: </span>
//                         <span className="text-slate-200 font-medium">
//                           {director.name}
//                         </span>
//                       </div>
//                     )}
//                     {writers && writers.length > 0 && (
//                       <div>
//                         <span className="text-slate-500">Writers: </span>
//                         <span className="text-slate-200 font-medium">
//                           {writers
//                             .map((w) => w.name)
//                             .slice(0, 3)
//                             .join(", ")}
//                         </span>
//                       </div>
//                     )}
//                   </div>

//                   <div className="flex items-center gap-4 pt-4">
//                     {/* See IMDb Button */}
//                     <a
//                       href={`https://www.imdb.com/title/${movieData.imdb_id}`}
//                       target="_blank"
//                       rel="noopener noreferrer"
//                       className="flex items-center gap-3 px-10 py-4 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition-all shadow-lg hover:shadow-xl hover:scale-105"
//                     >
//                       <Link className="w-6 h-6" />
//                       See IMDb Details
//                     </a>

//                     {/* Small Heart/Like Button */}
//                     <button
//                       onClick={() => toggleLike(movieData)}
//                       className={`p-4 rounded-xl backdrop-blur-sm border transition-all hover:scale-105 ${
//                         likedStatus
//                           ? "bg-red-600/20 text-red-400 border-red-500/50 hover:bg-red-600/30"
//                           : "bg-slate-800/60 text-white border-slate-700/50 hover:bg-slate-800"
//                       }`}
//                     >
//                       <Heart
//                         className="w-5 h-5"
//                         fill={likedStatus ? "currentColor" : "none"}
//                       />
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </section>

//         {/* --- TABS SECTION --- */}
//         <section className="py-12 px-6">
//           <div className="max-w-7xl mx-auto">
//             <div className="flex gap-6 border-b border-slate-800/50 mb-8 overflow-x-auto scrollbar-thin scrollbar-thumb-indigo-500 scrollbar-track-transparent pb-1">
//               {["overview", "cast", "crew", "details", "images"].map((tab) => (
//                 <button
//                   key={tab}
//                   onClick={() => setActiveTab(tab)}
//                   className={`pb-4 px-2 font-semibold capitalize transition-all whitespace-nowrap text-lg ${
//                     activeTab === tab
//                       ? "text-indigo-400 border-b-2 border-indigo-400"
//                       : "text-slate-400 hover:text-slate-300"
//                   }`}
//                 >
//                   {tab}
//                 </button>
//               ))}
//             </div>

//             {/* Overview Tab Content */}
//             {activeTab === "overview" && (
//               <div className="space-y-12">
//                 <div>
//                   <h2 className="text-2xl font-semibold text-slate-200 mb-6 flex items-center gap-2">
//                     <Award className="w-6 h-6 text-indigo-400" />
//                     Key Information
//                   </h2>
//                   <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//                     <div className="p-6 rounded-xl bg-slate-800/30 border border-slate-700/40">
//                       <h3 className="text-slate-400 text-sm mb-2">
//                         Original Title
//                       </h3>
//                       <p className="text-slate-200 font-medium text-lg">
//                         {movieData.original_title}
//                       </p>
//                     </div>
//                     <div className="p-6 rounded-xl bg-slate-800/30 border border-slate-700/40">
//                       <h3 className="text-slate-400 text-sm mb-2">Language</h3>
//                       <p className="text-slate-200 font-medium text-lg">
//                         {movieData.original_language.toUpperCase()}
//                       </p>
//                     </div>
//                     <div className="p-6 rounded-xl bg-slate-800/30 border border-slate-700/40">
//                       <h3 className="text-slate-400 text-sm mb-2">
//                         Popularity
//                       </h3>
//                       <p className="text-slate-200 font-medium text-lg">
//                         {movieData.popularity.toFixed(2)}
//                       </p>
//                     </div>
//                     <div className="p-6 rounded-xl bg-slate-800/30 border border-slate-700/40">
//                       <h3 className="text-slate-400 text-sm mb-2">
//                         Release Year
//                       </h3>
//                       <p className="text-slate-200 font-medium text-lg">
//                         {year}
//                       </p>
//                     </div>
//                   </div>
//                 </div>

//                 <div>
//                   <h3 className="text-xl font-semibold text-slate-200 mb-4">
//                     Spoken Languages
//                   </h3>
//                   <div className="flex flex-wrap gap-3">
//                     {movieData.spoken_languages.map((lang, index) => (
//                       <div
//                         key={index}
//                         className="px-4 py-2 rounded-lg bg-slate-800/30 border border-slate-700/40"
//                       >
//                         <span className="text-slate-300">
//                           {lang.english_name} ({lang.name})
//                         </span>
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               </div>
//             )}

//             {/* Cast Tab Content */}
//             {activeTab === "cast" && (
//               <div>
//                 <h2 className="text-2xl font-semibold text-slate-200 mb-6 flex items-center gap-2">
//                   <Users className="w-6 h-6 text-indigo-400" />
//                   Full Cast ({movieData.credits.cast.length})
//                 </h2>
//                 <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
//                   {movieData.credits.cast.map((person) => (
//                     <div key={person.id} className="group cursor-pointer">
//                       <div className="aspect-square rounded-xl overflow-hidden bg-slate-800/50 border-2 border-slate-800/50 group-hover:border-slate-700 transition-all mb-3 relative">
//                         {person.profile_path ? (
//                           <Image
//                             src={getImageUrl(person.profile_path, "w185")}
//                             alt={person.name}
//                             fill
//                             sizes="185px"
//                             className="object-cover group-hover:scale-105 transition-transform duration-300"
//                           />
//                         ) : (
//                           <div className="w-full h-full flex items-center justify-center bg-slate-800">
//                             <User className="w-12 h-12 text-slate-600" />
//                           </div>
//                         )}
//                       </div>
//                       <h3 className="text-slate-200 font-medium truncate">
//                         {person.name}
//                       </h3>
//                       <p className="text-slate-400 text-sm truncate">
//                         {person.character}
//                       </p>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             )}

//             {/* Crew Tab Content */}
//             {activeTab === "crew" && (
//               <div className="space-y-12">
//                 {Object.entries(crewByDepartment).map(
//                   ([department, members]: any) => (
//                     <div key={department}>
//                       <h2 className="text-2xl font-semibold text-slate-200 mb-6">
//                         {department}
//                       </h2>
//                       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//                         {members.map((person: any, index: any) => (
//                           <div
//                             key={`${person.id}-${index}`}
//                             className="p-4 rounded-xl bg-slate-800/30 border border-slate-700/40 flex items-center gap-4 hover:bg-slate-800/50 transition-all"
//                           >
//                             <div className="w-16 h-16 rounded-lg overflow-hidden bg-slate-800 flex-shrink-0 relative">
//                               {person.profile_path ? (
//                                 <Image
//                                   src={getImageUrl(person.profile_path, "w185")}
//                                   alt={person.name}
//                                   fill
//                                   sizes="64px"
//                                   className="object-cover"
//                                 />
//                               ) : (
//                                 <div className="w-full h-full flex items-center justify-center">
//                                   <User className="w-8 h-8 text-slate-600" />
//                                 </div>
//                               )}
//                             </div>
//                             <div className="flex-1 min-w-0">
//                               <h3 className="text-slate-200 font-medium truncate">
//                                 {person.name}
//                               </h3>
//                               <p className="text-slate-400 text-sm truncate">
//                                 {person.job}
//                               </p>
//                             </div>
//                           </div>
//                         ))}
//                       </div>
//                     </div>
//                   )
//                 )}
//               </div>
//             )}

//             {/* Details Tab Content */}
//             {activeTab === "details" && (
//               <div className="space-y-8">
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
//                   {/* Financial & Runtime */}
//                   <div className="space-y-4">
//                     <h3 className="text-xl font-semibold text-slate-200">
//                       Financials & Runtime
//                     </h3>
//                     <div className="space-y-3">
//                       {[
//                         {
//                           label: "Runtime",
//                           value: `${movieData.runtime} min`,
//                           icon: Clock,
//                         },
//                         {
//                           label: "Status",
//                           value: movieData.status,
//                           icon: Film,
//                           color: "text-green-300",
//                         },
//                         {
//                           label: "Release Date",
//                           value: new Date(
//                             movieData.release_date
//                           ).toLocaleDateString(),
//                           icon: Calendar,
//                         },
//                         {
//                           label: "Budget",
//                           value:
//                             movieData.budget > 0
//                               ? `$${(movieData.budget / 1000000).toFixed(1)}M`
//                               : "N/A",
//                           icon: Award,
//                         },
//                         {
//                           label: "Revenue",
//                           value:
//                             movieData.revenue > 0
//                               ? `$${(movieData.revenue / 1000000).toFixed(1)}M`
//                               : "N/A",
//                           icon: Award,
//                         },
//                       ].map((item, index) => (
//                         <div
//                           key={index}
//                           className="flex justify-between py-3 border-b border-slate-800/50"
//                         >
//                           <span className="text-slate-400 flex items-center gap-2">
//                             <item.icon className="w-4 h-4 text-indigo-400" />
//                             {item.label}
//                           </span>
//                           <span
//                             className={`font-medium ${
//                               item.color || "text-slate-200"
//                             }`}
//                           >
//                             {item.value}
//                           </span>
//                         </div>
//                       ))}
//                     </div>
//                   </div>

//                   {/* Ratings & Production */}
//                   <div className="space-y-4">
//                     <h3 className="text-xl font-semibold text-slate-200">
//                       Ratings & Production
//                     </h3>
//                     <div className="space-y-3">
//                       {[
//                         {
//                           label: "Average Rating",
//                           value: `${movieData.vote_average.toFixed(1)}/10`,
//                           icon: Star,
//                           color: "text-amber-400",
//                         },
//                         {
//                           label: "Total Votes",
//                           value: movieData.vote_count.toLocaleString(),
//                           icon: Users,
//                         },
//                         {
//                           label: "Popularity Score",
//                           value: movieData.popularity.toFixed(2),
//                           icon: TrendingUp,
//                         },
//                         {
//                           label: "IMDb ID",
//                           value: movieData.imdb_id,
//                           icon: Link,
//                           color: "text-indigo-300",
//                         },
//                       ].map((item, index) => (
//                         <div
//                           key={index}
//                           className="flex justify-between py-3 border-b border-slate-800/50"
//                         >
//                           <span className="text-slate-400 flex items-center gap-2">
//                             <item.icon className="w-4 h-4 text-indigo-400" />
//                             {item.label}
//                           </span>
//                           <span
//                             className={`font-medium ${
//                               item.color || "text-slate-200"
//                             }`}
//                           >
//                             {item.value}
//                           </span>
//                         </div>
//                       ))}

//                       <div className="py-3 border-b border-slate-800/50">
//                         <h4 className="text-slate-400 mb-2">
//                           Production Countries:
//                         </h4>
//                         <p className="text-slate-200 font-medium">
//                           {movieData.production_countries
//                             .map((c) => c.name)
//                             .join(", ")}
//                         </p>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             )}

//             {/* Images Tab Content */}
//             {activeTab === "images" && (
//               <div className="space-y-10">
//                 <div>
//                   <h2 className="text-2xl font-semibold text-slate-200 mb-6 flex items-center gap-2">
//                     <ImageIcon className="w-6 h-6 text-indigo-400" />
//                     Backdrops ({movieData.images.backdrops.length})
//                   </h2>
//                   <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//                     {movieData.images.backdrops
//                       // .slice(0, 6)
//                       .map((image, index) => (
//                         <div
//                           key={index}
//                           className="aspect-video rounded-xl overflow-hidden bg-slate-800/50 border-2 border-slate-800/50 hover:border-indigo-500/50 transition-all cursor-pointer group relative"
//                         >
//                           <Image
//                             src={getImageUrl(image.file_path, "w780")}
//                             alt={`Backdrop ${index + 1}`}
//                             fill
//                             sizes="(max-width: 768px) 100vw, 33vw"
//                             className="object-cover group-hover:scale-105 transition-transform duration-300"
//                           />
//                         </div>
//                       ))}
//                   </div>
//                 </div>

//                 <div>
//                   <h2 className="text-2xl font-semibold text-slate-200 mb-6 flex items-center gap-2">
//                     <ImageIcon className="w-6 h-6 text-violet-400" />
//                     Posters ({movieData.images.posters.length})
//                   </h2>
//                   <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
//                     {movieData.images.posters
//                       // .slice(0, 6)
//                       .map((image, index) => (
//                         <div
//                           key={index}
//                           className="aspect-[2/3] rounded-xl overflow-hidden bg-slate-800/50 border-2 border-slate-800/50 hover:border-violet-500/50 transition-all cursor-pointer group relative"
//                         >
//                           <Image
//                             src={getImageUrl(image.file_path, "w342")}
//                             alt={`Poster ${index + 1}`}
//                             fill
//                             sizes="150px"
//                             className="object-cover"
//                           />
//                         </div>
//                       ))}
//                   </div>
//                 </div>
//               </div>
//             )}
//           </div>
//         </section>

//         {/* --- RELATED MOVIES SECTION (DYNAMICALLY FETCHED) --- */}
//         <section className="py-12 px-6">
//           <div className="max-w-7xl mx-auto">
//             {loadingRelated ? (
//               <p className="text-slate-400">Loading similar movies...</p>
//             ) : relatedMovies.length > 0 ? (
//               <>
//                 <h2 className="text-3xl font-bold text-slate-200 mb-8 flex items-center gap-3">
//                   <TrendingUp className="w-7 h-7 text-indigo-400" />
//                   Related Movies
//                 </h2>
//                 <div className="pb-4 -mb-4 overflow-x-auto scrollbar-thin scrollbar-thumb-indigo-500 scrollbar-track-transparent">
//                   <div className="flex gap-5 w-max">
//                     {relatedMovies.map((rec) => (
//                       <div key={rec.movie_id} className="flex-shrink-0 w-48">
//                         <RelatedMovieCard movie={rec} router={router} />
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               </>
//             ) : (
//               <div className="p-8 rounded-xl bg-slate-800/40 text-center text-slate-400 border border-slate-700/50">
//                 No related movies found for this title.
//               </div>
//             )}
//           </div>
//         </section>

//         <Footer />
//       </main>
//     </div>
//   );
// }
