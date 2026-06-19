import type { Metadata } from "next";
import { DM_Sans, Instrument_Serif, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-display",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
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
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="it" className="dark" suppressHydrationWarning>
      <body
        className={`${dmSans.variable} ${instrumentSerif.variable} ${jetbrainsMono.variable} font-sans antialiased`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
