"use client";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import "../css/euclid-circular-a-font.css";
import "../css/style.css";
import Header from "../../components/Header";
import Footer from "../../components/Footer";

import { ModalProvider } from "../context/QuickViewModalContext";
import { CartModalProvider } from "../context/CartSidebarModalContext";
import { ReduxProvider } from "@/redux/provider";
import QuickViewModal from "@/components/Common/QuickViewModal";
import CartSidebarModal from "@/components/Common/CartSidebarModal";
import { PreviewSliderProvider } from "../context/PreviewSliderContext";
import PreviewSliderModal from "@/components/Common/PreviewSlider";

import ScrollToTop from "@/components/Common/ScrollToTop";
import PreLoader from "@/components/Common/PreLoader";

export default function RootLayout({
                                     children,
                                   }: {
  children: React.ReactNode;
}) {
  const [loading, setLoading] = useState<boolean>(true);
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");
  // Marketing pages bring their own header/footer and skip the storefront shell.
  const isMarketing = pathname === "/" || pathname?.startsWith("/get-started");
  const skipShell = isAdmin || isMarketing;

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), skipShell ? 0 : 1000);
    return () => clearTimeout(t);
  }, [skipShell]);

  return (
      <html lang="en" suppressHydrationWarning={true}>
      <body>
      {loading ? (
          <PreLoader />
      ) : skipShell ? (
          // Admin + marketing: no storefront header/footer/modals
          <>{children}</>
      ) : (
          <>
            <ReduxProvider>
              <CartModalProvider>
                <ModalProvider>
                  <PreviewSliderProvider>
                    <Header />
                    {children}
                    <QuickViewModal />
                    <CartSidebarModal />
                    <PreviewSliderModal />
                  </PreviewSliderProvider>
                </ModalProvider>
              </CartModalProvider>
            </ReduxProvider>
            <ScrollToTop />
            <Footer />
          </>
      )}
      </body>
      </html>
  );
}