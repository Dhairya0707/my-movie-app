import {
  Flame,
  Mic2,
  Eye,
  Drama,
  Rocket,
  Skull,
  Heart,
  Clapperboard,
  Ghost,
  Sparkles,
  Mountain,
  Swords,
} from "lucide-react";
import { movies } from "./movies";

// --- STATIC DATA (Unchanged) ---
export const heroMovies: any = [
  movies[0],
  movies[1],
  movies[2],
  movies[3],
  movies[4],
  movies[5],
];

export const genres = [
  { name: "Action", icon: Flame, color: "from-red-500/20 to-orange-600/20" },
  { name: "Comedy", icon: Mic2, color: "from-yellow-500/20 to-amber-600/20" },
  { name: "Crime", icon: Eye, color: "from-emerald-500/20 to-green-600/20" },
  { name: "Drama", icon: Drama, color: "from-violet-500/20 to-purple-600/20" },
  { name: "Sci-Fi", icon: Rocket, color: "from-cyan-500/20 to-blue-600/20" },
  { name: "Horror", icon: Skull, color: "from-rose-500/20 to-red-800/20" },
  { name: "Romance", icon: Heart, color: "from-pink-500/20 to-rose-600/20" },
  {
    name: "Animation",
    icon: Clapperboard,
    color: "from-green-500/20 to-emerald-600/20",
  },
  {
    name: "Thriller",
    icon: Ghost,
    color: "from-indigo-500/20 to-purple-600/20",
  },
  {
    name: "Fantasy",
    icon: Sparkles,
    color: "from-purple-500/20 to-fuchsia-600/20",
  },
  {
    name: "Adventure",
    icon: Mountain,
    color: "from-teal-500/20 to-cyan-600/20",
  },
  { name: "War", icon: Swords, color: "from-amber-500/20 to-orange-600/20" },
];
