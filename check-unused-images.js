// 使われていない画像ファイルをチェックするスクリプト
const fs = require('fs');
const path = require('path');

// imagesフォルダ内の全画像ファイルを取得
const imagesDir = path.join(__dirname, 'images');
const allImageFiles = fs.readdirSync(imagesDir)
    .filter(file => /\.(png|webp|svg|jpg|jpeg)$/i.test(file))
    .map(file => `images/${file}`);

console.log(`総画像ファイル数: ${allImageFiles.length}`);

// HTMLファイルから使用されている画像を抽出
const htmlFiles = [
    'index.html',
    'profile.html',
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

const usedImages = new Set();

htmlFiles.forEach(htmlFile => {
    const filePath = path.join(__dirname, htmlFile);
    if (fs.existsSync(filePath)) {
        const content = fs.readFileSync(filePath, 'utf8');

        // images/で始まる画像ファイルを抽出
        const imageMatches = content.match(/images\/[^"'\s]+\.(png|webp|svg|jpg|jpeg)/gi);
        if (imageMatches) {
            imageMatches.forEach(img => usedImages.add(img));
        }
    }
});

console.log(`使用されている画像数: ${usedImages.size}`);

// 使われていない画像を特定
const unusedImages = allImageFiles.filter(img => !usedImages.has(img));

console.log(`\n使われていない画像ファイル (${unusedImages.length}個):`);
unusedImages.forEach(img => {
    console.log(`- ${img}`);
});

// ファイルサイズも計算
let totalUnusedSize = 0;
unusedImages.forEach(img => {
    const fullPath = path.join(__dirname, img);
    if (fs.existsSync(fullPath)) {
        const stats = fs.statSync(fullPath);
        totalUnusedSize += stats.size;
    }
});

console.log(`\n使われていない画像の総サイズ: ${(totalUnusedSize / 1024 / 1024).toFixed(2)} MB`);

// 削除候補のリストをファイルに出力
if (unusedImages.length > 0) {
    const deleteList = unusedImages.map(img => `rm "${img}"`).join('\n');
    fs.writeFileSync('delete-unused-images.sh', deleteList);
    console.log('\n削除用スクリプトを delete-unused-images.sh に保存しました');
}
