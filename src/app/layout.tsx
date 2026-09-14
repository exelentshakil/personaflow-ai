import type { Metadata } from "next";
import { ThemeProvider } from "@/components/ThemeProvider";
import "./globals.css";

export const metadata: Metadata = {
  title: "PersonaFlow AI — Consumer AI Personalization & Automated PDF Report Platform",
  description: "Enterprise full-stack consumer personalization platform with dynamic prompt orchestration, pronoun grammar synthesis, instant PDF report generation, and zero-code catalog management.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased selection:bg-blue-500/20 selection:text-blue-700 dark:selection:text-blue-300">
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
          {children}
        </ThemeProvider>
        {/* Central Demo Traffic Pixel */}
        <img
          src="https://demo-traffic.vercel.app/api/px?p=personaflow-ai"
          alt=""
          width={1}
          height={1}
          style={{ position: "absolute", width: 1, height: 1, opacity: 0, pointerEvents: "none" }}
        />
      </body>
    </html>
  );
}
