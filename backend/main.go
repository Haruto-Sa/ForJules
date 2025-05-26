package main

import (
	"log"
	"net/http"
	"github.com/gorilla/mux"
	"github.com/sasakiharushou/ForJules/backend/handlers"
)

func main() {
	r := mux.NewRouter()

	// APIエンドポイント
	r.HandleFunc("/api/wardrobe", handlers.WardrobeHandler).Methods("GET", "POST")
	r.HandleFunc("/api/outfit_suggestions", handlers.OutfitSuggestionsHandler).Methods("GET")

	log.Println("Server started at :8080")
	log.Fatal(http.ListenAndServe(":8080", r))
}
