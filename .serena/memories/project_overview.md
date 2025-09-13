# プロジェクト概要

## プロジェクトの目的
- 名前：kadai2
- TanStack Routerを使用したReactアプリケーション
- SupabaseとFirebaseを統合したフルスタックWebアプリケーション

## 技術スタック
- **フロントエンド**: React 19, TypeScript
- **ルーティング**: TanStack Router（ファイルベースルーティング）
- **スタイリング**: Tailwind CSS v4
- **バックエンド**: Supabase
- **デプロイ**: Firebase Hosting
- **ビルドツール**: Vite
- **テスト**: Vitest + Testing Library
- **パッケージマネージャー**: pnpm

## アーキテクチャ
- SPAアプリケーション
- ファイルベースルーティング（src/routesディレクトリ）
- パスエイリアス設定（@/* -> src/*）
- モジュール型アーキテクチャ（lib/, types/, routes/）