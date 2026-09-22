import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import { FiMenu } from "react-icons/fi";
import Sidebar from "./components/Sidebar";
import Logo from "./components/Logo";
import { DataProvider } from "./context/DataContext";

const App = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <DataProvider>
      <div className="flex h-screen overflow-hidden bg-base-200">
        <Sidebar open={menuOpen} onClose={() => setMenuOpen(false)} />

        <div className="flex min-w-0 flex-1 flex-col">
          {/* Mobil sarlavha */}
          <header className="flex items-center gap-3 border-b border-base-300/80 bg-base-100 px-4 py-3 lg:hidden">
            <button
              onClick={() => setMenuOpen(true)}
              className="btn btn-ghost btn-sm btn-circle"
              aria-label="Menyu"
            >
              <FiMenu className="text-lg" />
            </button>
            <Logo size="sm" />
          </header>

          <main className="scrollbar-thin flex-1 overflow-y-auto p-5 lg:p-8">
            <Outlet />
          </main>
        </div>
      </div>
    </DataProvider>
  );
};

export default App;
