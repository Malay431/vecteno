import { Geist, Geist_Mono } from "next/font/google";
import "/app/globals.css"; // fixed path
import ClientLayout from "../components/ClientLayout"; // use wrapper
import { Toaster } from "react-hot-toast";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// ✅ allowed in server component
export const metadata = {
  title: "Admin Login",
  description: "Admin login page for Vecteno",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <Toaster position="top-center" />
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}


// import { Geist, Geist_Mono } from "next/font/google";
// import "/app/globals.css";
// import Sidebar from "../components/Sidebar";

// const geistSans = Geist({
//   variable: "--font-geist-sans",
//   subsets: ["latin"],
// });

// const geistMono = Geist_Mono({
//   variable: "--font-geist-mono",
//   subsets: ["latin"],
// });

// export const metadata = {
//   title: "Admin Login",
//   description: "Admin login page for Vecteno",
// };

// export default function RootLayout({ children }) {
//   return (
//     <html lang="en">
//       <body>
//         <div className="flex min-h-screen">
//           {/* Sidebar */}
//           <Sidebar />

//           {/* Page Content */}
//           <div className="flex-1 overflow-y-auto bg-white p-6">
//             {children}
//           </div>
//         </div>
//       </body>
//     </html>
//   );
// }
