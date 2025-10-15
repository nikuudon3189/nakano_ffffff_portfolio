document.addEventListener('DOMContentLoaded', function () {
    // メニューバーとボタン、隠れメニューの要素を取得
    const menuBar = document.querySelector('.menu-bar');
    const openButton = document.querySelector('.menu-bar .menu-visible .open-menu');
    const hiddenMenu = document.querySelector('.menu-bar .menu-hidden');

    // デバッグ用のログ
    console.log('menuBar:', menuBar);
    console.log('openButton:', openButton);
    console.log('hiddenMenu:', hiddenMenu);

    // 要素が存在しない場合は処理を終了
    if (!menuBar || !openButton || !hiddenMenu) {
        console.error('必要な要素が見つかりません');
        return;
    }

    // ボタンクリック時の処理
    openButton.addEventListener('click', function () {
        console.log('ボタンがクリックされました');
        // 現在の状態をチェック（toggle前に）
        const isNowOpen = menuBar.classList.contains('is-open');
        console.log('現在の状態:', isNowOpen ? '開いている' : '閉じている');

        if (isNowOpen) {
            // 閉じる処理
            console.log('メニューを閉じます');
            menuBar.classList.add('is-close');
            menuBar.classList.remove('is-open');
            openButton.setAttribute('aria-expanded', false);

            // アニメーション終了後に is-close を削除
            setTimeout(() => {
                menuBar.classList.remove('is-close');
            }, 500);
        } else {
            // 開く処理
            console.log('メニューを開きます');
            menuBar.classList.add('is-open');
            openButton.setAttribute('aria-expanded', true);
            console.log('クラス追加後の状態:', menuBar.classList.toString());
        }
    });

    // メニュー外をクリックしたときに閉じる
    document.addEventListener('click', function (event) {
        // クリックした場所がメニューバー外の場合
        if (!menuBar.contains(event.target)) {
            const isOpen = menuBar.classList.contains('is-open');
            if (isOpen) {
                menuBar.classList.add('is-close');
                menuBar.classList.remove('is-open');
                openButton.setAttribute('aria-expanded', false);

                setTimeout(() => {
                    menuBar.classList.remove('is-close');
                }, 500);
            }
        }
    });

    // Escキーでメニューを閉じる
    document.addEventListener('keydown', function (event) {
        if (event.key === 'Escape' && menuBar.classList.contains('is-open')) {
            menuBar.classList.add('is-close');
            menuBar.classList.remove('is-open');
            openButton.setAttribute('aria-expanded', false);

            setTimeout(() => {
                menuBar.classList.remove('is-close');
            }, 500);
        }
    });
}); 