// backend/models/models.go は、アプリケーションのデータモデルを定義します。
// このファイルには、データベースのテーブル構造に対応するGoの構造体が含まれます。
package models

// WardrobeItem はワードローブ内の個々のアイテムを表す構造体です。
// これには、アイテムのID、種類（例：トップス、ボトムス、靴）、色、柄、スタイルタグなどの情報が含まれます。
type WardrobeItem struct {
	ID       int      `json:"id"`       // ID はアイテムの一意な識別子です。
	Type     string   `json:"type"`     // Type はアイテムの種類を示します（例: "tops", "bottoms", "shoes"）。
	Color    string   `json:"color"`    // Color はアイテムの色を示します。
	Pattern  string   `json:"pattern"`  // Pattern はアイテムの柄を示します。
	StyleTag []string `json:"style_tag"`// StyleTag はアイテムに関連するスタイルタグの配列です（例: "カジュアル", "フォーマル"）。
}
