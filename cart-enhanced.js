// Système de panier amélioré pour Zaza A Paris - Version 2025
// Expérience utilisateur premium avec animations et fonctionnalités avancées

class EnhancedShoppingCart {
    constructor() {
        this.items = this.loadCart();
        this.isCartOpen = false;
        this.animationDuration = 300;
        this.init();
    }

    // Initialisation du système
    init() {
        this.createCartElements();
        this.updateCartDisplay();
        this.initializeEventListeners();
        this.loadProductData();
    }

    // Charger les données produits
    async loadProductData() {
        try {
            const response = await fetch('products_for_trae.json');
            this.productsData = await response.json();
        } catch (error) {
            console.error('Erreur lors du chargement des produits:', error);
            this.productsData = { products: [] };
        }
    }

    // Charger le panier depuis localStorage avec validation
    loadCart() {
        try {
            const savedCart = localStorage.getItem('zazaCartEnhanced');
            const cart = savedCart ? JSON.parse(savedCart) : [];
            // Validation des données du panier
            return cart.filter(item => item.id && item.title && item.price);
        } catch (error) {
            console.error('Erreur lors du chargement du panier:', error);
            return [];
        }
    }

    // Sauvegarder le panier avec gestion d'erreur
    saveCart() {
        try {
            localStorage.setItem('zazaCartEnhanced', JSON.stringify(this.items));
            // Déclencher un événement personnalisé pour la synchronisation
            window.dispatchEvent(new CustomEvent('cartUpdated', { detail: this.items }));
        } catch (error) {
            console.error('Erreur lors de la sauvegarde du panier:', error);
        }
    }

    // Ajouter un produit avec animation et feedback
    async addItem(product, quantity = 1, showAnimation = true) {
        if (!product || !product.id) {
            this.showNotification('Erreur lors de l\'ajout du produit', 'error');
            return false;
        }

        const existingItem = this.items.find(item => item.id === product.id);
        
        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            this.items.push({
                id: product.id,
                title: product.title,
                price: product.price,
                image: product.images?.[0] || '/assets/images/placeholder.jpg',
                quantity: quantity,
                material: product.material || '',
                collection: product.collection || '',
                addedAt: new Date().toISOString()
            });
        }
        
        this.saveCart();
        await this.updateCartDisplay();
        
        if (showAnimation) {
            this.showAddToCartAnimation(product);
            this.showNotification(`${product.title} ajouté au panier`, 'success', {
                price: this.formatPrice(this.getItemPrice(product)),
                image: product.images?.[0]
            });
        }
        
        return true;
    }

    // Supprimer un produit avec confirmation
    removeItem(productId, showConfirmation = true) {
        const item = this.items.find(item => item.id === productId);
        if (!item) return false;

        if (showConfirmation) {
            this.showConfirmationModal(
                'Supprimer cet article ?',
                `Êtes-vous sûr de vouloir supprimer "${item.title}" de votre panier ?`,
                () => {
                    this.items = this.items.filter(item => item.id !== productId);
                    this.saveCart();
                    this.updateCartDisplay();
                    this.showNotification('Article supprimé du panier', 'info');
                }
            );
        } else {
            this.items = this.items.filter(item => item.id !== productId);
            this.saveCart();
            this.updateCartDisplay();
        }
        
        return true;
    }

    // Modifier la quantité avec validation
    updateQuantity(productId, quantity) {
        const item = this.items.find(item => item.id === productId);
        if (!item) return false;

        if (quantity <= 0) {
            this.removeItem(productId);
        } else if (quantity > 10) {
            this.showNotification('Quantité maximale: 10 articles', 'warning');
            item.quantity = 10;
        } else {
            item.quantity = quantity;
        }
        
        this.saveCart();
        this.updateCartDisplay();
        return true;
    }

    // Vider le panier avec confirmation
    clearCart() {
        if (this.items.length === 0) {
            this.showNotification('Le panier est déjà vide', 'info');
            return;
        }

        this.showConfirmationModal(
            'Vider le panier ?',
            'Êtes-vous sûr de vouloir supprimer tous les articles de votre panier ?',
            () => {
                this.items = [];
                this.saveCart();
                this.updateCartDisplay();
                this.showNotification('Panier vidé', 'info');
            }
        );
    }

    // Calculer le prix unitaire avec gestion d'erreur
    getItemPrice(item) {
        if (!item || !item.price) return 0;
        
        let cleanPrice = item.price.toString();
        cleanPrice = cleanPrice.replace(/[^\d.,]/g, '');
        
        if (cleanPrice.includes(',') && cleanPrice.includes('.')) {
            const lastComma = cleanPrice.lastIndexOf(',');
            const lastDot = cleanPrice.lastIndexOf('.');
            if (lastComma > lastDot) {
                cleanPrice = cleanPrice.replace(/\./g, '').replace(',', '.');
            } else {
                cleanPrice = cleanPrice.replace(/,/g, '');
            }
        } else {
            cleanPrice = cleanPrice.replace(',', '.');
        }
        
        const price = parseFloat(cleanPrice);
        return isNaN(price) ? 0 : price;
    }

    // Calculer le total avec TVA
    getTotal() {
        return this.items.reduce((total, item) => {
            const price = this.getItemPrice(item);
            return total + (price * item.quantity);
        }, 0);
    }

    // Calculer la TVA (20%)
    getTVA() {
        return this.getTotal() * 0.2;
    }

    // Calculer le total HT
    getTotalHT() {
        return this.getTotal() - this.getTVA();
    }

    // Formater un prix pour l'affichage
    formatPrice(price) {
        return new Intl.NumberFormat('fr-FR', {
            style: 'currency',
            currency: 'EUR',
            minimumFractionDigits: 2
        }).format(price);
    }

    // Obtenir le nombre total d'articles
    getTotalItems() {
        return this.items.reduce((total, item) => total + item.quantity, 0);
    }

    // Créer les éléments du panier dans le DOM
    createCartElements() {
        // Ajouter le compteur au panier si pas déjà présent
        const cartIcon = document.querySelector('.cart-icon');
        if (cartIcon && !cartIcon.querySelector('.cart-count')) {
            const cartCount = document.createElement('span');
            cartCount.className = 'cart-count';
            cartCount.textContent = '0';
            cartIcon.appendChild(cartCount);
        }
    }

    // Méthode createMiniCartPreview supprimée pour éviter les conflits

    // Mettre à jour l'affichage du panier avec animations
    async updateCartDisplay() {
        const cartCount = document.querySelector('.cart-count');
        const totalItems = this.getTotalItems();
        
        if (cartCount) {
            // Animation du compteur
            if (parseInt(cartCount.textContent) !== totalItems) {
                cartCount.style.transform = 'scale(1.3)';
                setTimeout(() => {
                    cartCount.textContent = totalItems;
                    cartCount.style.display = totalItems > 0 ? 'flex' : 'none';
                    cartCount.style.transform = 'scale(1)';
                }, 150);
            }
        }

        // Mettre à jour le modal si ouvert
        if (document.querySelector('.enhanced-cart-modal.active')) {
            this.renderCartModal();
        }
    }

    // Animation d'ajout au panier
    showAddToCartAnimation(product) {
        const cartIcon = document.querySelector('.cart-icon');
        if (!cartIcon) return;

        // Créer l'élément d'animation
        const animationElement = document.createElement('div');
        animationElement.className = 'cart-add-animation';
        animationElement.innerHTML = '🛍️';
        
        // Positionner l'élément
        const rect = cartIcon.getBoundingClientRect();
        animationElement.style.position = 'fixed';
        animationElement.style.left = rect.left + 'px';
        animationElement.style.top = rect.top + 'px';
        animationElement.style.zIndex = '10000';
        animationElement.style.fontSize = '24px';
        animationElement.style.pointerEvents = 'none';
        
        document.body.appendChild(animationElement);
        
        // Animation
        setTimeout(() => {
            animationElement.style.transform = 'scale(1.5) rotate(360deg)';
            animationElement.style.opacity = '0';
            animationElement.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
        }, 100);
        
        // Nettoyer
        setTimeout(() => {
            document.body.removeChild(animationElement);
        }, 700);
        
        // Animation de l'icône du panier
        cartIcon.style.transform = 'scale(1.2)';
        setTimeout(() => {
            cartIcon.style.transform = 'scale(1)';
        }, 200);
    }

    // Système de notifications amélioré
    showNotification(message, type = 'info', details = null) {
        const notification = document.createElement('div');
        notification.className = `enhanced-notification ${type}`;
        
        const icons = {
            success: '✓',
            error: '✕',
            warning: '⚠',
            info: 'ℹ'
        };
        
        let content = `
            <div class="notification-content">
                <span class="notification-icon">${icons[type] || icons.info}</span>
                <div class="notification-details">
                    <div class="notification-message">${message}</div>
        `;
        
        if (details) {
            if (details.price) {
                content += `<div class="notification-price">${details.price}</div>`;
            }
            if (details.image) {
                content += `<img src="${details.image}" alt="" class="notification-image">`;
            }
        }
        
        content += `
                </div>
            </div>
            <button class="notification-close">&times;</button>
        `;
        
        notification.innerHTML = content;
        
        // Ajouter au DOM
        document.body.appendChild(notification);
        
        // Event listener pour fermer
        notification.querySelector('.notification-close').addEventListener('click', () => {
            this.hideNotification(notification);
        });
        
        // Animation d'entrée
        setTimeout(() => {
            notification.classList.add('show');
        }, 100);
        
        // Auto-hide après 4 secondes
        setTimeout(() => {
            this.hideNotification(notification);
        }, 4000);
    }

    // Masquer une notification
    hideNotification(notification) {
        notification.classList.remove('show');
        setTimeout(() => {
            if (notification.parentNode) {
                document.body.removeChild(notification);
            }
        }, 300);
    }

    // Modal de confirmation
    showConfirmationModal(title, message, onConfirm) {
        const modal = document.createElement('div');
        modal.className = 'confirmation-modal';
        modal.innerHTML = `
            <div class="confirmation-overlay"></div>
            <div class="confirmation-content">
                <h3>${title}</h3>
                <p>${message}</p>
                <div class="confirmation-actions">
                    <button class="btn-cancel">Annuler</button>
                    <button class="btn-confirm">Confirmer</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Event listeners
        modal.querySelector('.btn-cancel').addEventListener('click', () => {
            this.hideConfirmationModal(modal);
        });
        
        modal.querySelector('.btn-confirm').addEventListener('click', () => {
            onConfirm();
            this.hideConfirmationModal(modal);
        });
        
        modal.querySelector('.confirmation-overlay').addEventListener('click', () => {
            this.hideConfirmationModal(modal);
        });
        
        // Animation d'entrée
        setTimeout(() => {
            modal.classList.add('active');
        }, 100);
    }

    // Masquer le modal de confirmation
    hideConfirmationModal(modal) {
        modal.classList.remove('active');
        setTimeout(() => {
            if (modal.parentNode) {
                document.body.removeChild(modal);
            }
        }, 300);
    }

    // Ouvrir le mini panier
    // Méthodes openMiniCart et closeMiniCart supprimées
    }

    // Méthode renderMiniCart supprimée

    // Ouvrir le modal principal du panier
    openCartModal() {
        let modal = document.querySelector('.enhanced-cart-modal');
        if (!modal) {
            modal = this.createCartModal();
            document.body.appendChild(modal);
        }
        
        this.renderCartModal();
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
        this.isCartOpen = true;
    }

    // Fermer le modal du panier
    closeCartModal() {
        const modal = document.querySelector('.enhanced-cart-modal');
        if (modal) {
            modal.classList.remove('active');
            document.body.style.overflow = '';
            this.isCartOpen = false;
        }
    }

    // Créer le modal principal du panier
    createCartModal() {
        const modal = document.createElement('div');
        modal.className = 'enhanced-cart-modal';
        modal.innerHTML = `
            <div class="cart-modal-overlay"></div>
            <div class="enhanced-cart-content">
                <div class="cart-header">
                    <div class="cart-header-info">
                        <h2>Votre Panier</h2>
                        <span class="cart-items-count"></span>
                    </div>
                    <button class="cart-close-btn">
                        <svg viewBox="0 0 24 24" width="24" height="24">
                            <path fill="currentColor" d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z"/>
                        </svg>
                    </button>
                </div>
                
                <div class="cart-body">
                    <div class="cart-items-container"></div>
                </div>
                
                <div class="cart-footer">
                    <div class="cart-summary">
                        <div class="summary-row">
                            <span>Sous-total HT:</span>
                            <span class="subtotal-ht"></span>
                        </div>
                        <div class="summary-row">
                            <span>TVA (20%):</span>
                            <span class="tva-amount"></span>
                        </div>
                        <div class="summary-row total-row">
                            <span>Total TTC:</span>
                            <span class="total-amount"></span>
                        </div>
                    </div>
                    
                    <div class="cart-actions">
                        <button class="btn-continue-shopping">Continuer mes achats</button>
                        <button class="btn-checkout-primary">Finaliser ma commande</button>
                    </div>
                    
                    <div class="cart-security">
                        <div class="security-badges">
                            <span class="security-badge">
                                <svg viewBox="0 0 24 24" width="16" height="16">
                                    <path fill="currentColor" d="M12,1L3,5V11C3,16.55 6.84,21.74 12,23C17.16,21.74 21,16.55 21,11V5L12,1M12,7C13.4,7 14.8,8.6 14.8,10V11.5C15.4,11.5 16,12.4 16,13V16C16,16.6 15.6,17 15,17H9C8.4,17 8,16.6 8,16V13C8,12.4 8.4,11.5 9,11.5V10C9,8.6 10.6,7 12,7M12,8.2C11.2,8.2 10.2,9.2 10.2,10V11.5H13.8V10C13.8,9.2 12.8,8.2 12,8.2Z"/>
                                </svg>
                                Paiement sécurisé
                            </span>
                            <span class="security-badge">
                                <svg viewBox="0 0 24 24" width="16" height="16">
                                    <path fill="currentColor" d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M11,16.5L6.5,12L7.91,10.59L11,13.67L16.59,8.09L18,9.5L11,16.5Z"/>
                                </svg>
                                Livraison gratuite dès 50€
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        // Event listeners
        modal.querySelector('.cart-close-btn').addEventListener('click', () => this.closeCartModal());
        modal.querySelector('.cart-modal-overlay').addEventListener('click', () => this.closeCartModal());
        modal.querySelector('.btn-continue-shopping').addEventListener('click', () => this.closeCartModal());
        modal.querySelector('.btn-checkout-primary').addEventListener('click', () => this.proceedToCheckout());
        
        return modal;
    }

    // Rendre le contenu du modal principal
    renderCartModal() {
        const itemsContainer = document.querySelector('.cart-items-container');
        const itemsCount = document.querySelector('.cart-items-count');
        const subtotalHT = document.querySelector('.subtotal-ht');
        const tvaAmount = document.querySelector('.tva-amount');
        const totalAmount = document.querySelector('.total-amount');
        
        if (!itemsContainer) return;
        
        // Mettre à jour le compteur d'articles
        if (itemsCount) {
            const totalItems = this.getTotalItems();
            itemsCount.textContent = `${totalItems} article${totalItems > 1 ? 's' : ''}`;
        }
        
        if (this.items.length === 0) {
            itemsContainer.innerHTML = `
                <div class="empty-cart-state">
                    <div class="empty-cart-icon">
                        <svg viewBox="0 0 24 24" width="64" height="64">
                            <path fill="currentColor" d="M19,7H15V6A3,3 0 0,0 12,3A3,3 0 0,0 9,6V7H5A1,1 0 0,0 4,8V19A3,3 0 0,0 7,22H17A3,3 0 0,0 20,19V8A1,1 0 0,0 19,7M9,6A1,1 0 0,1 10,5H14A1,1 0 0,1 15,6V7H9V6M18,19A1,1 0 0,1 17,20H7A1,1 0 0,1 6,19V9H8V10A1,1 0 0,0 9,11A1,1 0 0,0 10,10V9H14V10A1,1 0 0,0 15,11A1,1 0 0,0 16,10V9H18V19Z"/>
                        </svg>
                    </div>
                    <h3>Votre panier est vide</h3>
                    <p>Découvrez nos collections de bijoux d'exception</p>
                    <button class="btn-discover" data-action="discover-collections">Découvrir nos collections</button>
                </div>
            `;
        } else {
            itemsContainer.innerHTML = this.items.map(item => {
                const unitPrice = this.getItemPrice(item);
                const itemTotal = unitPrice * item.quantity;
                return `
                    <div class="enhanced-cart-item" data-id="${item.id}">
                        <div class="item-image">
                            <img src="${item.image}" alt="${item.title}" loading="lazy">
                        </div>
                        
                        <div class="item-details">
                            <h4 class="item-title">${item.title}</h4>
                            <div class="item-meta">
                                ${item.material ? `<span class="item-material">${item.material}</span>` : ''}
                                ${item.collection ? `<span class="item-collection">${item.collection}</span>` : ''}
                            </div>
                            <div class="item-price">${this.formatPrice(unitPrice)}</div>
                        </div>
                        
                        <div class="item-controls">
                            <div class="quantity-controls">
                                <button class="qty-btn qty-minus" data-product-id="${item.id}" data-action="decrease">
                                    <svg viewBox="0 0 24 24" width="16" height="16">
                                        <path fill="currentColor" d="M19,13H5V11H19V13Z"/>
                                    </svg>
                                </button>
                                <input type="number" class="qty-input" value="${item.quantity}" min="1" max="10" 
                                       data-product-id="${item.id}">
                                <button class="qty-btn qty-plus" data-product-id="${item.id}" data-action="increase">
                                    <svg viewBox="0 0 24 24" width="16" height="16">
                                        <path fill="currentColor" d="M19,13H13V19H11V13H5V11H11V5H13V11H19V13Z"/>
                                    </svg>
                                </button>
                            </div>
                            
                            <div class="item-total">${this.formatPrice(itemTotal)}</div>
                            
                            <button class="remove-btn" data-product-id="${item.id}" data-action="remove" title="Supprimer">
                                <svg viewBox="0 0 24 24" width="18" height="18">
                                    <path fill="currentColor" d="M19,4H15.5L14.5,3H9.5L8.5,4H5V6H19M6,19A2,2 0 0,0 8,21H16A2,2 0 0,0 18,19V7H6V19Z"/>
                                </svg>
                            </button>
                        </div>
                    </div>
                `;
            }).join('');
        }
        
        // Mettre à jour les totaux
        if (subtotalHT) subtotalHT.textContent = this.formatPrice(this.getTotalHT());
        if (tvaAmount) tvaAmount.textContent = this.formatPrice(this.getTVA());
        if (totalAmount) totalAmount.textContent = this.formatPrice(this.getTotal());
    }

    // Procéder au checkout
    proceedToCheckout() {
        if (this.items.length === 0) {
            this.showNotification('Votre panier est vide', 'warning');
            return;
        }
        
        // Sauvegarder l'état du panier avant redirection
        this.saveCart();
        
        // Rediriger vers la page de commande
        window.location.href = 'commande.html';
    }

    // Initialiser les event listeners
    initializeEventListeners() {
        // Clic sur l'icône du panier
        document.addEventListener('click', (e) => {
            if (e.target.closest('.cart-icon')) {
                e.preventDefault();
                this.openCartModal();
            }
        });
        
        // Événements de hover supprimés pour simplifier le système
        
        // Fermer avec Escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeCartModal();
            }
        });
        
        // Synchronisation entre onglets
        window.addEventListener('storage', (e) => {
            if (e.key === 'zazaCartEnhanced') {
                this.items = this.loadCart();
                this.updateCartDisplay();
            }
        });
        
        // Événement personnalisé pour les mises à jour
        window.addEventListener('cartUpdated', (e) => {
            this.updateCartDisplay();
        });
        
        // Gérer les boutons du panier (quantité et suppression)
        document.addEventListener('click', (e) => {
            const target = e.target.closest('[data-product-id]');
            if (!target) return;
            
            const productId = target.getAttribute('data-product-id');
            const action = target.getAttribute('data-action');
            
            if (!productId || !action) return;
            
            e.preventDefault();
            e.stopPropagation();
            
            switch (action) {
                case 'increase':
                    const currentQty = this.getItemQuantity(productId);
                    this.updateQuantity(productId, currentQty + 1);
                    break;
                case 'decrease':
                    const currentQtyDec = this.getItemQuantity(productId);
                    this.updateQuantity(productId, currentQtyDec - 1);
                    break;
                case 'remove':
                    this.removeItem(productId);
                    break;
                case 'discover-collections':
                    this.closeCartModal();
                    window.location.href = 'collections.html';
                    break;
            }
        });
        
        // Gérer les inputs de quantité
        document.addEventListener('change', (e) => {
            if (e.target.classList.contains('qty-input')) {
                const productId = e.target.getAttribute('data-product-id');
                const newQuantity = parseInt(e.target.value);
                
                if (productId && !isNaN(newQuantity)) {
                    this.updateQuantity(productId, newQuantity);
                }
            }
        });
    }

    // Méthodes utilitaires pour l'intégration
    
    // Ajouter un produit depuis un bouton (compatibilité)
    addToCart(product, quantity = 1) {
        return this.addItem(product, quantity);
    }
    
    // Obtenir les données du panier pour l'export
    getCartData() {
        return {
            items: this.items,
            totalItems: this.getTotalItems(),
            subtotalHT: this.getTotalHT(),
            tva: this.getTVA(),
            total: this.getTotal(),
            timestamp: new Date().toISOString()
        };
    }
    
    // Importer des données de panier
    importCartData(cartData) {
        if (cartData && Array.isArray(cartData.items)) {
            this.items = cartData.items;
            this.saveCart();
            this.updateCartDisplay();
            return true;
        }
        return false;
    }
    
    // Vérifier si un produit est dans le panier
    isInCart(productId) {
        return this.items.some(item => item.id === productId);
    }
    
    // Obtenir la quantité d'un produit dans le panier
    getItemQuantity(productId) {
        const item = this.items.find(item => item.id === productId);
        return item ? item.quantity : 0;
    }
}

// Initialiser le panier amélioré
const enhancedCart = new EnhancedShoppingCart();

// Exporter pour compatibilité avec l'ancien système
window.cart = enhancedCart;
window.enhancedCart = enhancedCart;

// Fonctions globales pour compatibilité
window.addToCartFromFeatured = function(productId) {
    if (enhancedCart.productsData && enhancedCart.productsData.products) {
        const product = enhancedCart.productsData.products.find(p => p.id == productId);
        if (product) {
            enhancedCart.addItem(product);
        }
    }
};

// Export pour modules ES6 si nécessaire
if (typeof module !== 'undefined' && module.exports) {
    module.exports = EnhancedShoppingCart;
}