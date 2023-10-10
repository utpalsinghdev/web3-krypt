import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { Footer, Navbar, Services, Transactions, Welcome } from "@/components";
import { TransactionsProvider } from "@/hooks/store";
ReactDOM.createRoot(document.getElementById("root")!).render(
  <TransactionsProvider>
    <React.StrictMode>
      <div className="min-h-screen">
        <div className="gradient-bg-welcome">
          <Navbar />
          <Welcome />
        </div>
        <Services />
        <Transactions />
        <Footer />
      </div>
    </React.StrictMode>
  </TransactionsProvider>
);
