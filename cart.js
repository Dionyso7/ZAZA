// Système de panier pour Zaza A Paris
class ShoppingCart {
    constructor() {
        this.items = this.loadCart();
        this.updateCartDisplay();
        this.initializeEventListeners();
    }

    // Charger le panier depuis localStorage
    loadCart() {
        const savedCart = localStorage.getItem('zazaCart');
        return savedCart ? JSON.parse(savedCart) : [];
    }

    // Sauvegarder le panier dans localStorage
    saveCart() {
        localStorage.setItem('zazaCart', JSON.stringify(this.items));
    }

    // Ajouter un produit au panier
    addItem(product, quantity = 1) {
        const existingItem = this.items.find(item => item.id === product.id);
        
        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            this.items.push({
                id: product.id,
                title: product.title,
                price: product.price,
                image: product.images[0],
                quantity: quantity
            });
        }
        
        this.saveCart();
        this.updateCartDisplay();
        this.showAddToCartNotification(product.title, product);
    }

    // Supprimer un produit du panier
    removeItem(productId) {
        this.items = this.items.filter(item => item.id !== productId);
        this.saveCart();
        this.updateCartDisplay();
    }

    // Modifier la quantité d'un produit
    updateQuantity(productId, quantity) {
        const item = this.items.find(item => item.id === productId);
        if (item) {
            if (quantity <= 0) {
                this.removeItem(productId);
            } else {
                item.quantity = quantity;
                this.saveCart();
                this.updateCartDisplay();
            }
        }
    }

    // Vider le panier
    clearCart() {
        this.items = [];
        this.saveCart();
        this.updateCartDisplay();
    }

    // Calculer le total
    getTotal() {
        return this.items.reduce((total, item) => {
            // Nettoyer le prix : supprimer tout sauf les chiffres, points et virgules
            let cleanPrice = item.price.replace(/[^\d.,]/g, '');
            // Remplacer la virgule par un point pour parseFloat
            cleanPrice = cleanPrice.replace(',', '.');
            const price = parseFloat(cleanPrice) || 0;
            return total + (price * item.quantity);
        }, 0);
    }

    // Calculer le prix unitaire d'un produit
    getItemPrice(item) {
        if (!item || !item.price) return 0;
        
        let cleanPrice = item.price.toString();
        // Supprimer tout sauf les chiffres, points et virgules
        cleanPrice = cleanPrice.replace(/[^\d.,]/g, '');
        
        // Si on a une virgule ET un point, garder le dernier comme séparateur décimal
        if (cleanPrice.includes(',') && cleanPrice.includes('.')) {
            const lastComma = cleanPrice.lastIndexOf(',');
            const lastDot = cleanPrice.lastIndexOf('.');
            if (lastComma > lastDot) {
                // La virgule est après le point, c'est le séparateur décimal
                cleanPrice = cleanPrice.replace(/\./g, '').replace(',', '.');
            } else {
                // Le point est après la virgule, c'est le séparateur décimal
                cleanPrice = cleanPrice.replace(/,/g, '');
            }
        } else {
            // Remplacer la virgule par un point pour parseFloat
            cleanPrice = cleanPrice.replace(',', '.');
        }
        
        const price = parseFloat(cleanPrice);
        return isNaN(price) ? 0 : price;
    }

    // Formater un prix pour l'affichage
    formatPrice(price) {
        return price.toFixed(2).replace('.', ',') + ' €';
    }

    // Obtenir le nombre total d'articles
    getTotalItems() {
        return this.items.reduce((total, item) => total + item.quantity, 0);
    }

    // Mettre à jour l'affichage du panier
    updateCartDisplay() {
        const cartCount = document.querySelector('.cart-count');
        const cartIcon = document.querySelector('.cart-icon');
        
        if (cartCount) {
            const totalItems = this.getTotalItems();
            cartCount.textContent = totalItems;
            cartCount.style.display = totalItems > 0 ? 'block' : 'none';
        }

        // Mettre à jour le panier modal si ouvert
        if (document.querySelector('.cart-modal.active')) {
            this.renderCartModal();
        }
    }

    // Afficher notification d'ajout au panier
    showAddToCartNotification(productTitle, product) {
        const notification = document.createElement('div');
        notification.className = 'cart-notification';
        
        if (product) {
            const unitPrice = this.getItemPrice(product);
            notification.innerHTML = `
                <div class="notification-content">
                    <span class="notification-icon">✓</span>
                    <div class="notification-details">
                        <div class="notification-title">${productTitle} ajouté au panier</div>
                        <div class="notification-price">${this.formatPrice(unitPrice)}</div>
                    </div>
                </div>
            `;
        } else {
            notification.innerHTML = `
                <div class="notification-content">
                    <span class="notification-icon">✓</span>
                    <span class="notification-text">${productTitle} ajouté au panier</span>
                </div>
            `;
        }
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.classList.add('show');
        }, 100);
        
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }

    // Ouvrir le modal du panier
    openCartModal() {
        let modal = document.querySelector('.cart-modal');
        if (!modal) {
            modal = this.createCartModal();
            document.body.appendChild(modal);
        }
        
        this.renderCartModal();
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    // Fermer le modal du panier
    closeCartModal() {
        const modal = document.querySelector('.cart-modal');
        if (modal) {
            modal.classList.remove('active');
            document.body.style.overflow = '';
        }
    }

    // Créer le modal du panier
    createCartModal() {
        const modal = document.createElement('div');
        modal.className = 'cart-modal';
        modal.innerHTML = `
            <div class="cart-modal-overlay"></div>
            <div class="cart-modal-content">
                <div class="cart-modal-header">
                    <h2>Votre Panier</h2>
                    <button class="cart-modal-close">&times;</button>
                </div>
                <div class="cart-modal-body">
                    <!-- Contenu du panier -->
                </div>
                <div class="cart-modal-footer">
                    <div class="cart-total">
                        <span class="total-label">Total: </span>
                        <span class="total-amount">0,00 €</span>
                    </div>
                    <div class="cart-actions">
                        <button class="btn-secondary" onclick="cart.clearCart()">Vider le panier</button>
                        <button class="btn-primary" onclick="cart.proceedToCheckout()">Commander</button>
                    </div>
                </div>
            </div>
        `;
        
        // Event listeners pour le modal
        modal.querySelector('.cart-modal-close').addEventListener('click', () => this.closeCartModal());
        modal.querySelector('.cart-modal-overlay').addEventListener('click', () => this.closeCartModal());
        
        return modal;
    }

    // Rendre le contenu du panier
    renderCartModal() {
        const modalBody = document.querySelector('.cart-modal-body');
        const totalAmount = document.querySelector('.total-amount');
        
        if (!modalBody) return;
        
        if (this.items.length === 0) {
            modalBody.innerHTML = `
                <div class="empty-cart">
                    <p>Votre panier est vide</p>
                    <button class="btn-primary" onclick="cart.closeCartModal(); window.location.href='collections.html'">Découvrir nos collections</button>
                </div>
            `;
        } else {
            modalBody.innerHTML = this.items.map(item => {
                const unitPrice = this.getItemPrice(item);
                const itemTotal = unitPrice * item.quantity;
                return `
                    <div class="cart-item" data-id="${item.id}">
                        <div class="cart-item-image">
                            <img src="${item.image}" alt="${item.title}">
                        </div>
                        <div class="cart-item-details">
                            <h4>${item.title}</h4>
                            <p class="cart-item-price">${this.formatPrice(unitPrice)} × ${item.quantity}</p>
                            <p class="cart-item-total">${this.formatPrice(itemTotal)}</p>
                        </div>
                        <div class="cart-item-quantity">
                            <button class="quantity-btn" onclick="cart.updateQuantity('${item.id}', ${item.quantity - 1})">-</button>
                            <span class="quantity">${item.quantity}</span>
                            <button class="quantity-btn" onclick="cart.updateQuantity('${item.id}', ${item.quantity + 1})">+</button>
                        </div>
                        <button class="remove-item" onclick="cart.removeItem('${item.id}')">&times;</button>
                    </div>
                `;
            }).join('');
        }
        
        if (totalAmount) {
            totalAmount.textContent = this.formatPrice(this.getTotal());
        }
    }

    // Procéder au checkout
    proceedToCheckout() {
        if (this.items.length === 0) {
            alert('Votre panier est vide');
            return;
        }
        
        // Rediriger vers la page de commande
        window.location.href = 'commande.html';
    }

    // Initialiser les event listeners
    initializeEventListeners() {
        // Écouter les clics sur l'icône du panier
        document.addEventListener('click', (e) => {
            if (e.target.closest('.cart-icon')) {
                this.openCartModal();
            }
        });
        
        // Fermer le modal avec Escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeCartModal();
            }
        });
    }
}

// Initialiser le panier
const cart = new ShoppingCart();