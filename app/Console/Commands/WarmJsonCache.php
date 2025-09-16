<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Services\JsonCacheService;

class WarmJsonCache extends Command
{
    /**
     * The name and signature of the console command.
     */
    protected $signature = 'cache:warm-json {--clear : Clear cache before warming}';

    /**
     * The console command description.
     */
    protected $description = 'Warm the Redis cache with all JSON files';

    /**
     * Execute the console command.
     */
    public function handle(JsonCacheService $cacheService)
    {
        if ($this->option('clear')) {
            $this->info('Clearing existing JSON cache...');
            $cacheService->clearCache();
        }

        $this->info('Warming JSON file cache...');

        $start = microtime(true);
        $cacheService->warmCache();
        $duration = round((microtime(true) - $start) * 1000, 2);

        $this->info("JSON cache warmed successfully in {$duration}ms");

        return 0;
    }
}