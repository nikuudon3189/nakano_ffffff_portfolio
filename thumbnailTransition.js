/**
 * サムネイル拡大遷移アニメーション
 * クリックされたサムネイルが画面いっぱいに広がってからページ遷移
 */

document.addEventListener('DOMContentLoaded', function () {
    initThumbnailTransition();
});

function initThumbnailTransition() {
    // 全てのwork linkを取得
    var workLinks = document.querySelectorAll('section.client-works article.work a.link, section.private-works article.work');

    for (var i = 0; i < workLinks.length; i++) {
        workLinks[i].addEventListener('click', handleThumbnailClick);
    }
}

function handleThumbnailClick(event) {
    event.preventDefault();

    var link = event.currentTarget;
    var img = link.querySelector('img');
    var href = link.getAttribute('href') || 'work.html';

    if (!img) return;

    // --- 白オーバーレイを作成 ---
    var fadeOverlay = document.createElement('div');
    fadeOverlay.className = 'page-fadeout-overlay';
    document.body.appendChild(fadeOverlay);

    // サムネイルの現在位置とサイズを取得
    var imgRect = img.getBoundingClientRect();

    // 画像のクローンを作成
    var clonedImg = img.cloneNode(true);
    clonedImg.style.position = 'fixed';
    clonedImg.style.top = imgRect.top + 'px';
    clonedImg.style.left = imgRect.left + 'px';
    clonedImg.style.width = imgRect.width + 'px';
    clonedImg.style.height = imgRect.height + 'px';
    clonedImg.style.zIndex = '9999';
    clonedImg.style.transition = 'all 0.15s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
    clonedImg.style.objectFit = 'cover';

    // クローンをbodyに追加
    document.body.appendChild(clonedImg);

    // 元の画像を非表示
    img.style.opacity = '0';

    // アニメーション完了を検知するためのフラグ
    var transitionCompleted = false;

    function onTransitionEnd() {
        if (!transitionCompleted) {
            transitionCompleted = true;
            setTimeout(function () {
                window.location.href = href;
            }, 30);
        }
    }

    clonedImg.addEventListener('transitionend', onTransitionEnd);
    setTimeout(onTransitionEnd, 250);

    // アニメーション開始（次のフレームで実行）
    requestAnimationFrame(function () {
        // 白オーバーレイをフェードイン
        fadeOverlay.classList.add('active');
        // サムネイル拡大
        clonedImg.style.top = '0px';
        clonedImg.style.left = '0px';
        clonedImg.style.width = '100vw';
        clonedImg.style.height = '80vh';
        clonedImg.style.borderRadius = '0';
    });
}

// ページ戻り時のクリーンアップ
window.addEventListener('pageshow', function (event) {
    if (event.persisted) {
        var overlay = document.querySelector('.page-transition-overlay');
        var fadeOverlay = document.querySelector('.page-fadeout-overlay');
        var clonedImg = document.querySelector('img[style*="z-index: 9999"]');
        if (overlay) overlay.remove();
        if (fadeOverlay) fadeOverlay.remove();
        if (clonedImg) clonedImg.remove();
        var images = document.querySelectorAll('section.client-works img, section.private-works img');
        for (var i = 0; i < images.length; i++) {
            images[i].style.opacity = '1';
        }
    }
}); 