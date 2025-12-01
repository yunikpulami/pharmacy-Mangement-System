<?php
header('Content-Type: application/json');
require_once 'config.php';

// Get and sanitize input
$username = trim($_POST['username'] ?? '');
$email = trim($_POST['email'] ?? '');
$phone = trim($_POST['phone'] ?? '');
$address = trim($_POST['address'] ?? '');
$password = $_POST['password'] ?? '';

// Validation
$errors = [];

// Validate username
if (empty($username)) {
    $errors[] = 'Username is required';
} elseif (strlen($username) < 3) {
    $errors[] = 'Username must be at least 3 characters';
} elseif (strlen($username) > 50) {
    $errors[] = 'Username must not exceed 50 characters';
} elseif (!preg_match('/^[a-zA-Z0-9_]+$/', $username)) {
    $errors[] = 'Username can only contain letters, numbers, and underscores';
}

// Validate email
if (empty($email)) {
    $errors[] = 'Email is required';
} elseif (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    $errors[] = 'Invalid email format';
} elseif (strlen($email) > 100) {
    $errors[] = 'Email must not exceed 100 characters';
}

// Validate phone
if (empty($phone)) {
    $errors[] = 'Phone number is required';
} elseif (!preg_match('/^[0-9+\-\s()]+$/', $phone)) {
    $errors[] = 'Invalid phone number format';
} elseif (strlen($phone) < 10 || strlen($phone) > 20) {
    $errors[] = 'Phone number must be between 10 and 20 characters';
}

// Validate address
if (empty($address)) {
    $errors[] = 'Address is required';
} elseif (strlen($address) > 100) {
    $errors[] = 'Address must not exceed 100 characters';
}

// Validate password
if (empty($password)) {
    $errors[] = 'Password is required';
} elseif (strlen($password) < 6) {
    $errors[] = 'Password must be at least 6 characters';
} elseif (strlen($password) > 255) {
    $errors[] = 'Password must not exceed 255 characters';
}

// Return validation errors
if (!empty($errors)) {
    echo json_encode([
        'success' => false,
        'message' => implode(', ', $errors)
    ]);
    exit;
}

// Proceed with registration
try {
    // Check if username or email already exists
    $stmt = $pdo->prepare("SELECT * FROM customers WHERE username = ? OR email = ?");
    $stmt->execute([$username, $email]);
    
    if ($stmt->fetch()) {
        echo json_encode(['success' => false, 'message' => 'Username or email already exists']);
        exit;
    }
    
    // Insert new customer
    $stmt = $pdo->prepare("INSERT INTO customers (username, email, phone, address, password) VALUES (?, ?, ?, ?, ?)");
    $stmt->execute([$username, $email, $phone, $address, $password]);
    
    echo json_encode([
        'success' => true,
        'message' => 'Registration successful'
    ]);
} catch(PDOException $e) {
    echo json_encode([
        'success' => false,
        'message' => 'Database error: ' . $e->getMessage()
    ]);
}
?>
