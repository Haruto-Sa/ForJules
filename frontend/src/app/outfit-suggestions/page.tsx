'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  ChevronLeftIcon,
  SparklesIcon,
  HeartIcon,
  ArrowPathIcon,
  ShareIcon,
  CloudIcon,
  SunIcon,
  BeakerIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid';
import type { WardrobeItem, OutfitSuggestion } from '@/types';

export default function OutfitSuggestionsPage() {
  const [conditions, setConditions] = useState({
    occasion: '',
    weather: '',
    season: '',
    style: '',
  });
  
  const [suggestions, setSuggestions] = useState<OutfitSuggestion[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedSuggestion, setSelectedSuggestion] = useState<OutfitSuggestion | null>(null);

  const occasions = ['カジュアル', 'ビジネス', 'デート', 'パーティー', 'スポーツ', 'リラックス'];
  const weatherOptions = ['晴れ', '曇り', '雨', '雪', '風強'];
  const seasons = ['春', '夏', '秋', '冬'];
  const styles = ['カジュアル', 'フォーマル', 'スポーティ', 'エレガント', 'ボヘミアン', 'ミニマル'];

  const weatherIcons = {
    '晴れ': SunIcon,
    '曇り': CloudIcon,
    '雨': BeakerIcon,
    '雪': BeakerIcon,
    '風強': BeakerIcon,
  };

  // サンプルコーディネート提案データ
  const sampleSuggestions: OutfitSuggestion[] = [
    {
      id: 1,
      name: 'カジュアル通勤スタイル',
      items: [
        { 
          id: 1, type: 'トップス', color: '白', pattern: '無地', brand: 'UNIQLO', 
          created_at: '2025-06-20', notes: 'ベーシックな白Tシャツ' 
        },
        { 
          id: 2, type: 'ボトムス', color: '青', pattern: '無地', brand: 'ZARA', 
          created_at: '2025-06-19', notes: 'スキニージーンズ' 
        },
        { 
          id: 3, type: 'アウター', color: '黒', pattern: '無地', brand: 'H&M', 
          created_at: '2025-06-18', notes: 'ビジネス用ジャケット' 
        }
      ],
      occasion: 'ビジネス',
      weather: '晴れ',
      rating: 4.5,
      created_at: '2025-06-23',
      notes: '清潔感のあるカジュアルな通勤スタイル'
    },
    {
      id: 2,
      name: 'エレガント デートルック',
      items: [
        { 
          id: 4, type: 'トップス', color: 'ピンク', pattern: '無地', brand: 'ZARA', 
          created_at: '2025-06-20', notes: 'フェミニンなブラウス' 
        },
        { 
          id: 5, type: 'ボトムス', color: '黒', pattern: '無地', brand: 'UNIQLO', 
          created_at: '2025-06-19', notes: 'Aラインスカート' 
        }
      ],
      occasion: 'デート',
      weather: '曇り',
      rating: 4.8,
      created_at: '2025-06-23',
      notes: '上品で女性らしいデートコーディネート'
    },
    {
      id: 3,
      name: 'スポーティ ウィークエンド',
      items: [
        { 
          id: 6, type: 'トップス', color: 'グレー', pattern: '無地', brand: 'Nike', 
          created_at: '2025-06-20', notes: 'スポーツウェア' 
        },
        { 
          id: 7, type: 'ボトムス', color: '黒', pattern: '無地', brand: 'Adidas', 
          created_at: '2025-06-19', notes: 'レギンス' 
        }
      ],
      occasion: 'スポーツ',
      weather: '晴れ',
      rating: 4.2,
      created_at: '2025-06-23',
      notes: 'アクティブな休日にぴったり'
    }
  ];

  const handleConditionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setConditions(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const generateSuggestions = async () => {
    setIsGenerating(true);
    
    try {
      // 実際のAPI呼び出しをシミュレート
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // 条件に基づいてフィルタリング
      const filteredSuggestions = sampleSuggestions.filter(suggestion => {
        if (conditions.occasion && suggestion.occasion !== conditions.occasion) return false;
        if (conditions.weather && suggestion.weather !== conditions.weather) return false;
        return true;
      });
      
      setSuggestions(filteredSuggestions.length > 0 ? filteredSuggestions : sampleSuggestions);
      
    } catch (error) {
      console.error('提案生成エラー:', error);
      alert('コーディネート提案の生成に失敗しました。');
    } finally {
      setIsGenerating(false);
    }
  };

  const saveSuggestion = async (suggestionId: number) => {
    try {
      // 実際のAPI呼び出しをここに実装
      console.log('コーディネートを保存:', suggestionId);
      alert('コーディネートを保存しました！');
    } catch (error) {
      console.error('保存エラー:', error);
      alert('保存に失敗しました。');
    }
  };

  const shareSuggestion = async (suggestion: OutfitSuggestion) => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: suggestion.name,
          text: suggestion.notes,
          url: window.location.href,
        });
      } else {
        // フォールバック
        await navigator.clipboard.writeText(
          `${suggestion.name}\n${suggestion.notes}\n${window.location.href}`
        );
        alert('リンクをクリップボードにコピーしました！');
      }
    } catch (error) {
      console.error('共有エラー:', error);
    }
  };

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
              <h1 className="text-2xl font-bold text-gray-900">コーディネート提案</h1>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 条件設定 */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <h2 className="text-lg font-medium text-gray-900 mb-6 flex items-center">
            <SparklesIcon className="w-5 h-5 mr-2 text-orange-500" />
            AI提案の条件設定
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                シーン
              </label>
              <select
                name="occasion"
                value={conditions.occasion}
                onChange={handleConditionChange}
                className="input-field"
              >
                <option value="">すべて</option>
                {occasions.map(occasion => (
                  <option key={occasion} value={occasion}>{occasion}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                天気
              </label>
              <select
                name="weather"
                value={conditions.weather}
                onChange={handleConditionChange}
                className="input-field"
              >
                <option value="">すべて</option>
                {weatherOptions.map(weather => (
                  <option key={weather} value={weather}>{weather}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                季節
              </label>
              <select
                name="season"
                value={conditions.season}
                onChange={handleConditionChange}
                className="input-field"
              >
                <option value="">すべて</option>
                {seasons.map(season => (
                  <option key={season} value={season}>{season}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                スタイル
              </label>
              <select
                name="style"
                value={conditions.style}
                onChange={handleConditionChange}
                className="input-field"
              >
                <option value="">すべて</option>
                {styles.map(style => (
                  <option key={style} value={style}>{style}</option>
                ))}
              </select>
            </div>
          </div>
          
          <button
            onClick={generateSuggestions}
            disabled={isGenerating}
            className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isGenerating ? (
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                AI分析中...
              </div>
            ) : (
              <div className="flex items-center">
                <SparklesIcon className="w-5 h-5 mr-2" />
                コーディネートを提案してもらう
              </div>
            )}
          </button>
        </div>

        {/* 提案結果 */}
        {suggestions.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-6">
              AI提案コーディネート ({suggestions.length}件)
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {suggestions.map((suggestion) => {
                const WeatherIcon = weatherIcons[suggestion.weather as keyof typeof weatherIcons] || CloudIcon;
                
                return (
                  <div key={suggestion.id} className="card hover:shadow-lg transition-shadow duration-300">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {suggestion.name}
                      </h3>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => saveSuggestion(suggestion.id)}
                          className="text-gray-400 hover:text-orange-500 transition-colors"
                        >
                          <HeartIcon className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => shareSuggestion(suggestion)}
                          className="text-gray-400 hover:text-blue-500 transition-colors"
                        >
                          <ShareIcon className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-4 mb-4 text-sm text-gray-600">
                      <span className="bg-orange-100 text-orange-800 px-2 py-1 rounded-full">
                        {suggestion.occasion}
                      </span>
                      <div className="flex items-center">
                        <WeatherIcon className="w-4 h-4 mr-1" />
                        {suggestion.weather}
                      </div>
                      <div className="flex items-center">
                        <span className="text-yellow-500">★</span>
                        <span className="ml-1">{suggestion.rating}</span>
                      </div>
                    </div>
                    
                    <div className="space-y-3 mb-4">
                      {suggestion.items.map((item, index) => (
                        <div key={item.id} className="flex items-center space-x-3 p-2 bg-gray-50 rounded-lg">
                          <div className="w-8 h-8 bg-gray-200 rounded flex items-center justify-center text-xs font-medium">
                            {index + 1}
                          </div>
                          <div className="flex-1">
                            <div className="text-sm font-medium text-gray-900">
                              {item.type} - {item.color} {item.pattern}
                            </div>
                            <div className="text-xs text-gray-500">
                              {item.brand} {item.notes && `- ${item.notes}`}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    {suggestion.notes && (
                      <p className="text-sm text-gray-600 mb-4">
                        {suggestion.notes}
                      </p>
                    )}
                    
                    <div className="flex space-x-2">
                      <button
                        onClick={() => setSelectedSuggestion(suggestion)}
                        className="flex-1 bg-orange-100 text-orange-700 hover:bg-orange-200 px-3 py-2 rounded-lg text-sm font-medium transition-colors"
                      >
                        詳細を見る
                      </button>
                      <button
                        onClick={() => generateSuggestions()}
                        className="text-gray-400 hover:text-gray-600 p-2 transition-colors"
                      >
                        <ArrowPathIcon className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* アイテム不足警告 */}
        {suggestions.length === 0 && !isGenerating && (
          <div className="text-center py-12">
            <ExclamationTriangleIcon className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              コーディネート提案を開始
            </h3>
            <p className="text-gray-500 mb-6">
              上記の条件を設定して「コーディネートを提案してもらう」ボタンを押してください
            </p>
            <Link href="/wardrobe" className="btn-secondary">
              ワードローブを確認する
            </Link>
          </div>
        )}
      </div>
    </div>
  );
} 