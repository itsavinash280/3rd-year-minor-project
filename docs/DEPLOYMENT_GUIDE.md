# Deployment & Production Guide — AsraVerse AI

## 1. Docker & Containerized Deployment

### Backend Dockerfile (`backend/Dockerfile`)
```dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json tsconfig.json ./
RUN npm ci
COPY src ./src
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY package*.json ./
RUN npm ci --only=production
COPY --from=builder /app/dist ./dist
EXPOSE 5000
CMD ["node", "dist/server.js"]
```

### Frontend Dockerfile (`frontend/Dockerfile`)
```dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine AS runner
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

---

## 2. Production Environment Checklist
1. **Database**: Use MongoDB Atlas with M10+ replica set, IP whitelisting, and VPC peering.
2. **Secrets Management**: Store `JWT_SECRET`, `RAZORPAY_KEY_SECRET`, and `CLOUDINARY_API_SECRET` in AWS Secrets Manager or HashiCorp Vault.
3. **Storage**: Configure AWS S3 or Cloudinary for persistent storage of uploaded leaf images and farm photos.
4. **SSL / TLS**: Enforce HTTPS with TLS 1.3 via Cloudflare or AWS CloudFront CDN.
5. **Monitoring**: Integrate Sentry for frontend/backend runtime exceptions and Prometheus/Grafana for server CPU/RAM metrics.
