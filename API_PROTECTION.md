# API Protection Implementation

## 🛡️ **Protection Methods Implemented**

### 1. **Access Restriction Middleware** (`RestrictApiAccess`)
- **Internal Only**: Only allows requests from your own frontend (Inertia.js)
- **Domain Validation**: Checks referer/origin headers against allowed domains
- **Localhost Support**: Allows development requests from localhost
- **API Key Support**: Optional API key validation for controlled external access

### 2. **Enhanced Rate Limiting** (`ApiRateLimit`)
- **Tiered Limits**:
  - Internal requests: 300/minute
  - External requests: 10/minute
- **Smart Detection**: Automatically detects internal vs external requests
- **Logging**: Tracks blocked requests and usage patterns

### 3. **Configuration-Based Control** (`config/api.php`)
- Enable/disable API access entirely
- Configure allowed domains
- Set rate limits per user type
- Control logging levels

## 🔧 **Configuration Options**

### Environment Variables
```env
API_ENABLED=true                    # Enable/disable API
API_RESTRICTION_MODE=internal_only  # Restriction level
API_LOG_BLOCKED=true               # Log blocked requests
API_LOG_ALL=false                  # Log all requests (verbose)
```

### Restriction Modes
1. **`internal_only`** - Only your frontend can access (Recommended)
2. **`api_key_required`** - Require valid API keys
3. **`public`** - Allow public access with rate limits

## 🚀 **How It Works**

### Internal Requests (Allowed)
- Requests with `X-Inertia` header (your React frontend)
- Requests from allowed domains (referer/origin check)
- Localhost requests (development)

### External Requests (Blocked/Limited)
- No referer or from unknown domains
- Missing required headers
- Excessive rate limit violations

## 📊 **Monitoring**

### View API Usage
```bash
php artisan api:monitor
```

### Reset Usage Counters
```bash
php artisan api:monitor --reset
```

### Check Logs
```bash
tail -f storage/logs/laravel.log | grep "API"
```

## 🔐 **Security Levels**

### **Level 1: Complete Block** (Current Default)
- Only your frontend can access APIs
- External requests get 403 Forbidden
- Rate limits apply to all requests

### **Level 2: API Key Required** (Optional)
```php
// Add to config/api.php
'valid_keys' => [
    'your-secret-api-key-here',
],
```

### **Level 3: Public with Strict Limits** (Not Recommended)
- Set `API_RESTRICTION_MODE=public`
- Very low rate limits for external users

## 🛠️ **Customization**

### Add More Allowed Domains
Edit `config/api.php`:
```php
'allowed_domains' => [
    'https://yourdomain.com',
    'https://www.yourdomain.com',
    'https://staging.yourdomain.com',
],
```

### Adjust Rate Limits
```php
'rate_limits' => [
    'external' => [
        'requests' => 5,    // Lower for external
        'minutes' => 1,
    ],
    'internal' => [
        'requests' => 500,  // Higher for internal
        'minutes' => 1,
    ],
],
```

### Custom API Key Validation
Extend `RestrictApiAccess` middleware to:
- Check database for API keys
- Associate keys with user accounts
- Track usage per key

## 🔍 **Testing**

### Test Internal Access (Should Work)
```javascript
// From your frontend
fetch('/api/generate/words?count=5')
```

### Test External Access (Should Block)
```bash
# Direct curl request (should get 403)
curl https://yourdomain.com/api/generate/words?count=5
```

## 📈 **Benefits**

1. **Prevents API Abuse**: Stops scrapers and unauthorized usage
2. **Protects Server Resources**: Prevents overload from external requests
3. **Maintains Performance**: Your frontend gets priority access
4. **Detailed Monitoring**: Track usage patterns and blocked attempts
5. **Flexible Configuration**: Easy to adjust protection levels

## ⚠️ **Important Notes**

- Your frontend will continue working normally
- All protection is transparent to legitimate users
- Logs help identify abuse patterns
- Can be disabled instantly via environment variables
- Backup your original API routes before deployment

This implementation provides enterprise-grade API protection while maintaining full functionality for your legitimate users.