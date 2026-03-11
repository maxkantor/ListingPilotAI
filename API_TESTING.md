# API Testing & Examples

## Quick Testing with cURL

### Health Check
```bash
curl http://localhost:5000/api/health
```

### Get Sample Property
```bash
curl http://localhost:5000/api/sample-property
```

### Generate Copy
```bash
curl -X POST http://localhost:5000/api/generate \
  -H "Content-Type: application/json" \
  -d '{
    "property": {
      "streetAddress": "123 Oak Avenue",
      "city": "Atlanta",
      "state": "GA",
      "zip": "30305",
      "price": "750000",
      "beds": "4",
      "baths": "3",
      "squareFeet": "3200",
      "propertyType": "Single Family",
      "keyFeatures": "Updated kitchen, hardwood floors, large backyard",
      "tone": "Professional"
    }
  }'
```

### Get History
```bash
curl http://localhost:5000/api/history
```

---

## Testing with Postman

### Import Collection

1. Open Postman
2. File → Import
3. Create collection manually or import from URL

### Requests

#### Generate Marketing Copy
**POST** `http://localhost:5000/api/generate`

Headers:
```
Content-Type: application/json
```

Body (JSON):
```json
{
  "property": {
    "streetAddress": "456 Maple Drive",
    "city": "Austin",
    "state": "TX",
    "zip": "78704",
    "price": "1500000",
    "beds": "5",
    "baths": "4.5",
    "squareFeet": "4800",
    "lotSize": "0.5 acres",
    "propertyType": "Single Family",
    "yearBuilt": "2020",
    "neighborhood": "Downtown Austin",
    "keyFeatures": "Luxury finishes, smart home, resort pool",
    "interiorFeatures": "Custom cabinets, marble counters",
    "exteriorFeatures": "Heated pool, spa, fire pit",
    "schoolInfo": "Austin ISD top-rated schools",
    "agentNotes": "Sellers motivated, closing flexible",
    "targetBuyerType": "Luxury buyer, executive family",
    "tone": "Luxury"
  }
}
```

Expected Response (200 OK):
```json
{
  "id": "abc-123-def",
  "output": {
    "mlsDescription": "Beautiful luxury property in Downtown Austin...",
    "luxuryDescription": "Exquisite estate offering the finest in contemporary luxury...",
    "facebookPost": "🏡 FEATURED LISTING 🏡 Stunning property in Austin!...",
    "instagramCaption": "✨ Introducing this gorgeous Single Family home...",
    "linkedInPost": "Thrilled to present this exceptional Single Family...",
    "emailBlurb": "Subject: Exclusive Property Opportunity..."
  },
  "createdAt": "2026-03-10T12:00:00.000Z"
}
```

---

## Testing with JavaScript (Fetch API)

```javascript
const API_BASE = 'http://localhost:5000';

async function generateCopy() {
  const property = {
    streetAddress: "789 Pine Street",
    city: "Denver",
    state: "CO",
    zip: "80202",
    price: "625000",
    beds: "3",
    baths: "2.5",
    squareFeet: "2200",
    propertyType: "Townhouse",
    keyFeatures: "Modern finishes, convenient location, HOA included",
    tone: "Friendly"
  };

  try {
    const response = await fetch(`${API_BASE}/api/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ property })
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const data = await response.json();
    console.log('Generated Copy:', data.output);
    return data;
  } catch (error) {
    console.error('Generation failed:', error);
  }
}

// Usage
generateCopy();
```

---

## Testing with Python

```python
import requests
import json

API_BASE = 'http://localhost:5000'

def generate_copy(property_data):
    url = f'{API_BASE}/api/generate'
    headers = {'Content-Type': 'application/json'}
    payload = {'property': property_data}
    
    response = requests.post(url, json=payload, headers=headers)
    response.raise_for_status()
    
    return response.json()

# Example property
property_data = {
    'streetAddress': '321 Cedar Lane',
    'city': 'Seattle',
    'state': 'WA',
    'zip': '98101',
    'price': '950000',
    'beds': '4',
    'baths': '3',
    'squareFeet': '3000',
    'propertyType': 'Single Family',
    'keyFeatures': 'City views, modern updates, large deck',
    'tone': 'High-Energy'
}

result = generate_copy(property_data)
print(json.dumps(result, indent=2))
```

---

## Testing Different Tones

### Professional
```json
{
  "property": {
    "streetAddress": "100 Main St",
    "city": "Boston",
    "state": "MA",
    "price": "800000",
    "beds": "4",
    "baths": "2",
    "squareFeet": "2500",
    "keyFeatures": "Updated systems, large lot",
    "tone": "Professional"
  }
}
```

**Output:** Concise, feature-focused MLS-ready copy

### Luxury
```json
{
  "tone": "Luxury"
}
```

**Output:** Elevated language, premium positioning, sophisticated wording

### Friendly
```json
{
  "tone": "Friendly"
}
```

**Output:** Warm, approachable, family-oriented messaging

### High-Energy
```json
{
  "tone": "High-Energy"
}
```

**Output:** Exciting, bold, action-oriented content

---

## Response Status Codes

| Code | Meaning | Example |
|------|---------|---------|
| 200 | Success | Copy generated |
| 400 | Bad Request | Missing required field |
| 500 | Server Error | AI service unavailable |

### Error Response
```json
{
  "error": "Property data is required"
}
```

---

## Performance Testing

### Load Testing with Apache Bench

```bash
# Single request
ab -n 1 -c 1 http://localhost:5000/api/sample-property

# 100 requests, 10 concurrent
ab -n 100 -c 10 http://localhost:5000/api/health
```

### Load Testing with k6

Create `load-test.js`:
```javascript
import http from 'k6/http';
import { check } from 'k6';

export let options = {
  stages: [
    { duration: '30s', target: 20 },
    { duration: '1m', target: 50 },
    { duration: '30s', target: 0 },
  ],
};

export default function () {
  const payload = JSON.stringify({
    property: {
      streetAddress: '123 Test St',
      city: 'Test City',
      state: 'TX',
      price: '500000',
      beds: '3',
      baths: '2',
      squareFeet: '2000',
      keyFeatures: 'Nice features',
      tone: 'Professional'
    }
  });

  let response = http.post('http://localhost:5000/api/generate', payload);
  check(response, {
    'status is 200': (r) => r.status === 200,
    'response time < 1000ms': (r) => r.timings.duration < 1000,
  });
}
```

Run:
```bash
k6 run load-test.js
```

---

## Debugging

### Enable Verbose Logging

Modify `appsettings.Development.json`:
```json
{
  "Logging": {
    "LogLevel": {
      "Default": "Debug",
      "Microsoft": "Debug"
    }
  }
}
```

### Check Backend Logs

```bash
# If running in terminal
# Logs appear directly in console

# If running in Docker
docker logs listing-pilot-api

# If deployed to Lambda
aws logs tail /aws/lambda/listing-pilot-api --follow
```

### Test Network Connectivity

```bash
# Check backend is accessible
curl -v http://localhost:5000/api/health

# Check CORS headers
curl -H "Origin: http://localhost:3000" -v http://localhost:5000/api/health
```

### Browser DevTools

1. Open http://localhost:3000/dashboard
2. Open DevTools (F12)
3. Go to **Network** tab
4. Fill form and generate
5. Check request/response in Network tab
6. Look for errors in **Console** tab

---

## Common Issues

### 500 Error on Generate
- Check backend logs for stack trace
- Verify property data is complete
- Check OpenAI API key (if in real mode)

### CORS Error
- Backend CORS not configured
- Frontend origin not whitelisted
- Check `Program.cs` cors policy

### Timeout
- Backend unresponsive (check if running)
- OpenAI API too slow (check network)
- Lambda cold start (will improve after first call)

### Mock vs Real Mode
- If OpenAI API key is set: Real mode
- If not set: Mock mode (high-quality outputs)
- Check `AiService.cs` `_useMockMode` property
