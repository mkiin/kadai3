# 推奨コマンド

## 開発コマンド
- `pnpm install` - 依存関係をインストール
- `pnpm dev` または `pnpm start` - 開発サーバーを起動（ポート3000）
- `pnpm build` - 本番用ビルド（Vite + TypeScript型チェック）
- `pnpm serve` - ビルド後のプレビューサーバー
- `pnpm test` - Vitestでテスト実行

## 型定義生成
- `pnpm generate-types` - Supabaseの型定義を生成

## デプロイ
- `make deploy` - Firebaseへデプロイ（ビルド + firebase deploy）

## 有用なシステムコマンド（Linux）
- `git status` - Gitの状態確認
- `ls -la` - ファイル一覧表示
- `cd <directory>` - ディレクトリ移動
- `grep -r <pattern> .` - パターン検索
- `find . -name <pattern>` - ファイル名検索