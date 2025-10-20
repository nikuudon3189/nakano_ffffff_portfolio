// スクロールに応じてHTMLの背景色を変更するスクリプト
document.addEventListener('DOMContentLoaded', function () {
    // スクロールイベントを監視
    window.addEventListener('scroll', function () {
        // 現在のスクロール位置を取得
        const scrollY = window.scrollY;

        // 500px以上スクロールしたら背景色を変更
        if (scrollY >= 500) {
            document.documentElement.style.backgroundColor = '#e6e6e6';
        } else {
            document.documentElement.style.backgroundColor = '#f4f4f4';
        }
    });
});
