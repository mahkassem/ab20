<?php

use App\Http\Controllers\CategoryController;
use App\Http\Controllers\StoreController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;

Route::get('/health', fn () => response()->json(['status' => 'ok']));

Route::post('/users', [UserController::class, 'create']);
Route::get('/users', [UserController::class, 'list']);
Route::get('/users/{id}', [UserController::class, 'getById']);
Route::put('/users/{id}', [UserController::class, 'update']);
Route::delete('/users/{id}', [UserController::class, 'delete']);

Route::post('/categories', [CategoryController::class, 'create']);
Route::get('/categories', [CategoryController::class, 'list']);
Route::get('/categories/{id}', [CategoryController::class, 'getById']);
Route::put('/categories/{id}', [CategoryController::class, 'update']);
Route::delete('/categories/{id}', [CategoryController::class, 'delete']);

Route::post('/stores', [StoreController::class, 'create']);
Route::get('/stores', [StoreController::class, 'list']);
Route::get('/stores/{id}', [StoreController::class, 'getById']);
Route::put('/stores/{id}', [StoreController::class, 'update']);
Route::delete('/stores/{id}', [StoreController::class, 'delete']);
