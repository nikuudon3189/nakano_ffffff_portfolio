/**
 * ハッキング風タイプライターアニメーション
 * リファクタリング版 - より保守性と可読性を重視
 */

// 設定定数
var CONFIG = {
    DEFAULT_SETTINGS: {
        japanese: {
            charStartDelay: 1,
            glitchSpeed: 10,
            glitchDuration: 80,
            waveLength: 5,
            language: 'japanese'
        },
        english: {
            charStartDelay: 1,
            glitchSpeed: 8,
            glitchDuration: 50,
            waveLength: 10,
            language: 'english'
        }
    },
    CHARACTERS: {
        japanese: 'あいうえおかきくけこさしすせそたちつてとなにぬねのはひふへほまみむめもやゆよらりるれろわをんがぎぐげござじずぜぞだぢづでどばびぶべぼぱぴぷぺぽアイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲンガギグゲゴザジズゼゾダヂヅデドバビブベボパピプペポ',
        english: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=[]{}|;:,.<>?'
    },
    DELAY_BETWEEN_ELEMENTS: 100,
    STATES: {
        WAITING: 0,
        GLITCHING: 1,
        CONFIRMED: 2
    }
};

/**
 * ユーティリティ関数群
 */
var Utils = {
    /**
     * ランダム文字を生成
     */
    getRandomChar: function (language) {
        var chars = CONFIG.CHARACTERS[language] || CONFIG.CHARACTERS.japanese;
        return chars.charAt(Math.floor(Math.random() * chars.length));
    },

    /**
     * 設定をマージ
     */
    mergeSettings: function (userOptions) {
        var settings = {};

        // 言語を最初に決定（ユーザー設定またはデフォルト）
        var language = (userOptions && userOptions.language) || 'japanese';
        var defaults = CONFIG.DEFAULT_SETTINGS[language] || CONFIG.DEFAULT_SETTINGS.japanese;

        // デフォルト値をコピー
        for (var key in defaults) {
            if (defaults.hasOwnProperty(key)) {
                settings[key] = defaults[key];
            }
        }

        // ユーザー設定を上書き
        if (userOptions) {
            for (var key in userOptions) {
                if (userOptions.hasOwnProperty(key)) {
                    settings[key] = userOptions[key];
                }
            }
        }

        return settings;
    },

    /**
     * 要素から設定を抽出
     */
    extractElementSettings: function (element) {
        var langAttr = element.getAttribute('lang') ||
            (element.closest && element.closest('[lang]') && element.closest('[lang]').getAttribute('lang')) ||
            'ja';

        var language = (langAttr === 'en' || langAttr === 'english') ? 'english' : 'japanese';
        var defaults = CONFIG.DEFAULT_SETTINGS[language];

        return {
            charStartDelay: parseInt(element.getAttribute('data-char-delay')) || defaults.charStartDelay,
            glitchSpeed: parseInt(element.getAttribute('data-glitch-speed')) || defaults.glitchSpeed,
            glitchDuration: parseInt(element.getAttribute('data-glitch-duration')) || defaults.glitchDuration,
            waveLength: parseInt(element.getAttribute('data-wave-length')) || defaults.waveLength,
            language: language
        };
    }
};

/**
 * 文字状態管理クラス
 */
function CharacterState(char, index) {
    this.targetChar = char;
    this.currentChar = char;
    this.index = index;
    this.state = CONFIG.STATES.WAITING;
    this.startTime = null;
}

CharacterState.prototype = {
    startGlitching: function (currentTime) {
        this.state = CONFIG.STATES.GLITCHING;
        this.startTime = currentTime;
    },

    confirm: function () {
        this.state = CONFIG.STATES.CONFIRMED;
        this.currentChar = this.targetChar;
    },

    isWaiting: function () {
        return this.state === CONFIG.STATES.WAITING;
    },

    isGlitching: function () {
        return this.state === CONFIG.STATES.GLITCHING;
    },

    isConfirmed: function () {
        return this.state === CONFIG.STATES.CONFIRMED;
    },

    shouldConfirm: function (currentTime, glitchDuration) {
        return this.isGlitching() && (currentTime - this.startTime >= glitchDuration);
    }
};

/**
 * タイプライターアニメーション管理クラス
 */
function TypeWriterAnimation(element, text, settings) {
    this.element = element;
    this.targetText = text;
    this.settings = Utils.mergeSettings(settings);
    this.characters = [];
    this.currentTime = 0;
    this.animationId = null;

    this.init();
}

TypeWriterAnimation.prototype = {
    /**
     * 初期化
     */
    init: function () {
        this.element.innerHTML = '';
        this.createCharacterStates();
    },

    /**
     * 文字状態配列を作成
     */
    createCharacterStates: function () {
        for (var i = 0; i < this.targetText.length; i++) {
            this.characters.push(new CharacterState(this.targetText.charAt(i), i));
        }
    },

    /**
     * カウント取得
     */
    getCounts: function () {
        var confirmed = 0;
        var glitching = 0;

        for (var i = 0; i < this.characters.length; i++) {
            if (this.characters[i].isConfirmed()) {
                confirmed++;
            } else if (this.characters[i].isGlitching()) {
                glitching++;
            }
        }

        return { confirmed: confirmed, glitching: glitching };
    },

    /**
     * 新しい文字を開始
     */
    startNextCharacters: function () {
        var counts = this.getCounts();
        var availableSlots = this.settings.waveLength - counts.glitching;
        var nextIndex = counts.confirmed + counts.glitching;

        for (var i = 0; i < availableSlots && nextIndex < this.characters.length; i++) {
            this.characters[nextIndex].startGlitching(this.currentTime);
            nextIndex++;
        }
    },

    /**
     * 確定チェック
     */
    processConfirmation: function () {
        for (var i = 0; i < this.characters.length; i++) {
            var char = this.characters[i];
            if (char.shouldConfirm(this.currentTime, this.settings.glitchDuration)) {
                char.confirm();
            }
        }
    },

    /**
     * 表示テキスト構築
     */
    buildDisplayText: function () {
        var result = '';
        for (var i = 0; i < this.characters.length; i++) {
            var char = this.characters[i];
            if (char.isConfirmed()) {
                result += char.targetChar;
            } else if (char.isGlitching()) {
                result += Utils.getRandomChar(this.settings.language);
            } else {
                break; // WAITING状態以降は表示しない
            }
        }
        return result;
    },

    /**
     * アニメーション完了チェック
     */
    isComplete: function () {
        return this.getCounts().confirmed === this.characters.length;
    },

    /**
     * 表示更新
     */
    updateDisplay: function () {
        var displayText = this.buildDisplayText();
        this.element.innerHTML = displayText;
    },

    /**
     * メインアニメーションループ
     */
    animate: function () {
        var self = this;

        function loop() {
            self.currentTime += self.settings.glitchSpeed;

            // 定期的に新しい文字を開始
            if (self.currentTime % self.settings.charStartDelay === 0) {
                self.startNextCharacters();
            }

            // 確定処理
            self.processConfirmation();

            // 表示更新
            self.updateDisplay();

            // 完了チェック
            if (!self.isComplete()) {
                self.animationId = setTimeout(loop, self.settings.glitchSpeed);
            }
        }

        // 最初の文字を開始
        this.startNextCharacters();

        // アニメーション開始
        this.animationId = setTimeout(loop, this.settings.glitchSpeed);
    },

    /**
     * アニメーション停止
     */
    stop: function () {
        if (this.animationId) {
            clearTimeout(this.animationId);
            this.animationId = null;
        }
    }
};

/**
 * メイン関数 - 外部API
 */
function hackingTypeWriter(element, text, options) {
    var animation = new TypeWriterAnimation(element, text, options);
    animation.animate();
    return animation;
}

/**
 * 自動初期化関数
 */
function initHackingTypeWriters() {
    var elements = document.querySelectorAll('.typewriter');

    for (var i = 0; i < elements.length; i++) {
        var element = elements[i];
        var originalText = element.innerHTML.replace(/<br[^>]*>/gi, '\n').replace(/\s+/g, ' ').trim();
        var settings = Utils.extractElementSettings(element);

        // 遅延実行でスタガード効果
        (function (el, text, opts, delay) {
            setTimeout(function () {
                hackingTypeWriter(el, text, opts);
            }, delay);
        })(element, originalText, settings, i * CONFIG.DELAY_BETWEEN_ELEMENTS);
    }
}

/**
 * ホバー時のタイプライターアニメーション初期化関数
 */
function initHoverTypeWriters() {
    var elements = document.querySelectorAll('.typewriter-hover');

    for (var i = 0; i < elements.length; i++) {
        (function (element) {
            var originalText = element.innerHTML.replace(/<br[^>]*>/gi, '\n').replace(/\s+/g, ' ').trim();
            var settings = Utils.extractElementSettings(element);
            var currentAnimation = null;
            var isAnimating = false;

            // ホバー開始時の処理
            element.addEventListener('mouseenter', function (e) {
                var targetElement = e.target;

                // 既にアニメーション中の場合は何もしない
                if (isAnimating) {
                    return;
                }

                var text = targetElement.innerHTML.replace(/<br[^>]*>/gi, '\n').replace(/\s+/g, ' ').trim();
                var opts = Utils.extractElementSettings(targetElement);

                // 既存のアニメーションを停止
                if (currentAnimation) {
                    currentAnimation.stop();
                }

                // 要素の高さを固定（アニメーション中の高さ変動を防ぐ）
                var originalHeight = targetElement.offsetHeight;
                targetElement.style.minHeight = originalHeight + 'px';
                targetElement.style.height = originalHeight + 'px';

                isAnimating = true;

                // 新しいアニメーションを開始
                currentAnimation = hackingTypeWriter(targetElement, text, opts);

                // アニメーション完了後にフラグをリセット
                setTimeout(function () {
                    isAnimating = false;
                }, 2000); // アニメーションの最大時間を想定
            });

            // ホバー終了時の処理（アニメーションは続行、元のテキストに戻すだけ）
            element.addEventListener('mouseleave', function (e) {
                var targetElement = e.target;
                // アニメーションは停止せず、元のテキストに戻すだけ
                targetElement.innerHTML = originalText;
                // 高さの固定を解除
                targetElement.style.minHeight = '';
                targetElement.style.height = '';
                // アニメーションフラグをリセット
                isAnimating = false;
            });
        })(elements[i]);
    }
}

// DOM読み込み完了後に自動実行
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () {
        initHackingTypeWriters();
        initHoverTypeWriters();
    });
} else {
    initHackingTypeWriters();
    initHoverTypeWriters();
} 