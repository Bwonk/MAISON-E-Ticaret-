# MAISON — Editorial Luxury Storefront

Reusable, block-based React storefront with three editorial themes, GSAP animations, JWT auth, and Stripe checkout. Designed for S3 + CloudFront deployment.

---

## 1. Architecture

```
yigitlabs.com          → S3 + CloudFront (this repo)
api.yigitlabs.com      → EC2 (Express :3000 + Strapi :1337)
dash.yigitlabs.com     → EC2 (Strapi Admin panel)
auth.yigitlabs.com     → AWS SES (mail domain only, no code)
```

### Frontend Structure

```
src/
├── components/          # Reusable UI (CheckoutPanel, ProtectedRoute)
├── config/
│   ├── env.config.ts    # Typed env variables — single access point
│   └── page.config.ts   # Section order — single source of truth
├── context/
│   └── AuthContext.tsx   # Global auth state (JWT + localStorage)
├── data/
│   └── products.json    # Offline/dev fallback product data
├── hooks/
│   └── useGsap.ts       # GSAP animation hooks (ScrollTrigger)
├── pages/               # Login, Register, OrderSuccess, OrderFailed
├── sections/            # Independent section blocks
│   ├── HeroMedia.tsx
│   ├── ProductGrid.tsx
│   ├── EditorialQuote.tsx
│   ├── AmbientMedia.tsx
│   ├── StoryGallery.tsx
│   └── FooterMinimal.tsx
├── styles/
│   └── global.css       # CSS variables + 3 themes + base reset
├── types/
│   └── sections.ts      # All TypeScript contracts
└── utils/
    ├── api.ts           # Generic HTTP client
    ├── auth.ts          # Auth API calls + token management
    ├── checkout.ts      # Checkout session + Stripe redirect
    └── data.ts          # Source-agnostic product fetching
```

### Data Flow

```
.env (VITE_DATA_SOURCE)
  ↓
env.config.ts → data.ts → getProducts()
                  ├── "json"   → products.json (zero network)
                  ├── "strapi" → GET /api/products?populate=*
                  └── "rest"   → GET /api/products
                  └── catch    → fallback to JSON
```

---

## 2. Local Development

```bash
# 1. Install dependencies
npm install

# 2. Copy env file
cp .env.example .env

# 3. Start dev server
npm run dev
```

Default: `http://localhost:5173`

With `VITE_DATA_SOURCE=json`, the app works fully offline using `src/data/products.json`.

---

## 3. Production Build

```bash
npm run build
```

Output: `dist/` directory. Static files ready for S3.

Build features:
- Code splitting: `vendor-react`, `vendor-gsap`, app chunks
- Assets under 4KB are inlined
- Relative paths (S3 compatible)

---

## 4. AWS S3 Bucket Setup

### Create bucket

```bash
aws s3 mb s3://yigitlabs-storefront
```

### Enable static website hosting

```bash
aws s3 website s3://yigitlabs-storefront \
  --index-document index.html \
  --error-document index.html
```

### Bucket policy (public read via CloudFront OAC)

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "AllowCloudFrontOAC",
      "Effect": "Allow",
      "Principal": {
        "Service": "cloudfront.amazonaws.com"
      },
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::yigitlabs-storefront/*",
      "Condition": {
        "StringEquals": {
          "AWS:SourceArn": "arn:aws:cloudfront::ACCOUNT_ID:distribution/DISTRIBUTION_ID"
        }
      }
    }
  ]
}
```

### Deploy

```bash
aws s3 sync dist/ s3://yigitlabs-storefront --delete
```

---

## 5. CloudFront Distribution

### Settings

| Setting | Value |
|---|---|
| Origin | `yigitlabs-storefront.s3.amazonaws.com` |
| Origin Access | OAC (Origin Access Control) |
| Viewer Protocol | Redirect HTTP → HTTPS |
| Allowed Methods | GET, HEAD |
| Cache Policy | CachingOptimized |
| Compress | Yes (gzip + brotli) |
| Price Class | Use All Edge Locations |
| Alternate Domain | `yigitlabs.com`, `www.yigitlabs.com` |
| SSL Certificate | ACM cert (see section 7) |

---

## 6. SPA Fallback (Critical)

CloudFront must serve `index.html` for all client-side routes.

**Custom Error Responses:**

| HTTP Error Code | Response Page | Response Code | TTL |
|---|---|---|---|
| 403 (Forbidden) | `/index.html` | 200 | 0 |
| 404 (Not Found) | `/index.html` | 200 | 0 |

This ensures `/login`, `/register`, `/order/success` etc. all resolve to the SPA.

---

## 7. SSL Certificate (ACM)

```
Region: us-east-1 (required for CloudFront)
Domain: yigitlabs.com
SANs:   *.yigitlabs.com
Validation: DNS (add CNAME to Route 53)
```

1. Request certificate in ACM (us-east-1)
2. Add the DNS validation CNAME record to Route 53
3. Wait for validation (usually < 5 minutes)
4. Attach certificate to CloudFront distribution

---

## 8. DNS (Route 53)

### Hosted zone: yigitlabs.com

| Record | Type | Value |
|---|---|---|
| `yigitlabs.com` | A (Alias) | CloudFront distribution |
| `www.yigitlabs.com` | A (Alias) | CloudFront distribution |
| `api.yigitlabs.com` | A | EC2 Elastic IP |
| `dash.yigitlabs.com` | A | EC2 Elastic IP |
| `auth.yigitlabs.com` | MX / TXT | AWS SES records (do not modify) |

---

## 9. EC2 Server (Backend)

### Stack

```
Ubuntu 22.04 LTS
Node.js 20 LTS (via nvm)
PM2 (process manager)
Nginx (reverse proxy)
```

### Nginx config (`/etc/nginx/sites-available/api`)

```nginx
# Express API (port 3000)
server {
    listen 80;
    server_name api.yigitlabs.com;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}

# Strapi Admin (port 1337)
server {
    listen 80;
    server_name dash.yigitlabs.com;

    location / {
        proxy_pass http://127.0.0.1:1337;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### SSL on EC2 (Certbot)

```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d api.yigitlabs.com -d dash.yigitlabs.com
```

### PM2

```bash
# Start Express
pm2 start server.js --name api

# Start Strapi
cd /path/to/strapi && pm2 start npm --name strapi -- run start

# Save + auto-start on reboot
pm2 save
pm2 startup
```

### Useful PM2 commands

```bash
pm2 list              # all processes
pm2 logs api          # Express logs
pm2 logs strapi       # Strapi logs
pm2 restart api       # restart Express
pm2 restart strapi    # restart Strapi
```

---

## 10. Changing Theme

Edit `data-theme` attribute in the root HTML, or change the default in `page.config.ts`:

```ts
// src/config/page.config.ts
meta: {
  theme: "ivory",   // "ivory" | "noir" | "sage"
}
```

All CSS variables swap automatically. Colors are defined in `src/styles/global.css`.

To add a new theme, add a `[data-theme="mytheme"]` block in `global.css` with all required variables.

---

## 11. Adding a New Section

1. Define the type in `src/types/sections.ts`:

```ts
export interface MyBlockProps {
  type: "myBlock";
  title: string;
}
```

2. Add to the union type:

```ts
export type SectionBlock = ... | MyBlockProps;
```

3. Create the component in `src/sections/MyBlock.tsx`

4. Add to `page.config.ts`:

```ts
sections: [
  // ... existing sections
  { type: "myBlock", title: "Hello" },
]
```

Reorder = move one line. Delete = remove one line.

---

## 12. Updating Products

### Option A: Edit JSON (offline/dev)

Edit `src/data/products.json`. Changes appear immediately in dev mode.

### Option B: Strapi CMS

1. Log in to `dash.yigitlabs.com`
2. Content Manager → Products → Add/Edit
3. Set `.env`: `VITE_DATA_SOURCE=strapi`
4. Set `VITE_STRAPI_TOKEN` with a valid API token

### Option C: Custom REST API

1. Ensure your endpoint returns `Product[]` shape
2. Set `VITE_DATA_SOURCE=rest`
3. Set `VITE_API_BASE_URL` to your API base

---

## 13. Environment Variables

All env access is funneled through `src/config/env.config.ts`.

| Variable | Purpose | Default |
|---|---|---|
| `VITE_API_BASE_URL` | Express API base URL | `""` |
| `VITE_DATA_SOURCE` | Product data source | `"json"` |
| `VITE_STRAPI_TOKEN` | Strapi API bearer token | `""` |
| `VITE_AUTH_BASE_URL` | Auth service base URL | `""` |
| `VITE_STRIPE_PUBLISHABLE_KEY` | Stripe public key | `""` |

Copy `.env.example` to `.env` and fill in values. Never commit `.env`.

---

## Quick Deploy Checklist

```
[ ] npm run build
[ ] aws s3 sync dist/ s3://yigitlabs-storefront --delete
[ ] aws cloudfront create-invalidation --distribution-id XXXXX --paths "/*"
[ ] Verify: https://yigitlabs.com
[ ] Verify: SPA routes (/login, /register, /order/success)
[ ] Verify: API connectivity (checkout, auth)
```
