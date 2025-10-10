/**
 * Grid Animation Library
 * imgタグに "grid-animation" クラスを追加するだけで使用可能
 */
(function () {
    'use strict';

    // 設定
    var config = {
        gridCols: 8,
        gridRows: 6,
        delayMin: 2,
        delayMax: 20,
        blinkPattern: [
            [20, 30],
            [20, 60],
            [80, 100],
            [40, 50]
        ],
        reverseNDelay: 200 // 逆N字順の遅延時間
    };

    // imgタグをグリッドアニメーションに変換
    function initGridAnimation(img) {
        // すでに処理済みの場合はスキップ
        if (img.dataset.gridInitialized) return;
        img.dataset.gridInitialized = 'true';

        // 画像の読み込みを待つ
        if (!img.complete) {
            img.addEventListener('load', function () {
                transformToGrid(img);
            });
        } else {
            transformToGrid(img);
        }
    }

    function transformToGrid(img) {
        var imageUrl = img.src;
        var width = img.offsetWidth || img.width;
        var height = img.offsetHeight || img.height;

        console.log('transformToGrid called:', {
            src: imageUrl,
            width: width,
            height: height,
            complete: img.complete
        });

        // 画像URLが空の場合はスキップ
        if (!imageUrl || imageUrl === '' || imageUrl.endsWith('/work.html')) {
            console.log('Skipping empty or invalid image:', imageUrl);
            return;
        }

        // サイズが0の場合はスキップ
        if (width === 0 || height === 0) {
            console.log('Skipping image with 0 dimensions');
            return;
        }

        // 元の画像を非表示にする
        img.style.opacity = '0';
        img.style.transition = 'opacity 0.3s ease';

        // コンテナを作成（元の画像の上に配置）
        var container = document.createElement('div');
        container.className = 'grid-animation-container';
        container.style.position = 'absolute';
        container.style.top = '0';
        container.style.left = '0';
        container.style.width = width + 'px';
        container.style.height = height + 'px';
        container.style.display = 'grid';
        container.style.gridTemplateColumns = 'repeat(' + config.gridCols + ', 1fr)';
        container.style.gridTemplateRows = 'repeat(' + config.gridRows + ', 1fr)';
        container.style.gap = '0';
        container.style.zIndex = '1';

        // 親要素を相対位置に設定
        if (img.parentNode.style.position !== 'absolute' && img.parentNode.style.position !== 'relative') {
            img.parentNode.style.position = 'relative';
        }

        // コンテナをimgの後に挿入
        img.parentNode.insertBefore(container, img.nextSibling);

        var totalItems = config.gridCols * config.gridRows;

        // グリッドアイテムを生成
        for (var i = 0; i < totalItems; i++) {
            var gridItem = document.createElement('div');
            gridItem.className = 'grid-animation-item';

            var row = Math.floor(i / config.gridCols);
            var col = i % config.gridCols;

            var posX = (col / (config.gridCols - 1)) * 100;
            var posY = (row / (config.gridRows - 1)) * 100;

            gridItem.style.width = '100%';
            gridItem.style.height = '100%';
            gridItem.style.backgroundImage = 'url(' + imageUrl + ')';
            gridItem.style.backgroundSize = (config.gridCols * 100) + '% ' + (config.gridRows * 100) + '%';
            gridItem.style.backgroundPosition = posX + '% ' + posY + '%';
            gridItem.style.opacity = '0';
            gridItem.style.transition = 'opacity 0.3s ease-in-out';

            container.appendChild(gridItem);
        }

        // アニメーション開始
        startAnimation(container, img);
    }

    function startAnimation(container, originalImg) {
        var gridItems = container.querySelectorAll('.grid-animation-item');
        var totalItems = config.gridCols * config.gridRows;
        var maxOrder = totalItems - 1;

        gridItems.forEach(function (item, index) {
            var row = Math.floor(index / config.gridCols);
            var col = index % config.gridCols;

            // Z順
            var zOrder = index;
            var zStartTime = calculateCumulativeTime(zOrder, maxOrder);

            // 逆N字順
            var reverseNOrder = col * config.gridRows + row;
            var reverseNStartTime = calculateCumulativeTime(reverseNOrder, maxOrder) + config.reverseNDelay;

            // 2つのパターンを適用
            applyBlinkPattern(item, zStartTime, originalImg, index === gridItems.length - 1);
            applyBlinkPattern(item, reverseNStartTime, originalImg, false);
        });
    }

    function calculateCumulativeTime(order, maxOrder) {
        var time = 0;
        for (var i = 0; i < order; i++) {
            var currentDelay = config.delayMin + (config.delayMax - config.delayMin) * (i / maxOrder);
            time += currentDelay;
        }
        return time;
    }

    function applyBlinkPattern(item, startTime, originalImg, isLast) {
        var currentTime = startTime;

        config.blinkPattern.forEach(function (pattern) {
            var showDuration = pattern[0];
            var hideDuration = pattern[1];

            // 表示
            setTimeout(function () {
                item.style.opacity = '1';
            }, currentTime);

            currentTime += showDuration;

            // 非表示
            setTimeout(function () {
                item.style.opacity = '0';
            }, currentTime);

            currentTime += hideDuration;
        });

        // 最終表示
        setTimeout(function () {
            item.style.opacity = '1';
        }, currentTime);

        // 最後のアイテムの場合のみ元の画像を表示
        if (isLast) {
            setTimeout(function () {
                if (originalImg) {
                    originalImg.style.opacity = '1';
                }
            }, currentTime + 500);
        }
    }

    // ページ読み込み時に実行
    function init() {
        var images = document.querySelectorAll('img.grid-animation');
        console.log('GridAnimation.init() called, found', images.length, 'images');
        images.forEach(function (img, index) {
            console.log('Image', index, ':', img.src, 'complete:', img.complete, 'initialized:', img.dataset.gridInitialized);
            // 初期化フラグをリセット（再初期化を許可）
            delete img.dataset.gridInitialized;
            initGridAnimation(img);
        });

        // 動的に追加された画像にも対応（MutationObserver）
        if (typeof MutationObserver !== 'undefined') {
            var observer = new MutationObserver(function (mutations) {
                mutations.forEach(function (mutation) {
                    mutation.addedNodes.forEach(function (node) {
                        if (node.nodeType === 1) { // Element node
                            if (node.tagName === 'IMG' && node.classList.contains('grid-animation')) {
                                initGridAnimation(node);
                            }
                            // 子要素もチェック
                            var childImages = node.querySelectorAll && node.querySelectorAll('img.grid-animation');
                            if (childImages) {
                                childImages.forEach(function (img) {
                                    initGridAnimation(img);
                                });
                            }
                        }
                    });
                });
            });

            observer.observe(document.body, {
                childList: true,
                subtree: true
            });
        }
    }

    // DOMContentLoaded または 即座に実行
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // グローバルに設定変更用の関数を公開
    window.GridAnimation = {
        config: config,
        init: init
    };
})();

