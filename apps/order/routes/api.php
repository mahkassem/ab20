<?php

use App\Http\Controllers\OrderController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;

Route::get('/health', fn () => response()->json(['status' => 'ok']));

Route::post('/products', [ProductController::class, 'create']);
Route::get('/products', [ProductController::class, 'list']);
Route::get('/products/{id}', [ProductController::class, 'getById']);
Route::put('/products/{id}', [ProductController::class, 'update']);
Route::delete('/products/{id}', [ProductController::class, 'delete']);

Route::post('/users', [UserController::class, 'create']);
Route::get('/users', [UserController::class, 'list']);
Route::get('/users/{id}', [UserController::class, 'getById']);
Route::put('/users/{id}', [UserController::class, 'update']);
Route::delete('/users/{id}', [UserController::class, 'delete']);

Route::post('/orders', [OrderController::class, 'create']);
Route::get('/orders', [OrderController::class, 'list']);
Route::delete('/orders', [OrderController::class, 'deleteAll']);
Route::get('/orders/{id}', [OrderController::class, 'getById']);
