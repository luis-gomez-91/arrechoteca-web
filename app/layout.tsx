import type { Metadata, Viewport } from "next";
import { Roboto, Inter } from "next/font/google";
import "./globals.css";
import Nav from '@/components/navigation/Nav'
import Footer from "@/components/navigation/Footer";
import { AuthProvider } from '@/contexts/AuthContext'; // ← Importar AuthProvider

const roboto = Roboto({
  variable: "--font-roboto",
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Arrechoteca - Jerga Guayaca",
    template: "%s | Arrechoteca"
  },
  description: "Diccionario completo de la jerga guayaca ecuatoriana. Descubre palabras, insultos y expresiones típicas de Guayaquil.",
  keywords: ["jerga guayaca", "diccionario", "guayaquil", "ecuador", "palabras", "expresiones"],
  authors: [{ name: "Arrechoteca Team" }],
  creator: "Arrechoteca",
  publisher: "Arrechoteca",
  openGraph: {
    type: "website",
    locale: "es_EC",
    url: "https://arrechoteca.com",
    siteName: "Arrechoteca",
    title: "Arrechoteca - Jerga Guayaca",
    description: "Diccionario completo de la jerga guayaca ecuatoriana",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Arrechoteca - Jerga Guayaca",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Arrechoteca - Jerga Guayaca",
    description: "Diccionario completo de la jerga guayaca ecuatoriana",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={`
        ${roboto.variable} 
        ${inter.variable} 
        font-sans antialiased 
        text-gray-900 dark:text-gray-50 
        selection:bg-blue-200 selection:text-blue-900
        min-h-screen
        flex flex-col
        bg-slate-100
      `}>
        {/* AuthProvider envuelve toda la aplicación */}
        <AuthProvider>
          <Nav /> 
          <div className="m-auto h-screen flex-1 flex justify-center w-screen">
            {children}
          </div>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}