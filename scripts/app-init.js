// Central Application Initialization
// This file ensures all components are properly initialized across all pages

class AppInitializer {
    constructor() {
        this.cart = null;
        this.initialized = false;
    }

    async init() {
        if (this.initialized) return;

        try {
            // Wait for DOM to be fully loaded
            if (document.readyState === 'loading') {
                await new Promise(resolve => {
                    document.addEventListener('DOMContentLoaded', resolve);
                });
            }

            // Initialize notification system
            if (typeof Notification !== 'undefined' && typeof notify === 'undefined') {
                window.notify = new Notification();
            }

            // Initialize cart
            if (typeof ShoppingCart !== 'undefined' && !this.cart) {
                this.cart = new ShoppingCart();
                window.cart = this.cart;
            }

            // Initialize privacy banner
            if (typeof PrivacyBanner !== 'undefined') {
                const privacyBanner = new PrivacyBanner();
            }

            // Check authentication state
            this.checkAuthState();

            this.initialized = true;
            console.log('App initialized successfully');
        } catch (error) {
            console.error('Error initializing app:', error);
        }
    }

    checkAuthState() {
        const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
        const userEmail = localStorage.getItem('userEmail');
        const navLoginBtn = document.getElementById('navLoginBtn');
        const adminLink = document.getElementById('adminLink');

        if (isAuthenticated && userEmail && navLoginBtn) {
            const loginText = navLoginBtn.querySelector('span');
            if (loginText) {
                loginText.textContent = userEmail.split('@')[0];
            }
            if (adminLink) {
                adminLink.style.display = 'block';
            }
        }
    }
}

// Create global app initializer instance
window.appInitializer = new AppInitializer();

// Auto-initialize
window.appInitializer.init();
