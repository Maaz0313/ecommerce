<?php

require __DIR__ . '/vendor/autoload.php';

$app = require_once __DIR__ . '/bootstrap/app.php';

$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

// Get the first user
$user = \App\Models\User::first();

if (!$user) {
    echo "No users found in the database.\n";
    exit(1);
}

echo "User information:\n";
echo "ID: " . $user->id . "\n";
echo "Email: " . $user->email . "\n";
echo "Email verified: " . ($user->hasVerifiedEmail() ? 'Yes' : 'No') . "\n\n";

// Generate the verification URL
$verificationUrl = \Illuminate\Support\Facades\URL::temporarySignedRoute(
    'verification.verify',
    Carbon\Carbon::now()->addMinutes(60),
    [
        'id' => $user->getKey(),
        'hash' => sha1($user->getEmailForVerification()),
    ]
);

echo "Verification URL:\n";
echo $verificationUrl . "\n\n";

echo "You can copy and paste this URL into your browser to verify the email.\n";
