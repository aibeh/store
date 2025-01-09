import type {Metadata} from "next";

import api from "~/store/api";
import CartProvider from "~/cart/context";
import ThemeProvider from "~/theme/context";

import "./globals.css";
import {Header} from "@/components/header";
import {Hero} from "@/components/hero";
import {HowItWorks} from "@/components/how-it-works";
import {AboutAgus} from "@/components/about-agus";
import {Footer} from "@/components/footer";

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
    <html suppressHydrationWarning lang="es">
      <head />
      <body className="font-sans antialiased">
        <ThemeProvider>
          <div className="m-auto flex max-w-screen-xl flex-col rounded-sm">
            <header>
              <Header store={store} />
              <Hero store={store} />
              <HowItWorks />
            </header>
            <main className="flex flex-col gap-4 px-4">
              <h2 className="flex flex-col text-center text-2xl font-medium md:text-4xl">
                <span>Hacé tu pedido</span>
              </h2>
              <CartProvider>{children}</CartProvider>
            </main>
            <footer className="px-4">
              <AboutAgus store={store} />
              <Footer />
            </footer>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
};

export default RootLayout;
