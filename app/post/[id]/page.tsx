
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
    <main className="min-h-screen bg-gray-100 p-6">
      <div className="mx-auto max-w-3xl">
        <Link
          href="/"
          className="mb-6 inline-block text-blue-600"
        >
          ← Back to Home
        </Link>

        {(loading || !postsReady) && (
          <p className="text-gray-700">
            Loading post...
          </p>
        )}

        {error && (
          <p className="text-red-600">
            {error}
          </p>
        )}

        {postsReady && !loading && !error && !post && (
          <h1 className="text-2xl font-bold text-gray-900">
            Post not found
          </h1>
        )}

        {post && (
          <article className="rounded-lg bg-white p-6 shadow">
            <h1 className="mb-4 text-3xl font-bold text-gray-900">
              {post.title}
            </h1>

            <p className="whitespace-pre-line text-gray-700">
              {post.body}
            </p>
          </article>
        )}
      </div>
    </main>
  );
}

export default function PostPage() {
  return (
    <Suspense fallback={<p>Loading post...</p>}>
      <PostDetails />
    </Suspense>
  );
}

