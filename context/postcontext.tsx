
"use client";

import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";

export type Post = {
  id: number;
  title: string;
  body: string;
};

type PostContextType = {
  newPosts: Post[];
  addPost: (post: Omit<Post, "id">) => Post;
  postsReady: boolean;
};

const PostContext = createContext<PostContextType | undefined>(
  undefined
);

export function PostProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [newPosts, setNewPosts] = useState<Post[]>([]);
  const [postsReady, setPostsReady] = useState(false);

  const nextId = useRef(-1);

  // Load saved posts when the app starts
  useEffect(() => {
    try {
      const saved = localStorage.getItem("blog-posts");

      if (saved) {
        const parsed: unknown = JSON.parse(saved);

        if (
          Array.isArray(parsed) &&
          parsed.every(
            (post) =>
              typeof post.id === "number" &&
              Number.isSafeInteger(post.id) &&
              post.id < 0 &&
              typeof post.title === "string" &&
              typeof post.body === "string"
          )
        ) {
          const savedPosts = parsed as Post[];
          setNewPosts(savedPosts);

          const lowestId = Math.min(
            0,
            ...savedPosts.map((post) => post.id)
          );

          nextId.current = lowestId - 1;
        }
      }
    } catch (error) {
      console.error("Failed to load saved posts:", error);
    } finally {
      setPostsReady(true);
    }
  }, []);

  // Save posts whenever they change
  useEffect(() => {
    if (!postsReady) return;

    try {
      localStorage.setItem(
        "blog-posts",
        JSON.stringify(newPosts)
      );
    } catch (error) {
      console.error("Failed to save posts:", error);
    }
  }, [newPosts, postsReady]);

  const addPost = (post: Omit<Post, "id">): Post => {
    const newPost: Post = {
      ...post,
      id: nextId.current,
    };

    nextId.current -= 1;

    setNewPosts((prev) => [newPost, ...prev]);

    return newPost;
  };

  return (
    <PostContext.Provider
      value={{ newPosts, addPost, postsReady }}
    >
      {children}
    </PostContext.Provider>
  );
}

export function usePosts() {
  const context = useContext(PostContext);

  if (!context) {
    throw new Error(
      "usePosts must be used within PostProvider"
    );
  }

  return context;
}
