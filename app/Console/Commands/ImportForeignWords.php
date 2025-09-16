<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;

class ImportForeignWords extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'import:foreign-words {file=rwg.csv}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Import foreign words from CSV file';

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

        $this->info("Importing foreign words from {$filename}...");

        // Clear existing data
        \DB::table('foreign_words')->truncate();

        $handle = fopen($filepath, 'r');

        // Skip header row
        fgetcsv($handle);

        $count = 0;
        $batchSize = 1000;
        $batch = [];

        while (($data = fgetcsv($handle)) !== FALSE) {
            $batch[] = [
                'word' => $data[0],
                'language' => $data[1],
                'syllables' => $data[2] === 'NULL' ? null : (int)$data[2],
                'length' => (int)$data[3],
                'first_letter' => $data[4],
                'last_letter' => $data[5],
                'created_at' => now(),
                'updated_at' => now(),
            ];

            $count++;

            if (count($batch) >= $batchSize) {
                try {
                    \DB::table('foreign_words')->insert($batch);
                } catch (\Illuminate\Database\UniqueConstraintViolationException $e) {
                    // Handle duplicates by inserting one by one
                    foreach ($batch as $record) {
                        \DB::table('foreign_words')->insertOrIgnore($record);
                    }
                }
                $batch = [];
                $this->info("Imported {$count} records...");
            }
        }

        // Insert remaining records
        if (!empty($batch)) {
            try {
                \DB::table('foreign_words')->insert($batch);
            } catch (\Illuminate\Database\UniqueConstraintViolationException $e) {
                // Handle duplicates by inserting one by one
                foreach ($batch as $record) {
                    \DB::table('foreign_words')->insertOrIgnore($record);
                }
            }
        }

        fclose($handle);

        $this->info("Successfully imported {$count} foreign words!");
        return 0;
    }
}
