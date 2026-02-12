# dry-orgasm-guide

ドライオーガズム6ヶ月完全開発ガイド - 購入者向けリソースサイト

## サイト構成

```
/
├── index.html          # トップページ（ナビゲーション）
├── css/
│   └── style.css       # 共通スタイルシート
├── images/             # 画像ファイル用
├── pages/
│   ├── items.html      # 必須アイテムリスト
│   ├── audio.html      # おすすめ催眠音声ガイド
│   └── links.html      # 参考リンク集
└── .nojekyll           # GitHub Pages用（Jekyll処理をスキップ）
```

## デプロイ方法

1. GitHubリポジトリのSettings > Pages を開く
2. Source を `Deploy from a branch` に設定
3. Branch を `main` / `/ (root)` に設定
4. Save で公開される