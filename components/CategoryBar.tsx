"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { categories } from "@/lib/api";
import { Suspense } from "react";

function CategoryBarContent() {
  const searchParams = useSearchParams();
  const currentCategory = searchParams.get("category") || "Terbaru";

  return (
    <div className="border-b border-gray-200 bg-white sticky top-16 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav className="flex space-x-8 overflow-x-auto scrollbar-hide py-3">
          {categories.map((category) => {
            const isActive = category === currentCategory;
            const href = category === "Terbaru" ? "/" : `/?category=${encodeURIComponent(category)}`;
            return (
              <Link
                key={category}
                href={href}
                className={`whitespace-nowrap text-sm font-medium transition-colors ${
                  isActive
                    ? "text-blue-600 border-b-2 border-blue-600 pb-3 -mb-3"
                    : "text-gray-500 hover:text-gray-900"
                }`}
              >
                {category}
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}

export default function CategoryBar() {
  return (
    <Suspense fallback={<div className="h-12 border-b border-gray-200 bg-white sticky top-16 z-40"></div>}>
      <CategoryBarContent />
    </Suspense>
  );
}
