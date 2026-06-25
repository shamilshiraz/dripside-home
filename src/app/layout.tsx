import type { Metadata } from "next";
import "./globals.css";
import LenisProvider from "@/providers/LenisProvider";
import ReduxProvider from "@/providers/ReduxProvider";
import SplashScreen from "@/components/SplashScreen";
import { Geist } from "next/font/google";
import { cn } from "@/lib/utils";
import { Toaster } from "react-hot-toast";

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "Dripside",
  description: "A collective for artists who strive to build themselves",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={cn("font-sans", geist.variable)}>
      <body>
        <ReduxProvider>
          <SplashScreen />
          <Toaster
            position="top-center"
            toastOptions={{
              style: { background: "#191B1C", color: "#F4F4ED" },
            }}
          />
          <LenisProvider>{children}</LenisProvider>
        </ReduxProvider>
      </body>
    </html>
  );
}
