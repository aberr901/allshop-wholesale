# Quick Reference Guide

## 🚀 Quick Start

### Running Locally
```powershell
# Navigate to project directory
cd c:\Users\AbrahamEkstein\online-store

# Start local server (choose one)
python -m http.server 8000
# OR
npx http-server -p 8000

# Open browser
http://localhost:8000
```

### Project Structure
```
online-store/
├── components/      → Reusable UI components
├── scripts/         → JavaScript functionality  
├── styles/          → CSS styles
├── archive/         → Old versions & backups
├── *.html          → Web pages
└── README.md       → Full documentation
```

## 📄 Key Files

### HTML Pages
- `index.html` - Homepage (department selector)
- `home-kitchen.html` - Home & Kitchen products
- `pet-supplies.html` - Pet Supplies products
- `about.html` - Company information
- `contact.html` - Contact form
- `admin.html` - Admin panel (requires Entra ID auth)

### Components (`/components/`)
- `header.js` - Navigation header
- `footer.js` - Page footer
- `modals.js` - Login & cart modals

### Core Scripts (`/scripts/`)
- `app-init.js` - Initializes everything
- `cart.js` - Shopping cart
- `auth.js` - Authentication
- `notifications.js` - Toast messages
- `config.js` - Configuration

## 🔧 Common Tasks

### Add Item to Cart (JavaScript)
```javascript
window.cart.addItem({
    id: 1,
    name: 'Product Name',
    price: 29.99,
    imageUrl: 'image.jpg'
}, quantity);
```

### Show Notification
```javascript
notify.success('Success message');
notify.error('Error message');
notify.info('Info message');
```

### Check if User Logged In
```javascript
const isLoggedIn = localStorage.getItem('isAuthenticated') === 'true';
const userEmail = localStorage.getItem('userEmail');
```

## 📝 Adding a New Page

### Template
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
    <div id="headerPlaceholder" data-current-page="yourpage"></div>

    <!-- Content -->
    <main class="page-content">
        <!-- Your content here -->
    </main>

    <!-- Footer -->
    <div id="footerPlaceholder"></div>

    <!-- Modals -->
    <div id="modalsPlaceholder"></div>

    <!-- Scripts -->
    <script src="scripts/config.js"></script>
    <script src="scripts/storage.js"></script>
    <script src="scripts/notifications.js"></script>
    <script src="scripts/privacy-banner.js"></script>
    <script src="scripts/cart.js"></script>
    <script src="components/header.js"></script>
    <script src="components/footer.js"></script>
    <script src="components/modals.js"></script>
    <script src="scripts/app-init.js"></script>
</body>
</html>
```

## 🐛 Troubleshooting

### Cart/Login Not Working
**Check:**
1. Are all scripts loaded?
2. Check browser console for errors
3. Verify `app-init.js` is loaded last

### Components Not Showing
**Check:**
1. Placeholder divs have correct IDs
2. Component scripts are loaded
3. No JavaScript errors in console

### Admin Login Fails
**Check:**
1. `config.js` has correct Entra ID settings
2. Redirect URIs match in Azure portal
3. Check browser console for MSAL errors

## 💡 Tips

- Always load `app-init.js` last
- Use `notify` for user feedback
- Cart state persists across pages
- Check `archive/` for old code reference
- See README.md for full documentation

## 📞 Contact
- **Email:** info@allshopwholesale.com
- **Phone:** 0050946820

---
**Last Updated:** January 18, 2026
