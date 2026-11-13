
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import { PostProvider } from "@/context/postcontext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Home | My Blog",
    template: "%s | My Blog",
  },
  description: "A blog application built with Next.js",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                const theme = localStorage.getItem("theme");

                if (theme === "dark") {
                  document.documentElement.classList.add("dark");
                } else {
                  document.documentElement.classList.remove("dark");
                }
              } catch (error) {}
            `,
          }}
        />
      </head>

      <body
        className={`${geistSans.variable} ${geistMono.variable} min-h-full flex flex-col antialiased`}
      >
        <PostProvider>
          {children}
        </PostProvider>
      </body>
    </html>
  );
}
