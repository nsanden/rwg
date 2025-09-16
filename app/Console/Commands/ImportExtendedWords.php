<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;

class ImportExtendedWords extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'import:extended-words {file=word.csv}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Import extended English words from CSV file';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $filename = $this->argument('file');
        $filepath = base_path($filename);

        if (!file_exists($filepath)) {
            $this->error("File {$filename} not found!");
            return 1;
        }

        $this->info("Importing extended words from {$filename}...");

        // Clear existing data
        \DB::table('extended_words')->truncate();

        $handle = fopen($filepath, 'r');

        // Skip header row
        fgetcsv($handle);

        $count = 0;
        $batchSize = 1000;
        $batch = [];

        while (($data = fgetcsv($handle)) !== FALSE) {
            // Skip rows with missing data
            if (count($data) < 5) {
                continue;
            }

            $batch[] = [
                'word' => $data[0],
                'syllables' => $data[1] === 'NULL' || $data[1] === '' ? null : (int)$data[1],
                'length' => (int)$data[2],
                'first_letter' => $data[3],
                'last_letter' => $data[4],
                'created_at' => now(),
                'updated_at' => now(),
            ];

            $count++;

            if (count($batch) >= $batchSize) {
                try {
                    \DB::table('extended_words')->insert($batch);
                } catch (\Illuminate\Database\UniqueConstraintViolationException $e) {
                    // Handle duplicates by inserting one by one
                    foreach ($batch as $record) {
                        \DB::table('extended_words')->insertOrIgnore($record);
                    }
                }
                $batch = [];
                $this->info("Imported {$count} records...");
            }
        }

        // Insert remaining records
        if (!empty($batch)) {
            try {
                \DB::table('extended_words')->insert($batch);
            } catch (\Illuminate\Database\UniqueConstraintViolationException $e) {
                // Handle duplicates by inserting one by one
                foreach ($batch as $record) {
                    \DB::table('extended_words')->insertOrIgnore($record);
                }
            }
        }

        fclose($handle);

        $this->info("Successfully imported {$count} extended words!");
        return 0;
    }
}
