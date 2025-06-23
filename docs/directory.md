# ディレクトリ構成

## プロジェクト全体構成

```
ForJules/
├── .cursorrules              # 開発ルール定義
├── .gitignore               # Git除外設定
├── LICENSE                  # ライセンス情報
├── README.md                # プロジェクト概要
├── package.json             # プロジェクト設定・スクリプト
├── go.mod                   # Go module定義（プロジェクトルート）
├── main.go                  # Go メインファイル（プロジェクトルート）
├── bun.lock                 # Bun依存関係ロックファイル
├── todo.md                  # 旧Todo管理（移行済み）
│
├── backend/                 # Go バックエンドAPI
│   ├── go.mod              # Go module定義
│   ├── main.go             # APIサーバーエントリーポイント
│   ├── README.md           # バックエンド説明
│   ├── db/                 # データベース関連
│   │   ├── db.go          # DB接続・CRUD操作
│   │   ├── schema.sql     # DBスキーマ定義
│   │   └── forjules.db    # SQLiteデータベースファイル（実行時生成）
│   ├── handlers/           # HTTPハンドラー
│   │   └── handlers.go    # API エンドポイント処理
│   └── models/             # データモデル
│       └── models.go      # Go構造体定義
│
├── frontend/               # Next.js フロントエンド
│   ├── package.json       # フロントエンド依存関係
│   ├── package-lock.json  # npm依存関係ロック
│   ├── next.config.js     # Next.js設定
│   ├── tailwind.config.js # Tailwind CSS設定
│   ├── postcss.config.js  # PostCSS設定
│   ├── tsconfig.json      # TypeScript設定
│   ├── tsconfig.tsbuildinfo # TypeScript キャッシュ
│   ├── next-env.d.ts      # Next.js型定義
│   ├── README.md          # フロントエンド説明
│   ├── .eslintrc.json     # ESLint設定
│   ├── public/            # 静的ファイル
│   │   └── index.html     # HTML雛形
│   └── src/               # ソースコード
│       ├── app/           # App Router ページ
│       │   ├── layout.tsx # ルートレイアウト
│       │   ├── page.tsx   # ホームページ
│       │   ├── wardrobe/  # ワードローブ管理
│       │   │   ├── page.tsx      # ワードローブ一覧
│       │   │   └── add/
│       │   │       └── page.tsx  # アイテム追加
│       │   └── outfit-suggestions/  # コーディネート提案
│       │       └── page.tsx
│       ├── components/    # Reactコンポーネント
│       │   └── ui/
│       │       └── LoadingSpinner.tsx
│       ├── lib/           # ユーティリティ・API
│       │   └── api.ts     # APIクライアント
│       ├── styles/        # スタイル
│       │   └── globals.css
│       └── types/         # TypeScript型定義
│           └── index.ts
│
├── cvml/                   # Python 画像解析・機械学習
│   ├── analyze.py         # 画像解析メインスクリプト
│   ├── requirements.txt   # Python依存関係
│   └── README.md          # ML/CV説明
│
└── docs/                   # プロジェクトドキュメント
    ├── README.md          # ドキュメント概要
    ├── fundamental.md     # 基本方針・API設計
    ├── definition.md      # 要件定義
    ├── directory.md       # このファイル（ディレクトリ構成）
    ├── todo/              # タスク管理
    │   └── Todo-2025-06-23.md
    ├── finTask/           # 完了タスク記録
    │   └── finTask-2025-06-23.md
    └── wireframes/        # UI/UXワイヤーフレーム
        ├── README.md
        ├── wardrobe-wireframe.md
        └── outfit-suggestions-wireframe.md
```

## 各ディレクトリの責務

### `/backend` - Go APIサーバー
- **目的**: RESTful API提供、ビジネスロジック処理
- **技術**: Go + Gorilla Mux + SQLite
- **主要機能**: 
  - ワードローブアイテムCRUD
  - コーディネート提案API
  - 画像解析結果保存
  - 認証・認可（今後実装）

### `/frontend` - Next.js Webアプリ  
- **目的**: ユーザーインターフェース提供
- **技術**: Next.js 14 + TypeScript + Tailwind CSS
- **主要機能**:
  - レスポンシブWebUI
  - 画像アップロード
  - リアルタイム検索・フィルター
  - API通信

### `/cvml` - Python 画像解析
- **目的**: AI/ML処理、画像分析
- **技術**: Python + OpenCV + scikit-learn + TensorFlow
- **主要機能**:
  - 服装画像の色・パターン・カテゴリ分析
  - 特徴抽出・分類
  - APIとの連携

### `/docs` - プロジェクトドキュメント
- **目的**: 開発・運用ドキュメント管理
- **構成**:
  - **fundamental.md**: API設計方針
  - **definition.md**: 要件定義
  - **directory.md**: ディレクトリ構成（このファイル）
  - **todo/**: 進行中タスク管理
  - **finTask/**: 完了タスク記録
  - **wireframes/**: UI/UX設計

## ファイル命名規則

### 日付形式
- `YYYY-MM-DD` 形式で統一
- 例: `Todo-2025-06-23.md`, `finTask-2025-06-23.md`

### ディレクトリ名
- 小文字・ハイフン区切り推奨
- 例: `outfit-suggestions`, `wardrobe-wireframe`

### ファイル名
- 機能・目的を明確に示す
- TypeScript: PascalCase (例: `LoadingSpinner.tsx`)
- その他: kebab-case (例: `api.ts`, `schema.sql`)

## 最終更新
**日時**: 2025-06-23  
**更新内容**: finTaskディレクトリ追加、最新の実装状況反映
