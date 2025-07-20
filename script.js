// Navigation handling for multi-page architecture
function handleNavigation() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.nav-menu a');
    
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        
        // Handle internal page links
        if (href && !href.startsWith('#') && !href.startsWith('http')) {
            const linkPage = href.split('/').pop();
            if (linkPage === currentPage || 
                (currentPage === 'index.html' && linkPage === 'accueil.html') ||
                (currentPage === '' && linkPage === 'accueil.html')) {
                link.classList.add('active');
            }
        }
    });
}

// Load featured products for homepage
function loadFeaturedProducts() {
    fetch('products_for_trae.json')
        .then(response => response.json())
        .then(data => {
            // Select 4 featured products (first 4 from the collection)
            const featuredProducts = data.products.slice(0, 4);
            const container = document.getElementById('featured-products-container');
            
            container.innerHTML = featuredProducts.map((product, index) => {
                const badges = ['Exclusif', 'Nouveauté', 'Tendance', 'Signature'];
                const badgeClasses = ['exclusive', 'new', 'trending', 'signature'];
                
                return `
                    <div class="featured-product-card" data-product-id="${product.id}">
                        <div class="featured-product-image">
                            <img src="${product.images[0]}" alt="${product.title}" class="featured-product-img">
                            <div class="featured-product-overlay">
                                <div class="featured-product-badge ${badgeClasses[index]}">${badges[index]}</div>
                                <div class="featured-product-actions">
                                    <button class="quick-view-btn" onclick="openProductModal('${product.id}')">
                                        <svg viewBox="0 0 24 24" width="20" height="20">
                                            <path fill="currentColor" d="M12,9A3,3 0 0,0 9,12A3,3 0 0,0 12,15A3,3 0 0,0 15,12A3,3 0 0,0 12,9M12,17A5,5 0 0,1 7,12A5,5 0 0,1 12,7A5,5 0 0,1 17,12A5,5 0 0,1 12,17M12,4.5C7,4.5 2.73,7.61 1,12C2.73,16.39 7,19.5 12,19.5C17,19.5 21.27,16.39 23,12C21.27,7.61 17,4.5 12,4.5Z"/>
                                        </svg>
                                        Aperçu
                                    </button>
                                    <button class="add-to-cart-btn" onclick="addToCartFromFeatured('${product.id}')">
                                        <svg viewBox="0 0 24 24" width="20" height="20">
                                            <path fill="currentColor" d="M19,7H15V6A3,3 0 0,0 12,3A3,3 0 0,0 9,6V7H5A1,1 0 0,0 4,8V19A3,3 0 0,0 7,22H17A3,3 0 0,0 20,19V8A1,1 0 0,0 19,7M9,6A1,1 0 0,1 10,5H14A1,1 0 0,1 15,6V7H9V6M18,19A1,1 0 0,1 17,20H7A1,1 0 0,1 6,19V9H8V10A1,1 0 0,0 9,11A1,1 0 0,0 10,10V9H14V10A1,1 0 0,0 15,11A1,1 0 0,0 16,10V9H18V19Z"/>
                                        </svg>
                                        Ajouter
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div class="featured-product-info">
                            <h3>${product.title}</h3>
                            <p class="featured-product-description">${product.description}</p>
                            <div class="featured-product-price">${product.price}</div>
                        </div>
                    </div>
                `;
            }).join('');
        })
        .catch(error => {
            console.error('Error loading featured products:', error);
            // Fallback content
            document.getElementById('featured-products-container').innerHTML = `
                <div class="error-message">
                    <p>Impossible de charger les produits pour le moment.</p>
                    <a href="collections.html" class="cta-button">Voir la collection</a>
                </div>
            `;
        });
}

// Open product modal (placeholder function)
function openProductModal(productId) {
    // This would open a detailed product modal
    console.log('Opening product modal for:', productId);
    // For now, redirect to collections page
    window.location.href = 'collections.html';
}

// Add to cart function for featured products
function addToCartFromFeatured(productId) {
    fetch('products_for_trae.json')
        .then(response => response.json())
        .then(data => {
            const product = data.products.find(p => p.id === productId);
            if (product && typeof cart !== 'undefined') {
                cart.addToCart(product);
            } else {
                console.error('Product not found or cart not available');
            }
        })
        .catch(error => {
            console.error('Error adding product to cart:', error);
        });
}

// Smooth scrolling pour les liens de navigation
document.addEventListener('DOMContentLoaded', function() {
    // Initialize navigation on page load
    handleNavigation();
    
    // Load featured products on homepage
    if (document.getElementById('featured-products-container')) {
        loadFeaturedProducts();
    }
    
    // Navigation smooth scroll
    const navLinks = document.querySelectorAll('.nav-menu a[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 80; // Account for fixed navbar
                
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Header stays transparent at all times - no scroll logic needed
    // Removed dynamic navbar background on scroll to keep header always transparent

    // Hide scroll indicator when scrolling
    window.addEventListener('scroll', () => {
        const scrollIndicator = document.querySelector('.hero-scroll-indicator');
        if (scrollIndicator) {
            if (window.scrollY > 50) {
                scrollIndicator.style.opacity = '0';
                scrollIndicator.style.transform = 'translateX(-50%) translateY(20px)';
            } else {
                scrollIndicator.style.opacity = '1';
                scrollIndicator.style.transform = 'translateX(-50%) translateY(0)';
            }
        }
    });
    
    // Intersection Observer pour les animations au scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observer les éléments à animer
    const animatedElements = document.querySelectorAll('.collection-item, .product-card, .blog-post, .about-text, .contact-info');
    
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
        observer.observe(el);
    });
    
    // Parallax effect pour le hero - DISABLED to fix navbar transparency
    // const hero = document.querySelector('.hero');
    // 
    // window.addEventListener('scroll', function() {
    //     const scrolled = window.pageYOffset;
    //     const rate = scrolled * -0.5;
    //     
    //     if (hero) {
    //         hero.style.transform = `translateY(${rate}px)`;
    //     }
    // });
    
    // Hover effects pour les cartes produits
    const productCards = document.querySelectorAll('.product-card');
    
    productCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
    
    // Collection items hover effects
    const collectionItems = document.querySelectorAll('.collection-item');
    
    collectionItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-15px)';
            this.style.boxShadow = '0 20px 60px rgba(0, 0, 0, 0.15)';
        });
        
        item.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.05)';
        });
    });
    
    // Blog posts hover effects
    const blogPosts = document.querySelectorAll('.blog-post');
    
    blogPosts.forEach(post => {
        post.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-12px)';
            this.style.boxShadow = '0 25px 70px rgba(0, 0, 0, 0.15)';
        });
        
        post.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.05)';
        });
        
        // Click effect for blog posts
        post.addEventListener('click', function() {
            const readMoreLink = this.querySelector('.read-more');
            if (readMoreLink) {
                // Animation de clic
                this.style.transform = 'scale(0.98)';
                setTimeout(() => {
                    this.style.transform = 'translateY(-12px)';
                    // Ici vous pourriez rediriger vers l'article complet
                    console.log('Ouverture de l\'article:', this.querySelector('h3').textContent);
                }, 150);
            }
        });
    });
    
    // Form validation et animation
    const contactForm = document.querySelector('.contact-form form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Animation de soumission
            const submitButton = this.querySelector('button[type="submit"]');
            const originalText = submitButton.textContent;
            
            submitButton.textContent = 'Envoi en cours...';
            submitButton.style.background = 'var(--secondary-color)';
            submitButton.disabled = true;
            
            // Simulation d'envoi
            setTimeout(() => {
                submitButton.textContent = 'Message envoyé !';
                submitButton.style.background = '#28a745';
                
                setTimeout(() => {
                    submitButton.textContent = originalText;
                    submitButton.style.background = 'var(--primary-color)';
                    submitButton.disabled = false;
                    this.reset();
                }, 2000);
            }, 1500);
        });
    }
    
    // Search icon functionality
    const searchIcon = document.querySelector('.search-icon');
    
    if (searchIcon) {
        searchIcon.addEventListener('click', function() {
            // Animation de recherche
            this.style.transform = 'scale(1.2)';
            setTimeout(() => {
                this.style.transform = 'scale(1)';
            }, 200);
            
            // Ici vous pourriez ajouter une modal de recherche
            console.log('Recherche activée');
        });
    }
    
    // Cart icon functionality
    const cartIcon = document.querySelector('.cart-icon');
    
    if (cartIcon) {
        cartIcon.addEventListener('click', function() {
            // Animation du panier
            this.style.transform = 'scale(1.2)';
            setTimeout(() => {
                this.style.transform = 'scale(1)';
            }, 200);
            
            // Ici vous pourriez ajouter une modal de panier
            console.log('Panier ouvert');
        });
    }
    
    // CTA Button dans le hero
    const ctaButton = document.querySelector('.hero .cta-button');
    
    if (ctaButton) {
        ctaButton.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Scroll vers les collections
            const collectionsSection = document.querySelector('#collections');
            if (collectionsSection) {
                const offsetTop = collectionsSection.offsetTop - 80;
                
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    }
    
    // Hero scroll indicator functionality
    const scrollIndicator = document.querySelector('.hero-scroll-indicator');
    if (scrollIndicator) {
        scrollIndicator.addEventListener('click', () => {
            const collectionsSection = document.querySelector('#collections');
            if (collectionsSection) {
                collectionsSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    }
    
    // Blog CTA Button
    const blogCtaButton = document.querySelector('.blog-cta .secondary-button');
    
    if (blogCtaButton) {
        blogCtaButton.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Animation du bouton
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = 'scale(1)';
                // Ici vous pourriez rediriger vers la page blog complète
                console.log('Redirection vers tous les articles');
            }, 150);
        });
    }
    
    // Read more links
    const readMoreLinks = document.querySelectorAll('.read-more');
    
    readMoreLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            // Animation du lien
            this.style.transform = 'scale(1.05)';
            setTimeout(() => {
                this.style.transform = 'scale(1)';
                // Ici vous pourriez rediriger vers l'article complet
                console.log('Lecture de l\'article:', this.closest('.blog-post').querySelector('h3').textContent);
            }, 150);
        });
    });
    
    // Lazy loading pour les images (quand elles seront ajoutées)
    const lazyImages = document.querySelectorAll('.placeholder-image');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Ici vous pourriez charger les vraies images
                entry.target.style.background = 'linear-gradient(135deg, #f8f8f8 0%, #e0e0e0 100%)';
                observer.unobserve(entry.target);
            }
        });
    });
    
    lazyImages.forEach(img => imageObserver.observe(img));
    
    // Responsive menu toggle (pour mobile)
    const createMobileMenu = () => {
        const navContainer = document.querySelector('.nav-container');
        const navMenu = document.querySelector('.nav-menu');
        
        // Créer le bouton hamburger
        const hamburger = document.createElement('div');
        hamburger.className = 'hamburger';
        hamburger.innerHTML = '☰';
        hamburger.style.display = 'none';
        hamburger.style.fontSize = '1.5rem';
        hamburger.style.cursor = 'pointer';
        hamburger.style.color = 'var(--primary-color)';
        
        navContainer.insertBefore(hamburger, document.querySelector('.nav-icons'));
        
        // Toggle menu mobile
        hamburger.addEventListener('click', () => {
            navMenu.classList.toggle('mobile-active');
        });
        
        // Responsive behavior
        const checkScreenSize = () => {
            if (window.innerWidth <= 768) {
                hamburger.style.display = 'block';
                navMenu.style.display = 'none';
            } else {
                hamburger.style.display = 'none';
                navMenu.style.display = 'flex';
                navMenu.classList.remove('mobile-active');
            }
        };
        
        window.addEventListener('resize', checkScreenSize);
        checkScreenSize();
    };
    
    createMobileMenu();
    
    // Performance optimization: Debounce scroll events
    let ticking = false;
    
    function updateOnScroll() {
        // Navbar background update
        const navbar = document.querySelector('.navbar');
        if (window.scrollY > 50) {
            navbar.style.background = 'rgba(255, 255, 255, 0.98)';
            navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
        } else {
            navbar.style.background = 'rgba(255, 255, 255, 0.95)';
            navbar.style.boxShadow = 'none';
        }
        
        ticking = false;
    }
    
    function requestTick() {
        if (!ticking) {
            requestAnimationFrame(updateOnScroll);
            ticking = true;
        }
    }
    
    window.addEventListener('scroll', requestTick);
});

// CSS pour le menu mobile
const mobileMenuStyles = `
    @media (max-width: 768px) {
        .nav-menu.mobile-active {
            display: flex !important;
            position: absolute;
            top: 100%;
            left: 0;
            right: 0;
            background: rgba(255, 255, 255, 0.98);
            backdrop-filter: blur(20px);
            flex-direction: column;
            padding: 2rem;
            box-shadow: 0 8px 40px rgba(0, 0, 0, 0.1);
            gap: 1.5rem;
        }
        
        .hamburger {
            transition: transform 0.3s ease;
        }
        
        .hamburger:hover {
            transform: scale(1.1);
        }
    }
`;

// Ajouter les styles mobile au document
const styleSheet = document.createElement('style');
styleSheet.textContent = mobileMenuStyles;
document.head.appendChild(styleSheet);