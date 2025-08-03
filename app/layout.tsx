import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { ThemeProvider } from "next-themes";
import { Toaster } from "sonner";
import { Header } from "@/components/header";
import { ConditionalLayout } from "@/components/server-conditional-layout";
import "./globals.css";

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : process.env.NEXTAUTH_URL!;

export const metadata: Metadata = {
  metadataBase: new URL(defaultUrl),
  title: "My Query Prompt Manager",
  description: "View, edit and manage the system prompts for My Query.",
};

const geistSans = Geist({
  variable: "--font-geist-sans",
  display: "swap",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.className} antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="flex flex-col h-screen">
            <Header />
            <ConditionalLayout>{children}</ConditionalLayout>
          </div>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
