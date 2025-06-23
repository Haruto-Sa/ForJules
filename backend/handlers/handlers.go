// backend/handlers/handlers.go は、HTTPリクエストを処理するハンドラ関数を定義します。
// 各ハンドラは特定のエンドポイントに対応し、リクエストの解析、適切なビジネスロジックの呼び出し、レスポンスの生成を行います。
package handlers

import (
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"os"
	"os/exec"
	"path/filepath"
	"strconv"
	"time"

	"github.com/gorilla/mux"
	"github.com/sasakiharushou/ForJules/backend/db"
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
		// TODO: 実際のユーザーIDを取得（認証実装後）
		const defaultUserID = 1

		items, err := db.GetWardrobeItems(defaultUserID)
		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			json.NewEncoder(w).Encode(map[string]string{"error": "アイテムの取得に失敗しました"})
			return
		}

		json.NewEncoder(w).Encode(items)
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
			json.NewEncoder(w).Encode(map[string]string{"error": "不正なリクエストです"})
			return
		}

		// TODO: 実際のユーザーIDを設定（認証実装後）
		item.UserID = 1

		if err := db.CreateWardrobeItem(&item); err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			json.NewEncoder(w).Encode(map[string]string{"error": "アイテムの作成に失敗しました"})
			return
		}

		w.WriteHeader(http.StatusCreated) // HTTPステータスコード 201 (Created) を設定
		json.NewEncoder(w).Encode(item)   // 追加されたアイテムをレスポンスとして返す
		return
	}
}

// WardrobeItemHandler は個別のワードローブアイテムに対する操作を処理します
func WardrobeItemHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	vars := mux.Vars(r)
	idStr, ok := vars["id"]
	if !ok {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(map[string]string{"error": "アイテムIDが必要です"})
		return
	}

	id, err := strconv.Atoi(idStr)
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(map[string]string{"error": "無効なアイテムIDです"})
		return
	}

	switch r.Method {
	case http.MethodGet:
		item, err := db.GetWardrobeItemByID(id)
		if err != nil {
			w.WriteHeader(http.StatusNotFound)
			json.NewEncoder(w).Encode(map[string]string{"error": "アイテムが見つかりません"})
			return
		}
		json.NewEncoder(w).Encode(item)

	case http.MethodPut:
		var item models.WardrobeItem
		if err := json.NewDecoder(r.Body).Decode(&item); err != nil {
			w.WriteHeader(http.StatusBadRequest)
			json.NewEncoder(w).Encode(map[string]string{"error": "不正なリクエストです"})
			return
		}

		item.ID = id
		if err := db.UpdateWardrobeItem(&item); err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			json.NewEncoder(w).Encode(map[string]string{"error": "アイテムの更新に失敗しました"})
			return
		}

		json.NewEncoder(w).Encode(item)

	case http.MethodDelete:
		if err := db.DeleteWardrobeItem(id); err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			json.NewEncoder(w).Encode(map[string]string{"error": "アイテムの削除に失敗しました"})
			return
		}

		w.WriteHeader(http.StatusNoContent)
	}
}

// OutfitSuggestionsHandler は /api/outfit_suggestions エンドポイントへのリクエストを処理します。
// 現在はプレースホルダーであり、将来的にコーディネート提案ロジックが実装されます。
func OutfitSuggestionsHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json") // レスポンスのコンテントタイプをJSONに設定

	if r.Method == http.MethodGet {
		// 基本的なコーディネート提案のサンプルデータ
		suggestions := []map[string]interface{}{
			{
				"id":       1,
				"name":     "カジュアル通勤スタイル",
				"occasion": "ビジネス",
				"weather":  "晴れ",
				"rating":   4.5,
				"items": []map[string]string{
					{"type": "トップス", "color": "白", "brand": "UNIQLO"},
					{"type": "ボトムス", "color": "青", "brand": "ZARA"},
					{"type": "アウター", "color": "黒", "brand": "H&M"},
				},
			},
			{
				"id":       2,
				"name":     "エレガント デートルック",
				"occasion": "デート",
				"weather":  "曇り",
				"rating":   4.8,
				"items": []map[string]string{
					{"type": "トップス", "color": "ピンク", "brand": "ZARA"},
					{"type": "ボトムス", "color": "黒", "brand": "UNIQLO"},
				},
			},
		}

		json.NewEncoder(w).Encode(map[string]interface{}{
			"suggestions": suggestions,
			"count":       len(suggestions),
		})
		return
	}

	if r.Method == http.MethodPost {
		// コーディネート提案生成リクエストの処理
		var request map[string]interface{}
		if err := json.NewDecoder(r.Body).Decode(&request); err != nil {
			w.WriteHeader(http.StatusBadRequest)
			json.NewEncoder(w).Encode(map[string]string{"error": "不正なリクエストです"})
			return
		}

		// TODO: 実際のAI提案ロジックを実装

		json.NewEncoder(w).Encode(map[string]interface{}{
			"message": "コーディネート提案を生成中です",
			"request": request,
		})
		return
	}
}

// ImageUploadHandler handles image upload requests
func ImageUploadHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	if r.Method != http.MethodPost {
		w.WriteHeader(http.StatusMethodNotAllowed)
		json.NewEncoder(w).Encode(map[string]string{"error": "POST メソッドのみサポートされています"})
		return
	}

	// マルチパートフォームデータの解析
	err := r.ParseMultipartForm(10 << 20) // 10MB limit
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(map[string]string{"error": "ファイルアップロードの解析に失敗しました"})
		return
	}

	file, header, err := r.FormFile("image")
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(map[string]string{"error": "画像ファイルが見つかりません"})
		return
	}
	defer file.Close()

	// ファイルタイプの検証
	if !isValidImageType(header.Filename) {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(map[string]string{"error": "サポートされていない画像形式です"})
		return
	}

	// uploads ディレクトリの作成
	uploadsDir := "uploads"
	if _, err := os.Stat(uploadsDir); os.IsNotExist(err) {
		os.Mkdir(uploadsDir, 0755)
	}

	// ユニークなファイル名を生成
	timestamp := time.Now().Unix()
	filename := fmt.Sprintf("%d_%s", timestamp, header.Filename)
	filepath := filepath.Join(uploadsDir, filename)

	// ファイルを保存
	dst, err := os.Create(filepath)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(map[string]string{"error": "ファイルの保存に失敗しました"})
		return
	}
	defer dst.Close()

	_, err = io.Copy(dst, file)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(map[string]string{"error": "ファイルの保存に失敗しました"})
		return
	}

	// レスポンス
	response := map[string]interface{}{
		"message":     "画像のアップロードが完了しました",
		"filename":    filename,
		"filepath":    filepath,
		"size":        header.Size,
		"uploaded_at": time.Now().Format(time.RFC3339),
	}

	json.NewEncoder(w).Encode(response)
}

// ImageAnalysisHandler handles image analysis requests
func ImageAnalysisHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	if r.Method != http.MethodPost {
		w.WriteHeader(http.StatusMethodNotAllowed)
		json.NewEncoder(w).Encode(map[string]string{"error": "POST メソッドのみサポートされています"})
		return
	}

	// リクエストボディから画像パスを取得
	var request map[string]string
	if err := json.NewDecoder(r.Body).Decode(&request); err != nil {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(map[string]string{"error": "不正なリクエストです"})
		return
	}

	imagePath, ok := request["image_path"]
	if !ok || imagePath == "" {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(map[string]string{"error": "画像パスが必要です"})
		return
	}

	// Python画像解析スクリプトを実行
	cmd := exec.Command("python", "../cvml/analyze.py", imagePath)
	output, err := cmd.Output()
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(map[string]string{"error": "画像解析に失敗しました"})
		return
	}

	// Python スクリプトの出力をJSON形式でパース
	var analysisResult map[string]interface{}
	if err := json.Unmarshal(output, &analysisResult); err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(map[string]string{"error": "解析結果の処理に失敗しました"})
		return
	}

	json.NewEncoder(w).Encode(analysisResult)
}

// isValidImageType checks if the file extension is a supported image type
func isValidImageType(filename string) bool {
	ext := filepath.Ext(filename)
	supportedTypes := []string{".jpg", ".jpeg", ".png", ".bmp", ".gif"}

	for _, supportedType := range supportedTypes {
		if ext == supportedType {
			return true
		}
	}
	return false
}
