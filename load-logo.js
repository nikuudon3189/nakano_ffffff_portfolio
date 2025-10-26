// ロゴを読み込む関数
document.addEventListener('DOMContentLoaded', function () {
    const logoContainer = document.getElementById('logo-container');

    if (logoContainer) {
        fetch('logo.html')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Logo not found');
                }
                return response.text();
            })
            .then(data => {
                logoContainer.innerHTML = data;
            })
            .catch(error => {
                console.error('Error loading logo:', error);
            });
    }
});
