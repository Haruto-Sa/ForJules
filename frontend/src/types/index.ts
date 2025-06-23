// ワードローブアイテムの型定義
export interface WardrobeItem {
  id: number;
  user_id?: number;
  type: string;
  color: string;
  pattern: string;
  brand?: string;
  size?: string;
  material?: string;
  season?: string;
  style_casual?: boolean;
  style_formal?: boolean;
  style_sporty?: boolean;
  style_elegant?: boolean;
  image_path?: string;
  notes?: string;
  created_at: string;
  updated_at?: string;
  isFavorite?: boolean;
}

// コーディネート提案の型定義
export interface OutfitSuggestion {
  id: number;
  name: string;
  items: WardrobeItem[];
  occasion?: string;
  weather?: string;
  rating?: number;
  image_path?: string;
  notes?: string;
  created_at: string;
}

// ローディング状態の型定義
export interface LoadingState {
  isLoading: boolean;
  error?: string;
}

// フィルター条件の型定義
export interface FilterState {
  searchTerm: string;
  selectedType: string;
  selectedColor: string;
  selectedSeason?: string;
}

// API レスポンスの型定義
export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

// エラーレスポンスの型定義
export interface ApiError {
  message: string;
  code?: string;
  details?: any;
} 