import { Suspense } from "react";
import SearchPage from "./SearchPage";

export default function Search() {
  return (
    <Suspense
      fallback={<div className="text-center py-20">Loading search...</div>}
    >
      <SearchPage />
    </Suspense>
  );
}

// "use client";

// import { useState, useEffect, useCallback } from "react";
// // --- Added imports ---
// import { useRouter, useSearchParams } from "next/navigation";
// import Link from "next/link";
// import { NavigationBar, Footer } from "../components/Header and footer"; // Adjust path as needed

// import {
//   Film,
//   Search,
//   Heart,
//   Star,
//   Play,
//   Check,
//   Plus,
//   ArrowLeft,
//   Loader2,
//   TrendingUp,
//   User,
//   Bell,
//   Home,
//   Compass,
//   Sparkles,
//   Grid3x3,
//   List,
//   Calendar,
//   Clock,
// } from "lucide-react";

// // (Your helper functions like getImageUrl, TMDB constants, etc. go here)
// // ...
// const getImageUrl = (filePath: any, size = "w500") => {
//   if (!filePath) return "/placeholder.jpg";
//   return `https://image.tmdb.org/t/p/${size}${filePath}`;
// };
// const TMDB_API_KEY = "b36a8f5e4e7fd0a175b10384cc76a0ab";
// const TMDB_BASE_URL = "https://api.themoviedb.org/3/movie/";
// const POSTER_BASE_URL = "https://image.tmdb.org/t/p/w500/";
// const LIKED_MOVIES_STORAGE_KEY = "user_liked_movie";
// const SEARCH_API_ROUTE = "/api/search";

// async function getMovieImages(movieId: any) {
//   // ... (same as your original)
//   if (!movieId) return { poster: "/placeholder.jpg" };
//   const fetchUrl = `${TMDB_BASE_URL}${movieId}/images?api_key=${TMDB_API_KEY}`;
//   try {
//     const response = await fetch(fetchUrl);
//     if (!response.ok) console.error(`TMDb API Error: ${response.status}`);
//     const data = await response.json();
//     const posterPath = data.posters?.[0]?.file_path || null;
//     return {
//       poster: posterPath
//         ? `${POSTER_BASE_URL}${posterPath}`
//         : "/placeholder.jpg",
//     };
//   } catch (error) {
//     console.error("Failed to fetch movie images:", error);
//     return { poster: "/placeholder.jpg" };
//   }
// }

// function useLikedMovies() {
//   // ... (same as your original)
//   const [likedMovies, setLikedMovies] = useState([]);

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

//   const toggleLike = useCallback((movie: any) => {
//     setLikedMovies((prev: any) => {
//       const movieId = movie.movie_id;
//       const isLiked = prev.some((m: any) => m.movie_id === movieId);
//       let newLikedMovies;

//       if (isLiked) {
//         newLikedMovies = prev.filter((m: any) => m.movie_id !== movieId);
//       } else {
//         const formattedMovie = {
//           movie_id: movie.movie_id,
//           movie_name: movie.movie_name,
//           genre: movie.genre,
//           overview: movie.overview,
//           year: movie.year,
//           director: movie.director,
//           cast: movie.cast,
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
//     (movieId: any) => likedMovies.some((m: any) => m.movie_id === movieId),
//     [likedMovies]
//   );

//   return { isLiked, toggleLike };
// }
// // ...

// const SearchResultCard = ({
//   movie,
//   viewMode,
//   isLiked,
//   onToggleLike,
// }: {
//   movie: any;
//   viewMode: any;
//   isLiked: any;
//   onToggleLike: any;
// }) => {
//   const [posterUrl, setPosterUrl] = useState<any>(null);
//   const [loadingPoster, setLoadingPoster] = useState<any>(true);

//   useEffect(() => {
//     setLoadingPoster(true);
//     getMovieImages(movie.movie_id)
//       .then((images) => setPosterUrl(images.poster))
//       .catch(() => setPosterUrl("/placeholder.jpg"))
//       .finally(() => setLoadingPoster(false));
//   }, [movie.movie_id]);

//   const title = movie.movie_name || "Unknown Title";
//   const year = movie.year || "N/A";
//   const genre = movie.genre || "N/A";

//   if (loadingPoster) {
//     // ... (same loading skeleton as before)
//     return (
//       <div
//         className={`${
//           viewMode === "grid" ? "aspect-[2/3]" : "h-44"
//         } bg-slate-800/50 rounded-xl animate-pulse`}
//       >
//         <div className="w-full h-full bg-slate-700 rounded-xl"></div>
//       </div>
//     );
//   }

//   // --- Grid View ---
//   if (viewMode === "grid") {
//     return (
//       // --- Wrap card in Link component ---
//       <Link href={`/movie/${movie.movie_id}`} className="group cursor-pointer">
//         <div className="relative aspect-[2/3] rounded-xl overflow-hidden bg-slate-800/50 border-2 border-slate-800/50 group-hover:border-slate-700 transition-all">
//           <img
//             src={posterUrl}
//             alt={title}
//             className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
//           />
//           <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
//             <div className="absolute bottom-0 left-0 right-0 p-4 space-y-3">
//               {/* --- Removed "Details" button, changed flex to justify-end --- */}
//               <div className="flex items-center justify-end">
//                 <button
//                   onClick={(e) => {
//                     e.stopPropagation(); // Prevents link navigation
//                     onToggleLike(movie);
//                   }}
//                   className={`p-2.5 rounded-lg transition-colors ${
//                     isLiked
//                       ? "bg-red-600 hover:bg-red-700"
//                       : "bg-slate-800/90 hover:bg-slate-700"
//                   }`}
//                 >
//                   {isLiked ? (
//                     <Check className="w-4 h-4 text-white" strokeWidth={2.5} />
//                   ) : (
//                     <Plus className="w-4 h-4 text-white" strokeWidth={2.5} />
//                   )}
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//         <div className="mt-3 space-y-1">
//           <h3 className="text-slate-200 font-medium truncate group-hover:text-white transition-colors">
//             {title}
//           </h3>
//           <div className="flex items-center gap-2 text-xs text-slate-400">
//             <span>{year}</span>
//             <span>•</span>
//             <span className="truncate">{genre.split(",")[0]}</span>
//           </div>
//         </div>
//       </Link>
//     );
//   }

//   // --- List View ---
//   return (
//     // --- Wrap card in Link component ---
//     <Link
//       href={`/movie/${movie.movie_id}`}
//       className="bg-slate-900/50 backdrop-blur-sm rounded-xl overflow-hidden border border-slate-800 hover:border-slate-700 transition-all group"
//     >
//       <div className="flex p-5 gap-5">
//         <div className="w-32 h-48 flex-shrink-0 relative rounded-xl overflow-hidden">
//           <img
//             src={posterUrl}
//             alt={title}
//             className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
//           />
//         </div>

//         <div className="flex-1 min-w-0 space-y-3">
//           <div>
//             <h3 className="text-slate-100 text-2xl font-bold truncate group-hover:text-white transition-colors">
//               {title}
//             </h3>
//             <div className="flex items-center gap-3 mt-2 text-sm text-slate-400">
//               {/* ... (details like Calendar, etc.) ... */}
//               <div className="flex items-center gap-1">
//                 <Calendar className="w-4 h-4" />
//                 <span>{year}</span>
//               </div>
//               <span>•</span>
//               <span className="text-indigo-300">{genre}</span>
//             </div>
//           </div>

//           <p className="text-slate-400 text-sm leading-relaxed line-clamp-2">
//             {movie.overview}
//           </p>

//           <div className="flex items-center gap-2 text-sm text-slate-400">
//             <User className="w-4 h-4" />
//             <span className="truncate">
//               Director: <span className="text-slate-300">{movie.director}</span>
//             </span>
//           </div>

//           <div className="flex gap-3 pt-2">
//             {/* --- Removed "View Details" button --- */}
//             <button
//               onClick={(e) => {
//                 e.stopPropagation(); // Prevents link navigation
//                 onToggleLike(movie);
//               }}
//               className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-white font-semibold transition-colors ${
//                 isLiked
//                   ? "bg-red-600 hover:bg-red-700"
//                   : "bg-slate-800 hover:bg-slate-700"
//               }`}
//             >
//               {isLiked ? (
//                 <Check className="w-4 h-4" strokeWidth={2.5} />
//               ) : (
//                 <Plus className="w-4 h-4" strokeWidth={2.5} />
//               )}
//               {isLiked ? "Liked" : "My List"}
//             </button>
//           </div>
//         </div>
//       </div>
//     </Link>
//   );
// };

// export default function SearchPage() {
//   // --- Setup router and searchParams ---
//   const router = useRouter();
//   const searchParams = useSearchParams();

//   // --- Initialize state from URL ---
//   const [searchTerm, setSearchTerm] = useState(searchParams.get("q") || "");
//   const [results, setResults] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [hasSearched, setHasSearched] = useState(false);
//   const [viewMode, setViewMode] = useState("grid");
//   const { isLiked, toggleLike } = useLikedMovies();

//   // --- Search on page load if URL has query ---
//   useEffect(() => {
//     const queryFromUrl = searchParams.get("q");
//     if (queryFromUrl) {
//       setSearchTerm(queryFromUrl);
//       executeSearch(queryFromUrl, false); // false = don't update URL again
//     }
//   }, [searchParams]); // Re-run if URL params change

//   const executeSearch = async (query: string, updateUrl = true) => {
//     if (!query.trim()) {
//       setResults([]);
//       return;
//     }

//     // --- Update URL if requested ---
//     if (updateUrl) {
//       const encodedQuery = encodeURIComponent(query);
//       router.push(`/search?q=${encodedQuery}`); // Assumes page is at /search
//     }

//     setLoading(true);
//     setHasSearched(true);

//     try {
//       const encodedQuery = encodeURIComponent(query);
//       const url = `${SEARCH_API_ROUTE}?q=${encodedQuery}`;
//       const response = await fetch(url);
//       if (!response.ok) throw new Error("Search API failed");
//       const data = await response.json();
//       setResults(data);
//     } catch (error) {
//       console.error("Search fetch error:", error);
//       setResults([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleSearchSubmit = (e: any) => {
//     e.preventDefault();
//     executeSearch(searchTerm, true); // true = update URL
//   };

//   const renderContent = () => {
//     // ... (Your renderContent logic is unchanged)
//     if (loading) {
//       return (
//         <div className="text-center py-20">
//           <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-indigo-500/10 border border-indigo-500/20 mb-6">
//             <Loader2 className="w-8 h-8 text-indigo-400 animate-spin" />
//           </div>
//           <h3 className="text-xl font-semibold text-slate-200 mb-2">
//             Searching...
//           </h3>
//           <p className="text-slate-400">Finding the perfect matches for you</p>
//         </div>
//       );
//     }

//     if (hasSearched && results.length === 0) {
//       return (
//         <div className="max-w-lg mx-auto text-center py-20">
//           <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-slate-800/50 border border-slate-700/50 mb-6">
//             <Search className="w-10 h-10 text-slate-500" strokeWidth={1.5} />
//           </div>
//           <h2 className="text-3xl font-bold text-slate-100 mb-3">
//             No Results Found
//           </h2>
//           <p className="text-slate-400 text-lg leading-relaxed">
//             We couldn't find any movies matching your search. Try different
//             keywords or explore by genre, cast, or themes.
//           </p>
//         </div>
//       );
//     }

//     if (!hasSearched) {
//       return (
//         <div className="max-w-2xl mx-auto text-center py-20">
//           <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-indigo-500/20 to-violet-500/20 border border-indigo-500/30 mb-6">
//             <Sparkles className="w-10 h-10 text-indigo-400" strokeWidth={1.5} />
//           </div>
//           <h2 className="text-4xl font-bold text-slate-100 mb-4">
//             Discover Your Next Favorite
//           </h2>
//           <p className="text-slate-400 text-lg leading-relaxed mb-8">
//             Search for movies by plot, mood, cast, genre, or themes. Our
//             semantic search understands what you're looking for.
//           </p>
//           <div className="grid grid-cols-2 gap-3 text-sm">
//             <div className="p-4 rounded-lg bg-slate-800/30 border border-slate-700/40 text-left">
//               <p className="text-slate-400">Try searching:</p>
//               <p className="text-indigo-300 font-medium mt-1">
//                 "Movies about friendship"
//               </p>
//             </div>
//             <div className="p-4 rounded-lg bg-slate-800/30 border border-slate-700/40 text-left">
//               <p className="text-slate-400">Or try:</p>
//               <p className="text-indigo-300 font-medium mt-1">
//                 "Intense courtroom drama"
//               </p>
//             </div>
//           </div>
//         </div>
//       );
//     }

//     return (
//       <div
//         className={
//           viewMode === "grid"
//             ? "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6"
//             : "space-y-5"
//         }
//       >
//         {results.map((movie: any) => (
//           <SearchResultCard
//             key={movie.movie_id}
//             movie={movie}
//             viewMode={viewMode}
//             isLiked={isLiked(movie.movie_id)}
//             onToggleLike={toggleLike}
//           />
//         ))}
//       </div>
//     );
//   };

//   return (
//     // Note: The main component needs a <main> tag AND a spacer for the fixed navbar.
//     // The original code was complex. This simplifies it.
//     <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-200">
//       {/* --- Replaced inline nav with component --- */}
//       {/* We pass a placeholder function for My List and omit onSearchClick */}
//       <NavigationBar
//         isScrolled={true} // Hardcoded for solid bg, like original sticky nav
//       />

//       {/* --- Added spacer for fixed navbar --- */}
//       <div className="pt-20">
//         {" "}
//         {/* Adjust height based on your navbar's height */}
//         {/* Background decorative elements */}
//         <div className="fixed inset-0 z-0">
//           <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900/10 via-transparent to-transparent"></div>
//           <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-violet-900/10 via-transparent to-transparent"></div>
//           <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:64px_64px]"></div>
//         </div>
//         <main className="relative z-10">
//           <div className="max-w-7xl mx-auto px-6 py-12">
//             <form onSubmit={handleSearchSubmit} className="mb-8">
//               <div className="relative max-w-3xl mx-auto">
//                 <input
//                   type="text"
//                   value={searchTerm}
//                   onChange={(e) => setSearchTerm(e.target.value)}
//                   placeholder="Search for movies, themes, cast, or plot points..."
//                   className="w-full py-5 pl-14 pr-4 bg-slate-800/50 text-slate-100 text-lg rounded-2xl border-2 border-slate-700/50 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/20 transition-all placeholder-slate-500"
//                 />
//                 <Search className="absolute left-5 top-1/2 transform -translate-y-1/2 w-6 h-6 text-slate-500" />
//               </div>
//             </form>

//             {hasSearched && results.length > 0 && (
//               <div className="flex items-center justify-between mb-8">
//                 <div>
//                   <h2 className="text-2xl font-bold text-slate-200">
//                     Found{" "}
//                     <span className="text-indigo-400">{results.length}</span>{" "}
//                     results
//                   </h2>
//                   {searchTerm && (
//                     <p className="text-slate-400 mt-1">for "{searchTerm}"</p>
//                   )}
//                 </div>
//                 <div className="flex items-center gap-2">
//                   <button
//                     onClick={() => setViewMode("grid")}
//                     className={`p-2.5 rounded-lg transition-colors ${
//                       viewMode === "grid"
//                         ? "bg-indigo-600 text-white"
//                         : "bg-slate-800/50 text-slate-400 hover:text-slate-200"
//                     }`}
//                   >
//                     <Grid3x3 className="w-5 h-5" />
//                   </button>
//                   <button
//                     onClick={() => setViewMode("list")}
//                     className={`p-2.5 rounded-lg transition-colors ${
//                       viewMode === "list"
//                         ? "bg-indigo-600 text-white"
//                         : "bg-slate-800/50 text-slate-400 hover:text-slate-200"
//                     }`}
//                   >
//                     <List className="w-5 h-5" />
//                   </button>
//                 </div>
//               </div>
//             )}

//             {renderContent()}
//           </div>
//         </main>
//       </div>

//       {/* --- Replaced inline footer with component --- */}
//       <Footer />
//     </div>
//   );
// }

// // "use client";

// // import { useState, useEffect, useCallback } from "react";
// // import {
// //   Film,
// //   Search,
// //   Heart,
// //   Star,
// //   Play,
// //   Check,
// //   Plus,
// //   ArrowLeft,
// //   Loader2,
// //   TrendingUp,
// //   User,
// //   Bell,
// //   Home,
// //   Compass,
// //   Sparkles,
// //   Grid3x3,
// //   List,
// //   Calendar,
// //   Clock,
// // } from "lucide-react";

// // const getImageUrl = (filePath: any, size = "w500") => {
// //   if (!filePath) return "/placeholder.jpg";
// //   return `https://image.tmdb.org/t/p/${size}${filePath}`;
// // };

// // const TMDB_API_KEY = "b36a8f5e4e7fd0a175b10384cc76a0ab";
// // const TMDB_BASE_URL = "https://api.themoviedb.org/3/movie/";
// // const POSTER_BASE_URL = "https://image.tmdb.org/t/p/w500/";
// // const LIKED_MOVIES_STORAGE_KEY = "user_liked_movie";
// // const SEARCH_API_ROUTE = "/api/search";

// // async function getMovieImages(movieId: any) {
// //   if (!movieId) return { poster: "/placeholder.jpg" };
// //   const fetchUrl = `${TMDB_BASE_URL}${movieId}/images?api_key=${TMDB_API_KEY}`;
// //   try {
// //     const response = await fetch(fetchUrl);
// //     if (!response.ok) console.error(`TMDb API Error: ${response.status}`);
// //     const data = await response.json();
// //     const posterPath = data.posters?.[0]?.file_path || null;
// //     return {
// //       poster: posterPath
// //         ? `${POSTER_BASE_URL}${posterPath}`
// //         : "/placeholder.jpg",
// //     };
// //   } catch (error) {
// //     console.error("Failed to fetch movie images:", error);
// //     return { poster: "/placeholder.jpg" };
// //   }
// // }

// // function useLikedMovies() {
// //   const [likedMovies, setLikedMovies] = useState([]);

// //   useEffect(() => {
// //     if (typeof window !== "undefined") {
// //       try {
// //         const stored = localStorage.getItem(LIKED_MOVIES_STORAGE_KEY);
// //         setLikedMovies(stored ? JSON.parse(stored) : []);
// //       } catch (e) {
// //         console.error("Failed to load liked movies:", e);
// //       }
// //     }
// //   }, []);

// //   const toggleLike = useCallback((movie: any) => {
// //     setLikedMovies((prev: any) => {
// //       const movieId = movie.movie_id;
// //       const isLiked = prev.some((m: any) => m.movie_id === movieId);
// //       let newLikedMovies;

// //       if (isLiked) {
// //         newLikedMovies = prev.filter((m: any) => m.movie_id !== movieId);
// //       } else {
// //         const formattedMovie = {
// //           movie_id: movie.movie_id,
// //           movie_name: movie.movie_name,
// //           genre: movie.genre,
// //           overview: movie.overview,
// //           year: movie.year,
// //           director: movie.director,
// //           cast: movie.cast,
// //           id: Date.now().toString(),
// //         };
// //         newLikedMovies = [...prev, formattedMovie];
// //       }

// //       if (typeof window !== "undefined") {
// //         localStorage.setItem(
// //           LIKED_MOVIES_STORAGE_KEY,
// //           JSON.stringify(newLikedMovies)
// //         );
// //       }
// //       return newLikedMovies;
// //     });
// //   }, []);

// //   const isLiked = useCallback(
// //     (movieId: any) => likedMovies.some((m: any) => m.movie_id === movieId),
// //     [likedMovies]
// //   );

// //   return { isLiked, toggleLike };
// // }

// // const SearchResultCard = ({
// //   movie,
// //   viewMode,
// //   isLiked,
// //   onToggleLike,
// // }: {
// //   movie: any;
// //   viewMode: any;
// //   isLiked: any;
// //   onToggleLike: any;
// // }) => {
// //   const [posterUrl, setPosterUrl] = useState<any>(null);
// //   const [loadingPoster, setLoadingPoster] = useState<any>(true);

// //   useEffect(() => {
// //     setLoadingPoster(true);
// //     getMovieImages(movie.movie_id)
// //       .then((images) => setPosterUrl(images.poster))
// //       .catch(() => setPosterUrl("/placeholder.jpg"))
// //       .finally(() => setLoadingPoster(false));
// //   }, [movie.movie_id]);

// //   const title = movie.movie_name || "Unknown Title";
// //   const year = movie.year || "N/A";
// //   const genre = movie.genre || "N/A";

// //   if (loadingPoster) {
// //     return (
// //       <div
// //         className={`${
// //           viewMode === "grid" ? "aspect-[2/3]" : "h-44"
// //         } bg-slate-800/50 rounded-xl animate-pulse`}
// //       >
// //         <div className="w-full h-full bg-slate-700 rounded-xl"></div>
// //       </div>
// //     );
// //   }

// //   // Grid View
// //   if (viewMode === "grid") {
// //     return (
// //       <div className="group cursor-pointer">
// //         <div className="relative aspect-[2/3] rounded-xl overflow-hidden bg-slate-800/50 border-2 border-slate-800/50 group-hover:border-slate-700 transition-all">
// //           <img
// //             src={posterUrl}
// //             alt={title}
// //             className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
// //           />
// //           <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
// //             <div className="absolute bottom-0 left-0 right-0 p-4 space-y-3">
// //               <div className="flex items-center gap-2">
// //                 <button className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-white text-slate-900 rounded-lg font-semibold hover:bg-slate-100 transition-colors">
// //                   <Play className="w-4 h-4" fill="currentColor" />
// //                   Details
// //                 </button>
// //                 <button
// //                   onClick={(e) => {
// //                     e.stopPropagation();
// //                     onToggleLike(movie);
// //                   }}
// //                   className={`p-2.5 rounded-lg transition-colors ${
// //                     isLiked
// //                       ? "bg-red-600 hover:bg-red-700"
// //                       : "bg-slate-800/90 hover:bg-slate-700"
// //                   }`}
// //                 >
// //                   {isLiked ? (
// //                     <Check className="w-4 h-4 text-white" strokeWidth={2.5} />
// //                   ) : (
// //                     <Plus className="w-4 h-4 text-white" strokeWidth={2.5} />
// //                   )}
// //                 </button>
// //               </div>
// //             </div>
// //           </div>
// //         </div>
// //         <div className="mt-3 space-y-1">
// //           <h3 className="text-slate-200 font-medium truncate group-hover:text-white transition-colors">
// //             {title}
// //           </h3>
// //           <div className="flex items-center gap-2 text-xs text-slate-400">
// //             <span>{year}</span>
// //             <span>•</span>
// //             <span className="truncate">{genre.split(",")[0]}</span>
// //           </div>
// //         </div>
// //       </div>
// //     );
// //   }

// //   // List View
// //   return (
// //     <div className="bg-slate-900/50 backdrop-blur-sm rounded-xl overflow-hidden border border-slate-800 hover:border-slate-700 transition-all group">
// //       <div className="flex p-5 gap-5">
// //         <div className="w-32 h-48 flex-shrink-0 relative rounded-xl overflow-hidden">
// //           <img
// //             src={posterUrl}
// //             alt={title}
// //             className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
// //           />
// //         </div>

// //         <div className="flex-1 min-w-0 space-y-3">
// //           <div>
// //             <h3 className="text-slate-100 text-2xl font-bold truncate group-hover:text-white transition-colors">
// //               {title}
// //             </h3>
// //             <div className="flex items-center gap-3 mt-2 text-sm text-slate-400">
// //               <div className="flex items-center gap-1">
// //                 <Calendar className="w-4 h-4" />
// //                 <span>{year}</span>
// //               </div>
// //               <span>•</span>
// //               <span className="text-indigo-300">{genre}</span>
// //             </div>
// //           </div>

// //           <p className="text-slate-400 text-sm leading-relaxed line-clamp-2">
// //             {movie.overview}
// //           </p>

// //           <div className="flex items-center gap-2 text-sm text-slate-400">
// //             <User className="w-4 h-4" />
// //             <span className="truncate">
// //               Director: <span className="text-slate-300">{movie.director}</span>
// //             </span>
// //           </div>

// //           <div className="flex gap-3 pt-2">
// //             <button className="flex items-center gap-2 px-6 py-2.5 bg-white rounded-lg text-slate-900 font-semibold hover:bg-slate-100 transition-colors">
// //               <Play className="w-4 h-4" fill="currentColor" />
// //               View Details
// //             </button>
// //             <button
// //               onClick={() => onToggleLike(movie)}
// //               className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-white font-semibold transition-colors ${
// //                 isLiked
// //                   ? "bg-red-600 hover:bg-red-700"
// //                   : "bg-slate-800 hover:bg-slate-700"
// //               }`}
// //             >
// //               {isLiked ? (
// //                 <Check className="w-4 h-4" strokeWidth={2.5} />
// //               ) : (
// //                 <Plus className="w-4 h-4" strokeWidth={2.5} />
// //               )}
// //               {isLiked ? "Liked" : "My List"}
// //             </button>
// //           </div>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // };

// // export default function SearchPage() {
// //   const [searchTerm, setSearchTerm] = useState("");
// //   const [results, setResults] = useState([]);
// //   const [loading, setLoading] = useState(false);
// //   const [hasSearched, setHasSearched] = useState(false);
// //   const [viewMode, setViewMode] = useState("grid");
// //   const { isLiked, toggleLike } = useLikedMovies();

// //   const executeSearch = async (query: any) => {
// //     if (!query.trim()) {
// //       setResults([]);
// //       return;
// //     }

// //     setLoading(true);
// //     setHasSearched(true);

// //     try {
// //       const encodedQuery = encodeURIComponent(query);
// //       const url = `${SEARCH_API_ROUTE}?q=${encodedQuery}`;
// //       const response = await fetch(url);
// //       if (!response.ok) throw new Error("Search API failed");
// //       const data = await response.json();
// //       setResults(data);
// //     } catch (error) {
// //       console.error("Search fetch error:", error);
// //       setResults([]);
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   const handleSearchSubmit = (e: any) => {
// //     e.preventDefault();
// //     executeSearch(searchTerm);
// //   };

// //   const renderContent = () => {
// //     if (loading) {
// //       return (
// //         <div className="text-center py-20">
// //           <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-indigo-500/10 border border-indigo-500/20 mb-6">
// //             <Loader2 className="w-8 h-8 text-indigo-400 animate-spin" />
// //           </div>
// //           <h3 className="text-xl font-semibold text-slate-200 mb-2">
// //             Searching...
// //           </h3>
// //           <p className="text-slate-400">Finding the perfect matches for you</p>
// //         </div>
// //       );
// //     }

// //     if (hasSearched && results.length === 0) {
// //       return (
// //         <div className="max-w-lg mx-auto text-center py-20">
// //           <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-slate-800/50 border border-slate-700/50 mb-6">
// //             <Search className="w-10 h-10 text-slate-500" strokeWidth={1.5} />
// //           </div>
// //           <h2 className="text-3xl font-bold text-slate-100 mb-3">
// //             No Results Found
// //           </h2>
// //           <p className="text-slate-400 text-lg leading-relaxed">
// //             We couldn't find any movies matching your search. Try different
// //             keywords or explore by genre, cast, or themes.
// //           </p>
// //         </div>
// //       );
// //     }

// //     if (!hasSearched) {
// //       return (
// //         <div className="max-w-2xl mx-auto text-center py-20">
// //           <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-indigo-500/20 to-violet-500/20 border border-indigo-500/30 mb-6">
// //             <Sparkles className="w-10 h-10 text-indigo-400" strokeWidth={1.5} />
// //           </div>
// //           <h2 className="text-4xl font-bold text-slate-100 mb-4">
// //             Discover Your Next Favorite
// //           </h2>
// //           <p className="text-slate-400 text-lg leading-relaxed mb-8">
// //             Search for movies by plot, mood, cast, genre, or themes. Our
// //             semantic search understands what you're looking for.
// //           </p>
// //           <div className="grid grid-cols-2 gap-3 text-sm">
// //             <div className="p-4 rounded-lg bg-slate-800/30 border border-slate-700/40 text-left">
// //               <p className="text-slate-400">Try searching:</p>
// //               <p className="text-indigo-300 font-medium mt-1">
// //                 "Movies about friendship"
// //               </p>
// //             </div>
// //             <div className="p-4 rounded-lg bg-slate-800/30 border border-slate-700/40 text-left">
// //               <p className="text-slate-400">Or try:</p>
// //               <p className="text-indigo-300 font-medium mt-1">
// //                 "Intense courtroom drama"
// //               </p>
// //             </div>
// //           </div>
// //         </div>
// //       );
// //     }

// //     return (
// //       <div
// //         className={
// //           viewMode === "grid"
// //             ? "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6"
// //             : "space-y-5"
// //         }
// //       >
// //         {results.map((movie: any) => (
// //           <SearchResultCard
// //             key={movie.movie_id}
// //             movie={movie}
// //             viewMode={viewMode}
// //             isLiked={isLiked(movie.movie_id)}
// //             onToggleLike={toggleLike}
// //           />
// //         ))}
// //       </div>
// //     );
// //   };

// //   return (
// //     <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
// //       <div className="fixed inset-0 z-0">
// //         <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900/10 via-transparent to-transparent"></div>
// //         <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-violet-900/10 via-transparent to-transparent"></div>
// //         <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:64px_64px]"></div>
// //       </div>

// //       <nav className="sticky top-0 z-50 bg-slate-950/95 backdrop-blur-xl border-b border-slate-800/50">
// //         <div className="max-w-7xl mx-auto px-6 py-4">
// //           <div className="flex items-center justify-between gap-6">
// //             <div className="flex items-center gap-8">
// //               <div className="flex items-center gap-3">
// //                 <Film className="w-8 h-8 text-indigo-400" />
// //                 <span className="text-2xl font-bold bg-gradient-to-r from-slate-100 to-slate-400 bg-clip-text text-transparent hidden sm:block">
// //                   Recommendo
// //                 </span>
// //               </div>

// //               <div className="hidden md:flex items-center gap-1">
// //                 <button className="flex items-center gap-2 px-4 py-2 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 font-medium transition-all">
// //                   <Home className="w-4 h-4" />
// //                   Home
// //                 </button>
// //                 <button className="flex items-center gap-2 px-4 py-2 rounded-lg text-slate-200 bg-slate-800/50 font-medium transition-all">
// //                   <Search className="w-4 h-4" />
// //                   Search
// //                 </button>
// //                 <button className="flex items-center gap-2 px-4 py-2 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 font-medium transition-all">
// //                   <Heart className="w-4 h-4" />
// //                   My List
// //                 </button>
// //               </div>
// //             </div>

// //             <div className="flex items-center gap-3">
// //               <button className="p-2.5 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800/50 transition-all relative">
// //                 <Bell className="w-5 h-5" />
// //                 <div className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full"></div>
// //               </button>
// //               <button className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-semibold hover:scale-105 transition-transform">
// //                 <User className="w-5 h-5" />
// //               </button>
// //             </div>
// //           </div>
// //         </div>
// //       </nav>

// //       <main className="relative z-10">
// //         <div className="max-w-7xl mx-auto px-6 py-12">
// //           <form onSubmit={handleSearchSubmit} className="mb-8">
// //             <div className="relative max-w-3xl mx-auto">
// //               <input
// //                 type="text"
// //                 value={searchTerm}
// //                 onChange={(e) => setSearchTerm(e.target.value)}
// //                 placeholder="Search for movies, themes, cast, or plot points..."
// //                 className="w-full py-5 pl-14 pr-4 bg-slate-800/50 text-slate-100 text-lg rounded-2xl border-2 border-slate-700/50 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/20 transition-all placeholder-slate-500"
// //               />
// //               <Search className="absolute left-5 top-1/2 transform -translate-y-1/2 w-6 h-6 text-slate-500" />
// //             </div>
// //           </form>

// //           {hasSearched && results.length > 0 && (
// //             <div className="flex items-center justify-between mb-8">
// //               <div>
// //                 <h2 className="text-2xl font-bold text-slate-200">
// //                   Found{" "}
// //                   <span className="text-indigo-400">{results.length}</span>{" "}
// //                   results
// //                 </h2>
// //                 {searchTerm && (
// //                   <p className="text-slate-400 mt-1">for "{searchTerm}"</p>
// //                 )}
// //               </div>
// //               <div className="flex items-center gap-2">
// //                 <button
// //                   onClick={() => setViewMode("grid")}
// //                   className={`p-2.5 rounded-lg transition-colors ${
// //                     viewMode === "grid"
// //                       ? "bg-indigo-600 text-white"
// //                       : "bg-slate-800/50 text-slate-400 hover:text-slate-200"
// //                   }`}
// //                 >
// //                   <Grid3x3 className="w-5 h-5" />
// //                 </button>
// //                 <button
// //                   onClick={() => setViewMode("list")}
// //                   className={`p-2.5 rounded-lg transition-colors ${
// //                     viewMode === "list"
// //                       ? "bg-indigo-600 text-white"
// //                       : "bg-slate-800/50 text-slate-400 hover:text-slate-200"
// //                   }`}
// //                 >
// //                   <List className="w-5 h-5" />
// //                 </button>
// //               </div>
// //             </div>
// //           )}

// //           {renderContent()}
// //         </div>
// //       </main>

// //       <footer className="py-12 px-6 mt-12 border-t border-slate-800/50">
// //         <div className="max-w-7xl mx-auto text-center text-slate-500">
// //           <p>Recommendo © 2025 • Semantic Search Powered</p>
// //         </div>
// //       </footer>
// //     </div>
// //   );
// // }
// // // "use client";

// // // import { useState, useEffect, useCallback } from "react";
// // // import { useRouter, useSearchParams } from "next/navigation";
// // // import Image from "next/image";
// // // import {
// // //   Film,
// // //   Search,
// // //   Heart,
// // //   Star,
// // //   Play,
// // //   Check,
// // //   Plus,
// // //   ArrowLeft,
// // //   Loader2,
// // //   TrendingUp,
// // //   Link,
// // //   User,
// // // } from "lucide-react";

// // // //================================================================================
// // // // --- API & CONSTANTS (Re-used) ---
// // // //================================================================================

// // // const TMDB_API_KEY = "b36a8f5e4e7fd0a175b10384cc76a0ab";
// // // const TMDB_BASE_URL = "https://api.themoviedb.org/3/movie/";
// // // const POSTER_BASE_URL = "https://image.tmdb.org/t/p/w500/";
// // // const LIKED_MOVIES_STORAGE_KEY = "user_liked_movie";

// // // // NEW: Search API route
// // // const SEARCH_API_ROUTE = "/api/search";

// // // // Type definitions
// // // interface SearchMovie {
// // //   movie_id: string;
// // //   movie_name: string;
// // //   genre: string;
// // //   overview: string;
// // //   director: string;
// // //   cast: string;
// // //   year: string;
// // //   // Note: poster_path and vote_average are fetched dynamically
// // //   poster_path?: string;
// // //   vote_average?: number;
// // // }

// // // // --- Utility: getMovieImages (Must be defined locally) ---
// // // async function getMovieImages(movieId: string) {
// // //   if (!movieId) {
// // //     return { poster: "/placeholder.jpg" };
// // //   }
// // //   const fetchUrl = `${TMDB_BASE_URL}${movieId}/images?api_key=${TMDB_API_KEY}`;
// // //   try {
// // //     const response = await fetch(fetchUrl);
// // //     if (!response.ok) {
// // //       console.error(`TMDb API Error: ${response.status}`);
// // //     }
// // //     const data = await response.json();
// // //     const posterPath = data.posters?.[0]?.file_path || null;

// // //     return {
// // //       poster: posterPath
// // //         ? `${POSTER_BASE_URL}${posterPath}`
// // //         : "/placeholder.jpg",
// // //     };
// // //   } catch (error) {
// // //     console.error("Failed to fetch movie images:", error);
// // //     return { poster: "/placeholder.jpg" };
// // //   }
// // // }

// // // // --- LIKED MOVIES HOOK (Re-used) ---
// // // // This hook provides the like state and toggle functionality
// // // function useLikedMovies() {
// // //   const [likedMovies, setLikedMovies] = useState<any[]>([]);

// // //   useEffect(() => {
// // //     if (typeof window !== "undefined") {
// // //       try {
// // //         const stored = localStorage.getItem(LIKED_MOVIES_STORAGE_KEY);
// // //         setLikedMovies(stored ? JSON.parse(stored) : []);
// // //       } catch (e) {
// // //         console.error("Failed to load liked movies:", e);
// // //       }
// // //     }
// // //   }, []);

// // //   const toggleLike = useCallback((movie: SearchMovie) => {
// // //     setLikedMovies((prev) => {
// // //       const movieId = movie.movie_id;
// // //       const isLiked = prev.some((m: any) => m.movie_id === movieId);
// // //       let newLikedMovies;

// // //       if (isLiked) {
// // //         newLikedMovies = prev.filter((m: any) => m.movie_id !== movieId);
// // //       } else {
// // //         // Map to the minimal structure expected by the home feed API/storage
// // //         const formattedMovie = {
// // //           movie_id: movie.movie_id,
// // //           movie_name: movie.movie_name,
// // //           genre: movie.genre,
// // //           overview: movie.overview,
// // //           year: movie.year,
// // //           director: movie.director,
// // //           cast: movie.cast,
// // //           id: Date.now().toString(),
// // //         };
// // //         newLikedMovies = [...prev, formattedMovie];
// // //       }

// // //       if (typeof window !== "undefined") {
// // //         localStorage.setItem(
// // //           LIKED_MOVIES_STORAGE_KEY,
// // //           JSON.stringify(newLikedMovies)
// // //         );
// // //       }
// // //       return newLikedMovies;
// // //     });
// // //   }, []);

// // //   const isLiked = useCallback(
// // //     (movieId: string) => likedMovies.some((m: any) => m.movie_id === movieId),
// // //     [likedMovies]
// // //   );

// // //   return { isLiked, toggleLike };
// // // }

// // // //================================================================================
// // // // --- UI COMPONENTS ---
// // // //================================================================================

// // // interface SearchResultCardProps {
// // //   movie: SearchMovie;
// // //   router: any;
// // //   isLiked: boolean;
// // //   onToggleLike: (movie: SearchMovie) => void;
// // // }

// // // const SearchResultCard = ({
// // //   movie,
// // //   router,
// // //   isLiked,
// // //   onToggleLike,
// // // }: SearchResultCardProps) => {
// // //   const [posterUrl, setPosterUrl] = useState<string | null>(null);
// // //   const [loadingPoster, setLoadingPoster] = useState(true);

// // //   useEffect(() => {
// // //     setLoadingPoster(true);
// // //     getMovieImages(movie.movie_id)
// // //       .then((images) => {
// // //         setPosterUrl(images.poster);
// // //       })
// // //       .catch(() => {
// // //         setPosterUrl("/placeholder.jpg");
// // //       })
// // //       .finally(() => {
// // //         setLoadingPoster(false);
// // //       });
// // //   }, [movie.movie_id]);

// // //   const title = movie.movie_name || "Unknown Title";
// // //   const year = movie.year || "N/A";
// // //   const genre = movie.genre || "N/A";

// // //   const LikeIcon = isLiked ? (
// // //     <Check className="w-4 h-4 text-white" strokeWidth={2.5} />
// // //   ) : (
// // //     <Plus className="w-4 h-4 text-white" strokeWidth={2.5} />
// // //   );

// // //   const likeButtonClasses = isLiked
// // //     ? "bg-red-600 hover:bg-red-700"
// // //     : "bg-slate-700/80 hover:bg-slate-700";

// // //   if (loadingPoster) {
// // //     return (
// // //       <div className="flex bg-slate-800/50 rounded-xl p-4 gap-4 h-44 animate-pulse">
// // //         <div className="w-28 h-36 flex-shrink-0 bg-slate-700 rounded-lg"></div>
// // //         <div className="flex-1 space-y-3 pt-2">
// // //           <div className="h-5 w-3/4 bg-slate-700 rounded"></div>
// // //           <div className="h-3 w-1/2 bg-slate-700 rounded"></div>
// // //           <div className="h-3 w-full bg-slate-700 rounded"></div>
// // //         </div>
// // //       </div>
// // //     );
// // //   }

// // //   return (
// // //     <div className="bg-slate-900/50 backdrop-blur-sm rounded-xl overflow-hidden border border-slate-800 transition-shadow hover:shadow-2xl hover:shadow-indigo-900/30">
// // //       <div className="flex p-4 gap-4">
// // //         {/* Poster */}
// // //         <div
// // //           className="w-28 h-40 flex-shrink-0 relative rounded-lg overflow-hidden cursor-pointer"
// // //           onClick={() => router.push(`/movie/${movie.movie_id}`)}
// // //         >
// // //           <Image
// // //             src={posterUrl!}
// // //             alt={title}
// // //             fill
// // //             sizes="112px"
// // //             className="object-cover transition-transform group-hover:scale-105"
// // //           />
// // //         </div>

// // //         {/* Info */}
// // //         <div className="flex-1 min-w-0 space-y-1">
// // //           <h3
// // //             className="text-slate-100 text-xl font-bold truncate cursor-pointer hover:text-white transition-colors"
// // //             onClick={() => router.push(`/movie/${movie.movie_id}`)}
// // //           >
// // //             {title} ({year})
// // //           </h3>
// // //           <p className="text-sm text-indigo-300 mb-2">{genre}</p>
// // //           <p className="text-slate-400 text-sm line-clamp-3">
// // //             {movie.overview}
// // //           </p>

// // //           {/* Actions */}
// // //           <div className="flex gap-3 pt-2">
// // //             <button
// // //               onClick={() => router.push(`/movie/${movie.movie_id}`)}
// // //               className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg text-slate-900 font-medium text-sm hover:bg-slate-200 transition-colors"
// // //             >
// // //               <Play className="w-4 h-4" fill="currentColor" />
// // //               Details
// // //             </button>
// // //             <button
// // //               onClick={() => onToggleLike(movie)}
// // //               className={`flex items-center gap-2 px-4 py-2 rounded-lg text-white font-medium text-sm transition-colors ${likeButtonClasses}`}
// // //             >
// // //               {LikeIcon}
// // //               {isLiked ? "Remove" : "My List"}
// // //             </button>
// // //           </div>
// // //         </div>
// // //       </div>
// // //     </div>
// // //   );
// // // };

// // // //================================================================================
// // // // --- MAIN SEARCH PAGE COMPONENT ---
// // // //================================================================================

// // // export default function SearchPage() {
// // //   const router = useRouter();
// // //   const searchParams = useSearchParams();

// // //   const urlQuery = searchParams.get("q") || "";
// // //   const [searchTerm, setSearchTerm] = useState(urlQuery);
// // //   const [results, setResults] = useState<SearchMovie[]>([]);
// // //   const [loading, setLoading] = useState(false);
// // //   const [hasSearched, setHasSearched] = useState(!!urlQuery);

// // //   const { isLiked, toggleLike } = useLikedMovies();

// // //   // --- Fetch Search Results ---
// // //   const executeSearch = useCallback(
// // //     async (query: string) => {
// // //       if (!query.trim()) {
// // //         setResults([]);
// // //         return;
// // //       }

// // //       setLoading(true);
// // //       setHasSearched(true);

// // //       try {
// // //         const encodedQuery = encodeURIComponent(query);
// // //         const url = `${SEARCH_API_ROUTE}?q=${encodedQuery}`;

// // //         const response = await fetch(url);
// // //         if (!response.ok) throw new Error("Search API failed");

// // //         const data: SearchMovie[] = await response.json();
// // //         setResults(data);
// // //       } catch (error) {
// // //         console.error("Search fetch error:", error);
// // //         setResults([]);
// // //       } finally {
// // //         setLoading(false);
// // //         // Update URL without reloading the page (shallow routing is deprecated in Next.js 13+ app router)
// // //         router.push(`/search?q=${encodeURIComponent(query)}`);
// // //       }
// // //     },
// // //     [router]
// // //   );

// // //   // --- Initial Load from URL ---
// // //   useEffect(() => {
// // //     if (urlQuery) {
// // //       setSearchTerm(urlQuery);
// // //       executeSearch(urlQuery);
// // //     }
// // //     // eslint-disable-next-line react-hooks/exhaustive-deps
// // //   }, [urlQuery]); // Only run on initial mount or if URL query changes

// // //   // --- Search Input Handler ---
// // //   const handleSearchSubmit = (e: React.FormEvent) => {
// // //     e.preventDefault();
// // //     executeSearch(searchTerm);
// // //   };

// // //   // --- Render Content ---
// // //   const renderContent = () => {
// // //     if (loading) {
// // //       return (
// // //         <div className="text-center py-16">
// // //           <Loader2 className="w-8 h-8 text-indigo-400 mx-auto animate-spin" />
// // //           <p className="mt-4 text-slate-400">
// // //             Searching for semantic matches...
// // //           </p>
// // //         </div>
// // //       );
// // //     }
// // //     if (hasSearched && results.length === 0) {
// // //       return (
// // //         <div className="p-12 rounded-xl bg-slate-800/50 border border-slate-700/50 text-center space-y-4">
// // //           <Search
// // //             className="w-12 h-12 text-indigo-500 mx-auto"
// // //             strokeWidth={1.5}
// // //           />
// // //           <h2 className="text-2xl font-bold text-slate-100">
// // //             No Results Found
// // //           </h2>
// // //           <p className="text-slate-400">
// // //             Try a different query. Remember, you can search for concepts or
// // //             themes, not just movie titles!
// // //           </p>
// // //         </div>
// // //       );
// // //     }
// // //     if (!hasSearched) {
// // //       return (
// // //         <div className="p-12 rounded-xl bg-slate-800/50 border border-slate-700/50 text-center space-y-4">
// // //           <TrendingUp
// // //             className="w-12 h-12 text-indigo-500 mx-auto"
// // //             strokeWidth={1.5}
// // //           />
// // //           <h2 className="text-2xl font-bold text-slate-100">Semantic Search</h2>
// // //           <p className="text-slate-400 max-w-lg mx-auto">
// // //             Use the search bar above to find movies based on plot, mood, cast,
// // //             or genre. For example, "movies about college students" or "a tense
// // //             courtroom drama."
// // //           </p>
// // //         </div>
// // //       );
// // //     }

// // //     // Display Results
// // //     return (
// // //       <div className="grid grid-cols-1 gap-6">
// // //         {results.map((movie) => (
// // //           <SearchResultCard
// // //             key={movie.movie_id}
// // //             movie={movie}
// // //             router={router}
// // //             isLiked={isLiked(movie.movie_id)}
// // //             onToggleLike={toggleLike as (movie: SearchMovie) => void}
// // //           />
// // //         ))}
// // //       </div>
// // //     );
// // //   };

// // //   return (
// // //     <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-100">
// // //       {/* Background Visuals */}
// // //       <div className="fixed inset-0 z-0">
// // //         <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900/10 via-transparent to-transparent"></div>
// // //         <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-violet-900/10 via-transparent to-transparent"></div>
// // //       </div>

// // //       {/* --- Navigation & Search Bar --- */}
// // //       <nav className="sticky top-0 z-50 bg-slate-950/95 backdrop-blur-xl border-b border-slate-800/50">
// // //         <div className="max-w-7xl mx-auto px-6 py-4">
// // //           <div className="flex items-center justify-between gap-6">
// // //             <button
// // //               onClick={() => router.push("/")}
// // //               className="flex items-center gap-2 text-slate-300 hover:text-white transition-colors group flex-shrink-0"
// // //             >
// // //               <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
// // //               <Film className="w-6 h-6 text-indigo-400 hidden sm:block" />
// // //             </button>

// // //             {/* Search Input */}
// // //             <form
// // //               onSubmit={handleSearchSubmit}
// // //               className="relative flex-1 max-w-4xl"
// // //             >
// // //               <input
// // //                 type="text"
// // //                 value={searchTerm}
// // //                 onChange={(e) => setSearchTerm(e.target.value)}
// // //                 placeholder="Search movies, plot points, cast, or themes..."
// // //                 className="w-full py-3 pl-12 pr-4 bg-slate-800/70 text-slate-100 rounded-xl border border-slate-700/50 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all placeholder-slate-400"
// // //               />
// // //               <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-500" />
// // //             </form>

// // //             <button
// // //               onClick={() => router.push("/mylist")}
// // //               className="flex items-center gap-2 px-3 py-2 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 font-medium transition-all flex-shrink-0"
// // //             >
// // //               <Heart className="w-4 h-4" /> My List
// // //             </button>
// // //           </div>
// // //         </div>
// // //       </nav>

// // //       {/* --- Main Content --- */}
// // //       <main className="relative z-10 py-12 px-6">
// // //         <div className="max-w-7xl mx-auto">
// // //           {urlQuery && !loading && (
// // //             <h2 className="text-3xl font-bold text-slate-200 mb-8">
// // //               Results for:{" "}
// // //               <span className="text-indigo-400 italic">"{urlQuery}"</span>
// // //             </h2>
// // //           )}

// // //           {renderContent()}
// // //         </div>
// // //       </main>

// // //       {/* Footer */}
// // //       <footer className="py-12 px-6 mt-12 border-t border-slate-800/50">
// // //         <div className="max-w-7xl mx-auto text-center text-slate-500">
// // //           <p>Recommendo © 2025 • Semantic Search Powered</p>
// // //         </div>
// // //       </footer>
// // //     </div>
// // //   );
// // // }
