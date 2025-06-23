// backend/models/models.go は、アプリケーションのデータモデルを定義します。
// このファイルには、データベースのテーブル構造に対応するGoの構造体が含まれます。
package models

import "time"

// User はユーザー情報を表す構造体です
type User struct {
	ID           int       `json:"id" db:"id"`
	Username     string    `json:"username" db:"username"`
	Email        string    `json:"email" db:"email"`
	PasswordHash string    `json:"-" db:"password_hash"`
	CreatedAt    time.Time `json:"created_at" db:"created_at"`
	UpdatedAt    time.Time `json:"updated_at" db:"updated_at"`
}

// WardrobeItem はワードローブ内の個々のアイテムを表す構造体です。
// これには、アイテムのID、種類（例：トップス、ボトムス、靴）、色、柄、スタイルタグなどの情報が含まれます。
type WardrobeItem struct {
	ID            int       `json:"id" db:"id"`
	UserID        int       `json:"user_id" db:"user_id"`
	Type          string    `json:"type" db:"type"`                     // トップス、ボトムス、シューズ、アクセサリー、アウターウェア
	Color         string    `json:"color" db:"color"`                   // Color はアイテムの色を示します。
	Pattern       string    `json:"pattern" db:"pattern"`               // Pattern はアイテムの柄を示します。
	Brand         string    `json:"brand" db:"brand"`                   // ブランド名
	Size          string    `json:"size" db:"size"`                     // サイズ
	Material      string    `json:"material" db:"material"`             // 素材
	Season        string    `json:"season" db:"season"`                 // 季節（春、夏、秋、冬、通年）
	StyleCasual   bool      `json:"style_casual" db:"style_casual"`     // カジュアルスタイル
	StyleFormal   bool      `json:"style_formal" db:"style_formal"`     // フォーマルスタイル
	StyleSporty   bool      `json:"style_sporty" db:"style_sporty"`     // スポーティスタイル
	StyleElegant  bool      `json:"style_elegant" db:"style_elegant"`   // エレガントスタイル
	ImagePath     string    `json:"image_path" db:"image_path"`         // 画像ファイルのパス
	Notes         string    `json:"notes" db:"notes"`                   // 備考
	CreatedAt     time.Time `json:"created_at" db:"created_at"`
	UpdatedAt     time.Time `json:"updated_at" db:"updated_at"`
	
	// StyleTag []string `json:"style_tag"`// StyleTag はアイテムに関連するスタイルタグの配列です（例: "カジュアル", "フォーマル"）。
	// 上記は別テーブルで管理するため削除し、代わりにスタイル別のブール値フィールドを使用
}

// Outfit はコーディネートを表す構造体です
type Outfit struct {
	ID        int       `json:"id" db:"id"`
	UserID    int       `json:"user_id" db:"user_id"`
	Name      string    `json:"name" db:"name"`
	Occasion  string    `json:"occasion" db:"occasion"`   // 場面（仕事、カジュアル、パーティー等）
	Weather   string    `json:"weather" db:"weather"`     // 天気
	Rating    int       `json:"rating" db:"rating"`       // 評価（0-5）
	ImagePath string    `json:"image_path" db:"image_path"`
	Notes     string    `json:"notes" db:"notes"`
	CreatedAt time.Time `json:"created_at" db:"created_at"`
	UpdatedAt time.Time `json:"updated_at" db:"updated_at"`
	Items     []WardrobeItem `json:"items,omitempty"` // 関連するワードローブアイテム
}

// OutfitItem はコーディネートとワードローブアイテムの関連を表す構造体です
type OutfitItem struct {
	ID              int       `json:"id" db:"id"`
	OutfitID        int       `json:"outfit_id" db:"outfit_id"`
	WardrobeItemID  int       `json:"wardrobe_item_id" db:"wardrobe_item_id"`
	CreatedAt       time.Time `json:"created_at" db:"created_at"`
}

// ImageAnalysis は画像解析結果を表す構造体です
type ImageAnalysis struct {
	ID               int             `json:"id" db:"id"`
	WardrobeItemID   int             `json:"wardrobe_item_id" db:"wardrobe_item_id"`
	AnalysisType     string          `json:"analysis_type" db:"analysis_type"`
	ResultData       interface{}     `json:"result_data" db:"result_data"` // JSONデータ
	ConfidenceScore  float64         `json:"confidence_score" db:"confidence_score"`
	AnalyzedAt       time.Time       `json:"analyzed_at" db:"analyzed_at"`
}

// StyleTag はスタイルタグを表す構造体です
type StyleTag struct {
	ID          int       `json:"id" db:"id"`
	Name        string    `json:"name" db:"name"`
	Description string    `json:"description" db:"description"`
	CreatedAt   time.Time `json:"created_at" db:"created_at"`
}

// WardrobeItemStyleTag はワードローブアイテムとスタイルタグの関連を表す構造体です
type WardrobeItemStyleTag struct {
	ID              int       `json:"id" db:"id"`
	WardrobeItemID  int       `json:"wardrobe_item_id" db:"wardrobe_item_id"`
	StyleTagID      int       `json:"style_tag_id" db:"style_tag_id"`
	CreatedAt       time.Time `json:"created_at" db:"created_at"`
}
