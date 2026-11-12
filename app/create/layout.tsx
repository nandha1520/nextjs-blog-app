
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Create Post",
};

export default function CreateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
