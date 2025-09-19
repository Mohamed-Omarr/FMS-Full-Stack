import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "../../globals.css";
import { Suspense } from "react";
import { ErrorBoundary } from "next/dist/client/components/error-boundary";
import { SpeedInsights } from "@vercel/speed-insights/next"
import GlobalError from "@/app/global-error";
import Loading from "@/app/loader";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "FMS Auth",
  description: "Please Login",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ErrorBoundary errorComponent={GlobalError}>
          <Suspense fallback={<Loading />}>
          {children}
          <SpeedInsights/>
          </Suspense>
        </ErrorBoundary>
      </body>
    </html>
  );
}
