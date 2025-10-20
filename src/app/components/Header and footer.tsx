"use client"; // Added for client-side navigation

import { Film, Heart, Search, Sparkles, User } from "lucide-react";
import Link from "next/link"; // Import Link for navigation

export function NavigationBar({
  isScrolled,
}: {
  isScrolled: boolean;
  // Removed onMyListClick and onSearchClick props
}) {
  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled
          ? "bg-slate-950 backdrop-blur-2xl border-b border-slate-800/60 shadow-2xl shadow-indigo-900/10"
          : "bg-gradient-to-b from-slate-950/80 via-slate-950/40 to-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 py-3.5">
        <div className="flex items-center justify-between">
          {/* Logo Section - Wrapped with Link */}
          <Link
            href="/"
            className="flex items-center gap-3 group cursor-pointer"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-indigo-500/20 blur-xl rounded-full group-hover:bg-indigo-400/30 transition-all"></div>
              <Film
                className="w-9 h-9 text-indigo-400 relative group-hover:text-indigo-300 transition-colors"
                strokeWidth={2}
              />
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-bold bg-gradient-to-r from-slate-50 via-indigo-200 to-slate-300 bg-clip-text text-transparent tracking-tight">
                NovaView
              </span>
              <span className="text-[10px] text-slate-500 tracking-widest uppercase -mt-1">
                AI-Powered Discovery
              </span>
            </div>
          </Link>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            {/* My List Button - Wrapped with Link */}
            <Link
              href="/mylist"
              className="group flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800/60 font-medium transition-all duration-300 border border-transparent hover:border-slate-700/50"
            >
              <Heart
                className="w-4 h-4 group-hover:text-red-400 transition-colors"
                strokeWidth={2}
              />
              <span className="hidden sm:inline">My Liked</span>
            </Link>

            {/* Search Button - Wrapped with Link and condition removed */}
            <Link
              href="/search"
              className="p-2.5 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800/60 transition-all duration-300 border border-transparent hover:border-slate-700/50"
            >
              <Search className="w-5 h-5" strokeWidth={2} />
            </Link>

            <div className="w-px h-6 bg-slate-700/50 mx-1"></div>

            {/* User button (remains a button as no link specified) */}
            <button className="relative group w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 via-indigo-600 to-purple-600 flex items-center justify-center text-white font-semibold hover:shadow-lg hover:shadow-indigo-500/30 transition-all duration-300 hover:scale-105">
              <User className="w-5 h-5" strokeWidth={2} />
              <div className="absolute inset-0 rounded-xl bg-white/0 group-hover:bg-white/10 transition-colors"></div>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}

// Footer Component (Unchanged)
export function Footer() {
  return (
    <>
      <footer className="py-16 px-6 mt-20 border-t border-slate-800/50 bg-gradient-to-b from-transparent to-slate-950/50">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col items-center gap-6">
            <div className="flex items-center gap-3">
              <Film className="w-7 h-7 text-indigo-400/60" />
              <span className="text-xl font-bold text-slate-400">NovaView</span>
            </div>
            <p className="text-slate-500 text-sm">
              © 2025 NovaView • A Concept by Dhairya Darji
            </p>
          </div>
        </div>
      </footer>

      <div className="w-full text-center py-3 bg-gradient-to-r from-indigo-950/40 via-indigo-900/30 to-purple-950/40 text-indigo-300/80 text-xs border-t border-indigo-900/20 backdrop-blur-sm">
        <div className="flex items-center justify-center gap-2">
          <Sparkles className="w-3.5 h-3.5" />
          <span>
            NovaView is a concept project — built to showcase AI-powered
            personalization
          </span>
        </div>
      </div>
    </>
  );
}

// import { Film, Heart, Search, Sparkles, User } from "lucide-react";

// export function NavigationBar({
//   isScrolled,
//   onMyListClick,
//   onSearchClick, // This prop is now optional
// }: {
//   isScrolled: boolean;
//   onMyListClick: () => void;
//   onSearchClick?: () => void; // Made optional
// }) {
//   return (
//     <nav
//       className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
//         isScrolled
//           ? "bg-slate-950 backdrop-blur-2xl border-b border-slate-800/60 shadow-2xl shadow-indigo-900/10"
//           : "bg-gradient-to-b from-slate-950/80 via-slate-950/40 to-transparent"
//       }`}
//     >
//       <div className="max-w-7xl mx-auto px-6 py-3.5">
//         <div className="flex items-center justify-between">
//           {/* Logo Section */}
//           <div className="flex items-center gap-3 group cursor-pointer">
//             <div className="relative">
//               <div className="absolute inset-0 bg-indigo-500/20 blur-xl rounded-full group-hover:bg-indigo-400/30 transition-all"></div>
//               <Film
//                 className="w-9 h-9 text-indigo-400 relative group-hover:text-indigo-300 transition-colors"
//                 strokeWidth={2}
//               />
//             </div>
//             <div className="flex flex-col">
//               <span className="text-2xl font-bold bg-gradient-to-r from-slate-50 via-indigo-200 to-slate-300 bg-clip-text text-transparent tracking-tight">
//                 NovaView
//               </span>
//               <span className="text-[10px] text-slate-500 tracking-widest uppercase -mt-1">
//                 AI-Powered Discovery
//               </span>
//             </div>
//           </div>

//           {/* Action Buttons */}
//           <div className="flex items-center gap-2">
//             <button
//               onClick={onMyListClick}
//               className="group flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800/60 font-medium transition-all duration-300 border border-transparent hover:border-slate-700/50"
//             >
//               <Heart
//                 className="w-4 h-4 group-hover:text-red-400 transition-colors"
//                 strokeWidth={2}
//               />
//               <span className="hidden sm:inline">My Liked</span>
//             </button>

//             {/* --- Conditionally render search button --- */}
//             {onSearchClick && (
//               <button
//                 onClick={onSearchClick}
//                 className="p-2.5 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800/60 transition-all duration-300 border border-transparent hover:border-slate-700/50"
//               >
//                 <Search className="w-5 h-5" strokeWidth={2} />
//               </button>
//             )}

//             <div className="w-px h-6 bg-slate-700/50 mx-1"></div>

//             <button className="relative group w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 via-indigo-600 to-purple-600 flex items-center justify-center text-white font-semibold hover:shadow-lg hover:shadow-indigo-500/30 transition-all duration-300 hover:scale-105">
//               <User className="w-5 h-5" strokeWidth={2} />
//               <div className="absolute inset-0 rounded-xl bg-white/0 group-hover:bg-white/10 transition-colors"></div>
//             </button>
//           </div>
//         </div>
//       </div>
//     </nav>
//   );
// }

// // Footer Component
// export function Footer() {
//   return (
//     <>
//       <footer className="py-16 px-6 mt-20 border-t border-slate-800/50 bg-gradient-to-b from-transparent to-slate-950/50">
//         <div className="max-w-7xl mx-auto">
//           <div className="flex flex-col items-center gap-6">
//             <div className="flex items-center gap-3">
//               <Film className="w-7 h-7 text-indigo-400/60" />
//               <span className="text-xl font-bold text-slate-400">NovaView</span>
//             </div>
//             <p className="text-slate-500 text-sm">
//               © 2025 NovaView • A Concept by Dhairya Darji
//             </p>
//           </div>
//         </div>
//       </footer>

//       <div className="w-full text-center py-3 bg-gradient-to-r from-indigo-950/40 via-indigo-900/30 to-purple-950/40 text-indigo-300/80 text-xs border-t border-indigo-900/20 backdrop-blur-sm">
//         <div className="flex items-center justify-center gap-2">
//           <Sparkles className="w-3.5 h-3.5" />
//           <span>
//             NovaView is a concept project — built to showcase AI-powered
//             personalization
//           </span>
//         </div>
//       </div>
//     </>
//   );
// }

// // import { Film, Heart, Search, Sparkles, User } from "lucide-react";

// // export function NavigationBar({
// //   isScrolled,
// //   onMyListClick,
// //   onSearchClick,
// // }: {
// //   isScrolled: boolean;
// //   onMyListClick: () => void;
// //   onSearchClick: () => void;
// // }) {
// //   return (
// //     <nav
// //       className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
// //         isScrolled
// //           ? "bg-slate-950 backdrop-blur-2xl border-b border-slate-800/60 shadow-2xl shadow-indigo-900/10"
// //           : "bg-gradient-to-b from-slate-950/80 via-slate-950/40 to-transparent"
// //       }`}
// //     >
// //       <div className="max-w-7xl mx-auto px-6 py-3.5">
// //         <div className="flex items-center justify-between">
// //           {/* Logo Section */}
// //           <div className="flex items-center gap-3 group cursor-pointer">
// //             <div className="relative">
// //               <div className="absolute inset-0 bg-indigo-500/20 blur-xl rounded-full group-hover:bg-indigo-400/30 transition-all"></div>
// //               <Film
// //                 className="w-9 h-9 text-indigo-400 relative group-hover:text-indigo-300 transition-colors"
// //                 strokeWidth={2}
// //               />
// //             </div>
// //             <div className="flex flex-col">
// //               <span className="text-2xl font-bold bg-gradient-to-r from-slate-50 via-indigo-200 to-slate-300 bg-clip-text text-transparent tracking-tight">
// //                 NovaView
// //               </span>
// //               <span className="text-[10px] text-slate-500 tracking-widest uppercase -mt-1">
// //                 AI-Powered Discovery
// //               </span>
// //             </div>
// //           </div>

// //           {/* Action Buttons */}
// //           <div className="flex items-center gap-2">
// //             <button
// //               onClick={onMyListClick}
// //               className="group flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800/60 font-medium transition-all duration-300 border border-transparent hover:border-slate-700/50"
// //             >
// //               <Heart
// //                 className="w-4 h-4 group-hover:text-red-400 transition-colors"
// //                 strokeWidth={2}
// //               />
// //               <span className="hidden sm:inline">My Liked</span>
// //             </button>

// //             <button
// //               onClick={onSearchClick}
// //               className="p-2.5 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800/60 transition-all duration-300 border border-transparent hover:border-slate-700/50"
// //             >
// //               <Search className="w-5 h-5" strokeWidth={2} />
// //             </button>

// //             <div className="w-px h-6 bg-slate-700/50 mx-1"></div>

// //             <button className="relative group w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 via-indigo-600 to-purple-600 flex items-center justify-center text-white font-semibold hover:shadow-lg hover:shadow-indigo-500/30 transition-all duration-300 hover:scale-105">
// //               <User className="w-5 h-5" strokeWidth={2} />
// //               <div className="absolute inset-0 rounded-xl bg-white/0 group-hover:bg-white/10 transition-colors"></div>
// //             </button>
// //           </div>
// //         </div>
// //       </div>
// //     </nav>
// //   );
// // }

// // // Footer Component
// // export function Footer() {
// //   return (
// //     <>
// //       <footer className="py-16 px-6 mt-20 border-t border-slate-800/50 bg-gradient-to-b from-transparent to-slate-950/50">
// //         <div className="max-w-7xl mx-auto">
// //           <div className="flex flex-col items-center gap-6">
// //             <div className="flex items-center gap-3">
// //               <Film className="w-7 h-7 text-indigo-400/60" />
// //               <span className="text-xl font-bold text-slate-400">NovaView</span>
// //             </div>
// //             <p className="text-slate-500 text-sm">
// //               © 2025 NovaView • A Concept by Dhairya Darji
// //             </p>
// //           </div>
// //         </div>
// //       </footer>

// //       <div className="w-full text-center py-3 bg-gradient-to-r from-indigo-950/40 via-indigo-900/30 to-purple-950/40 text-indigo-300/80 text-xs border-t border-indigo-900/20 backdrop-blur-sm">
// //         <div className="flex items-center justify-center gap-2">
// //           <Sparkles className="w-3.5 h-3.5" />
// //           <span>
// //             NovaView is a concept project — built to showcase AI-powered
// //             personalization
// //           </span>
// //         </div>
// //       </div>
// //     </>
// //   );
// // }
