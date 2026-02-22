# AllShop Wholesale — Developer Overview

**Philosophy**
- Simplicity and transparency in admin product workflows via a clean web UI (see `admin.html`).
- Maintainable: product data modularized, editable through forms, not code changes.
- Cloud-first: Products & images stored in cloud (Azure Blob); no server dependency.
- Secure: Admin operations require Microsoft account sign-in & valid access token.

**Technical Overview**
- **Product Loading:**
  - Loaded from cloud storage via JS (`storageService.fetchProducts()` in both user and admin pages).
- **Product Storing:**
  - Saved as an array of product objects (JSON format) in remote storage. Admin can upload or specify an image URL.
- **Admin Management:**
  - Sign in (Microsoft auth). Use form (name, category, brand, price, stock, description, image).
  - On save: Add/modify in array, trigger cloud save. On delete: remove in array & cloud. Uploaded images are cleaned up if replaced/deleted.
- **Where to change or extend:**
  - Admin workflow/UI: <a href="https://github.com/aberr901/allshop-wholesale/blob/main/admin.html">admin.html</a>, <a href="https://github.com/aberr901/allshop-wholesale/blob/main/scripts/admin.js">scripts/admin.js</a>
  - Frontend product display: <a href="https://github.com/aberr901/allshop-wholesale/blob/main/scripts/products.js">scripts/products.js</a>
- **Run locally:**
  - Serve with any static HTTP server. Admin panel requires authentication and working Azure storage config.
- **See Also:**
  - <a href="https://github.com/aberr901/allshop-wholesale/blob/main/Documentation/REFACTORING-COMPLETE.md">REFACTORING-COMPLETE.md</a>
