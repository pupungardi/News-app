'use client';

import Link from "next/link";
import { Search, Menu, User, X } from "lucide-react";
import { useState } from "react";

export default function Header() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {!isSearchOpen && (
            <div className="flex items-center gap-4">
              <button className="p-2 -ml-2 text-gray-600 hover:bg-gray-100 rounded-full md:hidden">
                <Menu className="w-6 h-6" />
              </button>
              <Link href="/" className="flex items-center gap-2">
                <div className="h-8 w-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-xl leading-none">N</span>
                </div>
              </Link>
            </div>
          )}

          <div className="flex-1" />

          {!isSearchOpen && (
            <div className="flex items-center gap-2">
              <Link href="/profile" className="p-2 text-gray-600 hover:bg-gray-100 rounded-full">
                <User className="w-6 h-6" />
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
