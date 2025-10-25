// ワークページのメニューを一括更新するスクリプト
const fs = require('fs');
const path = require('path');

// ワークページのファイル一覧
const workFiles = [
    'works-yuna.html',
    'works-kakapo.html',
    'works-nero.html',
    'works-nayuta.html',
    'works-shiki.html',
    'works-sato.html',
    'works-fuyuu.html',
    'works-tamaya.html',
    'works-rui.html',
    'works-vmdn.html'
];

// メニュー部分のパターン（削除対象）
const menuPattern = /<div class="menu--glass-overlay"><\/div>/;

// スクリプトタグのパターン（追加対象）
const scriptPattern = /(<script src="color-grid-animation\.js"><\/script>)/;

workFiles.forEach(fileName => {
    const filePath = path.join(__dirname, fileName);

    if (fs.existsSync(filePath)) {
        let content = fs.readFileSync(filePath, 'utf8');

        // メニュー部分を削除
        content = content.replace(menuPattern, '<div class="menu--glass-overlay"></div>');

        // スクリプトタグを追加
        content = content.replace(scriptPattern, '$1\n    <script src="load-menu.js"></script>');

        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`Updated: ${fileName}`);
    } else {
        console.log(`File not found: ${fileName}`);
    }
});

console.log('All work files updated!');
