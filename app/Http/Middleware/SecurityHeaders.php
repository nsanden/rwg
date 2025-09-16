<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class SecurityHeaders
{
    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next): Response
    {
        $response = $next($request);

        // Only apply HSTS in production
        if (app()->environment('production')) {
            $response->headers->set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
        }

        // Build CSP based on environment
        $csp = $this->buildContentSecurityPolicy();
        $response->headers->set('Content-Security-Policy', $csp);

        // X-Frame-Options
        $response->headers->set('X-Frame-Options', 'DENY');

        // X-Content-Type-Options
        $response->headers->set('X-Content-Type-Options', 'nosniff');

        // X-XSS-Protection
        $response->headers->set('X-XSS-Protection', '1; mode=block');

        // Referrer Policy
        $response->headers->set('Referrer-Policy', 'strict-origin-when-cross-origin');

        // Permissions Policy
        $response->headers->set('Permissions-Policy', 'geolocation=(), microphone=(), camera=()');

        // Remove server information
        $response->headers->remove('X-Powered-By');
        $response->headers->remove('Server');

        return $response;
    }

    /**
     * Build Content Security Policy based on environment
     */
    private function buildContentSecurityPolicy(): string
    {
        $isDev = app()->environment(['local', 'development']);

        // Base CSP
        $csp = "default-src 'self'; ";

        // Script sources
        $scriptSrc = "'self' 'unsafe-inline' 'unsafe-eval'";

        if ($isDev) {
            // Development: Allow Vite dev server
            $scriptSrc .= " http://localhost:5173 http://host.docker.internal:5173 ws://localhost:5173 ws://host.docker.internal:5173";
        }

        // Production: Add analytics and CDN
        $scriptSrc .= " https://cdn.jsdelivr.net https://www.googletagmanager.com https://www.google-analytics.com";

        $csp .= "script-src {$scriptSrc}; ";

        // Style sources
        $styleSrc = "'self' 'unsafe-inline'";

        if ($isDev) {
            // Development: Allow Vite dev server
            $styleSrc .= " http://localhost:5173 http://host.docker.internal:5173";
        }

        $csp .= "style-src {$styleSrc}; ";

        // Font sources (only local fonts needed now)
        $fontSrc = "'self'";
        $csp .= "font-src {$fontSrc}; ";

        // Image sources
        $csp .= "img-src 'self' data: https: blob:; ";

        // Connect sources
        $connectSrc = "'self' https://www.google-analytics.com";

        if ($isDev) {
            // Development: Allow Vite HMR
            $connectSrc .= " ws://localhost:5173 ws://host.docker.internal:5173 http://localhost:5173 http://host.docker.internal:5173";
        }

        $csp .= "connect-src {$connectSrc}; ";

        // Other directives
        $csp .= "frame-ancestors 'none'; ";
        $csp .= "base-uri 'self'; ";
        $csp .= "form-action 'self'";

        return $csp;
    }
}