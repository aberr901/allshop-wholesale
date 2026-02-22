# Developer Overview – All Shop Wholesale

A concise guide for developers who want to reproduce, extend, or contribute to the All Shop Wholesale platform.

---

## Philosophy

All Shop Wholesale is deliberately **framework-free**. Every feature is implemented with plain HTML5, CSS3, and ES6+ JavaScript so the project has:

- **Zero build tooling** – no bundler, no transpiler, no `npm install` required to run the site.
- **Zero runtime framework** – no React, Vue, or Angular.  Components are small self-registering vanilla JS files.
- **Static hosting first** – the entire storefront is a collection of static files served from Azure Static Web Apps.  The only "backend" is Azure Blob Storage (JSON files + images).
- **Progressive enhancement** – pages are meaningful HTML even before JS runs; scripts add interactivity on top.

This keeps deployment simple, hosting costs low, and the codebase accessible to any web developer regardless of framework experience.

---

## Repository Layout

```
allshop-wholesale/
├── index.html              # Homepage / department landing
├── home-kitchen.html       # Home & Kitchen department
├── pet-supplies.html       # Pet Supplies department
├── about.html
├── contact.html
├── admin.html              # Password-protected admin panel
├── staticwebapp.config.json
├── categories.json         # Static fallback category list
│
├── components/             # Self-initialising UI components
│   ├── header.js
│   ├── footer.js
│   └── modals.js
│
├── scripts/                # Application modules
│   ├── config.js           # Azure & MSAL configuration
│   ├── storage.js          # Data-access layer (StorageService)
│   ├── app-init.js         # Central initialisation orchestrator
│   ├── cart.js             # Shopping-cart state
│   ├── auth.js             # Entra ID / MSAL authentication
│   ├── notifications.js    # Toast notification system
│   ├── privacy-banner.js   # GDPR consent banner
│   ├── products-enhanced.js# Product catalogue with virtual scrolling
│   ├── virtual-scroller.js # VirtualProductScroller utility
│   ├── admin.js            # AdminManager – product CRUD
│   ├── brand-manager.js    # BrandManager – brand CRUD
│   └── category-manager.js # CategoryManager – category CRUD
│
├── styles/
│   ├── main.css
│   ├── animations.css
│   └── admin.css
│
├── Documentation/          # Developer & deployment docs
└── archive/                # Legacy files and old documentation
```

---

## Technical Stack

| Concern | Technology |
|---|---|
| Frontend | Vanilla JavaScript (ES6+), HTML5, CSS3 |
| Hosting | Azure Static Web Apps |
| Data storage | Azure Blob Storage (JSON files) |
| Image storage | Azure Blob Storage |
| Admin auth | Microsoft Entra ID (Azure AD) via MSAL.js |
| Client-side state | Browser `localStorage` |
| Local dev server | `server.js` (Node.js, optional) |

---

## Initialisation Flow

Every page loads the same set of core scripts in this order:

```html
<script src="scripts/config.js"></script>
<script src="scripts/storage.js"></script>
<script src="scripts/notifications.js"></script>
<script src="scripts/privacy-banner.js"></script>
<script src="scripts/cart.js"></script>

<script src="components/header.js"></script>
<script src="components/footer.js"></script>
<script src="components/modals.js"></script>

<script src="scripts/app-init.js"></script>   <!-- must be last -->
```

`app-init.js` is the single orchestrator.  It:

1. Waits for the DOM to be ready.
2. Initialises `window.cart` and `window.notify` as global singletons.
3. Detects which page is loaded and calls the appropriate setup (e.g. `initProductsWithBrands()` on department pages, `AdminManager.init()` on `admin.html`).
4. Makes all components optional/pluggable – if a component script is absent the page still works.

---

## How Products Are Stored

There is no traditional database.  Product data lives in **three JSON blobs** inside an Azure Blob Storage container (`product-data`):

| File | Purpose |
|---|---|
| `products.json` | Array of all product objects |
| `brands.json` | Array of brand objects |
| `categories.json` | Array of category objects |

Product images are stored in a separate container (`product-images`).

### Data Schemas

**Product**
```json
{
  "id": "prod_1700000000000_abc123",
  "name": "Product Name",
  "price": 29.99,
  "brand": "Brand Name",
  "categoryId": "cat_001",
  "imageUrl": "https://onlinestore5521.blob.core.windows.net/product-images/...",
  "description": "Short description",
  "quantity": 100
}
```

**Brand**
```json
{
  "id": "brand_123",
  "name": "Brand Name",
  "logoUrl": "https://...",
  "departments": ["home-kitchen", "pet-supplies"]
}
```

**Category**
```json
{
  "id": "cat_001",
  "name": "Small Appliances",
  "description": "Kitchen gadgets",
  "department": "home-kitchen"
}
```

### Access Control

| Operation | Mechanism |
|---|---|
| Public read (storefront) | Read-only SAS token embedded in `config.js` |
| Admin write (save/delete) | Entra ID Bearer token obtained via MSAL |

Write requests add `Authorization: Bearer <token>` and omit the SAS token.  The admin user must have the **Storage Blob Data Contributor** role on the storage account.

---

## How Products Are Loaded

Loading is handled by the `StorageService` class in `scripts/storage.js`.

```
storageService.fetchProducts()
    │
    ├─ Hit localStorage cache?  ──Yes──▶  Return cached data (TTL: 1 hour)
    │
    └─ No ──▶ GET products.json (with SAS token)
                │
                ├─ 200 OK  ──▶  Parse JSON, cache, return array
                ├─ 404     ──▶  Return [] (file not yet created)
                └─ Error   ──▶  Return stale cache or []
```

The same pattern applies to `fetchBrands()` and `fetchCategories()`.

Cache keys stored in `localStorage`:

| Key | Content |
|---|---|
| `products_cache` | `{ data: [...], timestamp: ms, ttl: 3600000 }` |
| `brands_cache` | same shape |
| `categories_cache` | same shape |

After any admin save operation, the relevant cache key is deleted so the next page load fetches fresh data.

### Product Display Pipeline

```
initProductsWithBrands(department)   [products-enhanced.js]
    │
    ├─ storageService.fetchProducts()
    ├─ storageService.fetchBrands()
    ├─ storageService.fetchCategories()
    │
    ├─ Filter products by department (URL parameter)
    │
    ├─ displayBrands()      – brand logo strip
    ├─ displayProducts()    – product cards
    │   └─ VirtualProductScroller (kicks in for 30+ products)
    │
    └─ populateFilters() + setupFiltering()  – sidebar filters
```

---

## How Admin Users Manage Products

### Accessing the Admin Panel

`/admin.html` requires the `authenticated` role enforced by `staticwebapp.config.json`.  Unauthenticated requests are redirected to the Entra ID login page.

### Authentication Flow

```
User opens admin.html
    │
    └─ AuthService.initialize()   [auth.js / MSAL]
            │
            ├─ Already signed in?  ──Yes──▶  Show admin UI
            │
            └─ No ──▶ signInRedirect() ──▶ Microsoft login
                        │
                        └─ Callback ──▶ getStorageAccessToken()
                                            │
                                            └─ Bearer token stored in memory
                                               (used for all write operations)
```

### Product CRUD

All product management is handled by `AdminManager` (`scripts/admin.js`).

| Action | What happens |
|---|---|
| **Load** | `storageService.fetchProducts()` populates the editable table |
| **Add** | Form submission → generate ID → append to array → `storageService.saveProducts(array, token)` |
| **Edit** | Click Edit → populate form with existing product → `currentEditingId` tracks which record → save replaces the matching item in the array |
| **Delete** | Remove item from array → `storageService.saveProducts(updatedArray, token)` |

`saveProducts()` PUTs the entire `products.json` blob to Azure with the Bearer token, then clears the local cache.

### Brand & Category Management

`BrandManager` (`scripts/brand-manager.js`) and `CategoryManager` (`scripts/category-manager.js`) follow the same CRUD pattern using `saveBrands()` and `saveCategories()` respectively.

The admin panel has three tabs – **Products**, **Brands**, **Categories** – each backed by its own manager class.

---

## Local Development

```bash
# Clone the repo
git clone https://github.com/aberr901/allshop-wholesale.git
cd allshop-wholesale

# Option A – Python (no install)
python -m http.server 8000

# Option B – Node.js built-in server
node server.js

# Option C – any static server
npx http-server -p 8000
```

Then open `http://localhost:8000`.

For admin features you need a real Entra ID app registration.  See `archive/SETUP-ENTRA-ID.md` for step-by-step setup, and update `scripts/config.js` with your `clientId` and `authority`.

---

## Configuration (`scripts/config.js`)

```javascript
const AZURE_CONFIG = {
    storageAccountName: 'onlinestore5521',
    dataContainerName:  'product-data',
    imagesContainerName:'product-images',
    readOnlySasToken:   '<SAS token with Read + List permissions>'
};

const MSAL_CONFIG = {
    auth: {
        clientId:    '<App Registration client ID>',
        authority:   'https://login.microsoftonline.com/<tenant-id>',
        redirectUri: 'https://yourdomain.com/admin.html'
    }
};
```

To reproduce the project with your own Azure resources:

1. Create a Storage Account and two containers: `product-data` (private) and `product-images` (private).
2. Generate a SAS token with **Read** and **List** permissions for `product-data`.
3. Register an Entra ID application, add a redirect URI for `/admin.html`.
4. Assign the **Storage Blob Data Contributor** role to the registered app on the storage account.
5. Update `config.js` with the values above.
6. Deploy to Azure Static Web Apps (or serve locally for development).

---

## Key Design Decisions

| Decision | Rationale |
|---|---|
| No framework | Zero dependencies, trivial deployment, long-lived codebase |
| JSON blobs as database | No server required; reads are fast via CDN-cached Blob Storage |
| One-hour client cache | Reduces Storage reads without sacrificing freshness |
| MSAL + Entra ID for admin | Leverages Microsoft's hardened OAuth stack; no custom auth server |
| Read-only SAS for public | Limits blast radius of an exposed token |
| Virtual scroller | Keeps the DOM lean even with hundreds of products |
| GDPR-first localStorage | All writes gated behind consent; data cleared on opt-out |

---

## Further Reading

- [`README.md`](../README.md) – Project overview, features, and setup
- [`Documentation/QUICK-REFERENCE.md`](QUICK-REFERENCE.md) – Common tasks and code snippets
- [`Documentation/DEPLOYMENT-CHECKLIST.md`](DEPLOYMENT-CHECKLIST.md) – Step-by-step Azure deployment
- [`Documentation/REFACTORING-COMPLETE.md`](REFACTORING-COMPLETE.md) – January 2026 refactor write-up
- [`archive/SETUP-ENTRA-ID.md`](../archive/SETUP-ENTRA-ID.md) – Detailed Entra ID configuration
- [`archive/LOCALSTORAGE-GDPR-ANALYSIS.md`](../archive/LOCALSTORAGE-GDPR-ANALYSIS.md) – GDPR compliance details
