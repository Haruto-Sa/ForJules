// backend/handlers/handlers.go は、HTTPリクエストを処理するハンドラ関数を定義します。
// 各ハンドラは特定のエンドポイントに対応し、リクエストの解析、適切なビジネスロジックの呼び出し、レスポンスの生成を行います。
package handlers

import (
	"encoding/json"
	"net/http"
	"strconv"

	"github.com/sasakiharushou/ForJules/backend/models"
)

// wardrobeDB はワードローブアイテムを格納するための仮のインメモリデータベースです。
// 本番環境では、実際のデータベースに置き換えられます。
var wardrobeDB = []models.WardrobeItem{}

// WardrobeHandler は /api/wardrobe エンドポイントへのリクエストを処理します。
// GETリクエストの場合はワードローブのアイテムリストを返し、POSTリクエストの場合は新しいアイテムをワードローブに追加します。
func WardrobeHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json") // レスポンスのコンテントタイプをJSONに設定

	// GETリクエストの処理: ワードローブの全アイテムを返す
	if r.Method == http.MethodGet {
		json.NewEncoder(w).Encode(wardrobeDB)
		return
	}

	// POSTリクエストの処理: 新しいアイテムをワードローブに追加
	if r.Method == http.MethodPost {
		var item models.WardrobeItem
		// リクエストボディからJSONをデコードして item に格納
		if err := json.NewDecoder(r.Body).Decode(&item); err != nil {
			// デコードエラーが発生した場合の処理
			// HTTPステータスコード 400 (Bad Request) を返し、エラーメッセージを含むJSONをレスポンスボディに書き込む。
			// このエラーハンドリングは docs/fundamental.md に記載されているガイドラインに準拠しています。
			w.WriteHeader(http.StatusBadRequest)
			w.Write([]byte(`{"error": "invalid request"}`)) // エラーレスポンス
			return
		}
		item.ID = len(wardrobeDB) + 1 // 新しいアイテムにIDを割り当て (仮実装)
		wardrobeDB = append(wardrobeDB, item) // アイテムをインメモリDBに追加
		w.WriteHeader(http.StatusCreated) // HTTPステータスコード 201 (Created) を設定
		json.NewEncoder(w).Encode(item) // 追加されたアイテムをレスポンスとして返す
		return
	}
}

// OutfitSuggestionsHandler は /api/outfit_suggestions エンドポイントへのリクエストを処理します。
// 現在はプレースホルダーであり、将来的にコーディネート提案ロジックが実装されます。
func OutfitSuggestionsHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json") // レスポンスのコンテントタイプをJSONに設定
	// 現在は固定のメッセージを返す
	w.Write([]byte(`{"message": "outfit suggestions endpoint"}`))
}
