<?php

namespace App\Http\Controllers;

use App\Exceptions\AppException;
use App\Services\UserService;
use Illuminate\Http\Request;

class UserController extends Controller
{
    public function __construct(private readonly UserService $userService)
    {
    }

    public function create(Request $request)
    {
        $name = $request->input('name');
        $email = $request->input('email');

        if (! $name || ! is_string($name)) {
            throw new AppException(400, 'name is required');
        }

        if (! $email || ! is_string($email) || ! str_contains($email, '@')) {
            throw new AppException(400, 'valid email is required');
        }

        $user = $this->userService->create(['name' => $name, 'email' => $email]);

        return response()->json($user, 201);
    }

    public function list()
    {
        return response()->json($this->userService->getAll());
    }

    public function getById(string $id)
    {
        if (! ctype_digit($id) || (int) $id <= 0) {
            throw new AppException(400, 'Invalid user id');
        }

        return response()->json($this->userService->getById((int) $id));
    }

    public function update(Request $request, string $id)
    {
        if (! ctype_digit($id) || (int) $id <= 0) {
            throw new AppException(400, 'Invalid user id');
        }

        if ($request->has('name') && ! is_string($request->input('name'))) {
            throw new AppException(400, 'name must be a string');
        }

        if ($request->has('email') && (! is_string($request->input('email')) || ! str_contains($request->input('email'), '@'))) {
            throw new AppException(400, 'email must be valid');
        }

        $body = $request->only(['name', 'email']);

        return response()->json($this->userService->update((int) $id, $body));
    }

    public function delete(string $id)
    {
        if (! ctype_digit($id) || (int) $id <= 0) {
            throw new AppException(400, 'Invalid user id');
        }

        $this->userService->delete((int) $id);

        return response()->noContent();
    }
}
