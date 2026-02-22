# Developer Overview

A quick-start guide for developers who want to understand, reproduce, or extend the AllShop Wholesale site.

---

## Philosophy

The project is guided by a small set of principles that keep the codebase approachable and easy to maintain:

- **Simplicity** – No build tools, bundlers, or frameworks. The site is plain HTML, CSS, and vanilla JavaScript, so any developer can open a file and immediately understand what is happening.
- **Separation of concerns** – Markup lives in HTML files, presentation lives in `styles/`, and behaviour lives in `scripts/` and `components/`. Each layer can be changed independently.
- **Component reuse** – Shared UI (header, footer, modals) is defined once in `components/` and injected into every page via placeholder `<div>` elements. Updating a component updates all pages instantly.
- **Progressive enhancement** – Pages render meaningful content even before JavaScript runs. Scripts add interactivity on top rather than replacing server-rendered content.
- **Minimal dependencies** – The only external library is MSAL (Microsoft Authentication Library) for the admin panel. Everything else is written from scratch so there is nothing to install or update.
- **Maintainability** – Consistent naming, a clean directory layout, and centralised initialisation (`app-init.js`) mean a new developer can find any feature quickly.

---

## Technical Overview

### Project structure

```
allshop-wholesale/
├── components/               # Reusable UI components (JS-rendered)
│   ├── header.js             # Navigation header, adapts per page
│   ├── footer.js             # Site-wide footer
│   ├── modals.js             # Login and cart modals
│   └── head-meta.js          # Shared <head> meta helpers
├── scripts/                  # Core JavaScript modules
│   ├── app-init.js           # Bootstraps all components and features
│   ├── cart.js               # Shopping cart logic (exposed as window.cart)
│   ├── auth.js               # MSAL-based authentication (admin only)
│   ├── config.js             # API URLs, feature flags, Entra ID settings
│   ├── config.template.js    # Safe-to-commit config template
│   ├── notifications.js      # Toast notification helper (window.notify)
│   ├── privacy-banner.js     # GDPR consent banner
│   ├── storage.js            # GDPR-aware LocalStorage wrapper
│   ├── products-enhanced.js  # Product catalogue with virtual scrolling
│   ├── virtual-scroller.js   # Standalone virtual scroll utility
│   ├── admin.js              # Admin panel logic
│   ├── brand-manager.js      # Brand CRUD
│   └── category-manager.js   # Category CRUD
├── styles/
│   ├── main.css              # Global styles and design tokens
│   ├── animations.css        # Transition and animation helpers
│   └── admin.css             # Admin-panel-specific styles
├── Documentation/            # Developer docs (you are here)
│   ├── DEVELOPER-OVERVIEW.md # This file
│   ├── REFACTORING-COMPLETE.md
│   ├── QUICK-REFERENCE.md
│   ├── DEPLOYMENT-CHECKLIST.md
│   └── BEFORE-AFTER-COMPARISON.md
├── archive/                  # Old backups kept for reference, not active
├── index.html                # Homepage – department selector
├── home-kitchen.html         # Home & Kitchen product catalogue
├── pet-supplies.html         # Pet Supplies product catalogue
├── about.html                # Company information
├── contact.html              # Contact form
├── admin.html                # Admin panel (requires Entra ID login)
├── categories.json           # Product category data
├── staticwebapp.config.json  # Azure Static Web Apps routing config
├── server.js                 # Optional local Node dev server
└── README.md                 # Full project documentation
```

### How HTML, CSS, and JS are organised

Every HTML page is self-contained: it links its own stylesheets and loads scripts at the bottom of `<body>`. There is no bundler or template engine.

**Stylesheets** are loaded in `<head>`:
```html
<link rel="stylesheet" href="styles/main.css">
<link rel="stylesheet" href="styles/animations.css">
```

**Scripts** follow a fixed loading order at the end of `<body>`:
```html
<!-- 1. Core utilities (no DOM dependency) -->
<script src="scripts/config.js"></script>
<script src="scripts/storage.js"></script>
<script src="scripts/notifications.js"></script>
<script src="scripts/privacy-banner.js"></script>
<script src="scripts/cart.js"></script>

<!-- 2. Components (depend on core utilities) -->
<script src="components/header.js"></script>
<script src="components/footer.js"></script>
<script src="components/modals.js"></script>

<!-- 3. Bootstrap (must be last) -->
<script src="scripts/app-init.js"></script>
```

`app-init.js` fires after all other scripts have loaded and ensures every component and feature is properly initialised before the user can interact with the page.

### How components are composed

Each page places lightweight placeholder `<div>` elements where shared UI should appear:

```html
<div id="headerPlaceholder" data-current-page="home-kitchen"
     data-show-categories="true" data-show-brands="true"></div>

<div id="footerPlaceholder"></div>
<div id="modalsPlaceholder"></div>
```

When the corresponding component script loads it reads those placeholders, generates the full HTML, and inserts it into the DOM. The `data-*` attributes on `headerPlaceholder` let each page configure the header without forking the component.

### Build and deploy

There is **no build step**. The site is 100% static: serve any directory listing tool and the site works.

The project ships with `staticwebapp.config.json` for deployment to **Azure Static Web Apps**. Route rewrites and response-header rules are declared there.

### Running locally

```bash
# Option 1 – Python (built-in, no install needed)
python -m http.server 8000

# Option 2 – Node.js http-server
npx http-server -p 8000

# Option 3 – project's own Node server
node server.js

# Then open
http://localhost:8000
```

> **Config note:** Copy `scripts/config.template.js` to `scripts/config.js` and fill in your values before serving. The template documents every setting.

### Where to make changes

| What you want to change | Where to look |
|---|---|
| Site-wide header or navigation | `components/header.js` |
| Site-wide footer | `components/footer.js` |
| Login / cart modals | `components/modals.js` |
| Global colours, fonts, layout | `styles/main.css` |
| Animations and transitions | `styles/animations.css` |
| Shopping cart behaviour | `scripts/cart.js` |
| Product catalogue and filtering | `scripts/products-enhanced.js` |
| API URLs and feature flags | `scripts/config.js` |
| GDPR / privacy consent logic | `scripts/storage.js`, `scripts/privacy-banner.js` |
| Admin panel | `admin.html` + `scripts/admin.js` |
| Page content (copy, images) | The relevant `*.html` file |
| Azure routing rules | `staticwebapp.config.json` |

---

## Further reading

- [`README.md`](../README.md) – Full project documentation including setup and troubleshooting.
- [`Documentation/REFACTORING-COMPLETE.md`](REFACTORING-COMPLETE.md) – Detailed write-up of the component-based refactor completed in January 2026.
- [`Documentation/QUICK-REFERENCE.md`](QUICK-REFERENCE.md) – Cheat-sheet for common tasks and code snippets.
- [`Documentation/DEPLOYMENT-CHECKLIST.md`](DEPLOYMENT-CHECKLIST.md) – Steps to deploy to Azure Static Web Apps.
