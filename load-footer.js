// Footer loader
document.addEventListener('DOMContentLoaded', function () {
    const footerContainer = document.getElementById('footer-container');

    if (footerContainer) {
        fetch('footer.html')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Footer not found');
                }
                return response.text();
            })
            .then(data => {
                footerContainer.innerHTML = data;
                // Footer読み込み完了後にtext-fit機能を実行
                if (typeof resizeTextToFit === 'function') {
                    resizeTextToFit();
                }
            })
            .catch(error => {
                console.error('Error loading footer:', error);
                // フォールバック: エラー時は何も表示しない
            });
    }
});
