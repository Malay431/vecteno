// app/(users)/order/page.jsx
import { Suspense } from "react";
import OrderPageContent from "./OrderPageContent";

export default function Page() {
  return (
    <Suspense fallback={<div className="p-10 text-center">Loading...</div>}>
      <OrderPageContent />
    </Suspense>
  );
}
