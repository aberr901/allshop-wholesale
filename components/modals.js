// Reusable Modal Components (Login and Cart)
class ModalComponent {
    renderLoginModal() {
        return `
    <!-- Login Modal -->
    <div class="modal" id="loginModal">
        <div class="modal-content">
            <button class="modal-close" id="loginClose">&times;</button>
            <h2>Login to Your Wholesale Account</h2>
            <p class="modal-subtitle">Access exclusive wholesale pricing and features</p>
            
            <form class="login-form" id="loginForm">
                <div class="form-group">
                    <label for="loginEmail">Email Address</label>
                    <input type="email" id="loginEmail" required placeholder="your@email.com">
                </div>
                <div class="form-group">
                    <label for="loginPassword">Password</label>
                    <input type="password" id="loginPassword" required placeholder="Enter your password">
                </div>
                <button type="submit" class="btn btn-primary btn-block">Sign In</button>
            </form>
            
            <div class="login-divider">
                <span>or</span>
            </div>
            
            <button class="btn btn-google" id="googleBtn">
                <svg width="20" height="20" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Sign in with Google
            </button>
            
            <div class="login-footer" style="display: none;">
                <p>Don't have an account? <a href="#" id="createAccountLink">Contact us to register</a></p>
            </div>
        </div>
    </div>
        `;
    }

    renderCartSidebar() {
        return `
    <!-- Cart Sidebar -->
    <div class="cart-sidebar" id="cartSidebar">
        <div class="cart-header">
            <h3>Shopping Cart</h3>
            <button class="cart-close" id="cartClose">&times;</button>
        </div>
        <div class="cart-items" id="cartItemsList">
            <!-- Cart items will be populated by JavaScript -->
        </div>
        <div class="cart-footer">
            <div class="cart-total">
                <span>Total:</span>
                <span class="total-amount" id="cartTotal">€0.00</span>
            </div>
            <button class="btn btn-primary btn-block">Proceed to Checkout</button>
        </div>
    </div>
    <div class="cart-overlay" id="cartOverlay"></div>
        `;
    }

    mount(targetElement) {
        if (typeof targetElement === 'string') {
            targetElement = document.querySelector(targetElement);
        }
        if (targetElement) {
            targetElement.innerHTML = this.renderLoginModal() + this.renderCartSidebar();
            this.initializeEvents();
        }
    }

    initializeEvents() {
        // Login Modal Events
        const navLoginBtn = document.getElementById('navLoginBtn');
        const loginModal = document.getElementById('loginModal');
        const loginClose = document.getElementById('loginClose');
        const loginForm = document.getElementById('loginForm');
        const googleBtn = document.getElementById('googleBtn');
        const createAccountLink = document.getElementById('createAccountLink');

        // Cart Sidebar Events
        const cartBtn = document.getElementById('cartBtn');
        const cartSidebar = document.getElementById('cartSidebar');
        const cartClose = document.getElementById('cartClose');
        const cartOverlay = document.getElementById('cartOverlay');

        // Login button
        if (navLoginBtn) {
            navLoginBtn.addEventListener('click', () => {
                loginModal.classList.add('active');
            });
        }

        // Close login modal
        if (loginClose) {
            loginClose.addEventListener('click', () => {
                loginModal.classList.remove('active');
            });
        }

        // Close modal on background click
        if (loginModal) {
            loginModal.addEventListener('click', (e) => {
                if (e.target === loginModal) {
                    loginModal.classList.remove('active');
                }
            });
        }

        // Cart button
        if (cartBtn) {
            cartBtn.addEventListener('click', () => {
                cartSidebar.classList.add('active');
                cartOverlay.classList.add('active');
            });
        }

        // Close cart
        if (cartClose) {
            cartClose.addEventListener('click', () => {
                cartSidebar.classList.remove('active');
                cartOverlay.classList.remove('active');
            });
        }

        if (cartOverlay) {
            cartOverlay.addEventListener('click', () => {
                cartSidebar.classList.remove('active');
                cartOverlay.classList.remove('active');
            });
        }

        // Google login
        if (googleBtn) {
            googleBtn.addEventListener('click', (e) => {
                e.preventDefault();
                if (typeof notify !== 'undefined') {
                    notify.error('No account found with this Google account. Please register for a wholesale account first.');
                }
                const loginFooter = document.querySelector('.login-footer');
                if (loginFooter) {
                    loginFooter.style.display = 'block';
                }
            });
        }

        // Login form
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const email = document.getElementById('loginEmail').value;
                if (typeof notify !== 'undefined') {
                    notify.error('No account found for: ' + email + '. Please register for a wholesale account first.');
                }
                const loginFooter = document.querySelector('.login-footer');
                if (loginFooter) {
                    loginFooter.style.display = 'block';
                }
                loginForm.reset();
            });
        }

        // Create account link
        if (createAccountLink) {
            createAccountLink.addEventListener('click', (e) => {
                e.preventDefault();
                if (typeof notify !== 'undefined') {
                    notify.info('To create a wholesale account, please contact us at info@allshopwholesale.com or call 0050946820. Our team will set up your account and provide login credentials.', 6000);
                }
            });
        }
    }
}

// Auto-initialize if modalsPlaceholder exists
document.addEventListener('DOMContentLoaded', () => {
    const modalsPlaceholder = document.getElementById('modalsPlaceholder');
    if (modalsPlaceholder) {
        const modals = new ModalComponent();
        modals.mount(modalsPlaceholder);
    }
});
