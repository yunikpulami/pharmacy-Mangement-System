<?php
header('Content-Type: application/json');
header('Cache-Control: no-cache, must-revalidate');
require_once 'config.php';

try {
    $stmt = $pdo->query("SELECT o.*, c.username as customer_name FROM orders o 
                         JOIN customers c ON o.customer_id = c.id 
                         ORDER BY o.order_date DESC");
    $orders = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode($orders);
} catch(PDOException $e) {
    echo json_encode(['error' => $e->getMessage()]);
}
?>
