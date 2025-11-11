<?php
header('Content-Type: application/json');
require_once 'config.php';

$fullname = $_POST['fullname'] ?? '';
$email = $_POST['email'] ?? '';
$phone = $_POST['phone'] ?? '';
$username = $_POST['username'] ?? '';
$password = $_POST['password'] ?? '';

try {
    $stmt = $pdo->prepare("SELECT * FROM customers WHERE username = ? OR email = ?");
    $stmt->execute([$username, $email]);
    
    if ($stmt->fetch()) {
        echo json_encode(['success' => false, 'message' => 'Username or email already exists']);
        exit;
    }
    
    $stmt = $pdo->prepare("INSERT INTO customers (fullname, email, phone, username, password) VALUES (?, ?, ?, ?, ?)");
    $stmt->execute([$fullname, $email, $phone, $username, $password]);
    
    echo json_encode(['success' => true]);
} catch(PDOException $e) {
    echo json_encode(['success' => false, 'message' => 'Registration failed']);
}
?>
