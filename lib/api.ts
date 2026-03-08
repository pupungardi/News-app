export interface NewsItem {
  id: string;
  title: string;
  summary: string;
  content: string;
  category: string;
  imageUrl?: string;
  author: string;
  authorImageUrl?: string;
  publishedAt: string;
  readTime: string;
  sourceUrl?: string;
}

export const categories = [
  "Terbaru",
  "Nasional",
  "Internasional",
  "Ekonomi",
  "Olahraga",
  "Teknologi",
  "Hiburan",
  "Gaya Hidup"
];

// Helper to generate a URL-friendly slug from a string
export function generateSlug(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');
}

export async function fetchNews(): Promise<NewsItem[]> {
  try {
    const sources = [
      { url: 'https://berita-indo-api.vercel.app/v1/cnn-news', name: 'CNN Indonesia', category: 'Berita', defaultImage: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/66/CNN_International_logo.svg/500px-CNN_International_logo.svg.png' },
      { url: 'https://berita-indo-api.vercel.app/v1/cnbc-news', name: 'CNBC Indonesia', category: 'Ekonomi', defaultImage: 'https://cdn.cnbcindonesia.com/cnbc/mobile/images/logo/2026/cnbc-logo.svg?v=6.9.0' },
      { url: 'https://berita-indo-api.vercel.app/v1/republika-news', name: 'Republika', category: 'Berita', defaultImage: 'https://static.republika.co.id/files/images/logo.png' },
      { url: 'https://berita-indo-api.vercel.app/v1/tempo-news', name: 'Tempo', category: 'Berita', defaultImage: 'https://ui-avatars.com/api/?name=Tempo&background=D32F2F&color=fff&size=512&font-size=0.33' },
      { url: 'https://berita-indo-api.vercel.app/v1/antara-news/terkini', name: 'Antara News', category: 'Berita', defaultImage: 'https://ui-avatars.com/api/?name=Antara+News&background=00468C&color=fff&size=512' },
      { url: 'https://berita-indo-api.vercel.app/v1/tribun-news', name: 'Tribun News', category: 'Berita', defaultImage: 'https://cdn2.tstatic.net/tribunnews/img/logo_tribunnews.png' },
      { url: 'https://berita-indo-api.vercel.app/v1/kumparan-news', name: 'Kumparan', category: 'Berita', defaultImage: 'https://is1-ssl.mzstatic.com/image/thumb/Purple211/v4/26/94/0b/26940b43-ba4f-0237-4929-afe1b59433cf/AppIconProd-0-0-1x_U007emarketing-0-11-0-85-220.png/1200x630wa.png' },
      { url: 'https://berita-indo-api.vercel.app/v1/okezone-news', name: 'Okezone', category: 'Berita', defaultImage: 'https://cdn.okezone.com/underwood/revamp/2023/img/logo/okezone.png' },
      { url: 'https://berita-indo-api.vercel.app/v1/bbc-news', name: 'BBC News', category: 'Internasional', defaultImage: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/62/BBC_News_2019.svg/1200px-BBC_News_2019.svg.png' },
      { url: 'https://berita-indo-api.vercel.app/v1/jawa-pos/terbaru', name: 'Jawa Pos', category: 'Berita', defaultImage: 'https://www.jawapos.com/wp-content/uploads/2023/02/logo-jawapos-2023.png' },
      { url: 'https://berita-indo-api.vercel.app/v1/vice', name: 'Vice Indonesia', category: 'Gaya Hidup', defaultImage: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f6/Vice_logo.svg/1200px-Vice_logo.svg.png' },
      { url: 'https://berita-indo-api.vercel.app/v1/suara', name: 'Suara', category: 'Berita', defaultImage: 'https://media.suara.com/suara/logo-suara.png' },
      { url: 'https://berita-indo-api.vercel.app/v1/voa', name: 'VOA Indonesia', category: 'Internasional', defaultImage: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/VOA_logo.svg/1200px-VOA_logo.svg.png' },
    ];

    const responses = await Promise.allSettled(
      sources.map(source => fetch(source.url, { next: { revalidate: 3600 } }).then(res => {
        if (!res.ok) throw new Error(`Failed to fetch ${source.name}`);
        return res.json().then(data => ({ source, data }));
      }))
    );

    let allNews: (NewsItem & { isoDate: string })[] = [];

    responses.forEach(res => {
      if (res.status === 'fulfilled' && res.value.data?.data && Array.isArray(res.value.data.data)) {
        const { source, data } = res.value;
        const newsItems = data.data
          .filter((item: any) => item.title !== 'Bank BJB Imbau Nasabah Waspada Penipuan Jelang Lebaran')
          .map((item: any) => {
          const id = generateSlug(`${source.name} ${item.title}`);
          const date = new Date(item.isoDate || item.pubDate || new Date());
          const formattedDate = date.toLocaleDateString('id-ID', {
            day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Jakarta'
          }) + ' WIB';
          
          // Map specific sources to their logos as requested
          const sourceLogos: Record<string, string> = {
            "CNN Indonesia": "https://upload.wikimedia.org/wikipedia/commons/thumb/6/66/CNN_International_logo.svg/500px-CNN_International_logo.svg.png",
            "CNBC Indonesia": "https://cdn.cnbcindonesia.com/cnbc/mobile/images/logo/2026/cnbc-logo.svg?v=6.9.0",
            "Kumparan": "https://is1-ssl.mzstatic.com/image/thumb/Purple211/v4/26/94/0b/26940b43-ba4f-0237-4929-afe1b59433cf/AppIconProd-0-0-1x_U007emarketing-0-11-0-85-220.png/1200x630wa.png"
          };

          const imageUrl = sourceLogos[source.name] || "";

          const summary = item.contentSnippet || item.description || item.content || item.title;
          
          return {
            id,
            title: item.title,
            summary: summary,
            content: summary + "\n\nUntuk membaca berita selengkapnya, silakan kunjungi sumber aslinya melalui tautan di bawah.",
            category: source.category,
            imageUrl: imageUrl,
            author: source.name,
            authorImageUrl: source.defaultImage,
            publishedAt: formattedDate,
            readTime: "3 min read",
            sourceUrl: item.link,
            isoDate: item.isoDate || item.pubDate || date.toISOString()
          };
        });
        allNews = [...allNews, ...newsItems];
      }
    });

    // Sort by date descending
    allNews.sort((a, b) => new Date(b.isoDate).getTime() - new Date(a.isoDate).getTime());

    return allNews;
  } catch (error) {
    console.error("Error fetching news:", error);
    return [];
  }
}

export async function getNewsById(id: string): Promise<NewsItem | undefined> {
  const allNews = await fetchNews();
  return allNews.find(news => news.id === id);
}

export async function getNewsByAuthor(author: string): Promise<NewsItem[]> {
  const allNews = await fetchNews();
  return allNews.filter(news => news.author === author);
}
