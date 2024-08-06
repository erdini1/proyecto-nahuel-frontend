import AuthContextProvider from "@/contexts/authContext";
import { Toaster } from "@/components/ui/toaster"
import { Inter } from "next/font/google";
import "./globals.css"

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Polirrubro Tintin",
  description: "Polirrubro Tintin",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/logo-tintin.png" />
      </head>
      <body className={inter.className}>
        <AuthContextProvider>{children}</AuthContextProvider>
        <Toaster />
      </body>
    </html>
  );
}
