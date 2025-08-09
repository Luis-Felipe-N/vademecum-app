import type { Metadata } from "next";
import { Geist_Mono, Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/providers/theme-provider";
import { QueryProvider } from "@/providers/useQueryProvider";
import NextAuthSessionProvider from "./provider/sessionProvider";
import { Toaster } from "sonner";

const geistSans = Inter({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Vademecum :: Perguntas e Respostas",
  description: "Vade Mecum é uma plataforma colaborativa onde alunos podem fazer perguntas e obter respostas sobre matérias, provas e tópicos desafiadores.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased `}
      >
        <Toaster richColors/>

        <ThemeProvider 
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
          disableTransitionOnChange>
          <NextAuthSessionProvider>
            <QueryProvider>{children}</QueryProvider>
          </NextAuthSessionProvider>

        </ThemeProvider>
      </body>
    </html>
  );
}
