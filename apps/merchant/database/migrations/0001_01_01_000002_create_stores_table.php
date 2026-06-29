<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('stores', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->text('description')->nullable();
            $table->foreignId('owner_user_id')->constrained('users');
            $table->foreignId('category_id')->nullable()->constrained('categories');
            $table->timestamps();

            $table->index('owner_user_id', 'idx_stores_owner_user_id');
            $table->index('category_id', 'idx_stores_category_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('stores');
    }
};
