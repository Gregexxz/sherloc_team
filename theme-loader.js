// js/theme-loader.js
(function() {
    const savedTheme = localStorage.getItem('sherloc-theme');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-mode');
    }
})();