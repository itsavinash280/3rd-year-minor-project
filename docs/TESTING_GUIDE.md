# Testing & Quality Assurance Guide — AsraVerse AI

## 1. Automated Testing Strategy

### Authentication & RBAC Tests
- `test_register_farmer`: Verify account creation, BCrypt password hashing, and token delivery.
- `test_role_enforcement`: Verify that a user with `BUYER` role receives a `403 Forbidden` when attempting to call `POST /api/marketplace`.
- `test_masked_aadhaar`: Verify that Aadhaar values are masked as `XXXX-XXXX-9876` and never exposed in clear-text.

### AI Engine Mathematical Validation
- `test_crop_recommendation_scoring`: Verify that given pH 6.8 and Rabi winter climate, Wheat and Mustard receive &gt; 90% suitability score and include a non-empty `explanation`.
- `test_disease_detection_confidence`: Verify that uploading a tomato leaf with target-board rings outputs `Tomato Early Blight` with &gt; 90% confidence, organic and chemical treatments.
- `test_price_forecasting_bounds`: Verify that 6-month futures forecasts produce monotonic upper and lower bound confidence intervals.

---

## 2. Running Frontend Build Validation
```bash
cd frontend
npm run build
```

## 3. Running Backend Build Validation
```bash
cd backend
npm run build
```
