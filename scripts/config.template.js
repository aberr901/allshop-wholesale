// Azure Storage Configuration
const AZURE_CONFIG = {
    // Your Azure Storage account name
    storageAccountName: 'YOUR_STORAGE_ACCOUNT_NAME',
    
    // Container name for product data (JSON files)
    dataContainerName: 'product-data',
    
    // Container name for product images
    imagesContainerName: 'product-images',
    
    // Read-only SAS token for public storefront
    // Generate with: Read + List permissions only
    readOnlySasToken: 'YOUR_READ_ONLY_SAS_TOKEN',
    
    // Base URL for blob storage
    get storageUrl() {
        return `https://${this.storageAccountName}.blob.core.windows.net`;
    },
    
    // Get full container URL with SAS
    getContainerUrl(containerName) {
        return `${this.storageUrl}/${containerName}${this.sasToken ? '?' + this.sasToken : ''}`;
    },
    
    // Get blob URL (without SAS for write operations)
    getBlobUrl(containerName, blobName, useAuth = false) {
        const baseUrl = `${this.storageUrl}/${containerName}/${blobName}`;
        // For authenticated admin operations, return URL without SAS (will use Bearer token)
        // For public read operations, return URL with read-only SAS
        return useAuth ? baseUrl : `${baseUrl}?${this.readOnlySasToken}`;
    }
};

// MSAL Configuration for Entra ID authentication
const MSAL_CONFIG = {
    auth: {
        clientId: 'YOUR_ENTRA_ID_CLIENT_ID', // From App Registration
        authority: 'https://login.microsoftonline.com/YOUR_TENANT_ID',
        redirectUri: window.location.origin + '/admin.html'
    },
    cache: {
        cacheLocation: 'sessionStorage',
        storeAuthStateInCookie: false
    }
};

// Azure Storage scope for token request
const STORAGE_SCOPE = {
    scopes: ['https://storage.azure.com/user_impersonation']
};

// For Static Web Apps, you can use the API proxy instead
// Uncomment and use this approach for production with Azure Static Web Apps
/*
const API_CONFIG = {
    baseUrl: '/api',
    endpoints: {
        products: '/products',
        product: (id) => `/products/${id}`,
        upload: '/upload',
        categories: '/categories',
        brands: '/brands'
    }
};
*/

// Local storage keys
const STORAGE_KEYS = {
    cart: 'shopping_cart',
    products: 'products_cache'
};
