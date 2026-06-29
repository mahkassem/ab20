<?php

namespace App\Http\Controllers;

use App\Exceptions\AppException;
use App\Services\UserService;
use Illuminate\Http\Request;

class UserController extends Controller
{
    public function __construct(private readonly UserService $userService) {}

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
        return response()->json($this->userService->getById($this->parseId($id)));
    }

    public function update(Request $request, string $id)
    {
        $intId = $this->parseId($id);

        $body = $request->all();

        if (array_key_exists('name', $body) && ! is_string($body['name'])) {
            throw new AppException(400, 'name must be a string');
        }

        if (array_key_exists('email', $body) && (! is_string($body['email']) || ! str_contains($body['email'], '@'))) {
            throw new AppException(400, 'email must be valid');
        }

        return response()->json($this->userService->update($intId, $body));
    }

    public function delete(string $id)
    {
        $this->userService->delete($this->parseId($id));

        return response()->noContent();
    }

    private function parseId(string $id): int
    {
        if (! ctype_digit($id) || (int) $id <= 0) {
            throw new AppException(400, 'Invalid user id');
        }

        return (int) $id;
    }
}
