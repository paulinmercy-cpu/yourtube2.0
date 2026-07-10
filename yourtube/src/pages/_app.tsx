import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import { Toaster } from "@/components/ui/sonner";
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { UserProvider } from "../lib/AuthContext";
import ThemeProvider from "@/components/ThemeProvider";
import { useRouter } from "next/router";

export default function App({
  Component,
  pageProps,
}: AppProps) {
  const router = useRouter();

  const isCallPage = router.pathname === "/call";

  return (
    <UserProvider>
      <ThemeProvider>
        <div className="min-h-screen bg-white text-black dark:bg-black dark:text-white">

          <title>Your-Tube Clone</title>

          <Toaster />

          {isCallPage ? (

            <Component {...pageProps} />

          ) : (

            <>
              <Header />

              <div className="flex">
                <Sidebar />
                <Component {...pageProps} />
              </div>
            </>

          )}

        </div>
      </ThemeProvider>
    </UserProvider>
  );
}