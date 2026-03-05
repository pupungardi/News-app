"use client";

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import Hls from 'hls.js';
import { motion } from 'motion/react';
import { 
  ChevronLeft, Tv, RefreshCw, Share2, 
  Maximize2, Volume2, VolumeX, Play, Pause
} from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

// Dynamic import to prevent SSR issues with react-player
const ReactPlayer = dynamic(() => import('react-player'), { ssr: false });

const CHANNELS = [
  {
    id: 'cnn',
    name: 'CNN Indonesia TV',
    description: 'Tonton berita terbaru, analisis mendalam, dan laporan eksklusif dari seluruh Indonesia dan dunia melalui siaran langsung CNN Indonesia TV.',
    url: '/api/proxy/cnn/livecnn/smil:cnntv.smil/playlist.m3u8',
    color: 'bg-red-600',
    textColor: 'text-white',
    shortName: 'CNN'
  },
  {
    id: 'cnbc',
    name: 'CNBC Indonesia TV',
    description: 'Tonton berita bisnis, ekonomi, dan pasar modal terbaru dari Indonesia dan dunia melalui siaran langsung CNBC Indonesia TV.',
    url: '/api/proxy/cnbc/livecnbc/smil:cnbctv.smil/chunklist_w1060284963_b384000_sleng.m3u8',
    color: 'bg-white',
    textColor: 'text-black',
    shortName: 'CNBC'
  },
  {
    id: 'transtv',
    name: 'TRANS TV',
    description: 'Tonton program hiburan, film, dan acara realitas terbaik dari TRANS TV.',
    url: '/api/proxy/transtv/transtv/smil:transtv.smil/playlist.m3u8',
    color: 'bg-blue-600',
    textColor: 'text-white',
    shortName: 'TRNS'
  },
  {
    id: 'trans7',
    name: 'Trans 7 TV',
    description: 'Nikmati ragam program edukasi, komedi, dan hiburan keluarga dari Trans 7.',
    url: '/api/proxy/trans7/trans7/smil:trans7.smil/playlist.m3u8',
    color: 'bg-blue-500',
    textColor: 'text-white',
    shortName: 'TRN7'
  },
  {
    id: 'indonesiana',
    name: 'Indonesiana TV',
    description: 'Saluran televisi yang menayangkan program-program kebudayaan dan tradisi Indonesia.',
    url: '/api/proxy/indonesiana/indonesiana.m3u8',
    color: 'bg-green-600',
    textColor: 'text-white',
    shortName: 'INDO'
  }
];

export default function LiveTVPage() {
  const [activeChannelId, setActiveChannelId] = useState('cnn');
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const activeChannel = CHANNELS.find(c => c.id === activeChannelId) || CHANNELS[0];

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    if (!isReady && !error) {
      timeout = setTimeout(() => {
        setError("Koneksi ke siaran memakan waktu terlalu lama. Silakan periksa koneksi internet Anda atau coba lagi nanti.");
      }, 30000); // 30 seconds timeout
    }
    return () => clearTimeout(timeout);
  }, [isReady, error, activeChannelId]);

  const handleChannelSwitch = (channelId: string) => {
    if (channelId === activeChannelId) return;
    setActiveChannelId(channelId);
    setIsReady(false);
    setError(null);
    setIsPlaying(false);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: activeChannel.name,
          text: `Tonton siaran langsung ${activeChannel.name} sekarang!`,
          url: window.location.href,
        });
      } catch (err) {
        console.error('Error sharing:', err);
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link disalin ke papan klip!');
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white selection:bg-indigo-500/30">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Link 
            href="/"
            className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors font-medium"
          >
            <ChevronLeft className="h-5 w-5" />
            Kembali ke Berita
          </Link>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-red-600/10 border border-red-600/20 rounded-full">
              <div className="w-2 h-2 rounded-full bg-red-600 animate-pulse" />
              <span className="text-xs font-bold uppercase tracking-wider text-red-600">LIVE</span>
            </div>
            <button 
              onClick={handleShare}
              className="p-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white transition-all"
            >
              <Share2 className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-3 space-y-6">
            {/* Player Container */}
            <div className="relative aspect-video w-full bg-black rounded-3xl overflow-hidden shadow-2xl shadow-indigo-500/5 border border-zinc-800">
              {!isReady && !error && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-zinc-900 z-10">
                  <RefreshCw className="h-10 w-10 animate-spin text-indigo-500 mb-4" />
                  <p className="text-zinc-400 font-medium">Menghubungkan ke siaran...</p>
                </div>
              )}

              {error && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-zinc-900 z-10 px-8 text-center">
                  <div className="p-4 rounded-full bg-red-500/10 text-red-500 mb-4">
                    <Tv className="h-10 w-10" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Gagal Memuat Siaran</h3>
                  <p className="text-zinc-500 mb-6">{error}</p>
                  <button 
                    onClick={() => window.location.reload()}
                    className="px-6 py-2.5 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 transition-all"
                  >
                    Coba Lagi
                  </button>
                </div>
              )}

              <ReactPlayer
                key={activeChannel.url}
                src={typeof window !== 'undefined' ? `${window.location.origin}${activeChannel.url}` : activeChannel.url}
                playing={isPlaying}
                muted={isMuted}
                playsInline={true}
                width="100%"
                height="100%"
                onReady={() => {
                  setIsReady(true);
                  setIsPlaying(true);
                }}
                onStart={() => setIsReady(true)}
                onPlay={() => setIsReady(true)}
                onError={(e: any) => {
                  console.error('Player error:', e);
                  // Ignore harmless AbortError caused by rapid play/pause or unmounting
                  if (e?.name === 'AbortError' || String(e).includes('interrupted by a call to pause') || e?.message?.includes('interrupted by a call to pause')) {
                    return;
                  }
                  // Ignore non-fatal hls.js errors
                  if (e && typeof e === 'object' && e.fatal === false) {
                    return;
                  }
                  setError("Siaran tidak dapat dimuat saat ini. Silakan coba lagi nanti.");
                }}
                config={{
                  hls: {
                    xhrSetup: (xhr: XMLHttpRequest, url: string) => {
                      xhr.withCredentials = true;
                    }
                  }
                }}
              />

              {/* Custom Controls Overlay */}
              {isReady && !error && (
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <button 
                        onClick={() => setIsPlaying(!isPlaying)}
                        className="p-3 rounded-full bg-white/10 backdrop-blur-md hover:bg-white/20 transition-all"
                      >
                        {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6" />}
                      </button>
                      <button 
                        onClick={() => setIsMuted(!isMuted)}
                        className="p-3 rounded-full bg-white/10 backdrop-blur-md hover:bg-white/20 transition-all"
                      >
                        {isMuted ? <VolumeX className="h-6 w-6" /> : <Volume2 className="h-6 w-6" />}
                      </button>
                    </div>
                    <button className="p-3 rounded-full bg-white/10 backdrop-blur-md hover:bg-white/20 transition-all">
                      <Maximize2 className="h-6 w-6" />
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Info Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className={cn("relative w-12 h-12 rounded-2xl flex items-center justify-center p-2 overflow-hidden", activeChannel.color)}>
                  <span className={cn("font-bold text-xs tracking-tighter", activeChannel.textColor)}>{activeChannel.shortName}</span>
                </div>
                <div>
                  <h1 className="text-2xl font-serif font-bold">{activeChannel.name}</h1>
                  <p className="text-zinc-500 text-sm">Siaran Langsung 24 Jam</p>
                </div>
              </div>
              <p className="text-zinc-400 leading-relaxed">
                {activeChannel.description}
              </p>
            </div>
          </div>

          {/* Sidebar / Recommendations */}
          <div className="lg:col-span-1 space-y-6">
            <h3 className="text-lg font-bold flex items-center gap-2">
              <Tv className="h-5 w-5 text-indigo-500" />
              Siaran Lainnya
            </h3>
            <div className="space-y-4">
              {CHANNELS.map((channel) => (
                <button
                  key={channel.id}
                  onClick={() => handleChannelSwitch(channel.id)}
                  className={cn(
                    "w-full text-left p-4 rounded-2xl border transition-all",
                    activeChannelId === channel.id 
                      ? "bg-indigo-500/10 border-indigo-500/50" 
                      : "bg-zinc-900 border-zinc-800 hover:border-zinc-700"
                  )}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center", channel.color)}>
                      <span className={cn("font-bold text-[10px] tracking-tighter", channel.textColor)}>{channel.shortName}</span>
                    </div>
                    <div>
                      <p className="text-sm font-bold">{channel.name}</p>
                      {activeChannelId === channel.id && (
                        <p className="text-xs text-indigo-400 font-medium">Sedang ditonton</p>
                      )}
                    </div>
                  </div>
                </button>
              ))}
              <div className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800 opacity-50 cursor-not-allowed">
                <div className="aspect-video bg-zinc-800 rounded-xl mb-3 flex items-center justify-center">
                  <Tv className="h-6 w-6 text-zinc-600" />
                </div>
                <p className="text-sm font-bold">Metro TV</p>
                <p className="text-xs text-zinc-500">Segera hadir</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
