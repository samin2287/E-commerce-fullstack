import React from "react";
import Footer from "@/components/frontend/Footer";
import Navbar from "@/components/frontend/Navbar";

export default function FrontendLayout({ children }) {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
