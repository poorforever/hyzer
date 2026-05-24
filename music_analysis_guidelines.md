# Critères d'Analyse et Guidelines pour le Modèle de Recommandation Musicale

Ce document regroupe les critères hyperspécifiques pour déterminer si une chanson est un "hit" pour un utilisateur et comment l'agent doit analyser les sons.

## 1. Critères de "Hit" Utilisateur
Un morceau est considéré comme un hit si :
- **Nombre d'écoutes** : >= 10 écoutes (seuil ajustable).
- **Répétitivité** : Écouté en boucle sur une période donnée (ex: 3 jours consécutifs).
- **Engagement** : Durée d'écoute moyenne > 80% de la durée totale.

## 2. Analyse Multi-Domaines (Extraction de Features)

### A. Patterns vs Irrégularités : Matrice d'Auto-Similarité (SSM)
- **Concept** : Comparer un morceau à lui-même dans le temps.
- **Interprétation** : 
    - Blocs diagonaux nets = Structure répétitive (Patterns).
    - Matrice chaotique = Irrégularité.
- **Usage Agent** : Classifier la géométrie des matrices pour matcher les préférences de structure de l'utilisateur.

### B. Sonorité et Timbre : Mel-Spectrogramme
- **Concept** : Représentation visuelle des fréquences adaptée à la perception humaine.
- **Analyse** : Texture du son (kick électronique vs basse acoustique).
- **Usage Agent** : Déterminer l'ADN sonore et la "couleur" des morceaux appréciés.

### C. Notes et Accords : Chromagramme
- **Concept** : Repliement du spectre sur les 12 classes de notes (gamme chromatique).
- **Usage Agent** : Capter la richesse harmonique et les progressions d'accords favorites.

## 3. Architecture du Modèle
- **Foundation Model** : MusicNN ou CLAP pour l'extraction d'embeddings.
- **Embedding** : Vecteur représentant l'ADN profond du morceau.
- **Fine-Tuning (Couche Spécifique)** : Petit réseau de neurones entraîné sur les labels spécifiques de l'utilisateur (ex: "très structuré", "voix irrégulière").

## 4. Skills de l'Agent
- Capacité à traiter les vecteurs d'embedding musicaux.
- Identification des corrélations entre SSM et préférences utilisateur.
- Traduction des critères numériques en recommandations qualitatives.
