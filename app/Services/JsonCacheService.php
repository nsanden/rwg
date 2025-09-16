<?php

namespace App\Services;

use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;

class JsonCacheService
{
    const CACHE_TTL = 86400 * 7; // 1 week (604800 seconds)
    const CACHE_PREFIX = 'json_file:';

    /**
     * Get JSON data from cache or file
     */
    public function getJsonData(string $filePath): array
    {
        $cacheKey = self::CACHE_PREFIX . md5($filePath);

        return Cache::remember($cacheKey, self::CACHE_TTL, function () use ($filePath) {
            if (!file_exists($filePath)) {
                Log::warning("JSON file not found: {$filePath}");
                return [];
            }

            $content = file_get_contents($filePath);
            if ($content === false) {
                Log::warning("Failed to read JSON file: {$filePath}");
                return [];
            }

            $data = json_decode($content, true);
            if (json_last_error() !== JSON_ERROR_NONE) {
                Log::error("JSON decode error in file {$filePath}: " . json_last_error_msg());
                return [];
            }

            return $data ?? [];
        });
    }

    /**
     * Warm cache by preloading all JSON files
     */
    public function warmCache(): void
    {
        $jsonFiles = $this->getAllJsonFiles();

        foreach ($jsonFiles as $file) {
            $this->getJsonData($file);
        }

        Log::info("Warmed cache for " . count($jsonFiles) . " JSON files");
    }

    /**
     * Clear all JSON file caches
     */
    public function clearCache(): void
    {
        // For database cache, we need to manually clear each key
        $jsonFiles = $this->getAllJsonFiles();
        foreach ($jsonFiles as $file) {
            $this->invalidateFile($file);
        }
        Log::info("Cleared JSON file cache");
    }

    /**
     * Get all JSON files in the storage/data directory
     */
    private function getAllJsonFiles(): array
    {
        $dataPath = storage_path('data');
        $files = [];

        if (is_dir($dataPath)) {
            $iterator = new \RecursiveIteratorIterator(
                new \RecursiveDirectoryIterator($dataPath)
            );

            foreach ($iterator as $file) {
                if ($file->isFile() && $file->getExtension() === 'json') {
                    $files[] = $file->getPathname();
                }
            }
        }

        return $files;
    }

    /**
     * Invalidate cache for a specific file
     */
    public function invalidateFile(string $filePath): void
    {
        $cacheKey = self::CACHE_PREFIX . md5($filePath);
        Cache::forget($cacheKey);
    }
}