"use client";
import Spinner from "@/components/saas/Spinner";

// The (admin) layout redirects /admin to the right dashboard for the signed-in role.
export default function AdminIndex() {
  return (
    <div className="flex justify-center py-24">
      <Spinner />
    </div>
  );
}
