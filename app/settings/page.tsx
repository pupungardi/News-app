"use client";

import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  ChevronLeft, User, Bell, Shield, Eye, 
  Moon, Save, LogOut, Camera, Mail, MapPin
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';

import { useSearchParams } from 'next/navigation';

import { Suspense } from 'react';

function SettingsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tabParam = searchParams.get('tab');
  
  const [activeTab, setActiveTab] = useState<'profile' | 'notifications' | 'privacy' | 'appearance'>(() => {
    if (tabParam && ['profile', 'notifications', 'privacy', 'appearance'].includes(tabParam)) {
      return tabParam as any;
    }
    return 'profile';
  });

  useEffect(() => {
    if (tabParam && ['profile', 'notifications', 'privacy', 'appearance'].includes(tabParam)) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setActiveTab(tabParam as any);
    }
  }, [tabParam]);
  
  const [isSaved, setIsSaved] = useState(false);
  
  const [profile, setProfile] = useState({
    name: 'User News',
    email: 'user@newstoday.com',
    location: 'Jakarta, Indonesia',
    bio: 'Penggemar berita teknologi dan ekonomi global. Selalu mencari perspektif baru setiap hari.',
    avatar: 'https://picsum.photos/seed/user/200/200'
  });

  const [notifications, setNotifications] = useState({
    breakingNews: true,
    dailyDigest: false,
    personalized: true,
    emailUpdates: true
  });

  const [appearance, setAppearance] = useState({
    fontSize: 'medium',
    autoRefresh: true
  });

  useEffect(() => {
    const loggedIn = localStorage.getItem('isLoggedIn') === 'true';
    if (!loggedIn) {
      router.push('/login');
    }
  }, [router]);

  const handleSave = () => {
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    router.push('/');
  };

  const tabs = [
    { id: 'profile', label: 'Profil', icon: User },
    { id: 'notifications', label: 'Notifikasi', icon: Bell },
    { id: 'appearance', label: 'Tampilan', icon: Moon },
    { id: 'privacy', label: 'Privasi', icon: Shield },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-950">
      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Link 
            href="/profile"
            className="flex items-center gap-2 text-gray-600 hover:text-indigo-600 transition-colors font-medium"
          >
            <ChevronLeft className="h-5 w-5" />
            Kembali ke Profil
          </Link>
          <div className="flex items-center gap-3">
            {isSaved && (
              <motion.span 
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-sm font-medium text-green-600"
              >
                Perubahan disimpan!
              </motion.span>
            )}
            <Button onClick={handleSave} className="rounded-xl bg-indigo-600 hover:bg-indigo-700">
              <Save className="h-4 w-4 mr-2" />
              Simpan
            </Button>
          </div>
        </div>

        <h1 className="text-4xl font-serif font-bold text-gray-900 dark:text-white mb-8">Pengaturan</h1>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Tabs */}
          <div className="lg:col-span-1 space-y-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={cn(
                  "w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold transition-all",
                  activeTab === tab.id
                    ? "bg-indigo-600 text-white shadow-lg shadow-indigo-200"
                    : "bg-white dark:bg-zinc-900 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-zinc-800 border border-gray-200 dark:border-zinc-800"
                )}
              >
                <tab.icon className="h-5 w-5" />
                {tab.label}
              </button>
            ))}
            
            <div className="pt-4 mt-4 border-t border-gray-200 dark:border-zinc-800">
              <button 
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 transition-all"
              >
                <LogOut className="h-5 w-5" />
                Keluar
              </button>
            </div>
          </div>

          {/* Content Area */}
          <div className="lg:col-span-3">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
            >
              {activeTab === 'profile' && (
                <Card className="rounded-3xl border-gray-200 dark:border-zinc-800 shadow-sm overflow-hidden">
                  <CardHeader>
                    <CardTitle>Informasi Profil</CardTitle>
                    <CardDescription>Kelola bagaimana profil Anda ditampilkan kepada publik.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="flex items-center gap-6 pb-6 border-b border-gray-100 dark:border-zinc-800">
                      <div className="relative">
                        <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-gray-200 dark:border-zinc-800">
                          <Image 
                            src={profile.avatar} 
                            alt="Avatar" 
                            fill 
                            sizes="96px"
                            className="object-cover"
                          />
                        </div>
                        <button className="absolute -bottom-1 -right-1 p-2 rounded-full bg-indigo-600 text-white shadow-lg hover:bg-indigo-700 transition-all">
                          <Camera className="h-4 w-4" />
                        </button>
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-900 dark:text-white mb-1">Foto Profil</h4>
                        <p className="text-sm text-gray-500 mb-3">JPG, GIF atau PNG. Maksimal 2MB.</p>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" className="rounded-lg">Ganti Foto</Button>
                          <Button variant="ghost" size="sm" className="rounded-lg text-red-600 hover:text-red-700 hover:bg-red-50">Hapus</Button>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Nama Lengkap</Label>
                        <Input 
                          id="name" 
                          value={profile.name} 
                          onChange={(e) => setProfile({...profile, name: e.target.value})}
                          className="rounded-xl"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input 
                          id="email" 
                          type="email" 
                          value={profile.email} 
                          onChange={(e) => setProfile({...profile, email: e.target.value})}
                          className="rounded-xl"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="location">Lokasi</Label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input 
                          id="location" 
                          value={profile.location} 
                          onChange={(e) => setProfile({...profile, location: e.target.value})}
                          className="pl-10 rounded-xl"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="bio">Bio</Label>
                      <textarea 
                        id="bio"
                        rows={4}
                        value={profile.bio}
                        onChange={(e) => setProfile({...profile, bio: e.target.value})}
                        className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm shadow-sm transition-shadow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/20 focus-visible:border-indigo-500"
                      />
                    </div>
                  </CardContent>
                </Card>
              )}

              {activeTab === 'notifications' && (
                <Card className="rounded-3xl border-gray-200 dark:border-zinc-800 shadow-sm">
                  <CardHeader>
                    <CardTitle>Preferensi Notifikasi</CardTitle>
                    <CardDescription>Pilih jenis berita yang ingin Anda terima pemberitahuannya.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      {[
                        { id: 'breakingNews', title: 'Berita Utama (Breaking News)', desc: 'Dapatkan notifikasi instan untuk berita besar yang sedang terjadi.' },
                        { id: 'dailyDigest', title: 'Ringkasan Harian', desc: 'Terima ringkasan berita terpopuler setiap pagi.' },
                        { id: 'personalized', title: 'Rekomendasi Personal', desc: 'Berita yang disesuaikan dengan minat dan riwayat baca Anda.' },
                        { id: 'emailUpdates', title: 'Pembaruan Email', desc: 'Terima buletin mingguan dan pembaruan fitur melalui email.' }
                      ].map((item) => (
                        <div key={item.id} className="flex items-start justify-between p-4 rounded-2xl bg-gray-50 dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800">
                          <div className="space-y-1">
                            <p className="font-bold text-gray-900 dark:text-white">{item.title}</p>
                            <p className="text-sm text-gray-500">{item.desc}</p>
                          </div>
                          <button 
                            onClick={() => setNotifications({...notifications, [item.id]: !notifications[item.id as keyof typeof notifications]})}
                            className={cn(
                              "relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2",
                              notifications[item.id as keyof typeof notifications] ? "bg-indigo-600" : "bg-gray-200 dark:bg-zinc-700"
                            )}
                          >
                            <span 
                              className={cn(
                                "pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out",
                                notifications[item.id as keyof typeof notifications] ? "translate-x-5" : "translate-x-0"
                              )}
                            />
                          </button>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {activeTab === 'appearance' && (
                <Card className="rounded-3xl border-gray-200 dark:border-zinc-800 shadow-sm">
                  <CardHeader>
                    <CardTitle>Tampilan & Antarmuka</CardTitle>
                    <CardDescription>Sesuaikan bagaimana News Today terlihat di perangkat Anda.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-8">
                    <div className="space-y-4">
                      <Label>Ukuran Font Artikel</Label>
                      <div className="flex gap-2">
                        {['small', 'medium', 'large'].map((size) => (
                          <Button
                            key={size}
                            variant={appearance.fontSize === size ? 'default' : 'outline'}
                            onClick={() => setAppearance({...appearance, fontSize: size})}
                            className="flex-1 rounded-xl capitalize"
                          >
                            {size === 'small' ? 'Kecil' : size === 'medium' ? 'Sedang' : 'Besar'}
                          </Button>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-4 rounded-2xl bg-gray-50 dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800">
                      <div className="space-y-1">
                        <p className="font-bold text-gray-900 dark:text-white">Auto-Refresh Berita</p>
                        <p className="text-sm text-gray-500">Perbarui daftar berita secara otomatis setiap 5 menit.</p>
                      </div>
                      <button 
                        onClick={() => setAppearance({...appearance, autoRefresh: !appearance.autoRefresh})}
                        className={cn(
                          "relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2",
                          appearance.autoRefresh ? "bg-indigo-600" : "bg-gray-200 dark:bg-zinc-700"
                        )}
                      >
                        <span 
                          className={cn(
                            "pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out",
                            appearance.autoRefresh ? "translate-x-5" : "translate-x-0"
                          )}
                        />
                      </button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {activeTab === 'privacy' && (
                <Card className="rounded-3xl border-gray-200 dark:border-zinc-800 shadow-sm">
                  <CardHeader>
                    <CardTitle>Keamanan & Privasi</CardTitle>
                    <CardDescription>Kelola keamanan akun dan data pribadi Anda.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <div className="p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950 text-blue-600">
                            <Shield className="h-5 w-5" />
                          </div>
                          <div>
                            <p className="font-bold text-gray-900 dark:text-white">Kata Sandi</p>
                            <p className="text-sm text-gray-500">Terakhir diubah 3 bulan yang lalu.</p>
                          </div>
                        </div>
                        <Button variant="outline" size="sm" className="rounded-lg">Ubah</Button>
                      </div>

                      <div className="p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="p-2 rounded-xl bg-purple-50 dark:bg-purple-950 text-purple-600">
                            <Eye className="h-5 w-5" />
                          </div>
                          <div>
                            <p className="font-bold text-gray-900 dark:text-white">Riwayat Baca Publik</p>
                            <p className="text-sm text-gray-500">Izinkan orang lain melihat apa yang Anda baca.</p>
                          </div>
                        </div>
                        <button className="relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent bg-gray-200 dark:bg-zinc-700 transition-colors duration-200 ease-in-out">
                          <span className="pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out translate-x-0" />
                        </button>
                      </div>
                    </div>

                    <div className="p-6 rounded-2xl bg-red-50 dark:bg-red-950/20 border border-red-100 dark:border-red-900/30">
                      <h4 className="font-bold text-red-900 dark:text-red-400 mb-2">Zona Bahaya</h4>
                      <p className="text-sm text-red-700 dark:text-red-500/80 mb-4">Menghapus akun Anda akan menghapus semua data favorit dan riwayat baca secara permanen.</p>
                      <Button variant="destructive" className="rounded-xl bg-red-600 hover:bg-red-700">Hapus Akun</Button>
                    </div>
                  </CardContent>
                </Card>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SettingsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Memuat...</div>}>
      <SettingsContent />
    </Suspense>
  );
}
