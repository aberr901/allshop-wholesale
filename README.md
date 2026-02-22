# All Shop Wholesale - E-commerce Platform

## 📋 Project Overview

All Shop Wholesale SRL is a wholesale e-commerce platform providing businesses and retailers with premium products across multiple categories including Home & Kitchen and Pet Supplies.

**Company Details:**
- **Name:** All Shop Wholesale SRL
- **VAT:** RO50946820
- **Address:** Bulevardul UNIRII, Nr. 61, Bl. F3, Scara 4, Ap 210, București, București 030167, România
- **Phone:** 0050946820
- **Email:** info@allshopwholesale.com
- **Business Hours:** Sunday - Thursday (Closed Friday & Saturday)

## 🏗️ Architecture

### Component-Based System

The application now uses a modern component-based architecture for better maintainability and code reuse:

#### Components (`/components/`)
- **header.js** - Reusable header with navigation, adapts to different pages
- **footer.js** - Common footer across all pages
- **modals.js** - Login and cart modal components

#### Core Scripts (`/scripts/`)
- **app-init.js** - Central initialization script that ensures components load properly
- **cart.js** - Shopping cart functionality
- **auth.js** - Authentication (MSAL/Entra ID for admin)
- **notifications.js** - Toast notification system
- **privacy-banner.js** - GDPR compliance banner
- **storage.js** - LocalStorage management with GDPR compliance
- **config.js** - API and configuration settings
- **products-enhanced.js** - Advanced product catalog with virtual scrolling
- **admin.js** - Admin panel functionality
- **brand-manager.js** - Brand CRUD operations
- **category-manager.js** - Category CRUD operations

### Directory Structure

```
online-store/
├── components/          # Reusable UI components
│   ├── header.js
│   ├── footer.js
│   └── modals.js
├── scripts/            # JavaScript modules
│   ├── app-init.js
│   ├── cart.js
│   ├── auth.js
│   ├── notifications.js
│   ├── privacy-banner.js
│   ├── storage.js
│   ├── config.js
│   ├── products-enhanced.js
│   ├── admin.js
│   ├── brand-manager.js
│   ├── category-manager.js
│   └── virtual-scroller.js
├── styles/             # CSS stylesheets
│   ├── main.css
│   ├── animations.css
│   └── admin.css
├── archive/            # Old versions and backups
├── index.html          # Homepage/departments
├── home-kitchen.html   # Home & Kitchen department
├── pet-supplies.html   # Pet Supplies department
├── about.html          # Company information
├── contact.html        # Contact form
├── admin.html          # Admin panel
└── staticwebapp.config.json  # Azure Static Web App config
```

## 🚀 Features

### Customer-Facing Features
- **Multi-Department Catalog** - Home & Kitchen, Pet Supplies
- **Virtual Scrolling** - High-performance product listing
- **Shopping Cart** - Add to cart, quantity management
- **User Authentication** - Login system for wholesale accounts
- **Category & Brand Filtering** - Advanced product discovery
- **Responsive Design** - Mobile-first approach
- **GDPR Compliance** - Privacy banner and cookie consent

### Admin Features
- **Product Management** - CRUD operations
- **Category Management** - Organize products
- **Brand Management** - Manage brand catalog
- **Entra ID Authentication** - Secure admin access via Microsoft Entra ID (formerly Azure AD)

## 🔧 Technical Stack

- **Frontend:** Vanilla JavaScript (ES6+), HTML5, CSS3
- **Storage:** LocalStorage (GDPR-compliant)
- **Authentication:** Microsoft Authentication Library (MSAL) for admin
- **Hosting:** Azure Static Web Apps
- **Icons:** SVG inline icons

## 📦 Setup & Installation

### Local Development

1. Clone the repository
2. Open `config.template.js` and configure your settings
3. Rename to `config.js`
4. Serve the files using any static web server:

```powershell
# Using Python
python -m http.server 8000

# Using Node.js http-server
npx http-server -p 8000

# Using PHP
php -S localhost:8000
```

5. Navigate to `http://localhost:8000`

### Azure Static Web App Deployment

The project includes `staticwebapp.config.json` for Azure deployment:

```powershell
# Using Azure CLI
az staticwebapp create \
  --name all-shop-wholesale \
  --resource-group your-rg \
  --source . \
  --location "West Europe"
```

### Authentication Setup (Admin Panel)

The admin panel uses Microsoft Entra ID (formerly Azure AD) for authentication:

1. Register an app in [Azure Portal](https://portal.azure.com) > Entra ID
2. Configure redirect URIs
3. Copy Application (client) ID and Tenant ID
4. Update `scripts/config.js` with these values
5. See `archive/SETUP-ENTRA-ID.md` for detailed steps

## 🎨 Using Components

### Adding Header to a Page

```html
<!-- Header Placeholder -->
<div id="headerPlaceholder" 
     data-current-page="about"
     data-show-categories="false"
     data-show-brands="false"></div>

<!-- Load component script -->
<script src="components/header.js"></script>
```

### Adding Footer

```html
<!-- Footer Placeholder -->
<div id="footerPlaceholder"></div>

<!-- Load component script -->
<script src="components/footer.js"></script>
```

### Adding Modals (Login & Cart)

```html
<!-- Modals Placeholder -->
<div id="modalsPlaceholder"></div>

<!-- Load component script -->
<script src="components/modals.js"></script>
```

### Complete Page Template

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Page Title - All Shop Wholesale</title>
    <link rel="stylesheet" href="styles/main.css">
    <link rel="stylesheet" href="styles/animations.css">
</head>
<body>
    <!-- Header -->
    <div id="headerPlaceholder" data-current-page="pagename"></div>

    <!-- Main Content -->
    <main class="page-content">
        <!-- Your content here -->
    </main>

    <!-- Footer -->
    <div id="footerPlaceholder"></div>

    <!-- Modals -->
    <div id="modalsPlaceholder"></div>

    <!-- Core Scripts -->
    <script src="scripts/config.js"></script>
    <script src="scripts/storage.js"></script>
    <script src="scripts/notifications.js"></script>
    <script src="scripts/privacy-banner.js"></script>
    <script src="scripts/cart.js"></script>
    
    <!-- Components -->
    <script src="components/header.js"></script>
    <script src="components/footer.js"></script>
    <script src="components/modals.js"></script>
    
    <!-- App Init -->
    <script src="scripts/app-init.js"></script>
</body>
</html>
```

## 🔐 LocalStorage & GDPR Compliance

The application uses LocalStorage for:
- Shopping cart data
- User authentication state
- Privacy consent tracking

All storage operations go through `scripts/storage.js` which implements:
- Consent checking before storing data
- Privacy banner prompts
- Data clearing on consent withdrawal

See `archive/LOCALSTORAGE-GDPR-ANALYSIS.md` for compliance details.

## 📱 API Integration

Products are loaded from JSON files or can be configured to use a REST API:

```javascript
// In scripts/config.js
const CONFIG = {
    USE_MOCK_DATA: false,  // Set to false for API
    API_BASE_URL: 'https://your-api.com',
    // ... other config
};
```

## 📚 Developer Documentation

For a concise technical overview and philosophy guide aimed at developers reproducing or extending the site, see [`Documentation/DEVELOPER-OVERVIEW.md`](Documentation/DEVELOPER-OVERVIEW.md).

Other reference docs in [`Documentation/`](Documentation/):
- [`QUICK-REFERENCE.md`](Documentation/QUICK-REFERENCE.md) – Common tasks and code snippets
- [`DEPLOYMENT-CHECKLIST.md`](Documentation/DEPLOYMENT-CHECKLIST.md) – Azure deployment steps
- [`REFACTORING-COMPLETE.md`](Documentation/REFACTORING-COMPLETE.md) – January 2026 refactor write-up

## 🛠️ Development Guidelines

### Adding a New Page

1. Create HTML file using the template above
2. Set appropriate `data-current-page` attribute
3. Include all core scripts and components
4. Custom page logic can be added in inline `<script>` tags or separate files

### Modifying Components

Components are self-contained and auto-initialize. To modify:

1. Edit the component file in `/components/`
2. Changes apply to all pages using that component
3. Test across all pages to ensure compatibility

### Cart Functionality

The cart is initialized globally by `app-init.js`. Access it via:

```javascript
// Add item to cart
window.cart.addItem(product, quantity);

// Get cart items
const items = window.cart.items;

// Clear cart
window.cart.clearCart();
```

## 🐛 Troubleshooting

### Cart/Login Buttons Not Working

**Issue:** Cart or login buttons unresponsive on some pages.

**Solution:** Ensure the page loads:
1. `scripts/cart.js` and `scripts/app-init.js`
2. `components/modals.js`
3. Components are loaded AFTER core scripts

### Admin Login Fails

**Issue:** Admin authentication not working.

**Solution:**
1. Check `config.js` has correct Entra ID credentials
2. Verify redirect URIs in Azure portal match your URLs
3. Check browser console for MSAL errors
4. See `archive/SETUP-ENTRA-ID.md` for setup guide

### Components Not Loading

**Issue:** Header/footer not appearing.

**Solution:**
1. Verify placeholder divs have correct IDs
2. Check component scripts are loaded
3. Check browser console for JavaScript errors
4. Ensure DOM is loaded before component initialization

## 📊 Performance

- **Virtual Scrolling:** Handles 1000+ products efficiently
- **Lazy Loading:** Images loaded as needed
- **Component Caching:** Reusable components reduce redundancy
- **Minification:** Consider minifying CSS/JS for production

## 🔄 Recent Improvements

### Component-Based Refactor (January 2026)
- Converted hardcoded headers/footers to reusable components
- Centralized cart and auth initialization
- Fixed cart/login button issues on non-homepage pages
- Organized directory structure with archive folder
- Consolidated documentation into this README

See `archive/IMPROVEMENTS-COMPLETE.md` for previous improvement history.

## 📞 Support & Contact

For technical support or wholesale inquiries:
- **Email:** info@allshopwholesale.com
- **Phone:** 0050946820
- **Hours:** Sunday - Thursday

## 📄 License

© 2026 All Shop Wholesale SRL. All rights reserved.

---

**Last Updated:** January 18, 2026
