// メニューを読み込む関数
function loadMenu() {
    fetch('menu.html')
        .then(response => response.text())
        .then(data => {
            // bodyの最後にメニューを挿入
            document.body.insertAdjacentHTML('beforeend', data);

            // メニューのイベントリスナーを設定
            setupMenuEventListeners();
        })
        .catch(error => {
            console.error('メニューの読み込みに失敗しました:', error);
        });
}

// メニューのイベントリスナーを設定する関数
function setupMenuEventListeners() {
    const menu = document.querySelector('.menu');
    const openMenuBtn = document.querySelector('.menu--visible__open-menu');
    const glassOverlay = document.querySelector('.menu--glass-overlay');

    if (!menu || !openMenuBtn) return;

    // メニュー開閉の状態管理
    let isMenuOpen = false;

    // メニュー開閉ボタンのクリックイベント
    openMenuBtn.addEventListener('click', () => {
        if (!isMenuOpen) {
            openMenu();
        } else {
            closeMenu();
        }
    });

    // ガラスオーバーレイのクリックイベント（メニューを閉じる）
    if (glassOverlay) {
        glassOverlay.addEventListener('click', () => {
            closeMenu();
        });
    }

    // メニューを開く関数
    function openMenu() {
        menu.classList.add('is-open');
        menu.classList.remove('is-close');
        openMenuBtn.setAttribute('aria-expanded', 'true');
        isMenuOpen = true;
    }

    // メニューを閉じる関数
    function closeMenu() {
        menu.classList.add('is-close');
        menu.classList.remove('is-open');
        openMenuBtn.setAttribute('aria-expanded', 'false');
        isMenuOpen = false;
    }

    // ESCキーでメニューを閉じる
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && isMenuOpen) {
            closeMenu();
        }
    });
}

// DOMが読み込まれた後にメニューを読み込み
document.addEventListener('DOMContentLoaded', loadMenu);
