import { getNewsById } from "@/lib/api";
import { notFound } from "next/navigation";
import Image from "next/image";
import Header from "@/components/Header";
import CategoryBar from "@/components/CategoryBar";
import Link from "next/link";
import { ArrowLeft, Share2, BookmarkPlus, MessageCircle, ExternalLink } from "lucide-react";

export default async function NewsDetail({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const newsItem = await getNewsById(resolvedParams.id);

  if (!newsItem) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans">
      <Header />
      <CategoryBar />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <Link href="/" className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Kembali ke Beranda
        </Link>
        
        <article>
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-6">
              <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-bold uppercase tracking-wider rounded-full">
                {newsItem.category}
              </span>
              <span className="text-gray-500 text-sm font-medium">
                {newsItem.publishedAt}
              </span>
              <span className="text-gray-300">•</span>
              <span className="text-gray-500 text-sm font-medium">
                {newsItem.readTime}
              </span>
            </div>
            
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight">
              {newsItem.title}
            </h1>
            
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              {newsItem.summary}
            </p>
            
            <div className="flex items-center justify-between py-6 border-y border-gray-200 mb-8">
              <div className="flex items-center gap-4">
                <Link href={`/author/${encodeURIComponent(newsItem.author)}`} className="flex items-center gap-4 hover:opacity-80 transition-opacity">
                  <div className="w-12 h-12 rounded-full bg-gray-200 overflow-hidden relative">
                    <Image
                      src={newsItem.authorImageUrl || `https://picsum.photos/seed/${encodeURIComponent(newsItem.author)}/100/100`}
                      alt={newsItem.author}
                      fill
                      sizes="48px"
                      className={newsItem.authorImageUrl ? "object-contain p-1" : "object-cover"}
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div>
                    <p className="font-bold text-gray-900">{newsItem.author}</p>
                    <p className="text-gray-500 text-sm">Staff Writer</p>
                  </div>
                </Link>
              </div>
              
              <div className="flex items-center gap-2 sm:gap-4">
                <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-full transition-colors" aria-label="Share">
                  <Share2 className="w-5 h-5" />
                </button>
                <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-full transition-colors" aria-label="Save">
                  <BookmarkPlus className="w-5 h-5" />
                </button>
                <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-full transition-colors" aria-label="Comment">
                  <MessageCircle className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
          
          {newsItem.imageUrl && (
            <div className="relative w-full h-[200px] sm:h-[300px] lg:h-[400px] rounded-2xl overflow-hidden mb-12 bg-gray-50 border border-gray-100 flex items-center justify-center p-8 sm:p-16">
              <div className="relative w-full h-full">
                <Image
                  src={newsItem.imageUrl}
                  alt={newsItem.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 896px"
                  className="object-contain"
                  referrerPolicy="no-referrer"
                  priority
                />
              </div>
            </div>
          )}
          
          <div className="prose prose-lg prose-blue max-w-none">
            {newsItem.content.split('\n\n').map((paragraph, index) => (
              <p key={index} className="mb-6 text-gray-800 leading-relaxed text-lg">
                {paragraph}
              </p>
            ))}
            
            {newsItem.sourceUrl && (
              <div className="mt-12 p-6 bg-gray-50 rounded-xl border border-gray-200">
                <h3 className="text-lg font-bold mb-2">Baca Selengkapnya</h3>
                <p className="text-gray-600 mb-4">Artikel ini adalah ringkasan. Untuk membaca berita selengkapnya, silakan kunjungi sumber aslinya.</p>
                <a 
                  href={newsItem.sourceUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Buka di {newsItem.author}
                  <ExternalLink className="w-4 h-4 ml-2" />
                </a>
              </div>
            )}
          </div>
        </article>
      </main>
    </div>
  );
}
