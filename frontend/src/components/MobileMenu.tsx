"use client";

import { useState } from "react";

export function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Hamburger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden tap-target p-2 text-gray-600 hover:text-primary transition-colors"
        aria-label="Toggle menu"
        aria-expanded={isOpen}
      >
        <svg
          className="w-6 h-6"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          {isOpen ? (
            <path d="M6 18L18 6M6 6l12 12" />
          ) : (
            <path d="M4 6h16M4 12h16M4 18h16" />
          )}
        </svg>
      </button>

      {/* Mobile Menu Overlay */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
            onClick={() => setIsOpen(false)}
          />

          {/* Menu Panel */}
          <div className="fixed top-0 right-0 bottom-0 w-64 bg-white shadow-2xl z-50 lg:hidden transform transition-transform duration-300 ease-in-out">
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-gray-100">
                <span className="text-lg font-bold text-secondary">Menu</span>
                <button
                  onClick={() => setIsOpen(false)}
                  className="tap-target p-2 text-gray-600 hover:text-primary"
                  aria-label="Close menu"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Menu Items */}
              <nav className="flex-1 overflow-y-auto p-4">
                <a
                  href="/"
                  className="block py-3 px-4 text-gray-700 hover:bg-gray-50 hover:text-primary rounded-lg transition-colors tap-target"
                  onClick={() => setIsOpen(false)}
                >
                  Home
                </a>
                <a
                  href="/shipments"
                  className="block py-3 px-4 text-gray-700 hover:bg-gray-50 hover:text-primary rounded-lg transition-colors tap-target"
                  onClick={() => setIsOpen(false)}
                >
                  Shipments
                </a>
                <a
                  href="/analytics"
                  className="block py-3 px-4 text-gray-700 hover:bg-gray-50 hover:text-primary rounded-lg transition-colors tap-target"
                  onClick={() => setIsOpen(false)}
                >
                  📊 Monitoring
                </a>
                <a
                  href="/shipments/new"
                  className="block mt-4 py-3 px-4 bg-primary text-white text-center rounded-lg font-medium hover:bg-blue-600 transition-colors tap-target"
                  onClick={() => setIsOpen(false)}
                >
                  New Shipment
                </a>
              </nav>
            </div>
          </div>
        </>
      )}
    </>
  );
}
