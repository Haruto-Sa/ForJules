package models

// ここにDBモデルを定義していきます。

// ワードローブアイテムの構造体
// 例: id, 種類, 色, パターン, スタイルタグ など
type WardrobeItem struct {
	ID       int      `json:"id"`
	Type     string   `json:"type"`      // 例: tops, bottoms, shoes
	Color    string   `json:"color"`
	Pattern  string   `json:"pattern"`
	StyleTag []string `json:"style_tag"`
}
