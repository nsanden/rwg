<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('extended_words', function (Blueprint $table) {
            $table->string('word', 50)->primary();
            $table->tinyInteger('syllables')->nullable();
            $table->smallInteger('length');
            $table->string('first_letter', 3)->index();
            $table->string('last_letter', 3)->index();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('extended_words');
    }
};
