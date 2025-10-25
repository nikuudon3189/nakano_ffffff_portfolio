// ロゴを読み込む関数
function loadLogo() {
    fetch('logo.html')
        .then(response => response.text())
        .then(data => {
            // .logo-header-linkの中にロゴを挿入
            const logoLink = document.querySelector('.logo-header-link');
            if (logoLink) {
                logoLink.insertAdjacentHTML('afterbegin', data);
            }
        })
        .catch(error => {
            console.error('ロゴの読み込みに失敗しました:', error);
        });
}

// DOMが読み込まれた後にロゴを読み込み
document.addEventListener('DOMContentLoaded', loadLogo);
