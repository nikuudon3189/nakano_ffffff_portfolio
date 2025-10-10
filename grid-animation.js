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
    function initGridAnimation(img, startImmediately) {
        // すでに処理済みの場合はスキップ
        if (img.dataset.gridInitialized) return;
        img.dataset.gridInitialized = 'true';

        // すぐに開始する場合
        if (startImmediately) {
            // 画像の読み込みを待つ
            if (!img.complete) {
                img.addEventListener('load', function () {
                    transformToGrid(img);
                });
            } else {
                transformToGrid(img);
            }
        } else {
            // IntersectionObserverで画面内に入ったら開始
            setupIntersectionObserver(img);
        }
    }

    // IntersectionObserverのセットアップ
    function setupIntersectionObserver(img) {
        var observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    console.log('Image entered viewport:', img.src);
                    // 画面内に入ったらアニメーション開始
                    if (!img.complete) {
                        img.addEventListener('load', function () {
                            transformToGrid(img);
                        });
                    } else {
                        transformToGrid(img);
                    }
                    // 一度実行したら監視を解除
                    observer.unobserve(img);
                }
            });
        }, {
            root: null, // ビューポートを基準
            rootMargin: '50px', // 画面に入る50px前から検知
            threshold: 0.1 // 10%表示されたら発火
        });

        observer.observe(img);
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

        // 既にコンテナが存在する場合はスキップ
        var existingContainer = img.parentNode.querySelector('.grid-animation-container');
        if (existingContainer) {
            console.log('Grid container already exists, skipping:', img.src);
            return;
        }

        // さらに、同じsrcを持つ他の画像でコンテナが存在する場合もスキップ
        var allContainers = document.querySelectorAll('.grid-animation-container');
        for (var k = 0; k < allContainers.length; k++) {
            var container = allContainers[k];
            var containerImg = container.querySelector('.grid-animation-item');
            if (containerImg && containerImg.style.backgroundImage.includes(imageUrl)) {
                console.log('Same image already has container, skipping:', imageUrl);
                return;
            }
        }

        // 元の画像の正確な位置情報を取得
        var rect = img.getBoundingClientRect();
        var scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        var scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;

        // 元の画像を非表示にする
        img.style.opacity = '0';
        img.style.transition = 'opacity 0.3s ease';

        // コンテナを作成（元の画像の正確な位置に配置）
        var container = document.createElement('div');
        container.className = 'grid-animation-container';
        container.style.position = 'absolute';
        container.style.top = (rect.top + scrollTop) + 'px';
        container.style.left = (rect.left + scrollLeft) + 'px';
        container.style.width = rect.width + 'px';
        container.style.height = rect.height + 'px';
        container.style.display = 'grid';
        container.style.gridTemplateColumns = 'repeat(' + config.gridCols + ', 1fr)';
        container.style.gridTemplateRows = 'repeat(' + config.gridRows + ', 1fr)';
        container.style.gap = '0';
        container.style.zIndex = '1';

        // コンテナをbodyに直接追加（親要素の影響を受けないように）
        document.body.appendChild(container);

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

    // グローバルクリーンアップ関数
    function cleanupAllGridAnimations() {
        var allContainers = document.querySelectorAll('.grid-animation-container');
        console.log('Cleaning up', allContainers.length, 'existing containers');
        for (var i = 0; i < allContainers.length; i++) {
            allContainers[i].remove();
        }

        var allImages = document.querySelectorAll('img.grid-animation');
        for (var j = 0; j < allImages.length; j++) {
            var img = allImages[j];
            delete img.dataset.gridInitialized;
            img.style.opacity = '1';
        }
    }

    // ページ読み込み時に実行
    function init() {
        console.log('GridAnimation.init() called');

        // まず全ての既存アニメーションをクリーンアップ
        cleanupAllGridAnimations();

        var images = document.querySelectorAll('img.grid-animation');
        console.log('Found', images.length, 'images after cleanup');

        images.forEach(function (img, index) {
            console.log('Image', index, ':', img.src, 'complete:', img.complete);

            // data-grid-immediate属性がある場合は即座に開始、それ以外はスクロールで開始
            var startImmediately = img.hasAttribute('data-grid-immediate');
            initGridAnimation(img, startImmediately);
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

