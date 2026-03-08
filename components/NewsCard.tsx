import Image from "next/image";
import Link from "next/link";
import { NewsItem } from "@/lib/api";

export default function NewsCard({ news }: { news: NewsItem }) {
  return (
    <div className="group relative flex flex-col sm:flex-row gap-4 sm:gap-6 py-6 border-b border-gray-100 last:border-0">
      <Link href={`/news/${news.id}`} className="absolute inset-0 z-0">
        <span className="sr-only">Read {news.title}</span>
      </Link>
      
      {news.imageUrl && (
        <div className="relative w-full sm:w-48 h-48 sm:h-32 rounded-xl overflow-hidden shrink-0 z-0 bg-gray-50 border border-gray-100 flex items-center justify-center p-4">
          <div className="relative w-full h-full">
            <Image
              src={news.imageUrl}
              alt={news.title}
              fill
              sizes="(max-width: 640px) 100vw, 192px"
              className="object-contain transition-transform duration-500 group-hover:scale-105"
              referrerPolicy="no-referrer"
            />
          </div>
        </div>
      )}
      
      <div className="flex flex-col flex-1 justify-between z-0 pointer-events-none">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-blue-600 text-xs font-bold uppercase tracking-wider">
              {news.category}
            </span>
            <span className="text-gray-400 text-xs">•</span>
            <span className="text-gray-500 text-xs font-medium">
              {news.publishedAt}
            </span>
          </div>
          
          <h2 className="text-xl font-bold text-gray-900 mb-2 leading-snug group-hover:text-blue-600 transition-colors line-clamp-2 pointer-events-auto w-fit">
            <Link href={`/news/${news.id}`}>{news.title}</Link>
          </h2>
          
          <p className="text-gray-600 text-sm line-clamp-2 mb-4">
            {news.summary}
          </p>
        </div>
        
        <div className="flex items-center gap-2 pointer-events-auto">
          <Link href={`/author/${encodeURIComponent(news.author)}`} className="flex items-center gap-2 hover:opacity-80 transition-opacity w-fit">
            <div className="w-6 h-6 rounded-full bg-gray-200 overflow-hidden relative">
              <Image
                src={news.authorImageUrl || `https://picsum.photos/seed/${encodeURIComponent(news.author)}/50/50`}
                alt={news.author}
                fill
                sizes="24px"
                className={news.authorImageUrl ? "object-contain p-0.5" : "object-cover"}
                referrerPolicy="no-referrer"
              />
            </div>
            <span className="text-gray-700 text-sm font-medium">{news.author}</span>
          </Link>
          <span className="text-gray-400 text-xs ml-auto">{news.readTime}</span>
        </div>
      </div>
    </div>
  );
}
