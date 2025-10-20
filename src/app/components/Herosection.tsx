"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Play, Info } from "lucide-react";

const movies = [
  {
    id: 1,
    title: "The Batman",
    overview:
      "In his second year of fighting crime, Batman uncovers corruption in Gotham City that connects to his own family.",
    backdrop:
      "https://image.tmdb.org/t/p/original/b0PlSFdDwbyK0cf5RxwDpaOJQvQ.jpg",
  },
  {
    id: 2,
    title: "Interstellar",
    overview:
      "A team of explorers travel through a wormhole in space in an attempt to ensure humanity’s survival.",
    backdrop:
      "https://image.tmdb.org/t/p/original/rAiYTfKGqDCRIIqo664sY9XZIvQ.jpg",
  },
  {
    id: 3,
    title: "Inception",
    overview:
      "A thief who steals corporate secrets through dream-sharing technology is given the inverse task of planting an idea.",
    backdrop:
      "https://image.tmdb.org/t/p/original/s3TBrRGB1iav7gFOCNx3H31MoES.jpg",
  },
];

export default function Hero() {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Auto-slide effect every 7s
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % movies.length);
    }, 7000);
    return () => clearInterval(interval);
  }, []);

  const movie = movies[currentSlide];

  return (
    <section className="relative w-full h-[90vh] overflow-hidden rounded-3xl">
      {/* Background image */}
      <div className="absolute inset-0 z-0">
        <Image
          src={movie.backdrop}
          alt={movie.title}
          fill
          priority
          className="object-cover"
        />
      </div>

      {/* Gradient overlays */}
      <div className="absolute inset-0 bg-gradient-to-r from-black via-transparent to-transparent opacity-80 z-10"></div>
      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60 z-10"></div>

      {/* Content */}
      <div className="relative z-30 flex flex-col justify-center h-full px-8 md:px-16 max-w-3xl text-white">
        <h1 className="text-5xl md:text-6xl font-bold mb-4">{movie.title}</h1>
        <p className="text-base md:text-lg text-gray-300 mb-8 line-clamp-3">
          {movie.overview}
        </p>

        <div className="flex gap-3">
          <button className="bg-white text-black hover:bg-gray-200">
            <Play className="w-4 h-4 mr-2" /> Play
          </button>
          <button className="border-gray-400 text-white hover:bg-gray-700">
            <Info className="w-4 h-4 mr-2" /> See Details
          </button>
        </div>
      </div>

      {/* Carousel buttons */}
      <div className="absolute bottom-8 right-8 flex gap-2 z-[999]">
        {movies.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`h-1 rounded-full transition-all duration-300 cursor-pointer hover:scale-110 ${
              index === currentSlide
                ? "w-8 bg-indigo-400"
                : "w-6 bg-slate-600 hover:bg-slate-500"
            }`}
          />
        ))}
      </div>
    </section>
  );
}
