// Footer loader
function loadFooter() {
    const footerContainer = document.getElementById('footer-container');

    if (footerContainer) {
        fetch('footer.html')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Footer not found (' + response.status + ')');
                }
                return response.text();
            })
            .then(data => {
                footerContainer.innerHTML = data;
                // Footer読み込み完了後にtext-fit機能を実行
                if (typeof resizeTextToFit === 'function') {
                    resizeTextToFit();
                }
                // Footer読み込み完了後にタイプライターアニメーションを初期化
                if (typeof initHoverTypeWriters === 'function') {
                    initHoverTypeWriters();
                }
            })
            .catch(error => {
                console.error('Error loading footer:', error);
                footerContainer.innerHTML = '<p style="color:red; padding:20px;">フッターの読み込みに失敗しました。サーバー経由でアクセスしているか確認してください。<br>Error: ' + error.message + '</p>';
            });
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadFooter);
} else {
    loadFooter();
}
