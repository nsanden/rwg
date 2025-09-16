<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\File;

class ForeignWordsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $sqlFile = database_path('seeders/foreign_words_final.sql');

        if (!File::exists($sqlFile)) {
            $this->command->error('Foreign words SQL file not found at: ' . $sqlFile);
            return;
        }

        $this->command->info('Importing foreign words from SQL file...');

        // Read and execute the SQL file
        $sql = File::get($sqlFile);

        // Split by statements and execute
        $statements = array_filter(explode(';', $sql));

        foreach ($statements as $statement) {
            $statement = trim($statement);
            if (empty($statement) || str_starts_with($statement, '--') || str_starts_with($statement, '/*')) {
                continue;
            }

            try {
                DB::unprepared($statement . ';');
            } catch (\Exception $e) {
                // Skip errors for things like table creation (might already exist)
                if (!str_contains($e->getMessage(), 'already exists')) {
                    $this->command->warn('Error executing statement: ' . $e->getMessage());
                }
            }
        }

        $count = DB::table('foreign_words')->count();
        $this->command->info("Foreign words seeding completed. Total records: {$count}");
    }
}