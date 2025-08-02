"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { FiMenu, FiX } from "react-icons/fi";

const Sidebar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = async () => {
    await fetch("/api/adminLogout", { method: "POST" });
    router.push("/admin/login");
  };

  const menuItems = [
    { href: "/admin/dashboard", label: "Dashboard" },
    { href: "/admin/dashboard/upload", label: "Upload" },
    { href: "/admin/dashboard/images", label: "Images" },
    { href: "/admin/dashboard/users", label: "Users" },
    { href: "/admin/dashboard/banner", label: "Home Page Banner" },
    { href: "/admin/dashboard/offers", label: "Offers" },
    { href: "/admin/dashboard/coupon", label: "Coupon" },
    { href: "/admin/dashboard/subscription", label: "Subscription" },
    { href: "/admin/dashboard/mostdownloadable", label: "Trending Section" },
    // { href: "/admin/dashboard/categories", label: "Manage Categories" },
  ];

  return (
    <>
      {/* Mobile Header */}
      <div className="sm:hidden flex justify-between items-center bg-black text-white p-4">
        <h2 className="text-xl font-bold">Vecteno</h2>
        <button onClick={() => setMenuOpen(!menuOpen)} className="text-white text-2xl">
          {menuOpen ? <FiX /> : <FiMenu />}
        </button>
      </div>

      {/* Sidebar */}
      <div
        className={`bg-black text-white sm:w-1/5 sm:min-w-[230px] p-5 h-screen sm:sticky sm:top-0 sm:block border-r border-gray-800 shadow-md z-50 transition-transform duration-300 ease-in-out
        ${menuOpen ? "fixed top-0 left-0 w-3/4 max-w-xs" : "hidden"} sm:translate-x-0`}
      >
        {/* Brand */}
        <h2 className="text-2xl font-bold mb-8 text-center">
          <Link href="/">Vecteno</Link>
        </h2>

        {/* Menu Items */}
        <ul className="space-y-3">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={() => setMenuOpen(false)} // close on mobile
                  className={`block px-4 py-2 rounded-full text-center font-medium transition duration-200
                    ${
                      isActive
                        ? "bg-white text-black shadow"
                        : "bg-gray-900 text-white hover:bg-gray-700"
                    }`}
                >
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>

        {/* Logout Button */}
        <div className="mt-8">
          <button
            onClick={() => {
              setMenuOpen(false); // close mobile menu
              handleLogout();
            }}
            className="w-full bg-red-600 text-white py-2 cursor-pointer rounded-full hover:bg-red-700 transition duration-200 shadow"
          >
            Logout
          </button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;






// "use client";
// import Link from "next/link";
// import { usePathname, useRouter } from "next/navigation";
// import { useState } from "react";
// import { Menu, X } from "lucide-react"; // Optional: Add `lucide-react` package for icons

// const Sidebar = () => {
//   const pathname = usePathname();
//   const router = useRouter();
//   const [isOpen, setIsOpen] = useState(false);

//   const handleLogout = async () => {
//     await fetch("/api/adminLogout", { method: "POST" });
//     router.push("/admin/login");
//   };

  // const menuItems = [
  //   { href: "/admin/dashboard", label: "Dashboard" },
  //   { href: "/admin/dashboard/upload", label: "Upload" },
  //   { href: "/admin/dashboard/images", label: "Images" },
  //   { href: "/admin/dashboard/users", label: "Users" },
  //   { href: "/admin/dashboard/banner", label: "Home Page Banner" },
  //   { href: "/admin/dashboard/offers", label: "Offers" },
  //   { href: "/admin/dashboard/coupon", label: "Coupon" },
  //   { href: "/admin/dashboard/subscription", label: "Subscription" },
  //   { href: "/admin/dashboard/mostdownloadable", label: "Most Downloadables" },
  // ];

//   return (
//     <>
//       {/* Mobile Nav Toggle */}
//       <div className="md:hidden flex items-center justify-between p-4 bg-black text-white">
//         <h2 className="text-xl font-bold">
//           <Link href="/">Vecteno</Link>
//         </h2>
//         <button onClick={() => setIsOpen(!isOpen)}>
//           {isOpen ? <X size={28} /> : <Menu size={28} />}
//         </button>
//       </div>

//       {/* Sidebar */}
//       <div
//         className={`fixed md:static z-50 top-0 left-0 h-full w-64 bg-black text-white p-5 transition-transform duration-300 ease-in-out transform 
//         ${isOpen ? "translate-x-0" : "-translate-x-full"} 
//         md:translate-x-0 md:w-1/5 md:min-w-[230px] md:h-screen md:sticky md:top-0 md:border-r md:border-gray-800 md:shadow-md`}
//       >
//         <div className="md:hidden flex justify-end mb-4">
//           <button onClick={() => setIsOpen(false)}>
//             <X size={24} />
//           </button>
//         </div>

//         <h2 className="text-2xl font-bold mb-8 text-center text-white">
//           <Link href="/">Vecteno</Link>
//         </h2>

//         <ul className="space-y-3">
//           {menuItems.map((item) => {
//             const isActive = pathname === item.href;
//             return (
//               <li key={item.href}>
//                 <Link
//                   href={item.href}
//                   onClick={() => setIsOpen(false)}
//                   className={`block px-4 py-2 rounded-full text-center font-medium transition duration-200
//                     ${
//                       isActive
//                         ? "bg-white text-black shadow"
//                         : "bg-gray-900 text-white hover:bg-gray-700"
//                     }`}
//                 >
//                   {item.label}
//                 </Link>
//               </li>
//             );
//           })}
//         </ul>

//         <div className="mt-8">
//           <button
//             onClick={handleLogout}
//             className="w-full bg-red-600 text-white py-2 cursor-pointer rounded-full hover:bg-red-700 transition duration-200 shadow"
//           >
//             Logout
//           </button>
//         </div>
//       </div>

//       {/* Overlay for mobile when sidebar is open */}
//       {isOpen && (
//         <div
//           className="fixed inset-0 bg-black bg-opacity-40 z-40 md:hidden"
//           onClick={() => setIsOpen(false)}
//         ></div>
//       )}
//     </>
//   );
// };

// export default Sidebar;


// "use client";
// import Link from "next/link";
// import { usePathname, useRouter } from "next/navigation";

// const Sidebar = () => {
//   const pathname = usePathname();
//   const router = useRouter();

//   const handleLogout = async () => {
//     await fetch("/api/adminLogout", { method: "POST" });
//     router.push("/admin/login");
//   };

//   const menuItems = [
//     { href: "/admin/dashboard", label: "Dashboard" },
//     { href: "/admin/dashboard/upload", label: "Upload" },
//     { href: "/admin/dashboard/images", label: "Images" },
//     { href: "/admin/dashboard/users", label: "Users" },
//     { href: "/admin/dashboard/banner", label: "Home Page Banner" },
//     { href: "/admin/dashboard/offers", label: "Offers" },
//     { href: "/admin/dashboard/coupon", label: "Coupon" },
//     { href: "/admin/dashboard/subscription", label: "Subscription" },
//     { href: "/admin/dashboard/mostdownloadable", label: "Most Downloadables" },
//   ];

//   return (
//     <div className="w-1/5 min-w-[230px] bg-black text-white p-5 h-screen sticky top-0 border-r border-gray-800 shadow-md">
//       <h2 className="text-2xl font-bold mb-8 text-center text-white">
//         <Link href="/">Vecteno</Link>
//       </h2>

//       <ul className="space-y-3">
//         {menuItems.map((item) => {
//           const isActive = pathname === item.href;
//           return (
//             <li key={item.href}>
//               <Link
//                 href={item.href}
//                 className={`block px-4 py-2 rounded-full text-center font-medium transition duration-200
//                   ${
//                     isActive
//                       ? "bg-white text-black shadow"
//                       : "bg-gray-900 text-white hover:bg-gray-700"
//                   }`}
//               >
//                 {item.label}
//               </Link>
//             </li>
//           );
//         })}
//       </ul>

//       <div className="mt-8">
//         <button
//           onClick={handleLogout}
//           className="w-full bg-red-600 text-white py-2 cursor-pointer rounded-full hover:bg-red-700 transition duration-200 shadow"
//         >
//           Logout
//         </button>
//       </div>
//     </div>
//   );
// };

// export default Sidebar;
