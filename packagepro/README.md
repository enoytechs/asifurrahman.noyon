# 📦 PackagePro — Packaging Company Management System

A complete React frontend for managing a packaging production company.
Includes Job Orders, Pipeline Management, Staff Earnings, Stock, Finance, Client Portal and more.

---

## 🚀 Run Locally (Development)

### Step 1 — Make sure Node.js is installed
Download from: https://nodejs.org (version 16 or higher)

Check if installed:
```bash
node --version
npm --version
```

### Step 2 — Install dependencies
```bash
npm install
```

### Step 3 — Start the app
```bash
npm start
```
App opens at: **http://localhost:3000**

---

## 🏗️ Build for Production
```bash
npm run build
```
Creates an optimized `build/` folder ready to deploy anywhere.

---

## 🌍 Deploy to Firebase Hosting (Free)

### Step 1 — Install Firebase CLI
```bash
npm install -g firebase-tools
```

### Step 2 — Login to Firebase
```bash
firebase login
```

### Step 3 — Initialize hosting
```bash
firebase init hosting
```
Answer the prompts:
- Public directory → **build**
- Single page app? → **Yes**
- Overwrite index.html? → **No**

### Step 4 — Build & Deploy
```bash
npm run build
firebase deploy
```

Your app will be live at: **https://YOUR-PROJECT-ID.web.app**

---

## 🌍 Deploy to Vercel (Even Easier — Free)

```bash
npm install -g vercel
vercel
```
Follow the prompts. Done in 30 seconds!

---

## 🌍 Deploy to Netlify (Drag & Drop)

1. Run `npm run build`
2. Go to https://netlify.com
3. Drag the `build/` folder onto the Netlify dashboard
4. Your app is live instantly!

---

## 📁 Project Structure

```
packagepro/
├── public/
│   └── index.html          ← HTML shell
├── src/
│   ├── index.js            ← React entry point
│   └── App.jsx             ← Complete app (all 12 screens)
├── package.json
├── .gitignore
└── README.md
```

---

## 📱 Screens Included

| Screen | Description |
|--------|-------------|
| Dashboard | Live production board, stats, alerts |
| Job Orders | Create & manage jobs with pipeline builder |
| Pipeline View | Kanban board — all jobs by stage |
| Production | Operator assignments & active stages |
| Clients | Client profiles & detail panel |
| Staff & Earnings | Auto-calculated monthly earnings |
| Stock & Material | Inventory with low stock alerts |
| Finance & Invoice | Invoices, payments, expenses, salary |
| Reports | Charts, client performance, analytics |
| Operator Dashboard | Individual operator stage completion view |
| Client Portal | What clients see — order tracking & invoices |
| Settings | Stage library, company config |

---

## 🔌 Connect to Firebase Backend

See `PackagePro_Firebase.jsx` for complete Firebase integration guide including:
- Firestore database schema
- Auth with 5 user roles
- Realtime listeners
- Security rules
- Seed data script
- Deploy instructions

---

## 🛠️ Tech Stack

- **React 18** — UI framework
- **Inline styles** — No CSS files needed, zero dependencies
- **Mock data** — All data hardcoded, ready to swap with Firebase

---

Made with ❤️ for PackagePro Industries
