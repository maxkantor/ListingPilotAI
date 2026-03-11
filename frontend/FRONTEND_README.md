# Frontend Architecture & Deployment

## Project Structure

```
frontend/
├── src/
│   ├── pages/
│   │   ├── LandingPage.tsx
│   │   ├── LandingPage.module.css
│   │   ├── DashboardPage.tsx
│   │   └── DashboardPage.module.css
│   ├── components/
│   │   ├── Navbar.tsx
│   │   ├── PropertyForm.tsx
│   │   ├── OutputPanel.tsx
│   │   ├── OutputCard.tsx
│   │   ├── LoadingSkeleton.tsx
│   │   ├── Button.tsx
│   │   └── Badge.tsx
│   ├── services/
│   │   └── api.ts                   # HTTP client to backend
│   ├── hooks/
│   │   └── useGenerator.ts          # React hooks
│   ├── types/
│   │   └── index.ts                 # TypeScript types
│   ├── utils/
│   │   ├── constants.ts             # Sample data, options
│   │   └── formatters.ts            # Utility functions
│   ├── styles/
│   │   └── globals.css              # Global theme & reset
│   ├── App.tsx                      # Main router
│   └── main.tsx                     # Entry point
├── index.html
├── vite.config.ts
├── tsconfig.json
├── package.json
└── .env.example
```

## Key Design Decisions

### CSS Approach (No Tailwind)
- **CSS Modules** for component-scoped styles
- **Global CSS** for base reset, typography, and theme variables
- **Design Tokens** (CSS custom properties) for colors, spacing, shadows
- **Clean Methodology** for naming: `.component__element--state`

**Benefits:**
- Full control over output
- Better performance (no unused CSS)
- Easier to audit and maintain
- Explicit dependencies

### Component Structure
- **Presentational** components: Button, Badge, OutputCard
- **Container** components: PropertyForm, OutputPanel
- **Page** components: LandingPage, DashboardPage
- Clear data flow: pages → components → UI

### Type Safety
- Full TypeScript with strict mode
- Shared types between frontend and backend
- DTO validation in API layer

### State Management
- React hooks for local component state
- Custom hooks (`useGenerator`, `useHistory`) for business logic
- No Redux/Context needed for MVP (simple data flow)

## Local Development

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Setup

```bash
cd frontend

# Install dependencies
npm install

# Create .env.local
cp .env.example .env.local

# Start dev server (http://localhost:3000)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Backend Proxy
Development server proxies `/api` to `http://localhost:5000` (see `vite.config.ts`).

Ensure backend is running:
```bash
cd ../backend
dotnet run --project src/ListingPilot.Api
```

## Production Build

```bash
npm run build

# Output in dist/
# Ready to deploy to S3, Netlify, Vercel, etc.
```

## Deployment Options

### AWS S3 + CloudFront

```bash
# Build
npm run build

# Upload to S3
aws s3 sync dist/ s3://listing-pilot-frontend/ --delete

# Invalidate CloudFront cache
aws cloudfront create-invalidation --distribution-id E1234567890 --paths "/*"
```

**Infrastructure (Terraform):**

```hcl
resource "aws_s3_bucket" "frontend" {
  bucket = "listing-pilot-frontend"
}

resource "aws_s3_bucket_website_configuration" "frontend" {
  bucket = aws_s3_bucket.frontend.id
  index_document {
    suffix = "index.html"
  }
}

resource "aws_cloudfront_distribution" "frontend" {
  origin {
    domain_name = aws_s3_bucket.frontend.bucket_regional_domain_name
    origin_id   = "myS3Origin"
  }

  default_cache_behavior {
    allowed_methods  = ["GET", "HEAD"]
    cached_methods   = ["GET", "HEAD"]
    target_origin_id = "myS3Origin"
    forwarded_values {
      query_string = false
      cookies {
        forward = "none"
      }
    }
    viewer_protocol_policy = "redirect-to-https"
  }

  viewer_certificate {
    cloudfront_default_certificate = true
  }

  enabled = true
  default_root_object = "index.html"

  custom_error_response {
    error_code = 404
    response_code = 200
    response_page_path = "/index.html"
  }
}
```

### Netlify

```bash
# Deploy via CLI
npm install -g netlify-cli
npm run build
netlify deploy --prod --dir=dist
```

Or connect GitHub repo for automatic deployments.

### Vercel

```bash
npm install -g vercel
vercel
```

### Docker (for container deployment)

```dockerfile
FROM node:18-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:18-alpine
WORKDIR /app
RUN npm install -g serve
COPY --from=build /app/dist ./dist
EXPOSE 3000
CMD ["serve", "-s", "dist", "-l", "3000"]
```

```bash
docker build -t listing-pilot-frontend .
docker run -p 3000:3000 listing-pilot-frontend
```

## Performance Optimization

### Code Splitting (Vite)
- Automatic route-based splitting
- Dynamic imports for on-demand loading

### Image Optimization
- Store images in public/
- Use modern formats (WebP)
- Lazy load where applicable

### Bundle Analysis
```bash
npm install -g vite-plugin-visualization
# Then analyze build output
```

### Caching Strategy
- **CSS/JS**: Hash-based cache busting (automatic with Vite)
- **HTML**: No-cache (served from S3/CDN)
- **Assets**: Long cache TTL (30 days)

## Environment Variables

| Variable | Development | Production |
| -------- | ----------- | ---------- |
| `VITE_API_BASE_URL` | `http://localhost:5000` | `https://api.listingpilot.com` |

For production, set in deployment platform (Netlify, Vercel, etc.).

## SEO & Meta Tags

Update `index.html` with:
```html
<meta name="description" content="ListingPilot AI - Real estate marketing copilot">
<meta name="og:title" content="ListingPilot AI">
<meta name="og:image" content="https://...og-image.jpg">
```

## Analytics & Monitoring

### Google Analytics (add to App.tsx)
```tsx
import { useEffect } from 'react';

export const GoogleAnalytics = () => {
  useEffect(() => {
    window.gtag('config', 'GA_MEASUREMENT_ID');
  }, []);
  return null;
};
```

### Error Tracking (Sentry)
```tsx
import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: "https://...",
  environment: "production",
});
```

## Security

- **CSP Headers**: Set in CDN/server
- **Secrets**: Never commit `.env` files (use `.env.example`)
- **HTTPS**: Enforce in production
- **CORS**: Configured on backend to allow frontend domain only
- **Input Validation**: Validate on both frontend and backend

## CI/CD Pipeline (GitHub Actions)

```yaml
name: Deploy Frontend

on:
  push:
    branches: [main]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: "18"
      - run: npm ci && npm run build
      - uses: aws-actions/configure-aws-credentials@v2
        with:
          aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
          aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
      - run: aws s3 sync dist/ s3://listing-pilot-frontend/
      - run: aws cloudfront create-invalidation --distribution-id ${{ secrets.CF_DIST_ID }} --paths "/*"
```

## Testing (Future)

```bash
# Install test dependencies
npm install -D vitest @testing-library/react @testing-library/user-event

# Run tests
npm run test

# Coverage
npm run test:coverage
```

Example test:
```tsx
import { render, screen } from '@testing-library/react';
import { Button } from '../Button';

test('renders button with text', () => {
  render(<Button>Click me</Button>);
  expect(screen.getByText('Click me')).toBeInTheDocument();
});
```

## Troubleshooting

### Hot Module Replacement (HMR) not working
- Check Vite config `server.hmr`
- Ensure frontend and backend ports don't conflict

### API calls failing in production
- Verify `VITE_API_BASE_URL` environment variable
- Check CORS configuration on backend
- Inspect network tab in browser DevTools

### Build fails with "module not found"
- Run `npm install` to ensure dependencies are installed
- Check for circular imports
- Verify TypeScript config `paths` mapping

## Production Checklist

- [ ] Minified bundle (automatic with Vite)
- [ ] No console.log() in production builds
- [ ] Environment variables configured
- [ ] Analytics integrated
- [ ] Error tracking enabled
- [ ] Security headers set
- [ ] CDN/caching configured
- [ ] Performance tested (Lighthouse)
- [ ] Accessibility audited (axe DevTools)
- [ ] API endpoints verified
- [ ] Redirects configured (old → new URLs)
- [ ] Robots.txt and sitemap.xml updated
