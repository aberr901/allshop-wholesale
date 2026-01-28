// Reusable Head Meta Component
// Dynamically injects favicon and theme-color into the document head
// This allows for centralized control of meta elements across all pages

(function() {
    'use strict';
    
    // Configuration - Change these values to update across all pages
    const HEAD_CONFIG = {
        favicon: 'favicon.svg',
        faviconType: 'image/svg+xml',
        themeColor: '#e31837'
    };
    
    // Create and inject favicon link
    function injectFavicon() {
        // Remove any existing favicon links
        const existingFavicons = document.querySelectorAll('link[rel="icon"], link[rel="shortcut icon"]');
        existingFavicons.forEach(link => link.remove());
        
        // Create new favicon link
        const faviconLink = document.createElement('link');
        faviconLink.rel = 'icon';
        faviconLink.type = HEAD_CONFIG.faviconType;
        faviconLink.href = HEAD_CONFIG.favicon;
        
        // Insert at the beginning of head
        const head = document.head || document.getElementsByTagName('head')[0];
        head.insertBefore(faviconLink, head.firstChild);
    }
    
    // Create and inject theme-color meta tag
    function injectThemeColor() {
        // Remove any existing theme-color meta
        const existingThemeColor = document.querySelector('meta[name="theme-color"]');
        if (existingThemeColor) {
            existingThemeColor.remove();
        }
        
        // Create new theme-color meta
        const themeColorMeta = document.createElement('meta');
        themeColorMeta.name = 'theme-color';
        themeColorMeta.content = HEAD_CONFIG.themeColor;
        
        // Insert into head
        const head = document.head || document.getElementsByTagName('head')[0];
        head.appendChild(themeColorMeta);
    }
    
    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            injectFavicon();
            injectThemeColor();
        });
    } else {
        // DOM already loaded
        injectFavicon();
        injectThemeColor();
    }
})();
