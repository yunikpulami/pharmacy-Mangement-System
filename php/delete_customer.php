<?php
header('Content-Type: application/json');
require_once 'config.php';

$id = $_POST['id'] ?? 0;

try {
    $stmt = $pdo->prepare("DELETE FROM customers WHERE id = ?");
    $stmt->execute([$id]);
    echo json_encode(['success' => true]);
} catch(PDOException $e) {
    echo json_encode(['success' => false, 'message' => 'Delete failed']);
}
?>
