<?php

namespace App\Exceptions;

final class AppException extends \Exception
{
    public function __construct(public int $status, string $message)
    {
        parent::__construct($message);
    }
}
