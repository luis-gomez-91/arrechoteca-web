import type { Metadata, Viewport } from "next";
import { Roboto, Inter } from "next/font/google";
import "./globals.css";
import Nav from '@/components/navigation/Nav'
import Footer from "@/components/navigation/Footer";
import AdSlot from "@/components/ads/AdSlot";
import { AuthProvider } from '@/contexts/AuthContext'; // ← Importar AuthProvider
import { Toaster } from "@/components/ui/sonner";

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
    default: "La Caleta del Verbo - Jerga Guayaca",
    template: "%s | La Caleta del Verbo"
  },
  description: "Diccionario completo de la jerga guayaca ecuatoriana. Descubre palabras, insultos y expresiones típicas de Guayaquil.",
  keywords: ["jerga guayaca", "diccionario", "guayaquil", "ecuador", "palabras", "expresiones"],
  authors: [{ name: "La Caleta del Verbo Team" }],
  creator: "La Caleta del Verbo",
  publisher: "La Caleta del Verbo",
  openGraph: {
    type: "website",
    locale: "es_EC",
    url: "https://lacaletadelverbo.com",
    siteName: "La Caleta del Verbo",
    title: "La Caleta del Verbo - Jerga Guayaca",
    description: "Diccionario completo de la jerga guayaca ecuatoriana",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "La Caleta del Verbo - Jerga Guayaca",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "La Caleta del Verbo - Jerga Guayaca",
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
        text-foreground
        selection:bg-primary/20 selection:text-foreground
        min-h-screen
        flex flex-col
        bg-background
        overflow-x-hidden
      `}>
        <AuthProvider>
          <Nav />
          <main className="flex-1 flex flex-col w-full max-w-4xl mx-auto px-4 sm:px-6 py-6 min-h-[calc(100vh-8rem)]">
            {children}
          </main>
          {/* Espacio publicitario: banner arriba del footer (visible en todas las páginas) */}
          <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 py-4">
            <AdSlot id="banner-footer" variant="banner" />
          </div>
          <Footer />
          <Toaster richColors position="top-right" />
        </AuthProvider>
      </body>
    </html>
  );
}