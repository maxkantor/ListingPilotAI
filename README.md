# ListingPilot AI

**Your Real Estate Agent's Marketing Copilot**

Generate MLS descriptions, social media posts, and email blurbs for property listings in seconds. AI-powered, fully compliant, no scraping.

---

## MVP Overview

ListingPilot AI is a premium B2B SaaS platform designed to help real estate agents transform property details into polished, multi-channel marketing copy. The app prioritizes **manual property entry** as the primary workflow, with optional URL-assisted parsing for convenience.

### Product Promise
- ✓ No hallucinations—only uses data you provide
- ✓ No scraping—fully compliant
- ✓ 6 channels of professional copy (MLS, Luxury, Facebook, Instagram, LinkedIn, Email)
- ✓ Enterprise-grade architecture for future expansion
- ✓ Runs locally with mock AI; integrates with OpenAI for production

---

## Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for fast builds
- **CSS Modules** (no Tailwind)
- **Clean component architecture**
- Desktop-first, responsive design

### Backend
- **ASP.NET Core 8** Web API
- **Clean Architecture** (Domain, Application, Infrastructure)
- **Dependency Injection** & interfaces
- **AWS Lambda-ready**
- In-memory repository (pluggable for DynamoDB/SQL Server)

### AI
- **OpenAI GPT-4** (configurable; mock mode available)
- **Prompt engineering** for compliance
- **Fallback to high-quality mocks** if API unavailable

### Deployment
- **AWS Lambda** + API Gateway (backend)
- **S3 + CloudFront** (frontend)
- **AWS Secrets Manager** for keys
- **CloudWatch** for logging

---

## Getting Started

### Prerequisites
- Node.js 18+ (frontend)
- .NET 8 SDK (backend)
- Git
- (Optional) AWS CLI, Docker

### Local Development Setup

#### Backend (Port 5000)

```bash
cd backend

# Restore NuGet packages
dotnet restore

# Run (development mode with mock AI)
dotnet run --project src/ListingPilot.Api

# Swagger UI at http://localhost:5000/swagger
```

**Environment:** Create `src/ListingPilot.Api/appsettings.Development.json` if needed. Mock mode is default.

#### Frontend (Port 3000)

```bash
cd frontend

# Install dependencies
npm install

# Start dev server (auto-proxies /api to backend)
npm run dev

# Open http://localhost:3000
```

#### Full Stack Running

Both servers must run simultaneously:

**Terminal 1:**
```bash
cd backend
dotnet run --project src/ListingPilot.Api
```

**Terminal 2:**
```bash
cd frontend
npm run dev
```

**Terminal 3 (optional - for testing):**
```bash
curl http://localhost:5000/api/health
# Expected: {"status":"healthy"}
```

---

## Project Structure

```
ListingPilotAI/
├── frontend/
│   ├── src/
│   │   ├── pages/               # React pages (Landing, Dashboard)
│   │   ├── components/          # Reusable UI components
│   │   ├── services/            # API client
│   │   ├── hooks/               # Custom React hooks
│   │   ├── types/               # TypeScript interfaces
│   │   ├── utils/               # Helpers & constants
│   │   ├── styles/              # Global CSS
│   │   ├── App.tsx              # Router
│   │   └── main.tsx             # Entry point
│   ├── vite.config.ts
│   ├── tsconfig.json
│   ├── package.json
│   ├── .env.example
│   └── FRONTEND_README.md
├── backend/
│   ├── src/
│   │   ├── ListingPilot.Api/        # ASP.NET Core app
│   │   │   ├── Controllers/
│   │   │   ├── Program.cs
│   │   │   └── appsettings.json
│   │   ├── ListingPilot.Application/
│   │   │   ├── Services/            # Business logic
│   │   │   └── DTOs/                # Data transfer objects
│   │   ├── ListingPilot.Domain/
│   │   │   └── Entities/            # Domain models
│   │   └── ListingPilot.Infrastructure/
│   │       ├── Repositories/        # Data access
│   │       └── AI/                  # AI integration
│   ├── ListingPilot.sln
│   ├── BACKEND_README.md
│   └── appsettings.example.json
└── README.md
```

---

## API Endpoints

### Generate Marketing Copy
```bash
POST /api/generate
Content-Type: application/json

{
  "property": {
    "streetAddress": "4812 Wieuca Road NE",
    "city": "Atlanta",
    "state": "GA",
    "zip": "30342",
    "price": "1,275,000",
    "beds": "5",
    "baths": "4.5",
    "squareFeet": "4,200",
    "propertyType": "Single Family",
    "keyFeatures": "Chef's kitchen, pool, smart home",
    "tone": "Luxury"
  }
}

Response:
{
  "id": "abc123",
  "output": {
    "mlsDescription": "...",
    "luxuryDescription": "...",
    "facebookPost": "...",
    "instagramCaption": "...",
    "linkedInPost": "...",
    "emailBlurb": "..."
  },
  "createdAt": "2026-03-10T12:00:00Z"
}
```

### Get Sample Property
```bash
GET /api/sample-property
# Returns pre-filled Atlanta property for testing
```

### Get History
```bash
GET /api/history
# Returns list of recent generations
```

### Health Check
```bash
GET /api/health
# Returns {"status":"healthy"}
```

---

## Features

### Landing Page
- Premium hero section with clear value prop
- Feature cards explaining each output type
- How-it-works walkthrough
- Sample output preview
- Pricing placeholder
- Professional footer

### Dashboard
- **Two-column layout** (desktop)
  - **Left:** Property input form with validation
  - **Right:** Generated outputs with copy buttons
- **Form highlights:**
  - Address, price, beds, baths, sq ft (required)
  - Features, interior/exterior, schools, agent notes
  - Tone selector (Professional, Luxury, Friendly, High-Energy)
  - "Use Sample Property" button
  - Real-time inline validation
- **Output panel:**
  - 6 output cards with platform icons
  - One-click copy to clipboard
  - Regenerate button
  - Loading skeletons
  - Empty state guidance
  - Compliance disclaimer
- **History section:**
  - Recent generations grid
  - Quick preview of past properties

### Design System
- **Color palette:** Navy primary (#1a3a5c), gold accent (#c9a84c), clean neutrals
- **Typography:** Professional sans-serif (Inter), clear hierarchy
- **Spacing:** Consistent 4px/8px/16px grid
- **Shadows:** Subtle, layered for depth
- **Interactions:** Smooth transitions, hover states, focus indicators
- **Responsiveness:** Desktop-first, mobile-optimized

---

## AI Capabilities

### Mock Mode (Default)
If no OpenAI API key is provided, ListingPilot generates high-quality mock outputs:
- Professional, realistic content
- Follows property data provided
- Respects tone settings
- Zero external dependencies

### Real Mode (OpenAI)
Set `OpenAI:ApiKey` in environment or config:

```json
{
  "OpenAI": {
    "ApiKey": "sk-..."
  }
}
```

The app uses GPT-4 with a detailed prompt ensuring:
- Compliance with Fair Housing Act
- No hallucinated details
- Respect for provided tone
- 6 distinct, optimized outputs

---

## Future Integrations

### Authentication (AWS Cognito)
```csharp
builder.Services.AddAuthentication("Bearer")
    .AddJwtBearer(options => { /* config */ });

[Authorize]
public class GenerationController { }
```

### Billing (Stripe)
```csharp
public class SubscriptionService
{
    public async Task<Subscription> CreateAsync(string userId, string priceId)
    {
        var service = new SubscriptionService();
        return await service.CreateAsync(new SubscriptionCreateOptions { /* */ });
    }
}
```

### History Storage (DynamoDB or SQL Server)
Replace `InMemoryGenerationRepository` with:
- `DynamoDBGenerationRepository` (AWS native)
- `SqlGenerationRepository` (Entity Framework Core + SQL Server)

### Advanced AI (AWS Bedrock)
Use Claude, Llama, or other models via AWS Bedrock for additional compliance/tone options.

### Exports (S3)
```csharp
public async Task<string> ExportToPdfAsync(GenerateResponseDto output)
{
    var pdf = GeneratePdf(output);
    var url = await UploadToS3(pdf);
    return url;
}
```

---

## Environment Configuration

### Frontend (.env.local)
```
VITE_API_BASE_URL=http://localhost:5000
```

### Backend (appsettings.Development.json)
```json
{
  "Logging": {
    "LogLevel": { "Default": "Information" }
  },
  "OpenAI": {
    "ApiKey": ""
  }
}
```

---

## Deployment

### Frontend to AWS S3 + CloudFront

```bash
cd frontend
npm run build
aws s3 sync dist/ s3://listing-pilot-frontend/
aws cloudfront create-invalidation --distribution-id E123 --paths "/*"
```

See [FRONTEND_README.md](frontend/FRONTEND_README.md) for detailed deployment guide.

### Backend to AWS Lambda

```bash
cd backend
dotnet publish -c Release -o publish
cd publish && zip -r function.zip .
aws lambda update-function-code --function-name listing-pilot-api --zip-file fileb://function.zip
```

See [BACKEND_README.md](backend/BACKEND_README.md) for Lambda setup and infrastructure examples.

---

## Development Workflow

### Making Changes

1. **Backend changes:** Edit files in `src/ListingPilot.*`, backend reloads automatically
2. **Frontend changes:** Edit files in `frontend/src/`, Vite HMR reloads instantly
3. **Types:** Keep `PropertyInputDto` (backend) and `PropertyInput` (frontend) in sync

### Testing the Form

1. Ensure both servers are running
2. Navigate to http://localhost:3000/dashboard
3. Click "Use Sample Property" to populate form
4. Click "Generate Marketing Copy"
5. Copy outputs using buttons
6. Check console for any errors

### Adding New API Endpoints

1. Add controller method in `GenerationController.cs`
2. Add corresponding service method in `GenerationService.cs`
3. Add DTO in `Dtos.cs`
4. Call from frontend via `apiService.ts`

---

## Production Checklist

### Backend
- [ ] OpenAI API key configured in Secrets Manager
- [ ] Lambda function deployed and tested
- [ ] API Gateway routes configured and CORS enabled
- [ ] CloudWatch logging enabled
- [ ] Error tracking (Sentry/DataDog) integrated
- [ ] Rate limiting configured
- [ ] DynamoDB table created (if using persistent storage)
- [ ] Environment set to Production
- [ ] Swagger UI disabled in production

### Frontend
- [ ] Environment variables configured (`VITE_API_BASE_URL` points to production API)
- [ ] Build optimized (`npm run build` produces minimal bundle)
- [ ] S3 bucket and CloudFront distribution created
- [ ] SSL certificate configured
- [ ] Analytics integrated (Google Analytics)
- [ ] Error tracking configured (Sentry)
- [ ] Meta tags updated for SEO
- [ ] Robots.txt and sitemap.xml created
- [ ] CI/CD pipeline configured (GitHub Actions, etc.)

### Compliance
- [ ] Privacy policy written
- [ ] Terms of service reviewed
- [ ] Fair Housing Act compliance verified
- [ ] Data retention policy documented
- [ ] Backup strategy in place

---

## Troubleshooting

### Backend won't start
```bash
# Check port 5000 is available
lsof -i :5000

# Try different port
dotnet run --project src/ListingPilot.Api --urls "http://localhost:5001"
```

### Frontend API calls fail
```bash
# Verify backend is running and healthy
curl http://localhost:5000/api/health

# Check browser console for CORS errors
# Verify VITE_API_BASE_URL in .env.local
```

### Node modules issues
```bash
rm -rf node_modules package-lock.json
npm install
```

### .NET package restore fails
```bash
dotnet nuget add source https://api.nuget.org/v3/index.json -n nuget.org
dotnet restore
```

---

## Support & Contribution

For issues, feature requests, or questions:
1. Check existing issues/documentation
2. Open GitHub issue with detailed description
3. Include logs and steps to reproduce

---

## License

Proprietary. © 2026 ListingPilot AI.

---

## Next Steps

1. **Customize branding:** Update logo, colors in CSS, company name in footer
2. **Integrate OpenAI:** Add API key to backend config
3. **Set up AWS:** Create S3, Lambda, API Gateway resources
4. **Add authentication:** Implement Cognito for user login
5. **Enable billing:** Wire up Stripe for subscriptions
6. **Launch:** Deploy frontend and backend, point domain

---

**Built with ❤️ for real estate professionals.**
