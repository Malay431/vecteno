"use client";

import Sidebar from "./Sidebar";

export default function ClientLayout({ children }) {
  return (
    <div className="flex flex-col sm:flex-row min-h-screen">
      <Sidebar />
      
      <main className="flex-1 bg-white p-4">
        {children}
      </main>
    </div>
  );
}


// "use client";

// import Sidebar from "./Sidebar";

// export default function ClientLayout({ children }) {
//   return (
//     <div className="flex flex-col sm:flex-row min-h-screen">
//       {/* Sidebar on top for mobile, left for desktop */}
//       <Sidebar />
      
//       {/* Main content adjusts based on screen size */}
//       <main className="flex-1 bg-white p-4 sm:ml-64">{children}</main>
//     </div>
//   );
// }
