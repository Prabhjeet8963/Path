import { Inter, Noto_Sans_Gurmukhi } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const notoSansGurmukhi = Noto_Sans_Gurmukhi({
  variable: "--font-noto-gurmukhi",
  weight: ["400", "500", "600", "700"],
  subsets: ["gurmukhi"],
});

export const metadata = {
  title: "Path.io — Nitnem Daily Sikh Prayers",
  description: "Listen to the complete Nitnem daily Sikh prayers in a distraction-free, immersive environment.",
};

export const viewport = {
  themeColor: '#000000',
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${notoSansGurmukhi.variable} h-full antialiased dark`}
    >
      <body className="min-h-full flex flex-col bg-black text-white font-sans">
        {children}
      </body>
    </html>
  );
}
