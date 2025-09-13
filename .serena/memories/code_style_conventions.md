# コードスタイルと規約

## TypeScript設定
- 厳密なTypeScript設定（strict: true）
- 未使用の変数・パラメータはエラー
- ES2022ターゲット
- React JSX形式
- 型チェック必須（tsc）

## コードスタイル
- ESModuleを使用（type: "module"）
- パスエイリアス：`@/*` → `src/*`
- JSXファイル拡張子：`.tsx`
- ファイル名：kebab-case推奨

## プロジェクト構造規約
- `src/routes/` - TanStack Routerのファイルベースルーティング
- `src/lib/` - ユーティリティとサービス
- `src/types/` - 型定義
- `__root.tsx` - レイアウトコンポーネント

## インポート規約
- 外部ライブラリを最初に
- 内部モジュールは`@/`エイリアスを使用
- 相対パスは避ける