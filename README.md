# Virtual Outfit Planner + Wardrobe Manager

A production-level React application that helps users manage their wardrobe, create outfit combinations, plan outfits on a calendar, and receive AI-powered outfit suggestions.

## 🧠 Problem Statement

People often:
- Struggle to decide what to wear daily
- Repeat outfits unintentionally
- Underutilize their wardrobe
- Waste time planning outfits

This app solves these problems by digitizing wardrobes, enabling mix-and-match outfit creation, calendar-based planning, and intelligent AI suggestions.

## 🚀 Features

### Core Features
- **📸 Upload Clothes** — Add clothing items with images, category, color, occasion, season, and cost
- **👕 Mix & Match Outfits** — Combine clothes into outfits with color harmony scoring
- **📅 Calendar Planner** — Assign outfits to specific dates with weekly/monthly view
- **🤖 AI Outfit Suggestions** — Rule-based engine recommending outfits based on color compatibility, occasion, season, and wear history

### Advanced Features
- **🔁 Outfit Repetition Tracker** — Alerts when outfits are worn too frequently
- **📊 Wardrobe Analytics** — Most/least worn items, category distribution, cost-per-wear
- **❤️ Favorites & Collections** — Save favorite outfits, auto-grouped smart collections
- **🌙 Dark/Light Mode** — Theme toggle with localStorage persistence

## ⚛️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19 + Vite 8 |
| Routing | react-router-dom v7 |
| Styling | Tailwind CSS v4 |
| Auth & Database | Firebase (Auth + Firestore) |
| Calendar | react-big-calendar + date-fns |
| Charts | recharts |
| Icons | react-icons |
| State Management | React Context API + useReducer |

## 📁 Project Structure

```
/src
  /components    → Reusable UI (Navbar, ClothingCard, AddClothingModal, etc.)
  /pages         → Route-level pages (Dashboard, Wardrobe, OutfitBuilder, etc.)
  /hooks         → Custom hooks (useAuth re-exported from context)
  /context       → AuthContext, WardrobeContext, OutfitContext, ThemeContext
  /services      → Firebase config, auth, Firestore CRUD, AI recommendation engine
  /utils         → Color matching, date helpers, constants
```

## ⚛️ React Concepts Demonstrated

| Concept | Where |
|---|---|
| Functional Components | Every component |
| `useState` | Forms, filters, modals, toggles |
| `useEffect` | Auth listener, Firestore data fetching |
| Conditional Rendering | Loading spinners, empty states, error messages, auth guards |
| Lists & Keys | Clothing grid, outfit list, calendar events, charts |
| Lifting State Up | Outfit builder (selections → parent), Wardrobe filters |
| Controlled Components | All form inputs (Login, Register, AddClothing, filters) |
| React Router | 8 routes with protected route wrapper |
| Context API | AuthContext, WardrobeContext, OutfitContext, ThemeContext |
| `useMemo` | Filtered wardrobe lists, analytics computations, AI suggestions |
| `useCallback` | Memoized event handlers in OutfitBuilder, Navbar |
| `useRef` | Scroll-to-preview in OutfitBuilder, file input in AddClothingModal |
| `React.lazy` + `Suspense` | All 8 page components are lazy-loaded |
| `useReducer` | WardrobeContext and OutfitContext state management |
| Error Boundary | ErrorBoundary class component wrapping the app |

## 🔧 Setup Instructions

1. **Clone / Download** the project
2. **Install dependencies:**
   ```bash
   cd "Virtual Outfit Planner"
   npm install
   ```
3. **Create Firebase Project:**
   - Go to [Firebase Console](https://console.firebase.google.com)
   - Create a new project
   - Enable **Authentication** → Email/Password
   - Create **Firestore Database** (start in test mode)
   - Go to Project Settings → copy the config values

4. **Configure `.env`:**
   ```
   VITE_FIREBASE_API_KEY=your_key
   VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   ```

5. **Run the app:**
   ```bash
   npm run dev
   ```

## 📦 Build for Production
```bash
npm run build
```

## 🎥 Demo Plan
1. Explain the problem (daily outfit decision fatigue)
2. Register/Login flow
3. Upload clothes with images
4. Create an outfit in the Outfit Builder
5. Assign outfit to calendar
6. Show AI suggestions on dashboard
7. Show analytics (charts)
8. Toggle dark mode
9. Explain tech choices (React + Firebase + Tailwind)
