// white-grid-loadクラスが付与された画像に白い四角形を覆い被さるように配置する関数（読み込み時）
function createWhiteGridLoadOverlay() {
    // white-grid-loadクラスが付与された画像を全て取得
    const images = document.querySelectorAll('img.white-grid-load');

    images.forEach((img, index) => {
        // 画像が読み込まれるまで待機
        if (img.complete) {
            createOverlay(img, index, 'white');
        } else {
            img.addEventListener('load', () => createOverlay(img, index, 'white'));
        }
    });
}

// black-grid-loadクラスが付与された画像に黒い四角形を覆い被さるように配置する関数（読み込み時）
function createBlackGridLoadOverlay() {
    // black-grid-loadクラスが付与された画像を全て取得
    const images = document.querySelectorAll('img.black-grid-load');

    images.forEach((img, index) => {
        // 画像が読み込まれるまで待機
        if (img.complete) {
            createOverlay(img, index, 'black');
        } else {
            img.addEventListener('load', () => createOverlay(img, index, 'black'));
        }
    });
}

// ホバー時のオーバーレイを作成する関数（最初に全体を白くしない）
function createHoverOverlay(img, index, type = 'white') {
    // 既にオーバーレイが存在する場合は削除
    const overlayPrefix = type === 'white' ? 'white-grid-overlay' : 'black-grid-overlay';
    const existingOverlays = document.querySelectorAll(`[id^="${overlayPrefix}-${index}-"]`);
    existingOverlays.forEach(overlay => overlay.remove());

    // 画像の位置とサイズを取得
    const rect = img.getBoundingClientRect();
    const scrollX = window.pageXOffset || document.documentElement.scrollLeft;
    const scrollY = window.pageYOffset || document.documentElement.scrollTop;

    // 7×6のグリッドを作成（42個のグリッド）
    const gridPositions = [];
    const cols = 7;
    const rows = 6;

    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            gridPositions.push({
                x: col / cols,
                y: row / rows,
                name: `grid-${row}-${col}`,
                row: row,
                col: col
            });
        }
    }

    const gridElements = [];

    gridPositions.forEach((pos, gridIndex) => {
        // 各グリッドのオーバーレイ要素を作成
        const overlay = document.createElement('div');
        overlay.id = `${overlayPrefix}-${index}-${pos.name}`;
        overlay.className = type === 'white' ? 'white-grid-overlay' : 'black-grid-overlay';

        // スタイルを設定
        overlay.style.position = 'absolute';
        overlay.style.left = (rect.left + scrollX + rect.width * pos.x) + 'px';
        overlay.style.top = (rect.top + scrollY + rect.height * pos.y) + 'px';
        overlay.style.width = (rect.width / cols) + 'px';
        overlay.style.height = (rect.height / rows) + 'px';
        overlay.style.backgroundColor = type === 'white' ? '#f5f5f5' : '#1F1F20';
        overlay.style.pointerEvents = 'none';
        overlay.style.zIndex = '10';
        overlay.style.opacity = '0'; // 最初は透明
        overlay.style.transition = 'opacity 0.1s ease-out';

        // 角丸の設定（各グリッドの位置に応じて）
        const borderRadius = getComputedStyle(img).borderRadius;
        const isTopRow = pos.row === 0;
        const isBottomRow = pos.row === rows - 1;
        const isLeftCol = pos.col === 0;
        const isRightCol = pos.col === cols - 1;

        if (isTopRow && isLeftCol) {
            // 左上角
            overlay.style.borderTopLeftRadius = borderRadius;
        } else if (isTopRow && isRightCol) {
            // 右上角
            overlay.style.borderTopRightRadius = borderRadius;
        } else if (isBottomRow && isLeftCol) {
            // 左下角
            overlay.style.borderBottomLeftRadius = borderRadius;
        } else if (isBottomRow && isRightCol) {
            // 右下角
            overlay.style.borderBottomRightRadius = borderRadius;
        }

        // bodyに追加
        document.body.appendChild(overlay);
        gridElements.push(overlay);
    });

    // チカチカパターンの定義
    const blinkPattern = [
        [15, 20],  // 1回目: 15ms非表示 → 20ms表示
        [15, 40],  // 2回目: 15ms非表示 → 40ms表示  
        [60, 80],  // 3回目: 60ms非表示 → 80ms表示
        [30, 40]   // 4回目: 30ms非表示 → 40ms表示
    ];

    // Zの字順と逆Nの字順で段階的にチカチカして消える
    const fadeDelay = 12; // 各グリッド間の遅延時間（ミリ秒）
    const reverseNDelay = 100; // 逆Nのアニメーション開始遅延（ミリ秒）

    gridPositions.forEach((pos, gridIndex) => {
        // Zの字順（左上から右下へ）
        const zOrderIndex = pos.row * cols + pos.col;

        // 逆Nの字順（全ての行が上から下で、左から右にかけて消える）
        const reverseNOrderIndex = pos.col * rows + pos.row;

        // Zの字順でチカチカして現れる
        setTimeout(() => {
            startHoverBlinkAnimation(gridElements[gridIndex], blinkPattern);
        }, 50 + (zOrderIndex * fadeDelay));

        // 逆Nの字順でチカチカして消える（0.1秒遅延）
        setTimeout(() => {
            startHoverBlinkAnimation(gridElements[gridIndex], blinkPattern);
        }, 50 + reverseNDelay + (reverseNOrderIndex * fadeDelay));
    });
}

// 個別の画像に対してオーバーレイを作成する関数
function createOverlay(img, index, type = 'white') {
    // 既にオーバーレイが存在する場合は削除
    const overlayPrefix = type === 'white' ? 'white-grid-overlay' : 'black-grid-overlay';
    const existingOverlays = document.querySelectorAll(`[id^="${overlayPrefix}-${index}-"]`);
    existingOverlays.forEach(overlay => overlay.remove());

    // 画像の位置とサイズを取得
    const rect = img.getBoundingClientRect();
    const scrollX = window.pageXOffset || document.documentElement.scrollLeft;
    const scrollY = window.pageYOffset || document.documentElement.scrollTop;

    // 7×6のグリッドを作成（42個のグリッド）
    const gridPositions = [];
    const cols = 7;
    const rows = 6;

    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            gridPositions.push({
                x: col / cols,
                y: row / rows,
                name: `grid-${row}-${col}`,
                row: row,
                col: col
            });
        }
    }

    const gridElements = [];

    gridPositions.forEach((pos, gridIndex) => {
        // 各グリッドのオーバーレイ要素を作成
        const overlay = document.createElement('div');
        overlay.id = `${overlayPrefix}-${index}-${pos.name}`;
        overlay.className = type === 'white' ? 'white-grid-overlay' : 'black-grid-overlay';

        // スタイルを設定
        overlay.style.position = 'absolute';
        overlay.style.left = (rect.left + scrollX + rect.width * pos.x) + 'px';
        overlay.style.top = (rect.top + scrollY + rect.height * pos.y) + 'px';
        overlay.style.width = (rect.width / cols) + 'px';
        overlay.style.height = (rect.height / rows) + 'px';
        overlay.style.backgroundColor = type === 'white' ? '#f5f5f5' : '#1F1F20';
        overlay.style.pointerEvents = 'none';
        overlay.style.zIndex = '10';
        overlay.style.opacity = '1';
        overlay.style.transition = 'opacity 0.1s ease-out';

        // 角丸の設定（各グリッドの位置に応じて）
        const borderRadius = getComputedStyle(img).borderRadius;
        const isTopRow = pos.row === 0;
        const isBottomRow = pos.row === rows - 1;
        const isLeftCol = pos.col === 0;
        const isRightCol = pos.col === cols - 1;

        if (isTopRow && isLeftCol) {
            // 左上角
            overlay.style.borderTopLeftRadius = borderRadius;
        } else if (isTopRow && isRightCol) {
            // 右上角
            overlay.style.borderTopRightRadius = borderRadius;
        } else if (isBottomRow && isLeftCol) {
            // 左下角
            overlay.style.borderBottomLeftRadius = borderRadius;
        } else if (isBottomRow && isRightCol) {
            // 右下角
            overlay.style.borderBottomRightRadius = borderRadius;
        }

        // bodyに追加
        document.body.appendChild(overlay);
        gridElements.push(overlay);
    });

    // チカチカパターンの定義
    const blinkPattern = [
        [15, 20],  // 1回目: 15ms非表示 → 20ms表示
        [15, 40],  // 2回目: 15ms非表示 → 40ms表示  
        [60, 80],  // 3回目: 60ms非表示 → 80ms表示
        [30, 40]   // 4回目: 30ms非表示 → 40ms表示
    ];

    // Zの字順と逆Nの字順で段階的にチカチカして消える
    const fadeDelay = 12; // 各グリッド間の遅延時間（ミリ秒）
    const reverseNDelay = 100; // 逆Nのアニメーション開始遅延（ミリ秒）

    gridPositions.forEach((pos, gridIndex) => {
        // Zの字順（左上から右下へ）
        const zOrderIndex = pos.row * cols + pos.col;

        // 逆Nの字順（全ての行が上から下で、左から右にかけて消える）
        const reverseNOrderIndex = pos.col * rows + pos.row;

        // Zの字順でチカチカして消える
        setTimeout(() => {
            startBlinkAnimation(gridElements[gridIndex], blinkPattern);
        }, 50 + (zOrderIndex * fadeDelay));

        // 逆Nの字順でチカチカして消える（0.1秒遅延）
        setTimeout(() => {
            startBlinkAnimation(gridElements[gridIndex], blinkPattern);
        }, 50 + reverseNDelay + (reverseNOrderIndex * fadeDelay));
    });
}

// ホバー時のチカチカアニメーションを開始する関数（最初は透明から始まる）
function startHoverBlinkAnimation(element, blinkPattern) {
    if (!element) return;

    let currentStep = 0;
    let totalDelay = 0;

    function executeBlinkStep() {
        if (currentStep >= blinkPattern.length) {
            // 最後のステップが終わったら完全に非表示にする
            element.style.opacity = '0';
            element.style.display = 'none';
            return;
        }

        const [hideTime, showTime] = blinkPattern[currentStep];

        // 非表示にする
        setTimeout(() => {
            element.style.opacity = '0';
        }, totalDelay);

        // 表示する
        setTimeout(() => {
            element.style.opacity = '1';
        }, totalDelay + hideTime);

        totalDelay += hideTime + showTime;
        currentStep++;

        // 次のステップを実行（最後のステップでない場合のみ）
        if (currentStep < blinkPattern.length) {
            setTimeout(executeBlinkStep, hideTime + showTime);
        }
    }

    // 最後のステップの表示時間が終わった後に完全に非表示にする
    const totalBlinkTime = blinkPattern.reduce((total, [hideTime, showTime]) => total + hideTime + showTime, 0);
    setTimeout(() => {
        element.style.opacity = '0';
        element.style.display = 'none';
    }, totalBlinkTime);

    executeBlinkStep();
}

// チカチカアニメーションを開始する関数
function startBlinkAnimation(element, blinkPattern) {
    if (!element) return;

    let currentStep = 0;
    let totalDelay = 0;

    function executeBlinkStep() {
        if (currentStep >= blinkPattern.length) {
            // 最後のステップが終わったら完全に非表示にする
            element.style.opacity = '0';
            element.style.display = 'none';
            return;
        }

        const [hideTime, showTime] = blinkPattern[currentStep];

        // 非表示にする
        setTimeout(() => {
            element.style.opacity = '0';
        }, totalDelay);

        // 表示する
        setTimeout(() => {
            element.style.opacity = '1';
        }, totalDelay + hideTime);

        totalDelay += hideTime + showTime;
        currentStep++;

        // 次のステップを実行（最後のステップでない場合のみ）
        if (currentStep < blinkPattern.length) {
            setTimeout(executeBlinkStep, hideTime + showTime);
        }
    }

    // 最後のステップの表示時間が終わった後に完全に非表示にする
    const totalBlinkTime = blinkPattern.reduce((total, [hideTime, showTime]) => total + hideTime + showTime, 0);
    setTimeout(() => {
        element.style.opacity = '0';
        element.style.display = 'none';
    }, totalBlinkTime);

    executeBlinkStep();
}

// ウィンドウリサイズ時にオーバーレイを再配置
function handleResize() {
    // white-grid-loadクラスの画像を処理
    const whiteLoadImages = document.querySelectorAll('img.white-grid-load');
    whiteLoadImages.forEach((img, imgIndex) => {
        updateOverlayPositions(img, imgIndex, 'white');
    });

    // black-grid-loadクラスの画像を処理
    const blackLoadImages = document.querySelectorAll('img.black-grid-load');
    blackLoadImages.forEach((img, imgIndex) => {
        updateOverlayPositions(img, imgIndex, 'black');
    });

    // white-grid-hoverクラスの画像を処理
    const whiteHoverImages = document.querySelectorAll('img.white-grid-hover');
    whiteHoverImages.forEach((img, imgIndex) => {
        updateOverlayPositions(img, imgIndex, 'white');
    });

    // black-grid-hoverクラスの画像を処理
    const blackHoverImages = document.querySelectorAll('img.black-grid-hover');
    blackHoverImages.forEach((img, imgIndex) => {
        updateOverlayPositions(img, imgIndex, 'black');
    });
}

// オーバーレイの位置を更新する共通関数
function updateOverlayPositions(img, imgIndex, type) {
    const rect = img.getBoundingClientRect();
    const scrollX = window.pageXOffset || document.documentElement.scrollLeft;
    const scrollY = window.pageYOffset || document.documentElement.scrollTop;

    // 各グリッドの位置を更新（アニメーションは実行しない）
    const cols = 7;
    const rows = 6;
    const gridPositions = [];
    const overlayPrefix = type === 'white' ? 'white-grid-overlay' : 'black-grid-overlay';

    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            gridPositions.push({
                x: col / cols,
                y: row / rows,
                name: `grid-${row}-${col}`,
                row: row,
                col: col
            });
        }
    }

    gridPositions.forEach((pos, gridIndex) => {
        const overlay = document.getElementById(`${overlayPrefix}-${imgIndex}-${pos.name}`);
        if (overlay) {
            overlay.style.left = (rect.left + scrollX + rect.width * pos.x) + 'px';
            overlay.style.top = (rect.top + scrollY + rect.height * pos.y) + 'px';
            overlay.style.width = (rect.width / cols) + 'px';
            overlay.style.height = (rect.height / rows) + 'px';
        }
    });
}

// スクロール時にオーバーレイを再配置
function handleScroll() {
    // white-grid-loadクラスの画像を処理
    const whiteLoadImages = document.querySelectorAll('img.white-grid-load');
    whiteLoadImages.forEach((img, imgIndex) => {
        updateOverlayPositions(img, imgIndex, 'white');
    });

    // black-grid-loadクラスの画像を処理
    const blackLoadImages = document.querySelectorAll('img.black-grid-load');
    blackLoadImages.forEach((img, imgIndex) => {
        updateOverlayPositions(img, imgIndex, 'black');
    });

    // white-grid-hoverクラスの画像を処理
    const whiteHoverImages = document.querySelectorAll('img.white-grid-hover');
    whiteHoverImages.forEach((img, imgIndex) => {
        updateOverlayPositions(img, imgIndex, 'white');
    });

    // black-grid-hoverクラスの画像を処理
    const blackHoverImages = document.querySelectorAll('img.black-grid-hover');
    blackHoverImages.forEach((img, imgIndex) => {
        updateOverlayPositions(img, imgIndex, 'black');
    });
}

// DOMが読み込まれた後に実行
document.addEventListener('DOMContentLoaded', () => {
    createWhiteGridLoadOverlay();
    createBlackGridLoadOverlay();
});

// ホバー時のアニメーション実行
document.addEventListener('DOMContentLoaded', () => {
    // white-grid-hoverクラスの画像のホバーイベント
    const whiteHoverImages = document.querySelectorAll('img.white-grid-hover');
    whiteHoverImages.forEach((img, index) => {
        img.addEventListener('mouseenter', () => {
            // ホバー時にアニメーションを再実行（最初に全体を白くしない）
            createHoverOverlay(img, index, 'white');
        });
    });

    // black-grid-hoverクラスの画像のホバーイベント
    const blackHoverImages = document.querySelectorAll('img.black-grid-hover');
    blackHoverImages.forEach((img, index) => {
        img.addEventListener('mouseenter', () => {
            // ホバー時にアニメーションを再実行（最初に全体を黒くしない）
            createHoverOverlay(img, index, 'black');
        });
    });
});

// ウィンドウリサイズとスクロールのイベントリスナーを追加
window.addEventListener('resize', handleResize);
window.addEventListener('scroll', handleScroll);

// 画像の読み込み完了後にオーバーレイを作成するためのMutationObserver
const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
        if (mutation.type === 'childList') {
            mutation.addedNodes.forEach((node) => {
                if (node.nodeType === 1) { // Element node
                    if (node.tagName === 'IMG') {
                        if (node.classList.contains('white-grid-load')) {
                            const index = Array.from(document.querySelectorAll('img.white-grid-load')).indexOf(node);
                            if (node.complete) {
                                createOverlay(node, index, 'white');
                            } else {
                                node.addEventListener('load', () => createOverlay(node, index, 'white'));
                            }
                        } else if (node.classList.contains('black-grid-load')) {
                            const index = Array.from(document.querySelectorAll('img.black-grid-load')).indexOf(node);
                            if (node.complete) {
                                createOverlay(node, index, 'black');
                            } else {
                                node.addEventListener('load', () => createOverlay(node, index, 'black'));
                            }
                        }

                        // ホバーイベントの設定
                        if (node.classList.contains('white-grid-hover')) {
                            const index = Array.from(document.querySelectorAll('img.white-grid-hover')).indexOf(node);
                            node.addEventListener('mouseenter', () => {
                                createHoverOverlay(node, index, 'white');
                            });
                        } else if (node.classList.contains('black-grid-hover')) {
                            const index = Array.from(document.querySelectorAll('img.black-grid-hover')).indexOf(node);
                            node.addEventListener('mouseenter', () => {
                                createHoverOverlay(node, index, 'black');
                            });
                        }
                    }
                }
            });
        }
    });
});

// bodyを監視開始
observer.observe(document.body, { childList: true, subtree: true });
