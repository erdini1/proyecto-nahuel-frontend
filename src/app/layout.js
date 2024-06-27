import AuthContextProvider from "@/contexts/authContext";
import { Toaster } from "@/components/ui/toaster"
import { Inter } from "next/font/google";
import "./globals.css"

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Proyecto Nahuel",
  description: "Pagina de Inicio de Proyecto Nahuel",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthContextProvider>{children}</AuthContextProvider>
        <Toaster />
      </body>
    </html>
  );
}
