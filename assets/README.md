# Assets - Zaza A Paris

Ce dossier contient tous les médias (photos et vidéos) pour le site web de Zaza A Paris.

## Structure des dossiers

### 📸 Images (`/images/`)

#### `/images/hero/`
- **Usage** : Image principale de la section hero
- **Format recommandé** : JPG/PNG haute résolution (1920x1080 minimum)
- **Poids** : Optimisé pour le web (< 500KB)
- **Exemple** : `hero-main.jpg`, `hero-background.jpg`

#### `/images/collections/`
- **Usage** : Images des différentes collections (Éternité, Lumière, Élégance)
- **Format recommandé** : JPG/PNG (800x600 minimum)
- **Poids** : < 300KB par image
- **Nommage** : `collection-eternite.jpg`, `collection-lumiere.jpg`, `collection-elegance.jpg`

#### `/images/products/`
- **Usage** : Photos individuelles des bijoux
- **Format recommandé** : JPG/PNG haute qualité (600x600 minimum, format carré préféré)
- **Poids** : < 200KB par image
- **Nommage** : `product-[nom-produit].jpg`
- **Exemples** :
  - `product-bague-solitaire-diamant.jpg`
  - `product-collier-perles-akoya.jpg`
  - `product-bracelet-or-rose.jpg`
  - `product-boucles-oreilles-emeraude.jpg`

#### `/images/blog/`
- **Usage** : Images d'illustration pour les articles de blog
- **Format recommandé** : JPG/PNG (800x500 minimum)
- **Poids** : < 250KB par image
- **Nommage** : `blog-[titre-article].jpg`
- **Exemples** :
  - `blog-collection-automne-2024.jpg`
  - `blog-tendances-hiver.jpg`
  - `blog-atelier-sertissage.jpg`
  - `blog-evenement-vendome.jpg`

### 🎥 Vidéos (`/videos/`)

#### `/videos/presentations/`
- **Usage** : Vidéos de présentation des collections, savoir-faire
- **Format recommandé** : MP4 (H.264)
- **Résolution** : 1080p maximum
- **Durée** : 30 secondes à 2 minutes
- **Poids** : < 10MB par vidéo
- **Exemples** :
  - `presentation-collection-automne.mp4`
  - `savoir-faire-sertissage.mp4`
  - `atelier-joaillerie.mp4`

## Recommandations techniques

### Optimisation des images
- **Compression** : Utilisez des outils comme TinyPNG ou ImageOptim
- **Format** : JPG pour les photos, PNG pour les images avec transparence
- **Responsive** : Prévoyez plusieurs tailles si nécessaire

### Qualité photographique
- **Éclairage** : Lumière naturelle ou éclairage professionnel
- **Fond** : Fond neutre (blanc, gris clair) pour mettre en valeur les bijoux
- **Netteté** : Images parfaitement nettes, focus sur les détails
- **Couleurs** : Fidélité des couleurs, post-traitement professionnel

### Nommage des fichiers
- **Convention** : Utilisez des tirets (-) plutôt que des espaces
- **Langue** : Noms en français, sans accents
- **Descriptif** : Noms explicites et cohérents

## Intégration dans le site

Pour utiliser ces médias dans le site :

1. **Remplacez les placeholders** dans le HTML :
   ```html
   <!-- Remplacer -->
   <div class="placeholder-image">Image Principale</div>
   
   <!-- Par -->
   <img src="assets/images/hero/hero-main.jpg" alt="Bijoux Zaza A Paris">
   ```

2. **Mettez à jour le CSS** pour les images de fond :
   ```css
   .hero-background {
       background-image: url('../assets/images/hero/hero-background.jpg');
   }
   ```

3. **Optimisez le chargement** avec le lazy loading déjà implémenté

## Structure finale recommandée

```
assets/
├── images/
│   ├── hero/
│   │   ├── hero-main.jpg
│   │   └── hero-background.jpg
│   ├── collections/
│   │   ├── collection-eternite.jpg
│   │   ├── collection-lumiere.jpg
│   │   └── collection-elegance.jpg
│   ├── products/
│   │   ├── product-bague-solitaire-diamant.jpg
│   │   ├── product-collier-perles-akoya.jpg
│   │   ├── product-bracelet-or-rose.jpg
│   │   └── product-boucles-oreilles-emeraude.jpg
│   └── blog/
│       ├── blog-collection-automne-2024.jpg
│       ├── blog-tendances-hiver.jpg
│       ├── blog-atelier-sertissage.jpg
│       └── blog-evenement-vendome.jpg
└── videos/
    └── presentations/
        ├── presentation-collection-automne.mp4
        ├── savoir-faire-sertissage.mp4
        └── atelier-joaillerie.mp4
```

---

*Ce fichier sera mis à jour au fur et à mesure de l'ajout de nouveaux médias.*