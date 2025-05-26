// backend/main.go は、アプリケーションのエントリーポイントです。
// HTTPサーバーを初期化し、APIエンドポイントのルーティングを設定します。
package main

import (
	"log"
	"net/http"
	"github.com/gorilla/mux"
	"github.com/sasakiharushou/ForJules/backend/handlers"
)

// main はアプリケーションのメイン関数です。
// HTTPルーターをセットアップし、指定されたポートでサーバーを起動します。
func main() {
	r := mux.NewRouter()

	// APIエンドポイントの定義
	// /api/wardrobe は GET と POST リクエストを WardrobeHandler で処理します。
	r.HandleFunc("/api/wardrobe", handlers.WardrobeHandler).Methods("GET", "POST")
	// /api/outfit_suggestions は GET リクエストを OutfitSuggestionsHandler で処理します。
	r.HandleFunc("/api/outfit_suggestions", handlers.OutfitSuggestionsHandler).Methods("GET")

	log.Println("サーバーが :8080 で起動しました") // サーバー起動メッセージを日本語に変更
	log.Fatal(http.ListenAndServe(":8080", r))
}
