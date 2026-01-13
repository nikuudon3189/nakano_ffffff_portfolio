// テキストを画面幅に合わせてリサイズする関数
function resizeTextToFit() {
    // .text-fit クラスを持つ要素を取得（フッターのメールアドレス）
    const footerMail = document.querySelector('.text-fit');

    if (footerMail) {
        // SPサイズ（809px以下）の場合のみ実行
        if (window.innerWidth <= 809) {
            // テキストの文字数を取得
            const textLength = footerMail.textContent.length;
            // 画面幅のNN%を目標幅として設定
            const targetWidth = window.innerWidth * 1.6;
            // 1文字あたりのフォントサイズを計算（目標幅÷文字数）
            const fontSize = targetWidth / textLength;
            // 計算したフォントサイズを要素に適用
            footerMail.style.fontSize = fontSize + 'px';
        } else {
            // PCサイズの場合はデフォルトのフォントサイズに戻す
            footerMail.style.fontSize = ''; // スタイルをリセット
        }
    }

    // メニューのメールアドレスを取得
    const menuMail = document.querySelector('.menu--hidden__contact__mail');

    if (menuMail) {
        // SPサイズ（809px以下）の場合のみ実行
        if (window.innerWidth <= 809) {
            // メニュー要素を取得して、実際の幅を取得
            const menu = document.querySelector('.menu');
            if (menu) {
                const menuWidth = menu.offsetWidth || 640; // メニューの実際の幅、取得できない場合は640pxをデフォルト値として使用
                const menuPadding = 32; // 左右のパディング（16px * 2）
                // 黒背景の幅いっぱい（98%程度）を目標幅として設定
                const targetWidth = (menuWidth - menuPadding) * 1.2;
                // テキストの文字数を取得
                const textLength = menuMail.textContent.length;
                // 1文字あたりのフォントサイズを計算（目標幅÷文字数）、さらに1.4倍して大きくする
                const fontSize = (targetWidth / textLength) * 1.4;
                // 計算したフォントサイズを要素に適用
                menuMail.style.fontSize = fontSize + 'px';
            }
        } else {
            // PCサイズの場合はデフォルトのフォントサイズに戻す
            menuMail.style.fontSize = ''; // スタイルをリセット
        }
    }
}

// ウィンドウサイズが変更されるたびに実行
window.addEventListener('resize', resizeTextToFit);

// メニューが開いた時にも再計算
document.addEventListener('DOMContentLoaded', () => {
    // メニューが開いたことを検知するために、MutationObserverを使用
    const menu = document.querySelector('.menu');
    if (menu) {
        const observer = new MutationObserver(() => {
            // メニューが開いた時（is-openクラスが追加された時）に再計算
            if (menu.classList.contains('is-open')) {
                // 少し遅延させてから実行（アニメーション完了後）
                setTimeout(() => {
                    resizeTextToFit();
                }, 600);
            }
        });
        observer.observe(menu, { attributes: true, attributeFilter: ['class'] });
    }
});