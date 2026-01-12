// Brand Management for Admin Panel
class BrandManager {
    constructor(authService) {
        this.brands = [];
        this.currentEditingBrandId = null;
        this.authService = authService;
    }

    async loadBrands() {
        try {
            this.brands = await storageService.fetchBrands();
            this.populateBrandSelect();
            this.displayBrandsGrid();
        } catch (error) {
            console.error('Error loading brands:', error);
            this.brands = [];
        }
    }

    populateBrandSelect() {
        const brandSelect = document.getElementById('productBrand');
        if (!brandSelect) return;

        brandSelect.innerHTML = '<option value="">Select Brand</option>';
        this.brands.forEach(brand => {
            const option = document.createElement('option');
            option.value = brand.name;
            option.textContent = brand.name;
            brandSelect.appendChild(option);
        });
    }

    displayBrandsGrid() {
        const grid = document.getElementById('brandsGridAdmin');
        if (!grid) return;

        if (this.brands.length === 0) {
            grid.innerHTML = '<p style="text-align:center;color:#666;padding:2rem;">No brands yet. Add your first brand above!</p>';
            return;
        }

        grid.innerHTML = this.brands.map(brand => {
            let logoUrl = '';
            if (brand.logoUrl) {
                // Check if external URL or blob storage URL
                if (brand.logoUrl.startsWith('http://') || brand.logoUrl.startsWith('https://')) {
                    if (brand.logoUrl.includes('blob.core.windows.net')) {
                        // Azure blob - append SAS token (check if already has query params)
                        logoUrl = brand.logoUrl.includes('?') ? 
                            brand.logoUrl + '&' + AZURE_CONFIG.readOnlySasToken :
                            brand.logoUrl + '?' + AZURE_CONFIG.readOnlySasToken;
                    } else {
                        logoUrl = brand.logoUrl;
                    }
                } else {
                    logoUrl = brand.logoUrl + '?' + AZURE_CONFIG.readOnlySasToken;
                }
            } else {
                logoUrl = 'https://via.placeholder.com/80?text=' + encodeURIComponent(brand.name);
            }
            
            return '<div class="brand-card-admin">' +
                '<img src="' + logoUrl + '" alt="' + brand.name + '" onerror="this.src=\'https://via.placeholder.com/80?text=' + encodeURIComponent(brand.name) + '\'">' +
                '<h3>' + brand.name + '</h3>' +
                '<div class="action-buttons">' +
                '<button class="btn-edit" onclick="brandManager.editBrand(\'' + brand.id + '\')" title="Edit brand">Edit</button>' +
                '<button class="btn-delete" onclick="brandManager.deleteBrand(\'' + brand.id + '\')" title="Delete brand">Delete</button>' +
                '</div>' +
                '</div>';
        }).join('');
    }

    setupBrandEventListeners() {
        const brandForm = document.getElementById('brandForm');
        const cancelBtn = document.getElementById('cancelBrandBtn');
        const logoInput = document.getElementById('brandLogo');
        const logoUrlInput = document.getElementById('brandLogoUrl');
        
        // Logo type toggle
        const logoTypeRadios = document.querySelectorAll('input[name="logoType"]');
        logoTypeRadios.forEach(radio => {
            radio.addEventListener('change', (e) => {
                const uploadSection = document.getElementById('uploadLogoSection');
                const urlSection = document.getElementById('urlLogoSection');
                if (e.target.value === 'upload') {
                    uploadSection.style.display = 'block';
                    urlSection.style.display = 'none';
                } else {
                    uploadSection.style.display = 'none';
                    urlSection.style.display = 'block';
                }
            });
        });

        if (brandForm) {
            brandForm.addEventListener('submit', (e) => this.handleBrandSubmit(e));
        }

        if (cancelBtn) {
            cancelBtn.addEventListener('click', () => this.resetBrandForm());
        }

        if (logoInput) {
            logoInput.addEventListener('change', (e) => this.previewBrandLogo(e));
        }
        
        if (logoUrlInput) {
            logoUrlInput.addEventListener('input', (e) => this.previewBrandLogoUrl(e));
        }
    }

    async handleBrandSubmit(e) {
        e.preventDefault();

        const brandName = document.getElementById('brandName').value;
        const logoType = document.querySelector('input[name="logoType"]:checked').value;
        const logoFile = document.getElementById('brandLogo').files[0];
        const logoUrl = document.getElementById('brandLogoUrl').value;

        try {
            let finalLogoUrl = null;

            if (logoType === 'url' && logoUrl) {
                // Using external URL - just save the URL
                // Delete old logo if it was an uploaded file
                if (this.currentEditingBrandId) {
                    const existingBrand = this.brands.find(b => b.id === this.currentEditingBrandId);
                    if (existingBrand?.logoUrl && this.isAzureBlobUrl(existingBrand.logoUrl)) {
                        await storageService.deleteImage(existingBrand.logoUrl);
                    }
                }
                finalLogoUrl = logoUrl;
            } else if (logoType === 'upload' && logoFile) {
                // Uploading new file - delete old uploaded file if exists
                if (this.currentEditingBrandId) {
                    const existingBrand = this.brands.find(b => b.id === this.currentEditingBrandId);
                    if (existingBrand?.logoUrl && this.isAzureBlobUrl(existingBrand.logoUrl)) {
                        await storageService.deleteImage(existingBrand.logoUrl);
                    }
                }
                const token = await this.authService.getStorageAccessToken();
                finalLogoUrl = await storageService.uploadImage(logoFile, token);
            } else if (this.currentEditingBrandId) {
                // Keep existing logo URL
                const existingBrand = this.brands.find(b => b.id === this.currentEditingBrandId);
                finalLogoUrl = existingBrand ? existingBrand.logoUrl : null;
            }

            const brandData = {
                id: this.currentEditingBrandId || this.generateBrandId(),
                name: brandName,
                logoUrl: finalLogoUrl
            };

            // Update or add brand
            if (this.currentEditingBrandId) {
                const index = this.brands.findIndex(b => b.id === this.currentEditingBrandId);
                if (index !== -1) {
                    this.brands[index] = brandData;
                }
            } else {
                this.brands.push(brandData);
            }

            // Save to Azure
            const token = await this.authService.getStorageAccessToken();
            await storageService.saveBrands(this.brands, token);

            this.showNotification(
                this.currentEditingBrandId ? 'Brand updated successfully!' : 'Brand added successfully!',
                'success'
            );

            this.resetBrandForm();
            await this.loadBrands();

        } catch (error) {
            console.error('Error saving brand:', error);
            this.showNotification('Failed to save brand. Please try again.', 'error');
        }
    }

    editBrand(brandId) {
        const brand = this.brands.find(b => b.id === brandId);
        if (!brand) return;

        this.currentEditingBrandId = brandId;
        document.getElementById('brandName').value = brand.name;
        document.getElementById('brandFormTitle').textContent = 'Edit Brand';

        // Show current logo
        if (brand.logoUrl) {
            // Determine if URL or uploaded file
            if (this.isAzureBlobUrl(brand.logoUrl)) {
                document.querySelector('input[name="logoType"][value="upload"]').checked = true;
            } else {
                document.querySelector('input[name="logoType"][value="url"]').checked = true;
                document.getElementById('brandLogoUrl').value = brand.logoUrl;
                document.getElementById('uploadLogoSection').style.display = 'none';
                document.getElementById('urlLogoSection').style.display = 'block';
            }
            
            const preview = document.getElementById('brandLogoPreview');
            let logoUrl = '';
            // Check if external URL or blob storage URL
            if (brand.logoUrl.startsWith('http://') || brand.logoUrl.startsWith('https://')) {
                if (brand.logoUrl.includes('blob.core.windows.net')) {
                    logoUrl = brand.logoUrl + '?' + AZURE_CONFIG.readOnlySasToken;
                } else {
                    logoUrl = brand.logoUrl;
                }
            } else {
                logoUrl = brand.logoUrl + '?' + AZURE_CONFIG.readOnlySasToken;
            }
            preview.innerHTML = '<img src="' + logoUrl + '" alt="' + brand.name + '" style="max-width:200px;border-radius:8px;" onerror="this.src=\'https://via.placeholder.com/200?text=' + encodeURIComponent(brand.name) + '\'">';
        }

        // Scroll to form
        document.getElementById('brandForm').scrollIntoView({ behavior: 'smooth' });
    }

    async deleteBrand(brandId) {
        const brand = this.brands.find(b => b.id === brandId);
        const brandName = brand ? brand.name : 'this brand';
        
        if (!confirm(`Are you sure you want to delete "${brandName}"?\n\nThis action cannot be undone.`)) return;

        try {
            // Delete logo from storage if exists and is Azure Blob
            if (brand?.logoUrl && this.isAzureBlobUrl(brand.logoUrl)) {
                await storageService.deleteImage(brand.logoUrl);
            }
            
            this.brands = this.brands.filter(b => b.id !== brandId);
            
            const token = await this.authService.getStorageAccessToken();
            await storageService.saveBrands(this.brands, token);

            this.showNotification('Brand deleted successfully!', 'success');
            await this.loadBrands();

        } catch (error) {
            console.error('Error deleting brand:', error);
            this.showNotification('Failed to delete brand.', 'error');
        }
    }

    previewBrandLogo(e) {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            const preview = document.getElementById('brandLogoPreview');
            preview.innerHTML = '<img src="' + event.target.result + '" alt="Logo preview" style="max-width:200px;border-radius:8px;margin-top:1rem;">';
        };
        reader.readAsDataURL(file);
    }
    
    previewBrandLogoUrl(e) {
        const url = e.target.value;
        const preview = document.getElementById('brandLogoPreview');
        
        if (url) {
            preview.innerHTML = '<img src="' + url + '" alt="Logo preview" style="max-width:200px;border-radius:8px;margin-top:1rem;" onerror="this.src=\'https://via.placeholder.com/200?text=Invalid+URL\'">';
        } else {
            preview.innerHTML = '';
        }
    }

    resetBrandForm() {
        document.getElementById('brandForm').reset();
        document.getElementById('brandLogoPreview').innerHTML = '';
        document.getElementById('brandFormTitle').textContent = 'Add New Brand';
        document.getElementById('uploadLogoSection').style.display = 'block';
        document.getElementById('urlLogoSection').style.display = 'none';
        this.currentEditingBrandId = null;
    }

    generateBrandId() {
        return 'brand_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }
    
    isAzureBlobUrl(url) {
        return url && url.includes(AZURE_CONFIG.storageAccountName) && url.includes('blob.core.windows.net');
    }

    showNotification(message, type) {
        // Reuse the notification function from AdminManager if available
        if (window.adminManager && window.adminManager.showNotification) {
            window.adminManager.showNotification(message, type);
        } else {
            alert(message);
        }
    }
}

// Export for use in admin.js
window.BrandManager = BrandManager;
