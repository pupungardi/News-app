import Header from "@/components/Header";
import CategoryBar from "@/components/CategoryBar";
import HeroNews from "@/components/HeroNews";
import NewsCard from "@/components/NewsCard";
import { fetchNews } from "@/lib/api";
import Link from "next/link";

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const resolvedSearchParams = await searchParams;
  const q = typeof resolvedSearchParams.q === 'string' ? resolvedSearchParams.q : '';
  const category = typeof resolvedSearchParams.category === 'string' ? resolvedSearchParams.category : '';
  
  let allNews = await fetchNews();
  
  if (q) {
    allNews = allNews.filter(news => 
      (news.title?.toLowerCase() || '').includes(q.toLowerCase()) || 
      (news.summary?.toLowerCase() || '').includes(q.toLowerCase())
    );
  }

  if (category && category !== 'Terbaru') {
    allNews = allNews.filter(news => news.category === category);
  }
  
  if (!allNews || allNews.length === 0) {
    return (
      <div className="min-h-screen bg-white text-gray-900 font-sans flex flex-col">
        <Header />
        <CategoryBar />
        <main className="flex-1 flex items-center justify-center">
          <p className="text-xl text-gray-500">
            {q ? `Tidak ada berita yang ditemukan untuk pencarian "${q}".` : 
             category && category !== 'Terbaru' ? `Tidak ada berita untuk kategori "${category}".` : 
             "Gagal memuat berita. Silakan coba lagi nanti."}
          </p>
        </main>
      </div>
    );
  }

  const heroNews = allNews[0];
  const otherNews = allNews.slice(1, 15); // Limit to a reasonable number

  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans">
      <Header />
      <CategoryBar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <HeroNews news={heroNews} />
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold mb-6 pb-2 border-b-2 border-gray-900 inline-block">
              Top Stories
            </h2>
            <div className="flex flex-col gap-8">
              {otherNews.map((news) => (
                <NewsCard key={news.id} news={news} />
              ))}
            </div>
          </div>
          
          <div className="lg:col-span-1">
            <div className="sticky top-32">
              <h3 className="text-xl font-bold mb-6 pb-2 border-b border-gray-200">
                Trending Now
              </h3>
              <div className="flex flex-col gap-6">
                {otherNews.slice(0, 5).map((news, index) => (
                  <Link href={`/news/${news.id}`} key={news.id} className="flex gap-4 group cursor-pointer">
                    <span className="text-4xl font-black text-gray-200 group-hover:text-blue-200 transition-colors">
                      0{index + 1}
                    </span>
                    <div>
                      <h4 className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2 mb-1">
                        {news.title}
                      </h4>
                      <p className="text-xs text-gray-500">{news.publishedAt}</p>
                    </div>
                  </Link>
                ))}
              </div>
              
              <div className="mt-12 p-6 bg-gray-50 rounded-2xl border border-gray-100">
                <h3 className="font-bold text-lg mb-2">Subscribe to our newsletter</h3>
                <p className="text-gray-600 text-sm mb-4">Get the latest news delivered straight to your inbox daily.</p>
                <input 
                  type="email" 
                  placeholder="Your email address" 
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 mb-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button className="w-full bg-blue-600 text-white font-bold py-2 rounded-lg hover:bg-blue-700 transition-colors">
                  Subscribe
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
