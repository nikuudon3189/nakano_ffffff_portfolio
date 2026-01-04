// ローディング画面の進捗更新と非表示処理
(function () {
    const loadingBackground = document.querySelector('.loading-background');
    const loadingScreen = document.querySelector('.loading-screen');
    const progressText = document.querySelector('.loading-screen__progress');
    const SESSION_KEY = 'site_visited'; // セッションストレージのキー

    // 訪問済みかチェック
    const isVisited = sessionStorage.getItem(SESSION_KEY);

    if (!loadingScreen || !progressText) {
        return; // 要素が存在しない場合は処理を終了
    }

    // 既に訪問済みならローディング画面を即座に非表示にする
    if (isVisited) {
        if (loadingBackground) loadingBackground.style.display = 'none';
        if (loadingScreen) loadingScreen.style.display = 'none';
        return;
    }

    // 初回訪問の処理開始（フラグを保存）
    sessionStorage.setItem(SESSION_KEY, 'true');

    // 設定
    const PROGRESS_ANIMATION_TIME = 1000; // 0から100%になるまでの時間（ミリ秒）3秒
    const TEXT_CHANGE_DELAY = 300; // 100%到達からテキスト変更までの時間（ミリ秒）0.5秒
    const SHRINK_START_DELAY = 1000; // テキスト変更後から縮み開始までの時間（ミリ秒）
    const SHRINK_DISPLAY_DURATION = 500; // 縮み開始後から非表示までの時間（ミリ秒）1秒
    const FADE_OUT_DURATION = 300; // フェードアウト時間（ミリ秒）
    const HIDE_DELAY = 600; // 非表示処理の遅延時間（ミリ秒）
    let assetsLoaded = false; // アセット読み込み完了フラグ
    let textChangedTime = null; // テキスト変更時刻
    let shrinkStartTime = null; // 縮み開始時刻
    let progressAnimationId = null; // 進捗アニメーションのID

    // 進捗を更新する関数
    function updateProgress(percentage) {
        if (progressText) {
            progressText.textContent = Math.min(Math.max(Math.floor(percentage), 0), 100) + '%';
        }
    }

    // ローディング画面を縮小・移動させる関数
    function shrinkAndMoveLoadingScreen() {
        if (loadingScreen && !loadingScreen.classList.contains('is-shrinking')) {
            loadingScreen.classList.add('is-shrinking');
            shrinkStartTime = Date.now(); // 縮み開始時刻を記録
        }
    }

    // ローディング画面を非表示にする関数
    function hideLoadingScreen() {
        if (loadingBackground && !loadingBackground.classList.contains('is-hidden')) {
            loadingBackground.classList.add('is-hidden');
        }
        if (loadingScreen && !loadingScreen.classList.contains('is-hidden')) {
            loadingScreen.classList.add('is-hidden');
            // アニメーション完了後にDOMから削除（オプション）
            setTimeout(() => {
                if (loadingScreen.parentNode) {
                    loadingScreen.parentNode.removeChild(loadingScreen);
                }
            }, FADE_OUT_DURATION); // フェードアウト時間と同じ
        }
    }

    // ローディング画面を非表示にするかチェック
    function checkCanHide() {
        // 縮み開始後1.5秒経過 && アセット読み込み完了 の2つを満たしたら非表示
        if (assetsLoaded && shrinkStartTime !== null) {
            const shrinkElapsed = Date.now() - shrinkStartTime;
            if (shrinkElapsed >= SHRINK_DISPLAY_DURATION) {
                // 縮み開始後1.5秒経過している場合、すぐに非表示
                setTimeout(() => {
                    hideLoadingScreen();
                }, HIDE_DELAY);
                return true;
            } else {
                // まだ1.5秒経過していない場合、残り時間待つ
                const remainingTime = SHRINK_DISPLAY_DURATION - shrinkElapsed;
                setTimeout(() => {
                    hideLoadingScreen();
                }, remainingTime + HIDE_DELAY);
                return true;
            }
        }
        return false;
    }

    // 進捗アニメーション（3秒かけて0%から100%まで）
    function startProgressAnimation() {
        let progress = 0;
        const startAnimationTime = Date.now();

        function animate() {
            const elapsed = Date.now() - startAnimationTime;
            progress = Math.min((elapsed / PROGRESS_ANIMATION_TIME) * 100, 100);
            updateProgress(progress);

            if (progress < 100) {
                progressAnimationId = requestAnimationFrame(animate);
            } else {
                // アニメーション完了後も100%を維持
                updateProgress(100);

                // 0.5秒後に100%をフェードアウト
                setTimeout(() => {
                    if (progressText) {
                        // フェードアウト開始
                        progressText.classList.add('is-fading-out');

                        // フェードアウト完了後（0.5秒後）にテキストを変更してフェードイン
                        setTimeout(() => {
                            if (progressText) {
                                progressText.textContent = '2025年4月以降のリクエストを受け付けています。';
                                // フェードアウトクラスを削除してフェードインクラスを追加
                                progressText.classList.remove('is-fading-out');
                                progressText.classList.add('is-fading-in');
                                textChangedTime = Date.now(); // テキスト変更時刻を記録
                                // テキスト変更後、アセットも読み込み完了していれば非表示チェック
                                checkCanHide();
                            }
                        }, 500); // フェードアウト時間

                        // SHRINK_START_DELAY後に縮み開始と同時にテキストフェードアウト
                        setTimeout(() => {
                            if (progressText) {
                                progressText.classList.remove('is-fading-in');
                                progressText.classList.add('is-fading-out');
                            }
                            shrinkAndMoveLoadingScreen();
                            // 縮み開始後、アセットも読み込み完了していれば非表示チェック
                            checkCanHide();
                        }, 500 + SHRINK_START_DELAY);
                    }
                }, TEXT_CHANGE_DELAY);
            }
        }

        animate();
    }

    // すべてのアセット（画像、フォント、スクリプト）の読み込み完了を待つ
    window.addEventListener('load', () => {
        assetsLoaded = true;
        // アセット読み込み完了時、テキスト変更後0.5秒経過していれば非表示
        checkCanHide();
    });

    // 初期化：進捗アニメーションを開始
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            startProgressAnimation();
        });
    } else {
        startProgressAnimation();
    }

    // タイムアウト対策（10秒経過したら強制的に消す）
    setTimeout(() => {
        if (loadingScreen && !loadingScreen.classList.contains('is-hidden')) {
            assetsLoaded = true;
            if (progressAnimationId) {
                cancelAnimationFrame(progressAnimationId);
            }
            updateProgress(100);

            // テキストを変更（まだ変更されていない場合）
            if (textChangedTime === null) {
                setTimeout(() => {
                    if (progressText && progressText.textContent.includes('%')) {
                        // フェードアウト開始
                        progressText.classList.add('is-fading-out');

                        // フェードアウト完了後（0.5秒後）にテキストを変更してフェードイン
                        setTimeout(() => {
                            if (progressText) {
                                progressText.textContent = '2025年4月以降のリクエストを受け付けています。';
                                // フェードアウトクラスを削除してフェードインクラスを追加
                                progressText.classList.remove('is-fading-out');
                                progressText.classList.add('is-fading-in');
                                textChangedTime = Date.now();
                            }
                        }, 500); // フェードアウト時間

                        // SHRINK_START_DELAY後に縮み開始と同時にテキストフェードアウト、その後SHRINK_DISPLAY_DURATION待って非表示
                        setTimeout(() => {
                            if (progressText) {
                                progressText.classList.remove('is-fading-in');
                                progressText.classList.add('is-fading-out');
                            }
                            shrinkAndMoveLoadingScreen();
                            setTimeout(() => {
                                hideLoadingScreen();
                            }, SHRINK_DISPLAY_DURATION + HIDE_DELAY);
                        }, 500 + SHRINK_START_DELAY);
                    }
                }, TEXT_CHANGE_DELAY);
            } else {
                // 既にテキスト変更済みの場合
                checkCanHide();
            }
        }
    }, 10000); // 10秒
})();

