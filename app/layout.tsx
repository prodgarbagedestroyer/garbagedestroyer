import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Nav } from "@/components/nav";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "prod.garbagedestroyer",
    template: "%s — prod.garbagedestroyer",
  },
  description:
    "Benchmarks, systems experiments, and public builds. Watch the breakdown, then inspect the code.",
  metadataBase: new URL("https://prod.garbagedestroyer.com"),
  openGraph: {
    title: "prod.garbagedestroyer",
    description:
      "Benchmarks, systems experiments, and public builds. YouTube deep-dives paired with open-source repos.",
    type: "website",
    siteName: "prod.garbagedestroyer",
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
      <body className="min-h-full bg-zinc-950 text-zinc-100 antialiased">
        <Nav />
        <main className="md:ml-56 min-h-screen overflow-y-auto">
          <div className="mx-auto max-w-4xl px-4 py-10 md:px-8 md:py-12">
            {children}
          </div>
        </main>
      </body>
    </html>
  );
}
