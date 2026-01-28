// Privacy Banner Component
class PrivacyBanner {
    constructor() {
        this.storageKey = 'privacy_banner_dismissed';
        this.init();
    }

    init() {
        // Check if banner was already dismissed
        if (localStorage.getItem(this.storageKey)) {
            return;
        }

        // Create and show banner
        this.createBanner();
    }

    createBanner() {
        const banner = document.createElement('div');
        banner.id = 'privacyBanner';
        banner.className = 'privacy-banner';
        banner.innerHTML = `
            <div class="privacy-banner-content">
                <div class="privacy-banner-text">
                    <strong>Privacy Notice:</strong> We use browser storage (localStorage) to save your shopping cart and improve site performance. 
                    No personal data is collected or shared with third parties. Data is stored locally on your device only.
                </div>
                <div class="privacy-banner-actions">
                    <button class="privacy-banner-dismiss" id="privacyDismiss">Got it</button>
                </div>
            </div>
        `;

        document.body.appendChild(banner);

        // Add dismiss handler
        document.getElementById('privacyDismiss').addEventListener('click', () => {
            this.dismiss();
        });

        // Show banner with animation
        setTimeout(() => {
            banner.classList.add('show');
        }, 100);
    }

    dismiss() {
        const banner = document.getElementById('privacyBanner');
        if (banner) {
            banner.classList.remove('show');
            setTimeout(() => {
                banner.remove();
            }, 300);
        }
        localStorage.setItem(this.storageKey, 'true');
    }
}

// Initialize privacy banner
document.addEventListener('DOMContentLoaded', () => {
    new PrivacyBanner();
});
