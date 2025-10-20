// src/app/page.tsx
"use client";

import { useState, FC } from "react";
import { useRouter } from "next/navigation";
import {
  Film,
  Sparkles,
  Star,
  Flame,
  Mic2,
  Eye,
  Drama,
  Rocket,
  Skull,
  Heart,
  Clapperboard,
  Ghost,
  Mountain,
  Swords,
} from "lucide-react";

interface Genre {
  name: string;
  icon: any;
  colorKey: ColorKey;
}

type ColorKey =
  | "red"
  | "yellow"
  | "emerald"
  | "violet"
  | "cyan"
  | "rose"
  | "pink"
  | "orange"
  | "indigo"
  | "purple"
  | "teal"
  | "amber";

const genres: Genre[] = [
  { name: "Action", icon: Flame, colorKey: "red" },
  { name: "Adventure", icon: Mountain, colorKey: "teal" },
  { name: "Animation", icon: Clapperboard, colorKey: "orange" },
  { name: "Comedy", icon: Mic2, colorKey: "yellow" },
  { name: "Crime", icon: Eye, colorKey: "emerald" },
  { name: "Drama", icon: Drama, colorKey: "violet" },
  { name: "Fantasy", icon: Sparkles, colorKey: "purple" },
  { name: "Horror", icon: Skull, colorKey: "rose" },
  { name: "Romance", icon: Heart, colorKey: "pink" },
  { name: "Sci-Fi", icon: Rocket, colorKey: "cyan" },
  { name: "Thriller", icon: Ghost, colorKey: "indigo" },
  { name: "Family", icon: Star, colorKey: "amber" },
  { name: "Mystery", icon: Clapperboard, colorKey: "purple" },
  { name: "Music", icon: Mic2, colorKey: "pink" },
  { name: "War", icon: Swords, colorKey: "red" },
];

const colorMap: Record<
  ColorKey,
  { bg: string; border: string; icon: string; dot: string; hoverGlow?: string }
> = {
  red: {
    bg: "bg-red-500/15",
    border: "border-red-400/40",
    icon: "text-red-300",
    dot: "bg-red-400",
    hoverGlow: "ring-red-400/30",
  },
  yellow: {
    bg: "bg-yellow-400/12",
    border: "border-yellow-300/30",
    icon: "text-yellow-300",
    dot: "bg-yellow-300",
    hoverGlow: "ring-yellow-300/25",
  },
  emerald: {
    bg: "bg-emerald-500/12",
    border: "border-emerald-400/30",
    icon: "text-emerald-300",
    dot: "bg-emerald-400",
    hoverGlow: "ring-emerald-400/25",
  },
  violet: {
    bg: "bg-violet-500/12",
    border: "border-violet-400/30",
    icon: "text-violet-300",
    dot: "bg-violet-400",
    hoverGlow: "ring-violet-400/25",
  },
  cyan: {
    bg: "bg-cyan-500/12",
    border: "border-cyan-400/30",
    icon: "text-cyan-300",
    dot: "bg-cyan-400",
    hoverGlow: "ring-cyan-400/25",
  },
  rose: {
    bg: "bg-rose-500/12",
    border: "border-rose-400/30",
    icon: "text-rose-300",
    dot: "bg-rose-400",
    hoverGlow: "ring-rose-400/25",
  },
  pink: {
    bg: "bg-pink-500/12",
    border: "border-pink-400/30",
    icon: "text-pink-300",
    dot: "bg-pink-400",
    hoverGlow: "ring-pink-400/25",
  },
  orange: {
    bg: "bg-orange-500/12",
    border: "border-orange-400/30",
    icon: "text-orange-300",
    dot: "bg-orange-400",
    hoverGlow: "ring-orange-400/25",
  },
  indigo: {
    bg: "bg-indigo-500/12",
    border: "border-indigo-400/30",
    icon: "text-indigo-300",
    dot: "bg-indigo-400",
    hoverGlow: "ring-indigo-400/25",
  },
  purple: {
    bg: "bg-purple-500/12",
    border: "border-purple-400/30",
    icon: "text-purple-300",
    dot: "bg-purple-400",
    hoverGlow: "ring-purple-400/25",
  },
  teal: {
    bg: "bg-teal-500/12",
    border: "border-teal-400/30",
    icon: "text-teal-300",
    dot: "bg-teal-400",
    hoverGlow: "ring-teal-400/25",
  },
  amber: {
    bg: "bg-amber-500/12",
    border: "border-amber-400/30",
    icon: "text-amber-300",
    dot: "bg-amber-400",
    hoverGlow: "ring-amber-400/25",
  },
};

const MIN_SELECTIONS = 3;

interface FeatureHighlightProps {
  IconComponent: any;
  title: string;
  description: string;
  color: "indigo" | "violet" | "purple";
}

const FeatureHighlight: FC<FeatureHighlightProps> = ({
  IconComponent,
  title,
  description,
  color,
}) => {
  const colorClasses = {
    indigo: {
      bg: "bg-indigo-500/10 group-hover:bg-indigo-500/15",
      border: "border-indigo-500/20",
      text: "text-indigo-400",
    },
    violet: {
      bg: "bg-violet-500/10 group-hover:bg-violet-500/15",
      border: "border-violet-500/20",
      text: "text-violet-400",
    },
    purple: {
      bg: "bg-purple-500/10 group-hover:bg-purple-500/15",
      border: "border-purple-500/20",
      text: "text-purple-400",
    },
  };
  const classes = colorClasses[color];

  return (
    <div className="flex items-start gap-x-4 group">
      <div
        className={`mt-1  p-2 rounded-lg border transition-colors ${classes.bg} ${classes.border}`}
      >
        <IconComponent className={`w-6 h-6 ${classes.text}`} />
      </div>
      <div>
        <h3 className="text-slate-200 font-medium">{title}</h3>
        <p className="text-slate-400 text-sm leading-relaxed">{description}</p>
      </div>
    </div>
  );
};

export default function OnboardingPage() {
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const router = useRouter();

  const handleGenreSelect = (genreName: string) => {
    setSelectedGenres((prev) =>
      prev.includes(genreName)
        ? prev.filter((g) => g !== genreName)
        : [...prev, genreName]
    );
  };

  const handleContinue = () => {
    if (selectedGenres.length >= MIN_SELECTIONS) {
      // Store preferred genres in localStorage
      localStorage.setItem(
        "user_preferred_genres",
        JSON.stringify(selectedGenres)
      );
      // Redirect to the main dashboard
      router.push("/");
    }
  };

  const isContinueDisabled = selectedGenres.length < MIN_SELECTIONS;

  return (
    <main className="relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Background visuals */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-indigo-900/15 via-transparent to-transparent"></div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-violet-900/10 via-transparent to-transparent"></div>
        <div className="absolute top-[25%] left-[25%] w-[40vw] h-[40vw] max-w-[500px] max-h-[500px] bg-indigo-600/10 rounded-full blur-3xl animate-pulse"></div>
        <div
          className="absolute bottom-[25%] right-[25%] w-[40vw] h-[40vw] max-w-[500px] max-h-[500px] bg-violet-600/10 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}
        ></div>
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px]"></div>
      </div>

      {/* Foreground content */}
      <div className="relative z-10 flex w-full max-w-7xl flex-col justify-center px-6 py-16 lg:flex-row lg:items-center lg:gap-12">
        <div className="lg:w-5/12 space-y-8">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20">
              <Film className="w-4 h-4 text-indigo-400" />
              <span className="text-indigo-300 text-sm font-medium tracking-wider uppercase">
                Personalization Setup
              </span>
            </div>
            <div>
              {/* <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold bg-gradient-to-br from-slate-50 via-slate-200 to-slate-400 bg-clip-text text-transparent leading-tight mb-4">
                Discover Movies, Redefined by AI
              </h1>
              <p className="text-slate-400 text-lg font-light leading-relaxed">
                Select what you love — Action, Drama, or Sci-Fi — and let our AI
                engine craft a personalized cinematic world just for you.
              </p> */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold bg-gradient-to-br from-slate-50 via-slate-200 to-slate-400 bg-clip-text text-transparent leading-tight mb-4">
                Welcome to NovaView
              </h1>
              <p className="text-slate-400 text-lg font-light leading-relaxed">
                A concept project that reimagines movie discovery — powered by
                AI, designed for creativity. Select the genres you love, and
                NovaView will craft a cinematic experience tailored just for
                you.
              </p>
            </div>
          </div>

          <div className="space-y-4 pt-4">
            <FeatureHighlight
              IconComponent={Sparkles}
              title="AI-Personalized Feed"
              description="Your home feed evolves with your taste — powered by semantic understanding."
              color="indigo"
            />

            <FeatureHighlight
              IconComponent={Star}
              title="Semantic Movie Search"
              description="Search movies naturally, like ‘funny space adventure from 2022’."
              color="violet"
            />

            <FeatureHighlight
              IconComponent={Film}
              title="Intelligent Recommendations"
              description="AI analyzes your likes to surface hidden cinematic gems."
              color="purple"
            />
          </div>
        </div>

        {/* Genre Selection */}
        <div className="lg:w-7/12 mt-12 lg:mt-0">
          <div className="space-y-6">
            <div className="space-y-2">
              <h2 className="text-2xl font-semibold text-slate-200">
                Choose Your Cinematic Vibe
              </h2>
              <p className="text-slate-400 text-sm">
                Pick at least {MIN_SELECTIONS} genres — our AI will use these to
                craft your first personalized feed.
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {genres.map((genre) => {
                const isSelected = selectedGenres.includes(genre.name);
                const cls = colorMap[genre.colorKey];

                // --- MODIFIED CLASS LIST ---
                const buttonClasses = [
                  "group relative overflow-hidden rounded-xl px-5 py-4 transition-all duration-300 ease-out flex items-center gap-4 text-left border-2",
                  isSelected
                    ? `${cls.bg} ${cls.border} shadow-inner ring-1 ${
                        cls.hoverGlow ?? ""
                      }` // Selected state (unchanged)
                    : `bg-slate-800/30 border-slate-700/40 hover:border-slate-600/60 hover:${cls.bg}`, // Unselected state: ADDED HOVER BACKGROUND COLOR
                ].join(" ");

                return (
                  <button
                    key={genre.name}
                    onClick={() => handleGenreSelect(genre.name)}
                    className={buttonClasses}
                  >
                    <div
                      className={`transition-colors duration-200 ${
                        isSelected
                          ? cls.icon
                          : "text-slate-400 group-hover:text-slate-300"
                      }`}
                    >
                      <genre.icon className="w-6 h-6" strokeWidth={2} />
                    </div>
                    <span
                      className={`text-sm sm:text-base font-medium transition-colors duration-200 ${
                        isSelected
                          ? "text-slate-100"
                          : "text-slate-300 group-hover:text-slate-200"
                      }`}
                    >
                      {genre.name}
                    </span>
                    {isSelected && (
                      <div
                        className={`ml-auto w-2 h-2 rounded-full ${cls.dot} flex-shrink-0`}
                      ></div>
                    )}
                  </button>
                );
              })}
            </div>

            <div className="pt-4">
              <button
                onClick={handleContinue}
                disabled={isContinueDisabled}
                className={`w-full relative px-8 py-4 rounded-xl font-semibold text-base tracking-wide transition-all duration-300 
                  ${
                    isContinueDisabled
                      ? "bg-slate-800/50 text-slate-500 cursor-not-allowed border-2 border-slate-700/30"
                      : "bg-gradient-to-r from-indigo-600 to-indigo-500 text-white border-2 border-indigo-500/50 hover:from-indigo-500 hover:to-indigo-400 active:scale-[0.99]"
                  }`}
              >
                {isContinueDisabled ? (
                  <span>
                    Select {MIN_SELECTIONS - selectedGenres.length} more to
                    continue
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    Launch My Feed
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2.5}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M13 7l5 5m0 0l-5 5m5-5H6"
                      />
                    </svg>
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
      <p className="text-center text-xs text-slate-500 mt-0">
        NovaView · A concept project by Dhairya Darji
      </p>
      <div className="mt-10 text-center text-xs text-slate-500">
        <p>
          ⚡ A concept project built to showcase AI-powered search &
          personalization
        </p>
        <p className="text-slate-600 mt-2 mb-5">
          Powered by Gemini AI × Pinecone × Next.js
        </p>
      </div>
    </main>
  );
}
