// src/app/layout.tsx

import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google"; // Import Poppins
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

// Configure Poppins for headings
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "600", "700"], // Include weights you might need
  variable: "--font-poppins",
});

export const metadata = {
  title: "NovaView | AI Movie Discovery",
  description: "A concept movie discovery experience powered by semantic AI.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      {/* Use the new font variable */}
      <body
        className={`${inter.variable} ${poppins.variable} bg-[#121212] text-[#F5F5F5]`}
      >
        {children}
      </body>
    </html>
  );
}
