# System Architecture & Technical Specifications — AsraVerse AI

## 1. Executive Summary
**AsraVerse AI** is a production-ready, full-stack national agricultural intelligence platform designed to empower Indian farmers, grain buyers, agricultural scientists/KVK experts, transport partners, and platform administrators.

---

## 2. Multi-Tier High-Level Architecture

```
+-----------------------------------------------------------------------------------+
|                                  CLIENT LAYER                                     |
|  React 18 + Vite + TypeScript + Tailwind CSS                                      |
|  • Web Speech STT / TTS Audio Processor (Hindi, Hinglish, English)                |
|  • Recharts Visual Analytics (Price Forecaster, Admin KPIs)                       |
|  • Responsive Mobile-First Design System with Glassmorphism & High-Contrast Visuals|
+------------------------------------------+----------------------------------------+
                                           | HTTPS / JSON REST
                                           v
+-----------------------------------------------------------------------------------+
|                             API & MIDDLEWARE LAYER                                |
|  Express.js + Node.js (TypeScript)                                                |
|  • Helmet & CORS Security Middleware                                              |
|  • JWT Bearer Token Authentication & Multi-Device Session Storage                 |
|  • Role-Based Access Control (RBAC): FARMER, BUYER, EXPERT, TRANSPORT, ADMIN       |
|  • Express Rate Limiting & Multer Image Streaming                                 |
+------------------------------------------+----------------------------------------+
                                           | Internal Microservice Invocations
                                           v
+-----------------------------------------------------------------------------------+
|                                AI & ML ENGINE LAYER                               |
|  • CropRecommendationEngine: Rule & Agronomic Nutrient/Climate Optimization      |
|  • DiseaseDetectionEngine: CNN-based Plant Pathology Diagnosis & Remediation      |
|  • PricePredictionEngine: Time-Series ARIMA Forecasting & Inter-Mandi Arbitrage   |
|  • VoiceAssistantEngine: Multilingual Natural Language Intent Parser              |
+------------------------------------------+----------------------------------------+
                                           | Mongoose ODM
                                           v
+-----------------------------------------------------------------------------------+
|                                DATABASE PERSISTENCE                               |
|  MongoDB Cluster with Compound Indexes on Geo-Coordinates, Categories & Mandis    |
+-----------------------------------------------------------------------------------+
```

---

## 3. User Roles and RBAC Matrix

| Role | Capabilities | Primary Entry Point |
|---|---|---|
| **FARMER** | Farm profile setup, AI Crop Recommender, CNN Leaf Disease Scanner, Mandi Price Forecaster, Produce Listing, Expert Chat, Voice Assistant | `/` (Farmer Dashboard) |
| **BUYER** | Produce search, multi-mandi discovery, Cart, Wishlist, Checkout, Razorpay/UPI payments, Order Tracking | `/buyer` |
| **EXPERT** | Consultation queue, plant disease verification, prescription generation, diagnostic validation | `/expert` |
| **TRANSPORT** | Freight dispatches, pickup/drop navigation, delivery status updates, trip completion | `/transport` |
| **ADMIN** | System analytics, user compliance, dispute resolution, AI model monitoring, scheme manager | `/admin` |
