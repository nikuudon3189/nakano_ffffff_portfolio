/*
 * h2.common-nakaguro-to-kakko-no-en のテキストを1文字ずつspanでラップし、
 * IntersectionObserverで画面内に入ったタイミングで1文字ずつ下からスライドインするアニメーションを実現する。
 * - :beforeや:afterは分割しない
 * - 英語も分割対象
 * - 空白や記号はアニメーションしない（char-staticクラスを付与）
 */

// テキストを1文字ずつspanタグで分割する関数
function splitTextToSpans(target) {
    // 既に分割済みの場合は処理をスキップ
    if (target.dataset.splitted) return;

    // 子ノードを配列に変換
    var nodes = Array.from(target.childNodes);

    nodes.forEach(function (node) {
        if (node.nodeType === 3) { // テキストノードの場合
            // 文字を1文字ずつ分割
            var chars = node.textContent.split('');

            // 各文字をspanタグで包む
            chars.forEach(function (char, i) {
                var span = document.createElement('span');
                span.textContent = char;
                // 空白のみアニメーションしない（ハイフンはアニメーション対象）
                if (/^\s+$/u.test(char)) {
                    span.className = 'char-static';
                } else {
                    span.className = 'char';
                    // 文字ごとにアニメーションの遅延時間を設定
                    span.style.transitionDelay = (i * 0.04) + 's';
                }
                target.appendChild(span);
            });

            // 元のテキストノードを削除
            target.removeChild(node);
        } else if (node.nodeType === 1) { // 要素ノードの場合は再帰的に処理
            splitTextToSpans(node);
        }
    });

    // 分割済みフラグを設定
    target.dataset.splitted = '1';
}

// DOMの読み込み完了時に実行
// 対象となる見出し要素を取得
// 各要素に対してテキスト分割を実行
// IntersectionObserverで画面内に入ったら.is-inviewを付与
// 古いブラウザでは即時表示

document.addEventListener('DOMContentLoaded', function () {
    var targets = document.querySelectorAll('h2.common-nakaguro-to-kakko-no-en');
    console.log('fadeInOnScroll: Found', targets.length, 'targets');
    console.log('fadeInOnScroll: Targets:', targets);
    targets.forEach(splitTextToSpans);

    // IntersectionObserverと即時アニメーション設定の削除

    // TODO: 他の関連するアニメーションがあれば、それらも適宜削除する。
}); 