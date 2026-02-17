# 💰 Monely - Gestionnaire de Finances Personnel

Application web moderne de gestion financière personnelle avec intelligence artificielle intégrée. Monely vous aide à suivre vos revenus, dépenses, portefeuilles et objectifs d'épargne avec des insights personnalisés.

![Monely Dashboard](/.github/screenshots/dashboard.png)

## 🚀 Fonctionnalités

### ✅ Implémentées (v1.0)

- **📊 Dashboard** - Vue d'ensemble complète de vos finances
  - 4 cartes statistiques clés (Solde, Revenus, Dépenses, Budget)
  - Graphiques interactifs (flux de trésorerie, répartition)
  - Insights IA personnalisés
  - Liste des transactions récentes

- **💰 Gestion des Revenus**
  - Suivi des sources de revenus (Salaire, Freelance, Investissements)
  - Graphiques d'évolution mensuelle
  - Objectifs annuels avec progression
  - Historique complet filtrable

- **💳 Gestion des Dépenses**
  - Répartition par catégories (Shopping, Nourriture, Factures, etc.)
  - Alertes de dépassement de budget
  - Barres de progression par catégorie
  - Filtres avancés (période, catégorie)

- **🏦 Portefeuilles**
  - Gestion multi-comptes (Courant, Épargne, Crédit)
  - Cartes de comptes visuelles
  - Objectifs d'épargne avec barres de progression
  - Vue consolidée du patrimoine

- **📈 Analytiques Avancées**
  - Évolution du patrimoine
  - Tendances mensuelles détaillées
  - Score de santé financière
  - Conseils personnalisés
  - ROI des investissements

- **⚙️ Paramètres**
  - Gestion du profil utilisateur
  - Préférences (Thème, Langue, Devise)
  - Notifications configurables
  - Sécurité (2FA, gestion des appareils)
  - Export de données

### 🔜 À Venir (v2.0)

- 🤖 **Intégration complète Gemini AI** pour insights avancés
- 🔐 **Authentification** (OAuth2, JWT)
- 🌐 **API REST complète** (Django)
- 💾 **Persistance des données** (Supabase)
- 🌙 **Mode sombre**
- 📱 **Application mobile** (React Native)
- 📄 **Export PDF/CSV**
- 🔔 **Notifications temps réel**
- 🌍 **Multi-devises**

## 🏗️ Architecture du Projet

```
Monely/
├── web/                    # Frontend (React + Vite + TypeScript)
│   ├── src/
│   │   ├── components/     # Composants réutilisables
│   │   │   ├── layout/     # Sidebar, Header, MobileNav
│   │   │   └── ui/         # StatCard, Charts, TransactionItem
│   │   ├── pages/          # Pages de l'application
│   │   │   ├── Dashboard.tsx
│   │   │   ├── Income.tsx
│   │   │   ├── Expenses.tsx
│   │   │   ├── Wallets.tsx
│   │   │   ├── Analytics.tsx
│   │   │   └── Settings.tsx
│   │   ├── services/       # Services et API
│   │   │   └── mockData.ts
│   │   ├── types/          # Types TypeScript
│   │   ├── App.tsx         # Composant racine
│   │   ├── main.tsx        # Point d'entrée
│   │   └── index.css       # Styles globaux
│   ├── public/             # Assets statiques
│   ├── package.json
│   ├── tsconfig.json
│   ├── vite.config.ts
│   └── tailwind.config.js
│
├── server/                 # Backend (Django REST API) - À VENIR
│   ├── api/                # Endpoints API
│   ├── models/             # Modèles de données
│   ├── serializers/        # Serializers DRF
│   ├── views/              # Vues API
│   ├── services/           # Logique métier
│   ├── config/             # Configuration Django
│   ├── requirements.txt
│   └── manage.py
│
└── maquette/              # Prototype initial (référence)
```

## 🛠️ Stack Technique

### Frontend (Actuel)

| Technologie | Version | Utilisation |
|------------|---------|-------------|
| React | 19.2.4 | Framework UI |
| Vite | 7.3.1 | Build tool |
| TypeScript | 5.8.2 | Typage statique |
| Tailwind CSS | 3.x | Styling |
| Recharts | 3.7.0 | Graphiques |
| Material Icons | Latest | Icônes |

### Backend (Planifié)

| Technologie | Version | Utilisation |
|------------|---------|-------------|
| Python | 3.11+ | Langage backend |
| Django | 5.x | Framework web |
| Django REST Framework | 3.15+ | API REST |
| Supabase | Latest | Base de données PostgreSQL |
| Gemini AI | Latest | Insights financiers |
| JWT | Latest | Authentification |

## 📦 Installation

### Prérequis

- **Node.js** >= 18.0.0
- **npm** >= 9.0.0
- **Python** >= 3.11 (pour le backend - à venir)
- **Git**

### Frontend

```bash
# 1. Cloner le dépôt
git clone https://github.com/7Bhil/Monely-test.git
cd Monely-test

# 2. Aller dans le dossier web
cd web

# 3. Installer les dépendances
npm install

# 4. Lancer le serveur de développement
npm run dev

# L'application sera disponible sur http://localhost:5173
```

### Backend (À venir)

```bash
# 1. Aller dans le dossier server
cd server

# 2. Créer un environnement virtuel Python
python -m venv venv
source venv/bin/activate  # Linux/Mac
# ou
venv\Scripts\activate     # Windows

# 3. Installer les dépendances
pip install -r requirements.txt

# 4. Configuration Supabase
# Créer un fichier .env avec :
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_key
GEMINI_API_KEY=your_gemini_api_key
SECRET_KEY=your_django_secret_key

# 5. Migrations
python manage.py migrate

# 6. Lancer le serveur Django
python manage.py runserver

# L'API sera disponible sur http://localhost:8000
```

## 🚀 Scripts Disponibles

### Frontend

```bash
# Développement
npm run dev          # Lance Vite en mode dev (HMR)

# Production
npm run build        # Compile pour production
npm run preview      # Prévisualise le build

# Qualité du code
npm run lint         # Linter (si configuré)
tsc -b              # Vérification TypeScript
```

### Backend (À venir)

```bash
# Développement
python manage.py runserver     # Lance Django en dev

# Base de données
python manage.py makemigrations  # Créer migrations
python manage.py migrate         # Appliquer migrations

# Tests
python manage.py test           # Lancer les tests

# Utilitaires
python manage.py createsuperuser  # Créer admin
python manage.py shell           # Shell Django
```

## 📁 Structure des Composants

### Layout Components

- **Sidebar** - Navigation principale (desktop)
- **Header** - Barre de recherche et notifications
- **MobileNav** - Navigation mobile (bottom bar)

### UI Components

- **StatCard** - Cartes de statistiques avec graphiques
- **Charts** - Composants graphiques (Bar, Pie, Area)
- **TransactionItem** - Affichage d'une transaction

### Pages

Chaque page suit le même pattern :
1. En-tête avec titre et CTA
2. Cartes de statistiques
3. Graphiques et visualisations
4. Listes de données avec filtres

## 🎨 Design System

### Couleurs Principales

- **Primaire** : `#1919e6` (Bleu)
- **Succès** : `#10b981` (Vert)
- **Alerte** : `#f97316` (Orange)
- **Danger** : `#ef4444` (Rouge)
- **Neutre** : `#64748b` (Gris)

### Typographie

- **Police** : System Font Stack
- **Tailles** : text-xs (10px) → text-2xl (24px)
- **Poids** : font-medium (500), font-semibold (600), font-bold (700)

### Espacements

- **Cards** : `p-6` (24px padding)
- **Gaps** : `gap-4` (16px), `gap-6` (24px)
- **Border Radius** : `rounded-xl` (12px), `rounded-3xl` (24px)

## 🔌 API Endpoints (Planifiés)

### Authentification

```
POST   /api/auth/register      # Inscription
POST   /api/auth/login         # Connexion
POST   /api/auth/refresh       # Rafraîchir token
POST   /api/auth/logout        # Déconnexion
```

### Transactions

```
GET    /api/transactions       # Liste des transactions
POST   /api/transactions       # Créer une transaction
GET    /api/transactions/:id   # Détails d'une transaction
PUT    /api/transactions/:id   # Modifier une transaction
DELETE /api/transactions/:id   # Supprimer une transaction
```

### Comptes

```
GET    /api/wallets            # Liste des comptes
POST   /api/wallets            # Créer un compte
GET    /api/wallets/:id        # Détails d'un compte
PUT    /api/wallets/:id        # Modifier un compte
DELETE /api/wallets/:id        # Supprimer un compte
```

### Analytiques

```
GET    /api/analytics/dashboard     # Données du dashboard
GET    /api/analytics/trends        # Tendances mensuelles
GET    /api/analytics/categories    # Répartition par catégorie
```

### IA

```
POST   /api/ai/insights        # Générer des insights
POST   /api/ai/predictions     # Prédictions financières
```

## 🗄️ Modèles de Données (Supabase)

### User
```typescript
{
  id: uuid
  email: string
  name: string
  avatar_url: string
  currency: string
  language: string
  created_at: timestamp
}
```

### Transaction
```typescript
{
  id: uuid
  user_id: uuid (FK)
  wallet_id: uuid (FK)
  name: string
  amount: decimal
  category: string
  type: 'income' | 'expense'
  status: 'pending' | 'completed'
  date: timestamp
  icon: string
  created_at: timestamp
}
```

### Wallet
```typescript
{
  id: uuid
  user_id: uuid (FK)
  name: string
  type: 'checking' | 'savings' | 'credit'
  balance: decimal
  currency: string
  color: string
  icon: string
  created_at: timestamp
}
```

### SavingGoal
```typescript
{
  id: uuid
  user_id: uuid (FK)
  name: string
  target_amount: decimal
  current_amount: decimal
  deadline: date
  color: string
  created_at: timestamp
}
```

## 🤝 Contribution

Les contributions sont les bienvenues ! Pour contribuer :

1. **Fork** le projet
2. Créer une branche (`git checkout -b feature/AmazingFeature`)
3. Commit vos changements (`git commit -m 'Add AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une **Pull Request**

### Guidelines

- Respecter les conventions de code (ESLint, Prettier)
- Écrire des tests pour les nouvelles fonctionnalités
- Documenter les changements importants
- Utiliser des messages de commit clairs

## 🐛 Bugs Connus

Aucun bug critique connu pour le moment. Si vous rencontrez un problème :

1. Vérifier les [Issues existantes](https://github.com/7Bhil/Monely-test/issues)
2. Créer une nouvelle issue avec :
   - Description du problème
   - Étapes pour reproduire
   - Comportement attendu vs actuel
   - Captures d'écran si pertinent

## 📝 Changelog

### v1.0.0 (Février 2026)

- ✅ Interface frontend complète (6 pages)
- ✅ Navigation fluide
- ✅ Graphiques interactifs (Recharts)
- ✅ Design responsive
- ✅ Données mockées pour démonstration

### v0.1.0 (Janvier 2026)

- 🎨 Prototype initial (maquette)
- 🧪 Proof of concept

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier [LICENSE](LICENSE) pour plus de détails.

## 👥 Auteurs

- **Bhil** - [GitHub](https://github.com/7Bhil)

## 🙏 Remerciements

- [Recharts](https://recharts.org/) pour les graphiques
- [Tailwind CSS](https://tailwindcss.com/) pour le styling
- [Material Icons](https://fonts.google.com/icons) pour les icônes
- [Supabase](https://supabase.com/) pour la base de données
- [Google Gemini](https://ai.google.dev/) pour l'IA

## 📞 Support

Pour toute question ou problème :

- 📧 Email : support@monely.app
- 💬 Discord : [Rejoindre le serveur](https://discord.gg/monely)
- 🐦 Twitter : [@MonelyApp](https://twitter.com/MonelyApp)

---

<div align="center">

**Fait avec ❤️ par l'équipe Monely**

[Site Web](https://monely.app) • [Documentation](https://docs.monely.app) • [Démo](https://demo.monely.app)

</div>
