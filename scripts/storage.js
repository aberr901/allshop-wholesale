// Azure Blob Storage Helper Functions
class StorageService {
    constructor() {
        this.productsFileName = 'products.json';
        this.brandsFileName = 'brands.json';
        this.categoriesFileName = 'categories.json';
    }

    /**
     * Fetch all categories from Azure Blob Storage
     */
    async fetchCategories() {
        try {
            const url = AZURE_CONFIG.getBlobUrl(AZURE_CONFIG.dataContainerName, this.categoriesFileName);
            const response = await fetch(url);
            
            if (!response.ok) {
                if (response.status === 404) {
                    console.log('Categories file not found, returning default categories');
                    return this.getDefaultCategories();
                }
                throw new Error('Failed to fetch categories: ' + response.statusText);
            }
            
            const categories = await response.json();
            return categories.length > 0 ? categories : this.getDefaultCategories();
        } catch (error) {
            console.error('Error fetching categories:', error);
            const cached = localStorage.getItem('categories');
            return cached ? JSON.parse(cached) : this.getDefaultCategories();
        }
    }

    /**
     * Save categories to Azure Blob Storage
     */
    async saveCategories(categories, accessToken = null) {
        try {
            localStorage.setItem('categories', JSON.stringify(categories));
            
            const url = AZURE_CONFIG.getBlobUrl(AZURE_CONFIG.dataContainerName, this.categoriesFileName, true);
            
            const headers = {
                'Content-Type': 'application/json',
                'x-ms-blob-type': 'BlockBlob',
                'x-ms-version': '2021-08-06'
            };
            
            if (accessToken) {
                headers['Authorization'] = 'Bearer ' + accessToken;
            }
            
            const response = await fetch(url, {
                method: 'PUT',
                headers: headers,
                body: JSON.stringify(categories)
            });
            
            if (!response.ok) {
                throw new Error('Failed to save categories: ' + response.statusText);
            }
            
            return true;
        } catch (error) {
            console.error('Error saving categories:', error);
            throw error;
        }
    }

    /**
     * Get default categories
     */
    getDefaultCategories() {
        return [
            { id: 'cat_1', name: 'Electronics' },
            { id: 'cat_2', name: 'Clothing' },
            { id: 'cat_3', name: 'Home & Kitchen' },
            { id: 'cat_4', name: 'Sports & Outdoors' },
            { id: 'cat_5', name: 'Toys & Games' }
        ];
    }

    /**
     * Fetch all brands from Azure Blob Storage
     */
    async fetchBrands() {
        try {
            const url = AZURE_CONFIG.getBlobUrl(AZURE_CONFIG.dataContainerName, this.brandsFileName);
            const response = await fetch(url);
            
            if (!response.ok) {
                if (response.status === 404) {
                    console.log('Brands file not found, returning empty array');
                    return [];
                }
                throw new Error(`Failed to fetch brands: ${response.statusText}`);
            }
            
            const brands = await response.json();
            return brands;
        } catch (error) {
            console.error('Error fetching brands:', error);
            const cached = localStorage.getItem('brands');
            return cached ? JSON.parse(cached) : [];
        }
    }

    /**
     * Save brands to Azure Blob Storage
     */
    async saveBrands(brands, accessToken = null) {
        try {
            localStorage.setItem('brands', JSON.stringify(brands));
            
            const url = AZURE_CONFIG.getBlobUrl(AZURE_CONFIG.dataContainerName, this.brandsFileName, true);
            
            const headers = {
                'Content-Type': 'application/json',
                'x-ms-blob-type': 'BlockBlob',
                'x-ms-version': '2021-08-06'
            };
            
            if (accessToken) {
                headers['Authorization'] = `Bearer ${accessToken}`;
            }
            
            const response = await fetch(url, {
                method: 'PUT',
                headers: headers,
                body: JSON.stringify(brands)
            });
            
            if (!response.ok) {
                throw new Error(`Failed to save brands: ${response.statusText}`);
            }
            
            return true;
        } catch (error) {
            console.error('Error saving brands:', error);
            throw error;
        }
    }

    /**
     * Fetch all products from Azure Blob Storage
     */
    async fetchProducts() {
        console.log('[Storage] Fetching products...');
        try {
            const url = AZURE_CONFIG.getBlobUrl(AZURE_CONFIG.dataContainerName, this.productsFileName);
            console.log('[Storage] Products URL:', url);
            const response = await fetch(url);
            console.log('[Storage] Products response status:', response.status);
            
            if (!response.ok) {
                // If file doesn't exist, return empty array
                if (response.status === 404) {
                    console.log('[Storage] Products file not found, returning empty array');
                    return [];
                }
                console.error('[Storage] Failed to fetch products:', response.statusText);
                throw new Error(`Failed to fetch products: ${response.statusText}`);
            }
            
            const products = await response.json();
            console.log('[Storage] Products fetched successfully:', products.length, 'items');
            return products;
        } catch (error) {
            console.error('[Storage] Error fetching products:', error);
            // Return cached products if available
            const cached = localStorage.getItem(STORAGE_KEYS.products);
            if (cached) {
                console.log('[Storage] Using cached products');
            }
            return cached ? JSON.parse(cached) : [];
        }
    }

    /**
     * Save products to Azure Blob Storage
     * Requires user to be authenticated via Entra ID with Storage Blob Data Contributor role
     */
    async saveProducts(products, accessToken = null) {
        try {
            // Cache locally
            localStorage.setItem(STORAGE_KEYS.products, JSON.stringify(products));
            
            const url = AZURE_CONFIG.getBlobUrl(AZURE_CONFIG.dataContainerName, this.productsFileName, true);
            
            const headers = {
                'Content-Type': 'application/json',
                'x-ms-blob-type': 'BlockBlob',
                'x-ms-version': '2021-08-06'
            };
            
            // Add bearer token from Entra ID authentication
            if (accessToken) {
                headers['Authorization'] = `Bearer ${accessToken}`;
            }
            
            const response = await fetch(url, {
                method: 'PUT',
                headers: headers,
                body: JSON.stringify(products)
            });
            
            if (!response.ok) {
                throw new Error(`Failed to save products: ${response.statusText}`);
            }
            
            return true;
        } catch (error) {
            console.error('Error saving products:', error);
            throw error;
        }
    }

    /**
     * Upload image to Azure Blob Storage
     */
    async uploadImage(file, accessToken = null) {
        try {
            const fileName = `${Date.now()}_${file.name}`;
            const url = AZURE_CONFIG.getBlobUrl(AZURE_CONFIG.imagesContainerName, fileName, true);
            
            const headers = {
                'Content-Type': file.type,
                'x-ms-blob-type': 'BlockBlob',
                'x-ms-version': '2021-08-06'
            };
            
            // Add bearer token from Entra ID authentication
            if (accessToken) {
                headers['Authorization'] = `Bearer ${accessToken}`;
            }
            
            const response = await fetch(url, {
                method: 'PUT',
                headers: headers,
                body: file
            });
            
            if (!response.ok) {
                throw new Error(`Failed to upload image: ${response.statusText}`);
            }
            
            // Return the URL without SAS token for storage
            return `${AZURE_CONFIG.storageUrl}/${AZURE_CONFIG.imagesContainerName}/${fileName}`;
        } catch (error) {
            console.error('Error uploading image:', error);
            throw error;
        }
    }

    /**
     * Get image URL with SAS token
     */
    getImageUrl(imageUrl) {
        if (!imageUrl) {
            return 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22300%22 height=%22300%22%3E%3Crect fill=%22%23ddd%22 width=%22300%22 height=%22300%22/%3E%3Ctext fill=%22%23666%22 font-family=%22Arial%22 font-size=%2220%22 x=%2250%25%22 y=%2250%25%22 text-anchor=%22middle%22 dominant-baseline=%22middle%22%3ENo Image%3C/text%3E%3C/svg%3E';
        }
        
        // If it's already a full URL with our storage account, add SAS token if needed
        if (imageUrl.includes(AZURE_CONFIG.storageAccountName) && AZURE_CONFIG.sasToken) {
            return `${imageUrl}?${AZURE_CONFIG.sasToken}`;
        }
        
        return imageUrl;
    }

    /**
     * Delete image from Azure Blob Storage
     */
    async deleteImage(imageUrl) {
        try {
            if (!imageUrl || !imageUrl.includes(AZURE_CONFIG.storageAccountName)) {
                return;
            }
            
            // Extract blob name from URL
            const urlParts = imageUrl.split('/');
            const blobName = urlParts[urlParts.length - 1];
            
            const url = AZURE_CONFIG.getBlobUrl(AZURE_CONFIG.imagesContainerName, blobName, true);
            
            const headers = {
                'x-ms-version': '2021-08-06'
            };
            
            // Add bearer token if provided (from Entra ID)
            if (this.currentAccessToken) {
                headers['Authorization'] = `Bearer ${this.currentAccessToken}`;
            }
            
            const response = await fetch(url, {
                method: 'DELETE',
                headers: headers
            });
            
            if (!response.ok && response.status !== 404) {
                throw new Error(`Failed to delete image: ${response.statusText}`);
            }
        } catch (error) {
            console.error('Error deleting image:', error);
        }
    }

    /**
     * Generate a unique product ID
     */
    generateId() {
        return `prod_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }
    
    /**
     * Set the access token for authenticated operations
     */
    setAccessToken(token) {
        this.currentAccessToken = token;
    }
}

// Create a singleton instance
const storageService = new StorageService();
