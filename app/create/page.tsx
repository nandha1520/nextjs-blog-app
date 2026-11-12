
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { usePosts } from "@/context/postcontext";
import Button from "@/components/button";

export default function CreatePost() {
  const router = useRouter();
  const { addPost } = usePosts();

  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [loading, setLoading] = useState(false);

  const [errors, setErrors] = useState({
    title: "",
    body: "",
    submit: "",
  });

  async function handleSubmit(
    e: React.FormEvent<HTMLFormElement>
  ) {
    e.preventDefault();

    if (loading) return;

    const newErrors = {
      title: "",
      body: "",
      submit: "",
    };

    if (title.trim().length < 5) {
      newErrors.title = "Title must be at least 5 characters";
    }

    if (body.trim().length < 20) {
      newErrors.body = "Body must be at least 20 characters";
    }

    setErrors(newErrors);

    if (newErrors.title || newErrors.body) return;

    setLoading(true);

    try {
      const response = await fetch(
        "https://jsonplaceholder.typicode.com/posts",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title: title.trim(),
            body: body.trim(),
            userId: 1,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to create post");
      }

      addPost({
        title: title.trim(),
        body: body.trim(),
      });

      router.push("/");
    } catch {
      setErrors((prev) => ({
        ...prev,
        submit: "Failed to create post. Please try again.",
      }));
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-gray-100 p-6">
      <div className="mx-auto max-w-2xl">
        <Link href="/" className="text-blue-600">
          ← Back to Home
        </Link>

        <h1 className="my-6 text-3xl font-bold text-gray-900">
          Create New Post
        </h1>

        <form
          onSubmit={handleSubmit}
          className="space-y-5 rounded-lg bg-white p-6 shadow"
        >
          <div>
            <label
              htmlFor="title"
              className="mb-2 block font-medium text-gray-900"
            >
              Post Title
            </label>

            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter post title"
              className="w-full rounded-lg border p-3 text-gray-900"
            />

            {errors.title && (
              <p className="mt-1 text-sm text-red-600">
                {errors.title}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="body"
              className="mb-2 block font-medium text-gray-900"
            >
              Post Body
            </label>

            <textarea
              id="body"
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="Write your blog content..."
              rows={6}
              className="w-full rounded-lg border p-3 text-gray-900"
            />

            {errors.body && (
              <p className="mt-1 text-sm text-red-600">
                {errors.body}
              </p>
            )}
          </div>

          {errors.submit && (
            <p className="text-red-600">
              {errors.submit}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="rounded-lg bg-blue-600 px-6 py-3 text-white disabled:opacity-50"
          >
            {loading ? "Creating..." : "Create Post"}
          </button>
        </form>
      </div>
    </main>
  );
}
