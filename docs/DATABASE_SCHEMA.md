# Database Schema Specification — AsraVerse AI

## Overview
AsraVerse AI uses **MongoDB** via Mongoose schemas with compound indexes to ensure fast geolocation lookups, pagination, and multi-tenant security.

---

## Collections & Entity Schema

### 1. `users`
- `_id`: ObjectId
- `name`: String
- `email`: String (Unique, Indexed)
- `phone`: String (Unique, Indexed)
- `password`: String (BCrypt hash)
- `role`: Enum (`'FARMER'`, `'BUYER'`, `'EXPERT'`, `'TRANSPORT'`, `'ADMIN'`)
- `isVerified`: Boolean
- `avatar`: String
- `activeSessions`: Array (`sessionId`, `deviceInfo`, `lastActive`)
- `timestamps`: `createdAt`, `updatedAt`

### 2. `farmerprofiles`
- `_id`: ObjectId
- `userId`: ObjectId (Ref: `User`, Unique)
- `farmName`: String
- `farmSize`: Number
- `sizeUnit`: Enum (`'ACRES'`, `'HECTARES'`, `'BIGHA'`)
- `soilType`: Enum (`'ALLUVIAL'`, `'BLACK'`, `'RED'`, `'CLAY'`, `'SANDY'`, `'LOAM'`)
- `soilPh`: Number
- `nitrogen`: Number (N in kg/ha)
- `phosphorus`: Number (P in kg/ha)
- `potassium`: Number (K in kg/ha)
- `irrigationMethod`: Enum (`'DRIP'`, `'CANAL'`, `'BOREWELL'`, `'RAIN'`, `'SPRINKLER'`)
- `state`: String (Indexed)
- `district`: String (Indexed)
- `village`: String
- `cropsGrown`: Array[String]
- `aadhaarMasked`: String (e.g. `'XXXX-XXXX-9876'`)

### 3. `croplistings`
- `_id`: ObjectId
- `sellerId`: ObjectId (Ref: `User`, Indexed)
- `title`: String
- `cropCategory`: String (Indexed)
- `variety`: String
- `quantityAvailable`: Number
- `unit`: Enum (`'KG'`, `'QUINTAL'`, `'TON'`, `'BOX'`, `'BAG'`)
- `pricePerUnit`: Number (Indexed)
- `minOrderQuantity`: Number
- `isOrganic`: Boolean
- `harvestDate`: Date
- `description`: String
- `images`: Array[String]
- `location`: `{ village, district, state, lat, lng }`
- `status`: Enum (`'AVAILABLE'`, `'SOLD_OUT'`, `'INACTIVE'`)
- `rating`: Number
- `totalReviews`: Number

### 4. `orders`
- `_id`: ObjectId
- `buyerId`: ObjectId (Ref: `User`, Indexed)
- `sellerId`: ObjectId (Ref: `User`, Indexed)
- `items`: Array[`{ listingId, title, quantity, unit, pricePerUnit, totalPrice }`]
- `totalAmount`: Number
- `discountAmount`: Number
- `finalAmount`: Number
- `couponCode`: String
- `deliveryAddress`: `{ fullName, phone, street, village, district, state, pincode }`
- `orderStatus`: Enum (`'PENDING'`, `'CONFIRMED'`, `'SHIPPED'`, `'OUT_FOR_DELIVERY'`, `'DELIVERED'`, `'CANCELLED'`)
- `paymentStatus`: Enum (`'PENDING'`, `'PAID'`, `'FAILED'`, `'REFUNDED'`)
- `paymentMethod`: Enum (`'UPI'`, `'CARD'`, `'NET_BANKING'`, `'COD'`)
- `trackingNumber`: String (Unique, Indexed)
- `estimatedDeliveryDate`: Date

### 5. `diseasedetections`
- `_id`: ObjectId
- `farmerId`: ObjectId (Ref: `User`, Indexed)
- `imageUrl`: String
- `cropName`: String
- `predictedDisease`: String
- `confidenceScore`: Number
- `severity`: Enum (`'LOW'`, `'MODERATE'`, `'HIGH'`, `'CRITICAL'`)
- `symptoms`: Array[String]
- `treatments`: `{ chemical: Array[String], organic: Array[String], dosageInfo: String }`
- `prevention`: Array[String]
- `expertVerified`: Boolean
- `expertNotes`: String
- `disclaimer`: String

### 6. `croprecommendations`
- `_id`: ObjectId
- `farmerId`: ObjectId (Ref: `User`, Indexed)
- `soilType`: String
- `temperature`: Number
- `rainfall`: Number
- `season`: String
- `irrigationMethod`: String
- `recommendations`: Array[`{ cropName, suitabilityScore, expectedYieldPerAcre, growingDurationDays, waterRequirement, fertilizerGuide, riskFactor, explanation }`]

### 7. `governmentschemes`
- `_id`: ObjectId
- `title`: String (Unique)
- `category`: String
- `description`: String
- `eligibility`: Array[String]
- `benefits`: String
- `documentsRequired`: Array[String]
- `applicationUrl`: String
- `officialSource`: String

### 8. `deliveries`
- `_id`: ObjectId
- `orderId`: ObjectId (Ref: `Order`, Unique)
- `transportPartnerId`: ObjectId (Ref: `User`)
- `pickupLocation`: `{ address, city, state, phone }`
- `dropLocation`: `{ address, city, state, phone }`
- `status`: Enum (`'ASSIGNED'`, `'PICKED_UP'`, `'IN_TRANSIT'`, `'OUT_FOR_DELIVERY'`, `'DELIVERED'`)
- `vehicleDetails`: String
