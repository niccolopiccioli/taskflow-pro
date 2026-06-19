import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/components/providers/theme-provider";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "TaskFlow Pro — Task Management per Team di Sviluppo",
  description:
    "Gestisci il tuo team alla velocità del pensiero. Kanban board fluido con aggiornamenti real-time per startup e team tecnici.",
  keywords: ["task management", "kanban", "team collaboration", "project management", "startup"],
  authors: [{ name: "TaskFlow Pro" }],
  openGraph: {
    title: "TaskFlow Pro — Task Management per Team di Sviluppo",
    description:
      "Gestisci il tuo team alla velocità del pensiero. Kanban board fluido con aggiornamenti real-time.",
    type: "website",
    locale: "it_IT",
    siteName: "TaskFlow Pro",
  },
  twitter: {
    card: "summary_large_image",
    title: "TaskFlow Pro",
    description: "Task Management per team di sviluppo",
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: [{ url: '/icon.svg', type: 'image/svg+xml' }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="it" suppressHydrationWarning>
      <body
        className={`${inter.variable} font-sans antialiased`}
      >
        <ThemeProvider>
          {children}
        </ThemeProvider>
        <Toaster />
      </body>
    </html>
  );
}
