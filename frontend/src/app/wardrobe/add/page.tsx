'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  ChevronLeftIcon,
  PhotoIcon,
  XMarkIcon,
  CameraIcon,
  ArrowUpTrayIcon
} from '@heroicons/react/24/outline';
import type { WardrobeItem } from '@/types';

export default function AddWardrobeItemPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);

  const [formData, setFormData] = useState<Partial<WardrobeItem>>({
    type: '',
    color: '',
    pattern: '無地',
    brand: '',
    size: '',
    material: '',
    season: '通年',
    notes: ''
  });

  const itemTypes = ['トップス', 'ボトムス', 'アウター', 'シューズ', 'アクセサリー'];
  const colors = ['白', '黒', 'グレー', '紺', '青', '赤', 'ピンク', 'イエロー', 'グリーン', '茶', 'ベージュ', 'その他'];
  const patterns = ['無地', 'ストライプ', 'チェック', 'ドット', '花柄', 'その他'];
  const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'その他'];
  const materials = ['コットン', 'ポリエステル', 'ウール', 'シルク', 'レザー', 'デニム', 'ナイロン', 'その他'];
  const seasons = ['春', '夏', '秋', '冬', '春夏', '秋冬', '通年'];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageUpload = async (file: File) => {
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
      
      try {
        // 実際の画像アップロード・解析処理
        setLoading(true);
        
        // 動的インポートでAPIクライアントを読み込み
        const { analysisAPI } = await import('@/lib/api');
        
        // 画像アップロード + 解析の一体化フロー
        const result = await analysisAPI.uploadAndAnalyze(file);
        
        console.log('アップロード結果:', result.upload);
        console.log('解析結果:', result.analysis);
        
        // 解析結果をフォームデータに反映
        if (result.analysis && !result.analysis.error) {
          setFormData(prev => ({
            ...prev,
            image_path: result.upload.filepath,
            color: result.analysis.colors?.primary_color || prev.color,
            pattern: result.analysis.pattern?.pattern_type || prev.pattern,
            type: result.analysis.category?.category || prev.type,
          }));
        }
        
        alert('画像のアップロード・解析が完了しました！');
      } catch (error) {
        console.error('画像処理エラー:', error);
        alert('画像処理中にエラーが発生しました');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleImageUpload(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    
    const file = e.dataTransfer.files[0];
    if (file) {
      handleImageUpload(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  };

  const removeImage = () => {
    setImagePreview(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // バリデーション
      if (!formData.type || !formData.color) {
        alert('必須項目を入力してください');
        return;
      }

      // 動的インポートでAPIクライアントを読み込み（クライアントサイドでのみ実行）
      const { wardrobeAPI } = await import('@/lib/api');

      // API呼び出し
      const newItem = await wardrobeAPI.create({
        ...formData,
        // TODO: 画像アップロード機能完成後に実際のパスを設定
        image_path: imagePreview ? 'uploaded_image_path' : '',
        user_id: 1 // TODO: 認証実装後に実際のユーザーIDを設定
      });

      console.log('作成されたアイテム:', newItem);
      alert('アイテムを追加しました！');
      router.push('/wardrobe');
    } catch (error) {
      console.error('エラー:', error);
      alert('アイテムの追加に失敗しました');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ヘッダー */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-6">
            <div className="flex items-center space-x-4">
              <Link href="/wardrobe" className="text-gray-400 hover:text-gray-600">
                <ChevronLeftIcon className="w-6 h-6" />
              </Link>
              <h1 className="text-2xl font-bold text-gray-900">アイテム追加</h1>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* 画像アップロード */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">アイテム画像</h2>
            
            {imagePreview ? (
              <div className="relative">
                <img
                  src={imagePreview}
                  alt="プレビュー"
                  className="w-full max-w-sm mx-auto rounded-lg shadow-sm"
                />
                <button
                  type="button"
                  onClick={removeImage}
                  className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                >
                  <XMarkIcon className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div
                className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors
                  ${dragOver ? 'border-purple-400 bg-purple-50' : 'border-gray-300 hover:border-gray-400'}`}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
              >
                <PhotoIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 mb-4">
                  画像をドラッグ＆ドロップするか、クリックして選択してください
                </p>
                <div className="flex justify-center space-x-4">
                  <label className="btn-primary cursor-pointer">
                    <ArrowUpTrayIcon className="w-5 h-5 mr-2" />
                    ファイルを選択
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileSelect}
                      className="hidden"
                    />
                  </label>
                  <button
                    type="button"
                    className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors flex items-center"
                  >
                    <CameraIcon className="w-5 h-5 mr-2" />
                    カメラで撮影
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* 基本情報 */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-6">基本情報</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  アイテムタイプ <span className="text-red-500">*</span>
                </label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleInputChange}
                  required
                  className="input-field"
                >
                  <option value="">選択してください</option>
                  {itemTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  色 <span className="text-red-500">*</span>
                </label>
                <select
                  name="color"
                  value={formData.color}
                  onChange={handleInputChange}
                  required
                  className="input-field"
                >
                  <option value="">選択してください</option>
                  {colors.map(color => (
                    <option key={color} value={color}>{color}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  柄・パターン
                </label>
                <select
                  name="pattern"
                  value={formData.pattern}
                  onChange={handleInputChange}
                  className="input-field"
                >
                  {patterns.map(pattern => (
                    <option key={pattern} value={pattern}>{pattern}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  ブランド
                </label>
                <input
                  type="text"
                  name="brand"
                  value={formData.brand}
                  onChange={handleInputChange}
                  placeholder="例: UNIQLO"
                  className="input-field"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  サイズ
                </label>
                <select
                  name="size"
                  value={formData.size}
                  onChange={handleInputChange}
                  className="input-field"
                >
                  <option value="">選択してください</option>
                  {sizes.map(size => (
                    <option key={size} value={size}>{size}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  素材
                </label>
                <select
                  name="material"
                  value={formData.material}
                  onChange={handleInputChange}
                  className="input-field"
                >
                  <option value="">選択してください</option>
                  {materials.map(material => (
                    <option key={material} value={material}>{material}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  季節
                </label>
                <select
                  name="season"
                  value={formData.season}
                  onChange={handleInputChange}
                  className="input-field"
                >
                  {seasons.map(season => (
                    <option key={season} value={season}>{season}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* メモ */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">メモ</h2>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleInputChange}
              rows={4}
              placeholder="アイテムに関するメモや着用シーンなど..."
              className="input-field resize-none"
            />
          </div>

          {/* 送信ボタン */}
          <div className="flex justify-end space-x-4">
            <Link
              href="/wardrobe"
              className="px-6 py-3 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
            >
              キャンセル
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="btn-primary px-8 py-3 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? '追加中...' : 'アイテムを追加'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 