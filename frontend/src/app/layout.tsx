import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import '../styles/globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'ForJules - パーソナル ファッション アシスタント',
  description: 'あなたのワードローブとSNSトレンドを組み合わせた、パーソナライズされたコーディネート提案アプリ',
  keywords: 'ファッション, コーディネート, ワードローブ, スタイル, AI',
  authors: [{ name: 'ForJules Team' }],
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body className={inter.className}>
        <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 dark:from-gray-900 dark:to-purple-900">
          {children}
        </div>
      </body>
    </html>
  );
} 