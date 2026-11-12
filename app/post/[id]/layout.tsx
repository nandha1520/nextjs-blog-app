
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Post Details",
};

export default function PostDetailsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
