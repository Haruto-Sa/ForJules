// backend/main.go は、アプリケーションのエントリーポイントです。
// HTTPサーバーを初期化し、APIエンドポイントのルーティングを設定します。
package main

import (
	"context"
	"log"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"

	"github.com/gorilla/mux"
	"github.com/sasakiharushou/ForJules/backend/db"
	"github.com/sasakiharushou/ForJules/backend/handlers"
)

// main はアプリケーションのメイン関数です。
// HTTPルーターをセットアップし、指定されたポートでサーバーを起動します。
func main() {
	// データベース初期化
	if err := db.InitDB(); err != nil {
		log.Fatalf("データベース初期化に失敗しました: %v", err)
	}
	defer db.CloseDB()

	r := mux.NewRouter()

	// CORS設定（開発用）
	r.Use(func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			w.Header().Set("Access-Control-Allow-Origin", "*")
			w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
			w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")

			if r.Method == "OPTIONS" {
				w.WriteHeader(http.StatusOK)
				return
			}

			next.ServeHTTP(w, r)
		})
	})

	// APIエンドポイントの定義
	// /api/wardrobe は GET と POST リクエストを WardrobeHandler で処理します。
	r.HandleFunc("/api/wardrobe", handlers.WardrobeHandler).Methods("GET", "POST", "OPTIONS")
	r.HandleFunc("/api/wardrobe/{id}", handlers.WardrobeItemHandler).Methods("GET", "PUT", "DELETE", "OPTIONS")
	// /api/outfit_suggestions は GET リクエストを OutfitSuggestionsHandler で処理します。
	r.HandleFunc("/api/outfit_suggestions", handlers.OutfitSuggestionsHandler).Methods("GET", "POST", "OPTIONS")

	// 画像関連エンドポイント
	r.HandleFunc("/api/upload", handlers.ImageUploadHandler).Methods("POST", "OPTIONS")
	r.HandleFunc("/api/analyze", handlers.ImageAnalysisHandler).Methods("POST", "OPTIONS")

	// ヘルスチェックエンドポイント
	r.HandleFunc("/api/health", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusOK)
		w.Write([]byte(`{"status": "ok", "service": "ForJules Backend"}`))
	}).Methods("GET")

	// サーバー設定
	server := &http.Server{
		Addr:         ":8080",
		Handler:      r,
		ReadTimeout:  15 * time.Second,
		WriteTimeout: 15 * time.Second,
		IdleTimeout:  60 * time.Second,
	}

	// グレースフルシャットダウンの設定
	go func() {
		log.Println("サーバーが :8080 で起動しました") // サーバー起動メッセージを日本語に変更
		if err := server.ListenAndServe(); err != nil && err != http.ErrServerClosed {
			log.Fatalf("サーバー起動エラー: %v", err)
		}
	}()

	// シグナル待機
	quit := make(chan os.Signal, 1)
	signal.Notify(quit, syscall.SIGINT, syscall.SIGTERM)
	<-quit
	log.Println("サーバーをシャットダウンしています...")

	// グレースフルシャットダウン
	ctx, cancel := context.WithTimeout(context.Background(), 30*time.Second)
	defer cancel()

	if err := server.Shutdown(ctx); err != nil {
		log.Fatalf("サーバーシャットダウンエラー: %v", err)
	}

	log.Println("サーバーが正常にシャットダウンしました")
}
