// Azure Storage Configuration
const AZURE_CONFIG = {
    // Your Azure Storage account name
    storageAccountName: 'onlinestore5521',
    
    // Container name for product data (JSON files)
    dataContainerName: 'product-data',
    
    // Container name for product images
    imagesContainerName: 'product-images',
    
    // Read-only SAS token for public storefront
    // Generate with: Read + List permissions only
    readOnlySasToken: 'se=2027-01-12T15%3A03%3A35Z&sp=rl&spr=https&sv=2022-11-02&ss=b&srt=sco&sig=l5YFGgkhj3YCycju0rHpnvHfAB2Zd8y5tCqRCwFggh0%3D',
    
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
        clientId: '5ad34e8e-91ea-4264-bfdb-0f71d1fb5258', // From App Registration
        authority: 'https://login.microsoftonline.com/7155ba15-8532-4d67-8c0b-dce23ad3c48f',
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
