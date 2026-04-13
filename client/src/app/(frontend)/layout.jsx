import React from "react";
import CartDrawer from "@/components/frontend/CartDrawer";
import Footer from "@/components/frontend/Footer";
import Navbar from "@/components/frontend/Navbar";
import { AppProviders } from "@/components/shared/AppProviders";

export default function FrontendLayout({ children }) {
  return (
    <AppProviders>
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
        <CartDrawer />
      </div>
    </AppProviders>
  );
}
