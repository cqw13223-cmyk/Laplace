// メイン機能スクリプト

document.addEventListener('DOMContentLoaded', function() {
    // ページロード時の初期化
    initializePageElements();
    setupEventListeners();
});

// ページ要素の初期化
function initializePageElements() {
    // ナビゲーション関連の初期化
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    updateActiveNavLink(currentPage);
}

// アクティブなナビゲーションリンクを更新
function updateActiveNavLink(currentPage) {
    const navLinks = document.querySelectorAll('.nav-menu a');
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPage || (currentPage === '' && href === 'index.html')) {
            link.style.color = '#3498db';
        }
    });
}

// イベントリスナーのセットアップ
function setupEventListeners() {
    // スムーススクロール
    setupSmoothScroll();
    
    // ウィンドウリサイズイベント
    window.addEventListener('resize', handleWindowResize);
}

// スムーススクロール
function setupSmoothScroll() {
    const links = document.querySelectorAll('a[href^="#"]');
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href === '#') return;
            
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
}

// ウィンドウリサイズ時の処理
function handleWindowResize() {
    // 必要に応じてレイアウトを調整
    console.log('Window resized');
}

// ユーティリティ関数
function showMessage(message, type = 'info') {
    // メッセージ表示関数
    console.log(`[${type.toUpperCase()}] ${message}`);
}

function hideElement(element) {
    if (element) {
        element.style.display = 'none';
    }
}

function showElement(element) {
    if (element) {
        element.style.display = 'block';
    }
}