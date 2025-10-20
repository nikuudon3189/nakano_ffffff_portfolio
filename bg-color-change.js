// スクロールに応じてHTMLの背景色を変更するスクリプト
document.addEventListener('DOMContentLoaded', function () {
    // スクロールイベントを監視
    window.addEventListener('scroll', function () {
        // 現在のスクロール位置を取得
        const scrollY = window.scrollY;

        // フッターの位置を取得
        const footer = document.querySelector('.footer-wrapper');

        // フッターが存在する場合のみ処理
        if (footer) {
            const footerTop = footer.offsetTop;

            // フッターに到達したら背景色を変更
            if (scrollY >= footerTop) {
                document.documentElement.style.backgroundColor = '#e6e6e6';
            } else {
                document.documentElement.style.backgroundColor = '#f4f4f4';
            }
        }
    });
});
