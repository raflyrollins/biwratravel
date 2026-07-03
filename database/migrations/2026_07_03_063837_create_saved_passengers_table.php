<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('saved_passengers', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->string('nik', 16)->nullable();
            $table->string('name');
            $table->string('gender', 1)->nullable();
            $table->date('birth_date')->nullable();
            $table->timestamps();

            $table->unique(['user_id', 'nik']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('saved_passengers');
    }
};
