import { Geist, Geist_Mono } from "next/font/google";
import "/app/globals.css";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import { Toaster } from "react-hot-toast";
import LoadingBar from "./components/LoadingBar";
import FloatingJoinUs from "./components/FloatingJoinUs";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Vecteno",
  description: "A Platform for Design Resources",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        <LoadingBar />
        <FloatingJoinUs/>
        <Toaster position="top-center" reverseOrder={false} />
        {children}
        <Footer />
      </body>
    </html>
  );
}
