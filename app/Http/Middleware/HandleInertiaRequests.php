<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;
use Tighten\Ziggy\Ziggy;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that is loaded on the first page visit.
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determine the current asset version.
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        return [
            ...parent::share($request),
            'auth' => [
                'user' => $request->user(),
            ],
            'ziggy' => fn () => [
                ...(new Ziggy)->toArray(),
                'location' => $request->url(),
            ],
            'preloadLinks' => $this->getPreloadLinks($request),
        ];
    }

    /**
     * Get preload links for critical resources
     */
    protected function getPreloadLinks(Request $request): array
    {
        $links = [];

        // Preload critical fonts
        $links[] = [
            'href' => '/fonts/inter-var.woff2',
            'as' => 'font',
            'type' => 'font/woff2',
            'crossorigin' => 'anonymous'
        ];

        // Preconnect to external domains
        $links[] = [
            'rel' => 'preconnect',
            'href' => 'https://fonts.googleapis.com'
        ];

        $links[] = [
            'rel' => 'dns-prefetch',
            'href' => 'https://cdn.jsdelivr.net'
        ];

        return $links;
    }
}
