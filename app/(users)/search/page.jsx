import { Suspense } from "react";
import SearchPage from "./SearchPage";

export default function Page() {
  return (
    <Suspense fallback={<div className="p-10 text-center">Loading...</div>}>
      <SearchPage />
    </Suspense>
  );
}

// Optional: prevent static export error
export const dynamic = "force-dynamic"; // ⚠️ needed if your project is using static export
