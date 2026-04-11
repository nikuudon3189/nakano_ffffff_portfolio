// 初期表示のメニュー高さを測り、開閉アニメーションの折りたたみ高さと揃える
function syncMenuCollapsedHeight() {
    const menu = document.querySelector('.menu');
    if (!menu || menu.classList.contains('is-open')) return;
    document.documentElement.style.setProperty(
        '--menu-collapsed-height',
        `${menu.offsetHeight}px`
    );
}

// メニューを読み込む関数
function loadMenu() {
    const menuContainer = document.getElementById('menu-container');
    const defaultAnnouncementText = '2026年5月以降のリクエストを受け付けています。';

    if (menuContainer) {
        fetch('menu.html')
            .then(response => response.text())
            .then(data => {
                menuContainer.innerHTML = data;

                // アナウンスメントテキストを設定
                const announcementTextElement = menuContainer.querySelector('.menu--visible__announcement__text p');
                if (announcementTextElement) {
                    const announcementText = typeof ANNOUNCEMENT_TEXT !== 'undefined'
                        ? ANNOUNCEMENT_TEXT
                        : defaultAnnouncementText;
                    announcementTextElement.textContent = announcementText;
                }

                // メニューのイベントリスナーを設定
                setupMenuEventListeners();

                // メニュー読み込み完了後にtext-fit機能を実行
                if (typeof resizeTextToFit === 'function') {
                    resizeTextToFit();
                }

                syncMenuCollapsedHeight();
                window.addEventListener('resize', syncMenuCollapsedHeight);
            })
            .catch(error => {
                console.error('メニューの読み込みに失敗しました:', error);
            });
    }
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
