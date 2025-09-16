<?php

return [
    /*
    |--------------------------------------------------------------------------
    | API Access Configuration
    |--------------------------------------------------------------------------
    */

    'enabled' => env('API_ENABLED', true),

    'restriction_mode' => env('API_RESTRICTION_MODE', 'internal_only'),

    /*
    |--------------------------------------------------------------------------
    | Valid API Keys
    |--------------------------------------------------------------------------
    | If you want to allow specific external access, add API keys here
    | In production, these should be stored in a database with user associations
    */

    'valid_keys' => [
        // Add valid API keys here if needed
        // env('INTERNAL_API_KEY'),
    ],

    /*
    |--------------------------------------------------------------------------
    | Rate Limiting for External API Access
    |--------------------------------------------------------------------------
    */

    'rate_limits' => [
        'external' => [
            'requests' => 10,      // requests per minute for external users
            'minutes' => 1,
        ],
        'internal' => [
            'requests' => 300,     // requests per minute for internal use
            'minutes' => 1,
        ],
    ],

    /*
    |--------------------------------------------------------------------------
    | Allowed Domains for Internal Requests
    |--------------------------------------------------------------------------
    */

    'allowed_domains' => [
        'https://randomwordgenerator.com',
        'https://www.randomwordgenerator.com',
        'http://localhost',
        'http://localhost:8000',
        'http://localhost:5173',
    ],

    /*
    |--------------------------------------------------------------------------
    | API Monitoring and Logging
    |--------------------------------------------------------------------------
    */

    'log_blocked_requests' => env('API_LOG_BLOCKED', true),
    'log_all_requests' => env('API_LOG_ALL', false),
];