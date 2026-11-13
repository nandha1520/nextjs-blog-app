
"use client";

import { Suspense, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { usePosts, type Post } from "@/context/postcontext";

function PostDetails() {
  const params = useParams();
  const id = String(params.id);

  const { newPosts, postsReady } = usePosts();

  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function fetchPost() {
      if (!postsReady) return;

      setLoading(true);
      setError("");
      setPost(null);

      // Check locally created posts
      const localPost = newPosts.find(
        (item) => String(item.id) === id
      );

      if (localPost) {
        if (!cancelled) {
          setPost(localPost);
          setLoading(false);
        }
        return;
      }

      // Reject invalid IDs
      if (!/^[1-9]\d*$/.test(id)) {
        if (!cancelled) {
          setLoading(false);
        }
        return;
      }

      try {
        const response = await fetch(
          `https://jsonplaceholder.typicode.com/posts/${id}`
        );

        if (response.status === 404) {
          return;
        }

        if (!response.ok) {
          throw new Error("Failed to fetch post");
        }

        const data: Post = await response.json();

        if (!cancelled) {
          setPost(data);
        }
      } catch {
        if (!cancelled) {
          setError("Unable to load post. Please try again.");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    fetchPost();

    return () => {
      cancelled = true;
    };
  }, [id, newPosts, postsReady]);

  return (
    <main className="min-h-screen bg-gray-100 p-4 transition-colors duration-300 sm:p-6 dark:bg-gray-950">
      <div className="mx-auto max-w-3xl">
        <Link
          href="/"
          className="mb-6 inline-block text-blue-600 transition-colors hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
        >
          ← Back to Home
        </Link>

        {/* Loading */}
        {(loading || !postsReady) && (
          <p className="text-gray-700 dark:text-gray-300">
            Loading post...
          </p>
        )}

        {/* Error */}
        {error && (
          <p className="text-red-600 dark:text-red-400">
            {error}
          </p>
        )}

        {/* Invalid Post */}
        {postsReady && !loading && !error && !post && (
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Post not found
          </h1>
        )}

        {/* Post Content */}
        {post && (
          <article className="rounded-2xl border-2 border-gray-200 bg-white p-4 shadow-md transition-all duration-300 sm:p-6 dark:border-gray-700 dark:bg-gray-900 dark:shadow-lg">
            <h1 className="mb-4 text-3xl font-bold text-gray-900 dark:text-white">
              {post.title}
            </h1>

            <p className="whitespace-pre-line leading-7 text-gray-700 dark:text-gray-300">
              {post.body}
            </p>
          </article>
        )}
      </div>
    </main>
  );
}

// Suspense Wrapper
export default function PostPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-gray-100 p-6 dark:bg-gray-950">
          <p className="text-gray-700 dark:text-gray-300">
            Loading post...
          </p>
        </main>
      }
    >
      <PostDetails />
    </Suspense>
  );
}
