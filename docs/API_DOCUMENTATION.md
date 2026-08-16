# REST API Documentation — AsraVerse AI

Base URL: `http://localhost:5000/api`

---

## 1. Authentication (`/api/auth`)
- `POST /register` — Register new user (Farmer, Buyer, Expert, Transport) with BCrypt password and dev OTP (`123456`).
- `POST /verify-otp` — Verify phone with OTP token.
- `POST /login` — Authenticate credentials, create multi-device session, and return JWT token.
- `POST /google` — Google OAuth authentication endpoint.
- `GET /me` — [Protected] Return current authenticated user payload.
- `GET /sessions` — [Protected] List active device sessions.
- `DELETE /sessions/:sessionId` — [Protected] Revoke specific remote session.

## 2. Farm Profiles (`/api/farms`)
- `GET /` — [Protected] Retrieve farmer profile and land metrics.
- `POST /` — [Protected] Create or update farm soil, irrigation, and Aadhaar info.

## 3. Marketplace (`/api/marketplace`)
- `GET /` — Search and filter crop listings with pagination (`?crop=Wheat&isOrganic=true&page=1`).
- `GET /:id` — Get single crop listing detail with seller profile.
- `POST /` — [Protected - FARMER] Publish new crop batch for sale.
- `PUT /:id` — [Protected - FARMER] Update listing details or pricing.
- `DELETE /:id` — [Protected - FARMER/ADMIN] Deactivate listing.
- `GET /user/cart` — [Protected] Get current shopping cart items.
- `POST /user/cart` — [Protected] Add item to cart.
- `DELETE /user/cart/:listingId` — [Protected] Remove item from cart.
- `POST /coupons/verify` — Validate and apply discount coupons (e.g. `KRISHI10`, `BUMPER15`).

## 4. Orders & Checkout (`/api/orders`)
- `POST /` — [Protected] Checkout cart items, initiate Escrow payment, and assign transport logistics.
- `GET /` — [Protected] View orders history based on user role.
- `GET /:id` — [Protected] Retrieve order tracking and invoice timeline.
- `PUT /:id/status` — [Protected - TRANSPORT/ADMIN] Update delivery shipment status.

## 5. Artificial Intelligence (`/api/ai`)
- `POST /crop-recommendation` — Generate soil & climate explainable crop recommendations.
- `GET /crop-recommendation/history` — [Protected] Historical crop recommendations.
- `POST /disease-detection` — Analyze leaf image with CNN vision diagnostics.
- `GET /disease-detection/history` — [Protected] Historical leaf diagnostic scans.
- `POST /price-prediction` — Calculate 6-month futures forecast and inter-mandi comparison.
- `POST /voice/process` — Multilingual NLP engine for Hindi, Hinglish, and English voice queries.

## 6. Weather & Schemes (`/api/weather`, `/api/schemes`)
- `GET /weather` — Micro-climate 7-day forecast with ICAR agromet advisory alerts.
- `GET /schemes` — Search and view verified Government of India schemes (PM-KISAN, PMFBY, KCC).

## 7. Admin (`/api/admin`)
- `GET /dashboard` — [Protected - ADMIN] Real-time platform KPI analytics.
- `GET /users` — [Protected - ADMIN] List all registered users.
- `PUT /users/:id/toggle-status` — [Protected - ADMIN] Suspend or activate user accounts.
- `GET /complaints` — [Protected - ADMIN] Review dispute tickets.
