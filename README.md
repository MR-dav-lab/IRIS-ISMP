# IRIS — Plateforme Documentaire ISMP

> **I**nstitut Supérieur de Management Public — Portail de Rédaction Administrative

---

## Description

IRIS est une application web React permettant aux secrétaires et agents
de l'ISMP d'accéder aux modèles officiels de documents administratifs
camerounais, de les copier fidèlement dans Word, et d'enrichir la base
documentaire via upload de PDFs scannés.

---

## Architecture (principes SOLID)

```
iris-ismp/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── layout/          # Composants de mise en page globale
│   │   │   ├── AppHeader.jsx
│   │   │   └── AppLayout.jsx
│   │   ├── home/            # Page d'accueil
│   │   │   ├── HomePage.jsx
│   │   │   └── DivisionCard.jsx
│   │   ├── redaction/       # Module Direction Générale
│   │   │   ├── RedactionModule.jsx   # Orchestrateur (SRP)
│   │   │   ├── DocSidebar.jsx        # Navigation docs (SRP)
│   │   │   ├── DocViewer.jsx         # Affichage modèle (SRP)
│   │   │   ├── DocToolbar.jsx        # Actions sur le doc (SRP)
│   │   │   ├── LogoSlot.jsx          # Zone logo configurable (OCP)
│   │   │   ├── UploadModal.jsx       # Upload PDF (SRP)
│   │   │   └── CategoryManager.jsx   # Gestion catégories (OCP)
│   │   └── shared/          # Composants réutilisables
│   │       ├── Toast.jsx
│   │       ├── WipPage.jsx
│   │       └── Modal.jsx
│   ├── data/
│   │   ├── documents.json   # BASE PRINCIPALE — modèles de documents
│   │   ├── divisions.json   # Définition des 5 divisions ISMP
│   │   └── categories.json  # Catégories extensibles
│   ├── hooks/               # Logique métier réutilisable
│   │   ├── useDocuments.js  # CRUD documents + catégories
│   │   ├── useCopyToClipboard.js
│   │   └── useLogoSlot.js
│   ├── services/            # Couche service (LSP / DIP)
│   │   ├── DocumentService.js   # Interface abstraite
│   │   ├── LocalDocumentService.js
│   │   └── PdfParserService.js
│   ├── types/               # Contrats de données (ISP)
│   │   └── index.js
│   ├── utils/
│   │   └── copyUtils.js
│   └── App.jsx              # Racine + routing léger
├── .gitignore
├── package.json
└── README.md
```

---

## Principes SOLID appliqués

| Principe | Application |
|---|---|
| **S** — Single Responsibility | Chaque composant a une seule raison de changer (Sidebar, Viewer, Toolbar séparés) |
| **O** — Open/Closed | Catégories et divisions extensibles via JSON sans modifier le code |
| **L** — Liskov Substitution | `LocalDocumentService` remplaçable par `ApiDocumentService` sans changer les consommateurs |
| **I** — Interface Segregation | Hooks séparés par domaine (`useDocuments`, `useCopyToClipboard`, `useLogoSlot`) |
| **D** — Dependency Inversion | Composants dépendent d'interfaces de service, pas d'implémentations concrètes |

---

## Stack technique

- **React 18** + Vite
- **CSS Variables** (pas de framework CSS externe)
- **Stockage** : `documents.json` (source de vérité locale, évolutif vers API)
- **Git** : branching feature/ par module

## Lancer le projet

```bash
npm install
npm run dev
```

## Branches Git prévues

```
main          — production stable
develop       — intégration
feature/dg-redaction      — Module Direction Générale ✅
feature/dso               — Module DSO (à venir)
feature/dinep             — Module DINEP (à venir)
feature/dfsr              — Module DFSR (à venir)
feature/daf               — Module DAF (à venir)
```
