import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import { Toaster } from "@/components/ui/sonner";
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { UserProvider } from "../lib/AuthContext";
import ThemeProvider from "@/components/ThemeProvider";
import { useRouter } from "next/router";
import Head from "next/head";

export default function App({
  Component,
  pageProps,
}: AppProps) {
  const router = useRouter();

  const isCallPage = router.pathname === "/call";

  return (
    <UserProvider>
      <ThemeProvider>
        <Head>
          <title>Your-Tube Clone</title>
          <meta
            name="description"
            content="YourTube video streaming platform"
          />
        </Head>

        <div className="min-h-screen bg-white text-black">
          <Toaster />

          {isCallPage ? (
            <Component {...pageProps} />
          ) : (
            <>
              <Header />

              <div className="flex">
                <Sidebar />

                <main className="flex-1">
                  <Component {...pageProps} />
                </main>
              </div>
            </>
          )}
        </div>
      </ThemeProvider>
    </UserProvider>
  );
}