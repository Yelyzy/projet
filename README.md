# Trois cent 60

Site éditorial consacré à la ville de Fribourg. Le projet comprend une page
d’accueil et une page d’article, compilées avec Parcel.

## Prérequis

- Node.js
- npm

## Installation

```sh
npm install
```

## Commandes

Lancer le serveur de développement pour les deux pages :

```sh
npm run dev
```

Créer les versions de production dans `dist/` :

```sh
npm run build
```

Supprimer les fichiers compilés ou le cache Parcel :

```sh
npm run clean:output
npm run clean:cache
```

## Organisation

- `src/index.html` : page d’accueil
- `src/article.html` : page d’article
- `src/components/` : composants HTML partagés et propres aux pages
- `src/scss/` : styles globaux et styles par composant
- `src/js/main.js` : interactions de navigation, FAQ, cartes et vidéos
- `src/assets/`, `src/font/`, `src/img/`, `src/vid/` : ressources du site
