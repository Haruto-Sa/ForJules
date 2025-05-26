# バックエンド基礎機能まとめ（fundamental.md）

## 概要

本ドキュメントは、ForJules プロジェクトのバックエンド（Go 製 Web API サーバー）の基礎的な機能についてまとめたものです。

---

## 1. API エンドポイント

- `/api/wardrobe`
  - **GET**: ユーザーのワードローブ（服の一覧）を取得
  - **POST**: 新しい服アイテムを追加
- `/api/outfit_suggestions`
  - **GET**: コーディネート提案（現状は雛形）

---

## 2. ディレクトリ構成（抜粋）

- `backend/main.go` : サーバー起動・ルーティング
- `backend/handlers/handlers.go` : API ハンドラ実装
- `backend/models/models.go` : DB モデル定義
- `backend/db/db.go` : DB 接続・マイグレーション（今後実装）

---

## 3. モデル例

```go
// models/models.go
package models

type WardrobeItem struct {
    ID       int      `json:"id"`
    Type     string   `json:"type"`
    Color    string   `json:"color"`
    Pattern  string   `json:"pattern"`
    StyleTag []string `json:"style_tag"`
}
```

---

## 4. ハンドラ例

```go
// handlers/handlers.go
func WardrobeHandler(w http.ResponseWriter, r *http.Request) {
    // GET: 一覧取得
    // POST: 追加
}

func OutfitSuggestionsHandler(w http.ResponseWriter, r *http.Request) {
    // コーディネート提案（雛形）
}
```

---

## 5. サーバー起動例

```sh
cd backend
# 依存パッケージインストール
# go mod tidy
# サーバー起動
# go run main.go
```

---

## 6. 今後の拡張

- DB 接続（SQLite, PostgreSQL 等）
- 認証・認可
- コーディネート提案ロジックの実装
- 外部 CV/ML サービスとの連携
