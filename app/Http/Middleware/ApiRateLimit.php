<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Cache\RateLimiter;
use Illuminate\Support\Facades\Log;
use Symfony\Component\HttpFoundation\Response;

class ApiRateLimit
{
    protected $limiter;

    public function __construct(RateLimiter $limiter)
    {
        $this->limiter = $limiter;
    }

    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next): Response
    {
        // Determine if this is an internal or external request
        $isInternal = $this->isInternalRequest($request);

        // Get rate limits from config
        $limits = config('api.rate_limits');
        $maxAttempts = $isInternal ? $limits['internal']['requests'] : $limits['external']['requests'];
        $decayMinutes = $isInternal ? $limits['internal']['minutes'] : $limits['external']['minutes'];

        // Create unique key for rate limiting
        $key = $this->getRateLimitKey($request, $isInternal);

        // Check rate limit
        if ($this->limiter->tooManyAttempts($key, $maxAttempts)) {
            // Log blocked request
            if (config('api.log_blocked_requests')) {
                Log::warning('API rate limit exceeded', [
                    'ip' => $request->ip(),
                    'user_agent' => $request->userAgent(),
                    'endpoint' => $request->path(),
                    'is_internal' => $isInternal,
                    'rate_limit_key' => $key,
                ]);
            }

            return response()->json([
                'error' => 'Rate limit exceeded',
                'message' => $isInternal ?
                    'Too many requests. Please wait a moment.' :
                    'API rate limit exceeded. Please upgrade to a paid plan for higher limits.',
                'success' => false,
                'retry_after' => $this->limiter->availableIn($key),
            ], 429);
        }

        // Track the request
        $this->limiter->hit($key, $decayMinutes * 60);

        // Log request if configured
        if (config('api.log_all_requests')) {
            Log::info('API request', [
                'ip' => $request->ip(),
                'endpoint' => $request->path(),
                'is_internal' => $isInternal,
                'remaining_requests' => $maxAttempts - $this->limiter->attempts($key),
            ]);
        }

        return $next($request);
    }

    /**
     * Check if request is from internal sources
     */
    private function isInternalRequest(Request $request): bool
    {
        // Check for Inertia header
        if ($request->hasHeader('X-Inertia')) {
            return true;
        }

        // Check referer/origin
        $allowedDomains = config('api.allowed_domains', []);
        $referer = $request->header('Referer');
        $origin = $request->header('Origin');

        if ($referer) {
            foreach ($allowedDomains as $domain) {
                if (str_starts_with($referer, $domain)) {
                    return true;
                }
            }
        }

        if ($origin && in_array($origin, $allowedDomains)) {
            return true;
        }

        // Localhost requests
        if (in_array($request->ip(), ['127.0.0.1', '::1'])) {
            return true;
        }

        return false;
    }

    /**
     * Generate rate limit key
     */
    private function getRateLimitKey(Request $request, bool $isInternal): string
    {
        $prefix = $isInternal ? 'api_internal' : 'api_external';

        // For internal requests, use a more generous group key
        if ($isInternal) {
            return $prefix . ':' . $request->ip();
        }

        // For external requests, use stricter per-IP limiting
        return $prefix . ':' . $request->ip() . ':' . $request->userAgent();
    }
}