"use client";
import { Outfit } from "next/font/google";
import "flatpickr/dist/flatpickr.css";
import { SidebarProvider } from "@/app/context/SidebarContext";
import { ThemeProvider } from "@/app/context/ThemeContext";

const outfit = Outfit({
    subsets: ["latin"],
});

export default function AdminLayout({
                                        children,
                                    }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div className={`${outfit.className} admin-body dark:bg-gray-900 min-h-screen`}>
            <ThemeProvider>
                <SidebarProvider>{children}</SidebarProvider>
            </ThemeProvider>
        </div>
    );
}