# Architecture & Design Decisions

## Overview

ListingPilot AI is built using a **clean architecture** approach with clear separation of concerns. This document explains key decisions and design patterns.

---

## Backend Architecture

### Layered Structure

```
Controllers (Presentation)
     ↓
Services (Application Logic)
     ↓
Repositories (Data Access)
     ↓
Entities (Domain Models)
```

### Layer Responsibilities

#### 1. **API Layer** (`ListingPilot.Api`)
- **Responsibility:** HTTP handling, routing, middleware
- **Files:**
  - `Controllers/GenerationController.cs` — REST endpoints
  - `Program.cs` — Configuration and DI setup
  - `appsettings.json` — Configuration

**Key Principle:** Controllers are thin; they delegate to services.

**Example:**
```csharp
[HttpPost("generate")]
public async Task<ActionResult<GenerateResponseDto>> Generate(GenerateRequestDto request)
{
    var result = await _generationService.GenerateAsync(request);
    return Ok(result);  // Let service handle business logic
}
```

#### 2. **Application Layer** (`ListingPilot.Application`)
- **Responsibility:** Business logic, orchestration, DTOs
- **Files:**
  - `Services/GenerationService.cs` — Core workflows
  - `Services/AiService.cs` — AI integration abstraction
  - `DTOs/Dtos.cs` — Data transfer objects (API contracts)

**Key Principle:** Services are independent of infrastructure.

**Example:**
```csharp
public async Task<GenerateResponseDto> GenerateAsync(GenerateRequestDto request)
{
    // 1. Call AI service
    var output = await _aiService.GenerateAsync(request.Property);
    
    // 2. Map to domain entity
    var record = new GenerationRecord { /* ... */ };
    
    // 3. Persist via repository
    var saved = await _repository.SaveAsync(record);
    
    // 4. Return DTO
    return new GenerateResponseDto { /* ... */ };
}
```

#### 3. **Domain Layer** (`ListingPilot.Domain`)
- **Responsibility:** Core business entities (no dependencies)
- **Files:**
  - `Entities/Models.cs` — `Property`, `GeneratedOutput`, `GenerationRecord`

**Key Principle:** No dependencies on external libraries or frameworks.

```csharp
public class GenerationRecord
{
    public string Id { get; set; }
    public Property Property { get; set; }
    public GeneratedOutput Output { get; set; }
    public DateTime CreatedAt { get; set; }
}
```

#### 4. **Infrastructure Layer** (`ListingPilot.Infrastructure`)
- **Responsibility:** External service implementations
- **Files:**
  - `Repositories/GenerationRepository.cs` — Data persistence (in-memory, DynamoDB, SQL)
  - `AI/` — AI service implementations

**Key Principle:** Swap implementations without changing service contracts.

**Example:**
```csharp
// Interface (defined in Application layer)
public interface IGenerationRepository
{
    Task<GenerationRecord> SaveAsync(GenerationRecord record);
}

// Current: In-memory
public class InMemoryGenerationRepository : IGenerationRepository { }

// Future: DynamoDB
public class DynamoDBGenerationRepository : IGenerationRepository { }
```

---

## Key Design Patterns

### 1. **Dependency Injection**

All dependencies are injected via constructor, making code testable and decoupled.

```csharp
public class GenerationService : IGenerationService
{
    private readonly IAiService _aiService;
    private readonly IGenerationRepository _repository;

    // Injected in Program.cs
    public GenerationService(IAiService aiService, IGenerationRepository repository)
    {
        _aiService = aiService;
        _repository = repository;
    }
}
```

**Configured in `Program.cs`:**
```csharp
builder.Services.AddScoped<IAiService, AiService>();
builder.Services.AddScoped<IGenerationService, GenerationService>();
builder.Services.AddSingleton<IGenerationRepository, InMemoryGenerationRepository>();
```

### 2. **Service Abstraction**

Services are defined as interfaces, allowing easy swapping of implementations.

```csharp
public interface IAiService
{
    Task<GeneratedOutputDto> GenerateAsync(PropertyInputDto property);
}

public class AiService : IAiService
{
    // Can switch to BedrockAiService without changing callers
}
```

### 3. **Repository Pattern**

Encapsulates data access logic. Current implementation is in-memory; can be replaced with database or external service.

```csharp
public interface IGenerationRepository
{
    Task<GenerationRecord> SaveAsync(GenerationRecord record);
    Task<List<GenerationRecord>> GetAllAsync();
}
```

### 4. **DTO Pattern**

Decouples API contract from internal domain models. Allows changing domain without breaking API.

```csharp
// External API contract
public class PropertyInputDto { }

// Internal domain model
public class Property { }

// Mapping in service
var entity = MapToEntity(dto);
```

---

## Frontend Architecture

### Component Hierarchy

```
App
├── Navbar
├── LandingPage
│   ├── Hero
│   ├── Features
│   ├── HowItWorks
│   └── Pricing
└── DashboardPage
    ├── PropertyForm
    │   ├── FormSection
    │   └── FormField
    └── OutputPanel
        ├── OutputCard
        └── LoadingSkeleton
```

### State Management

Uses **React hooks** for local state and custom hooks for business logic.

**Custom Hooks:**
```tsx
export function useGenerator() {
    const [output, setOutput] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const generate = async (property) => { /* ... */ };
    return { output, isLoading, generate };
}
```

**Usage in Component:**
```tsx
export function Dashboard() {
    const { output, isLoading, generate } = useGenerator();
    
    const handleSubmit = async (property) => {
        await generate(property);
    };
    
    return ( /* ... */ );
}
```

### Styling Approach

**CSS Modules** for scoped styles + **Global CSS** for design system.

**Global CSS** (`styles/globals.css`):
- CSS custom properties (design tokens)
- Base reset
- Typography defaults
- Common utilities

```css
:root {
  --color-primary: #1a3a5c;
  --color-accent: #c9a84c;
  --space-4: 16px;
  /* ... */
}
```

**Component Styles** (`Button.module.css`):
```css
.btn {
  padding: var(--space-3) var(--space-4);
  color: var(--color-text-primary);
  /* Uses design tokens */
}
```

**Benefits:**
- No CSS-in-JS overhead
- Explicit dependencies
- Easy to audit
- Full control

### API Communication

Single `apiService` handles all backend calls.

```ts
export const apiService = {
    async generate(property: PropertyInput) {
        return request<GenerateResponse>('/api/generate', {
            method: 'POST',
            body: JSON.stringify({ property }),
        });
    },
    // ... other methods
};
```

**Error Handling:**
```ts
export function useGenerator() {
    const [error, setError] = useState<string | null>(null);
    
    const generate = async (property) => {
        try {
            const result = await apiService.generate(property);
            setOutput(result.output);
        } catch (err) {
            setError(err.message);
        }
    };
    
    return { output, error, generate };
}
```

---

## AI Integration Strategy

### Abstraction Layer

The `IAiService` interface abstracts away specific AI provider.

```csharp
public interface IAiService
{
    Task<GeneratedOutputDto> GenerateAsync(PropertyInputDto property);
}
```

### Current Implementation: OpenAI + Mock Fallback

```csharp
public class AiService : IAiService
{
    private readonly bool _useMockMode;

    public async Task<GeneratedOutputDto> GenerateAsync(PropertyInputDto property)
    {
        if (_useMockMode)
            return GenerateMockOutput(property);  // No API call

        try
        {
            return await GenerateWithOpenAiAsync(property);  // Call OpenAI
        }
        catch
        {
            return GenerateMockOutput(property);  // Fallback
        }
    }
}
```

### Future Implementations

**AWS Bedrock:**
```csharp
public class BedrockAiService : IAiService
{
    public async Task<GeneratedOutputDto> GenerateAsync(PropertyInputDto property)
    {
        var client = new AmazonBedrockRuntimeClient();
        var response = await client.InvokeModelAsync(/* ... */);
        return ParseResponse(response);
    }
}
```

**Switch in `Program.cs`:**
```csharp
builder.Services.AddScoped<IAiService, BedrockAiService>();
// Instead of: builder.Services.AddScoped<IAiService, AiService>();
```

---

## Data Flow

### Generation Flow

```
1. User fills form (Frontend)
   ↓
2. Submits PropertyInputDto (POST /api/generate)
   ↓
3. GenerationController receives request
   ↓
4. GenerationService.GenerateAsync()
   ├── Calls IAiService.GenerateAsync()
   │   ├── Checks if mock mode
   │   ├── If mock: Generate high-quality mock copy
   │   ├── If real: Call OpenAI API
   │   └── Return GeneratedOutputDto
   │
   ├── Map to domain entity (GenerationRecord)
   └── Save via IGenerationRepository
   ↓
5. Return GenerateResponseDto (with id, output, createdAt)
   ↓
6. Frontend displays outputs in OutputPanel
   ↓
7. User copies to clipboard (client-side)
```

### History Flow

```
1. User navigates to Dashboard
   ↓
2. useHistory hook calls apiService.getHistory()
   ↓
3. GET /api/history endpoint
   ↓
4. GenerationService.GetHistoryAsync()
   └── Calls IGenerationRepository.GetAllAsync()
   ↓
5. Returns List<HistoryItemDto>
   ↓
6. Frontend displays history cards
```

---

## Extension Points

### 1. Add New Output Type

**Backend:**
1. Add field to `GeneratedOutput` entity
2. Add field to `GeneratedOutputDto`
3. Update `AiService` prompt generation
4. Update mock output generator

**Frontend:**
1. Add to `GeneratedOutput` type
2. Add to `OUTPUT_CONFIGS` in `OutputPanel.tsx`
3. Add new `OutputCard`

### 2. Add Authentication

1. Integrate AWS Cognito or similar
2. Add `[Authorize]` attribute to controllers
3. Extract user ID from JWT token
4. Filter history by user ID

### 3. Add Persistent Storage

1. Create `SqlGenerationRepository : IGenerationRepository`
2. Implement with Entity Framework Core
3. Update `Program.cs` DI
4. No changes needed to services or controllers

### 4. Add Subscription Tiers

1. Add `ISubscriptionService`
2. Inject into `GenerationService`
3. Check tier limits before generating
4. Return 403 if limit exceeded

### 5. Add Compliance Checking

1. Create `IComplianceService`
2. Validate output before returning
3. Flag potentially discriminatory language
4. Log for audit trail

---

## Security Considerations

### Backend
- **Input Validation:** All DTOs validated before processing
- **CORS:** Configured to allow frontend domain only
- **Environment Variables:** Sensitive keys stored in environment
- **Error Handling:** Generic errors returned to client; detailed logs server-side
- **SQL Injection:** N/A for MVP (in-memory), prepared statements when adding DB

### Frontend
- **API Keys:** Never stored in frontend code
- **XSS Protection:** React automatically escapes HTML
- **HTTPS:** Enforced in production
- **CSRF:** API Gateway handles token validation
- **Content Security Policy:** Should be set via CloudFront headers

### Future
- **Rate Limiting:** Implement on API Gateway
- **Authentication:** Add Cognito or similar
- **Encryption:** Use AWS KMS for sensitive data
- **Audit Logging:** CloudTrail for all API calls
- **WAF:** AWS WAF rules on API Gateway

---

## Performance Considerations

### Backend
- **Lambda Concurrency:** Set to 100+ for high traffic
- **Connection Pooling:** HttpClient factory reuses connections
- **Caching:** Add CloudFront caching for sample-property endpoint
- **Async/Await:** All I/O is async for efficiency

### Frontend
- **Code Splitting:** Vite automatically chunks routes
- **Lazy Loading:** Load LandingPage only when needed
- **CSS:** Scoped styles prevent unused CSS bloat
- **Images:** Use WebP with fallback
- **Minification:** Automatic via Vite build

### Future Optimizations
- **Lambda Layers:** Share dependencies across functions
- **DynamoDB Caching:** ElastiCache for hot data
- **Database Indexing:** When using persistent storage
- **Analytics:** Real User Monitoring (RUM) to identify bottlenecks

---

## Testing Strategy

### Backend Testing
```csharp
// Unit test for AiService
[Test]
public async Task GenerateAsync_WithValidProperty_ReturnsSixOutputs()
{
    var service = new AiService(mockClient, mockConfig);
    var property = new PropertyInputDto { /* ... */ };
    
    var result = await service.GenerateAsync(property);
    
    Assert.NotNull(result.MlsDescription);
    Assert.NotNull(result.FacebookPost);
    // ... etc
}

// Integration test for controller
[Test]
public async Task Generate_WithValidRequest_Returns200()
{
    var client = new TestClientFactory().CreateClient();
    var response = await client.PostAsync("/api/generate", /* ... */);
    Assert.Equal(200, response.StatusCode);
}
```

### Frontend Testing
```tsx
// Component test
test('renders output cards on success', async () => {
    render(<OutputPanel output={mockOutput} />);
    expect(screen.getByText('MLS Description')).toBeInTheDocument();
});

// Integration test
test('form submission generates copy', async () => {
    render(<DashboardPage />);
    await fillForm();
    await screen.findByText(/Copied!/);
});
```

---

## Monitoring & Observability

### Logging
- CloudWatch Logs automatically capture Lambda output
- Structured logging with request ID for tracing
- Error logs include stack traces

### Metrics
- CloudWatch Metrics track Lambda performance
- Custom metrics for business events (generations/day, etc.)
- API Gateway metrics for API health

### Tracing
- X-Ray integration (optional) for request tracing
- Correlate frontend errors with backend issues
- Performance bottleneck identification

### Alerting
- CloudWatch Alarms for error rates
- SNS notifications to email/Slack
- Automatic rollback triggers (if using Lambda aliases)

---

## Conclusion

This architecture balances:
- **Simplicity:** Easy to understand for new developers
- **Scalability:** Can handle growth without major refactoring
- **Maintainability:** Clear separation of concerns
- **Extensibility:** Easy to add new features and integrations
- **Testability:** Dependency injection enables unit testing

The design prioritizes getting to MVP quickly while laying groundwork for enterprise features like auth, billing, and advanced AI integrations.
