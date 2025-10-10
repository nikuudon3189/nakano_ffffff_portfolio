# Nakano Portfolio

中野さんのポートフォリオサイト

## 概要

デザイナー中野さんの作品を紹介するポートフォリオサイトです。

## 技術スタック

- **HTML**: Pug テンプレートエンジン
- **CSS**: SCSS (Sass)
- **JavaScript**: バニラJS (ES5準拠)
- **フォント**: 
  - Konshoku (ひらがな・カタカナ・漢字)
  - Nuosu SIL (英語)
  - IBM Plex Sans JP

## 主な機能

### 🎭 アニメーション機能
- **タイプライターエフェクト** (`typeWriter.js`)
  - ハッキング風ランダム文字表示
  - 日本語・英語の言語別速度設定
  - 文字が段階的に確定していくエフェクト


- **スクロールフェードイン** (`fadeInOnScroll.js`)
  - h2見出しが画面内に入ると1文字ずつスライドイン
  - Intersection Observer使用
  - 空白・記号はアニメーション対象外

### 🎨 UI/UX機能
- **レスポンシブデザイン** (PC・スマートフォン対応)
- **ハンバーガーメニュー** (`btn-open.js`)
- **文字サイズ自動調整** (`font-size-window-fit.js`)
- **日本語テキスト改行最適化**

### 📱 ページ構成
- **トップページ** (`index.html`) - 作品一覧
- **プロフィールページ** (`profile.html`) - 自己紹介・制作フロー・料金
- **作品詳細ページ** (`work.html`) - 個別作品紹介

## ファイル構成

```
/
├── index.pug              # トップページ
├── profile.pug            # プロフィールページ
├── work.pug              # 作品詳細ページ
├── layout.pug            # 共通レイアウト
├── _footer.pug           # フッター
├── scss/
│   └── style.scss        # メインスタイル
├── style.css             # コンパイル済みCSS
├── js/
│   ├── typeWriter.js     # タイプライターエフェクト
│   ├── fadeInOnScroll.js # スクロールフェードイン
│   ├── btn-open.js       # メニュー開閉
│   └── font-size-window-fit.js # 文字サイズ調整
├── images/               # 画像ファイル
├── fonts/                # Webフォント
└── README.md
```

## セットアップ

### 必要な環境
- Node.js (Pugコンパイル用)
- Sass (SCSSコンパイル用)

### 開発手順

1. **リポジトリのクローン**
```bash
git clone [repository-url]
cd nakano-portfolio
```

2. **依存関係のインストール**
```bash
npm install
```

3. **Pugファイルのコンパイル**
```bash
# index.pugをindex.htmlに変換
pug index.pug
pug profile.pug
pug work.pug
```

4. **SCSSファイルのコンパイル**
```bash
# style.scssをstyle.cssに変換
sass scss/style.scss style.css
```

5. **ローカルサーバーでプレビュー**
```bash
# 任意のローカルサーバーを起動
python -m http.server 8000
# または
npx serve .
```

## カスタマイズ

### アニメーション設定の調整

#### タイプライターエフェクト
```javascript
// typeWriter.js内の設定
var CONFIG = {
    DEFAULT_SETTINGS: {
        japanese: {
            glitchSpeed: 12,    // 速度調整
            glitchDuration: 100, // 表示時間
            waveLength: 4        // 同時表示文字数
        }
    }
};
```

#### フェードイン遅延時間
```javascript
// fadeInOnScroll.js内
span.style.transitionDelay = (i * 0.04) + 's'; // 0.04sを調整
```

### 色・フォントの変更
`scss/style.scss`で以下を調整：
- カラーパレット
- フォントサイズ
- レスポンシブブレイクポイント

## ブラウザ対応

- **モダンブラウザ**: Chrome, Firefox, Safari, Edge (最新版)
- **IE対応**: なし (ES5記法使用だが、IntersectionObserver等モダンAPI使用)
- **モバイル**: iOS Safari, Android Chrome

## パフォーマンス最適化

- フォントの最適化 (unicode-range指定)
- 画像の遅延読み込み
- CSS/JSの軽量化
- Intersection Observerによる効率的なスクロール監視

## ライセンス

このプロジェクトは中野さんの個人ポートフォリオサイトです。

## 更新履歴

- **v1.0**: 初回リリース
- 基本的なポートフォリオ機能
- タイプライターエフェクト実装
- サムネイル拡大遷移実装
- スクロールアニメーション実装 