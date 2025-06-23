-- ForJules アプリケーション用データベーススキーマ
-- SQLite を想定したスキーマ設計

-- ユーザーテーブル
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- ワードローブアイテムテーブル
CREATE TABLE IF NOT EXISTS wardrobe_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    type VARCHAR(50) NOT NULL, -- 'tops', 'bottoms', 'shoes', 'accessories', 'outerwear'
    color VARCHAR(50) NOT NULL,
    pattern VARCHAR(50), -- 'solid', 'striped', 'polka_dot', 'floral', etc.
    brand VARCHAR(100),
    size VARCHAR(20),
    material VARCHAR(100),
    season VARCHAR(20), -- 'spring', 'summer', 'autumn', 'winter', 'all_year'
    style_casual BOOLEAN DEFAULT FALSE,
    style_formal BOOLEAN DEFAULT FALSE,
    style_sporty BOOLEAN DEFAULT FALSE,
    style_elegant BOOLEAN DEFAULT FALSE,
    image_path VARCHAR(255),
    notes TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- コーディネートテーブル
CREATE TABLE IF NOT EXISTS outfits (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    name VARCHAR(100) NOT NULL,
    occasion VARCHAR(100), -- 'work', 'casual', 'party', 'date', 'sports', etc.
    weather VARCHAR(50), -- 'sunny', 'rainy', 'snowy', 'windy', 'hot', 'cold'
    rating INTEGER DEFAULT 0 CHECK (rating >= 0 AND rating <= 5),
    image_path VARCHAR(255),
    notes TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- コーディネートアイテム関連テーブル
CREATE TABLE IF NOT EXISTS outfit_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    outfit_id INTEGER NOT NULL,
    wardrobe_item_id INTEGER NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (outfit_id) REFERENCES outfits(id) ON DELETE CASCADE,
    FOREIGN KEY (wardrobe_item_id) REFERENCES wardrobe_items(id) ON DELETE CASCADE,
    UNIQUE(outfit_id, wardrobe_item_id)
);

-- 画像解析結果テーブル
CREATE TABLE IF NOT EXISTS image_analysis (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    wardrobe_item_id INTEGER NOT NULL,
    analysis_type VARCHAR(50) NOT NULL, -- 'color_detection', 'pattern_recognition', 'category_classification'
    result_data JSON, -- 解析結果をJSON形式で保存
    confidence_score REAL, -- 信頼度スコア (0.0 ~ 1.0)
    analyzed_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (wardrobe_item_id) REFERENCES wardrobe_items(id) ON DELETE CASCADE
);

-- スタイルタグテーブル
CREATE TABLE IF NOT EXISTS style_tags (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name VARCHAR(50) UNIQUE NOT NULL,
    description TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- ワードローブアイテム スタイルタグ 関連テーブル
CREATE TABLE IF NOT EXISTS wardrobe_item_style_tags (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    wardrobe_item_id INTEGER NOT NULL,
    style_tag_id INTEGER NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (wardrobe_item_id) REFERENCES wardrobe_items(id) ON DELETE CASCADE,
    FOREIGN KEY (style_tag_id) REFERENCES style_tags(id) ON DELETE CASCADE,
    UNIQUE(wardrobe_item_id, style_tag_id)
);

-- インデックス作成
CREATE INDEX IF NOT EXISTS idx_wardrobe_items_user_id ON wardrobe_items(user_id);
CREATE INDEX IF NOT EXISTS idx_wardrobe_items_type ON wardrobe_items(type);
CREATE INDEX IF NOT EXISTS idx_outfits_user_id ON outfits(user_id);
CREATE INDEX IF NOT EXISTS idx_outfit_items_outfit_id ON outfit_items(outfit_id);
CREATE INDEX IF NOT EXISTS idx_image_analysis_wardrobe_item_id ON image_analysis(wardrobe_item_id);

-- 初期データ投入
INSERT OR IGNORE INTO style_tags (name, description) VALUES
    ('カジュアル', '日常的でリラックスしたスタイル'),
    ('フォーマル', 'ビジネスや正式な場面に適したスタイル'),
    ('エレガント', '上品で洗練されたスタイル'),
    ('スポーティ', '運動やアクティブな活動に適したスタイル'),
    ('ボヘミアン', '自由奔放で芸術的なスタイル'),
    ('ミニマル', 'シンプルで無駄のないスタイル'),
    ('ヴィンテージ', 'レトロで古風な魅力を持つスタイル'),
    ('ストリート', '都市的でトレンディなスタイル'); 