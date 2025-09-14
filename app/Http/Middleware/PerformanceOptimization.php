<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class PerformanceOptimization
{
    public function handle(Request $request, Closure $next): Response
    {
        $response = $next($request);

        // Set caching headers for static assets
        if ($request->is('build/*') || $request->is('*.js') || $request->is('*.css')) {
            $response->headers->set('Cache-Control', 'public, max-age=31536000, immutable');
            $response->headers->set('Expires', gmdate('D, d M Y H:i:s', time() + 31536000) . ' GMT');
        }

        // Set caching headers for images
        if ($request->is('*.jpg') || $request->is('*.jpeg') || $request->is('*.png') ||
            $request->is('*.gif') || $request->is('*.svg') || $request->is('*.webp')) {
            $response->headers->set('Cache-Control', 'public, max-age=2592000');
            $response->headers->set('Expires', gmdate('D, d M Y H:i:s', time() + 2592000) . ' GMT');
        }

        // Set security headers
        $response->headers->set('X-Content-Type-Options', 'nosniff');
        $response->headers->set('X-Frame-Options', 'SAMEORIGIN');
        $response->headers->set('X-XSS-Protection', '1; mode=block');
        $response->headers->set('Referrer-Policy', 'strict-origin-when-cross-origin');

        // Enable compression hint
        $response->headers->set('Vary', 'Accept-Encoding');

        return $response;
    }
}