package handlers

import (
	"encoding/json"
	"net/http"
	"strconv"

	"github.com/sasakiharushou/ForJules/backend/models"
)

// ここにAPIハンドラを実装していきます。

// 仮のインメモリDB
var wardrobeDB = []models.WardrobeItem{}

// ワードローブ一覧取得・追加API
func WardrobeHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	if r.Method == http.MethodGet {
		json.NewEncoder(w).Encode(wardrobeDB)
		return
	}
	if r.Method == http.MethodPost {
		var item models.WardrobeItem
		if err := json.NewDecoder(r.Body).Decode(&item); err != nil {
			w.WriteHeader(http.StatusBadRequest)
			w.Write([]byte(`{"error": "invalid request"}`))
			return
		}
		item.ID = len(wardrobeDB) + 1
		wardrobeDB = append(wardrobeDB, item)
		w.WriteHeader(http.StatusCreated)
		json.NewEncoder(w).Encode(item)
		return
	}
}

// コーディネート提案API（雛形）
func OutfitSuggestionsHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	w.Write([]byte(`{"message": "outfit suggestions endpoint"}`))
}
