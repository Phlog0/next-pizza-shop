import { JetBrains_Mono } from "next/font/google";
import "./globals.css";
import React from "react";
import { Metadata } from "next";
import { Providers } from "@/shared/components/shared";

const jb = JetBrains_Mono({
  variable: "--font-jb",
  subsets: ["cyrillic"],
});
export const metadata: Metadata = {
  icons: {
    icon: "/logo.png",
  },
};
export default function GlobalRootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${jb.variable} font-my-jetbrains-mono antialiased`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
