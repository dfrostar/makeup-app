<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateBookingTables extends Migration
{
    public function up()
    {
        // Professional Working Hours
        Schema::create('professional_working_hours', function (Blueprint $table) {
            $table->id();
            $table->foreignId('professional_id')->constrained('professional_profiles');
            $table->integer('day_of_week'); // 0 = Sunday, 6 = Saturday
            $table->time('start_time');
            $table->time('end_time');
            $table->boolean('is_available')->default(true);
            $table->timestamps();
        });

        // Professional Time Off
        Schema::create('professional_time_off', function (Blueprint $table) {
            $table->id();
            $table->foreignId('professional_id')->constrained('professional_profiles');
            $table->date('start_date');
            $table->date('end_date');
            $table->string('reason')->nullable();
            $table->timestamps();
        });

        // Service Categories
        Schema::create('service_categories', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('slug')->unique();
            $table->text('description')->nullable();
            $table->string('icon')->nullable();
            $table->timestamps();
        });

        // Beauty Services
        Schema::create('beauty_services', function (Blueprint $table) {
            $table->id();
            $table->foreignId('professional_id')->constrained('professional_profiles');
            $table->foreignId('category_id')->constrained('service_categories');
            $table->string('name');
            $table->text('description');
            $table->integer('duration'); // in minutes
            $table->decimal('price', 10, 2);
            $table->decimal('commission_rate', 5, 2)->default(15.00);
            $table->boolean('is_featured')->default(false);
            $table->string('status')->default('active');
            $table->json('required_tools')->nullable();
            $table->timestamps();
        });

        // Service Images
        Schema::create('service_images', function (Blueprint $table) {
            $table->id();
            $table->foreignId('service_id')->constrained('beauty_services');
            $table->string('image_url');
            $table->boolean('is_primary')->default(false);
            $table->integer('display_order')->default(0);
            $table->timestamps();
        });

        // Service Bookings
        Schema::create('service_bookings', function (Blueprint $table) {
            $table->id();
            $table->foreignId('service_id')->constrained('beauty_services');
            $table->foreignId('customer_id')->constrained('users');
            $table->date('booking_date');
            $table->time('start_time');
            $table->time('end_time');
            $table->string('status')->default('pending');
            $table->decimal('total_amount', 10, 2);
            $table->decimal('commission_amount', 10, 2);
            $table->string('payment_status')->default('pending');
            $table->string('payment_intent_id')->nullable();
            $table->timestamp('cancelled_at')->nullable();
            $table->text('cancellation_reason')->nullable();
            $table->boolean('refunded')->default(false);
            $table->timestamps();

            // Indexes for faster queries
            $table->index(['booking_date', 'start_time']);
            $table->index(['status', 'payment_status']);
        });

        // Booking Notes
        Schema::create('booking_notes', function (Blueprint $table) {
            $table->id();
            $table->foreignId('booking_id')->constrained('service_bookings');
            $table->foreignId('user_id')->constrained('users');
            $table->text('note');
            $table->string('note_type')->default('general');
            $table->timestamps();
        });

        // Service Reviews
        Schema::create('service_reviews', function (Blueprint $table) {
            $table->id();
            $table->foreignId('booking_id')->constrained('service_bookings');
            $table->foreignId('customer_id')->constrained('users');
            $table->integer('rating');
            $table->text('review')->nullable();
            $table->json('aspects_rating')->nullable(); // Store ratings for different aspects
            $table->boolean('is_verified')->default(false);
            $table->boolean('is_featured')->default(false);
            $table->timestamps();
        });

        // Service Availability Exceptions
        Schema::create('service_availability_exceptions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('service_id')->constrained('beauty_services');
            $table->date('exception_date');
            $table->boolean('is_available')->default(false);
            $table->string('reason')->nullable();
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('service_availability_exceptions');
        Schema::dropIfExists('service_reviews');
        Schema::dropIfExists('booking_notes');
        Schema::dropIfExists('service_bookings');
        Schema::dropIfExists('service_images');
        Schema::dropIfExists('beauty_services');
        Schema::dropIfExists('service_categories');
        Schema::dropIfExists('professional_time_off');
        Schema::dropIfExists('professional_working_hours');
    }
}
