<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Cache\RateLimiter;
use Symfony\Component\HttpFoundation\Response;

class SmartThrottleMiddleware
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
        $type = $request->get('type', 'all');
        $language = $request->get('language', 'en');

        // Check if this request requires database access
        $requiresDatabase = ($type === 'non-english' && $language !== 'en') || $type === 'extended';

        if ($requiresDatabase) {
            // Heavy throttling for database operations (30 per minute)
            $key = 'database_words:' . $request->ip();
            $maxAttempts = 30;
            $decayMinutes = 1;
        } else {
            // Light throttling for JSON file operations (300 per minute)
            $key = 'json_words:' . $request->ip();
            $maxAttempts = 300;
            $decayMinutes = 1;
        }

        if ($this->limiter->tooManyAttempts($key, $maxAttempts)) {
            return response()->json([
                'error' => 'Too many requests. Please wait a moment.',
                'success' => false
            ], 429);
        }

        $this->limiter->hit($key, $decayMinutes * 60);

        return $next($request);
    }
}
