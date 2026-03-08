import { getNewsByAuthor } from "@/lib/api";
import Header from "@/components/Header";
import CategoryBar from "@/components/CategoryBar";
import NewsCard from "@/components/NewsCard";
import Image from "next/image";
import { notFound } from "next/navigation";

export default async function AuthorPage({ params }: { params: Promise<{ name: string }> }) {
  const resolvedParams = await params;
  const authorName = decodeURIComponent(resolvedParams.name);
  
  const authorNews = await getNewsByAuthor(authorName);
  
  if (authorNews.length === 0) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans">
      <Header />
      <CategoryBar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold mb-8 pb-2 border-b-2 border-gray-900 inline-block">
            Articles by {authorName}
          </h2>
          <div className="flex flex-col gap-8">
            {authorNews.map((news) => (
              <NewsCard key={news.id} news={news} />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
