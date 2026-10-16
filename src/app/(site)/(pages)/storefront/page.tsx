import Home from "@/components/Home";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Storefront preview | Retailr",
  description: "Preview of the customer-facing storefront template.",
};

export default function StorefrontPreview() {
  return <Home />;
}
