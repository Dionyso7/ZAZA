// Enhanced Features for Zaza A Paris E-commerce
// Système de recherche, filtrage et panier amélioré

class ZazaEcommerce {
    constructor() {
        this.products = [];
        this.filteredProducts = [];
        this.searchResults = [];
        this.currentFilters = {
            priceMin: 0,
            priceMax: 50,
            materials: [],
            collection: '',
            searchQuery: ''
        };
        this.init();
    }

    async init() {
        await this.loadProducts();
        this.initializeSearch();
        this.initializeFilters();
        this.initializeCartButtons();
        this.initializeMiniCart();
        
        // Afficher les produits sur la page collections
        if (document.querySelector('#products-grid')) {
            this.displayProductsOnLoad();
        }
    }

    // Chargement des produits
    async loadProducts() {
        try {
            const response = await fetch('products_for_trae.json');
            const data = await response.json();
            this.products = data.products || [];
            this.filteredProducts = [...this.products];
            console.log('Produits chargés:', this.products.length);
        } catch (error) {
            console.error('Erreur lors du chargement des produits:', error);
            this.showErrorMessage();
        }
    }

    // Afficher les produits au chargement initial
    displayProductsOnLoad() {
        const loader = document.getElementById('loader');
        const productsGrid = document.getElementById('products-grid');
        
        if (loader) {
            // Simulation d'un délai de chargement pour l'effet
            setTimeout(() => {
                loader.style.display = 'none';
                if (productsGrid) {
                    productsGrid.style.display = 'grid';
                    this.updateProductsDisplay();
                }
            }, 1000);
        } else if (productsGrid) {
            productsGrid.style.display = 'grid';
            this.updateProductsDisplay();
        }
    }

    // Afficher le message d'erreur
    showErrorMessage() {
        const loader = document.getElementById('loader');
        const errorMessage = document.getElementById('error-message');
        
        if (loader) loader.style.display = 'none';
        if (errorMessage) errorMessage.style.display = 'block';
    }

    // Système de recherche intelligent
    initializeSearch() {
        const searchIcon = document.querySelector('.search-icon');
        if (!searchIcon) return;

        // Créer la modal de recherche
        this.createSearchModal();

        searchIcon.addEventListener('click', () => {
            this.openSearchModal();
        });
    }

    createSearchModal() {
        const modal = document.createElement('div');
        modal.className = 'search-modal';
        modal.innerHTML = `
            <div class="search-modal-content">
                <div class="search-modal-header">
                    <h3>Rechercher un bijou</h3>
                    <button class="search-modal-close">&times;</button>
                </div>
                <div class="search-input-container">
                    <input type="text" id="search-input" placeholder="Rechercher par nom, matériau, collection..." autocomplete="off">
                    <div class="search-suggestions" id="search-suggestions"></div>
                </div>
                <div class="search-results" id="search-results"></div>
            </div>
        `;

        document.body.appendChild(modal);

        // Styles pour la modal
        const styles = `
            .search-modal {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.8);
                backdrop-filter: blur(10px);
                z-index: 10000;
                display: none;
                align-items: flex-start;
                justify-content: center;
                padding-top: 5vh;
            }

            .search-modal-content {
                background: white;
                border-radius: 20px;
                width: 90%;
                max-width: 800px;
                max-height: 80vh;
                overflow: hidden;
                box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
                animation: searchModalSlideIn 0.3s ease;
            }

            @keyframes searchModalSlideIn {
                from {
                    opacity: 0;
                    transform: translateY(-50px) scale(0.9);
                }
                to {
                    opacity: 1;
                    transform: translateY(0) scale(1);
                }
            }

            .search-modal-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 2rem;
                border-bottom: 1px solid #eee;
            }

            .search-modal-header h3 {
                margin: 0;
                color: #2c3e50;
                font-family: 'Playfair Display', serif;
            }

            .search-modal-close {
                background: none;
                border: none;
                font-size: 2rem;
                cursor: pointer;
                color: #7f8c8d;
                transition: color 0.3s ease;
            }

            .search-modal-close:hover {
                color: #d4af37;
            }

            .search-input-container {
                position: relative;
                padding: 2rem;
                border-bottom: 1px solid #eee;
            }

            #search-input {
                width: 100%;
                padding: 1rem 1.5rem;
                border: 2px solid #eee;
                border-radius: 50px;
                font-size: 1.1rem;
                outline: none;
                transition: border-color 0.3s ease;
            }

            #search-input:focus {
                border-color: #d4af37;
            }

            .search-suggestions {
                position: absolute;
                top: 100%;
                left: 2rem;
                right: 2rem;
                background: white;
                border: 1px solid #eee;
                border-radius: 10px;
                max-height: 200px;
                overflow-y: auto;
                z-index: 1000;
                display: none;
            }

            .search-suggestion {
                padding: 1rem 1.5rem;
                cursor: pointer;
                border-bottom: 1px solid #f8f9fa;
                transition: background 0.2s ease;
            }

            .search-suggestion:hover {
                background: #f8f9fa;
            }

            .search-suggestion:last-child {
                border-bottom: none;
            }

            .search-results {
                padding: 2rem;
                max-height: 400px;
                overflow-y: auto;
            }

            .search-result-item {
                display: flex;
                align-items: center;
                padding: 1rem;
                border-radius: 10px;
                margin-bottom: 1rem;
                cursor: pointer;
                transition: background 0.2s ease;
            }

            .search-result-item:hover {
                background: #f8f9fa;
            }

            .search-result-image {
                width: 60px;
                height: 60px;
                border-radius: 10px;
                overflow: hidden;
                margin-right: 1rem;
            }

            .search-result-image img {
                width: 100%;
                height: 100%;
                object-fit: cover;
            }

            .search-result-info h4 {
                margin: 0 0 0.5rem 0;
                color: #2c3e50;
            }

            .search-result-info p {
                margin: 0;
                color: #7f8c8d;
                font-size: 0.9rem;
            }

            .search-result-price {
                margin-left: auto;
                font-weight: bold;
                color: #d4af37;
            }
        `;

        const styleSheet = document.createElement('style');
        styleSheet.textContent = styles;
        document.head.appendChild(styleSheet);

        // Event listeners
        const closeBtn = modal.querySelector('.search-modal-close');
        const searchInput = modal.querySelector('#search-input');
        const suggestions = modal.querySelector('#search-suggestions');
        const results = modal.querySelector('#search-results');

        closeBtn.addEventListener('click', () => this.closeSearchModal());
        modal.addEventListener('click', (e) => {
            if (e.target === modal) this.closeSearchModal();
        });

        // Recherche en temps réel
        let searchTimeout;
        searchInput.addEventListener('input', (e) => {
            clearTimeout(searchTimeout);
            const query = e.target.value.trim();
            
            if (query.length < 2) {
                suggestions.style.display = 'none';
                results.innerHTML = '';
                return;
            }

            searchTimeout = setTimeout(() => {
                this.performSearch(query);
            }, 300);
        });

        // Fermer avec Escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modal.style.display === 'flex') {
                this.closeSearchModal();
            }
        });
    }

    openSearchModal() {
        const modal = document.querySelector('.search-modal');
        const searchInput = modal.querySelector('#search-input');
        
        modal.style.display = 'flex';
        setTimeout(() => {
            searchInput.focus();
        }, 100);
    }

    closeSearchModal() {
        const modal = document.querySelector('.search-modal');
        modal.style.display = 'none';
        
        // Nettoyer les résultats
        const searchInput = modal.querySelector('#search-input');
        const suggestions = modal.querySelector('#search-suggestions');
        const results = modal.querySelector('#search-results');
        
        searchInput.value = '';
        suggestions.style.display = 'none';
        results.innerHTML = '';
    }

    performSearch(query) {
        const results = this.products.filter(product => {
            const searchText = `${product.title} ${product.description} ${product.collection || ''} ${product.material || ''}`.toLowerCase();
            return searchText.includes(query.toLowerCase());
        });

        this.displaySearchResults(results, query);
    }

    displaySearchResults(results, query) {
        const resultsContainer = document.querySelector('#search-results');
        
        if (results.length === 0) {
            resultsContainer.innerHTML = `
                <div class="no-results">
                    <p>Aucun résultat trouvé pour "${query}"</p>
                    <p>Essayez avec d'autres mots-clés comme "bague", "or", "diamant"...</p>
                </div>
            `;
            return;
        }

        resultsContainer.innerHTML = results.map(product => `
            <div class="search-result-item" onclick="window.zaza.goToProduct('${product.id}')">
                <div class="search-result-image">
                    <img src="${product.images[0]}" alt="${product.title}">
                </div>
                <div class="search-result-info">
                    <h4>${product.title}</h4>
                    <p>${this.truncateText(product.description, 60)}</p>
                </div>
                <div class="search-result-price">${product.price}</div>
            </div>
        `).join('');
    }

    goToProduct(productId) {
        this.closeSearchModal();
        window.location.href = `produit.html?id=${productId}`;
    }

    truncateText(text, maxLength) {
        const cleanText = text.replace(/<[^>]*>/g, '');
        return cleanText.length > maxLength ? cleanText.substring(0, maxLength) + '...' : cleanText;
    }

    // Système de filtres amélioré
    initializeFilters() {
        // Cette fonction sera appelée sur la page collections
        if (!document.querySelector('.filters-sidebar')) return;

        this.setupPriceFilters();
        this.setupMaterialFilters();
        this.setupCollectionFilter();
        this.setupResetButton();
    }

    setupPriceFilters() {
        const priceMin = document.getElementById('price-min');
        const priceMax = document.getElementById('price-max');
        const priceMinValue = document.getElementById('price-min-value');
        const priceMaxValue = document.getElementById('price-max-value');

        if (!priceMin || !priceMax) return;

        // Mettre à jour les valeurs max basées sur les produits
        const prices = this.products.map(p => this.extractPrice(p.price)).filter(p => p > 0);
        const maxPrice = prices.length > 0 ? Math.max(...prices) : 50;
        const minPrice = prices.length > 0 ? Math.min(...prices) : 0;
        
        priceMin.min = minPrice;
        priceMin.max = maxPrice;
        priceMin.value = minPrice;
        priceMax.min = minPrice;
        priceMax.max = maxPrice;
        priceMax.value = maxPrice;
        
        priceMinValue.textContent = minPrice;
        priceMaxValue.textContent = maxPrice;
        
        this.currentFilters.priceMin = minPrice;
        this.currentFilters.priceMax = maxPrice;

        priceMin.addEventListener('input', () => {
            const minVal = parseInt(priceMin.value);
            const maxVal = parseInt(priceMax.value);
            
            if (minVal > maxVal) {
                priceMax.value = minVal;
                priceMaxValue.textContent = minVal;
            }
            
            priceMinValue.textContent = minVal;
            this.currentFilters.priceMin = minVal;
            this.applyFilters();
        });

        priceMax.addEventListener('input', () => {
            const minVal = parseInt(priceMin.value);
            const maxVal = parseInt(priceMax.value);
            
            if (maxVal < minVal) {
                priceMin.value = maxVal;
                priceMinValue.textContent = maxVal;
            }
            
            priceMaxValue.textContent = maxVal;
            this.currentFilters.priceMax = maxVal;
            this.applyFilters();
        });
    }

    setupMaterialFilters() {
        const materialCheckboxes = document.querySelectorAll('input[name="material"]');
        
        materialCheckboxes.forEach(checkbox => {
            checkbox.addEventListener('change', () => {
                this.currentFilters.materials = Array.from(materialCheckboxes)
                    .filter(cb => cb.checked)
                    .map(cb => cb.value);
                this.applyFilters();
            });
        });
    }

    setupCollectionFilter() {
        const collectionSelect = document.getElementById('collection-filter');
        
        if (collectionSelect) {
            collectionSelect.addEventListener('change', () => {
                this.currentFilters.collection = collectionSelect.value;
                this.applyFilters();
            });
        }
    }

    setupResetButton() {
        const resetBtn = document.querySelector('.reset-filters-btn');
        
        if (resetBtn) {
            resetBtn.addEventListener('click', () => {
                this.resetFilters();
            });
        }
    }

    applyFilters() {
        let filtered = [...this.products];

        // Filtre par prix
        filtered = filtered.filter(product => {
            const price = this.extractPrice(product.price);
            return price >= this.currentFilters.priceMin && price <= this.currentFilters.priceMax;
        });

        // Filtre par matériaux
        if (this.currentFilters.materials.length > 0) {
            filtered = filtered.filter(product => {
                const productMaterials = (product.material || product.description || '').toLowerCase();
                return this.currentFilters.materials.some(material => {
                    if (material === 'or') {
                        return productMaterials.includes('or') || productMaterials.includes('24k') || productMaterials.includes('doré');
                    }
                    if (material === 'argent') {
                        return productMaterials.includes('argent') || productMaterials.includes('acier inoxydable');
                    }
                    if (material === 'pierres') {
                        return productMaterials.includes('pierre') || productMaterials.includes('perle') || 
                               productMaterials.includes('nacre') || productMaterials.includes('hématite') ||
                               productMaterials.includes('cabochon');
                    }
                    return productMaterials.includes(material.toLowerCase());
                });
            });
        }

        // Filtre par collection
        if (this.currentFilters.collection) {
            filtered = filtered.filter(product => {
                const productCollection = (product.collection || product.title || '').toLowerCase();
                return productCollection.includes(this.currentFilters.collection.toLowerCase());
            });
        }

        this.filteredProducts = filtered;
        this.updateProductsDisplay();
    }

    resetFilters() {
        // Reset price sliders
        const priceMin = document.getElementById('price-min');
        const priceMax = document.getElementById('price-max');
        const priceMinValue = document.getElementById('price-min-value');
        const priceMaxValue = document.getElementById('price-max-value');
        
        if (priceMin && priceMax) {
            priceMin.value = 0;
            priceMax.value = priceMax.max;
            priceMinValue.textContent = 0;
            priceMaxValue.textContent = priceMax.max;
        }

        // Reset material checkboxes
        const materialCheckboxes = document.querySelectorAll('input[name="material"]');
        materialCheckboxes.forEach(cb => cb.checked = false);

        // Reset collection select
        const collectionSelect = document.getElementById('collection-filter');
        if (collectionSelect) collectionSelect.value = '';

        // Reset filters object
        this.currentFilters = {
            priceMin: 0,
            priceMax: parseInt(priceMax?.max || 50),
            materials: [],
            collection: '',
            searchQuery: ''
        };

        this.applyFilters();
    }

    extractPrice(priceString) {
        if (!priceString) return 0;
        
        // Supprimer le symbole € et les espaces
        const cleanPrice = priceString.replace(/[€\s]/g, '');
        
        // Gérer les décimales avec point ou virgule
        const match = cleanPrice.match(/([0-9]+[.,]?[0-9]*)/g);
        if (match) {
            const numericValue = parseFloat(match[0].replace(',', '.'));
            return isNaN(numericValue) ? 0 : Math.round(numericValue);
        }
        return 0;
    }

    updateProductsDisplay() {
        const productsGrid = document.getElementById('products-grid');
        if (!productsGrid) return;

        // Mettre à jour le compteur de résultats
        this.updateResultsCounter();

        if (this.filteredProducts.length === 0) {
            productsGrid.innerHTML = `
                <div class="no-products-message">
                    <h3>Aucun produit trouvé</h3>
                    <p>Essayez de modifier vos critères de recherche</p>
                    <button onclick="window.zaza.resetFilters()" class="reset-filters-btn">Réinitialiser les filtres</button>
                </div>
            `;
            return;
        }

        productsGrid.innerHTML = '';
        
        this.filteredProducts.forEach((product, index) => {
            const card = this.createProductCard(product);
            
            // Animation d'apparition
            card.style.opacity = '0';
            card.style.transform = 'translateY(30px)';
            productsGrid.appendChild(card);
            
            setTimeout(() => {
                card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, index * 50);
        });
    }

    // Mettre à jour le compteur de résultats
    updateResultsCounter() {
        let counterElement = document.getElementById('results-counter');
        
        if (!counterElement) {
            // Créer le compteur s'il n'existe pas
            const collectionsMain = document.querySelector('.collections-main');
            if (collectionsMain) {
                counterElement = document.createElement('div');
                counterElement.id = 'results-counter';
                counterElement.className = 'results-counter';
                collectionsMain.insertBefore(counterElement, collectionsMain.firstChild);
                
                // Ajouter les styles
                const styles = `
                    .results-counter {
                        text-align: center;
                        margin-bottom: 2rem;
                        padding: 1rem;
                        background: linear-gradient(135deg, #f8f9fa, #e9ecef);
                        border-radius: 15px;
                        color: #2c3e50;
                        font-weight: 500;
                        border: 2px solid #d4af37;
                    }
                    .results-counter.filtered {
                        background: linear-gradient(135deg, #fff3cd, #ffeaa7);
                        border-color: #d4af37;
                    }
                `;
                
                if (!document.querySelector('#results-counter-styles')) {
                    const styleSheet = document.createElement('style');
                    styleSheet.id = 'results-counter-styles';
                    styleSheet.textContent = styles;
                    document.head.appendChild(styleSheet);
                }
            }
        }
        
        if (counterElement) {
            const total = this.products.length;
            const filtered = this.filteredProducts.length;
            const isFiltered = this.isFiltersActive();
            
            if (isFiltered) {
                counterElement.textContent = `${filtered} produit${filtered > 1 ? 's' : ''} trouvé${filtered > 1 ? 's' : ''} sur ${total}`;
                counterElement.className = 'results-counter filtered';
            } else {
                counterElement.textContent = `${total} produit${total > 1 ? 's' : ''} disponible${total > 1 ? 's' : ''}`;
                counterElement.className = 'results-counter';
            }
        }
    }

    // Vérifier si des filtres sont actifs
    isFiltersActive() {
        const prices = this.products.map(p => this.extractPrice(p.price)).filter(p => p > 0);
        const minPrice = prices.length > 0 ? Math.min(...prices) : 0;
        const maxPrice = prices.length > 0 ? Math.max(...prices) : 50;
        
        return this.currentFilters.priceMin > minPrice ||
               this.currentFilters.priceMax < maxPrice ||
               this.currentFilters.materials.length > 0 ||
               this.currentFilters.collection !== '' ||
               this.currentFilters.searchQuery !== '';
    }

    createProductCard(product) {
        const card = document.createElement('div');
        card.className = 'product-card';
        
        const cleanDesc = this.truncateText(product.description, 120);
        
        card.innerHTML = `
            <div class="product-image">
                <img src="${product.images[0]}" alt="${product.title}" loading="lazy">
                <div class="product-overlay">
                    <button class="quick-add-btn" onclick="window.zaza.addToCartQuick('${product.id}')">
                        Ajouter au panier
                    </button>
                </div>
            </div>
            <div class="product-info">
                <h3 class="product-title">${product.title}</h3>
                <p class="product-description">${cleanDesc}</p>
                <div class="product-price">${product.price}</div>
            </div>
        `;
        
        // Rendre la carte cliquable
        card.addEventListener('click', (e) => {
            if (!e.target.classList.contains('quick-add-btn')) {
                window.location.href = `produit.html?id=${product.id}`;
            }
        });
        
        return card;
    }

    // Système de panier amélioré
    initializeCartButtons() {
        // Gérer les boutons "Ajouter au panier" existants
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('add-to-cart-btn') || 
                e.target.closest('.add-to-cart-btn')) {
                e.preventDefault();
                e.stopPropagation();
                
                const btn = e.target.classList.contains('add-to-cart-btn') ? 
                    e.target : e.target.closest('.add-to-cart-btn');
                
                this.handleAddToCart(btn);
            }
        });
    }

    handleAddToCart(button) {
        // Animation du bouton
        const originalText = button.textContent;
        button.textContent = 'Ajouté !';
        button.style.background = '#28a745';
        button.disabled = true;

        // Effet visuel
        button.style.transform = 'scale(0.95)';
        setTimeout(() => {
            button.style.transform = 'scale(1)';
        }, 150);

        // Restaurer le bouton après 2 secondes
        setTimeout(() => {
            button.textContent = originalText;
            button.style.background = '';
            button.disabled = false;
        }, 2000);
        
        // Ajouter au panier via le système enhanced-cart
        if (window.enhancedCart) {
            // Récupérer l'ID du produit depuis l'URL ou les données
            const productId = this.getProductIdFromButton(button);
            if (productId) {
                const product = this.products.find(p => p.id == productId);
                if (product) {
                    window.enhancedCart.addToCart({
                        id: product.id,
                        title: product.title,
                        price: this.extractPrice(product.price),
                        image: product.images[0],
                        quantity: 1
                    });
                }
            }
        }
    }
    
    // Méthode pour ajouter rapidement au panier depuis les cartes produits
    addToCartQuick(productId) {
        const product = this.products.find(p => p.id == productId);
        if (!product) {
            console.error('Produit non trouvé:', productId);
            return;
        }
        
        if (window.enhancedCart) {
            const productData = {
                id: product.id,
                title: product.title,
                price: product.price, // Utiliser le prix original
                images: product.images || ['/assets/images/placeholder.jpg'],
                material: product.material || '',
                collection: product.collection || ''
            };
            
            console.log('Ajout du produit au panier:', productData);
            window.enhancedCart.addToCart(productData, 1);
            
            // Notification de succès (supprimée car déjà gérée par enhancedCart)
            // this.showAddToCartNotification(product.title);
        } else {
            console.error('enhancedCart non disponible');
        }
    }
    
    // Récupérer l'ID du produit depuis un bouton
    getProductIdFromButton(button) {
        // Essayer de récupérer depuis l'URL si on est sur une page produit
        const urlParams = new URLSearchParams(window.location.search);
        const productId = urlParams.get('id');
        if (productId) return productId;
        
        // Sinon, essayer de récupérer depuis les attributs du bouton
        return button.getAttribute('data-product-id') || null;
    }
    
    // Notification d'ajout au panier
    showAddToCartNotification(productTitle) {
        const notification = document.createElement('div');
        notification.className = 'cart-notification';
        notification.innerHTML = `
            <div class="cart-notification-content">
                <span class="cart-notification-icon">✓</span>
                <span class="cart-notification-text">${productTitle} ajouté au panier</span>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        // Styles pour la notification
        const styles = `
            .cart-notification {
                position: fixed;
                top: 100px;
                right: 20px;
                background: linear-gradient(135deg, #28a745, #20c997);
                color: white;
                padding: 1rem 1.5rem;
                border-radius: 50px;
                box-shadow: 0 10px 30px rgba(40, 167, 69, 0.3);
                z-index: 10000;
                animation: slideInRight 0.3s ease;
            }
            
            .cart-notification-content {
                display: flex;
                align-items: center;
                gap: 0.5rem;
            }
            
            .cart-notification-icon {
                font-size: 1.2rem;
                font-weight: bold;
            }
            
            @keyframes slideInRight {
                from {
                    transform: translateX(100%);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
        `;
        
        if (!document.querySelector('#cart-notification-styles')) {
            const styleSheet = document.createElement('style');
            styleSheet.id = 'cart-notification-styles';
            styleSheet.textContent = styles;
            document.head.appendChild(styleSheet);
        }
        
        // Supprimer après 3 secondes
        setTimeout(() => {
            notification.style.animation = 'slideInRight 0.3s ease reverse';
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 3000);

    }

    // Mini panier sticky - DÉSACTIVÉ pour éviter les conflits
    initializeMiniCart() {
        // Fonction désactivée - le panier principal gère maintenant tous les événements
        return;
    }

    // Méthodes du mini-cart supprimées pour éviter les conflits avec le système principal
}

// Initialiser le système au chargement de la page
document.addEventListener('DOMContentLoaded', () => {
    window.zaza = new ZazaEcommerce();
});

// Fonctions globales pour la compatibilité
function applyFilters() {
    if (window.zaza) {
        window.zaza.applyFilters();
    }
}

function resetFilters() {
    if (window.zaza) {
        window.zaza.resetFilters();
    }
}

// Export pour utilisation dans d'autres scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ZazaEcommerce;
}