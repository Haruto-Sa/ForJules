'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  CameraIcon, 
  SparklesIcon, 
  HeartIcon,
  UserGroupIcon,
  ClockIcon,
  ChevronRightIcon 
} from '@heroicons/react/24/outline';

export default function HomePage() {
  const [isLoading, setIsLoading] = useState(false);

  const features = [
    {
      name: 'ワードローブ管理',
      description: 'あなたの服を簡単に登録・管理。写真を撮るだけで自動分類',
      icon: CameraIcon,
      href: '/wardrobe',
    },
    {
      name: 'AI コーディネート提案',
      description: 'AIがあなたの好みと流行を分析して最適なコーディネートを提案',
      icon: SparklesIcon,
      href: '/outfit-suggestions',
    },
    {
      name: 'お気に入り保存',
      description: '気に入ったコーディネートを保存して後で確認',
      icon: HeartIcon,
      href: '/favorites',
    },
    {
      name: 'トレンド分析',
      description: 'SNSの最新トレンドを分析してパーソナライズ',
      icon: UserGroupIcon,
      href: '/trends',
    },
  ];

  const recentOutfits = [
    { id: 1, name: 'カジュアル通勤スタイル', date: '2025-06-22', image: '/placeholder-outfit1.jpg' },
    { id: 2, name: 'エレガント デートルック', date: '2025-06-21', image: '/placeholder-outfit2.jpg' },
    { id: 3, name: 'スポーティ ウィークエンド', date: '2025-06-20', image: '/placeholder-outfit3.jpg' },
  ];

  return (
    <div className="min-h-screen">
      {/* ヘッダー */}
      <header className="bg-white/80 backdrop-blur-lg border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-4">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                ForJules
              </h1>
              <span className="text-sm text-gray-500">パーソナル ファッション アシスタント</span>
            </div>
            <nav className="flex items-center space-x-6">
              <Link href="/wardrobe" className="text-gray-700 hover:text-purple-600 transition-colors">
                ワードローブ
              </Link>
              <Link href="/outfit-suggestions" className="text-gray-700 hover:text-purple-600 transition-colors">
                コーディネート
              </Link>
              <Link href="/profile" className="btn-primary">
                プロフィール
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* メインコンテンツ */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* ヒーローセクション */}
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold text-gray-900 mb-6">
            あなただけの
            <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              パーソナルスタイリスト
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            AIがあなたのワードローブとSNSトレンドを分析し、毎日の完璧なコーディネートを提案します。
            ファッションをもっと楽しく、もっと自分らしく。
          </p>
          <div className="flex justify-center space-x-4">
            <Link href="/wardrobe" className="btn-primary text-lg px-8 py-4">
              今すぐ始める
              <ChevronRightIcon className="w-5 h-5 ml-2 inline" />
            </Link>
            <button className="bg-white text-purple-600 border-2 border-purple-600 hover:bg-purple-50 px-8 py-4 rounded-lg font-medium text-lg transition-colors duration-200">
              デモを見る
            </button>
          </div>
        </div>

        {/* 機能紹介 */}
        <section className="mb-16">
          <h3 className="text-3xl font-bold text-center text-gray-900 mb-12">
            ForJulesでできること
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature) => (
              <Link
                key={feature.name}
                href={feature.href}
                className="card hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
              >
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-purple-600" />
                </div>
                <h4 className="text-xl font-semibold text-gray-900 mb-2">
                  {feature.name}
                </h4>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </Link>
            ))}
          </div>
        </section>

        {/* 最近のコーディネート */}
        <section className="mb-16">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-3xl font-bold text-gray-900">
              最近のコーディネート
            </h3>
            <Link href="/history" className="text-purple-600 hover:text-purple-700 font-medium flex items-center">
              すべて見る
              <ChevronRightIcon className="w-4 h-4 ml-1" />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {recentOutfits.map((outfit) => (
              <div key={outfit.id} className="card hover:shadow-lg transition-shadow duration-300">
                <div className="aspect-square bg-gray-100 rounded-lg mb-4 flex items-center justify-center">
                  <CameraIcon className="w-12 h-12 text-gray-400" />
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">
                  {outfit.name}
                </h4>
                <div className="flex items-center text-sm text-gray-500">
                  <ClockIcon className="w-4 h-4 mr-1" />
                  {outfit.date}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* CTA セクション */}
        <section className="text-center bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-12 text-white">
          <h3 className="text-3xl font-bold mb-4">
            今日のコーディネートを見つけよう
          </h3>
          <p className="text-lg mb-8 opacity-90">
            数分でセットアップ完了。あなたの新しいファッション体験を始めましょう。
          </p>
          <Link href="/wardrobe" className="bg-white text-purple-600 hover:bg-gray-100 px-8 py-4 rounded-lg font-medium text-lg transition-colors duration-200 inline-flex items-center">
            <SparklesIcon className="w-5 h-5 mr-2" />
            コーディネート提案を受ける
          </Link>
        </section>
      </main>

      {/* フッター */}
      <footer className="bg-gray-900 text-white py-12 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h4 className="text-2xl font-bold mb-4">ForJules</h4>
              <p className="text-gray-400">
                あなたのパーソナルファッションアシスタント
              </p>
            </div>
            <div>
              <h5 className="font-semibold mb-4">機能</h5>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/wardrobe" className="hover:text-white transition-colors">ワードローブ</Link></li>
                <li><Link href="/outfit-suggestions" className="hover:text-white transition-colors">コーディネート提案</Link></li>
                <li><Link href="/trends" className="hover:text-white transition-colors">トレンド分析</Link></li>
              </ul>
            </div>
            <div>
              <h5 className="font-semibold mb-4">サポート</h5>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/help" className="hover:text-white transition-colors">ヘルプ</Link></li>
                <li><Link href="/contact" className="hover:text-white transition-colors">お問い合わせ</Link></li>
                <li><Link href="/privacy" className="hover:text-white transition-colors">プライバシー</Link></li>
              </ul>
            </div>
            <div>
              <h5 className="font-semibold mb-4">Follow Us</h5>
              <div className="flex space-x-4">
                {/* ソーシャルメディアリンクは今後追加 */}
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 mt-8 text-center text-gray-400">
            <p>&copy; 2025 ForJules. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
} 