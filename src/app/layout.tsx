import type {Metadata} from "next";

import {Bebas_Neue, Dancing_Script, Inter, Poppins} from "next/font/google";

import api from "~/store/api";
import CartProvider from "~/cart/context";
import ThemeProvider from "~/theme/context";

import "./globals.css";
import {Header} from "@/components/header";
import {Hero} from "@/components/hero";
import {HowItWorks} from "@/components/how-it-works";
import {AboutAgus} from "@/components/about-agus";
import {Footer} from "@/components/footer";
import {Faq} from "@/components/faq";
import {Testimonials} from "@/components/testimonials";

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-inter",
});
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-poppins",
});
const bebasNeue = Bebas_Neue({subsets: ["latin"], weight: "400", variable: "--font-bebas"});
const dancingScript = Dancing_Script({subsets: ["latin"], weight: "400", variable: "--font-dancing"});

export async function generateMetadata(): Promise<Metadata> {
  const store = await api.fetch();

  return {
    title: {
      template: `${store.title} - %s`,
      default: store.title,
    },
    description: store.subtitle,
  };
}

const RootLayout = async ({children}: {children: React.ReactNode}) => {
  const store = await api.fetch();

  return (
    <html
      suppressHydrationWarning
      className={`${inter.variable} ${poppins.variable} ${bebasNeue.variable} ${dancingScript.variable}`}
      lang="es"
    >
      <head />
      <body className="font-sans antialiased">
        <ThemeProvider>
          <div className="m-auto flex max-w-screen-xl flex-col rounded-sm">
            <header>
              <Header store={store} />
              <Hero store={store} />
              <HowItWorks />
            </header>
            <main className="flex flex-col gap-2 border-t-2 border-foreground/20 px-4 pt-10">
              <h2 className="font-heading text-center text-4xl tracking-wide">¡Hacé tu pedido!</h2>
              <p className="mb-6 text-center font-script text-3xl text-muted-foreground">
                Tu semana saludable empieza acá.
              </p>
              <CartProvider>{children}</CartProvider>
            </main>
            <Faq />
            <Testimonials />
            <footer className="px-4">
              <AboutAgus store={store} />
              <Footer store={store} />
            </footer>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
};

export default RootLayout;
