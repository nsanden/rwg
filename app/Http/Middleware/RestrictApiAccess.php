<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class RestrictApiAccess
{
    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next): Response
    {
        // Option 1: Only allow requests from your own domain (Inertia/AJAX)
        if ($this->isInternalRequest($request)) {
            return $next($request);
        }

        // Option 2: Check for valid API key (if you want to allow some external access)
        if ($this->hasValidApiKey($request)) {
            return $next($request);
        }

        // Block all other API access
        return response()->json([
            'error' => 'API access restricted',
            'message' => 'This API is for internal use only',
            'success' => false
        ], 403);
    }

    /**
     * Check if request is from internal sources (your own frontend)
     */
    private function isInternalRequest(Request $request): bool
    {
        // Check if request has X-Inertia header (from your Inertia frontend)
        if ($request->hasHeader('X-Inertia')) {
            return true;
        }

        // Check referer/origin matches your domain
        $allowedDomains = [
            'https://randomwordgenerator.com',
            'https://www.randomwordgenerator.com',
            config('app.url'),
            'http://localhost',
            'http://localhost:8000',
            'http://localhost:5173',
        ];

        $referer = $request->header('Referer');
        $origin = $request->header('Origin');

        if ($referer) {
            foreach ($allowedDomains as $domain) {
                if (str_starts_with($referer, $domain)) {
                    return true;
                }
            }
        }

        if ($origin) {
            return in_array($origin, $allowedDomains);
        }

        // Allow requests from same host (internal server-to-server)
        if ($request->ip() === '127.0.0.1' || $request->ip() === '::1') {
            return true;
        }

        return false;
    }

    /**
     * Check for valid API key (optional - for controlled external access)
     */
    private function hasValidApiKey(Request $request): bool
    {
        $apiKey = $request->header('X-API-Key') ?? $request->get('api_key');

        if (!$apiKey) {
            return false;
        }

        // You can store valid API keys in database or config
        $validApiKeys = config('api.valid_keys', []);

        return in_array($apiKey, $validApiKeys);
    }
}