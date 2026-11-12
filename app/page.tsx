
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Search, Mic, Camera } from "lucide-react";
import { usePosts, type Post } from "@/context/postcontext";
import Card from "@/components/card";

export default function Home() {
  const { newPosts, postsReady } = usePosts();

  const [posts, setPosts] = useState<Post[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch blog posts from API
  useEffect(() => {
    async function fetchPosts() {
      try {
        const response = await fetch(
          "https://jsonplaceholder.typicode.com/posts"
        );

        if (!response.ok) {
          throw new Error("Failed to fetch posts");
        }

        const data: Post[] = await response.json();
        setPosts(data);
      } catch {
        setError("Unable to load posts. Please try again.");
      } finally {
        setLoading(false);
      }
    }

    fetchPosts();
  }, []);

  // Show newly created posts first
  const allPosts = [...newPosts, ...posts];

  // Normalize search text
  const normalizeText = (text: string) =>
    text.trim().replace(/\s+/g, " ").toLowerCase();

  // Search posts by title
  const filteredPosts = allPosts.filter((post) =>
    normalizeText(post.title).includes(normalizeText(search))
  );

  // Wait until saved posts are loaded
  if (!postsReady) {
    return (
      <main className="min-h-screen bg-gray-100 p-6">
        <p className="text-gray-700">
          Loading saved posts...
        </p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-100 p-6">
      <div className="mx-auto max-w-4xl">

        {/* Header */}
        <div className="mb-6 flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-3xl font-bold text-gray-900">
            My Blog
          </h1>

          <Link
            href="/create"
            className="w-full rounded-lg bg-blue-600 px-5 py-3 text-center text-white hover:bg-blue-700 sm:w-auto"
          >
            + Create New Post
          </Link>
        </div>

        {/* Google Style Search Bar */}
        <div className="mb-6 flex items-center gap-3 rounded-full border border-gray-300 bg-white px-4 py-3 shadow-sm transition focus-within:border-blue-500 focus-within:shadow-md">

          {/* Left Search Icon */}
          <Search
            size={20}
            className="shrink-0 text-gray-500"
            aria-hidden="true"
          />

          {/* Search Input */}
          <input
            type="text"
            placeholder="Search blog posts..."
            aria-label="Search blog posts"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="min-w-0 flex-1 bg-transparent text-gray-900 outline-none placeholder:text-gray-400"
          />

          {/* Right Side Icons */}
          <div className="flex shrink-0 items-center gap-3">
            <Mic
              size={20}
              className="text-blue-600"
              aria-hidden="true"
            />

            <Camera
              size={20}
              className="text-blue-600"
              aria-hidden="true"
            />
          </div>
        </div>

        {/* Loading Message */}
        {loading && (
          <p className="text-gray-700">
            Loading posts...
          </p>
        )}

        {/* Error Message */}
        {error && (
          <p className="mb-4 text-red-600">
            {error}
          </p>
        )}

        {/* No Search Results */}
        {!loading && !error && filteredPosts.length === 0 && (
          <p className="text-center text-gray-600">
            No posts found for &quot;{search}&quot;
          </p>
        )}

        {/* Blog Posts */}
        <div className="space-y-4">
          {filteredPosts.map((post) => {
            const words = post.body.trim().split(/\s+/);
            const description = words.slice(0, 30).join(" ");

            return (
              <Card key={post.id}>
                <h2 className="mb-2 text-xl font-semibold text-gray-900">
                  {post.title}
                </h2>

                <p className="text-gray-600">
                  {description}
                  {words.length > 30 ? "..." : ""}
                </p>

                <Link
                  href={`/post/${post.id}`}
                  className="mt-4 inline-block rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
                >
                  Read More
                </Link>
              </Card>
            );
          })}
        </div>

      </div>
    </main>
  );
}
