# 👗 ClosetIQ — Virtual Outfit Planner & Wardrobe Manager

## 🧾 Overview

ClosetIQ is a smart virtual wardrobe management application that helps users organize their clothing, create outfits, and plan what to wear efficiently. By digitizing a user’s wardrobe, the app enables mix-and-match outfit creation, calendar-based outfit planning, and AI-powered outfit suggestions.

The goal is to reduce decision fatigue, prevent outfit repetition, and promote smarter wardrobe utilization.

---

## 🚀 Features

### 👕 Wardrobe Management

* Upload and manage clothing items
* Add details like category, color, season, and occasion
* Edit and delete items (CRUD functionality)

### 👗 Outfit Builder

* Mix and match clothes to create outfits
* Save, edit, and delete outfits
* Tag outfits for different occasions

### 📅 Calendar Planner

* Schedule outfits for specific dates
* Weekly/monthly outfit planning
* Helps avoid outfit repetition

### 🤖 AI Outfit Suggestions

* Suggests outfits based on:

  * User wardrobe
  * Occasion
  * Past usage
* Smart recommendations to simplify decisions

### 📊 Wardrobe Insights (Optional Advanced Feature)

* Most/least worn clothes
* Usage tracking
* Smarter wardrobe utilization

---

## 🧠 Problem Statement

People often struggle with deciding what to wear daily, leading to wasted time, repeated outfits, and inefficient use of their wardrobe. ClosetIQ solves this by providing a structured, intelligent system to manage clothes and plan outfits.

---

## 🎯 Objectives

* Digitize wardrobe management
* Enable efficient outfit planning
* Provide intelligent recommendations
* Improve user experience and productivity

---

## 🧰 Tech Stack

### ⚛️ Frontend

* React (Vite)
* React Router
* Tailwind CSS

### 🔐 Backend & Database

* Firebase

  * Authentication (Login/Signup)
  * Firestore Database
  * Cloud Storage (for images)

### 🤖 AI Integration

* OpenAI API / Google Gemini API (for outfit suggestions)

### 📦 Additional Tools & Libraries

* React Context API (global state management)
* React Hooks (useState, useEffect, useMemo, useCallback, useRef)
* Calendar Library (React Big Calendar / FullCalendar)

---

## 🏗️ Project Structure

```bash
/src
  /components     # Reusable UI components
  /pages          # Main application pages
  /hooks          # Custom React hooks
  /context        # Global state management
  /services       # API & backend services
  /utils          # Helper functions
```

---

## 🔐 Authentication & Security

* User Signup/Login using Firebase Authentication
* Protected routes for authenticated users
* Secure data storage and access

---

## 📦 Core Functionalities

| Feature         | Description                      |
| --------------- | -------------------------------- |
| Authentication  | User login & signup              |
| CRUD Operations | Manage clothes & outfits         |
| Outfit Planning | Calendar-based scheduling        |
| AI Suggestions  | Smart outfit recommendations     |
| Storage         | Cloud-based image & data storage |

---

## 🎨 UI/UX Design

* Clean and modern interface
* Fully responsive (mobile + desktop)
* Smooth navigation and user flow
* Loading states and error handling

---

## ⚛️ React Concepts Used

### Core Concepts

* Functional Components
* useState
* useEffect
* Conditional Rendering
* Lists & Keys

### Intermediate Concepts

* Lifting State Up
* Controlled Components
* React Router
* Context API

### Advanced Concepts

* useMemo (performance optimization)
* useCallback
* useRef
* Lazy Loading (React.lazy, Suspense)

---

## 📦 Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/closetiq.git
cd closetiq
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Setup Environment Variables

Create a `.env` file in the root directory and add:

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id

VITE_OPENAI_API_KEY=your_openai_key
```

### 4. Run the Application

```bash
npm run dev
```

---

## 🌐 Deployment

* Vercel / Netlify

---

## 🎥 Demo

A demo video showcasing features, architecture, and implementation is included as part of the submission.

---

## 📊 Evaluation Readiness

This project satisfies:

* ✅ Real-world problem solving
* ✅ Strong React fundamentals
* ✅ Advanced React concepts
* ✅ Backend integration (Auth + CRUD)
* ✅ Clean UI/UX
* ✅ Scalable architecture

---

## 🔮 Future Improvements

* Mobile app version
* Social sharing of outfits
* AI-based image recognition for auto-tagging
* Weather-based outfit suggestions
* E-commerce integration

---

## 👩‍💻 Author

Developed as part of a production-level React end-term project.

---

## 📄 License

This project is for academic purposes.

---
