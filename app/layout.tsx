import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Nav } from "@/components/nav";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "garbagedestroyer",
  description:
    "Developer portfolio, technical blog, and content hub — systems programming, benchmarking, and software commentary.",
  metadataBase: new URL("https://garbagedestroyer.com"),
  openGraph: {
    title: "garbagedestroyer",
    description:
      "Developer portfolio, technical blog, and content hub — systems programming, benchmarking, and software commentary.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full`}
    >
      <body className="flex h-full overflow-hidden bg-background text-foreground antialiased">
        <Nav />
        <main className="flex-1 overflow-y-auto border-l border-border">
          <div className="mx-auto max-w-3xl px-8 py-12">{children}</div>
        </main>
      </body>
    </html>
  );
}
