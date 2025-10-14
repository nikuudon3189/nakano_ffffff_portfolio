/*
 * works.jsonからデータを読み込んで、動的にコンテンツを生成する
 */


// URLパラメータからwork IDを取得
function getWorkIdFromUrl() {
    const urlParams = new URLSearchParams(window.location.search);
    const workId = urlParams.get('id');

    if (workId) {
        return workId;
    }

    // フォールバック: パスから取得
    const path = window.location.pathname;
    const filename = path.split('/').pop();
    return filename.replace('.html', '');
}


// works.jsonを読み込む
async function loadWorksData() {
    try {
        const response = await fetch('data/works.json');
        const data = await response.json();
        return data.works;
    } catch (error) {
        console.error('Error loading works data:', error);
        return null;
    }
}

// コンテンツを動的に生成
function generateWorkContent(workData) {
    if (!workData) return;

    // タイトルを設定
    const titleElement = document.querySelector('h2.title.common-nakaguro-to-kakko-no-en span[lang="en"]');
    if (titleElement) {
        titleElement.textContent = workData.titleEn;
    }

    // ヒーロー画像を設定
    const heroImage = document.querySelector('section.work--hero img.kv');
    if (heroImage) {
        console.log('Setting hero image:', workData.heroImage);
        heroImage.src = workData.heroImage;
        heroImage.alt = workData.title;
    } else {
        console.error('Hero image element not found');
    }

    // 情報セクションを設定
    const infoItems = document.querySelectorAll('.info dl.list div.item');
    if (infoItems.length >= 5) {
        infoItems[0].querySelector('dd').textContent = workData.info.scope;
        infoItems[1].querySelector('dd').textContent = workData.info.date;
        infoItems[2].querySelector('dd').textContent = workData.info.client;
        infoItems[3].querySelector('dd').innerHTML = `<a href="${workData.info.clientUrl}" target="_blank">${workData.info.clientUrl}</a>`;
        infoItems[4].querySelector('dd').textContent = workData.info.output;
    }

    // 説明文を設定
    const body1Ja = document.querySelector('p[lang="ja"].body-1');
    const body2Ja = document.querySelector('p[lang="ja"].body-2');
    const body1En = document.querySelector('p[lang="en"].body-1');
    const body2En = document.querySelector('p[lang="en"].body-2');

    if (body1Ja) body1Ja.innerHTML = workData.description.ja.body1;
    if (body2Ja) body2Ja.innerHTML = workData.description.ja.body2;
    if (body1En) body1En.innerHTML = workData.description.en.body1;
    if (body2En) body2En.innerHTML = workData.description.en.body2;

    // URLリンクを設定
    const urlLink = document.querySelector('.url a');
    if (urlLink) {
        urlLink.href = workData.info.clientUrl;
        urlLink.textContent = workData.info.clientUrl;
    }

    // オーバービュー画像を設定
    const overviewImage = document.querySelector('figure.img img');
    if (overviewImage) {
        overviewImage.src = workData.overviewImage;
        overviewImage.alt = workData.title;
    }

    // ギャラリー画像を設定
    const galleryImages = document.querySelectorAll('section.work--contents .gyo img');
    console.log('Found gallery images:', galleryImages.length);
    workData.gallery.forEach((imageSrc, index) => {
        if (galleryImages[index]) {
            console.log('Setting gallery image', index, ':', imageSrc);
            galleryImages[index].src = imageSrc;
            galleryImages[index].alt = workData.title;
        }
    });

    // テキストセクションを設定
    const textSections = document.querySelectorAll('section.work--contents .gyo.text-and-image');
    workData.textSections.forEach((section, index) => {
        if (textSections[index]) {
            const jaText = textSections[index].querySelector('.text p[lang="ja"]');
            const enText = textSections[index].querySelector('.text p[lang="en"]');
            const sectionImage = textSections[index].querySelector('figure.img img');

            if (jaText) jaText.innerHTML = section.ja;
            if (enText) enText.innerHTML = section.en;
            if (sectionImage) {
                sectionImage.src = section.image;
                sectionImage.alt = workData.title;
            }
        }
    });

    // Next Workを設定
    const nextWorkLink = document.querySelector('aside.work--next-work a.link');
    const nextWorkTitle = document.querySelector('aside.work--next-work a.link p.title');
    const nextWorkImage = document.querySelector('aside.work--next-work a.link img');

    if (nextWorkLink && workData.nextWork) {
        nextWorkLink.href = workData.nextWork.link;
        if (nextWorkTitle) nextWorkTitle.textContent = workData.nextWork.title;
        if (nextWorkImage) {
            nextWorkImage.src = workData.nextWork.image;
            nextWorkImage.alt = workData.nextWork.title;
        }
    }
}

// ページ読み込み時に実行
document.addEventListener('DOMContentLoaded', async function () {
    const workId = getWorkIdFromUrl();
    console.log('Loading work:', workId);

    const worksData = await loadWorksData();
    if (worksData && worksData[workId]) {
        generateWorkContent(worksData[workId]);

        // 画像の読み込み完了後にgrid-animationを初期化
        setTimeout(function () {
            console.log('Initializing grid animation...');
            if (typeof GridAnimation !== 'undefined') {
                console.log('GridAnimation found, calling init()');
                GridAnimation.init();
            } else {
                console.error('GridAnimation not found');
            }
        }, 500);
    } else {
        console.error('Work data not found for:', workId);
    }
});
