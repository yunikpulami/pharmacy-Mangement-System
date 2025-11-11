<?php
header('Content-Type: application/json');
require_once 'config.php';

$customer_id = $_GET['customer_id'] ?? 0;

try {
    $stmt = $pdo->prepare("SELECT * FROM orders WHERE customer_id = ? ORDER BY order_date DESC");
    $stmt->execute([$customer_id]);
    $orders = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode($orders);
} catch(PDOException $e) {
    echo json_encode([]);
}
?>
