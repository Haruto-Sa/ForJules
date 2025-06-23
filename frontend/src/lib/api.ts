import axios from 'axios';

// APIクライアントの設定
const api = axios.create({
  baseURL: process.env.NODE_ENV === 'production' 
    ? process.env.NEXT_PUBLIC_API_URL 
    : 'http://localhost:8080',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// リクエストインターセプター
api.interceptors.request.use(
  (config) => {
    // 認証トークンがあれば追加（クライアントサイドでのみ実行）
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('auth_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// レスポンスインターセプター
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // エラーハンドリング
    if (error.response?.status === 401) {
      // 認証エラーの場合、ログアウト処理（クライアントサイドでのみ実行）
      if (typeof window !== 'undefined') {
        localStorage.removeItem('auth_token');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

import type { WardrobeItem, OutfitSuggestion, ApiResponse, ApiError } from '@/types';

// ワードローブAPI
export const wardrobeAPI = {
  // 全アイテム取得
  async getAll(): Promise<WardrobeItem[]> {
    try {
      const response = await api.get('/api/wardrobe');
      return response.data;
    } catch (error) {
      console.error('ワードローブアイテム取得エラー:', error);
      throw error;
    }
  },

  // アイテム作成
  async create(item: Omit<WardrobeItem, 'id' | 'created_at' | 'updated_at'>): Promise<WardrobeItem> {
    try {
      const response = await api.post('/api/wardrobe', item);
      return response.data;
    } catch (error) {
      console.error('アイテム作成エラー:', error);
      throw error;
    }
  },

  // アイテム更新
  async update(id: number, item: Partial<WardrobeItem>): Promise<WardrobeItem> {
    try {
      const response = await api.put(`/api/wardrobe/${id}`, item);
      return response.data;
    } catch (error) {
      console.error('アイテム更新エラー:', error);
      throw error;
    }
  },

  // アイテム削除
  async delete(id: number): Promise<void> {
    try {
      await api.delete(`/api/wardrobe/${id}`);
    } catch (error) {
      console.error('アイテム削除エラー:', error);
      throw error;
    }
  },

  // アイテム詳細取得
  async getById(id: number): Promise<WardrobeItem> {
    try {
      const response = await api.get(`/api/wardrobe/${id}`);
      return response.data;
    } catch (error) {
      console.error('アイテム詳細取得エラー:', error);
      throw error;
    }
  },
};

// コーディネート提案API
export const outfitAPI = {
  // コーディネート提案取得
  async getSuggestions(params?: {
    occasion?: string;
    weather?: string;
    style?: string;
  }): Promise<OutfitSuggestion[]> {
    try {
      const response = await api.get('/api/outfit_suggestions', { params });
      return response.data;
    } catch (error) {
      console.error('コーディネート提案取得エラー:', error);
      throw error;
    }
  },

  // コーディネート保存
  async save(outfit: Omit<OutfitSuggestion, 'id' | 'created_at'>): Promise<OutfitSuggestion> {
    try {
      const response = await api.post('/api/outfits', outfit);
      return response.data;
    } catch (error) {
      console.error('コーディネート保存エラー:', error);
      throw error;
    }
  },

  // 保存済みコーディネート取得
  async getSaved(): Promise<OutfitSuggestion[]> {
    try {
      const response = await api.get('/api/outfits');
      return response.data;
    } catch (error) {
      console.error('保存済みコーディネート取得エラー:', error);
      throw error;
    }
  },
};

// 画像解析API
export const analysisAPI = {
  // 画像アップロード
  async uploadImage(file: File): Promise<{
    message: string;
    filename: string;
    filepath: string;
    size: number;
    uploaded_at: string;
  }> {
    try {
      const formData = new FormData();
      formData.append('image', file);
      
      const response = await api.post('/api/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      return response.data;
    } catch (error) {
      console.error('画像アップロードエラー:', error);
      throw error;
    }
  },

  // 画像解析実行
  async analyzeImage(imagePath: string): Promise<{
    colors: any;
    pattern: any;
    category: any;
    confidence_score: number;
  }> {
    try {
      const response = await api.post('/api/analyze', {
        image_path: imagePath,
      });
      
      return response.data;
    } catch (error) {
      console.error('画像解析エラー:', error);
      throw error;
    }
  },

  // 画像アップロード + 解析（一体化フロー）
  async uploadAndAnalyze(file: File): Promise<{
    upload: any;
    analysis: any;
  }> {
    try {
      // 1. 画像をアップロード
      const uploadResult = await this.uploadImage(file);
      
      // 2. アップロードされた画像を解析
      const analysisResult = await this.analyzeImage(uploadResult.filepath);
      
      return {
        upload: uploadResult,
        analysis: analysisResult,
      };
    } catch (error) {
      console.error('画像アップロード・解析エラー:', error);
      throw error;
    }
  },

  // 解析結果保存
  async saveAnalysisResult(itemId: number, analysisResult: any): Promise<void> {
    try {
      await api.post('/api/analysis', {
        wardrobe_item_id: itemId,
        analysis_type: 'comprehensive',
        result_data: analysisResult,
        confidence_score: analysisResult.confidence_score || 0,
      });
    } catch (error) {
      console.error('解析結果保存エラー:', error);
      throw error;
    }
  },
};

// ユーティリティ関数
export const apiUtils = {
  // エラーメッセージ取得
  getErrorMessage(error: any): string {
    if (error.response?.data?.message) {
      return error.response.data.message;
    }
    if (error.response?.data?.error) {
      return error.response.data.error;
    }
    if (error.message) {
      return error.message;
    }
    return '予期しないエラーが発生しました';
  },

  // ネットワークエラーチェック
  isNetworkError(error: any): boolean {
    return !error.response && error.request;
  },

  // サーバーエラーチェック
  isServerError(error: any): boolean {
    return error.response?.status >= 500;
  },
};

export default api; 