// backend/db/db.go は、データベースとのインタラクションに関連するすべての関数を管理します。
// これには、データベース接続の確立、データの作成、読み取り、更新、削除 (CRUD) 操作などが含まれます。
package db

import (
	"database/sql"
	"fmt"
	"log"
	"os"
	"path/filepath"

	_ "github.com/mattn/go-sqlite3"
	"github.com/sasakiharushou/ForJules/backend/models"
)

var db *sql.DB

// InitDB はデータベース接続を初期化し、必要なテーブルを作成します
func InitDB() error {
	// データベースファイルのパスを設定
	dbPath := filepath.Join("backend", "db", "forjules.db")
	
	// データベースディレクトリが存在しない場合は作成
	dbDir := filepath.Dir(dbPath)
	if err := os.MkdirAll(dbDir, 0755); err != nil {
		return fmt.Errorf("データベースディレクトリの作成に失敗しました: %v", err)
	}

	var err error
	db, err = sql.Open("sqlite3", dbPath)
	if err != nil {
		return fmt.Errorf("データベース接続に失敗しました: %v", err)
	}

	// 接続テスト
	if err = db.Ping(); err != nil {
		return fmt.Errorf("データベースへのping失敗: %v", err)
	}

	// スキーマファイルを読み込んでテーブルを作成
	if err = createTables(); err != nil {
		return fmt.Errorf("テーブル作成に失敗しました: %v", err)
	}

	log.Println("データベース初期化完了")
	return nil
}

// createTables はスキーマファイルを読み込んでテーブルを作成します
func createTables() error {
	schemaPath := filepath.Join("backend", "db", "schema.sql")
	schemaBytes, err := os.ReadFile(schemaPath)
	if err != nil {
		return fmt.Errorf("スキーマファイルの読み込み失敗: %v", err)
	}

	schema := string(schemaBytes)
	if _, err = db.Exec(schema); err != nil {
		return fmt.Errorf("スキーマ実行失敗: %v", err)
	}

	return nil
}

// CloseDB はデータベース接続を閉じます
func CloseDB() error {
	if db != nil {
		return db.Close()
	}
	return nil
}

// GetDB はデータベース接続を返します
func GetDB() *sql.DB {
	return db
}

// CreateWardrobeItem は新しいワードローブアイテムをデータベースに作成します
func CreateWardrobeItem(item *models.WardrobeItem) error {
	query := `
		INSERT INTO wardrobe_items (
			user_id, type, color, pattern, brand, size, material, season,
			style_casual, style_formal, style_sporty, style_elegant,
			image_path, notes
		) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
	`

	result, err := db.Exec(query,
		item.UserID, item.Type, item.Color, item.Pattern, item.Brand,
		item.Size, item.Material, item.Season, item.StyleCasual,
		item.StyleFormal, item.StyleSporty, item.StyleElegant,
		item.ImagePath, item.Notes)

	if err != nil {
		return fmt.Errorf("アイテム作成失敗: %v", err)
	}

	id, err := result.LastInsertId()
	if err != nil {
		return fmt.Errorf("ID取得失敗: %v", err)
	}

	item.ID = int(id)
	return nil
}

// GetWardrobeItems は指定されたユーザーのワードローブアイテムを取得します
func GetWardrobeItems(userID int) ([]models.WardrobeItem, error) {
	query := `
		SELECT id, user_id, type, color, pattern, brand, size, material, season,
			   style_casual, style_formal, style_sporty, style_elegant,
			   image_path, notes, created_at, updated_at
		FROM wardrobe_items
		WHERE user_id = ?
		ORDER BY created_at DESC
	`

	rows, err := db.Query(query, userID)
	if err != nil {
		return nil, fmt.Errorf("アイテム取得失敗: %v", err)
	}
	defer rows.Close()

	var items []models.WardrobeItem
	for rows.Next() {
		var item models.WardrobeItem
		err := rows.Scan(
			&item.ID, &item.UserID, &item.Type, &item.Color, &item.Pattern,
			&item.Brand, &item.Size, &item.Material, &item.Season,
			&item.StyleCasual, &item.StyleFormal, &item.StyleSporty, &item.StyleElegant,
			&item.ImagePath, &item.Notes, &item.CreatedAt, &item.UpdatedAt)
		if err != nil {
			return nil, fmt.Errorf("行スキャン失敗: %v", err)
		}
		items = append(items, item)
	}

	return items, nil
}

// GetWardrobeItemByID は指定されたIDのワードローブアイテムを取得します
func GetWardrobeItemByID(id int) (*models.WardrobeItem, error) {
	query := `
		SELECT id, user_id, type, color, pattern, brand, size, material, season,
			   style_casual, style_formal, style_sporty, style_elegant,
			   image_path, notes, created_at, updated_at
		FROM wardrobe_items
		WHERE id = ?
	`

	var item models.WardrobeItem
	err := db.QueryRow(query, id).Scan(
		&item.ID, &item.UserID, &item.Type, &item.Color, &item.Pattern,
		&item.Brand, &item.Size, &item.Material, &item.Season,
		&item.StyleCasual, &item.StyleFormal, &item.StyleSporty, &item.StyleElegant,
		&item.ImagePath, &item.Notes, &item.CreatedAt, &item.UpdatedAt)

	if err != nil {
		if err == sql.ErrNoRows {
			return nil, fmt.Errorf("アイテムが見つかりません")
		}
		return nil, fmt.Errorf("アイテム取得失敗: %v", err)
	}

	return &item, nil
}

// UpdateWardrobeItem は既存のワードローブアイテムを更新します
func UpdateWardrobeItem(item *models.WardrobeItem) error {
	query := `
		UPDATE wardrobe_items SET
			type = ?, color = ?, pattern = ?, brand = ?, size = ?, material = ?, season = ?,
			style_casual = ?, style_formal = ?, style_sporty = ?, style_elegant = ?,
			image_path = ?, notes = ?, updated_at = CURRENT_TIMESTAMP
		WHERE id = ?
	`

	_, err := db.Exec(query,
		item.Type, item.Color, item.Pattern, item.Brand, item.Size, item.Material, item.Season,
		item.StyleCasual, item.StyleFormal, item.StyleSporty, item.StyleElegant,
		item.ImagePath, item.Notes, item.ID)

	if err != nil {
		return fmt.Errorf("アイテム更新失敗: %v", err)
	}

	return nil
}

// DeleteWardrobeItem は指定されたIDのワードローブアイテムを削除します
func DeleteWardrobeItem(id int) error {
	query := "DELETE FROM wardrobe_items WHERE id = ?"
	
	result, err := db.Exec(query, id)
	if err != nil {
		return fmt.Errorf("アイテム削除失敗: %v", err)
	}

	rowsAffected, err := result.RowsAffected()
	if err != nil {
		return fmt.Errorf("削除結果確認失敗: %v", err)
	}

	if rowsAffected == 0 {
		return fmt.Errorf("削除するアイテムが見つかりません")
	}

	return nil
}
