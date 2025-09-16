<?php

namespace App\Traits;

use App\Services\JsonCacheService;

trait UsesJsonCache
{
    protected function getJsonData(string $filePath): array
    {
        return app(JsonCacheService::class)->getJsonData($filePath);
    }
}