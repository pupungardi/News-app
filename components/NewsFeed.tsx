'use client';

import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  RefreshCw, AlertCircle, Clock, ExternalLink, Search, Heart, X, Share2, 
  History, ChevronRight, Trash2, Filter, ChevronDown, User, Tv
} from 'lucide-react';
import { useRef, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';

const SOURCES = [
  { name: 'CNN Indonesia', endpoint: 'cnn-news' },
  { name: 'CNBC Indonesia', endpoint: 'cnbc-news' },
  { name: 'Republika', endpoint: 'republika-news' },
  { name: 'Tempo', endpoint: 'tempo-news' },
  { name: 'Antara', endpoint: 'antara-news' },
  { name: 'Kumparan', endpoint: 'kumparan-news' },
  { name: 'Okezone', endpoint: 'okezone-news' },
  { name: 'BBC', endpoint: 'bbc-news' },
  { name: 'Tribun', endpoint: 'tribun-news' },
  { name: 'Vice', endpoint: 'vice' },
  { name: 'Suara', endpoint: 'suara' },
  { name: 'VOA', endpoint: 'voa' },
];

interface NewsArticle {
  title: string;
  summary: string;
  source: string;
  url: string;
  imageUrl: string;
  publishedAt: string;
}

export default function NewsFeed() {
  const [activeSource, setActiveSource] = useState(SOURCES[0]);
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentDate, setCurrentDate] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [favorites, setFavorites] = useState<NewsArticle[]>([]);
  const [history, setHistory] = useState<NewsArticle[]>([]);
  const [viewMode, setViewMode] = useState<'all' | 'favorites' | 'history'>('all');
  const [showSourceDropdown, setShowSourceDropdown] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userAvatar, setUserAvatar] = useState('https://picsum.photos/seed/user/200/200');
  
  const observer = useRef<IntersectionObserver | null>(null);
  const fetchNews = useCallback(async (source: typeof SOURCES[0], isAppend = false) => {
    if (isAppend) setLoadingMore(true);
    else setLoading(true);
    
    setError(null);
    try {
      const endpoint = source.endpoint;
      const response = await fetch(`/api/news?endpoint=${endpoint}`);
      if (!response.ok) {
        throw new Error('Failed to fetch news from API');
      }
      
      const json = await response.json();
      const data = json.data || [];
      
      const processedArticles: NewsArticle[] = data.map((item: any) => {
        // Handle different image formats from the API
        let imgUrl = '';
        if (typeof item.image === 'string') {
          imgUrl = item.image;
        } else if (item.image?.large) {
          imgUrl = item.image.large;
        } else if (item.image?.small) {
          imgUrl = item.image.small;
        } else if (item.thumbnail) {
          imgUrl = item.thumbnail;
        }

        if (!imgUrl) {
          const seed = encodeURIComponent(item.title.substring(0, 20));
          imgUrl = `https://picsum.photos/seed/${seed}/800/450`;
        }

        // Format date
        let formattedDate = 'Baru saja';
        if (item.isoDate || item.pubDate) {
          const date = new Date(item.isoDate || item.pubDate);
          formattedDate = date.toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          });
        }

        return {
          title: item.title,
          summary: item.contentSnippet || item.description || 'Tidak ada ringkasan tersedia.',
          source: source.name,
          url: item.link,
          imageUrl: imgUrl,
          publishedAt: formattedDate,
        };
      });

      if (isAppend) {
        setArticles(prev => {
          const existingUrls = new Set(prev.map(a => a.url));
          const newArticles = processedArticles.filter(a => !existingUrls.has(a.url));
          return [...prev, ...newArticles.slice(0, 10)];
        });
      } else {
        setArticles(processedArticles.slice(0, 15));
      }
    } catch (err: any) {
      console.error('Error fetching news:', err);
      setError(err.message || 'Gagal mengambil berita. Silakan coba lagi.');
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, []);

  const loadMoreNews = useCallback(() => {
    if (loadingMore) return;
    fetchNews(activeSource, true);
  }, [activeSource, fetchNews, loadingMore]);

  const lastArticleRef = useCallback((node: HTMLElement | null) => {
    if (loading || loadingMore) return;
    if (observer.current) observer.current.disconnect();
    
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && viewMode === 'all' && !searchQuery) {
        loadMoreNews();
      }
    });
    
    if (node) observer.current.observe(node);
  }, [loading, loadingMore, viewMode, searchQuery, loadMoreNews]);

  useEffect(() => {
    setCurrentDate(new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }));
    
    // Load data from localStorage
    const savedFavorites = localStorage.getItem('news-favorites');
    const savedHistory = localStorage.getItem('news-history');
    
    if (savedFavorites) {
      try { setFavorites(JSON.parse(savedFavorites)); } catch (e) { console.error(e); }
    }
    if (savedHistory) {
      try { setHistory(JSON.parse(savedHistory)); } catch (e) { console.error(e); }
    }

    const loggedIn = localStorage.getItem('isLoggedIn') === 'true';
    setIsLoggedIn(loggedIn);
  }, []);

  useEffect(() => {
    localStorage.setItem('news-favorites', JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    localStorage.setItem('news-history', JSON.stringify(history));
  }, [history]);

  const toggleFavorite = (e: React.MouseEvent, article: NewsArticle) => {
    e.stopPropagation();
    setFavorites(prev => {
      const isFavorited = prev.some(fav => fav.url === article.url);
      if (isFavorited) {
        return prev.filter(fav => fav.url !== article.url);
      } else {
        return [...prev, article];
      }
    });
  };

  const addToHistory = (article: NewsArticle) => {
    setHistory(prev => {
      const filtered = prev.filter(item => item.url !== article.url);
      return [article, ...filtered].slice(0, 50); // Keep last 50
    });
    window.open(article.url, '_blank');
  };

  const handleShare = async (e: React.MouseEvent, article: NewsArticle) => {
    e.stopPropagation();
    if (navigator.share) {
      try {
        await navigator.share({
          title: article.title,
          text: article.summary,
          url: article.url,
        });
      } catch (err) {
        console.error('Error sharing:', err);
      }
    } else {
      try {
        await navigator.clipboard.writeText(article.url);
        alert('Link disalin ke papan klip!');
      } catch (err) {
        console.error('Failed to copy link:', err);
      }
    }
  };

  const clearHistory = () => {
    if (confirm('Hapus semua riwayat baca?')) {
      setHistory([]);
    }
  };

  const isArticleFavorited = (url: string) => {
    return favorites.some(fav => fav.url === url);
  };

  useEffect(() => {
    fetchNews(activeSource);
  }, [activeSource, fetchNews]);

  const getSourceArticles = () => {
    if (viewMode === 'favorites') return favorites;
    if (viewMode === 'history') return history;
    return articles;
  };

  const filteredArticles = getSourceArticles().filter(article => 
    article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    article.summary.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <header className="mb-12 border-b border-gray-200 pb-8">
        <div className="flex items-center justify-between mb-10">
          <div className="flex-1 lg:hidden">
            {/* Placeholder to balance the profile icon on mobile */}
            <div className="w-10" />
          </div>
          
          <div className="flex flex-col items-center text-center">
            <h1 className="font-serif text-5xl md:text-7xl font-bold tracking-tight text-gray-900 mb-3">
              News Today
            </h1>
            <p className="text-gray-500 font-medium tracking-wide uppercase text-sm">
              {currentDate}
            </p>
          </div>

          <div className="flex-1 flex justify-end lg:hidden">
            <Link 
              href="/profile"
              className="relative w-10 h-10 rounded-full overflow-hidden border border-gray-200 shadow-sm hover:ring-2 hover:ring-indigo-500/20 transition-all"
            >
              {isLoggedIn ? (
                <Image 
                  src={userAvatar} 
                  alt="Profile" 
                  fill 
                  sizes="40px"
                  className="object-cover"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="w-full h-full bg-gray-50 flex items-center justify-center text-gray-400">
                  <User className="h-5 w-5" />
                </div>
              )}
            </Link>
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="w-full md:w-auto flex-1 max-w-md">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Cari berita..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-sm"
              />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>
          
          <div className="flex items-center gap-3 w-full md:w-auto justify-center">
            <button
              onClick={() => setViewMode(viewMode === 'favorites' ? 'all' : 'favorites')}
              className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 rounded-2xl font-medium transition-all text-sm border ${
                viewMode === 'favorites'
                  ? 'bg-indigo-600 text-white border-indigo-600 shadow-lg shadow-indigo-200'
                  : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
              }`}
            >
              <Heart className={`h-4 w-4 ${viewMode === 'favorites' ? 'fill-current' : ''}`} />
              <span>Favorit</span>
            </button>

            <button
              onClick={() => setViewMode(viewMode === 'history' ? 'all' : 'history')}
              className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 rounded-2xl font-medium transition-all text-sm border ${
                viewMode === 'history'
                  ? 'bg-indigo-600 text-white border-indigo-600 shadow-lg shadow-indigo-200'
                  : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
              }`}
            >
              <History className="h-4 w-4" />
              <span>Riwayat</span>
            </button>

            <Link
              href="/live"
              className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 rounded-2xl font-bold transition-all text-sm border bg-red-600 text-white border-red-600 shadow-lg shadow-red-100 hover:bg-red-700"
            >
              <Tv className="h-4 w-4" />
              <span>Live TV</span>
            </Link>
            
            <Link 
              href="/profile"
              className="hidden lg:flex relative w-11 h-11 rounded-full overflow-hidden border border-gray-200 shadow-sm hover:ring-2 hover:ring-indigo-500/20 transition-all"
            >
              {isLoggedIn ? (
                <Image 
                  src={userAvatar} 
                  alt="Profile" 
                  fill 
                  sizes="44px"
                  className="object-cover"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="w-full h-full bg-gray-50 flex items-center justify-center text-gray-400">
                  <User className="h-5 w-5" />
                </div>
              )}
            </Link>
          </div>
        </div>

        {viewMode === 'all' && (
          <div className="space-y-6 mt-8">
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <div className="relative inline-block text-left">
                <button
                  onClick={() => setShowSourceDropdown(!showSourceDropdown)}
                  className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-all shadow-sm"
                >
                  <Filter className="h-4 w-4 text-indigo-600" />
                  Sumber: <span className="text-indigo-600">{activeSource.name}</span>
                  <ChevronDown className={`h-4 w-4 transition-transform ${showSourceDropdown ? 'rotate-180' : ''}`} />
                </button>

                {showSourceDropdown && (
                  <>
                    <div 
                      className="fixed inset-0 z-20" 
                      onClick={() => setShowSourceDropdown(false)} 
                    />
                    <div className="absolute left-0 mt-2 w-56 rounded-xl bg-white shadow-xl border border-gray-100 ring-1 ring-black ring-opacity-5 z-30 overflow-hidden">
                      <div className="py-1 max-h-80 overflow-y-auto scrollbar-hide">
                        {SOURCES.map((source) => (
                          <button
                            key={source.name}
                            onClick={() => {
                              setActiveSource(source);
                              setShowSourceDropdown(false);
                            }}
                            className={`flex items-center w-full px-4 py-2.5 text-sm transition-colors ${
                              activeSource.name === source.name
                                ? 'bg-indigo-50 text-indigo-700 font-semibold'
                                : 'text-gray-700 hover:bg-gray-50'
                            }`}
                          >
                            {source.name}
                          </button>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        )}

        {viewMode === 'history' && history.length > 0 && (
          <div className="flex justify-end mb-6">
            <button
              onClick={clearHistory}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-xl transition-colors"
            >
              <Trash2 className="h-4 w-4" />
              Hapus Semua Riwayat
            </button>
          </div>
        )}
      </header>

      <main>
        {loading && viewMode === 'all' ? (
          <div className="flex flex-col items-center justify-center py-20">
            <RefreshCw className="h-8 w-8 animate-spin text-gray-400 mb-4" />
            <p className="text-gray-500 font-medium animate-pulse">Mengambil berita terbaru...</p>
          </div>
        ) : error && viewMode === 'all' ? (
          <div className="bg-red-50 border border-red-100 rounded-2xl p-8 text-center max-w-2xl mx-auto">
            <AlertCircle className="h-10 w-10 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-red-900 mb-2">Gagal memuat berita</h3>
            <p className="text-red-600 mb-6">{error}</p>
            <button
              onClick={() => fetchNews(activeSource)}
              className="px-6 py-2 bg-red-100 text-red-700 rounded-full font-medium hover:bg-red-200 transition-colors"
            >
              Coba Lagi
            </button>
          </div>
        ) : filteredArticles.length === 0 ? (
          <div className="text-center py-20 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
            <p className="text-gray-500 text-lg">
              {viewMode === 'favorites' 
                ? 'Belum ada berita favorit.' 
                : viewMode === 'history'
                  ? 'Belum ada riwayat baca.'
                  : searchQuery 
                    ? `Tidak ada hasil untuk "${searchQuery}"`
                    : 'Tidak ada artikel ditemukan.'}
            </p>
            {viewMode !== 'all' && (
              <button 
                onClick={() => setViewMode('all')}
                className="mt-4 text-indigo-600 font-medium hover:underline"
              >
                Kembali ke Berita Utama
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Featured Article */}
            {filteredArticles.length > 0 && viewMode === 'all' && !searchQuery && (
              <motion.article 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="col-span-1 md:col-span-2 lg:col-span-2 group cursor-pointer flex flex-col"
                onClick={() => addToHistory(filteredArticles[0])}
              >
                <div className="relative w-full aspect-video md:aspect-[2/1] rounded-2xl overflow-hidden mb-4 bg-gray-200">
                  <Image
                    src={filteredArticles[0].imageUrl}
                    alt={filteredArticles[0].title}
                    fill
                    priority
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 100vw, 800px"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  
                  <div className="absolute top-4 right-4 flex gap-2 z-10">
                    <button
                      onClick={(e) => handleShare(e, filteredArticles[0])}
                      className="p-3 rounded-full bg-white/90 backdrop-blur-sm shadow-lg hover:scale-110 transition-all"
                    >
                      <Share2 className="h-5 w-5 text-gray-600" />
                    </button>
                    <button
                      onClick={(e) => toggleFavorite(e, filteredArticles[0])}
                      className="p-3 rounded-full bg-white/90 backdrop-blur-sm shadow-lg hover:scale-110 transition-all"
                    >
                      <Heart className={`h-5 w-5 ${isArticleFavorited(filteredArticles[0].url) ? 'fill-red-500 text-red-500' : 'text-gray-400'}`} />
                    </button>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                  <span className="text-indigo-600">{filteredArticles[0].source}</span>
                  <span>&bull;</span>
                  <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {filteredArticles[0].publishedAt}</span>
                </div>
                <h2 className="font-serif text-3xl md:text-4xl font-bold text-gray-900 leading-tight mb-3 group-hover:text-indigo-600 transition-colors">
                  {filteredArticles[0].title}
                </h2>
                <p className="text-gray-600 text-lg leading-relaxed line-clamp-3">
                  {filteredArticles[0].summary}
                </p>
              </motion.article>
            )}

            {/* Rest of the articles */}
            {(viewMode === 'all' && !searchQuery ? filteredArticles.slice(1) : filteredArticles).map((article, index) => (
              <motion.article
                key={article.url + index}
                ref={index === filteredArticles.length - 1 ? lastArticleRef : null}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: (index % 10) * 0.05 }}
                className="group cursor-pointer flex flex-col"
                onClick={() => addToHistory(article)}
              >
                <div className="relative w-full aspect-[3/2] rounded-xl overflow-hidden mb-4 bg-gray-200">
                  <Image
                    src={article.imageUrl}
                    alt={article.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    referrerPolicy="no-referrer"
                  />
                  
                  <div className="absolute top-3 right-3 flex gap-2 z-10">
                    <button
                      onClick={(e) => handleShare(e, article)}
                      className="p-2 rounded-full bg-white/90 backdrop-blur-sm shadow-md hover:scale-110 transition-all"
                    >
                      <Share2 className="h-4 w-4 text-gray-600" />
                    </button>
                    <button
                      onClick={(e) => toggleFavorite(e, article)}
                      className="p-2 rounded-full bg-white/90 backdrop-blur-sm shadow-md hover:scale-110 transition-all"
                    >
                      <Heart className={`h-4 w-4 ${isArticleFavorited(article.url) ? 'fill-red-500 text-red-500' : 'text-gray-400'}`} />
                    </button>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                  <span className="text-indigo-600 truncate max-w-[120px]">{article.source}</span>
                  <span>&bull;</span>
                  <span className="flex items-center gap-1 whitespace-nowrap"><Clock className="w-3 h-3" /> {article.publishedAt}</span>
                </div>
                <h3 className="font-serif text-xl font-bold text-gray-900 leading-snug mb-2 group-hover:text-indigo-600 transition-colors line-clamp-3">
                  {article.title}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed line-clamp-2 mt-auto">
                  {article.summary}
                </p>
              </motion.article>
            ))}
          </div>
        )}

        {loadingMore && (
          <div className="flex justify-center py-12">
            <RefreshCw className="h-6 w-6 animate-spin text-indigo-600" />
          </div>
        )}
      </main>

      <footer className="mt-20 pt-8 border-t border-gray-200 text-center text-gray-500 text-sm">
        <p>Powered by Berita Indo API</p>
      </footer>
    </div>
  );
}
