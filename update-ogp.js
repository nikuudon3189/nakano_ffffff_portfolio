// ワークページのOGP画像をogp.pngに統一するスクリプト
const fs = require('fs');
const path = require('path');

// ワークページのファイル一覧
const workFiles = [
    'works-ashmea.html',
    'works-bathy.html',
    'works-fuyuu.html',
    'works-kakapo.html',
    'works-nayuta.html',
    'works-nero.html',
    'works-rui.html',
    'works-sato.html',
    'works-shiki.html',
    'works-tamaya.html',
    'works-vmdn.html',
    'works-yuna.html'
];

workFiles.forEach(fileName => {
    const filePath = path.join(__dirname, fileName);

    if (fs.existsSync(filePath)) {
        let content = fs.readFileSync(filePath, 'utf8');

        // og:imageをogp.pngに変更
        content = content.replace(
            /<meta property="og:image" content="https:\/\/example\.com\/images\/works-[^"]+\.png">/g,
            '<meta property="og:image" content="https://example.com/images/ogp.png">'
        );

        // twitter:imageをogp.pngに変更
        content = content.replace(
            /<meta name="twitter:image" content="https:\/\/example\.com\/images\/works-[^"]+\.png">/g,
            '<meta name="twitter:image" content="https://example.com/images/ogp.png">'
        );

        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`Updated: ${fileName}`);
    } else {
        console.log(`File not found: ${fileName}`);
    }
});

console.log('All work files updated!');
