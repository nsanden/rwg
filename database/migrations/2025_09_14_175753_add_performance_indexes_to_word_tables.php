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
        Schema::table('foreign_words', function (Blueprint $table) {
            $table->index('length');
            $table->index('syllables');
        });

        Schema::table('extended_words', function (Blueprint $table) {
            $table->index('length');
            $table->index('syllables');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('foreign_words', function (Blueprint $table) {
            $table->dropIndex(['length']);
            $table->dropIndex(['syllables']);
        });

        Schema::table('extended_words', function (Blueprint $table) {
            $table->dropIndex(['length']);
            $table->dropIndex(['syllables']);
        });
    }
};
