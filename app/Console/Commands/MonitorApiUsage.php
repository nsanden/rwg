<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;

class MonitorApiUsage extends Command
{
    /**
     * The name and signature of the console command.
     */
    protected $signature = 'api:monitor {--reset : Reset all API usage counters}';

    /**
     * The console command description.
     */
    protected $description = 'Monitor API usage and show statistics';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        if ($this->option('reset')) {
            $this->resetCounters();
            return;
        }

        $this->showApiStats();
    }

    /**
     * Show API usage statistics
     */
    private function showApiStats()
    {
        $this->info('API Usage Statistics');
        $this->line('========================');

        // Get rate limiter stats (this is a simplified version)
        $cacheKeys = $this->getCacheKeys();

        $internalRequests = 0;
        $externalRequests = 0;
        $blockedRequests = 0;

        foreach ($cacheKeys as $key) {
            if (str_contains($key, 'api_internal')) {
                $internalRequests += Cache::get($key, 0);
            } elseif (str_contains($key, 'api_external')) {
                $externalRequests += Cache::get($key, 0);
            }
        }

        $this->table(
            ['Metric', 'Count'],
            [
                ['Internal Requests (Last Hour)', $internalRequests],
                ['External Requests (Last Hour)', $externalRequests],
                ['Total Requests', $internalRequests + $externalRequests],
            ]
        );

        $this->line('');
        $this->info('Recent API activity logged to: ' . storage_path('logs/laravel.log'));

        // Show top requesting IPs
        $this->showTopRequesters();
    }

    /**
     * Reset API usage counters
     */
    private function resetCounters()
    {
        $cacheKeys = $this->getCacheKeys();

        foreach ($cacheKeys as $key) {
            if (str_contains($key, 'api_')) {
                Cache::forget($key);
            }
        }

        $this->info('API usage counters have been reset.');
    }

    /**
     * Get cache keys (simplified - in reality you'd need to implement cache key scanning)
     */
    private function getCacheKeys(): array
    {
        // This is a simplified implementation
        // In a real implementation, you'd scan your cache store for keys
        return [];
    }

    /**
     * Show top requesting IPs
     */
    private function showTopRequesters()
    {
        $this->line('Top Requesting IPs (check logs for details):');
        $this->line('Use: tail -f storage/logs/laravel.log | grep "API request"');
    }
}