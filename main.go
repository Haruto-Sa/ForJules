package main

import (
	"log"
	"net/http"
	"github.com/gorilla/mux"
)

func main() {
	r := mux.NewRouter()

	// APIエンドポイント
	r.HandleFunc("/api/wardrobe", WardrobeHandler).Methods("GET", "POST")
	r.HandleFunc("/api/outfit_suggestions", OutfitSuggestionsHandler).Methods("GET")

	log.Println("Server started at :8080")
	log.Fatal(http.ListenAndServe(":8080", r))
}

// ワードローブ管理用ハンドラ
func WardrobeHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	w.Write([]byte(`{"message": "wardrobe endpoint"}`))
}

// コーディネート提案用ハンドラ
func OutfitSuggestionsHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	w.Write([]byte(`{"message": "outfit suggestions endpoint"}`))
}
