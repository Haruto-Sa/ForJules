'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  PlusIcon, 
  PhotoIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  ChevronLeftIcon,
  HeartIcon
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid';
import type { WardrobeItem } from '@/types';

export default function WardrobePage() {
  const [items, setItems] = useState<WardrobeItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedColor, setSelectedColor] = useState('all');

  // サンプルデータ
  const sampleItems: WardrobeItem[] = [
    {
      id: 1,
      type: 'トップス',
      color: '白',
      pattern: '無地',
      brand: 'UNIQLO',
      size: 'M',
      material: 'コットン',
      season: '通年',
      notes: 'ベーシックな白Tシャツ',
      created_at: '2025-06-20',
      isFavorite: true
    },
    {
      id: 2,
      type: 'ボトムス',
      color: '青',
      pattern: '無地',
      brand: 'ZARA',
      size: 'S',
      material: 'デニム',
      season: '通年',
      notes: 'スキニージーンズ',
      created_at: '2025-06-19',
      isFavorite: false
    },
    {
      id: 3,
      type: 'アウター',
      color: '黒',
      pattern: '無地',
      brand: 'H&M',
      size: 'M',
      material: 'ポリエステル',
      season: '秋冬',
      notes: 'ビジネス用ジャケット',
      created_at: '2025-06-18',
      isFavorite: true
    }
  ];

  useEffect(() => {
    // 実際のAPIコールをシミュレート
    const loadData = () => {
      setTimeout(() => {
        setItems(sampleItems);
        setLoading(false);
      }, 1000);
    };
    
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filteredItems = items.filter(item => {
    const matchesSearch = item.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.color.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.brand?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === 'all' || item.type === selectedType;
    const matchesColor = selectedColor === 'all' || item.color === selectedColor;
    
    return matchesSearch && matchesType && matchesColor;
  });

  const toggleFavorite = (id: number) => {
    setItems(items.map(item => 
      item.id === id ? { ...item, isFavorite: !item.isFavorite } : item
    ));
  };

  const itemTypes = ['all', ...Array.from(new Set(items.map(item => item.type)))];
  const itemColors = ['all', ...Array.from(new Set(items.map(item => item.color)))];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ヘッダー */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-6">
            <div className="flex items-center space-x-4">
              <Link href="/" className="text-gray-400 hover:text-gray-600">
                <ChevronLeftIcon className="w-6 h-6" />
              </Link>
              <h1 className="text-2xl font-bold text-gray-900">マイワードローブ</h1>
              <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-medium">
                {items.length} アイテム
              </span>
            </div>
            <Link href="/wardrobe/add" className="btn-primary flex items-center">
              <PlusIcon className="w-5 h-5 mr-2" />
              アイテム追加
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 検索・フィルター */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <MagnifyingGlassIcon className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="アイテムを検索..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 input-field"
              />
            </div>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="input-field"
            >
              {itemTypes.map(type => (
                <option key={type} value={type}>
                  {type === 'all' ? 'すべてのタイプ' : type}
                </option>
              ))}
            </select>
            <select
              value={selectedColor}
              onChange={(e) => setSelectedColor(e.target.value)}
              className="input-field"
            >
              {itemColors.map(color => (
                <option key={color} value={color}>
                  {color === 'all' ? 'すべての色' : color}
                </option>
              ))}
            </select>
            <button className="flex items-center justify-center px-4 py-3 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors">
              <FunnelIcon className="w-5 h-5 mr-2" />
              詳細フィルター
            </button>
          </div>
        </div>

        {/* アイテムグリッド */}
        {filteredItems.length === 0 ? (
          <div className="text-center py-12">
            <PhotoIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {searchTerm || selectedType !== 'all' || selectedColor !== 'all' 
                ? '条件に一致するアイテムが見つかりません' 
                : 'まだアイテムがありません'}
            </h3>
            <p className="text-gray-500 mb-6">
              {searchTerm || selectedType !== 'all' || selectedColor !== 'all'
                ? '検索条件を変更してみてください'
                : '最初のアイテムを追加してワードローブを作り始めましょう'}
            </p>
            <Link href="/wardrobe/add" className="btn-primary">
              <PlusIcon className="w-5 h-5 mr-2" />
              アイテムを追加
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredItems.map((item) => (
              <div key={item.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
                <div className="aspect-square bg-gray-100 relative">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <PhotoIcon className="w-12 h-12 text-gray-400" />
                  </div>
                  <button
                    onClick={() => toggleFavorite(item.id)}
                    className="absolute top-3 right-3 p-2 bg-white/80 rounded-full hover:bg-white transition-colors"
                  >
                    {item.isFavorite ? (
                      <HeartSolidIcon className="w-5 h-5 text-red-500" />
                    ) : (
                      <HeartIcon className="w-5 h-5 text-gray-400" />
                    )}
                  </button>
                </div>
                <div className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-gray-900">{item.type}</h3>
                    <span className="text-sm text-gray-500">{item.brand}</span>
                  </div>
                  <div className="space-y-1 text-sm text-gray-600">
                    <div className="flex justify-between">
                      <span>色:</span>
                      <span>{item.color}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>柄:</span>
                      <span>{item.pattern}</span>
                    </div>
                    {item.size && (
                      <div className="flex justify-between">
                        <span>サイズ:</span>
                        <span>{item.size}</span>
                      </div>
                    )}
                    {item.season && (
                      <div className="flex justify-between">
                        <span>季節:</span>
                        <span>{item.season}</span>
                      </div>
                    )}
                  </div>
                  {item.notes && (
                    <p className="text-sm text-gray-500 mt-3 truncate">
                      {item.notes}
                    </p>
                  )}
                  <div className="mt-4 flex space-x-2">
                    <Link 
                      href={`/wardrobe/${item.id}`}
                      className="flex-1 bg-purple-50 text-purple-600 hover:bg-purple-100 px-3 py-2 rounded-md text-sm font-medium text-center transition-colors"
                    >
                      詳細
                    </Link>
                    <Link 
                      href={`/wardrobe/${item.id}/edit`}
                      className="flex-1 bg-gray-50 text-gray-600 hover:bg-gray-100 px-3 py-2 rounded-md text-sm font-medium text-center transition-colors"
                    >
                      編集
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 