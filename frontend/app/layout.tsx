import type { Metadata } from "next";
import { Caprasimo, Figtree, Fraunces, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import Ambient from "@/components/layout/Ambient";


const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  weight: ["400", "500", "600"],
});

const jbmono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jbmono",
  weight: ["400", "500"],
});

// The Organic design system's pairing, used by the landing page (see
// styles/organic.css). Caprasimo is the only display voice; Figtree is body.
const caprasimo = Caprasimo({
  subsets: ["latin"],
  variable: "--font-caprasimo",
  weight: "400",
});

const figtree = Figtree({
  subsets: ["latin"],
  variable: "--font-figtree",
  weight: ["400", "600", "700"],
});

export const metadata: Metadata = {
  title: "Novable — Your AI Co-pilot for Growth",
  description:
    "Generate a professional website and AI marketing agents for your business in under 60 seconds.",
  openGraph: {
    title: "Novable — AI Website & Growth Engine for ₹500",
    description:
      "Turn your business info into a live website and AI marketing agents in under 60 seconds.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Novable — Your AI Co-pilot for Growth",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Novable — AI Website & Growth Engine for ₹500",
    description:
      "Turn your business info into a live website and AI marketing agents in under 60 seconds.",
    images: ["/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${fraunces.variable} ${inter.variable} ${jbmono.variable} ${caprasimo.variable} ${figtree.variable}`}
    >
      <body className="font-body antialiased">
        <Ambient />
        {children}
      </body>
    </html>
  );
}
