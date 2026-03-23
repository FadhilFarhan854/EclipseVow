"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const NavigationFAB = () => {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <div className="fixed bottom-24 right-6 z-50 flex flex-col items-end">
      {/* Menu Options */}
      <div
        className={`flex flex-col items-end gap-3 mb-3 transition-all duration-300 ${
          isOpen ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"
        }`}
      >
        {pathname !== "/" && (
          <Link
            href="/"
            className="flex items-center gap-3 justify-end group transition-all duration-300"
            title="Home"
            onClick={() => setIsOpen(false)}
          >
            <span className="bg-card border border-border px-3 py-1.5 rounded-lg text-sm text-primary shadow-lg whitespace-nowrap opacity-90 group-hover:opacity-100 group-hover:bg-primary group-hover:text-background transition-all font-display tracking-wider">
              Home
            </span>
            <div className="w-12 h-12 rounded-full bg-card border border-border flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-background transition-all duration-300 box-glow-hover flex-shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
            </div>
          </Link>
        )}
        
        {pathname !== "/library" && (
          <Link
            href="/library"
            className="flex items-center gap-3 justify-end group transition-all duration-300"
            title="Library"
            onClick={() => setIsOpen(false)}
          >
            <span className="bg-card border border-border px-3 py-1.5 rounded-lg text-sm text-primary shadow-lg whitespace-nowrap opacity-90 group-hover:opacity-100 group-hover:bg-primary group-hover:text-background transition-all font-display tracking-wider">
              Library
            </span>
            <div className="w-12 h-12 rounded-full bg-card border border-border flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-background transition-all duration-300 box-glow-hover flex-shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
          </Link>
        )}

        {pathname !== "/remembrance" && (
          <Link
            href="/remembrance"
            className="flex items-center gap-3 justify-end group transition-all duration-300"
            title="Remembrance"
            onClick={() => setIsOpen(false)}
          >
            <span className="bg-card border border-border px-3 py-1.5 rounded-lg text-sm text-primary shadow-lg whitespace-nowrap opacity-90 group-hover:opacity-100 group-hover:bg-primary group-hover:text-background transition-all font-display tracking-wider">
              Remembrance
            </span>
            <div className="w-12 h-12 rounded-full bg-card border border-border flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-background transition-all duration-300 box-glow-hover flex-shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          </Link>
        )}
        
        {pathname !== "/rules" && (
          <Link
            href="/rules"
            className="flex items-center gap-3 justify-end group transition-all duration-300"
            title="Rules"
            onClick={() => setIsOpen(false)}
          >
            <span className="bg-card border border-border px-3 py-1.5 rounded-lg text-sm text-primary shadow-lg whitespace-nowrap opacity-90 group-hover:opacity-100 group-hover:bg-primary group-hover:text-background transition-all font-display tracking-wider">
              Rules
            </span>
            <div className="w-12 h-12 rounded-full bg-card border border-border flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-background transition-all duration-300 box-glow-hover flex-shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 6h10M8 10h10M8 14h7M6 4h12a2 2 0 012 2v14a2 2 0 01-2 2H6a2 2 0 01-2-2V6a2 2 0 012-2z"
                />
              </svg>
            </div>
          </Link>
        )}
        
        {pathname !== "/festival" && (
          <Link
            href="/festival"
            className="flex items-center gap-3 justify-end group transition-all duration-300"
            title="Festival"
            onClick={() => setIsOpen(false)}
          >
            <span className="bg-card border border-border px-3 py-1.5 rounded-lg text-sm text-primary shadow-lg whitespace-nowrap opacity-90 group-hover:opacity-100 group-hover:bg-primary group-hover:text-background transition-all font-display tracking-wider">
              Festival
            </span>
            <div className="w-12 h-12 rounded-full bg-card border border-border flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-background transition-all duration-300 box-glow-hover flex-shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 11H3a2 2 0 0 0-2 2v2a2 2 0 0 0 2 2h7" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 17v-6c0-2.2 1.8-4 4-4h2l5-5v18l-5-5h-2c-2.2 0-4-1.8-4-4z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 11v6" />
              </svg>
            </div>
          </Link>
        )}
      </div>

      {/* Main FAB Button */}
      <button
        onClick={toggleMenu}
        className="w-12 h-12 rounded-full bg-card border border-border flex items-center justify-center text-primary hover:bg-primary hover:text-background transition-all duration-300 box-glow-hover group"
        aria-label="Navigation Menu"
        title="Navigation Menu"
      >
        {isOpen ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-6 h-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 6l12 12M18 6L6 18" />
          </svg>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-6 h-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 7h14M5 12h14M5 17h14" />
          </svg>
        )}
      </button>
    </div>
  );
};

export default NavigationFAB;
