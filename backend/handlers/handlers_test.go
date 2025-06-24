package handlers

import (
	"bytes"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"

	"github.com/sasakiharushou/ForJules/backend/models"
)

// backend/handlers/handlers_test.go
// このファイルは、APIハンドラ関数の単体テストを含みます。
// WardrobeHandlerの動作を検証し、GETリクエスト（空の場合、アイテムが存在する場合）、
// POSTリクエスト（正常系、不正なJSONの場合）の各シナリオをテストします。

// TestWardrobeHandler_GetEmpty は、ワードローブが空の状態でGETリクエストを送信した際の動作をテストします。
// 期待される動作は、HTTPステータス200 (OK) と空のJSON配列 "[]" が返されることです。
func TestWardrobeHandler_GetEmpty(t *testing.T) {
	// ワードローブが空の場合にGET /api/wardrobeをテストします。
	wardrobeDB = []models.WardrobeItem{} // テスト前にインメモリデータベースをリセット

	req, err := http.NewRequest("GET", "/api/wardrobe", nil)
	if err != nil {
		t.Fatalf("リクエストの作成に失敗しました: %v", err)
	}

	rr := httptest.NewRecorder()
	handler := http.HandlerFunc(WardrobeHandler)
	handler.ServeHTTP(rr, req)

	// ステータスコードの検証
	if status := rr.Code; status != http.StatusOK {
		t.Errorf("ハンドラが不正なステータスコードを返しました: got %v want %v. Body: %s",
			status, http.StatusOK, rr.Body.String())
	}

	// レスポンスボディの検証
	expected := `[]`
	// レスポンスボディの末尾に改行が含まれる場合があるため、TrimSpaceで比較
	if strings.TrimSpace(rr.Body.String()) != expected {
		t.Errorf("ハンドラが予期しないボディを返しました: got '%v' want '%v'",
			strings.TrimSpace(rr.Body.String()), expected)
	}
}

// TestWardrobeHandler_PostAndGet は、POSTリクエストでアイテムを追加した後、
// GETリクエストでそのアイテムが取得できることをテストします。
// POSTではHTTPステータス201 (Created) と作成されたアイテムが返され、
// GETではHTTPステータス200 (OK) と追加されたアイテムを含む配列が返されることを期待します。
func TestWardrobeHandler_PostAndGet(t *testing.T) {
	// POST /api/wardrobe でアイテムを追加し、その後 GET で取得できるかテストします。
	wardrobeDB = []models.WardrobeItem{} // テスト前にインメモリデータベースをリセット

	// POSTするアイテムの準備
	newItem := models.WardrobeItem{Type: "シャツ", Color: "青", Pattern: "ストライプ"}
	payload, err := json.Marshal(newItem)
	if err != nil {
		t.Fatalf("JSONへのマーシャルに失敗しました: %v", err)
	}

	// POSTリクエストの作成と実行
	reqPost, err := http.NewRequest("POST", "/api/wardrobe", bytes.NewBuffer(payload))
	if err != nil {
		t.Fatalf("POSTリクエストの作成に失敗しました: %v", err)
	}
	rrPost := httptest.NewRecorder()
	handler := http.HandlerFunc(WardrobeHandler)
	handler.ServeHTTP(rrPost, reqPost)

	// POSTリクエストのステータスコード検証
	if status := rrPost.Code; status != http.StatusCreated {
		t.Fatalf("ハンドラがPOSTリクエストに対して不正なステータスコードを返しました: got %v want %v. Body: %s",
			status, http.StatusCreated, rrPost.Body.String())
	}

	// POSTリクエストのレスポンスボディ検証
	var createdItem models.WardrobeItem
	if err := json.NewDecoder(rrPost.Body).Decode(&createdItem); err != nil {
		t.Fatalf("POSTリクエストのレスポンスのデコードに失敗しました: %v. Body: %s", err, rrPost.Body.String())
	}

	// IDが割り当てられているか（ここでは1であると期待）
	if createdItem.ID != 1 {
		t.Errorf("作成されたアイテムのIDが期待値と異なります: got %d want %d", createdItem.ID, 1)
	}
	// その他のフィールドも検証
	if createdItem.Type != newItem.Type || createdItem.Color != newItem.Color || createdItem.Pattern != newItem.Pattern {
		t.Errorf("作成されたアイテムの内容が入力と異なります: got %+v want %+v", createdItem, newItem)
	}

	// GETリクエストの作成と実行
	reqGet, err := http.NewRequest("GET", "/api/wardrobe", nil)
	if err != nil {
		t.Fatalf("GETリクエストの作成に失敗しました: %v", err)
	}
	rrGet := httptest.NewRecorder()
	handler.ServeHTTP(rrGet, reqGet)

	// GETリクエストのステータスコード検証
	if status := rrGet.Code; status != http.StatusOK {
		t.Fatalf("ハンドラがGETリクエストに対して不正なステータスコードを返しました: got %v want %v. Body: %s",
			status, http.StatusOK, rrGet.Body.String())
	}

	// GETリクエストのレスポンスボディ検証
	var items []models.WardrobeItem
	// GETレスポンスのボディを一度文字列として取得してからデコードする（デバッグしやすくするため）
	getRespBodyStr := rrGet.Body.String()
	if err := json.NewDecoder(strings.NewReader(getRespBodyStr)).Decode(&items); err != nil {
		t.Fatalf("GETリクエストのレスポンスのデコードに失敗しました: %v. Body: %s", err, getRespBodyStr)
	}

	if len(items) != 1 {
		t.Fatalf("ワードローブに期待されるアイテム数は1ですが、%d個見つかりました", len(items))
	}
	// 配列内のアイテムと作成されたアイテムを比較
	if items[0].ID != createdItem.ID || items[0].Type != createdItem.Type || items[0].Color != createdItem.Color || items[0].Pattern != createdItem.Pattern {
		t.Errorf("取得されたアイテムが作成されたアイテムと一致しません: got %+v want %+v", items[0], createdItem)
	}
}

// TestWardrobeHandler_PostInvalidJSON は、不正なJSONペイロードでPOSTリクエストを送信した際の動作をテストします。
// 期待される動作は、HTTPステータス400 (Bad Request) とエラーメッセージ `{"error": "invalid request"}` が返されることです。
func TestWardrobeHandler_PostInvalidJSON(t *testing.T) {
	// 不正なJSONで POST /api/wardrobe をテストします。
	wardrobeDB = []models.WardrobeItem{} // テスト前にインメモリデータベースをリセット

	// 不正なJSONペイロード（最後の波括弧が欠けている）
	invalidPayload := []byte(`{"type": "セーター", "color": "赤"`)

	req, err := http.NewRequest("POST", "/api/wardrobe", bytes.NewBuffer(invalidPayload))
	if err != nil {
		t.Fatalf("リクエストの作成に失敗しました: %v", err)
	}

	rr := httptest.NewRecorder()
	handler := http.HandlerFunc(WardrobeHandler)
	handler.ServeHTTP(rr, req)

	// ステータスコードの検証
	if status := rr.Code; status != http.StatusBadRequest {
		t.Errorf("ハンドラが不正なステータスコードを返しました: got %v want %v. Body: %s",
			status, http.StatusBadRequest, rr.Body.String())
	}

	// エラーレスポンスボディの検証
	expectedError := `{"error": "invalid request"}`
	// レスポンスボディの末尾に改行が含まれる場合があるため、TrimSpaceで比較
	if strings.TrimSpace(rr.Body.String()) != expectedError {
		t.Errorf("ハンドラが予期しないエラーメッセージを返しました: got '%s' want '%s'",
			strings.TrimSpace(rr.Body.String()), expectedError)
	}
}
