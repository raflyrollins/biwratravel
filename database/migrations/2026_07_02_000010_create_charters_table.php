<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('charters', function (Blueprint $table) {
            $table->id();
            $table->string('charter_code')->unique();
            $table->foreignId('user_id')->nullable()->constrained()->nullOnDelete();
            $table->string('customer_name');
            $table->string('customer_phone')->nullable();
            $table->string('customer_email')->nullable();
            $table->date('start_date');
            $table->date('end_date');
            $table->integer('estimated_passengers')->default(1);
            $table->integer('estimated_buses')->default(1);
            $table->text('custom_route')->nullable();
            $table->text('additional_info')->nullable();
            $table->string('status')->default('submitted');
            $table->foreignId('reviewed_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamp('reviewed_at')->nullable();
            $table->integer('quoted_price')->nullable();
            $table->text('quoted_notes')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('charters');
    }
};
