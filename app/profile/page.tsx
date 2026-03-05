'use client';

import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  User, Mail, Calendar, MapPin, Shield, Bell, 
  ChevronLeft, Camera, Settings, LogOut, Heart, History
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export default function ProfilePage() {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);
  const [user, setUser] = useState({
    name: 'User News',
    email: 'user@newstoday.com',
    joinDate: 'Maret 2024',
    location: 'Jakarta, Indonesia',
    bio: 'Penggemar berita teknologi dan ekonomi global. Selalu mencari perspektif baru setiap hari.',
    avatar: 'https://picsum.photos/seed/user/200/200'
  });

  const [stats, setStats] = useState({
    favorites: 0,
    history: 0
  });

  useEffect(() => {
    const loggedIn = localStorage.getItem('isLoggedIn') === 'true';
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsLoggedIn(loggedIn);

    const favorites = JSON.parse(localStorage.getItem('news-favorites') || '[]');
    const history = JSON.parse(localStorage.getItem('news-history') || '[]');
    setStats({
      favorites: favorites.length,
      history: history.length
    });
  }, []);

  const handleLogin = () => {
    localStorage.setItem('isLoggedIn', 'true');
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    setIsLoggedIn(false);
  };

  if (isLoggedIn === null) return null; // Loading state

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md w-full bg-white rounded-3xl border border-gray-200 shadow-xl p-8 text-center"
        >
          <div className="w-20 h-20 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <User className="h-10 w-10" />
          </div>
          <h1 className="text-3xl font-serif font-bold text-gray-900 mb-4">Akses Terbatas</h1>
          <p className="text-gray-600 mb-8 leading-relaxed">
            Silakan masuk atau daftar terlebih dahulu untuk melihat informasi akun, favorit, dan riwayat baca Anda.
          </p>
          <div className="space-y-4">
            <Link 
              href="/login"
              className="block w-full py-4 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 text-center"
            >
              Masuk Sekarang
            </Link>
            <Link 
              href="/daftar"
              className="block w-full py-4 bg-white text-gray-700 border border-gray-200 rounded-2xl font-bold hover:bg-gray-50 transition-all text-center"
            >
              Daftar Akun Baru
            </Link>
          </div>
          <Link 
            href="/"
            className="inline-block mt-8 text-indigo-600 font-medium hover:underline"
          >
            Kembali ke Beranda
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Link 
            href="/"
            className="flex items-center gap-2 text-gray-600 hover:text-indigo-600 transition-colors font-medium"
          >
            <ChevronLeft className="h-5 w-5" />
            Kembali ke Berita
          </Link>
          <div className="flex gap-2">
            <Link href="/settings" className="p-2 rounded-xl bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 transition-all">
              <Settings className="h-5 w-5" />
            </Link>
          </div>
        </div>

        {/* Profile Card */}
        <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden mb-8">
          <div className="h-32 bg-gradient-to-r from-indigo-500 to-purple-600" />
          <div className="px-8 pb-8">
            <div className="relative -mt-16 mb-6 flex justify-between items-end">
              <div className="relative">
                <div className="w-32 h-32 rounded-full border-4 border-white overflow-hidden bg-gray-100 shadow-lg">
                  <Image 
                    src={user.avatar} 
                    alt={user.name}
                    fill
                    sizes="128px"
                    className="object-cover"
                  />
                </div>
                <button className="absolute bottom-0 right-0 p-2 rounded-full bg-indigo-600 text-white shadow-lg hover:bg-indigo-700 transition-all">
                  <Camera className="h-4 w-4" />
                </button>
              </div>
              <button className="px-6 py-2.5 bg-indigo-600 text-white rounded-2xl font-semibold hover:bg-indigo-700 transition-all shadow-md shadow-indigo-100">
                Edit Profil
              </button>
            </div>

            <div className="mb-8">
              <h1 className="text-3xl font-serif font-bold text-gray-900 mb-1">{user.name}</h1>
              <p className="text-gray-500 font-medium">{user.email}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="flex items-center gap-3 text-gray-600">
                <div className="p-2 rounded-lg bg-gray-50">
                  <MapPin className="h-4 w-4" />
                </div>
                <span className="text-sm font-medium">{user.location}</span>
              </div>
              <div className="flex items-center gap-3 text-gray-600">
                <div className="p-2 rounded-lg bg-gray-50">
                  <Calendar className="h-4 w-4" />
                </div>
                <span className="text-sm font-medium">Bergabung {user.joinDate}</span>
              </div>
              <div className="flex items-center gap-3 text-gray-600">
                <div className="p-2 rounded-lg bg-gray-50">
                  <Shield className="h-4 w-4" />
                </div>
                <span className="text-sm font-medium">Akun Terverifikasi</span>
              </div>
            </div>

            <div className="p-6 bg-gray-50 rounded-2xl border border-gray-100">
              <h3 className="text-sm font-bold uppercase tracking-wider text-gray-400 mb-3">Tentang Saya</h3>
              <p className="text-gray-700 leading-relaxed">{user.bio}</p>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
          <Link href="/?view=favorites" className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm hover:border-indigo-300 transition-all group">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-2xl bg-red-50 text-red-500 group-hover:bg-red-500 group-hover:text-white transition-all">
                <Heart className="h-6 w-6" />
              </div>
              <span className="text-3xl font-bold text-gray-900">{stats.favorites}</span>
            </div>
            <h3 className="text-lg font-bold text-gray-900">Berita Favorit</h3>
            <p className="text-gray-500 text-sm">Artikel yang Anda simpan untuk dibaca nanti.</p>
          </Link>

          <Link href="/?view=history" className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm hover:border-indigo-300 transition-all group">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-2xl bg-indigo-50 text-indigo-500 group-hover:bg-indigo-500 group-hover:text-white transition-all">
                <History className="h-6 w-6" />
              </div>
              <span className="text-3xl font-bold text-gray-900">{stats.history}</span>
            </div>
            <h3 className="text-lg font-bold text-gray-900">Riwayat Baca</h3>
            <p className="text-gray-500 text-sm">Daftar berita yang baru saja Anda baca.</p>
          </Link>
        </div>

        {/* Settings List */}
        <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <h3 className="text-lg font-bold text-gray-900">Pengaturan Akun</h3>
          </div>
          <div className="divide-y divide-gray-100">
            <Link href="/settings?tab=notifications" className="w-full flex items-center justify-between p-6 hover:bg-gray-50 transition-all">
              <div className="flex items-center gap-4">
                <div className="p-2 rounded-xl bg-blue-50 text-blue-600">
                  <Bell className="h-5 w-5" />
                </div>
                <div className="text-left">
                  <p className="font-bold text-gray-900">Notifikasi</p>
                  <p className="text-sm text-gray-500">Atur bagaimana Anda menerima pembaruan berita.</p>
                </div>
              </div>
              <ChevronLeft className="h-5 w-5 text-gray-300 rotate-180" />
            </Link>
            <button 
              onClick={handleLogout}
              className="w-full flex items-center justify-between p-6 hover:bg-gray-50 transition-all text-red-600"
            >
              <div className="flex items-center gap-4">
                <div className="p-2 rounded-xl bg-red-50">
                  <LogOut className="h-5 w-5" />
                </div>
                <div className="text-left">
                  <p className="font-bold">Keluar</p>
                  <p className="text-sm text-red-400">Keluar dari akun Anda saat ini.</p>
                </div>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
