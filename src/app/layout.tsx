import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import SessionProvider from "@/components/providers/SessionProvider";
import { Toaster } from "@/components/ui/sonner";

export const metadata: Metadata = {
  title: "ArabTree | شجرة الأنساب",
  description: "Digital platform to document and visualize Arab genealogy.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Kufi+Arabic:wght@400;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-sans antialiased bg-background text-foreground" style={{ fontFamily: "'Noto Kufi Arabic', system-ui, arial" }}>
        <SessionProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {children}
            <Toaster />
          </ThemeProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
