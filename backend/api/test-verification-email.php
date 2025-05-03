<?php

require __DIR__ . '/vendor/autoload.php';

$app = require_once __DIR__ . '/bootstrap/app.php';

$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

// Get the user with ID 5
$user = \App\Models\User::find(5);

if (!$user) {
    echo "User with ID 5 not found.\n";
    exit(1);
}

echo "User information:\n";
echo "ID: " . $user->id . "\n";
echo "Email: " . $user->email . "\n";
echo "Email verified: " . ($user->hasVerifiedEmail() ? 'Yes' : 'No') . "\n\n";

// Log some test messages
\Illuminate\Support\Facades\Log::info('Starting verification email test');

// Generate the verification URL
$verificationUrl = \Illuminate\Support\Facades\URL::temporarySignedRoute(
    'verification.verify',
    \Carbon\Carbon::now()->addMinutes(60),
    [
        'id' => $user->getKey(),
        'hash' => sha1($user->getEmailForVerification()),
    ]
);

// Fix the URL to include port 8000
$verificationUrl = str_replace('http://localhost/', 'http://localhost:8000/', $verificationUrl);

echo "Verification URL:\n";
echo $verificationUrl . "\n\n";

// Log the verification URL
\Illuminate\Support\Facades\Log::info('Verification URL: ' . $verificationUrl);

// Send a test email using Mail facade
\Illuminate\Support\Facades\Mail::raw(
    "Test verification email with URL: " . $verificationUrl,
    function ($message) use ($user) {
        $message->to($user->email)
            ->subject('Test Verification Email');
    }
);

echo "Test email sent to " . $user->email . "\n";
echo "Check the Laravel log file at storage/logs/laravel.log\n";
