<?php
header('Content-Type: application/json');
require_once 'config.php';

// Get and sanitize input
$username = trim($_POST['username'] ?? '');
$password = $_POST['password'] ?? '';
$role = $_POST['role'] ?? '';

// Validation
$errors = [];

// Validate username/email
if (empty($username)) {
    $errors[] = 'Username/Email is required';
} elseif (strlen($username) < 3) {
    $errors[] = 'Username/Email must be at least 3 characters';
} elseif (strlen($username) > 100) {
    $errors[] = 'Username/Email must not exceed 100 characters';
}

// Validate password
if (empty($password)) {
    $errors[] = 'Password is required';
} elseif (strlen($password) < 6) {
    $errors[] = 'Password must be at least 6 characters';
}

// Validate role
if (empty($role)) {
    $errors[] = 'Role is required';
} elseif (!in_array($role, ['admin', 'customer'])) {
    $errors[] = 'Invalid role selected';
}

// Return validation errors
if (!empty($errors)) {
    echo json_encode([
        'success' => false,
        'message' => implode(', ', $errors)
    ]);
    exit;
}

// Proceed with login
try {
    if ($role === 'admin') {
        $stmt = $pdo->prepare("SELECT * FROM admins WHERE username = ? AND password = ?");
        $stmt->execute([$username, $password]);
        $user = $stmt->fetch(PDO::FETCH_ASSOC);
        
        if ($user) {
            echo json_encode([
                'success' => true,
                'user' => [
                    'id' => $user['id'],
                    'username' => $user['username'],
                    'role' => 'admin'
                ]
            ]);
        } else {
            echo json_encode(['success' => false, 'message' => 'Invalid credentials']);
        }
    } else {
        $stmt = $pdo->prepare("SELECT * FROM customers WHERE username = ? AND password = ?");
        $stmt->execute([$username, $password]);
        $user = $stmt->fetch(PDO::FETCH_ASSOC);
        
        if ($user) {
            echo json_encode([
                'success' => true,
                'user' => [
                    'id' => $user['id'],
                    'username' => $user['username'],
                    'email' => $user['email'],
                    'address' => $user['address'],
                    'role' => 'customer'
                ]
            ]);
        } else {
            echo json_encode(['success' => false, 'message' => 'Invalid credentials']);
        }
    }
} catch(PDOException $e) {
    echo json_encode([
        'success' => false,
        'message' => 'Login failed. Please try again later.'
    ]);
}
?>
