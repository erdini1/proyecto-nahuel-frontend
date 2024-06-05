import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Proyecto Nahuel",
  description: "Pagina de Inicio de Proyecto Nahuel",
};


// TODO: Agregar Seguridad para no poder acceder a una pagina sin estar logueado
// TODO: Hacer una barra de navegacion
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
      </body>
    </html>
  );
}
