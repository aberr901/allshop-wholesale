// Reusable Header Component
class HeaderComponent {
    constructor(options = {}) {
        this.currentPage = options.currentPage || '';
        this.showCategories = options.showCategories || false;
        this.showBrands = options.showBrands || false;
        this.department = options.department || null;
    }

    render() {
        return `
    <header class="header">
        <nav class="navbar">
            <div class="container">
                <div class="nav-brand">
                    <a href="/">
                        <img src="logo.svg" alt="All Shop Wholesale" class="brand-logo-img">
                    </a>
                </div>
                <button class="mobile-menu-toggle" id="mobileMenuToggle" aria-label="Toggle menu">
                    <span></span>
                    <span></span>
                    <span></span>
                </button>
                <div class="nav-menu" id="navMenu">
                    ${this.currentPage !== 'home' ? '<a href="/" class="nav-link">Home</a>' : ''}
                    ${this.currentPage !== 'home-kitchen' ? '<a href="home-kitchen" class="nav-link">Home & Kitchen</a>' : ''}
                    ${this.currentPage !== 'pet-supplies' ? '<a href="pet-supplies" class="nav-link">Pet Supplies</a>' : ''}
                    ${this.showCategories ? `
                    <div class="nav-dropdown">
                        <a href="#products" class="nav-link">Categories</a>
                        <div class="dropdown-menu" id="categoriesDropdown">
                            <!-- Categories will be loaded dynamically -->
                        </div>
                    </div>
                    ` : ''}
                    ${this.showBrands ? `
                    <div class="nav-dropdown">
                        <a href="#brands" class="nav-link">Brands</a>
                        <div class="dropdown-menu brands-dropdown" id="brandsDropdown">
                            <!-- Brands will be loaded dynamically -->
                        </div>
                    </div>
                    ` : ''}
                    ${this.currentPage !== 'about' ? '<a href="about" class="nav-link">About Us</a>' : ''}
                    ${this.currentPage !== 'contact' ? '<a href="contact" class="nav-link">Contact</a>' : ''}
                </div>
                <div class="nav-actions">
                    <button class="btn-login" id="navLoginBtn">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                            <circle cx="12" cy="7" r="4"/>
                        </svg>
                        Login
                    </button>
                    <a href="admin.html" class="nav-link-admin" id="adminLink">Admin</a>
                    <button class="cart-btn" id="cartBtn">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
                            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
                        </svg>
                        <span class="cart-count" id="cartCount">0</span>
                    </button>
                </div>
            </div>
        </nav>
    </header>
        `;
    }

    mount(targetElement) {
        if (typeof targetElement === 'string') {
            targetElement = document.querySelector(targetElement);
        }
        if (targetElement) {
            targetElement.innerHTML = this.render();
            this.initializeEvents();
        }
    }

    initializeEvents() {
        // Mobile menu toggle
        const mobileMenuToggle = document.getElementById('mobileMenuToggle');
        const navMenu = document.getElementById('navMenu');
        
        if (mobileMenuToggle && navMenu) {
            mobileMenuToggle.addEventListener('click', () => {
                navMenu.classList.toggle('active');
                mobileMenuToggle.classList.toggle('active');
            });
        }

        // Handle dropdown trigger links
        const dropdownTriggers = document.querySelectorAll('.nav-dropdown > .nav-link');
        dropdownTriggers.forEach(trigger => {
            trigger.addEventListener('click', (e) => {
                e.preventDefault();
                // Toggle dropdown on mobile
                if (window.innerWidth <= 768) {
                    const dropdown = trigger.nextElementSibling;
                    if (dropdown) {
                        const isVisible = dropdown.style.display === 'block';
                        // Close all other dropdowns
                        document.querySelectorAll('.dropdown-menu').forEach(menu => {
                            menu.style.display = 'none';
                        });
                        // Toggle current dropdown
                        dropdown.style.display = isVisible ? 'none' : 'block';
                    }
                }
                // On desktop, hover will handle it via CSS
            });
        });
    }
}

// Auto-initialize if headerPlaceholder exists
document.addEventListener('DOMContentLoaded', () => {
    const headerPlaceholder = document.getElementById('headerPlaceholder');
    if (headerPlaceholder) {
        const options = {
            currentPage: headerPlaceholder.dataset.currentPage || '',
            showCategories: headerPlaceholder.dataset.showCategories === 'true',
            showBrands: headerPlaceholder.dataset.showBrands === 'true',
            department: headerPlaceholder.dataset.department || null
        };
        const header = new HeaderComponent(options);
        header.mount(headerPlaceholder);
    }
});
