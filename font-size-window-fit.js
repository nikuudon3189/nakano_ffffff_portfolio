// テキストを画面幅に合わせてリサイズする関数
function resizeTextToFit() {
    // SPサイズ（809px以下）の場合のみ実行
    if (window.innerWidth <= 809) {
        // .text-fit クラスを持つ要素を取得
        const el = document.querySelector('.text-fit');
        // テキストの文字数を取得
        const textLength = el.textContent.length;
        // 画面幅のNN%を目標幅として設定
        const targetWidth = window.innerWidth * 1.3;
        // 1文字あたりのフォントサイズを計算（目標幅÷文字数）
        const fontSize = targetWidth / textLength;
        // 計算したフォントサイズを要素に適用
        el.style.fontSize = fontSize + 'px';
    } else {
        // PCサイズの場合はデフォルトのフォントサイズに戻す
        const el = document.querySelector('.text-fit');
        el.style.fontSize = ''; // スタイルをリセット
    }
}

// ページ読み込み時に実行
resizeTextToFit();
// ウィンドウサイズが変更されるたびに実行
window.addEventListener('resize', resizeTextToFit);