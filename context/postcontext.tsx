
"use client";

import {
  createContext,
  useContext,
  useRef,
  useState,
  useSyncExternalStore,
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

const STORAGE_KEY = "blog-posts";

const PostContext = createContext<PostContextType | undefined>(
  undefined
);

// Read and validate saved posts
function readSavedPosts(): Post[] {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);

    if (!saved) return [];

    const parsed: unknown = JSON.parse(saved);

    if (
      Array.isArray(parsed) &&
      parsed.every(
        (post) =>
          post !== null &&
          typeof post === "object" &&
          typeof post.id === "number" &&
          Number.isSafeInteger(post.id) &&
          post.id < 0 &&
          typeof post.title === "string" &&
          typeof post.body === "string"
      )
    ) {
      return parsed as Post[];
    }
  } catch (error) {
    console.error("Failed to load saved posts:", error);
  }

  return [];
}

// Subscribe to changes in browser storage
function subscribeToStorage(callback: () => void) {
  window.addEventListener("storage", callback);

  return () => {
    window.removeEventListener("storage", callback);
  };
}

function getClientSnapshot() {
  return true;
}

function getServerSnapshot() {
  return false;
}

export function PostProvider({
  children,
}: {
  children: ReactNode;
}) {
  // Becomes true after client hydration
  const postsReady = useSyncExternalStore(
    subscribeToStorage,
    getClientSnapshot,
    getServerSnapshot
  );

  // Load posts only when client is ready
  const [newPosts, setNewPosts] = useState<Post[]>(() => {
    if (typeof window === "undefined") return [];

    return readSavedPosts();
  });

  const nextId = useRef(
    Math.min(0, ...newPosts.map((post) => post.id)) - 1
  );

  const addPost = (post: Omit<Post, "id">): Post => {
    const newPost: Post = {
      ...post,
      id: nextId.current,
    };

    nextId.current -= 1;

    const updatedPosts = [newPost, ...newPosts];

    // Save immediately to localStorage
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(updatedPosts)
      );
    } catch (error) {
      console.error("Failed to save posts:", error);
    }

    setNewPosts(updatedPosts);

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
