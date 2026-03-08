import Image from "next/image";
import Link from "next/link";
import { NewsItem } from "@/lib/api";

export default function HeroNews({ news }: { news: NewsItem }) {
  return (
    <div className={`group relative block w-full h-[400px] sm:h-[500px] lg:h-[600px] rounded-2xl overflow-hidden mb-8 ${!news.imageUrl ? 'bg-slate-900' : 'bg-gray-100'}`}>
      <Link href={`/news/${news.id}`} className="absolute inset-0 z-0">
        <span className="sr-only">Read {news.title}</span>
      </Link>
      {news.imageUrl && (
        <div className="absolute inset-0 flex items-center justify-center p-12 sm:p-24 lg:p-32">
          <div className="relative w-full h-full">
            <Image
              src={news.imageUrl}
              alt={news.title}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 100vw, 100vw"
              className="object-contain transition-transform duration-700 group-hover:scale-105"
              referrerPolicy="no-referrer"
              priority
            />
          </div>
        </div>
      )}
      <div className={`absolute inset-0 ${news.imageUrl ? 'bg-gradient-to-t from-black/80 via-black/20 to-transparent' : 'bg-gradient-to-t from-black/60 to-transparent'} pointer-events-none`} />
      
      <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8 lg:p-12 pointer-events-none">
        <div className="flex items-center gap-3 mb-4">
          <span className="px-3 py-1 bg-blue-600 text-white text-xs font-bold uppercase tracking-wider rounded-full">
            {news.category}
          </span>
          <span className="text-gray-300 text-sm font-medium">
            {news.publishedAt}
          </span>
        </div>
        
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4 leading-tight group-hover:text-blue-400 transition-colors pointer-events-auto w-fit">
          <Link href={`/news/${news.id}`}>{news.title}</Link>
        </h1>
        
        <p className="text-gray-300 text-lg sm:text-xl max-w-3xl line-clamp-2 sm:line-clamp-3">
          {news.summary}
        </p>
        
        <div className="mt-6 flex items-center gap-4 pointer-events-auto w-fit">
          <Link href={`/author/${encodeURIComponent(news.author)}`} className="flex items-center gap-4 hover:opacity-80 transition-opacity">
            <div className="w-10 h-10 rounded-full bg-gray-600 overflow-hidden relative">
              <Image
                src={news.authorImageUrl || `https://picsum.photos/seed/${encodeURIComponent(news.author)}/100/100`}
                alt={news.author}
                fill
                sizes="40px"
                className={news.authorImageUrl ? "object-contain p-1" : "object-cover"}
                referrerPolicy="no-referrer"
              />
            </div>
            <div>
              <p className="text-white font-medium">{news.author}</p>
              <p className="text-gray-400 text-sm">{news.readTime}</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
