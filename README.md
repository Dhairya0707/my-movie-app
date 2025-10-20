# 🎥 NovaView App

**NovaView** is an AI-powered movie recommendation platform built with **Next.js**, **Tailwind CSS**, and **Google’s Gemini model** for intelligent embeddings — all backed by **Pinecone** as a vector database for blazing-fast semantic search.

Get personalized movie suggestions, explore related titles, and search movies using natural language — all powered by AI. 🤖🍿

---

## 🚀 Features

✨ **Personalized Recommendations** — Get movie recommendations tailored to your liked movies and favorite genres.  
🔍 **Semantic Search** — Search for movies in natural language and let AI understand what you mean.  
🎬 **Related Movies** — Discover similar movies based on semantic similarity.  
🎯 **Onboarding Experience** — Pick your favorite genres to instantly get personalized recommendations.  
📖 **Detailed Movie Pages** — View movie details, including overview, cast, director, and release year.  
❤️ **Liked List** — Save your favorite movies, which also helps improve your recommendation feed.

---

## 🧠 AI Features in Detail

The heart of **NovaView** is its AI-driven recommendation engine. Here’s how it works:

### 1. 🎛️ Recommendation Feed (`/api/feed`)

Generates two sets of personalized recommendations:

- **Curated Picks for You:** Based on your favorite genres, combining semantically similar and randomly selected movies.
- **Smart Similarity — AI Suggestions:** Based on your liked movies. For each liked movie, the app finds the top 10 most semantically similar movies and returns a curated selection.

### 2. 🔗 Related Movies (`/api/releted`)

Finds movies related to a given title by:

- Generating an embedding for the input movie.
- Querying Pinecone to find the **top 15 most similar** movies.

### 3. 🧭 Semantic Search (`/api/search`)

Empowers users to search with natural language by:

- Generating an embedding for the user’s query.
- Retrieving the **top 20 most relevant** movies from Pinecone.

---

## 🧰 Tech Stack

### 🖥️ Frontend

- **Next.js** — React framework for full-stack web apps.
- **React** — UI library for interactive interfaces.
- **Tailwind CSS** — Utility-first CSS for rapid styling.

### ⚙️ Backend

- **Next.js API Routes** — For backend endpoints.

### 🧩 AI & Database

- **@google/genai** — Google AI SDK for embeddings using the Gemini model.
- **@pinecone-database/pinecone** — Vector database for semantic search and similarity queries.

---

## 🛠️ Getting Started

Follow these steps to run the project locally.

### 📋 Prerequisites

Ensure you have:

- **Node.js** and **npm** installed
- A **Pinecone** account and index
- A **Google AI API key**

---

### ⚙️ Installation

1️⃣ **Clone the repository**

```bash
git clone https://github.com/your_username_/my-movie-app.git
```

2️⃣ **Install dependencies**

```bash
npm install
```

3️⃣ **Set up environment variables**  
Create a `.env.local` file in the root directory and add:

```env
PINECONE_API_KEY="YOUR_PINECONE_API_KEY"
PINECONE_ENVIRONMENT="YOUR_PINECONE_ENVIRONMENT"
PINECONE_INDEX_NAME="YOUR_PINECONE_INDEX_NAME"
GOOGLE_API_KEY="YOUR_GOOGLE_API_KEY"
```

4️⃣ **Run the app**

```bash
npm run dev
```

Your app will start at 👉 [http://localhost:3000](http://localhost:3000)

---

## 📁 Project Structure

```
my-movie-app/
├── public/
│   ├── ...
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── feed/
│   │   │   │   └── route.tsx       # Recommendation feed API
│   │   │   ├── releted/
│   │   │   │   └── route.tsx       # Related movies API
│   │   │   └── search/
│   │   │       └── route.tsx       # Semantic search API
│   │   ├── components/             # React components
│   │   ├── db/                     # Database related files
│   │   ├── movie/                  # Movie details page
│   │   ├── mylist/                 # User's liked list page
│   │   ├── onboarding/             # Onboarding page
│   │   ├── search/                 # Search page
│   │   ├── layout.tsx
│   │   └── page.tsx                # Main page
├── .env.local
├── next.config.ts
├── package.json
└── ...
```

---

## 🤝 Contributing

Contributions make the open-source community an amazing place to learn and create. 💡  
Any contributions you make are **greatly appreciated**!

1. **Fork the Project**
2. **Create your Feature Branch**
   ```bash
   git checkout -b feature/AmazingFeature
   ```
3. **Commit your Changes**
   ```bash
   git commit -m 'Add some AmazingFeature'
   ```
4. **Push to the Branch**
   ```bash
   git push origin feature/AmazingFeature
   ```
5. **Open a Pull Request**

---

## 📄 License

Distributed under the **MIT License**.  
See [`LICENSE`](./LICENSE) for more information.

---

## 🌟 Acknowledgements

- [Next.js](https://nextjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Google AI (Gemini)](https://ai.google.dev/)
- [Pinecone](https://www.pinecone.io/)
