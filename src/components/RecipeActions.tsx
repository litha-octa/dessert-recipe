"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { Printer, Share2 } from "lucide-react";

export default function RecipeActions() {
  const params = useParams();
  const slug = params.slug as string;

  return (
    <div className="mt-8 flex flex-col sm:flex-row gap-3 sm:gap-4 print:hidden">
      <Link
        href={`/recipe/${slug}/print`}
        className="px-4 sm:px-6 py-3 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors text-sm sm:text-base flex items-center justify-center gap-2"
      >
        <Printer size={18} />
        Download PDF
      </Link>
      <button className="px-4 sm:px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-sm sm:text-base flex items-center justify-center gap-2">
        <Share2 size={18} />
        Share on WhatsApp
      </button>
      <button className="px-4 sm:px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm sm:text-base flex items-center justify-center gap-2">
        <Share2 size={18} />
        Share on Email
      </button>
    </div>
  );
}
